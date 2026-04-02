import { Link, useSearchParams } from 'react-router-dom'

export default function BookingConfirmation() {
  const [params] = useSearchParams()
  const orderId = params.get('order') || ''

  return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>&#10003;</div>
      <h1>Tack for din bokning!</h1>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 16 }}>
        Din bokning har registrerats.
      </p>
      {orderId && (
        <div className="card" style={{ maxWidth: 400, margin: '0 auto', marginBottom: 24 }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Ditt ordernummer</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{orderId}</div>
        </div>
      )}
      {orderId && (
        <Link to={`/status/${orderId}`} className="btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
          Spara din order &rarr;
        </Link>
      )}
    </div>
  )
}
