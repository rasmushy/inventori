import { useMemo } from 'react'
import { Box, Button } from '@chakra-ui/react'
import type { Address, Item } from '../types'
import { extractYear, formatPrice, formatTags } from '../utils/format'

export function ItemDetailModal({
  open,
  item,
  addresses,
  onEdit,
  onDelete,
  onClose,
}: {
  open: boolean
  item: Item | null
  addresses: Address[]
  onEdit: (item: Item) => void
  onDelete: (item: Item) => void
  onClose: () => void
}) {
  const addressLabel = useMemo(() => {
    if (!item) return ''
    if (item.addressId === undefined) return 'Unlocated'
    const a = addresses.find((x) => x.id === item.addressId)
    return a?.label ?? ''
  }, [item, addresses])

  if (!open || !item) return null

  const year = extractYear(item.purchaseDate)
  const thumbUrl = item.images && item.images.length ? item.images[0].url : null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <Box className="modal" role="dialog" aria-modal="true" aria-labelledby="item-detail-title" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3 id="item-detail-title" style={{ margin: 0 }}>{item.name}</h3>
        </header>
        <div className="modal-body" style={{ display: 'grid', gap: '0.75rem' }}>
          <div className="detail-hero" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div className="thumb thumb-xl" aria-label={thumbUrl ? 'Item image' : 'No image'}>
              {thumbUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumbUrl} alt="Item" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} />
              ) : (
                <span className="thumb-placeholder">📦</span>
              )}
            </div>
            <div style={{ flex: 1, display: 'grid', gap: '0.25rem' }}>
              {item.description && <p style={{ margin: 0 }}>{item.description}</p>}
              <div style={{ opacity: 0.9 }}>
                {item.purchasePriceCents !== undefined && <span>{formatPrice(item.purchasePriceCents)} · </span>}
                {year && <span>{year} · </span>}
                <span>{addressLabel}</span>
              </div>
              {item.tags && item.tags.length > 0 && (
                <div style={{ opacity: 0.9 }}>Tags: {formatTags(item.tags)}</div>
              )}
            </div>
          </div>
        </div>
        <footer className="modal-footer" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', marginTop: '1rem' }}>
          <div>
            <Button onClick={() => onDelete(item)} aria-label="Delete item">Delete</Button>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button onClick={() => onEdit(item)} aria-label="Edit item">Edit</Button>
            <Button onClick={onClose} aria-label="Close details">Close</Button>
          </div>
        </footer>
      </Box>
    </div>
  )
}


