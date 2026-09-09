# 🎙️ Aura - Chat de Voz com IA e Base de Conhecimento

Um chatbot moderno com avatar animado feminino que responde por voz e texto, utilizando um sistema RAG (Retrieval-Augmented Generation) para basear suas respostas em documentos personalizados.

## ✨ Funcionalidades

- **🎤 Reconhecimento de Voz**: Fale com o chat e ele entende sua pergunta
- **🔊 Respostas em Áudio**: Ouve as respostas do chat em português
- **👩 Avatar Animado "Aura"**: Personagem feminina com expressões faciais
  - Pisca os olhos automaticamente
  - Move a boca quando fala
  - Reage quando ouve você
  - Inclina a cabeça quando está pensando
- **📚 Base de Conhecimento (RAG)**: Responde com base em arquivos que você configura
- **💬 Interface Moderna**: Design inspirado no ChatGPT/Gemini
- **📱 Responsivo**: Funciona em desktop e mobile

## 📁 Estrutura do Projeto

```
/workspace
├── index.html              # Aplicação principal do chat
├── api/
│   └── rag-system.js       # Sistema RAG para busca em documentos
├── knowledge/
│   ├── README.md           # Guia da base de conhecimento
│   ├── COMO_USAR.md        # Instruções detalhadas
│   ├── faq.json            # Perguntas frequentes (editável)
│   └── sobre.md            # Informações da empresa (editável)
└── vercel.json             # Configuração para deploy na Vercel
```

## 🚀 Como Usar

### Localmente

1. Abra o arquivo `index.html` no seu navegador (Chrome ou Edge recomendados)
2. Permita o acesso ao microfone quando solicitado
3. Clique no botão do microfone 🎤 e faça sua pergunta
4. Ou digite sua pergunta no campo de texto

### Com Base de Conhecimento

O chat responde perguntas baseadas nos arquivos da pasta `knowledge/`:

**Exemplos de perguntas que funcionam:**
- "Qual o horário de atendimento?"
- "Quais formas de pagamento vocês aceitam?"
- "Me conte sobre a empresa"
- "Vocês fazem entregas?"

**Para adicionar mais conhecimento:**

1. Edite `knowledge/faq.json` para adicionar novas perguntas e respostas
2. Crie novos arquivos `.md` ou `.txt` na pasta `knowledge/`
3. Atualize `api/rag-system.js` para incluir os novos arquivos

Veja `knowledge/COMO_USAR.md` para instruções detalhadas.

## 🌐 Deploy na Vercel

1. Faça push deste repositório para o GitHub
2. Conecte seu repositório na Vercel
3. A Vercel fará o deploy automaticamente

⚠️ **Importante**: O arquivo `vercel.json` já está configurado para lidar com rotas SPA.

## 🔧 Personalização

### Mudar o Avatar

Edite o SVG na seção `.avatar` do `index.html`

### Mudar Cores

Altere os gradientes CSS no `<style>` do `index.html`

### Adicionar Mais Vozes

O sistema usa a Web Speech API do navegador. Para mais vozes, instale pacotes de idioma no seu sistema operacional.

### Integrar com IA Real

Substitua a função `generateResponse()` no `index.html` por uma chamada à API da OpenAI, Google Gemini, etc.

## 🛠️ Tecnologias

- **HTML5/CSS3**: Interface moderna com animações
- **JavaScript Vanilla**: Sem dependências externas
- **Web Speech API**: Reconhecimento e síntese de voz
- **Sistema RAG Customizado**: Busca por palavras-chave em documentos

## 📝 Próximas Melhorias

- [ ] Busca semântica com embeddings
- [ ] Suporte a PDF e DOCX
- [ ] Upload de arquivos via interface
- [ ] Integração com APIs de IA
- [ ] Histórico de conversas persistente
- [ ] Múltiplos avatares personalizáveis

## 📄 Licença

MIT - Use livremente!

---

**Desenvolvido com ❤️ para criar assistentes virtuais mais humanos**
