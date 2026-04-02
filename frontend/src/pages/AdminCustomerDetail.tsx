import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'

const STATUS_LABELS: Record<string, string> = {
  created: 'Skapad',
  shipped: 'Skickad',
  received: 'Mottagen',
  diagnosed: 'Diagnostiserad',
  in_progress: 'Under arbete',
  testing: 'Testning',
  ready: 'Klar',
  returned: 'Returnerad',
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'ready':
    case 'returned': return 'badge badge-green'
    case 'in_progress':
    case 'testing': return 'badge badge-blue'
    case 'created':
    case 'shipped': return 'badge badge-yellow'
    default: return 'badge badge-gray'
  }
}

interface CustomerDetail {
  id: string
  name: string
  email: string
  phone: string
  street: string
  postalCode: string
  city: string
  isBusiness: boolean
  company: string
  orgNr: string
  notes: string
  orders: OrderInfo[]
}

interface OrderInfo {
  id: string
  status: string
  suitType: string
  suitBrand: string
  estimatedPrice: number
  finalPrice: number | null
  createdAt: string
}

export default function AdminCustomerDetail() {
  const { id } = useParams<{ id: string }>()
  const [customer, setCustomer] = useState<CustomerDetail | null>(null)
  const [form, setForm] = useState<Partial<CustomerDetail>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!id) return
    api.adminGetCustomer(id)
      .then(c => {
        setCustomer(c)
        setForm(c)
        setLoading(false)
      })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [id])

  const handleSave = async () => {
    if (!id) return
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await api.adminUpdateCustomer(id, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        street: form.street,
        postalCode: form.postalCode,
        city: form.city,
        isBusiness: form.isBusiness,
        company: form.company,
        orgNr: form.orgNr,
        notes: form.notes,
      })
      setSuccess('Kund uppdaterad!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Laddar...</p>
  if (error && !customer) return <p className="error">{error}</p>
  if (!customer) return <p>Kunden hittades inte.</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>{customer.name}</h1>
        <Link to="/verkstad/kunder" className="btn-outline" style={{ textDecoration: 'none' }}>
          Tillbaka till kunder
        </Link>
      </div>

      <div className="card">
        <h2>Kundinformation</h2>
        <div className="grid-2" style={{ marginBottom: 12 }}>
          <div>
            <label className="label">Namn</label>
            <input className="input" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">E-post</label>
            <input className="input" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Telefon</label>
            <input className="input" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="label">Gatuadress</label>
            <input className="input" value={form.street || ''} onChange={e => setForm({ ...form, street: e.target.value })} />
          </div>
          <div>
            <label className="label">Postnummer</label>
            <input className="input" value={form.postalCode || ''} onChange={e => setForm({ ...form, postalCode: e.target.value })} />
          </div>
          <div>
            <label className="label">Stad</label>
            <input className="input" value={form.city || ''} onChange={e => setForm({ ...form, city: e.target.value })} />
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <input type="checkbox" checked={form.isBusiness || false} onChange={e => setForm({ ...form, isBusiness: e.target.checked })} />
            Foretagskund
          </label>
        </div>

        {form.isBusiness && (
          <div className="grid-2" style={{ marginBottom: 12 }}>
            <div>
              <label className="label">Foretag</label>
              <input className="input" value={form.company || ''} onChange={e => setForm({ ...form, company: e.target.value })} />
            </div>
            <div>
              <label className="label">Org.nr</label>
              <input className="input" value={form.orgNr || ''} onChange={e => setForm({ ...form, orgNr: e.target.value })} />
            </div>
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <label className="label">Interna anteckningar</label>
          <textarea
            className="input"
            rows={3}
            value={form.notes || ''}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            placeholder="Anteckningar om kunden..."
          />
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Sparar...' : 'Spara'}
          </button>
          {success && <span style={{ color: '#28a745', fontSize: 13 }}>{success}</span>}
          {error && <span className="error">{error}</span>}
        </div>
      </div>

      <div className="card">
        <h2>Orderhistorik ({customer.orders.length})</h2>
        {customer.orders.length === 0 ? (
          <p style={{ color: '#888' }}>Inga ordrar.</p>
        ) : (
          <div style={{ overflow: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Order-ID</th>
                  <th>Status</th>
                  <th>Drakt</th>
                  <th>Datum</th>
                  <th>Pris</th>
                </tr>
              </thead>
              <tbody>
                {customer.orders.map(o => (
                  <tr key={o.id}>
                    <td>
                      <Link to={`/verkstad/${o.id}`} style={{ color: '#007bff', textDecoration: 'none', fontWeight: 500 }}>
                        {o.id}
                      </Link>
                    </td>
                    <td><span className={statusBadgeClass(o.status)}>{STATUS_LABELS[o.status] || o.status}</span></td>
                    <td>{o.suitBrand || o.suitType || '-'}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString('sv-SE')}</td>
                    <td>{o.finalPrice ?? o.estimatedPrice} kr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
