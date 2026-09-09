// Sistema RAG (Retrieval-Augmented Generation) para o Chat IARA
// Este módulo carrega e busca informações na base de conhecimento

class KnowledgeBase {
  constructor() {
    this.documents = [];
    this.faqs = [];
    this.loaded = false;
  }

  // Carrega todos os arquivos de conhecimento
  async loadKnowledge() {
    try {
      // Carrega FAQ em JSON
      const faqResponse = await fetch('knowledge/faq.json');
      if (faqResponse.ok) {
        const faqData = await faqResponse.json();
        this.faqs = faqData.perguntas || [];
        console.log(`✅ ${this.faqs.length} FAQs carregados`);
      }

      // Carrega documentos Markdown e TXT
      const docsToLoad = ['knowledge/sobre.md'];
      
      for (const docPath of docsToLoad) {
        try {
          const response = await fetch(docPath);
          if (response.ok) {
            const text = await response.text();
            this.documents.push({
              path: docPath,
              content: text,
              type: docPath.endsWith('.md') ? 'markdown' : 'text'
            });
            console.log(`✅ Documento carregado: ${docPath}`);
          }
        } catch (err) {
          console.warn(`⚠️ Não foi possível carregar ${docPath}:`, err);
        }
      }

      this.loaded = true;
      console.log('📚 Base de conhecimento carregada com sucesso!');
      return true;
    } catch (error) {
      console.error('❌ Erro ao carregar base de conhecimento:', error);
      return false;
    }
  }

  // Busca por palavras-chave no conteúdo
  searchKeywords(query) {
    const results = [];
    const queryLower = query.toLowerCase();
    const words = queryLower.split(/\s+/).filter(w => w.length > 2);

    // Busca em FAQs
    for (const faq of this.faqs) {
      const perguntaLower = faq.pergunta.toLowerCase();
      const respostaLower = faq.resposta.toLowerCase();
      
      let score = 0;
      for (const word of words) {
        if (perguntaLower.includes(word)) score += 2;
        if (respostaLower.includes(word)) score += 1;
      }

      if (score > 0) {
        results.push({
          type: 'faq',
          question: faq.pergunta,
          answer: faq.resposta,
          score: score
        });
      }
    }

    // Busca em documentos
    for (const doc of this.documents) {
      const contentLower = doc.content.toLowerCase();
      let score = 0;
      let context = '';

      // Divide o documento em parágrafos/seções
      const paragraphs = doc.content.split(/\n\n+/);
      
      for (const paragraph of paragraphs) {
        const paraLower = paragraph.toLowerCase();
        let paraScore = 0;
        
        for (const word of words) {
          if (paraLower.includes(word)) {
            paraScore += 1;
          }
        }

        if (paraScore > 0) {
          score += paraScore;
          context += paragraph + '\n\n';
        }
      }

      if (score > 0) {
        results.push({
          type: 'document',
          source: doc.path,
          content: context.trim(),
          score: score
        });
      }
    }

    // Ordena por relevância (score)
    results.sort((a, b) => b.score - a.score);
    
    return results.slice(0, 5); // Retorna top 5 resultados
  }

  // Gera resposta baseada no contexto encontrado
  generateResponse(query, contextResults) {
    if (!contextResults || contextResults.length === 0) {
      return null; // Sem contexto encontrado
    }

    // Constrói resposta baseada nos resultados
    let response = '';
    
    if (contextResults[0].type === 'faq') {
      // Resposta direta do FAQ
      response = contextResults[0].answer;
    } else {
      // Resposta baseada em documento
      const topResult = contextResults[0];
      const preview = topResult.content.substring(0, 300);
      response = `Com base nas nossas informações: ${preview}${topResult.content.length > 300 ? '...' : ''}`;
    }

    return response;
  }

  // Método principal: busca e gera resposta
  async query(query) {
    if (!this.loaded) {
      await this.loadKnowledge();
    }

    const results = this.searchKeywords(query);
    const response = this.generateResponse(query, results);

    return {
      found: response !== null,
      response: response,
      context: results,
      sources: results.map(r => r.type === 'faq' ? 'FAQ' : r.source)
    };
  }
}

// Instância global da base de conhecimento
const knowledgeBase = new KnowledgeBase();

// Exporta para uso no chat principal
window.KnowledgeBase = knowledgeBase;
