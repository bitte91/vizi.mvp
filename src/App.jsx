import React, { useEffect, useState } from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import Painel from './pages/Painel'
import Mural from './pages/Mural'
import Marketplace from './pages/Marketplace'
import Seguranca from './pages/Seguranca'
import Perfil from './pages/Perfil'
import Onboarding from './pages/Onboarding'
import { useLocalTheme } from './hooks/useLocalTheme'
import { AppToasts } from './components/Toasts'

const Tab = ({ to, label, icon }) => (
  <NavLink to={to} className={({isActive}) => `flex-1 text-center text-sm py-2 ${isActive ? 'text-brand font-semibold' : 'text-slate-500'}`}>
    <div className="flex flex-col items-center gap-1">
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </div>
  </NavLink>
)

export default function App() {
  const location = useLocation()
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem('cb_onboarded') === '1')
  const { theme, toggle } = useLocalTheme()

  useEffect(() => {
    const q = new URLSearchParams(location.search)
    if (q.get('theme')) {
      const next = q.get('theme')
      document.documentElement.classList.toggle('dark', next === 'dark')
    }
  }, [location])

  if (!onboarded) {
    return <Onboarding onDone={() => { localStorage.setItem('cb_onboarded', '1'); setOnboarded(true) }} />
  }

  return (
    <div className="max-w-md mx-auto h-[100dvh] grid grid-rows-[auto,1fr,auto]">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold">Conecta Bairro</h1>
          <div className="flex items-center gap-2">
            <button className="text-sm px-2 py-1 rounded bg-slate-100 dark:bg-slate-800" onClick={toggle}>
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            <a className="text-sm px-2 py-1 rounded bg-brand text-white" href="https://wa.me/?text=Baixe%20o%20Conecta%20Bairro!">
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      <main className="overflow-y-auto">
        <Routes>
          <Route path="/" element={<Painel/>} />
          <Route path="/mural" element={<Mural/>} />
          <Route path="/marketplace" element={<Marketplace/>} />
          <Route path="/seguranca" element={<Seguranca/>} />
          <Route path="/perfil" element={<Perfil/>} />
        </Routes>
      </main>

      <nav className="grid grid-cols-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Tab to="/" label="Painel" icon="🏠" />
        <Tab to="/mural" label="Mural" icon="🧩" />
        <Tab to="/marketplace" label="Mercado" icon="🛒" />
        <Tab to="/seguranca" label="Segurança" icon="🛟" />
        <Tab to="/perfil" label="Perfil" icon="👤" />
      </nav>

      <AppToasts />
    </div>
  )
}
