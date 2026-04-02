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

  const [diagFindings, setDiagFindings] = useState('')
  const [diagItems, setDiagItems] = useState('')
  const [diagPrice, setDiagPrice] = useState(0)
  const [diagSubmitting, setDiagSubmitting] = useState(false)

  const [invoiceCreating, setInvoiceCreating] = useState(false)
  const [invoiceResult, setInvoiceResult] = useState<any>(null)

  const [timeEntries, setTimeEntries] = useState<any[]>([])
  const [timeDesc, setTimeDesc] = useState('')
  const [timeMinutes, setTimeMinutes] = useState(0)
  const [timeSaving, setTimeSaving] = useState(false)

  const fetchData = useCallback(async () => {
    if (!orderId) return
    try {
      const [o, e, t] = await Promise.all([api.getOrder(orderId), api.getOrderEvents(orderId), api.getTimeEntries(orderId)])
      setOrder(o)
      setEvents(e)
      setTimeEntries(t)
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

  const handleDiagnosisSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId) return
    setDiagSubmitting(true)
    setError('')
    try {
      await api.submitDiagnosis(orderId, diagFindings, diagItems, diagPrice)
      setDiagFindings('')
      setDiagItems('')
      setDiagPrice(0)
      await fetchData()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fel vid inskickning av diagnos')
    }
    setDiagSubmitting(false)
  }

  const handleGenerateInvoice = async () => {
    if (!orderId) return
    setInvoiceCreating(true)
    setError('')
    try {
      const inv = await api.adminGenerateInvoice(orderId)
      setInvoiceResult(inv)
      await fetchData()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fel vid fakturaskapande')
    }
    setInvoiceCreating(false)
  }

  const handleAddTime = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId || timeMinutes <= 0) return
    setTimeSaving(true)
    setError('')
    try {
      await api.addTimeEntry(orderId, timeDesc, timeMinutes)
      setTimeDesc('')
      setTimeMinutes(0)
      await fetchData()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fel vid tidsregistrering')
    }
    setTimeSaving(false)
  }

  if (loading) return <p>Laddar...</p>
  if (error && !order) return <p className="error">{error}</p>
  if (!order) return <p>Order hittades inte.</p>

  return (
    <div>
      <h1>Order {order.id}</h1>

      {order.status === 'received' && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h2>Skicka diagnos</h2>
          <form onSubmit={handleDiagnosisSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label className="label">Vad hittade du?</label>
              <textarea className="input" rows={4} value={diagFindings} onChange={e => setDiagFindings(e.target.value)} style={{ resize: 'vertical' }} required />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="label">Rekommenderade åtgärder</label>
              <textarea className="input" rows={3} value={diagItems} onChange={e => setDiagItems(e.target.value)} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="label">Uppdaterat pris (kr)</label>
              <input className="input" type="number" min={0} value={diagPrice} onChange={e => setDiagPrice(Number(e.target.value))} required />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn-success" disabled={diagSubmitting}>
              {diagSubmitting ? 'Skickar...' : 'Skicka diagnos till kund'}
            </button>
          </form>
        </div>
      )}

      {order.status === 'diagnosed' && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h2>Diagnos</h2>
          {order.diagnosisFindings && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>Resultat</div>
              <div style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>{order.diagnosisFindings}</div>
            </div>
          )}
          {order.diagnosisItems && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>Rekommenderade åtgärder</div>
              <div style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>{order.diagnosisItems}</div>
            </div>
          )}
          {order.diagnosisPrice != null && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>Uppdaterat pris</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{order.diagnosisPrice} kr</div>
            </div>
          )}
          <div>
            <span className={`badge ${order.diagnosisApproved ? 'badge-green' : 'badge-yellow'}`}>
              {order.diagnosisApproved ? 'Kunden har godkänt' : 'Väntar på kundens godkännande'}
            </span>
          </div>
        </div>
      )}

      {(order.status === 'ready' || order.status === 'returned') && !invoiceResult && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h2>Faktura</h2>
          <p style={{ marginBottom: 12, fontSize: 14, color: '#555' }}>Ordern är klar. Skapa en faktura till kunden.</p>
          <button className="btn-success" onClick={handleGenerateInvoice} disabled={invoiceCreating}>
            {invoiceCreating ? 'Skapar...' : 'Skapa faktura'}
          </button>
        </div>
      )}

      {invoiceResult && (
        <div className="card" style={{ marginBottom: 24, background: '#d4edda', border: '1px solid #28a745' }}>
          <h2>Faktura skapad</h2>
          <table style={{ fontSize: 14 }}>
            <tbody>
              <tr><td style={{ padding: '4px 16px 4px 0', color: '#555', fontWeight: 500 }}>Fakturanr</td><td>{invoiceResult.invoiceNumber}</td></tr>
              <tr><td style={{ padding: '4px 16px 4px 0', color: '#555', fontWeight: 500 }}>Belopp</td><td>{invoiceResult.total} kr</td></tr>
              <tr><td style={{ padding: '4px 16px 4px 0', color: '#555', fontWeight: 500 }}>Varav moms</td><td>{invoiceResult.vatAmount} kr</td></tr>
              <tr><td style={{ padding: '4px 16px 4px 0', color: '#555', fontWeight: 500 }}>Förfallodatum</td><td>{invoiceResult.dueDate || '-'}</td></tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <h2>Orderdetaljer</h2>
          <table style={{ fontSize: 14 }}>
            <tbody>
              {[
                ['Verkstad', order.workshopId],
                ['Typ', order.bookingType === 'mail_in' ? 'Postförskickning' : 'Besök'],
                ['Dräkt', `${order.suitType || '-'} ${order.suitBrand ? `(${order.suitBrand})` : ''}`],
                ['Brådskanivå', order.urgency || 'standard'],
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

      <div className="card" style={{ marginBottom: 24 }}>
        <h2>Tidsrapportering</h2>
        {(() => {
          const totalMin = timeEntries.reduce((sum: number, te: any) => sum + te.minutes, 0)
          const h = Math.floor(totalMin / 60)
          const m = totalMin % 60
          return (
            <div style={{ marginBottom: 12, fontWeight: 600, fontSize: 14 }}>
              Totalt: {totalMin} min ({h} timmar {m} min)
            </div>
          )
        })()}
        {timeEntries.length > 0 && (
          <table className="table" style={{ marginBottom: 16 }}>
            <thead>
              <tr>
                <th>Beskrivning</th>
                <th>Minuter</th>
                <th>Datum</th>
              </tr>
            </thead>
            <tbody>
              {timeEntries.map((te: any) => (
                <tr key={te.id}>
                  <td>{te.description || '-'}</td>
                  <td>{te.minutes}</td>
                  <td>{new Date(te.createdAt).toLocaleString('sv-SE')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <h3 style={{ marginBottom: 8 }}>Lagg till tid</h3>
        <form onSubmit={handleAddTime} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label className="label">Beskrivning</label>
            <input className="input" value={timeDesc} onChange={e => setTimeDesc(e.target.value)} placeholder="Vad gjordes?" />
          </div>
          <div style={{ width: 100 }}>
            <label className="label">Minuter</label>
            <input className="input" type="number" min={1} value={timeMinutes || ''} onChange={e => setTimeMinutes(Number(e.target.value))} />
          </div>
          <button type="submit" className="btn-success" disabled={timeSaving || timeMinutes <= 0} style={{ height: 40 }}>
            {timeSaving ? 'Sparar...' : 'Spara'}
          </button>
        </form>
      </div>

      <h2>Händelser</h2>
      <div className="card">
        {events.length === 0 ? (
          <p style={{ color: '#888' }}>Inga händelser ännu.</p>
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
