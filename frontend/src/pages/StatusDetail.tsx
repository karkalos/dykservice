import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { api } from '../api'
import type { OrderResponse, OrderEventResponse } from '../api'

const ALL_STATUSES = ['created', 'shipped', 'received', 'diagnosed', 'in_progress', 'testing', 'ready', 'returned']

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

export default function StatusDetail() {
  const { orderId } = useParams<{ orderId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [events, setEvents] = useState<OrderEventResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [approving, setApproving] = useState(false)
  const [approved, setApproved] = useState(false)

  const fetchData = useCallback(async () => {
    if (!orderId) return
    try {
      const [o, e] = await Promise.all([api.getOrder(orderId), api.getOrderEvents(orderId)])
      setOrder(o)
      setEvents(e)
      setLoading(false)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Fel')
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    if (!orderId || !order) return
    if (searchParams.get('approve') === 'true' && order.status === 'diagnosed' && !order.diagnosisApproved) {
      handleApprove()
      setSearchParams({}, { replace: true })
    }
  }, [order, searchParams])

  const handleApprove = async () => {
    if (!orderId) return
    setApproving(true)
    try {
      await api.approveDiagnosis(orderId)
      setApproved(true)
      await fetchData()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Fel vid godkännande')
    }
    setApproving(false)
  }

  if (loading) return <p>Laddar...</p>
  if (error) return <p className="error">{error}</p>
  if (!order) return <p>Order hittades inte.</p>

  const currentIdx = ALL_STATUSES.indexOf(order.status)
  const completedStatuses = new Set(events.map(e => e.status))

  return (
    <div>
      <h1>Order {order.id}</h1>

      <div className="card">
        <div className="grid-2">
          <div>
            <div style={{ fontSize: 13, color: '#888' }}>Verkstad</div>
            <div style={{ fontWeight: 600 }}>{order.workshopId}</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#888' }}>Status</div>
            <span className={`badge ${order.status === 'returned' || order.status === 'ready' ? 'badge-green' : 'badge-blue'}`}>
              {STATUS_LABELS[order.status] || order.status}
            </span>
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#888' }}>Dräkt</div>
            <div>{order.suitType || '-'} {order.suitBrand ? `(${order.suitBrand})` : ''}</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#888' }}>Uppskattat pris</div>
            <div>{order.estimatedPrice} kr</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#888' }}>Skapad</div>
            <div>{new Date(order.createdAt).toLocaleDateString('sv-SE')}</div>
          </div>
          {order.urgency && order.urgency !== 'standard' && (
            <div>
              <div style={{ fontSize: 13, color: '#888' }}>Brådskanivå</div>
              <span className="badge badge-yellow">{order.urgency === 'priority' ? 'Prioriterad' : 'Akut'}</span>
            </div>
          )}
        </div>
      </div>

      {order.status === 'diagnosed' && !order.diagnosisApproved && !approved && (
        <div className="card" style={{ border: '2px solid #28a745', marginBottom: 24 }}>
          <h2>Diagnos</h2>
          {order.diagnosisFindings && (
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 16, whiteSpace: 'pre-wrap', fontSize: 14 }}>
              {order.diagnosisFindings}
            </div>
          )}
          {order.diagnosisPrice != null && (
            <div style={{ background: '#1a1a2e', color: '#fff', padding: 16, borderRadius: 8, textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 13, opacity: 0.7 }}>Uppskattat pris</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{order.diagnosisPrice} kr</div>
            </div>
          )}
          {error && <p className="error">{error}</p>}
          <button
            className="btn-success"
            style={{ width: '100%', padding: '14px 32px', fontSize: 16, fontWeight: 700 }}
            onClick={handleApprove}
            disabled={approving}
          >
            {approving ? 'Godkänner...' : 'Godkänn arbete'}
          </button>
        </div>
      )}

      {approved && (
        <div className="card" style={{ background: '#d4edda', border: '2px solid #28a745', marginBottom: 24, textAlign: 'center' }}>
          <h2 style={{ color: '#155724' }}>Tack! Arbetet har godkänts.</h2>
          <p>Vi påbörjar arbetet med din dräkt.</p>
        </div>
      )}

      <h2>Statusförloppet</h2>
      <div className="card">
        <div style={{ position: 'relative', paddingLeft: 32 }}>
          {ALL_STATUSES.map((status, i) => {
            const isCompleted = completedStatuses.has(status)
            const isCurrent = i === currentIdx
            const isFuture = i > currentIdx

            let circleStyle: React.CSSProperties = {
              width: 24, height: 24, borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
              position: 'absolute', left: 0,
            }
            if (isCompleted || (isCurrent && !isFuture)) {
              circleStyle = { ...circleStyle, background: isCurrent ? '#007bff' : '#28a745', color: '#fff' }
            } else {
              circleStyle = { ...circleStyle, background: '#e9ecef', color: '#adb5bd' }
            }

            const event = events.find(e => e.status === status)

            return (
              <div key={status} style={{ position: 'relative', paddingBottom: i < ALL_STATUSES.length - 1 ? 24 : 0, minHeight: 32 }}>
                <div style={circleStyle}>
                  {isCompleted ? '\u2713' : i + 1}
                </div>
                {i < ALL_STATUSES.length - 1 && (
                  <div style={{ position: 'absolute', left: 11, top: 24, bottom: 0, width: 2, background: isCompleted ? '#28a745' : '#e9ecef' }} />
                )}
                <div style={{ paddingLeft: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: isFuture ? '#adb5bd' : '#1a1a2e' }}>
                    {STATUS_LABELS[status]}
                  </div>
                  {event && (
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                      {new Date(event.createdAt).toLocaleString('sv-SE')}
                      {event.message && <span> — {event.message}</span>}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
