export function toast(msg, ok = true) {
  const el = document.createElement('div')
  el.className = `fixed bottom-4 left-1/2 -translate-x-1/2 px-3 py-2 rounded-xl text-sm shadow-lg z-50 ${ok?'bg-emerald-600':'bg-rose-600'}`
  el.textContent = msg
  document.body.appendChild(el)
  setTimeout(()=> el.remove(), 2600)
}
