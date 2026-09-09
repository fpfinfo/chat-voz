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
   - Selecione o repositório `fpfinfo/chat-voz` (ou seu fork)
   - Deixe o **Framework Preset** como `Other`
   - O diretório raiz é `./`
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
O projeto inclui o arquivo de configuração para garantir o roteamento SPA estático:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

---

## 🔒 Permissões do Navegador em Produção
- Para usar o reconhecimento de voz (`Web Speech API`), a aplicação precisa rodar sob **HTTPS** (fornecido automaticamente pela Vercel com certificado SSL gratuito).
- O usuário deve autorizar o acesso ao microfone no primeiro acesso.
