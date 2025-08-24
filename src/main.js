import { supabase } from './lib/supabase.js'
import { Login } from './pages/Login.js'
import { Dashboard } from './pages/Dashboard.js'

// If true, exige aprovação manual (profiles.is_verified = true) além de e-mail confirmado
window.ENFORCE_MANUAL_VERIFICATION = false

const routes = {
  '/': Dashboard,
  '/login': Login,
  '/callback': Dashboard, // após confirmar o e-mail
}

function mount(Component) {
  const app = document.getElementById('app')
  app.innerHTML = ''
  app.appendChild(Component())
}

async function guardAndRender() {
  const path = location.hash.replace('#', '') || '/'
  const isPublic = path.startsWith('/login')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user && !isPublic) {
    location.hash = '/login'
    return
  }
  const Comp = routes[path] || Dashboard
  mount(Comp)
}

window.addEventListener('hashchange', guardAndRender)
window.addEventListener('load', async () => {
  // Observa mudanças de sessão (login/logout)
  supabase.auth.onAuthStateChange((_event, _session) => {
    guardAndRender()
  })
  await guardAndRender()
})
