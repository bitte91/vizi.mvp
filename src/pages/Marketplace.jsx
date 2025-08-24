import React, { useState, useEffect, useRef } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { toast } from '../components/Toasts';
import Modal from '../components/Modal';
import AdCard from '../components/AdCard';

export default function Marketplace() {
  const { supabase, user } = useSupabase();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', price: '', description: '', image: null });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchAds = async () => {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code !== '42P01') {
          toast('Erro ao carregar anúncios.', false);
        }
      } else {
        setAds(data);
      }
      setLoading(false);
    };

    fetchAds();

    const channel = supabase
      .channel('public:ads')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ads' }, (payload) => {
        setAds((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleCreateAd = async (e) => {
    e.preventDefault();
    let imageUrl = null;

    if (form.image) {
      const file = form.image;
      const path = `${user.id}/ads/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const { error: uploadError } = await supabase.storage.from('public-media').upload(path, file);

      if (uploadError) {
        toast(`Erro no upload: ${uploadError.message}`, false);
        return;
      }

      const { data: publicUrlData } = supabase.storage.from('public-media').getPublicUrl(path);
      imageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase.from('ads').insert({
      title: form.title,
      price: form.price,
      description: form.description,
      image_url: imageUrl,
      author_id: user.id,
    });

    if (error) {
      toast(error.message, false);
    } else {
      toast('Anúncio publicado!');
      setForm({ title: '', price: '', description: '', image: null });
      if (fileInputRef.current) fileInputRef.current.value = '';
      setShowModal(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Marketplace local</h2>
        <button className="px-3 py-1 rounded bg-emerald-600 text-white" onClick={() => setShowModal(true)}>Novo Anúncio</button>
      </div>

      {loading ? (
        <p>Carregando anúncios...</p>
      ) : (
        <div className="space-y-3">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
          {ads.length === 0 && <p className="text-sm text-slate-500">Sem anúncios ainda. Publique o primeiro! 😉</p>}
        </div>
      )}

      <Modal open={showModal} title="Novo anúncio" onClose={() => setShowModal(false)}>
        <form className="space-y-3" onSubmit={handleCreateAd}>
          <input required className="w-full rounded border p-2 bg-white dark:bg-slate-800" placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input required type="number" className="w-full rounded border p-2 bg-white dark:bg-slate-800" placeholder="Preço" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <textarea className="w-full rounded border p-2 bg-white dark:bg-slate-800" rows="3" placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-emerald-600 text-white">Publicar</button>
            <button type="button" className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700" onClick={() => setShowModal(false)}>
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
