import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import type { Workshop } from '../api'

export default function Home() {
  const [workshop, setWorkshop] = useState<Workshop | null>(null)

  useEffect(() => {
    api.getWorkshop('subnautica').then(setWorkshop).catch(() => {})
  }, [])

  const services = [
    { title: 'Trycktest & reparationer', desc: 'Vi testar din dräkt och åtgärdar eventuella läckor.' },
    { title: 'Byte av tätningar', desc: 'Nya tätningar för hals, manschetter och dragkedja.' },
    { title: 'Byte av kedja', desc: 'Vi byter dragkedja med originaldelar eller uppgradering.' },
    { title: 'Byte av boots', desc: 'Montering av nya boots i valfri storlek.' },
    { title: 'Installation av ringsystem', desc: 'Uppgradera till ringsystem för enklare på- och avtagning.' },
    { title: 'Övrig service', desc: 'Ventilbyte, huvreparation och andra anpassningar.' },
  ]

  const steps = [
    { step: '1', title: 'Välj tjänster och se priser', desc: 'Se vår kompletta prislista med alla tjänster och priser.' },
    { step: '2', title: 'Boka besök eller skicka din dräkt', desc: 'Besök oss direkt eller skicka din dräkt via post.' },
    { step: '3', title: 'Följ din service i realtid', desc: 'Spåra statusen på din order genom hela processen.' },
  ]

  return (
    <div>
      {/* Hero section */}
      <div style={{ textAlign: 'center', padding: '60px 0 40px' }}>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>Din Marina Dräktverkstad</h1>
        <p style={{ fontSize: 18, color: '#666', marginBottom: 32, maxWidth: 560, margin: '0 auto 32px' }}>
          Vi reparerar och modifierar torr- och våtdräkter med fabrikskvalité. Service via drop-in eller postombud.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/prislista" className="btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Se prislista
          </Link>
          <Link to="/boka" className="btn-outline" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Boka service
          </Link>
        </div>
      </div>

      {/* Services overview */}
      <div style={{ marginTop: 48 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Våra tjänster</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {services.map(s => (
            <div key={s.title} className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: '#666' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ marginTop: 48 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Så fungerar det</h2>
        <div className="grid-3">
          {steps.map(c => (
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

      {/* Contact section */}
      {workshop && (
        <div style={{ marginTop: 48 }}>
          <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Kontakta oss</h2>
          <div className="card">
            <div className="grid-2">
              <div>
                <h3 style={{ fontSize: 16, marginBottom: 12 }}>{workshop.name}</h3>
                <div style={{ fontSize: 14, color: '#666', lineHeight: 1.8 }}>
                  <div>{workshop.address}</div>
                  <div>{workshop.city}</div>
                  <div style={{ marginTop: 8 }}>Telefon: {workshop.phone}</div>
                  <div>E-post: {workshop.email}</div>
                  {workshop.website && <div>Webb: {workshop.website}</div>}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: 16, marginBottom: 12 }}>Öppettider</h3>
                <div style={{ fontSize: 14, color: '#666', lineHeight: 1.8 }}>
                  <div>Måndag–Fredag: 08:00–17:00</div>
                  <div>Lördag: 10:00–14:00</div>
                  <div>Söndag: Stängt</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Distance service footer */}
      <div style={{ marginTop: 48, marginBottom: 48, textAlign: 'center' }}>
        <div className="card" style={{ background: '#f0f4ff' }}>
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>Distansservice</h3>
          <p style={{ fontSize: 14, color: '#666' }}>
            Bor du inte i närheten? Skicka din dräkt till oss via DHL.
          </p>
          <Link to="/boka" className="btn-outline" style={{ textDecoration: 'none', display: 'inline-block', marginTop: 12 }}>
            Läs mer och boka
          </Link>
        </div>
      </div>
    </div>
  )
}
