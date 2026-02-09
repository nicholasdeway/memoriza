// Types matching backend DTOs for Cart API

export interface CartItemDto {
    cartItemId: string
    productId: string
    productName: string
    thumbnailUrl: string | null
    quantity: number
    unitPrice: number
    subtotal: number
    sizeId?: number
    colorId?: number
    sizeName?: string
    colorName?: string
    personalizationText?: string
}

export interface CartSummaryResponse {
    items: CartItemDto[]
    subtotal: number
    shippingAmount: number
    total: number
}

export interface AddCartItemRequest {
    productId: string
    quantity: number
    sizeId?: number
    colorId?: number
    sizeName?: string
    colorName?: string
    personalizationText?: string
}

export interface UpdateCartItemQuantityRequest {
    cartItemId: string
    quantity: number
}

export interface RemoveCartItemRequest {
    cartItemId: string
}
