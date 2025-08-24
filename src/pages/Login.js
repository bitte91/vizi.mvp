import { supabase } from '../lib/supabase.js'
import { toast } from '../components/Toast.js'

export function Login() {
  const root = document.createElement('div')
  root.className = 'min-h-screen grid place-items-center p-6'

  root.innerHTML = `
    <div class="w-full max-w-sm space-y-4 p-6 rounded-2xl bg-slate-900/50 shadow-2xl">
      <h1 class="text-xl font-semibold">Acesso</h1>
      <form id="signup" class="space-y-2">
        <input id="su-email" class="w-full p-3 rounded bg-slate-800" type="email" placeholder="Seu e-mail" required />
        <input id="su-pass" class="w-full p-3 rounded bg-slate-800" type="password" placeholder="Senha" required />
        <button class="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-500">Cadastrar</button>
        <p class="text-xs opacity-80">Você receberá um e-mail para confirmar a conta.</p>
      </form>
      <hr class="opacity-20">
      <form id="signin" class="space-y-2">
        <input id="si-email" class="w-full p-3 rounded bg-slate-800" type="email" placeholder="Seu e-mail" required />
        <input id="si-pass" class="w-full p-3 rounded bg-slate-800" type="password" placeholder="Senha" required />
        <button class="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-500">Entrar</button>
      </form>
      <p id="msg" class="text-sm h-5"></p>
    </div>
  `

  const $ = (sel) => root.querySelector(sel)
  const setMsg = (t, ok=true) => { const el = $('#msg'); el.textContent = t; el.className = 'text-sm h-5 ' + (ok? 'text-emerald-400':'text-rose-400'); }

  root.querySelector('#signup').addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = $('#su-email').value.trim()
    const password = $('#su-pass').value
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: location.origin + '/#/callback' }
    })
    if (error) setMsg(error.message, false)
    else setMsg('Cadastro iniciado. Confirme o e-mail enviado.')
  })

  root.querySelector('#signin').addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = $('#si-email').value.trim()
    const password = $('#si-pass').value
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMsg(error.message, false)
    else { toast('Bem-vindo(a)!'); location.hash = '/'; }
  })

  return root
}
