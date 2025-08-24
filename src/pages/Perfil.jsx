import React from 'react'
import { toast } from '../components/Toasts'

export default function Perfil() {
  const [profile, setProfile] = React.useState(() => JSON.parse(localStorage.getItem('cb_profile')||'{}'))

  const save = (e) => {
    e.preventDefault()
    localStorage.setItem('cb_profile', JSON.stringify(profile))
    toast('Perfil atualizado!')
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">Meu perfil</h2>
      <form className="space-y-3" onSubmit={save}>
        <input className="w-full rounded border p-2 bg-white dark:bg-slate-800" placeholder="Nome" value={profile.nome||''} onChange={e=>setProfile({...profile, nome:e.target.value})}/>
        <input className="w-full rounded border p-2 bg-white dark:bg-slate-800" placeholder="Bairro" value={profile.bairro||''} onChange={e=>setProfile({...profile, bairro:e.target.value})}/>
        <input className="w-full rounded border p-2 bg-white dark:bg-slate-800" placeholder="CEP" value={profile.cep||''} onChange={e=>setProfile({...profile, cep:e.target.value})}/>
        <button className="w-full bg-brand text-white rounded-lg py-2 font-semibold">Salvar</button>
      </form>

      <div className="space-y-2">
        <h3 className="font-semibold">Preferências</h3>
        <label className="text-sm flex items-center gap-2"><input type="checkbox" defaultChecked /> Notificações importantes</label>
        <label className="text-sm flex items-center gap-2"><input type="checkbox" /> Mensagens de novidades</label>
        <p className="text-xs text-slate-500">As notificações push dependem do navegador/sistema. Neste MVP usamos alertas locais.</p>
      </div>
    </div>
  )
}
