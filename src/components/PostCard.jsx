import React from 'react'

export default function PostCard({ post, onReport }) {
  return (
    <article className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-2">
      <header className="flex items-center justify-between">
        <div className="font-semibold">{post.author || 'Anônimo'}</div>
        <div className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleString()}</div>
      </header>
      <p className="text-sm whitespace-pre-wrap">{post.text}</p>
      {post.image && <img src={post.image} alt="anexo" className="rounded-lg max-h-64 w-full object-cover" />}
      <footer className="flex gap-2">
        <button onClick={() => onReport(post)} className="px-3 py-1 text-xs rounded bg-slate-100 dark:bg-slate-700">Reportar</button>
      </footer>
    </article>
  )
}
