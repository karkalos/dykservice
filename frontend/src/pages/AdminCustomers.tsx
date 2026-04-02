import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

interface CustomerRow {
  id: string
  name: string
  email: string
  phone: string
  isBusiness: boolean
  company: string | null
  orderCount: number
  lastOrderDate: string | null
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<CustomerRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = () => {
    setLoading(true)
    api.adminGetCustomers()
      .then(c => { setCustomers(c); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }

  const handleSearch = (q: string) => {
    setSearch(q)
    if (q.trim().length === 0) {
      loadCustomers()
      return
    }
    if (q.trim().length < 2) return
    api.adminSearchCustomers(q.trim())
      .then(c => setCustomers(c))
      .catch(e => setError(e.message))
  }

  if (loading) return <p>Laddar...</p>
  if (error) return <p className="error">{error}</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1>Kunder</h1>
          <p style={{ color: '#666' }}>{customers.length} kunder totalt</p>
        </div>
        <Link to="/verkstad" className="btn-outline" style={{ textDecoration: 'none' }}>
          Tillbaka
        </Link>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <input
          className="input"
          type="text"
          placeholder="Sok pa namn, e-post eller telefon..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>

      {customers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#888' }}>
          Inga kunder hittades.
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Namn</th>
                <th>E-post</th>
                <th>Telefon</th>
                <th>Foretag</th>
                <th>Ordrar</th>
                <th>Senaste order</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id}>
                  <td>
                    <Link to={`/verkstad/kunder/${c.id}`} style={{ color: '#007bff', textDecoration: 'none', fontWeight: 500 }}>
                      {c.name}
                    </Link>
                  </td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.isBusiness && c.company ? c.company : '-'}</td>
                  <td>{c.orderCount}</td>
                  <td>{c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString('sv-SE') : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
