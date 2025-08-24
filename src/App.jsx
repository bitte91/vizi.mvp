import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Painel from './pages/Painel';
import Mural from './pages/Mural';
import Marketplace from './pages/Marketplace';
import Seguranca from './pages/Seguranca';
import Perfil from './pages/Perfil';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { useLocalTheme } from './hooks/useLocalTheme';
import { AppToasts } from './components/Toasts';
import { useSupabase } from './contexts/SupabaseContext';

const Tab = ({ to, label, icon }) => (
  <NavLink to={to} className={({ isActive }) => `flex-1 text-center text-sm py-2 ${isActive ? 'text-brand font-semibold' : 'text-slate-500'}`}>
    <div className="flex flex-col items-center gap-1">
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </div>
  </NavLink>
);

function AppLayout() {
  const { theme, toggle } = useLocalTheme();
  const { supabase, user } = useSupabase();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="max-w-md mx-auto h-[100dvh] grid grid-rows-[auto,1fr,auto]">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold">Conecta Bairro</h1>
          <div className="flex items-center gap-2">
            <button className="text-sm px-2 py-1 rounded bg-slate-100 dark:bg-slate-800" onClick={toggle}>
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            {user && <button onClick={handleLogout} className="text-sm px-2 py-1 rounded bg-red-600 text-white">Sair</button>}
          </div>
        </div>
      </header>
      <main className="overflow-y-auto">
        <Routes>
          <Route path="/" element={<Painel />} />
          <Route path="/mural" element={<Mural />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/seguranca" element={<Seguranca />} />
          <Route path="/perfil" element={<Perfil />} />
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
  );
}

import Onboarding from './pages/Onboarding';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/*" element={<AppLayout />} />
      </Route>
    </Routes>
  );
}
