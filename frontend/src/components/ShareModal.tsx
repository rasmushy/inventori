import { useState } from 'react'
import type { Address } from '../types'
import { Box, Button, Input } from '@chakra-ui/react'

export function ShareModal({ open, address, onAdd, onRemove, onClose }: {
    open: boolean
    address: Address | null
    onAdd: (email: string) => void
    onRemove: (email: string) => void
    onClose: () => void
}) {
    const [email, setEmail] = useState('')
    if (!open || !address) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <Box className="modal" role="dialog" aria-modal="true" aria-labelledby="share-title" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h3 id="share-title" style={{ margin: 0 }}>Share "{address.label}"</h3>
                </header>
                <div className="modal-body" style={{ display: 'grid', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Input type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Button onClick={() => { if (email.trim()) { onAdd(email.trim().toLowerCase()); setEmail('') } }}>Add</Button>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
                        {(address.sharedWith ?? []).map((e) => (
                            <li key={e} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span style={{ flex: 1 }}>{e}</span>
                                <Button onClick={() => onRemove(e)}>Remove</Button>
                            </li>
                        ))}
                        {(address.sharedWith ?? []).length === 0 && <li>No shares yet.</li>}
                    </ul>
                </div>
                <footer className="modal-footer" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <Button onClick={onClose}>Close</Button>
                </footer>
            </Box>
        </div>
    )
}


