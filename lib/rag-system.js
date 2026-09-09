// Sistema RAG (Retrieval-Augmented Generation) para o Chat IARA
// Carrega a base estruturada do TJPA (rag_estruturado.json) e faz busca
// por palavras-chave nos artigos/parágrafos dos documentos.
//
// Base: Provimento Conjunto nº 2/2026-GP/CGJ, anexos, portarias, resoluções
// do CNJ e FAQ oficial do Conselho Gestor Centralizado de Recursos de
// Valores de Penas de Prestação Pecuniária.

class KnowledgeBase {
  constructor(options = {}) {
    // Caminho relativo à raiz do site (funciona local e na Vercel).
    this.source = options.source || 'rag_estruturado.json';
    this.chunks = [];      // blocos achatados e prontos para busca
    this.meta = null;      // { total_artigos, total_chunks, total_documentos }
    this.loaded = false;
    this._loadingPromise = null;
  }

  // ---------------------------------------------------------------------------
  // Carregamento
  // ---------------------------------------------------------------------------

  async loadKnowledge() {
    // Garante que o fetch aconteça só uma vez, mesmo com chamadas concorrentes.
    if (this.loaded) return true;
    if (this._loadingPromise) return this._loadingPromise;

    this._loadingPromise = (async () => {
      try {
        const res = await fetch(this.source);
        if (!res.ok) throw new Error(`HTTP ${res.status} ao buscar ${this.source}`);
        const data = await res.json();

        const docs = Array.isArray(data.documentos) ? data.documentos : [];
        this.chunks = [];

        for (const doc of docs) {
          const blocos = Array.isArray(doc.conteudo) ? doc.conteudo : [];
          for (const bloco of blocos) {
            const texto = (bloco.texto || '').trim();
            if (!texto) continue;
            this.chunks.push({
              docId: doc.doc_id,
              titulo: doc.titulo || doc.doc_id,
              tipo: doc.tipo || '',
              orgao: doc.orgao || '',
              data: doc.data || '',
              situacao: doc.situacao || '',
              publico: doc.publico || '',
              artigo: bloco.artigo || '',
              paragrafos: Array.isArray(bloco.paragrafos) ? bloco.paragrafos : [],
              ordem: typeof bloco.ordem === 'number' ? bloco.ordem : 0,
              texto,
              _words: KnowledgeBase.wordSet(texto),
              _tituloWords: KnowledgeBase.wordSet(doc.titulo || '')
            });
          }
        }

        this.meta = {
          total_documentos: docs.length,
          total_artigos: data.total_artigos ?? null,
          total_chunks: data.total_chunks ?? this.chunks.length
        };
        this.loaded = true;
        console.log(
          `📚 Base RAG carregada: ${docs.length} documentos, ${this.chunks.length} blocos`
        );
        return true;
      } catch (error) {
        console.error('❌ Erro ao carregar base de conhecimento:', error);
        this._loadingPromise = null; // permite nova tentativa
        return false;
      }
    })();

    return this._loadingPromise;
  }

  // ---------------------------------------------------------------------------
  // Normalização de texto (minúsculas + remoção de acentos)
  // ---------------------------------------------------------------------------

