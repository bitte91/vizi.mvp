import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { toast } from '../components/Toasts';

export default function Painel() {
  const { supabase } = useSupabase();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start', { ascending: true });

      if (error) {
        // It's okay if the table doesn't exist yet
        if (error.code !== '42P01') {
            toast('Erro ao carregar eventos.', false);
        }
      } else {
        setEvents(data);
      }
    };

    fetchEvents();
  }, [supabase]);

  return (
    <div className="p-4 space-y-4">
      <section className="bg-gradient-to-br from-brand to-sky-600 text-white rounded-2xl p-4">
        <h2 className="text-xl font-bold">Bem-vindo ao Conecta Bairro 👋</h2>
        <p className="text-sm opacity-90">Tudo do seu bairro em um só lugar: mural, mercado, segurança e agenda.</p>
        <div className="mt-3 flex gap-2 text-sm">
          <Link to="/mural" className="bg-white/90 text-slate-900 px-3 py-1 rounded">Abrir Mural</Link>
          <Link to="/marketplace" className="bg-white/90 text-slate-900 px-3 py-1 rounded">Comprar/Vender</Link>
          <Link to="/seguranca" className="bg-white/90 text-slate-900 px-3 py-1 rounded">Segurança</Link>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-semibold">Próximos eventos</h3>
        {events.length === 0 && <p className="text-sm text-slate-500">Sem eventos no momento.</p>}
        <ul className="space-y-2">
          {events.map(e => (
            <li key={e.id} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-medium">{e.title}</div>
              <div className="text-xs text-slate-500">{new Date(e.start).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
