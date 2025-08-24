import { supabase } from '../lib/supabase.js'
import { toast } from '../components/Toast.js'

export function Dashboard() {
  const root = document.createElement('div')
  root.className = 'p-6 max-w-3xl mx-auto space-y-4'

  root.innerHTML = `
    <header class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Conecta Bairro</h1>
      <div class="flex items-center gap-2">
        <span id="email" class="text-sm opacity-80"></span>
        <button id="logout" class="px-3 py-1 rounded bg-slate-800">Sair</button>
      </div>
    </header>

    <div id="banner" class="p-4 rounded-xl border border-amber-300 bg-amber-100/10 hidden">
      <p class="text-amber-200">Seu e-mail ainda não está confirmado. Reabra o app após confirmar pelo link enviado.</p>
    </div>

    <section class="grid gap-3">
      <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
        <h2 class="font-semibold mb-2">Mural (demo)</h2>
        <p class="text-sm opacity-80">Área destravada apenas para contas confirmadas (e opcionalmente verificadas pelo admin).</p>
        <div class="mt-3 flex gap-2">
          <input id="msg" class="flex-1 p-2 rounded bg-slate-800" placeholder="Escreva algo..." />
          <button id="post" class="px-3 py-2 rounded bg-emerald-600">Postar</button>
        </div>
        <ul id="list" class="mt-3 grid gap-2"></ul>
      </div>
    </section>
  `

  ;(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { location.hash = '/login'; return }
    root.querySelector('#email').textContent = user.email || ''

    // Gate 1: exigir e-mail confirmado
    const confirmed = !!user.email_confirmed_at
    if (!confirmed) {
      root.querySelector('#banner').classList.remove('hidden')
    }

    // Gate 2 (opcional): verificar flag no perfil (is_verified)
    // Tabela/trigger/políticas devem ser criadas no Supabase pelo arquivo SQL /sql/setup.sql
    let isVerified = false
    if (confirmed) {
      const { data: profile } = await supabase.from('profiles').select('is_verified').eq('id', user.id).maybeSingle()
      isVerified = !!(profile && profile.is_verified)
    }

    const input = root.querySelector('#msg')
    const list = root.querySelector('#list')

    function canPost() {
      // Só permite postar se confirmado; se tiver moderação manual, exige isVerified
      return confirmed && true && (!window.ENFORCE_MANUAL_VERIFICATION || isVerified)
    }

    root.querySelector('#post').addEventListener('click', () => {
      if (!canPost()) {
        toast('Acesso ainda não liberado. Confirme o e-mail (e aguarde verificação se exigida).', false)
        return
      }
      const text = input.value.trim()
      if (!text) return
      const li = document.createElement('li')
      li.className = 'p-2 rounded bg-slate-800'
      li.textContent = text
      list.prepend(li)
      input.value = ''
    })

    root.querySelector('#logout').addEventListener('click', async () => {
      await supabase.auth.signOut()
      location.hash = '/login'
    })
  })()

  return root
}
