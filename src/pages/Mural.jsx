import React, { useState, useEffect, useRef } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { toast } from '../components/Toast';
import Modal from '../components/Modal';

function PostCard({ post, user, onDelete }) {
  const canDelete = user && user.id === post.author_id;

  return (
    <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700">
      <div className="flex items-center justify-between">
        <span className="text-xs opacity-70">{new Date(post.created_at).toLocaleString()}</span>
        {canDelete && (
          <button onClick={() => onDelete(post.id)} className="text-xs px-2 py-1 rounded bg-rose-600/80 hover:bg-rose-600">
            Apagar
          </button>
        )}
      </div>
      <p className="mt-2 whitespace-pre-wrap">{post.content}</p>
      {post.images && post.images.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {post.images.map((url) => (
            <a key={url} href={url} target="_blank" rel="noopener noreferrer">
              <img src={url} alt="Post image" className="rounded-lg w-full object-cover max-h-64" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Mural() {
  const { supabase, user } = useSupabase();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postImages, setPostImages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast('Erro ao carregar posts.', false);
      } else {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();

    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setPosts((prev) => [payload.new, ...prev]);
        }
        if (payload.eventType === 'DELETE') {
          setPosts((prev) => prev.filter((p) => p.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postContent.trim() && postImages.length === 0) {
      toast('Escreva algo ou selecione imagens.', false);
      return;
    }

    const imageUrls = [];
    for (const file of postImages) {
      const path = `${user.id}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const { error: uploadError } = await supabase.storage.from('public-media').upload(path, file);

      if (uploadError) {
        toast(`Erro no upload: ${uploadError.message}`, false);
        return;
      }

      const { data: publicUrlData } = supabase.storage.from('public-media').getPublicUrl(path);
      imageUrls.push(publicUrlData.publicUrl);
    }

    const { error } = await supabase
      .from('posts')
      .insert({ content: postContent, author_id: user.id, images: imageUrls });

    if (error) {
      toast(error.message, false);
    } else {
      toast('Publicado!');
      setPostContent('');
      setPostImages([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setShowModal(false);
    }
  };

  const handleDeletePost = async (postId) => {
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (error) {
      toast(error.message, false);
    } else {
      toast('Post apagado.');
    }
  };

  const isEmailConfirmed = user?.email_confirmed_at;

  return (
    <div className="p-4 space-y-4">
      {!isEmailConfirmed && (
        <div className="p-4 rounded-xl border border-amber-300 bg-amber-100/10">
          <p className="text-amber-200">Seu e-mail ainda não está confirmado. Verifique sua caixa de entrada.</p>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Mural</h2>
        <button className="px-3 py-1 rounded bg-emerald-600 text-white" onClick={() => setShowModal(true)}>Novo Post</button>
      </div>

      {loading ? (
        <p>Carregando posts...</p>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} user={user} onDelete={handleDeletePost} />
          ))}
          {posts.length === 0 && <p className="text-sm text-slate-500">Ainda sem posts. Seja o primeiro a avisar algo no bairro!</p>}
        </div>
      )}

      <Modal open={showModal} title="Nova postagem" onClose={() => setShowModal(false)}>
        <form className="space-y-3" onSubmit={handleCreatePost}>
          <textarea
            required
            className="w-full rounded border p-2 bg-white dark:bg-slate-800"
            rows="3"
            placeholder="Escreva seu aviso..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={(e) => setPostImages(Array.from(e.target.files))}
          />
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
