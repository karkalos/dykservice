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

function urgencyBadge(urgency: string) {
  if (urgency === 'emergency') return <span className="badge badge-yellow" style={{ fontSize: 11 }}>Akut</span>
  if (urgency === 'priority') return <span className="badge badge-yellow" style={{ fontSize: 11 }}>Prioriterad</span>
  return null
}

function daysSince(dateStr: string): number {
  const created = new Date(dateStr)
  const now = new Date()
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
}

interface DashboardStats {
  ordersToday: number
  activeOrders: number
  ordersByStatus: Record<string, number>
  totalMinutesToday: number
}

const KANBAN_COLUMNS = [
  { key: 'received', label: 'Mottagna', color: '#e3f2fd', statuses: ['created', 'shipped', 'received'] },
  { key: 'diagnosed', label: 'Diagnostiserade', color: '#fff3e0', statuses: ['diagnosed'] },
  { key: 'in_progress', label: 'Under arbete', color: '#e8f5e9', statuses: ['in_progress', 'testing'] },
  { key: 'ready', label: 'Klar', color: '#f3e5f5', statuses: ['ready'] },
]

export default function WorkshopDashboard() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      api.getOrders(),
      api.adminGetDashboardStats().catch(() => null),
    ])
      .then(([o, s]) => {
        setOrders(o)
        setStats(s)
        setLoading(false)
      })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  if (loading) return <p>Laddar...</p>
  if (error) return <p className="error">{error}</p>

  const diagnosedWaiting = (stats?.ordersByStatus?.['diagnosed'] ?? 0)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Verkstadspanel</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/verkstad/tjanster" className="btn-outline" style={{ textDecoration: 'none' }}>Tjanster</Link>
          <Link to="/verkstad/fakturor" className="btn-outline" style={{ textDecoration: 'none' }}>Fakturor</Link>
          <Link to="/verkstad/lager" className="btn-outline" style={{ textDecoration: 'none' }}>Lager</Link>
          <Link to="/verkstad/kunder" className="btn-outline" style={{ textDecoration: 'none' }}>Kunder</Link>
        </div>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#888', fontWeight: 500, marginBottom: 4 }}>Aktiva ordrar</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{stats?.activeOrders ?? '-'}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#888', fontWeight: 500, marginBottom: 4 }}>Nya idag</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{stats?.ordersToday ?? '-'}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#888', fontWeight: 500, marginBottom: 4 }}>Tid idag</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>
            {stats ? `${Math.floor(stats.totalMinutesToday / 60)}h ${stats.totalMinutesToday % 60}m` : '-'}
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#888', fontWeight: 500, marginBottom: 4 }}>Vantande diagnos</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{diagnosedWaiting}</div>
        </div>
      </div>

      {/* Kanban columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, alignItems: 'start' }}>
        {KANBAN_COLUMNS.map(col => {
          const colOrders = orders.filter(o => col.statuses.includes(o.status))
          return (
            <div key={col.key}>
              <div style={{
                background: col.color, borderRadius: 8, padding: '8px 12px', marginBottom: 8,
                fontWeight: 600, fontSize: 14, display: 'flex', justifyContent: 'space-between',
              }}>
                <span>{col.label}</span>
                <span style={{ opacity: 0.6 }}>{colOrders.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {colOrders.length === 0 ? (
                  <div style={{ color: '#aaa', fontSize: 13, textAlign: 'center', padding: 16 }}>Inga ordrar</div>
                ) : colOrders.map(o => (
                  <Link
                    key={o.id}
                    to={`/verkstad/${o.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div className="card" style={{ padding: '12px 14px', cursor: 'pointer', transition: 'box-shadow 0.15s', margin: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, fontSize: 14, color: '#007bff' }}>{o.id}</span>
                        {urgencyBadge(o.urgency)}
                      </div>
                      <div style={{ fontSize: 13, color: '#555' }}>{o.suitBrand || o.suitType || '-'}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                        <span className={`badge badge-gray`} style={{ fontSize: 11 }}>
                          {STATUS_LABELS[o.status] || o.status}
                        </span>
                        <span style={{ fontSize: 11, color: '#999' }}>{daysSince(o.createdAt)} dagar</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
