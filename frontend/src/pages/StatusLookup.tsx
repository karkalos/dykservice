import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function StatusLookup() {
  const [orderId, setOrderId] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (orderId.trim()) navigate(`/status/${orderId.trim()}`)
  }

  return (
    <div style={{ maxWidth: 500 }}>
      <h1>Spara order</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Ange ditt ordernummer for att se status pa din service.</p>
      <form onSubmit={handleSubmit}>
        <div className="card">
          <label className="label">Ordernummer</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="input"
              placeholder="T.ex. DS-2026-1234"
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
            />
            <button type="submit" className="btn">Sok</button>
          </div>
        </div>
      </form>
    </div>
  )
}
