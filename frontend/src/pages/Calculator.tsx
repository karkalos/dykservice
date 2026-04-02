import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import type { Workshop, ServiceItemResponse, PriceResult } from '../api'

const CATEGORY_LABELS: Record<string, string> = {
  pressure_test: 'Trycktester',
  seal: 'Tatningar',
  zipper: 'Blixtlas',
  boots: 'Skor/Boots',
  ring_system: 'Ringsystem',
  valve: 'Ventiler',
  hood: 'Huva',
  other: 'Ovrigt',
}

const CATEGORY_ORDER = ['pressure_test', 'seal', 'zipper', 'boots', 'ring_system', 'valve', 'hood', 'other']

interface SelectedService {
  serviceName: string;
  quantity: number;
}

export default function Calculator() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [allServices, setAllServices] = useState<ServiceItemResponse[]>([])
  const [selected, setSelected] = useState<Map<string, SelectedService>>(new Map())
  const [urgency, setUrgency] = useState('standard')
  const [results, setResults] = useState<PriceResult[]>([])
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getWorkshops().then(ws => {
      setWorkshops(ws)
      // Deduplicate services by name
      const seen = new Set<string>()
      const deduped: ServiceItemResponse[] = []
      for (const w of ws) {
        for (const s of w.services) {
          if (!seen.has(s.name)) {
            seen.add(s.name)
            deduped.push(s)
          }
        }
      }
      setAllServices(deduped)
      setLoading(false)
    }).catch(e => { setError(e.message); setLoading(false) })
  }, [])

  const calculate = useCallback(async (sel: Map<string, SelectedService>, urg: string) => {
    const services = Array.from(sel.values())
    if (services.length === 0) { setResults([]); return }
    setCalculating(true)
    try {
      const res = await api.calculatePrices(services, urg)
      setResults(res)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Fel vid berakning')
    }
    setCalculating(false)
  }, [])

  const toggleService = (name: string) => {
    const next = new Map(selected)
    if (next.has(name)) {
      next.delete(name)
    } else {
      next.set(name, { serviceName: name, quantity: 1 })
    }
    setSelected(next)
    calculate(next, urgency)
  }

  const setQuantity = (name: string, qty: number) => {
    const next = new Map(selected)
    const entry = next.get(name)
    if (entry) {
      next.set(name, { ...entry, quantity: qty })
      setSelected(next)
      calculate(next, urgency)
    }
  }

  const changeUrgency = (urg: string) => {
    setUrgency(urg)
    calculate(selected, urg)
  }

  // Group services by category
  const grouped = new Map<string, ServiceItemResponse[]>()
  for (const s of allServices) {
    const cat = s.category || 'other'
    if (!grouped.has(cat)) grouped.set(cat, [])
    grouped.get(cat)!.push(s)
  }

  const minTotal = results.length > 0 ? Math.min(...results.map(r => r.total)) : 0

  if (loading) return <p>Laddar...</p>
  if (error && workshops.length === 0) return <p className="error">{error}</p>

  return (
    <div>
      <h1>Priskalkylator</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Valj tjanster och se priser fran {workshops.length} verkstader.</p>

      <div className="card">
        <h2>Valj tjanster</h2>
        {CATEGORY_ORDER.filter(cat => grouped.has(cat)).map(cat => (
          <div key={cat} style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#888', textTransform: 'uppercase', marginBottom: 8 }}>
              {CATEGORY_LABELS[cat] || cat}
            </h3>
            {grouped.get(cat)!.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                  <input type="checkbox" checked={selected.has(s.name)} onChange={() => toggleService(s.name)} />
                  {s.nameSv}
                </label>
                {selected.has(s.name) && s.notes && s.notes.includes('per styck') && (
                  <input
                    type="number" min={1} max={10}
                    value={selected.get(s.name)!.quantity}
                    onChange={e => setQuantity(s.name, Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                    style={{ width: 60, padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', fontSize: 13 }}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Bradskanivå</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { key: 'standard', label: 'Standard' },
            { key: 'priority', label: 'Prioriterad (+40-50%)' },
            { key: 'emergency', label: 'Akut (+100%)' },
          ].map(u => (
            <button key={u.key}
              className={urgency === u.key ? 'btn' : 'btn-outline'}
              onClick={() => changeUrgency(u.key)}>
              {u.label}
            </button>
          ))}
        </div>
      </div>

      {calculating && <p style={{ color: '#888', marginBottom: 16 }}>Beraknar priser...</p>}

      {results.length > 0 && (
        <div>
          <h2>Resultat</h2>
          <div className="grid-2">
            {results.map(r => (
              <div key={r.workshopId} className="card"
                style={r.total === minTotal ? { borderColor: '#28a745', borderWidth: 2 } : {}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 16, marginBottom: 4 }}>{r.workshopName}</h3>
                    <span style={{ fontSize: 13, color: '#888' }}>{r.city}</span>
                  </div>
                  {r.total === minTotal && (
                    <span className="badge badge-green">Lagst pris</span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
                  Garanti: {r.warrantyYears} ar
                </div>
                <table className="table" style={{ marginBottom: 12 }}>
                  <thead>
                    <tr><th>Tjanst</th><th style={{ textAlign: 'right' }}>Pris</th></tr>
                  </thead>
                  <tbody>
                    {r.items.map(item => (
                      <tr key={item.serviceId}>
                        <td>{item.nameSv} {item.quantity > 1 ? `x${item.quantity}` : ''}</td>
                        <td style={{ textAlign: 'right' }}>{item.lineTotal} kr</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ fontSize: 13, color: '#666' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Delsumma</span><span>{r.subtotal} kr</span>
                  </div>
                  {r.urgencySurcharge > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Bradskandepåslag</span><span>+{r.urgencySurcharge} kr</span>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, marginTop: 8, paddingTop: 8, borderTop: '1px solid #eee' }}>
                  <span>Totalt</span><span>{r.total} kr</span>
                </div>
                <Link to={`/boka?workshop=${r.workshopId}`}
                  className="btn" style={{ display: 'block', textAlign: 'center', marginTop: 12, textDecoration: 'none' }}>
                  Boka hos {r.workshopName}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
