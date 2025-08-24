import React, { useState } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { toast } from '../components/Toasts';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const { supabase, user } = useSupabase();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ username: '', interests: [] });

  const toggleInterest = (interest) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleOnboarding = async (e) => {
    e.preventDefault();
    const updates = {
      id: user.id,
      username: profile.username,
      interests: profile.interests,
      updated_at: new Date(),
    };
    const { error } = await supabase.from('profiles').upsert(updates);
    if (error) {
      toast(error.message, false);
    } else {
      toast('Perfil salvo. Bem-vindo!');
      navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Conecta Bairro</h1>
      <p className="text-slate-600">Para começar, conte-nos um pouco sobre você.</p>
      <form className="space-y-3" onSubmit={handleOnboarding}>
        <input
          required
          className="w-full px-3 py-2 rounded border border-slate-300 bg-white dark:bg-slate-800"
          placeholder="Seu nome"
          value={profile.username}
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
        />

        <fieldset className="space-y-2">
          <legend className="font-semibold">Interesses</legend>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {['Eventos', 'Compra/Venda', 'Segurança', 'Doações', 'Pets', 'Vagas/Serviços'].map((i) => (
              <label key={i} className={`px-3 py-2 rounded border cursor-pointer ${profile.interests.includes(i) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-slate-800 border-slate-300'}`}>
                <input
                  type="checkbox"
                  checked={profile.interests.includes(i)}
                  onChange={() => toggleInterest(i)}
                  className="hidden"
                />
                {i}
              </label>
            ))}
          </div>
        </fieldset>

        <button className="w-full bg-emerald-600 text-white rounded-lg py-2 font-semibold">Começar</button>
      </form>
    </div>
  );
}
