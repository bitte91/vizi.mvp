import React from 'react'
import { toast } from '../components/Toasts'

export default function Onboarding({ onDone }) {
  const [data, setData] = React.useState({ nome: '', cep: '', bairro: '', interesses: [] })
  const toggle = (i) => setData(d => ({ ...d, interesses: d.interesses.includes(i) ? d.interesses.filter(x => x!==i) : [...d.interesses, i] }))

  const next = (e) => {
    e.preventDefault()
    localStorage.setItem('cb_profile', JSON.stringify(data))
    toast('Perfil salvo. Bem-vindo!')
    onDone()
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Conecta Bairro</h1>
      <p className="text-slate-600">Rapidinho: conte um pouco sobre você e o seu bairro. Prometemos não encher o saco 😉</p>
      <form className="space-y-3" onSubmit={next}>
        <input required className="w-full px-3 py-2 rounded border border-slate-300 bg-white dark:bg-slate-800" placeholder="Seu nome" value={data.nome} onChange={e=>setData({...data,nome:e.target.value})}/>
        <input className="w-full px-3 py-2 rounded border border-slate-300 bg-white dark:bg-slate-800" placeholder="CEP (opcional)" value={data.cep} onChange={e=>setData({...data,cep:e.target.value})}/>
        <input required className="w-full px-3 py-2 rounded border border-slate-300 bg-white dark:bg-slate-800" placeholder="Bairro" value={data.bairro} onChange={e=>setData({...data,bairro:e.target.value})}/>

        <fieldset className="space-y-2">
          <legend className="font-semibold">Interesses</legend>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {['Eventos','Compra/Venda','Segurança','Doações','Pets','Vagas/Serviços'].map(i => (
              <label key={i} className={`px-3 py-2 rounded border cursor-pointer ${data.interesses.includes(i) ? 'bg-brand text-white border-brand' : 'bg-white dark:bg-slate-800 border-slate-300'}`}>
                <input type="checkbox" checked={data.interesses.includes(i)} onChange={()=>toggle(i)} className="hidden" />
                {i}
              </label>
            ))}
          </div>
        </fieldset>

        <button className="w-full bg-brand text-white rounded-lg py-2 font-semibold">Começar</button>
      </form>
    </div>
  )
}
