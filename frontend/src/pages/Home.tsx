import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <div style={{ textAlign: 'center', padding: '60px 0 40px' }}>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>Jamfor och boka torrdraktsservice</h1>
        <p style={{ fontSize: 18, color: '#666', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
          Se priser, boka online och spara din service hos Sveriges basta draktverkstader.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/kalkylator" className="btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Jamfor priser
          </Link>
          <Link to="/boka" className="btn-outline" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Boka service
          </Link>
        </div>
      </div>

      <div style={{ marginTop: 48 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Sa fungerar det</h2>
        <div className="grid-3">
          {[
            { step: '1', title: 'Valj tjanster', desc: 'Valj vilka tjanster du behover och se priser fran alla verkstader.' },
            { step: '2', title: 'Boka online', desc: 'Boka direkt hos den verkstad som passar dig bast.' },
            { step: '3', title: 'Spara din order', desc: 'Folj statusen pa din service i realtid.' },
          ].map(c => (
            <div key={c.step} className="card" style={{ textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1a1a2e', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
                {c.step}
              </div>
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>{c.title}</h3>
              <p style={{ fontSize: 14, color: '#666' }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
