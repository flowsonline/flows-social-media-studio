'use client'
import { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'

function useQuery(key) {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get(key)
}

export default function Studio() {
  const canvasRef = useRef(null)
  const [canvas, setCanvas] = useState(null)
  const [imgUrl, setImgUrl] = useState(null)
  const [txt, setTxt] = useState('Your text')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const c = new fabric.Canvas('c', { backgroundColor: '#0b1220', width: 900, height: 600 })
    setCanvas(c)
    const u = useQuery('img')
    if (u) {
      setImgUrl(u)
      fabric.Image.fromURL(u, (image) => {
        const scale = Math.min(800 / image.width, 500 / image.height)
        image.scale(scale)
        image.set({ left: 50, top: 50, cornerColor: 'white' })
        c.add(image).setActiveObject(image)
        c.renderAll()
      }, { crossOrigin: 'anonymous' })
    }
    return () => c.dispose()
  }, [])

  function addText() {
    if (!canvas) return
    const t = new fabric.Textbox(txt, { left: 80, top: 80, fill: '#e5e7eb', fontSize: 36 })
    canvas.add(t).setActiveObject(t)
  }

  function addSticker() {
    if (!canvas) return
    const r = new fabric.Rect({ left: 120, top: 120, width: 160, height: 90, fill: '#8b5cf6', rx: 12, ry: 12, opacity:.8 })
    canvas.add(r).setActiveObject(r)
  }

  function exportPNG() {
    if (!canvas) return
    setBusy(true)
    const data = canvas.toDataURL({ format: 'png', quality: 1 })
    const a = document.createElement('a')
    a.href = data
    a.download = 'flows-post.png'
    a.click()
    setBusy(false)
  }

  return (
    <div>
      <h1>Studio</h1>
      <div className="card" style={{display:'grid',gridTemplateColumns:'300px 1fr',gap:16}}>
        <div>
          <label className="small">Image URL</label>
          <input className="input" value={imgUrl || ''} onChange={e=>setImgUrl(e.target.value)} placeholder="Paste an image URL…" />
          <button className="btn" style={{marginTop:10}} onClick={()=>{
            if (!canvas || !imgUrl) return
            fabric.Image.fromURL(imgUrl, (image) => {
              const scale = Math.min(800 / image.width, 500 / image.height)
              image.scale(scale)
              image.set({ left: 50, top: 50 })
              canvas.add(image).setActiveObject(image)
              canvas.renderAll()
            }, { crossOrigin: 'anonymous' })
          }}>Add Image</button>

          <hr style={{border:'none',borderTop:'1px solid #1f2937',margin:'14px 0'}} />

          <label className="small">Text</label>
          <input className="input" value={txt} onChange={e=>setTxt(e.target.value)} />
          <div style={{display:'flex',gap:8,marginTop:10}}>
            <button className="btn" onClick={addText}>Add Text</button>
            <button className="btn" onClick={addSticker}>Add Sticker</button>
          </div>

          <div style={{marginTop:16}}>
            <button className="btn" onClick={exportPNG} disabled={busy}>{busy ? 'Exporting…' : 'Export PNG'}</button>
          </div>

          <p className="small" style={{marginTop:12}}>Tip: pick an image from the <a href="/gallery">Gallery</a> then click a tile to open here.</p>
        </div>

        <div className="card">
          <canvas id="c" ref={canvasRef} style={{width:'100%',height:500,background:'#0b1220'}} />
        </div>
      </div>
    </div>
  )
}
