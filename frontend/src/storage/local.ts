// Generate local storage for testing purposes before backend is implemented
// It should include: Users, Addresses, Items
// Users should be able to create, update, and delete their own addresses and items
// Addresses should be able to be shared with other users
// Items should be able to be associated with an address

import type { Address, Item, PaginatedResult } from '../types'
import { generateId } from '../utils/id'

const STORAGE_KEY = 'guest_data_v1'

interface GuestData {
  addresses: Address[]
  items: Item[]
}

function now(): string {
  return new Date().toISOString()
}

function read(): GuestData {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return { addresses: [], items: [] }
  try {
    const parsed = JSON.parse(raw)
    return { addresses: parsed.addresses ?? [], items: parsed.items ?? [] }
  } catch {
    return { addresses: [], items: [] }
  }
}

function write(data: GuestData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// Addresses
export function listAddresses(page = 1, pageSize = 50): PaginatedResult<Address> {
  const { addresses } = read()
  const start = (page - 1) * pageSize
  const items = addresses.slice(start, start + pageSize)
  return { items, total: addresses.length, page, pageSize }
}

export function getAddress(id: string): Address | undefined {
  const { addresses } = read()
  return addresses.find((a) => a.id === id)
}

export function createAddress(input: Partial<Address>): Address {
  const data = read()
  const address: Address = {
    id: generateId(),
    userId: input.userId ?? 'guest',
    label: input.label ?? 'Untitled',
    street: input.street,
    city: input.city,
    postalCode: input.postalCode,
    sharedWith: input.sharedWith ?? [],
    createdAt: now(),
    updatedAt: now(),
  }
  data.addresses.unshift(address)
  write(data)
  return address
}

export function updateAddress(id: string, patch: Partial<Address>): Address | undefined {
  const data = read()
  const idx = data.addresses.findIndex((a) => a.id === id)
  if (idx === -1) return undefined
  const updated: Address = { ...data.addresses[idx], ...patch, updatedAt: now() }
  data.addresses[idx] = updated
  write(data)
  return updated
}

export function shareAddress(id: string, email: string): Address | undefined {
  const data = read()
  const idx = data.addresses.findIndex((a) => a.id === id)
  if (idx === -1) return undefined
  const set = new Set(data.addresses[idx].sharedWith ?? [])
  set.add(email.trim().toLowerCase())
  const updated: Address = { ...data.addresses[idx], sharedWith: Array.from(set), updatedAt: now() }
  data.addresses[idx] = updated
  write(data)
  return updated
}

export function unshareAddress(id: string, email: string): Address | undefined {
  const data = read()
  const idx = data.addresses.findIndex((a) => a.id === id)
  if (idx === -1) return undefined
  const updated: Address = {
    ...data.addresses[idx],
    sharedWith: (data.addresses[idx].sharedWith ?? []).filter((e) => e !== email.trim().toLowerCase()),
    updatedAt: now(),
  }
  data.addresses[idx] = updated
  write(data)
  return updated
}

export function deleteAddress(id: string): void {
  const data = read()
  data.addresses = data.addresses.filter((a) => a.id !== id)
  // Move items to Unlocated (addressId undefined)
  data.items = data.items.map((it) => (it.addressId === id ? { ...it, addressId: undefined, updatedAt: now() } : it))
  write(data)
}

// Items
export function listItems(params: { q?: string; addressId?: string; page?: number; pageSize?: number } = {}): PaginatedResult<Item> {
  const { items } = read()
  const q = params.q?.trim().toLowerCase()
  const filtered = items.filter((it) => {
    if (params.addressId !== undefined) {
      if (params.addressId === '') {
        if (it.addressId !== undefined) return false
      } else if (it.addressId !== params.addressId) return false
    }
    if (!q) return true
    const hay = `${it.name}\n${it.description ?? ''}\n${(it.tags ?? []).join(' ')}`.toLowerCase()
    return hay.includes(q)
  })
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 50
  const start = (page - 1) * pageSize
  const pageItems = filtered.slice(start, start + pageSize)
  return { items: pageItems, total: filtered.length, page, pageSize }
}

export function getItem(id: string): Item | undefined {
  const { items } = read()
  return items.find((i) => i.id === id)
}

export function createItem(input: Partial<Item>): Item {
  const data = read()
  const item: Item = {
    id: generateId(),
    userId: 'guest',
    addressId: input.addressId,
    name: input.name ?? 'Untitled item',
    description: input.description,
    purchaseDate: input.purchaseDate,
    purchasePriceCents: input.purchasePriceCents,
    currency: input.currency,
    tags: input.tags ?? [],
    images: input.images ?? [],
    receipts: input.receipts ?? [],
    createdAt: now(),
    updatedAt: now(),
  }
  data.items.unshift(item)
  write(data)
  return item
}

export function updateItem(id: string, patch: Partial<Item>): Item | undefined {
  const data = read()
  const idx = data.items.findIndex((i) => i.id === id)
  if (idx === -1) return undefined
  const updated: Item = { ...data.items[idx], ...patch, updatedAt: now() }
  data.items[idx] = updated
  write(data)
  return updated
}

export function deleteItem(id: string): void {
  const data = read()
  data.items = data.items.filter((i) => i.id !== id)
  write(data)
}

export function bulkDeleteItems(ids: string[]): void {
  const set = new Set(ids)
  const data = read()
  data.items = data.items.filter((i) => !set.has(i.id))
  write(data)
}


