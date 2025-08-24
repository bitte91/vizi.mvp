import { supabase } from '../lib/supabase.js'
import { toast } from '../components/Toast.js'

function fmtDate(iso) {
  try { return new Date(iso).toLocaleString() } catch { return '' }
}

function el(html) {
  const t = document.createElement('template')
  t.innerHTML = html.trim()
  return t.content.firstElementChild
}

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
        <h2 class="font-semibold mb-2">Mural</h2>
        <p class="text-sm opacity-80">Compartilhe avisos, achados & perdidos, fotos do bairro.</p>
        <div class="mt-3 grid gap-2">
          <textarea id="msg" class="w-full p-3 rounded bg-slate-800" rows="3" placeholder="Escreva algo..."></textarea>
          <div class="flex items-center gap-3">
            <input id="file" type="file" accept="image/*" multiple class="text-sm" />
            <button id="post" class="px-3 py-2 rounded bg-emerald-600">Postar</button>
          </div>
        </div>
        <ul id="list" class="mt-5 grid gap-3"></ul>
      </div>
    </section>
  `

  const $ = (sel) => root.querySelector(sel)
  const list = $('#list')

  function renderPost(p, me) {
    const imgs = Array.isArray(p.images) ? p.images : []
    const canDelete = me && me.id === p.author_id
    const item = el(`
      <li class="p-3 rounded-xl bg-slate-800/70 border border-slate-700">
        <div class="flex items-center justify-between">
          <span class="text-xs opacity-70">${fmtDate(p.created_at)}</span>
          ${canDelete ? '<button class="text-xs px-2 py-1 rounded bg-rose-600/80 hover:bg-rose-600" data-del>Apagar</button>' : ''}
        </div>
        <p class="mt-2 whitespace-pre-wrap">${(p.content || '').replace(/[<>&]/g, s => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[s]))}</p>
        ${imgs.length ? `<div class="mt-3 grid grid-cols-2 gap-2">${imgs.map(u=>`<a href="${u}" target="_blank"><img src="${u}" class="rounded-lg w-full object-cover max-h-64"/></a>`).join('')}</div>` : ''}
      </li>
    `)
    if (canDelete) {
      item.querySelector('[data-del]')?.addEventListener('click', async () => {
        const { error } = await supabase.from('posts').delete().eq('id', p.id)
        if (error) toast(error.message, false); else { item.remove(); toast('Post apagado.') }
      })
    }
    return item
  }

  ;(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { location.hash = '/login'; return }
    $('#email').textContent = user.email || ''

    // Gate 1: exigir e-mail confirmado
    const confirmed = !!user.email_confirmed_at
    if (!confirmed) $('#banner').classList.remove('hidden')

    // Gate 2 (opcional): verificação manual via profiles.is_verified
    let isVerified = false
    if (confirmed && window.ENFORCE_MANUAL_VERIFICATION) {
      const { data: profile } = await supabase.from('profiles').select('is_verified').eq('id', user.id).maybeSingle()
      isVerified = !!(profile && profile.is_verified)
    } else {
      isVerified = confirmed
    }

    const canPost = () => isVerified

    // Carregar feed inicial
    const { data: initial } = await supabase
      .from('posts')
      .select('id, author_id, content, images, created_at')
      .order('created_at', { ascending: false })
      .limit(100)

    ;(initial || []).forEach(p => list.appendChild(renderPost(p, user)))

    // Realtime
    supabase
      .channel('public:posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, payload => {
        list.prepend(renderPost(payload.new, user))
      })
      .subscribe()

    // Postar
    $('#post').addEventListener('click', async () => {
      if (!canPost()) { toast('Acesso não liberado (confirme e-mail e/ou aguarde verificação).', false); return }

      const text = $('#msg').value.trim()
      const files = Array.from($('#file').files || [])
      if (!text && files.length === 0) { toast('Escreva algo ou selecione imagens.', false); return }

      const urls = []
      for (const f of files) {
        const path = `${user.id}/${Date.now()}-${(f.name||'img').replace(/\s+/g,'-')}`
        const up = await supabase.storage.from('public-media').upload(path, f)
        if (up.error) { toast(up.error.message, false); return }
        const pub = supabase.storage.from('public-media').getPublicUrl(path)
        urls.push(pub.data.publicUrl)
      }

      const ins = await supabase.from('posts').insert({ author_id: user.id, content: text, images: urls }).select().single()
      if (ins.error) { toast(ins.error.message, false); return }

      $('#msg').value = ''
      $('#file').value = ''
      toast('Publicado!')
    })
  })()

  return root
}
