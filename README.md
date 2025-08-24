# Conecta Bairro – MVP (SPA + PWA)

**Mobile-first, PT-BR, focado em vizinhanças brasileiras.**

## Rodando localmente
```bash
npm install
npm run dev
```

> Tailwind é carregado via CDN neste MVP para simplificar o bootstrap. Em produção, recomendo configurar PostCSS/Tailwind para tree-shaking.

## Build (Vercel)
- Projeto é uma SPA com Vite (config mínima). Deploy direto no Vercel apontando o diretório raiz.
- Defina o comando de build: `vite build` e output `dist/`.

## Funcionalidades deste MVP
- **Onboarding**: nome, bairro, CEP e interesses salvos em `localStorage`.
- **Mural**: criar/ler posts com imagem opcional, reportar conteúdo.
- **Marketplace**: anúncios com preço/imagem, contato por **WhatsApp**.
- **Segurança**: botão de **pânico** (compartilha SOS via Web Share / cópia), cadastro rápido de contatos de apoio, atalhos para 190 e pets.
- **Agenda**: base para eventos (persistência local) e link “Adicionar ao Google Calendar” (via URL).
- **Perfil**: edição de dados e preferências.
- **PWA**: manifest + service worker simples (offline do shell e cache de GET).

## Estrutura
- `src/pages`: Painel, Mural, Marketplace, Seguranca, Perfil, Onboarding
- `src/components`: UI reutilizável (cards, modal, toasts)
- `src/services/api.js`: stub de dados usando `localStorage`
- `public/icons`: ícones da PWA
- `sw.js` e `manifest.webmanifest`

## Próximos passos (sugestão)
- **Auth real** (Firebase Auth / Supabase).
- **Backend serverless** (Railway / Cloudflare / Vercel Functions) com PostgreSQL.
- **Upload de imagens**: R2 / Firebase Storage.
- **Push Notifications**: Web Push + service worker.
- **Moderação**: fila/flags + painel admin.
- **Integrações**: CEP (CEP Aberto), clima (INMET), vagas (SINE).

## Licença
MIT
