export default function Home() {
  return (
    <div className="card">
      <h1>Flows Social Studio — Ultra‑Lite</h1>
      <p>This test build skips Wix login and directly connects to your generator at <code>https://flows-image-generator.vercel.app</code>.</p>
      <ul>
        <li><a href="/gallery">Gallery</a> — pulls images & palettes.</li>
        <li><a href="/studio">Studio</a> — simple canvas editor (add text, drag, export PNG).</li>
      </ul>
      <p className="small">When ready, we can swap to the full build with Wix gating.</p>
    </div>
  )
}
