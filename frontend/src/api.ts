import type { Item, PaginatedResult, User, Address, ApiError } from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

async function request<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
    const response = await fetch(input, {
        headers: {
            'Content-Type': 'application/json',
            ...init?.headers,
        },
        credentials: 'include',
        ...init,
    })

    if (!response.ok) {
        const errorBody = await safeJson(response)
        const err: ApiError = {
            status: response.status,
            message: (errorBody as any)?.message ?? response.statusText,
            details: errorBody,

        }
        throw err
    }

    return (await safeJson(response)) as T
}

async function safeJson(res: Response): Promise<unknown> {
    const text = await res.text()
    if (!text) return null
    try {
        return JSON.parse(text)
    } catch {
        return text
    }
}

export const api = {
    me(): Promise<User | null> {
        return request<User | null>(`${API_BASE_URL}/auth/me`)
    },
    login(email: string, password: string): Promise<User> {
        return request<User>(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        })
    },
    signup(email: string, password: string): Promise<User> {
        return request<User>(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        })
    },
    logout(): Promise<void> {
        return request<void>(`${API_BASE_URL}/auth/logout`, { method: 'POST' })
    },

    listAddresses(page = 1, pagesize = 20): Promise<PaginatedResult<Address>> {
        const params = new URLSearchParams({
            page: String(page),
            pageSize: String(pagesize),
        })
        return request<PaginatedResult<Address>>(`${API_BASE_URL}/addresses?${params}`)
    },
    getAddress(id: string): Promise<Address> {
        return request<Address>(`${API_BASE_URL}/addresses/${id}`)

    },
    createAddress(payload: Partial<Address>): Promise<Address> {
        return request<Address>(`${API_BASE_URL}/addresses`, {
            method: 'POST',
            body: JSON.stringify(payload),
        })
    },
    updateAddress(id: string, payload: Partial<Address>): Promise<Address> {
        return request<Address>(`${API_BASE_URL}/addresses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        })
    },
    deleteAddress(id: string): Promise<void> {
        return request<void>(`${API_BASE_URL}/addresses/${id}`, {
            method: 'DELETE',
        })
    },

    listItems(params: {
        q?: string
        addressId?: string
        page?: number
        pageSize?: number
    } = {}): Promise<PaginatedResult<Item>> {
        const search = new URLSearchParams()
        if (params.q) search.set('q', params.q)
        if (params.addressId) search.set('addressId', params.addressId)
        search.set('page', String(params.page ?? 1))
        search.set('pageSize', String(params.pageSize ?? 20))
        return request<PaginatedResult<Item>>(`${API_BASE_URL}/items?${search}`)
    },
    getItem(id: string): Promise<Item> {
        return request<Item>(`${API_BASE_URL}/items/${id}`)
    },
    createItem(payload: Partial<Item>): Promise<Item> {
        return request<Item>(`${API_BASE_URL}/items`, {
            method: 'POST',
            body: JSON.stringify(payload),
        })
    },
    updateItem(id: string, payload: Partial<Item>): Promise<Item> {
        return request<Item>(`${API_BASE_URL}/items/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        })
    },
    deleteItem(id: string): Promise<void> {
        return request<void>(`${API_BASE_URL}/items/${id}`, {
            method: 'DELETE',
        })
    },
}


export type { Address, Item, User }