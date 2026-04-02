import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import type { Workshop, ServiceItemResponse } from '../api'

const CATEGORY_LABELS: Record<string, string> = {
  pressure_test: 'Trycktester',
  seal: 'Tätningar',
  zipper: 'Blixtlås',
  boots: 'Skor/Boots',
  ring_system: 'Ringsystem',
  valve: 'Ventiler',
  hood: 'Huva',
  other: 'Övrigt',
}

const CATEGORY_ORDER = ['pressure_test', 'seal', 'zipper', 'boots', 'ring_system', 'valve', 'hood', 'other']

export default function PriceList() {
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getMyWorkshop()
      .then(w => { setWorkshop(w); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  if (loading) return <p>Laddar...</p>
  if (error) return <p className="error">{error}</p>
  if (!workshop) return <p>Kunde inte ladda prislistan.</p>

  // Group services by category
  const grouped = new Map<string, ServiceItemResponse[]>()
  for (const s of workshop.services) {
    const cat = s.category || 'other'
    if (!grouped.has(cat)) grouped.set(cat, [])
    grouped.get(cat)!.push(s)
  }

  return (
    <div>
      <h1>Prislista</h1>
      <p style={{ color: '#666', marginBottom: 16 }}>
        Alla priser för {workshop.name}. Garanti: {workshop.warrantyYears} år.
      </p>

      <div className="card" style={{ marginBottom: 24, background: '#f8f9fa' }}>
        <p style={{ fontSize: 14, margin: 0 }}>
          <strong>Prioservice:</strong> +{workshop.prioritySurchargePct}% | <strong>Akutservice:</strong> +{workshop.emergencySurchargePct}%
        </p>
      </div>

      {CATEGORY_ORDER.filter(cat => grouped.has(cat)).map(cat => (
        <div key={cat} className="card" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, marginBottom: 12 }}>{CATEGORY_LABELS[cat] || cat}</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Tjänst</th>
                <th style={{ textAlign: 'right' }}>Pris</th>
                <th>Anmärkning</th>
              </tr>
            </thead>
            <tbody>
              {grouped.get(cat)!.map(s => (
                <tr key={s.id}>
                  <td>{s.nameSv}</td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{s.basePrice} kr</td>
                  <td style={{ color: '#888', fontSize: 13 }}>{s.notes || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Link to="/boka" className="btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
          Boka service
        </Link>
      </div>
    </div>
  )
}
