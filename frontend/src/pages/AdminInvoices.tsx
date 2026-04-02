import { useState, useEffect } from 'react'
import { api } from '../api'

interface Invoice {
  id: string
  orderId: string
  invoiceNumber: string
  customerName: string
  customerEmail: string
  total: number
  vatAmount: number
  paymentStatus: string
  paymentMethod: string
  dueDate: string | null
  createdAt: string
}

function paymentBadgeClass(status: string): string {
  switch (status) {
    case 'paid': return 'badge badge-green'
    case 'unpaid': return 'badge badge-yellow'
    case 'overdue': return 'badge badge-gray'
    default: return 'badge badge-gray'
  }
}

function paymentLabel(status: string): string {
  switch (status) {
    case 'paid': return 'Betald'
    case 'unpaid': return 'Obetald'
    case 'overdue': return 'Förfallen'
    default: return status
  }
}

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchInvoices = async () => {
    try {
      const data = await api.adminGetInvoices()
      setInvoices(data)
      setLoading(false)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Fel')
      setLoading(false)
    }
  }

  useEffect(() => { fetchInvoices() }, [])

  const handleMarkPaid = async (id: string) => {
    try {
      await api.adminMarkInvoicePaid(id)
      await fetchInvoices()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Fel vid uppdatering')
    }
  }

  if (loading) return <p>Laddar...</p>
  if (error) return <p className="error">{error}</p>

  const unpaid = invoices.filter(i => i.paymentStatus === 'unpaid')
  const unpaidTotal = unpaid.reduce((sum, i) => sum + i.total, 0)

  return (
    <div>
      <h1>Fakturor</h1>

      {unpaid.length > 0 && (
        <div className="card" style={{ marginBottom: 24, background: '#fff3cd', border: '1px solid #ffc107' }}>
          <strong>{unpaid.length} obetalda fakturor</strong>, totalt {unpaidTotal} kr
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#888' }}>
          Inga fakturor skapade.
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Fakturanr</th>
                <th>Order</th>
                <th>Kund</th>
                <th>Belopp</th>
                <th>Status</th>
                <th>Förfallodatum</th>
                <th>Åtgärd</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 500 }}>{inv.invoiceNumber}</td>
                  <td>{inv.orderId}</td>
                  <td>{inv.customerName}</td>
                  <td>{inv.total} kr</td>
                  <td>
                    <span className={paymentBadgeClass(inv.paymentStatus)}>
                      {paymentLabel(inv.paymentStatus)}
                    </span>
                  </td>
                  <td>{inv.dueDate || '-'}</td>
                  <td>
                    {inv.paymentStatus === 'unpaid' && (
                      <button className="btn-sm" onClick={() => handleMarkPaid(inv.id)}>
                        Markera betald
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
