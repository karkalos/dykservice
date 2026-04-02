import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../api'
import type { Workshop } from '../api'

export default function Booking() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const workshopId = params.get('workshop') || ''

  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [bookingType, setBookingType] = useState('visit')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [city, setCity] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!workshopId) { setLoading(false); return }
    api.getWorkshop(workshopId).then(w => {
      setWorkshop(w)
      setLoading(false)
    }).catch(e => { setError(e.message); setLoading(false) })
  }, [workshopId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!workshopId) { setError('Ingen verkstad vald'); return }
    setSubmitting(true)
    setError('')
    try {
      const res = await api.createBooking({
        workshopId,
        bookingType: bookingType === 'mail' ? 'mail_in' : 'in_person',
        suitType: 'drysuit',
        suitBrand: '',
        items: '[]',
        urgency: 'standard',
        estimatedPrice: 0,
        notes,
        paymentMethod: 'invoice',
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        street: bookingType === 'mail' ? street : '',
        postalCode: bookingType === 'mail' ? postalCode : '',
        city: bookingType === 'mail' ? city : '',
        isBusiness: false,
        company: '',
        orgNr: '',
      })
      navigate(`/boka/bekraftelse?order=${res.orderId}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Nagot gick fel')
      setSubmitting(false)
    }
  }

  if (loading) return <p>Laddar...</p>
  if (!workshopId) return (
    <div>
      <h1>Boka service</h1>
      <p style={{ color: '#666', marginBottom: 16 }}>Valj en verkstad forst via priskalkylatorn.</p>
      <a href="/kalkylator" className="btn" style={{ textDecoration: 'none', display: 'inline-block' }}>Ga till priskalkylatorn</a>
    </div>
  )

  return (
    <div style={{ maxWidth: 600 }}>
      <h1>Boka service</h1>
      {workshop && (
        <p style={{ color: '#666', marginBottom: 24 }}>
          Bokning hos <strong>{workshop.name}</strong>, {workshop.city}
        </p>
      )}

      <div className="card">
        <h2>Typ av bokning</h2>
        <div className="grid-2">
          <div
            onClick={() => setBookingType('visit')}
            className="card"
            style={{ cursor: 'pointer', borderColor: bookingType === 'visit' ? '#1a1a2e' : '#e0e0e0', borderWidth: 2, textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Besok verkstaden</div>
            <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Lamna in din drakt personligen</div>
          </div>
          <div
            onClick={() => workshop?.hasMailIn ? setBookingType('mail') : undefined}
            className="card"
            style={{
              cursor: workshop?.hasMailIn ? 'pointer' : 'not-allowed',
              borderColor: bookingType === 'mail' ? '#1a1a2e' : '#e0e0e0',
              borderWidth: 2,
              textAlign: 'center',
              opacity: workshop?.hasMailIn ? 1 : 0.5,
            }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Skicka med post</div>
            <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
              {workshop?.hasMailIn ? 'Skicka din drakt med posten' : 'Ej tillgangligt'}
            </div>
          </div>
        </div>
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

          {bookingType === 'mail' && (
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

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn" disabled={submitting} style={{ marginTop: 8 }}>
          {submitting ? 'Bokar...' : 'Bekrafta bokning'}
        </button>
      </form>
    </div>
  )
}
