# 🚀 Guia de Deploy - IARA Chat de Voz

Este guia orienta o processo de deploy da aplicação **IARA (Inteligência de Alocação de Recursos e Apoio)** na Vercel e no GitHub.

---

## 📋 Pré-requisitos
- Conta no [GitHub](https://github.com)
- Conta na [Vercel](https://vercel.com)
- Git instalado localmente

---

## 🌐 Opção 1: Deploy Automático via Vercel + GitHub (Recomendado)

1. **Enviar as alterações para o GitHub:**
   ```bash
   git add .
   git commit -m "feat: atualizações da IARA"
   git push origin main
   ```

2. **Importar o Projeto na Vercel:**
   - Acesse [vercel.com/new](https://vercel.com/new)
   - Conecte sua conta do GitHub
   - Selecione o repositório `fpfinfo/chat-voz-vercel` (ou seu fork)
   - Deixe o **Framework Preset** como `Other`
   - O diretório raiz é `./`
   - **Build Command** e **Output Directory**: deixe em branco (site estático, sem build)
   - Clique em **Deploy**

3. **Deploy Contínuo:**
   - Cada novo `git push` para a branch `main` gerará um novo deploy de produção automaticamente.

---

## ⚡ Opção 2: Deploy Direto via Vercel CLI

Caso prefira publicar direto do terminal sem passar pelo GitHub:

1. **Instalar a CLI da Vercel (se ainda não tiver):**
   ```bash
   npm i -g vercel
   ```

2. **Fazer login:**
   ```bash
   vercel login
   ```

3. **Deploy de Preview:**
   ```bash
   vercel
   ```

4. **Deploy de Produção:**
   ```bash
   vercel --prod
   ```

---

## 🛠️ Arquivos de Configuração

### `vercel.json`
O site é **estático**, sem etapa de build. A Vercel serve todos os arquivos do repositório
automaticamente (`index.html`, `lib/rag-system.js`, `rag_estruturado.json`, `catalogo.json`),
então a configuração é mínima:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "microphone=(self)" }
      ]
    },
    {
      "source": "/(.*)\\.json",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    }
  ]
}
```

> ⚠️ **Não** use `builds` apontando só para `index.html` nem um `routes` com `"/(.*)" → "/index.html"`:
> isso impede o deploy dos demais arquivos e faz o `fetch('rag_estruturado.json')` retornar o HTML.
> Como não há roteador no cliente, nenhum *fallback* de SPA é necessário.

### `lib/rag-system.js`
Módulo RAG executado **no navegador**. Ficava em `api/`, mas a Vercel trata `/api/*` como *Serverless
Functions* — por isso foi movido para `lib/` para ser servido como arquivo estático.

---

## 🔒 Permissões do Navegador em Produção
- Para usar o reconhecimento de voz (`Web Speech API`), a aplicação precisa rodar sob **HTTPS** (fornecido automaticamente pela Vercel com certificado SSL gratuito).
- O usuário deve autorizar o acesso ao microfone no primeiro acesso.
