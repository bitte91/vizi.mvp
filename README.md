# Conecta Bairro — Feed persistente + Upload de imagens (Sem botão Google)

**Pronto para subir no GitHub/Vercel.** Já configurado com Supabase Auth (e-mail) e:
- Feed **persistente** (`posts`) com realtime.
- Upload de **imagens** para Storage (`public-media`) com URLs públicas.
- Sem OAuth Google (pode ativar depois sem mexer neste pacote).

## Como usar
1. No Supabase → **SQL Editor**: rode `sql/setup.sql`, `sql/posts.sql` e `sql/storage_public_media.sql`.
2. Em `public/env.js` já estão a `SUPABASE_URL` e `ANON KEY` que você me passou.
3. Rodar local:
   ```bash
   npm install
   npm run dev
   ```
4. Build:
   ```bash
   npm run build
   ```
5. Vercel publica automático ao fazer commit no GitHub.

### Notas
- Para exigir aprovação manual, edite `src/main.js`: `window.ENFORCE_MANUAL_VERIFICATION = true`.
- Ajuste **Auth → URL Configuration** no Supabase com seu domínio e `/#/callback`.

_Gerado em 2025-08-24T14:14:04_
