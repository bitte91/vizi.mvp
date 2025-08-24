import React from 'react'
import PostCard from '../components/PostCard'
import Modal from '../components/Modal'
import { listPosts, createPost, reportPost } from '../services/api'
import { toast } from '../components/Toasts'

export default function Mural() {
  const [posts, setPosts] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState({ text:'', image:'' })

  React.useEffect(() => { listPosts().then(setPosts) }, [])

  const submit = async (e) => {
    e.preventDefault()
    const p = await createPost({ ...form, author: JSON.parse(localStorage.getItem('cb_profile')||'{}').nome || 'Vizinho' })
    setPosts(prev => [p, ...prev])
    setForm({text:'', image:''})
    setOpen(false)
    toast('Post publicado no Mural!')
  }

  const onReport = async (post) => {
    await reportPost(post.id, 'conteúdo inapropriado')
    toast('Obrigado! Nossa moderação vai analisar.')
  }

  const onImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm(f => ({ ...f, image: reader.result }))
    reader.readAsDataURL(file)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Mural</h2>
        <button className="px-3 py-1 rounded bg-brand text-white" onClick={()=>setOpen(true)}>Novo</button>
      </div>

      <div className="space-y-3">
        {posts.map(p => <PostCard key={p.id} post={p} onReport={onReport} />)}
        {posts.length===0 && <p className="text-sm text-slate-500">Ainda sem posts. Seja o primeiro a avisar algo no bairro!</p>}
      </div>

      <Modal open={open} title="Nova postagem" onClose={()=>setOpen(false)}>
        <form className="space-y-3" onSubmit={submit}>
          <textarea required className="w-full rounded border p-2 bg-white dark:bg-slate-800" rows="3" placeholder="Escreva seu aviso..." value={form.text} onChange={e=>setForm({...form,text:e.target.value})}></textarea>
          <input type="file" accept="image/*" onChange={onImage} />
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-brand text-white">Publicar</button>
            <button type="button" className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700" onClick={()=>setOpen(false)}>Cancelar</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
