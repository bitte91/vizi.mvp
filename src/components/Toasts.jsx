import React, { useEffect, useState } from 'react'

export function AppToasts() {
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    const handler = (e) => {
      setMsg(e.detail)
      clearTimeout(window.__toastTimer)
      window.__toastTimer = setTimeout(() => setMsg(null), 3000)
    }
    window.addEventListener('toast', handler)
    return () => window.removeEventListener('toast', handler)
  }, [])

  if (!msg) return null
  return (
    <div className="fixed bottom-20 left-0 right-0 flex justify-center">
      <div className="px-4 py-2 bg-black/85 text-white rounded-lg shadow-lg text-sm">{msg}</div>
    </div>
  )
}

export function toast(text) {
  window.dispatchEvent(new CustomEvent('toast', { detail: text }))
}
