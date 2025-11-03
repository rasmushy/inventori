import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Input, Textarea, Text } from '@chakra-ui/react'
import type { Address, Item } from '../types'
import { formatTags, parsePrice, parseTags } from '../utils/format'

export interface ItemModalProps {
  open: boolean
  mode: 'create' | 'edit'
  addresses: Address[]
  initial?: Partial<Item>
  onCancel: () => void
  onSave: (data: Partial<Item>) => void
}

export function ItemModal({ open, mode, addresses, initial, onCancel, onSave }: ItemModalProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [price, setPrice] = useState(initial?.purchasePriceCents ? (initial!.purchasePriceCents! / 100).toFixed(2) : '')
  const [tags, setTags] = useState(formatTags(initial?.tags))
  const [purchaseDate, setPurchaseDate] = useState(() => {
    // Expect YYYY-MM-DD for input[type=date]
    if (!initial?.purchaseDate) return ''
    const d = new Date(initial.purchaseDate)
    if (Number.isNaN(d.getTime())) return ''
    const yyyy = d.getUTCFullYear()
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
    const dd = String(d.getUTCDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  })
  const [addressId, setAddressId] = useState<string | ''>(() => {
    if (initial?.addressId === undefined) return ''
    return initial?.addressId ?? ''
  })
  const [errors, setErrors] = useState<{ name?: string; price?: string; date?: string }>({})
  const nameRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!open) return
    setName(initial?.name ?? '')
    setDescription(initial?.description ?? '')
    setPrice(initial?.purchasePriceCents ? (initial!.purchasePriceCents! / 100).toFixed(2) : '')
    setTags(formatTags(initial?.tags))
    if (initial?.purchaseDate) {
      const d = new Date(initial.purchaseDate)
      if (!Number.isNaN(d.getTime())) {
        const yyyy = d.getUTCFullYear()
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
        const dd = String(d.getUTCDate()).padStart(2, '0')
        setPurchaseDate(`${yyyy}-${mm}-${dd}`)
      } else setPurchaseDate('')
    } else setPurchaseDate('')
    setAddressId(initial?.addressId ?? '')
    setErrors({})
    // Autofocus the name field when opening
    setTimeout(() => nameRef.current?.focus(), 0)
  }, [open, initial])

  function isValidDateInput(v: string): boolean {
    if (!v) return true
    // Expect YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false
    const d = new Date(v)
    return !Number.isNaN(d.getTime())
  }

  const canSave = useMemo(() => {
    return name.trim().length > 0 && !errors.price && !errors.date
  }, [name, errors])

  function handleSave() {
    const nextErrors: typeof errors = {}
    if (name.trim().length === 0) nextErrors.name = 'Name is required'
    if (price && parsePrice(price) === undefined) nextErrors.price = 'Enter a valid price (e.g., 12.34)'
    if (!isValidDateInput(purchaseDate)) nextErrors.date = 'Use YYYY-MM-DD format'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      purchasePriceCents: parsePrice(price),
      tags: parseTags(tags),
      purchaseDate: purchaseDate || undefined,
      addressId: addressId || undefined,
    })
  }

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <Box
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-modal-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.stopPropagation()
            onCancel()
          }
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault()
            handleSave()
          }
        }}
      >
        <header className="modal-header">
          <h3 id="item-modal-title" style={{ margin: 0 }}>{mode === 'create' ? 'Add Item' : 'Edit Item'}</h3>
        </header>
        <Box
          as="form"
          className="modal-body"
          style={{ display: 'grid', gap: '0.75rem' }}
          onSubmit={(e) => {
            e.preventDefault()
            handleSave()
          }}
        >
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <Text as="span">Name</Text>
            <Input
              ref={nameRef}
              value={name}
              onChange={(e) => { setName(e.target.value); if (e.target.value.trim()) setErrors((er) => ({ ...er, name: undefined })) }}
              required
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'err-name' : undefined}
            />
            {errors.name && <Text id="err-name" color="red.500">{errors.name}</Text>}
          </label>
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <Text as="span">Description</Text>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </label>
          <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: '1fr 1fr' }}>
            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <Text as="span">Price</Text>
              <Input
                inputMode="decimal"
                placeholder="0.00"
                value={price}
                onChange={(e) => {
                  const v = e.target.value
                  setPrice(v)
                  if (!v || parsePrice(v) !== undefined) setErrors((er) => ({ ...er, price: undefined }))
                  else setErrors((er) => ({ ...er, price: 'Enter a valid price (e.g., 12.34)' }))
                }}
                aria-invalid={!!errors.price}
                aria-describedby={errors.price ? 'err-price' : undefined}
              />
              {errors.price && <Text id="err-price" color="red.500">{errors.price}</Text>}
            </label>
            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <Text as="span">Purchase date</Text>
              <Input
                type="date"
                value={purchaseDate}
                onChange={(e) => {
                  const v = e.target.value
                  setPurchaseDate(v)
                  if (!v) setErrors((er) => ({ ...er, date: undefined }))
                  else if (/^\d{4}-\d{2}-\d{2}$/.test(v)) setErrors((er) => ({ ...er, date: undefined }))
                  else setErrors((er) => ({ ...er, date: 'Use YYYY-MM-DD format' }))
                }}
                aria-invalid={!!errors.date}
                aria-describedby={errors.date ? 'err-date' : undefined}
              />
              {errors.date && <Text id="err-date" color="red.500">{errors.date}</Text>}
            </label>
          </div>
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <Text as="span">Tags (comma separated)</Text>
            <Input placeholder="electronics, warranty" value={tags} onChange={(e) => setTags(e.target.value)} />
          </label>
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <Text as="span">Address</Text>
            <select value={addressId} onChange={(e) => setAddressId(e.target.value)}>
              <option value="">Unlocated</option>
              {addresses.map((a) => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
          </label>
          <footer className="modal-footer" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button type="button" onClick={onCancel}>Cancel (Esc)</Button>
            <Button type="submit" disabled={!canSave} colorScheme="blue">{mode === 'create' ? 'Add' : 'Save'} (Enter)</Button>
          </footer>
        </Box>
      </Box>
    </div>
  )
}


