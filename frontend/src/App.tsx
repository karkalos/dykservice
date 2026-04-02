import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import PriceList from './pages/PriceList'
import Booking from './pages/Booking'
import BookingConfirmation from './pages/BookingConfirmation'
import StatusLookup from './pages/StatusLookup'
import StatusDetail from './pages/StatusDetail'
import WorkshopDashboard from './pages/WorkshopDashboard'
import WorkshopOrder from './pages/WorkshopOrder'
import AdminServices from './pages/AdminServices'
import AdminInvoices from './pages/AdminInvoices'
import AdminInventory from './pages/AdminInventory'

export default function App() {
  const location = useLocation()

  const navLinks = [
    { to: '/prislista', label: 'Prislista' },
    { to: '/boka', label: 'Boka service' },
    { to: '/status', label: 'Spåra order' },
    { to: '/verkstad', label: 'Verkstad' },
  ]

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
      <style>{globalStyles}</style>
      <header style={{ borderBottom: '2px solid #1a1a2e', padding: '16px 0', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#1a1a2e', fontSize: 20, fontWeight: 700 }}>
            DykService
          </Link>
          <nav style={{ display: 'flex', gap: 4 }}>
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className={`nav-link ${location.pathname.startsWith(l.to) ? 'active' : ''}`}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prislista" element={<PriceList />} />
        <Route path="/boka" element={<Booking />} />
        <Route path="/boka/bekraftelse" element={<BookingConfirmation />} />
        <Route path="/status" element={<StatusLookup />} />
        <Route path="/status/:orderId" element={<StatusDetail />} />
        <Route path="/verkstad" element={<WorkshopDashboard />} />
        <Route path="/verkstad/tjanster" element={<AdminServices />} />
        <Route path="/verkstad/fakturor" element={<AdminInvoices />} />
        <Route path="/verkstad/lager" element={<AdminInventory />} />
        <Route path="/verkstad/:orderId" element={<WorkshopOrder />} />
      </Routes>
    </div>
  )
}

const globalStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #fafafa; color: #1a1a2e; }
  .nav-link { padding: 6px 14px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 500; border: 1px solid #ddd; color: #1a1a2e; }
  .nav-link.active { background: #1a1a2e; color: #fff; border-color: #1a1a2e; }
  .btn-sm { padding: 4px 10px; font-size: 12px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: #fff; }
  .btn { padding: 8px 16px; font-size: 14px; cursor: pointer; border: 1px solid #1a1a2e; border-radius: 6px; background: #1a1a2e; color: #fff; font-weight: 500; }
  .btn:hover { opacity: 0.9; }
  .btn-outline { padding: 8px 16px; font-size: 14px; cursor: pointer; border: 1px solid #ccc; border-radius: 6px; background: #fff; color: #1a1a2e; font-weight: 500; }
  .btn-success { padding: 8px 16px; font-size: 14px; cursor: pointer; border: 1px solid #28a745; border-radius: 6px; background: #28a745; color: #fff; font-weight: 500; }
  .btn-success:hover { opacity: 0.9; }
  .card { background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 16px; }
  .input { padding: 8px 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; width: 100%; }
  .label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px; color: #555; }
  .table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .table th { text-align: left; padding: 8px 12px; border-bottom: 2px solid #ddd; font-weight: 600; font-size: 12px; text-transform: uppercase; color: #888; }
  .table td { padding: 8px 12px; border-bottom: 1px solid #eee; }
  .table tr:hover td { background: #f8f8f8; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; }
  .badge-green { background: #d4edda; color: #155724; }
  .badge-yellow { background: #fff3cd; color: #856404; }
  .badge-blue { background: #cce5ff; color: #004085; }
  .badge-gray { background: #e9ecef; color: #495057; }
  h1 { font-size: 28px; margin-bottom: 16px; }
  h2 { font-size: 18px; margin-bottom: 16px; }
  .error { color: #dc3545; font-size: 13px; margin-top: 8px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  select.input { appearance: auto; }
`
