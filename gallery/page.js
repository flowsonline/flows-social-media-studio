'use client'
import { useEffect, useState } from 'react'

const GEN_BASE = 'https://flows-image-generator.vercel.app'

export default function Gallery() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      const fallbacks = [`${GEN_BASE}/api/gallery`, `${GEN_BASE}/api/history`, `${GEN_BASE}/api/images`]
      for (const url of fallbacks) {
        try {
          const res = await fetch(url, { cache: 'no-store' })
          if (res.ok) {
            const data = await res.json()
            const images = data.images || data || []
            setItems(images)
            setLoading(false)
            return
          }
        } catch (e) {}
      }
      setError('Could not load images from the generator.')
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <h1>Gallery</h1>
      {loading && <p>Loading images…</p>}
      {error && <p style={{color:'#f87171'}}>{error}</p>}
      <div className="grid">
        {items.map((item, i) => {
          const src = item.url || item.imageUrl || item.src || item
          return (
            <a href={`/studio?img=${encodeURIComponent(src)}`} key={i} className="card">
              <img src={src} alt="gen" />
              <div className="small" style={{marginTop:8}}>{src?.slice(0,80)}</div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
