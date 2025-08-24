import React from 'react'
import AdCard from '../components/AdCard'
import Modal from '../components/Modal'
import { listAds, createAd, contactSeller } from '../services/api'
import { toast } from '../components/Toasts'

export default function Marketplace() {
  const [ads, setAds] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState({ title:'', price:'', description:'', image:'' })

  React.useEffect(() => { listAds().then(setAds) }, [])

  const submit = async (e) => {
    e.preventDefault()
    const ad = await createAd(form)
    setAds(prev => [ad, ...prev])
    setForm({ title:'', price:'', description:'', image:'' })
    setOpen(false)
    toast('Anúncio publicado!')
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
        <h2 className="text-lg font-bold">Marketplace local</h2>
        <button className="px-3 py-1 rounded bg-brand text-white" onClick={()=>setOpen(true)}>Novo</button>
      </div>

      <div className="space-y-3">
        {ads.map(a => <AdCard key={a.id} ad={a} onContact={contactSeller} />)}
        {ads.length===0 && <p className="text-sm text-slate-500">Sem anúncios ainda. Publique o primeiro! 😉</p>}
      </div>

      <Modal open={open} title="Novo anúncio" onClose={()=>setOpen(false)}>
        <form className="space-y-3" onSubmit={submit}>
          <input required className="w-full rounded border p-2 bg-white dark:bg-slate-800" placeholder="Título" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
          <input required type="number" className="w-full rounded border p-2 bg-white dark:bg-slate-800" placeholder="Preço" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
          <textarea className="w-full rounded border p-2 bg-white dark:bg-slate-800" rows="3" placeholder="Descrição" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}></textarea>
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
