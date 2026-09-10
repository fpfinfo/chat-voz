# 🎙️ IARA - Inteligência de Alocação de Recursos e Apoio

Um assistente virtual moderno com avatar animado feminino ("Aura") que responde por voz e texto, com capacidade de análise de documentos e sistema RAG (Retrieval-Augmented Generation) para basear suas respostas em conteúdos personalizados.

## ✨ Funcionalidades Principais

### 🎤 Interação por Voz Completa
- **Reconhecimento de Fala (Speech-to-Text)**: Fale naturalmente com a IARA
- **Síntese de Voz (Text-to-Speech)**: Receba respostas faladas em português do Brasil
- **Transcrição em Tempo Real**: Veja o texto sendo gerado enquanto você fala
- **Detecção Automática**: Envio automático após detectar fim da fala

### 👩💼 Avatar Animado "Aura" com Sincronia Labial
- **Movimento Labial Realista**: A boca se move durante a fala
- **Expressões Faciais**: Piscar automático e reações naturais
- **Estados Visuais Dinâmicos**:
  - 🟢 **Pronta** (verde) - Estado idle
  - 🔴 **Ouvindo** (vermelho + pulsação) - Captando áudio
  - 🟡 **Pensando** (âmbar + inclinação da cabeça) - Processando
  - 🔵 **Falando** (azul + sincronia labial) - Respondendo

### 📁 Análise de Documentos (RAG Local) - Opção B Implementada
- **Upload de Arquivos**: Carregue `.txt`, `.md` ou `.pdf` via interface
- **Contexto em Tempo Real**: Conteúdo armazenado na sessão atual
- **Busca por Palavras-Chave**: Respostas baseadas nos documentos enviados
- **Feedback Visual**: Toast notifications de confirmação

### 💬 Chat Inteligente com Histórico - Opção A Implementada
- **Histórico Persistente**: Conversas salvas no localStorage
- **Sugestões Interativas**: Chips de perguntas frequentes
- **Indicador de Digitação**: Animação de "pensando"
- **Limpar Conversa**: Botão dedicado para resetar

### 🎨 Interface Moderna e Responsiva
- **Design Premium**: Gradientes roxo/azul inspirados no Gemini
- **Mobile-First**: Funciona perfeitamente em qualquer dispositivo
- **Animações Fluidas**: Transições suaves em todos os elementos
- **Acessibilidade**: Contraste WCAG e indicadores visuais claros

## 📁 Estrutura do Projeto

```
/workspace
├── index.html              # Aplicação completa (HTML + CSS + JS)
├── README.md               # Esta documentação
├── rag_estruturado.json    # Base de conhecimento do TJPA (Provimento 2/2026, portarias, resoluções, FAQ)
├── catalogo.json           # Catálogo dos documentos da base
└── lib/
    └── rag-system.js       # Módulo RAG (client-side) — lê rag_estruturado.json
```

O `index.html` carrega `lib/rag-system.js` e responde consultando `rag_estruturado.json`
por palavras-chave (com casamento de radical e busca por artigo). Se nada for encontrado,
recorre a respostas locais para saudações e perguntas triviais.

## 🚀 Como Usar

### Uso Imediato (Sem Instalação)

1. **Abra o `index.html`** no Chrome ou Edge
2. **Permita o microfone** quando solicitado
3. **Interaja**:
   - Clique no 🎤 e fale
   - Ou digite no campo de texto
   - Ou clique nos chips de sugestão
   - Ou carregue arquivos pelo ícone 📎

### Casos de Uso com Documentos

**Exemplo de fluxo:**
1. Clique no ícone de clipe 📎
2. Selecione um arquivo `manual.txt` ou `documento.md`
3. Pergunte: "O que diz sobre [tópico]?"
4. A IARA buscará trechos relevantes do arquivo

**Perguntas que funcionam:**
- "O que diz o artigo 1 do provimento?"
- "Como uma entidade social solicita acesso aos recursos?"
- "Quais os percentuais de destinação dos recursos?"
- "Prazo para prestação de contas"

### Observação sobre este repositório

Este é o **protótipo standalone** da IARA — abre direto do `index.html`, com o
RAG rodando no navegador a partir de `rag_estruturado.json`. O atendimento
virtual **em produção** roda no n8n do TJPA (workflow `chat-IARA`, página e
backend servidos por `https://n8n.tjpa.jus.br/webhook/chat-iara`); ver o
repositório `CONSELHO_GESTOR`.

## 🔧 Personalização Avançada

### Mudar o Nome e Identidade

Edite no `index.html`:
```javascript
// Mensagem de boas-vindas
addMessage('iara', 'Olá! Sou a IARA...');

// Título
<h1>IARA</h1>
```

### Adicionar Mais Conhecimento

A base fica em `rag_estruturado.json`, no formato:

```json
{
  "documentos": [
    {
      "doc_id": "novo-doc",
      "titulo": "Título do documento",
      "tipo": "norma",
      "situacao": "vigente",
      "conteudo": [
        { "artigo": "1", "paragrafos": [], "ordem": 100, "texto": "Art. 1º ..." }
      ]
    }
  ]
}
```

Acrescente novos objetos em `documentos[]` (ou novos blocos em `conteudo[]`). O
`lib/rag-system.js` já achata e indexa tudo automaticamente — não precisa alterar código.

### Integrar com IA Generativa

Substitua a função `generateResponse()` por uma chamada à API:

```javascript
async function generateResponse(input) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer SUA_KEY' },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: input }]
    })
  });
  const data = await response.json();
  return data.choices[0].message.content;
}
```

### Customizar o Avatar

Edite o SVG inline no HTML ou substitua por uma imagem:
```css
.avatar-svg {
  /* Modifique cores, tamanhos, etc. */
}
```

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Finalidade |
|------------|------------|
| HTML5/CSS3 | Estrutura e estilização |
| JavaScript Vanilla | Lógica sem dependências |
| Web Speech API | Voz (reconhecimento + síntese) |
| FileReader API | Leitura de arquivos locais |
| localStorage | Persistência de histórico |
| SVG Inline | Avatar vetorial animado |

## ⚠️ Limitações e Notas

1. **PDF**: Extração de texto requer PDF.js. Atualmente PDFs são "anexados" mas não têm leitura completa sem bibliotecas externas.

2. **Navegadores**: Melhor suporte no Chrome/Edge. Firefox pode ter limitações na Web Speech API.

3. **Contexto**: Documentos são mantidos apenas na sessão (somem ao fechar aba).

4. **RAG Simples**: Busca por palavras-chave. Para busca semântica, use embeddings.

## 🔮 Roadmap de Melhorias

- [ ] Integração OpenAI/Gemini para IA real
- [ ] PDF.js para leitura completa de PDFs
- [ ] Modo escuro/claro automático
- [ ] Exportar conversas (PDF/TXT)
- [ ] Multi-idiomas (i18n)
- [ ] Upload drag-and-drop
- [ ] Analytics de uso
- [ ] PWA (instalar como app)

## 📄 Licença

MIT License - Use livremente para projetos pessoais e comerciais!

## 🤝 Contribuição

Contribuições são bem-vindas! Sugestões:
- Reportar bugs
- Melhorias de UX/UI
- Novas funcionalidades
- Traduções

---

**Desenvolvido com ❤️ para democratizar assistentes virtuais inteligentes.**

*IARA - Inteligência de Alocação de Recursos e Apoio*
