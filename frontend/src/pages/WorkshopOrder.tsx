import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
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

export default function WorkshopOrder() {
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [events, setEvents] = useState<OrderEventResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [newStatus, setNewStatus] = useState('')
  const [message, setMessage] = useState('')
  const [updating, setUpdating] = useState(false)

  const fetchData = useCallback(async () => {
    if (!orderId) return
    try {
      const [o, e] = await Promise.all([api.getOrder(orderId), api.getOrderEvents(orderId)])
      setOrder(o)
      setEvents(e)
      setNewStatus(o.status)
      setLoading(false)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Fel')
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => { fetchData() }, [fetchData])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId || !newStatus) return
    setUpdating(true)
    setError('')
    try {
      await api.updateOrderStatus(orderId, newStatus, message)
      setMessage('')
      await fetchData()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fel vid uppdatering')
    }
    setUpdating(false)
  }

  if (loading) return <p>Laddar...</p>
  if (error && !order) return <p className="error">{error}</p>
  if (!order) return <p>Order hittades inte.</p>

  return (
    <div>
      <h1>Order {order.id}</h1>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <h2>Orderdetaljer</h2>
          <table style={{ fontSize: 14 }}>
            <tbody>
              {[
                ['Verkstad', order.workshopId],
                ['Typ', order.bookingType === 'mail_in' ? 'Postforskickning' : 'Besok'],
                ['Drakt', `${order.suitType || '-'} ${order.suitBrand ? `(${order.suitBrand})` : ''}`],
                ['Bradskaniva', order.urgency || 'standard'],
                ['Uppskattat pris', `${order.estimatedPrice} kr`],
                ['Slutpris', order.finalPrice != null ? `${order.finalPrice} kr` : '-'],
                ['Betalstatus', order.paymentStatus || '-'],
                ['Skapad', new Date(order.createdAt).toLocaleString('sv-SE')],
              ].map(([label, value]) => (
                <tr key={label}>
                  <td style={{ padding: '4px 16px 4px 0', color: '#888', fontWeight: 500 }}>{label}</td>
                  <td style={{ padding: '4px 0' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {order.notes && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>Meddelande</div>
              <div style={{ fontSize: 14 }}>{order.notes}</div>
            </div>
          )}
        </div>

        <div className="card">
          <h2>Uppdatera status</h2>
          <form onSubmit={handleUpdate}>
            <div style={{ marginBottom: 12 }}>
              <label className="label">Ny status</label>
              <select className="input" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                {ALL_STATUSES.map(s => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="label">Meddelande</label>
              <textarea className="input" rows={3} value={message} onChange={e => setMessage(e.target.value)} style={{ resize: 'vertical' }} />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn-success" disabled={updating}>
              {updating ? 'Uppdaterar...' : 'Uppdatera status'}
            </button>
          </form>
        </div>
      </div>

      <h2>Handelser</h2>
      <div className="card">
        {events.length === 0 ? (
          <p style={{ color: '#888' }}>Inga handelser annu.</p>
        ) : (
          <div style={{ position: 'relative', paddingLeft: 32 }}>
            {events.map((ev, i) => (
              <div key={i} style={{ position: 'relative', paddingBottom: i < events.length - 1 ? 20 : 0, minHeight: 32 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', background: '#28a745', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
                  position: 'absolute', left: 0,
                }}>
                  &#10003;
                </div>
                {i < events.length - 1 && (
                  <div style={{ position: 'absolute', left: 11, top: 24, bottom: 0, width: 2, background: '#28a745' }} />
                )}
                <div style={{ paddingLeft: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{STATUS_LABELS[ev.status] || ev.status}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                    {new Date(ev.createdAt).toLocaleString('sv-SE')}
                    {ev.message && <span> — {ev.message}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
