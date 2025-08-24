import React, { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { toast } from '../components/Toast';

export default function Perfil() {
  const { supabase, user } = useSupabase();
  const [profile, setProfile] = useState({ username: '', website: '', avatar_url: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (error && error.code !== 'PGRST116') {
          toast('Erro ao carregar perfil.', false);
        } else if (data) {
          setProfile({
            username: data.username || '',
            website: data.website || '',
            avatar_url: data.avatar_url || '',
          });
        }
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, supabase]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const updates = {
      id: user.id,
      ...profile,
      updated_at: new Date(),
    };
    const { error } = await supabase.from('profiles').upsert(updates);
    if (error) {
      toast(error.message, false);
    } else {
      toast('Perfil atualizado!');
    }
  };

  if (loading) {
    return <p className="p-4">Carregando perfil...</p>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">Meu perfil</h2>
      <form className="space-y-3" onSubmit={handleUpdateProfile}>
        <input
          className="w-full rounded border p-2 bg-white dark:bg-slate-800"
          placeholder="Nome de usuário"
          value={profile.username}
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
        />
        <input
          className="w-full rounded border p-2 bg-white dark:bg-slate-800"
          placeholder="Website"
          value={profile.website}
          onChange={(e) => setProfile({ ...profile, website: e.target.value })}
        />
        <button className="w-full bg-emerald-600 text-white rounded-lg py-2 font-semibold">Salvar</button>
      </form>
    </div>
  );
}