  static normalize(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '') // acentos combinantes
      .replace(/\s+/g, ' ')
      .trim();
  }

  static STOPWORDS = new Set([
    'que', 'com', 'para', 'por', 'dos', 'das', 'uma', 'uns', 'umas', 'não',
    'nao', 'sim', 'como', 'qual', 'quais', 'onde', 'quando', 'quem', 'sobre',
    'este', 'esta', 'esse', 'essa', 'isso', 'aos', 'nas', 'nos', 'pelo',
    'pela', 'seu', 'sua', 'são', 'sao', 'ser', 'tem', 'ter', 'foi', 'era',
    'mais', 'menos', 'até', 'ate', 'the', 'and', 'iara', 'você', 'voce',
    'me', 'diga', 'fale', 'gostaria', 'saber', 'poderia', 'pode', 'quero',
    'sera', 'entao', 'aqui', 'esta', 'estao', 'pelos', 'pelas', 'num', 'numa'
  ]);

  // Nº de caracteres iniciais usados como "radical" para casar plural/flexão
  // (ex.: "recurso" ~ "recursos", "prestacao" ~ "prestacoes").
  static STEM_LEN = 5;

  // Conjunto de palavras normalizadas de um texto (sem stopwords, len > 2).
  static wordSet(str) {
    const out = new Set();
    for (const w of KnowledgeBase.normalize(str).split(/[^a-z0-9]+/)) {
      if (w.length > 2 && !KnowledgeBase.STOPWORDS.has(w)) out.add(w);
    }
    return out;
  }

  tokenize(query) {
    return [...KnowledgeBase.wordSet(query)];
  }

  // Detecta referência explícita a artigo: "art 5", "artigo 12", "art. 28-a"
  extractArticleRef(query) {
    const m = KnowledgeBase.normalize(query).match(/\bart(?:igo|\.)?\s*(\d+[a-z-]*)/);
    return m ? m[1].replace(/-$/, '') : null;
  }

  // ---------------------------------------------------------------------------
  // Busca
  // ---------------------------------------------------------------------------

  // Casa uma palavra do documento contra um termo da pergunta:
  // 2 = igual · 1 = mesmo radical (STEM_LEN chars) · 0 = não casa.
  static wordMatch(word, term) {
    if (word === term) return 2;
    if (term.length >= KnowledgeBase.STEM_LEN && word.length >= KnowledgeBase.STEM_LEN &&
        word.slice(0, KnowledgeBase.STEM_LEN) === term.slice(0, KnowledgeBase.STEM_LEN)) {
      return 1;
    }
    return 0;
  }

  // Pontuação mínima do melhor bloco para considerar que "achou" resposta.
  static MIN_SCORE = 3;

  searchKeywords(query) {
    const terms = this.tokenize(query);
    const artRef = this.extractArticleRef(query);
    if (terms.length === 0 && !artRef) return [];

    const results = [];

    for (const chunk of this.chunks) {
      let score = 0;
      let hits = 0; // termos distintos que casaram no corpo

      for (const term of terms) {
        let best = 0;
        for (const w of chunk._words) {
          const m = KnowledgeBase.wordMatch(w, term);
          if (m > best) best = m;
          if (best === 2) break;
        }
        if (best > 0) { score += best; hits += 1; }
        // termo presente no título do documento
        for (const w of chunk._tituloWords) {
          if (KnowledgeBase.wordMatch(w, term) > 0) { score += 3; break; }
        }
      }

      // exige que a pergunta tenha ao menos 1 termo casado no corpo,
      // e (quando há vários termos) que não seja um único match solto
      if (hits === 0 && !artRef) continue;
      if (terms.length >= 3 && hits < 2 && !artRef) continue;

      // referência explícita a artigo ("art. 5", "artigo 28-a")
      if (artRef && chunk.artigo) {
        const a = KnowledgeBase.normalize(chunk.artigo).replace(/[.\s]/g, '');
        if (a === artRef || a.replace(/-/g, '') === artRef.replace(/-/g, '')) score += 25;
      }

      if (score <= 0) continue;
      // reforços/penalidades leves
      if (chunk.situacao === 'vigente') score += 0.5;
      if (chunk.artigo) score += 0.5;
      if (chunk.ordem === 0 && !chunk.artigo) score -= 1.5; // cabeçalho/letterhead
      results.push({ chunk, score });
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 5);
  }

  // ---------------------------------------------------------------------------
  // Formatação da resposta
  // ---------------------------------------------------------------------------

  // Linhas de timbre/cabeçalho que não agregam à resposta falada.
  static NOISE_LINE = new RegExp(
    '^(\\s*(TJ-?PA.*|PODER JUDICIÁRIO|TRIBUNAL DE JUSTIÇA DO ESTADO DO PARÁ|' +
    'SECRETARIA DE PLANEJAMENTO.*|Página\\s+\\d+\\s+de\\s+\\d+|P\\s?A\\s?R\\s?T\\s?E\\b.*|' +
    'U\\s?S\\s?O\\s+[A-ZÀ-Ú\\s]+·.*|[A-ZÀ-Ú]( [A-ZÀ-Ú])+\\s*)\\s*)$',
    'i'
  );

  cleanText(texto) {
    const linhas = texto.split('\n')
      .filter(l => !KnowledgeBase.NOISE_LINE.test(l));
    // remove ruído só do começo, preserva o resto do bloco
    while (linhas.length && linhas[0].trim() === '') linhas.shift();

    return linhas.join('\n')
      .replace(/^#{1,6}\s+/gm, '')     // headings markdown
      .replace(/\*\*(.*?)\*\*/g, '$1') // negrito
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  snippet(texto, limit = 700) {
    const clean = this.cleanText(texto);
    if (clean.length <= limit) return clean;
    const cut = clean.slice(0, limit);
    const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('.\n'));
    return (lastStop > limit * 0.5 ? cut.slice(0, lastStop + 1) : cut.trim() + '…');
  }

  generateResponse(query, results) {
    if (!results || results.length === 0) return null;
    if (results[0].score < KnowledgeBase.MIN_SCORE) return null;

    const top = results[0].chunk;
    const corpo = this.snippet(top.texto);
    if (!corpo) return null;

    const partes = [top.titulo];
    if (top.artigo) partes.push(`art. ${top.artigo}`);
    const fonte = partes.join(', ');

    return `${corpo}\n\nFonte: ${fonte}.`;
  }

  // ---------------------------------------------------------------------------
  // API principal
  // ---------------------------------------------------------------------------

  async query(query) {
    if (!this.loaded) {
      const ok = await this.loadKnowledge();
      if (!ok) return { found: false, response: null, context: [], sources: [] };
    }

    const results = this.searchKeywords(query);
    const response = this.generateResponse(query, results);

    return {
      found: response !== null,
      response,
      context: results.map(r => ({
        docId: r.chunk.docId,
        titulo: r.chunk.titulo,
        artigo: r.chunk.artigo,
        score: Number(r.score.toFixed(2)),
        trecho: this.snippet(r.chunk.texto, 240)
      })),
      sources: [...new Set(results.map(r => r.chunk.titulo))]
    };
  }
}

// Instância global reutilizável pelas páginas (index.html, voice-chat*.html)
const knowledgeBase = new KnowledgeBase();
window.KnowledgeBase = knowledgeBase;
