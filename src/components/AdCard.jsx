import React from 'react'

export default function AdCard({ ad, onContact }) {
  return (
    <article className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-2">
      <header className="flex items-center justify-between">
        <div className="font-semibold">{ad.title}</div>
        <div className="text-xs text-slate-500">R$ {Number(ad.price || 0).toLocaleString('pt-BR')}</div>
      </header>
      {ad.image && <img src={ad.image} alt={ad.title} className="rounded-lg max-h-64 w-full object-cover" />}
      <p className="text-sm whitespace-pre-wrap">{ad.description}</p>
      <footer className="flex gap-2">
        <button onClick={() => onContact(ad)} className="px-3 py-1 text-xs rounded bg-brand text-white">WhatsApp</button>
      </footer>
    </article>
  )
}
