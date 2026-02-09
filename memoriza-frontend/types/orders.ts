// Types matching backend DTOs for Orders API

export interface OrderSummaryResponse {
    orderId: string
    orderNumber: string
    createdAt: string
    totalAmount: number
    status: string
    isRefundable: boolean
    refundStatus: string | null
}

export interface OrderDetailResponse {
    orderId: string
    orderNumber: string
    createdAt: string
    subtotal: number
    shippingAmount: number
    totalAmount: number
    status: string
    items: OrderItemDto[]
    shippingOption: ShippingOptionDto | null
    shippingAddress: ShippingAddressDto | null
    deliveredAt: string | null
    isRefundable: boolean
    refundStatus: string | null
    trackingCode: string | null
    trackingCompany: string | null
    trackingUrl: string | null

    // Payment Recovery
    preferenceId?: string
    initPoint?: string
    sandboxInitPoint?: string
    canResume: boolean
    canReopenQrCode: boolean
}

export interface OrderItemDto {
    cartItemId: string
    productId: string
    productName: string
    thumbnailUrl: string | null
    quantity: number
    unitPrice: number
    colorId?: number
    colorName?: string
    sizeId?: number
    sizeName?: string
    personalizationText?: string
}

export interface ShippingOptionDto {
    code: string
    name: string
    description: string | null
    price: number
    estimatedDays: number
}

export interface ShippingAddressDto {
    street: string
    number: string
    complement: string | null
    neighborhood: string
    city: string
    state: string
    zipCode: string
    country: string
    shippingAddressId: string
}

export interface CreateOrderRequest {
    shippingAmount: number
    shippingCode: string
    shippingName: string
    shippingEstimatedDays: number
    pickupInStore: boolean
    shippingAddressId: string
    shippingPhone?: string
}

export interface CheckoutInitResponse {
    orderId: string
    orderNumber: string
    totalAmount: number
    preferenceId: string
    initPoint: string
    sandboxInitPoint: string
    publicKey: string
}

export interface RefundRequest {
    orderId: string
    reason: string
}

export interface RefundStatusResponse {
    orderId: string
    status: string
    message: string
    requestedAt: string
}

// Payment Processing Types (Checkout Transparente)
export interface ProcessPaymentRequest {
    token?: string // MercadoPago SDK token (required for cards, optional for PIX)
    payment_method_id: string // "pix", "visa", "master", etc
    email: string
    issuer_id?: string // Card issuer ID
    installments?: number // Default 1
    document_number?: string // CPF/CNPJ
    document_type?: string // "CPF" or "CNPJ"
    payer?: {
        email: string
        identification?: {
            type: string
            number: string
        }
    }
}

export interface ProcessPaymentResponse {
    paymentId: number
    status: string
    statusDetail: string
    qrCode?: string
    qrCodeBase64?: string
    ticketUrl?: string
    message: string
}
