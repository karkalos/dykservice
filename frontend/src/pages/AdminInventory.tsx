import { useState, useEffect } from 'react'
import { api } from '../api'

interface InventoryItem {
  id: string
  name: string
  category: string
  sku: string | null
  quantity: number
  minQuantity: number
  supplier: string | null
  unitCost: number | null
  notes: string | null
  updatedAt: string
  createdAt: string
}

const CATEGORIES = [
  'Tatningar',
  'Blixtlas',
  'Skor',
  'Handskar',
  'Ventiler',
  'Lim',
  'Material',
  'Verktyg',
  'Ovrigt',
]

const emptyForm = {
  name: '',
  category: CATEGORIES[0],
  sku: '',
  quantity: 0,
  minQuantity: 2,
  supplier: '',
  unitCost: '',
  notes: '',
}

export default function AdminInventory() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState(emptyForm)
  const [categoryFilter, setCategoryFilter] = useState('')

  const fetchItems = async () => {
    try {
      const data = await api.adminGetInventory()
      setItems(data)
      setLoading(false)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Fel')
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  const handleCreate = async () => {
    try {
      setError('')
      await api.adminCreateInventoryItem({
        ...form,
        unitCost: form.unitCost ? parseInt(form.unitCost) : null,
      })
      setForm(emptyForm)
      setShowForm(false)
      await fetchItems()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Fel vid skapande')
    }
  }

  const handleAdjust = async (id: string, delta: number) => {
    try {
      setError('')
      await api.adminAdjustQuantity(id, delta)
      await fetchItems()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Fel vid justering')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Ta bort "${name}" fran lagret?`)) return
    try {
      setError('')
      await api.adminDeleteInventoryItem(id)
      await fetchItems()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Fel vid borttagning')
    }
  }

  const startEdit = (item: InventoryItem) => {
    setEditingId(item.id)
    setEditForm({
      name: item.name,
      category: item.category,
      sku: item.sku || '',
      quantity: item.quantity,
      minQuantity: item.minQuantity,
      supplier: item.supplier || '',
      unitCost: item.unitCost != null ? String(item.unitCost) : '',
      notes: item.notes || '',
    })
  }

  const handleUpdate = async () => {
    if (!editingId) return
    try {
      setError('')
      await api.adminUpdateInventoryItem(editingId, {
        ...editForm,
        unitCost: editForm.unitCost ? parseInt(editForm.unitCost) : null,
      })
      setEditingId(null)
      await fetchItems()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Fel vid uppdatering')
    }
  }

  if (loading) return <p>Laddar...</p>

  const filtered = categoryFilter
    ? items.filter(i => i.category === categoryFilter)
    : items

  const lowStockCount = items.filter(i => i.quantity <= i.minQuantity).length
  const totalItems = items.length

  const rowBackground = (item: InventoryItem) => {
    if (item.quantity <= item.minQuantity) {
      return item.quantity === 0 ? '#fdd' : '#fff3cd'
    }
    return undefined
  }

  const quantityColor = (item: InventoryItem) => {
    if (item.quantity === 0) return '#dc3545'
    if (item.quantity <= item.minQuantity) return '#e67e22'
    return undefined
  }

  return (
    <div>
      <h1>Lager</h1>

      <div className="card" style={{ marginBottom: 16 }}>
        <strong>{totalItems} artiklar i lager</strong>
        {lowStockCount > 0 && (
          <span style={{ marginLeft: 16, color: '#dc3545' }}>
            | {lowStockCount} artiklar med lagt lager
          </span>
        )}
      </div>

      {error && <p className="error" style={{ marginBottom: 12 }}>{error}</p>}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        <select className="input" style={{ width: 200 }} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="">Alla kategorier</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Avbryt' : 'Lagg till'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h2>Lagg till artikel</h2>
          <div className="grid-3" style={{ marginBottom: 12 }}>
            <div>
              <label className="label">Namn *</label>
              <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Kategori *</label>
              <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">SKU</label>
              <input className="input" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
            </div>
            <div>
              <label className="label">Antal</label>
              <input className="input" type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="label">Minimiantal</label>
              <input className="input" type="number" value={form.minQuantity} onChange={e => setForm({ ...form, minQuantity: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="label">Leverantor</label>
              <input className="input" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} />
            </div>
            <div>
              <label className="label">Enhetspris (kr)</label>
              <input className="input" type="number" value={form.unitCost} onChange={e => setForm({ ...form, unitCost: e.target.value })} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="label">Anteckningar</label>
              <input className="input" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <button className="btn" onClick={handleCreate} disabled={!form.name}>Spara</button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#888' }}>
          Inga artiklar i lagret.
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Namn</th>
                <th>Kategori</th>
                <th>SKU</th>
                <th>Antal</th>
                <th>Min</th>
                <th>Leverantor</th>
                <th>Pris</th>
                <th>Atgarder</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                editingId === item.id ? (
                  <tr key={item.id}>
                    <td><input className="input" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={{ width: 120 }} /></td>
                    <td>
                      <select className="input" value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} style={{ width: 100 }}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </td>
                    <td><input className="input" value={editForm.sku} onChange={e => setEditForm({ ...editForm, sku: e.target.value })} style={{ width: 80 }} /></td>
                    <td><input className="input" type="number" value={editForm.quantity} onChange={e => setEditForm({ ...editForm, quantity: parseInt(e.target.value) || 0 })} style={{ width: 60 }} /></td>
                    <td><input className="input" type="number" value={editForm.minQuantity} onChange={e => setEditForm({ ...editForm, minQuantity: parseInt(e.target.value) || 0 })} style={{ width: 60 }} /></td>
                    <td><input className="input" value={editForm.supplier} onChange={e => setEditForm({ ...editForm, supplier: e.target.value })} style={{ width: 100 }} /></td>
                    <td><input className="input" type="number" value={editForm.unitCost} onChange={e => setEditForm({ ...editForm, unitCost: e.target.value })} style={{ width: 60 }} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn-sm" onClick={handleUpdate}>Spara</button>
                        <button className="btn-sm" onClick={() => setEditingId(null)}>Avbryt</button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={item.id} style={{ background: rowBackground(item) }}>
                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                    <td>{item.category}</td>
                    <td style={{ color: '#888', fontSize: 12 }}>{item.sku || '-'}</td>
                    <td style={{ fontWeight: 600, color: quantityColor(item) }}>{item.quantity}</td>
                    <td style={{ color: '#888' }}>{item.minQuantity}</td>
                    <td>{item.supplier || '-'}</td>
                    <td>{item.unitCost != null ? `${item.unitCost} kr` : '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn-sm" onClick={() => handleAdjust(item.id, -1)} disabled={item.quantity <= 0}>-</button>
                        <button className="btn-sm" onClick={() => handleAdjust(item.id, 1)}>+</button>
                        <button className="btn-sm" onClick={() => startEdit(item)}>Redigera</button>
                        <button className="btn-sm" style={{ color: '#dc3545' }} onClick={() => handleDelete(item.id, item.name)}>Ta bort</button>
                      </div>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
