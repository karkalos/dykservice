import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

interface SelectedService {
  service: ServiceItemResponse
  quantity: number
}

export default function Booking() {
  const navigate = useNavigate()

  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [bookingType, setBookingType] = useState('drop_in')
  const [selected, setSelected] = useState<Map<string, SelectedService>>(new Map())
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [city, setCity] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    api.getMyWorkshop()
      .then(w => { setWorkshop(w); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  const toggleService = (service: ServiceItemResponse) => {
    const next = new Map(selected)
    if (next.has(service.name)) {
      next.delete(service.name)
    } else {
      next.set(service.name, { service, quantity: 1 })
    }
    setSelected(next)
  }

  const setQuantity = (serviceName: string, qty: number) => {
    const next = new Map(selected)
    const entry = next.get(serviceName)
    if (entry) {
      next.set(serviceName, { ...entry, quantity: qty })
      setSelected(next)
    }
  }

  const estimatedTotal = Array.from(selected.values()).reduce(
    (sum, s) => sum + s.service.basePrice * s.quantity, 0
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const items = Array.from(selected.values()).map(s => ({
        serviceName: s.service.name,
        quantity: s.quantity,
      }))
      const res = await api.createBooking({
        workshopId: 'subnautica',
        bookingType: bookingType === 'mail_in' ? 'mail_in' : 'drop_in',
        suitType: 'drysuit',
        suitBrand: '',
        items: JSON.stringify(items),
        urgency: 'standard',
        estimatedPrice: estimatedTotal,
        notes,
        paymentMethod: 'invoice',
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        street: bookingType === 'mail_in' ? street : '',
        postalCode: bookingType === 'mail_in' ? postalCode : '',
        city: bookingType === 'mail_in' ? city : '',
        isBusiness: false,
        company: '',
        orgNr: '',
      })
      navigate(`/boka/bekraftelse?order=${res.orderId}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Något gick fel')
      setSubmitting(false)
    }
  }

  if (loading) return <p>Laddar...</p>
  if (error && !workshop) return <p className="error">{error}</p>

  // Group services by category
  const grouped = new Map<string, ServiceItemResponse[]>()
  if (workshop) {
    for (const s of workshop.services) {
      const cat = s.category || 'other'
      if (!grouped.has(cat)) grouped.set(cat, [])
      grouped.get(cat)!.push(s)
    }
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h1>Boka service</h1>
      {workshop && (
        <p style={{ color: '#666', marginBottom: 24 }}>
          <strong>{workshop.name}</strong> — {workshop.address}, {workshop.city}
        </p>
      )}

      <div className="card">
        <h2>Typ av bokning</h2>
        <div className="grid-2">
          <div
            onClick={() => setBookingType('drop_in')}
            className="card"
            style={{ cursor: 'pointer', borderColor: bookingType === 'drop_in' ? '#1a1a2e' : '#e0e0e0', borderWidth: 2, textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Besök verkstaden</div>
            <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Lämna in din dräkt personligen</div>
          </div>
          <div
            onClick={() => workshop?.hasMailIn ? setBookingType('mail_in') : undefined}
            className="card"
            style={{
              cursor: workshop?.hasMailIn ? 'pointer' : 'not-allowed',
              borderColor: bookingType === 'mail_in' ? '#1a1a2e' : '#e0e0e0',
              borderWidth: 2,
              textAlign: 'center',
              opacity: workshop?.hasMailIn ? 1 : 0.5,
            }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Skicka med post</div>
            <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
              {workshop?.hasMailIn ? 'Skicka din dräkt med posten' : 'Ej tillgängligt'}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Välj tjänster</h2>
        {CATEGORY_ORDER.filter(cat => grouped.has(cat)).map(cat => (
          <div key={cat} style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#888', textTransform: 'uppercase', marginBottom: 8 }}>
              {CATEGORY_LABELS[cat] || cat}
            </h3>
            {grouped.get(cat)!.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, flex: 1 }}>
                  <input type="checkbox" checked={selected.has(s.name)} onChange={() => toggleService(s)} />
                  {s.nameSv}
                  <span style={{ color: '#888', fontSize: 13, marginLeft: 'auto' }}>{s.basePrice} kr</span>
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

      <form onSubmit={handleSubmit}>
        <div className="card">
          <h2>Kontaktuppgifter</h2>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Namn *</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="label">E-post *</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Telefon *</label>
            <input className="input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>

          {bookingType === 'mail_in' && (
            <>
              <h2 style={{ marginTop: 16 }}>Leveransadress</h2>
              <div style={{ marginBottom: 12 }}>
                <label className="label">Gatuadress *</label>
                <input className="input" value={street} onChange={e => setStreet(e.target.value)} required />
              </div>
              <div className="grid-2">
                <div>
                  <label className="label">Postnummer *</label>
                  <input className="input" value={postalCode} onChange={e => setPostalCode(e.target.value)} required />
                </div>
                <div>
                  <label className="label">Ort *</label>
                  <input className="input" value={city} onChange={e => setCity(e.target.value)} required />
                </div>
              </div>
            </>
          )}

          <div style={{ marginTop: 12 }}>
            <label className="label">Meddelande (valfritt)</label>
            <textarea className="input" rows={3} value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: 'vertical' }} />
          </div>
        </div>

        {selected.size > 0 && (
          <div className="card" style={{ background: '#f8f9fa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16 }}>
              <span>Uppskattat pris</span>
              <span>{estimatedTotal} kr</span>
            </div>
            <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Slutpriset kan variera beroende på dräktens skick.</p>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn" disabled={submitting} style={{ marginTop: 8 }}>
          {submitting ? 'Bokar...' : 'Bekräfta bokning'}
        </button>
      </form>
    </div>
  )
}
