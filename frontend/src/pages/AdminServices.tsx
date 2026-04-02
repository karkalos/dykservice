import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import type { ServiceItemResponse } from '../api'

interface EditingPrice {
  id: string
  value: string
}

const CATEGORIES = ['seal', 'zipper', 'valve', 'test', 'other']

const CATEGORY_LABELS: Record<string, string> = {
  seal: 'Tatningar',
  zipper: 'Blixtlas',
  valve: 'Ventiler',
  test: 'Tester',
  other: 'Ovrigt',
}

export default function AdminServices() {
  const [services, setServices] = useState<ServiceItemResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingPrice, setEditingPrice] = useState<EditingPrice | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newService, setNewService] = useState({
    category: 'seal',
    name: '',
    nameSv: '',
    basePrice: 0,
    notes: '',
  })

  const loadServices = () => {
    setLoading(true)
    api.adminGetServices()
      .then(s => { setServices(s); setLoading(false); setError('') })
      .catch(e => {
        if (e.message.startsWith('401')) {
          setShowLogin(true)
          setLoading(false)
        } else {
          setError(e.message)
          setLoading(false)
        }
      })
  }

  useEffect(() => {
    if (!api.isAdminLoggedIn()) {
      setShowLogin(true)
      setLoading(false)
      return
    }
    loadServices()
  }, [])

  const handleLogin = async () => {
    setLoginError('')
    try {
      const result = await api.adminLogin(username, password)
      setServices(result)
      setShowLogin(false)
      setLoading(false)
    } catch {
      localStorage.removeItem('adminAuth')
      setLoginError('Fel anvandarnamn eller losenord')
    }
  }

  const handlePriceSave = async (id: string) => {
    if (!editingPrice) return
    const price = parseInt(editingPrice.value, 10)
    if (isNaN(price) || price < 0) return
    try {
      await api.adminUpdatePrice(id, price)
      setEditingPrice(null)
      loadServices()
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Ta bort tjansten "${name}"?`)) return
    try {
      await api.adminDeleteService(id)
      loadServices()
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleAddService = async () => {
    if (!newService.name || !newService.nameSv || newService.basePrice <= 0) {
      setError('Fyll i alla obligatoriska falt')
      return
    }
    try {
      await api.adminCreateService(newService)
      setNewService({ category: 'seal', name: '', nameSv: '', basePrice: 0, notes: '' })
      setShowAddForm(false)
      loadServices()
    } catch (e: any) {
      setError(e.message)
    }
  }

  if (showLogin) {
    return (
      <div>
        <h1>Logga in</h1>
        <div className="card" style={{ maxWidth: 400 }}>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Anvandarnamn</label>
            <input className="input" value={username} onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Losenord</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
          {loginError && <p className="error">{loginError}</p>}
          <button className="btn" onClick={handleLogin} style={{ marginTop: 8 }}>Logga in</button>
        </div>
      </div>
    )
  }

  if (loading) return <p>Laddar...</p>

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = services.filter(s => s.category === cat)
    return acc
  }, {} as Record<string, ServiceItemResponse[]>)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1>Hantera tjanster</h1>
          <p style={{ color: '#666' }}>{services.length} tjanster</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/verkstad" className="btn-outline" style={{ textDecoration: 'none' }}>Tillbaka</Link>
          <button className="btn" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Avbryt' : 'Lagg till tjanst'}
          </button>
        </div>
      </div>

      {error && <p className="error" style={{ marginBottom: 16 }}>{error}</p>}

      {showAddForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h2>Ny tjanst</h2>
          <div className="grid-2" style={{ marginBottom: 12 }}>
            <div>
              <label className="label">Kategori</label>
              <select className="input" value={newService.category}
                onChange={e => setNewService({ ...newService, category: e.target.value })}>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c] || c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Pris (SEK)</label>
              <input className="input" type="number" value={newService.basePrice || ''}
                onChange={e => setNewService({ ...newService, basePrice: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <div className="grid-2" style={{ marginBottom: 12 }}>
            <div>
              <label className="label">Namn (engelska)</label>
              <input className="input" value={newService.name}
                onChange={e => setNewService({ ...newService, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Namn (svenska)</label>
              <input className="input" value={newService.nameSv}
                onChange={e => setNewService({ ...newService, nameSv: e.target.value })} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Anteckningar</label>
            <input className="input" value={newService.notes}
              onChange={e => setNewService({ ...newService, notes: e.target.value })} />
          </div>
          <button className="btn-success" onClick={handleAddService}>Spara tjanst</button>
        </div>
      )}

      {CATEGORIES.map(cat => {
        const items = grouped[cat]
        if (!items || items.length === 0) return null
        return (
          <div key={cat} style={{ marginBottom: 24 }}>
            <h2>{CATEGORY_LABELS[cat] || cat}</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Namn (SV)</th>
                    <th>Namn (EN)</th>
                    <th>Pris</th>
                    <th>Anteckningar</th>
                    <th style={{ width: 120 }}>Atgarder</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(s => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 500 }}>{s.nameSv}</td>
                      <td style={{ color: '#666' }}>{s.name}</td>
                      <td>
                        {editingPrice?.id === s.id ? (
                          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                            <input
                              className="input"
                              type="number"
                              value={editingPrice.value}
                              onChange={e => setEditingPrice({ ...editingPrice, value: e.target.value })}
                              onKeyDown={e => e.key === 'Enter' && handlePriceSave(s.id)}
                              style={{ width: 80, padding: '4px 8px' }}
                              autoFocus
                            />
                            <button className="btn-sm" onClick={() => handlePriceSave(s.id)}>OK</button>
                            <button className="btn-sm" onClick={() => setEditingPrice(null)}>X</button>
                          </div>
                        ) : (
                          <span>{s.basePrice} kr</span>
                        )}
                      </td>
                      <td style={{ color: '#888', fontSize: 12 }}>{s.notes || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn-sm"
                            onClick={() => setEditingPrice({ id: s.id, value: String(s.basePrice) })}>
                            Pris
                          </button>
                          <button className="btn-sm" style={{ color: '#dc3545', borderColor: '#dc3545' }}
                            onClick={() => handleDelete(s.id, s.nameSv)}>
                            Ta bort
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}
