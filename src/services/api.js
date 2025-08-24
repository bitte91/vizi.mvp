// Stubs de serviços da aplicação (MVP offline com LocalStorage).
const delay = (ms) => new Promise(r => setTimeout(r, ms))

export const storage = {
  get(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback }
    catch { return fallback }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)) },
}

// MURAL
export async function listPosts() {
  await delay(150)
  return storage.get('cb_posts', [])
}
export async function createPost(p) {
  const posts = storage.get('cb_posts', [])
  posts.unshift({ id: crypto.randomUUID(), createdAt: Date.now(), ...p })
  storage.set('cb_posts', posts)
  return posts[0]
}
export async function reportPost(id, reason) {
  const reports = storage.get('cb_reports', [])
  reports.push({ id, reason, createdAt: Date.now() })
  storage.set('cb_reports', reports)
  return true
}

// MARKETPLACE
export async function listAds() {
  await delay(150)
  return storage.get('cb_ads', [])
}
export async function createAd(a) {
  const ads = storage.get('cb_ads', [])
  ads.unshift({ id: crypto.randomUUID(), createdAt: Date.now(), ...a })
  storage.set('cb_ads', ads)
  return ads[0]
}
export async function contactSeller(ad) {
  const msg = encodeURIComponent(`Olá! Vi seu anúncio no Conecta Bairro: ${ad.title} por R$ ${ad.price}. Ainda disponível?`)
  window.open(`https://wa.me/?text=${msg}`, '_blank')
}

// EVENTOS / AGENDA
export async function listEvents() {
  return storage.get('cb_events', [])
}
export async function createEvent(e) {
  const events = storage.get('cb_events', [])
  events.push({ id: crypto.randomUUID(), createdAt: Date.now(), ...e })
  storage.set('cb_events', events)
  return e
}

// UTIL: add to Google Calendar (link)
export function googleCalendarLink({ title, details, location, start }) {
  const end = new Date(new Date(start).getTime() + 60*60*1000)
  const fmt = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g,'')
  const url = new URL('https://calendar.google.com/calendar/render')
  url.searchParams.set('action', 'TEMPLATE')
  url.searchParams.set('text', title)
  url.searchParams.set('details', details || '')
  url.searchParams.set('location', location || '')
  url.searchParams.set('dates', `${fmt(new Date(start))}/${fmt(end)}`)
  return url.toString()
}
