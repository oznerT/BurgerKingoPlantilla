export type OrderMode = "DELIVERY" | "PICKUP"

export interface CustomerData {
    name: string
    phone: string
    address?: string
    addressDetails?: string
}

export interface CartItem {
    id: string | number
    name: string
    price: number
    quantity: number
    image?: string
    notes?: string
}

export interface OrderState {
    mode: OrderMode
    items: CartItem[]
    subtotal: number
    deliveryFee: number
    total: number
    customerData: CustomerData
    orderNotes?: string
    mercadoPago?: {
        preferenceId?: string
        paymentId?: string
        status?: "approved" | "pending" | "rejected" | "in_process" | "cancelled"
    }
    timestamp: string
}

// Validación con errores específicos por campo
export type ValidationErrorKey =
    | "mode"
    | "customerName"
    | "customerPhone"
    | "address"
    | "items"
    | "totals"

export interface OrderValidationResult {
    valid: boolean
    errors: ValidationErrorKey[]
    errorMessages: Record<ValidationErrorKey, string>
}
