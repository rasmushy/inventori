export type Identifier = string

export interface User {
    id: Identifier
    email: string
    displayName?: string
}

export interface Address {
    id: Identifier
    userId: Identifier
    label: string
    street?: string
    city?: string
    postalCode?: string
    sharedWith?: string[] 
    createdAt: string
    updatedAt: string
}

export interface Item {
    id: Identifier
    userId: Identifier
    addressId?: Identifier
    name: string
    description?: string
    purchaseDate?: string
    purchasePriceCents?: number
    currency?: string
    tags?: string[]
    images?: MediaAsset[]
    receipts?: MediaAsset[]
    createdAt: string
    updatedAt: string
}

export interface MediaAsset {
    id: Identifier
    url: string
    fileName: string
    contentType: string
    sizeBytes: number
}

export interface PaginatedResult<T> {
    items: T[]
    total: number
    page: number
    pageSize: number
}

export interface ApiError {
    status: number
    message: string
    details?: unknown
}


