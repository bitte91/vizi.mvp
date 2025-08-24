import React, { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { toast } from '../components/Toasts';

export default function Seguranca() {
  const { supabase, user } = useSupabase();
  const [profile, setProfile] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [panicPressed, setPanicPressed] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (error && error.code !== 'PGRST116') { // Ignore no rows found
          toast('Erro ao carregar perfil.', false);
        } else {
          setProfile(data);
        }
      }
    };
    fetchProfile();
  }, [user, supabase]);

  const share = async () => {
    const text = `SOS 🚨\nSou ${profile?.username || 'vizinho'}. Preciso de ajuda! Minha localização: ${location.href}`;
    if (navigator.share) {
      await navigator.share({ title: 'SOS - Conecta Bairro', text, url: location.href });
    } else {
      navigator.clipboard.writeText(text);
      toast('Mensagem copiada. Envie no WhatsApp.');
    }
  };

  const panic = () => {
    setPanicPressed(true);
    share();
    setTimeout(() => setPanicPressed(false), 10000);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">Segurança solidária</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">Ferramentas simples para o bairro se ajudar. Em emergência, acione o botão de pânico.</p>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={panic} className={`h-24 rounded-2xl text-white font-bold ${panicPressed ? 'bg-red-700 animate-pulse' : 'bg-red-600'}`}>🚨 PÂNICO</button>
        <button onClick={() => setHelpOpen(true)} className="h-24 rounded-2xl bg-amber-500 text-white font-bold">🧓 Ajuda a idosos</button>
        <a href="https://wa.me/?text=Animal%20perdido%20no%20bairro!%20Veja%20detalhes%20no%20Conecta%20Bairro." className="h-24 rounded-2xl bg-green-600 text-white font-bold flex items-center justify-center">🐾 Animal perdido</a>
        <a href="tel:190" className="h-24 rounded-2xl bg-sky-600 text-white font-bold flex items-center justify-center">📞 190 Polícia</a>
      </div>

      {helpOpen && (
        <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="font-semibold mb-2">Cadastro rápido de vizinhos de apoio</div>
          <p className="text-sm mb-2">Adicione 3 contatos de confiança para acionar em emergências.</p>
          <form className="grid grid-cols-1 gap-2" onSubmit={(e) => { e.preventDefault(); toast('Funcionalidade ainda não implementada.'); setHelpOpen(false); }}>
            {[1, 2, 3].map(i => <input key={i} className="rounded border p-2 bg-white dark:bg-slate-800" placeholder={`Nome + WhatsApp #${i}`} />)}
            <button className="rounded bg-emerald-600 text-white py-2">Salvar</button>
          </form>
        </div>
      )}
    </div>
  );
}
