import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import type { OrderResponse } from '../api'

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

export default function WorkshopDashboard() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getOrders()
      .then(o => { setOrders(o); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  if (loading) return <p>Laddar...</p>
  if (error) return <p className="error">{error}</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1>Verkstadspanel</h1>
          <p style={{ color: '#666' }}>{orders.length} ordrar totalt</p>
        </div>
        <Link to="/verkstad/tjanster" className="btn-outline" style={{ textDecoration: 'none' }}>
          Hantera tjanster
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#888' }}>
          Inga ordrar ännu.
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Order-ID</th>
                <th>Dräkt</th>
                <th>Status</th>
                <th>Brådskanivå</th>
                <th>Skapad</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>
                    <Link to={`/verkstad/${o.id}`} style={{ color: '#007bff', textDecoration: 'none', fontWeight: 500 }}>
                      {o.id}
                    </Link>
                  </td>
                  <td>{o.suitBrand || o.suitType || '-'}</td>
                  <td><span className={statusBadgeClass(o.status)}>{STATUS_LABELS[o.status] || o.status}</span></td>
                  <td>
                    {o.urgency && o.urgency !== 'standard' ? (
                      <span className="badge badge-yellow">{o.urgency === 'priority' ? 'Prioriterad' : 'Akut'}</span>
                    ) : '-'}
                  </td>
                  <td>{new Date(o.createdAt).toLocaleDateString('sv-SE')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
