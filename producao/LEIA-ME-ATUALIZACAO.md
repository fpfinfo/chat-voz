# IARA — Atualização da página de produção (avatar + voz neural)

Esta pasta contém a versão atualizada da página do atendimento virtual **IARA**
(Conselho Gestor Centralizado — TJPA), pronta para ser aplicada no **n8n do TJPA**
(`n8n.tjpa.jus.br`), que serve `https://chat-iara.tjpa.jus.br/`.

---

## 📦 Arquivo

| Arquivo | O que é |
|---|---|
| `iara_PRODUCAO_ATUALIZADA.html` | Página completa (HTML + CSS + JS) — **é o conteúdo que vai no n8n** |
| `iara-avatar.jpg` | Arte do avatar (já embutida em base64 no HTML, para referência) |

> ⚠️ A imagem já está **embutida em base64** no HTML. Não é preciso hospedar arquivo externo
> (importante porque o n8n serve a página com CSP `sandbox`).

---

## ✅ PARTE 1 — Atualizar a página (obrigatório)

1. Abrir `n8n.tjpa.jus.br` → workflow do atendimento da IARA.
2. Localizar o **nó que devolve o HTML** da página (o nó de resposta do webhook `/webhook/chat-iara`).
3. **Substituir todo o conteúdo** desse nó pelo conteúdo de `iara_PRODUCAO_ATUALIZADA.html`.
4. Salvar o workflow e recarregar `https://chat-iara.tjpa.jus.br/` com **Ctrl+F5**.

**O que muda visualmente:**

- Avatar ilustrado semi-realista (circular, com anel teal), com **estados por cor**:
  verde/teal = pronta · vermelho = ouvindo · âmbar = pensando · azul = falando.
- Botão **⚙️** no cabeçalho do chat com **sliders de Velocidade e Tom** da voz.
- Fala mais natural: valores (`R$ 5.000,00` → "5 mil reais"), datas, ordinais
  (`art. 5º` → "artigo quinto") e mais siglas (TJPA, PJe, CNPJ, CPF…).
- Correção de bug: a saudação inicial **não aparece mais duplicada**.

---

## 🎙️ PARTE 2 — Voz neural (Gemini TTS) — opcional, recomendado

A voz padrão do navegador (Web Speech API) é robótica no Chrome/Windows.
O HTML **já está pronto** para tocar um áudio devolvido pelo backend: se a resposta
do webhook incluir o campo `audio` (base64), ele é tocado; **se não incluir, o site
usa a voz do navegador automaticamente (fallback)** — ou seja, nada quebra se esta
parte não for feita.

### 2.1 Credencial

Criar no n8n uma credencial (ou variável de ambiente) com a chave do Google AI Studio:
`GEMINI_API_KEY`. **A chave não pode ir para o HTML** (ficaria exposta no navegador) — por
isso o áudio é gerado no n8n.

### 2.2 Nó HTTP Request (gerar o áudio)

Inserir **depois** do nó que produz o texto da resposta e **antes** do nó
"Respond to Webhook":

| Campo | Valor |
|---|---|
| Method | `POST` |
| URL | `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent` |
| Header | `x-goog-api-key: {{GEMINI_API_KEY}}` |
| Header | `Content-Type: application/json` |

**Body (JSON):**

```json
{
  "contents": [{ "parts": [{ "text": "{{ $json.resposta }}" }] }],
  "generationConfig": {
    "responseModalities": ["AUDIO"],
    "speechConfig": {
      "voiceConfig": { "prebuiltVoiceConfig": { "voiceName": "Kore" } }
    }
  }
}
```

> Vozes femininas recomendadas: **Kore** (padrão), **Aoede**, **Leda**.
> Se o texto tiver markdown/símbolos, rode antes a mesma limpeza que o site faz
> (opcional — o Gemini lê bem textos simples).

### 2.3 Nó Code (montar a resposta final)

Após o HTTP Request, um nó **Code** que devolve o JSON esperado pelo site:

```js
// Ajuste 'Resposta' para o nome do nó que gera o texto da IARA
const base = $('Resposta').item.json;

const tts = $json;
const parte = tts?.candidates?.[0]?.content?.parts?.[0]?.inlineData
           || tts?.candidates?.[0]?.content?.parts?.[0]?.inline_data;

let audio = null;
let audioRate = 24000;
if (parte?.data) {
  audio = parte.data;                       // base64 do PCM L16
  const m = /rate=(\d+)/.exec(parte.mimeType || '');
  if (m) audioRate = parseInt(m[1], 10);
}

return [{
  json: {
    resposta: base.resposta,
    fontes: base.fontes || [],
    desfecho: base.desfecho || null,
    audio,          // se null, o site usa a voz do navegador
    audioRate
  }
}];
```

Ligar a saída desse nó ao **Respond to Webhook**.

### 2.4 Formato esperado pelo site

```json
{
  "resposta": "texto da resposta",
  "fontes": [ ... ],
  "desfecho": "ok",
  "audio": "<base64 do PCM>",
  "audioRate": 24000
}
```

O site converte o PCM (L16, 24 kHz, mono) em **WAV** e reproduz — não é preciso
converter no n8n. Validado: blob gerado com cabeçalho RIFF/WAVE correto.

---

## 📝 Histórico desta versão

- **Avatar**: arte ilustrada semi-realista aprovada (cabelo castanho ondulado, olhos
  grandes, blazer teal + blusa branca), exibida em círculo com anel de estado.
- **Estados**: anel muda de cor conforme o estado (pronta/ouvindo/pensando/falando).
- **Voz**: normalização de fala ampliada, ranking de vozes neurais, sliders de
  velocidade/tom (⚙️) e suporte a áudio neural vindo do backend.
- **Bugfix**: saudação inicial duplicada.

---

*Gerado em 10/09/2026.*
