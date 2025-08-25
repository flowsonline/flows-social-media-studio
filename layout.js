export const metadata = {
  title: 'Flows Social Studio (Ultra‑Lite)',
  description: 'Gallery + Canvas editor connected to flows-image-generator',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <span style={{fontWeight:700}}>Flows Studio</span>
          </div>
          <nav>
            <a href="/">Home</a>
            <a href="/gallery">Gallery</a>
            <a href="/studio">Studio</a>
          </nav>
        </header>
        <div className="container">{children}</div>
        <footer>Test mode (no Wix). Connects to flows-image-generator.</footer>
        <link rel="stylesheet" href="/app/globals.css" />
      </body>
    </html>
  )
}
