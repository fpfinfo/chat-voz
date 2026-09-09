# 📚 Como Usar a Base de Conhecimento (RAG)

## Visão Geral

O sistema RAG (Retrieval-Augmented Generation) permite que o chatbot Aura responda perguntas com base em documentos que você armazenar na pasta `knowledge/`.

## Estrutura de Arquivos

```
/workspace
├── index.html              # Chat principal
├── lib/
│   └── rag-system.js       # Sistema RAG (client-side)
└── knowledge/
    ├── README.md           # Este arquivo
    ├── faq.json            # Perguntas frequentes
    └── sobre.md            # Informações da empresa
```

## Como Adicionar Conhecimento

### 1. FAQ (formato JSON)

Edite o arquivo `knowledge/faq.json`:

```json
{
  "perguntas": [
    {
      "pergunta": "Sua pergunta aqui?",
      "resposta": "Sua resposta aqui."
    }
  ]
}
```

### 2. Documentos de Texto (Markdown ou TXT)

Crie arquivos como `knowledge/produtos.md` ou `knowledge/servicos.txt`:

```markdown
# Nossos Produtos

## Produto A
Descrição do produto A...

## Produto B
Descrição do produto B...
```

### 3. Atualizar o Sistema RAG

Edite `lib/rag-system.js` para incluir novos arquivos:

```javascript
const docsToLoad = [
  'knowledge/sobre.md',
  'knowledge/produtos.md',  // Adicione novos arquivos aqui
  'knowledge/servicos.txt'
];
```

## Como Funciona

1. **Carregamento**: Ao iniciar, o sistema lê todos os arquivos da pasta `knowledge/`
2. **Busca**: Quando o usuário faz uma pergunta, o sistema busca por palavras-chave
3. **Resposta**: Se encontrar correspondência, retorna a resposta baseada no contexto
4. **Fallback**: Se não encontrar, usa respostas padrão pré-definidas

## Testando

1. Faça deploy na Vercel/GitHub Pages
2. Abra o chat no navegador
3. Faça perguntas relacionadas ao conteúdo dos arquivos:
   - "Qual o horário de atendimento?"
   - "Me conte sobre a empresa"
   - "Quais formas de pagamento?"

## Dicas para Melhores Resultados

- Use palavras-chave claras nas perguntas do FAQ
- Mantenha os documentos bem estruturados com títulos e parágrafos
- Evite textos muito longos em um único parágrafo
- Revise as perguntas para cobrir variações comuns

## Próximos Passos (Melhorias Futuras)

- [ ] Implementar busca semântica com embeddings
- [ ] Adicionar suporte a mais formatos (PDF, DOCX)
- [ ] Criar interface para upload de arquivos
- [ ] Integrar com API de IA (OpenAI, Google Gemini)
- [ ] Adicionar cache para melhor performance
