# Conecta Bairro — MVP com Supabase Auth (verificação por e-mail)

Este pacote adiciona **Login/Cadastro** com Supabase + checagem de **e-mail confirmado** (e, opcionalmente, uma verificação manual `profiles.is_verified`) ao seu MVP.

## Como usar (passo a passo rápido)
1. **Descompacte** este ZIP e abra a pasta no VS Code.
2. Em `public/env.example.js` **copie para** `public/env.js` e preencha `SUPABASE_URL` e `SUPABASE_ANON_KEY` do seu projeto Supabase.
3. No painel do Supabase, em **SQL Editor**, cole o conteúdo de `sql/setup.sql` e **execute** (cria a tabela `profiles`, ativa RLS e configura o gatilho de cadastro).
4. **Rodar local**:
   ```bash
   npm install
   npm run dev
   ```
   Acesse: `http://localhost:5173`
5. **Build**: `npm run build` → gera `dist/` (Vercel aponta para esse diretório).

> Dica: se quiser exigir **verificação manual** além do e-mail confirmado (moderador precisa aprovar), edite `src/main.js` e mude `window.ENFORCE_MANUAL_VERIFICATION = true`.

## O que vem pronto
- SPA simples com rota `/#/login` e `/#/` (dashboard).
- **Cadastro** (`signUp`) que envia e-mail de confirmação e **Login** (`signInWithPassword`).
- Banner informando se o **e-mail ainda não está confirmado**.
- (Opcional) Restrições extras caso `profiles.is_verified` não seja `true`.

## Importante
- Em projetos hospedados, o Supabase **costuma exigir confirmação de e-mail** para autenticar. Ajuste em **Auth → Providers → Email** e **Auth → URL Configuration**.
- Personalize os templates de e-mail no Supabase (logo, cores, remetente).

---
Gerado em 2025-08-24T13:37:57
