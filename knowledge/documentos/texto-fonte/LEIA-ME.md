# Texto-fonte dos documentos

Esta pasta guarda o **texto** dos documentos institucionais — não os PDFs.

É a fonte da verdade da ingestão. Quando um PDF é digitalizado e não permite extração
confiável, o texto correspondente entra aqui, já revisado, e passa a ser o que o agente
lê. Versionado no git, de modo que qualquer correção fica registrada com autor e data.

## Como colocar um documento aqui

**Caso 1 — o ato existe em HTML no portal de atos normativos**

É o caminho preferido: o texto é nativo, sem erro de reconhecimento.

1. Abra o ato em <https://apps.tjpa.jus.br/atosnormativos/> (exige login na rede do TJPA)
2. Salve a página: `Ctrl+S` → **Página da Web, somente HTML**
3. Grave nesta pasta com o nome do ato, por exemplo:
   `provimento-conjunto-002-2026.html`

Alternativa igualmente válida: selecionar o texto do ato, copiar e colar num arquivo
`.md` com o mesmo nome. O que importa é o texto chegar íntegro.

**Caso 2 — só existe digitalização**

1. Rodar OCR sobre o PDF
2. **Revisar o resultado**, conferindo especialmente número de artigo, percentual,
   prazo e valor
3. Gravar como `.md` nesta pasta

A revisão não é formalidade. O texto que veio da edição digitalizada do Diário já
apresentou erros de reconhecimento na própria ementa do Provimento 002/2026 —
`priorização` saiu como `pnonzação`, `aplicação` como `apHcação`. Erro equivalente
num número de artigo produz resposta incorreta com aparência de citação exata.

## Nomenclatura

Minúsculas, sem acento, separado por hífen, identificando tipo, número e ano:

```
provimento-conjunto-002-2026.html
portaria-3189-2026.md
resolucao-cnj-558-2024.md
```

## Situação atual

| Documento | Precisa entrar aqui? | Motivo |
|---|---|---|
| Provimento Conjunto nº 002/2026-GP/CGJ | **Sim** | 17 de 18 páginas do PDF sem texto |
| Docs Anexos (merged) | A avaliar | 23 de 41 páginas sem texto; conteúdo pode estar duplicado nos demais |
| Demais 8 documentos | Não | Extração nativa confiável direto do PDF |
