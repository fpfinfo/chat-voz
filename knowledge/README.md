# Base de Conhecimento da Aura

Este é o repositório de memória para o chatbot Aura. 
Os arquivos nesta pasta serão usados pelo sistema RAG (Retrieval-Augmented Generation) 
para responder perguntas com base no conteúdo aqui armazenado.

## Como funciona:

1. **Adicione arquivos** nesta pasta (`.txt`, `.md`, `.json`)
2. O sistema irá **ler e indexar** o conteúdo
3. Quando o usuário fizer uma pergunta, o sistema **busca trechos relevantes**
4. A resposta é gerada com base no contexto encontrado

## Exemplos de arquivos que você pode criar:

- `empresa.txt` - Informações sobre sua empresa
- `produtos.md` - Catálogo de produtos/serviços
- `faq.json` - Perguntas frequentes e respostas
- `sobre.txt` - Informações pessoais ou biografia
- `regras.txt` - Regras e políticas

## Formato sugerido para FAQ (JSON):

```json
{
  "perguntas": [
    {
      "pergunta": "Qual o horário de atendimento?",
      "resposta": "Atendemos de segunda a sexta, das 9h às 18h."
    },
    {
      "pergunta": "Quais formas de pagamento vocês aceitam?",
      "resposta": "Aceitamos cartão de crédito, débito, PIX e boleto."
    }
  ]
}
```

## Próximos passos:

1. Crie arquivos com seu conhecimento nesta pasta
2. Atualize o código do chat para ler estes arquivos
3. Implemente a busca semântica ou por palavras-chave
4. Integre com a API de IA para gerar respostas contextualizadas
