import { OrderState, OrderMode, OrderValidationResult, ValidationErrorKey } from "@/types/order"

export const STORAGE_KEY = "burger-order-state"
export const DELIVERY_FEE = 500 // Costo de envío configurable

/**
 * Guarda el estado del pedido en localStorage.
 * Solo funciona en el cliente (verifica window).
 */
export function saveOrderState(state: OrderState): void {
    if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
}

/**
 * Carga el estado del pedido desde localStorage.
 * Retorna null si no existe o si estamos en el servidor.
 */
export function loadOrderState(): OrderState | null {
    if (typeof window === "undefined") return null

    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return null

    try {
        return JSON.parse(saved) as OrderState
    } catch {
        return null
    }
}

/**
 * Limpia el estado del pedido de localStorage.
 */
export function clearOrderState(): void {
    if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY)
    }
}

/**
 * Calcula el costo de envío según el modo de pedido.
 */
export function calculateDeliveryFee(mode: OrderMode): number {
    return mode === "DELIVERY" ? DELIVERY_FEE : 0
}

/**
 * Construye el mensaje de WhatsApp con todos los detalles del pedido.
 */
export function buildWhatsAppMessage(order: OrderState): string {
    let message = "Hola! Pago realizado ✅\n"

    if (order.mercadoPago?.paymentId) {
        message += `ID de pago Mercado Pago: ${order.mercadoPago.paymentId}\n`
    }

    message += `\nModalidad: ${order.mode === "DELIVERY" ? "DELIVERY" : "RETIRO EN LOCAL"}\n`
    message += `Nombre: ${order.customerData.name}\n`
    message += `Teléfono: ${order.customerData.phone}\n`

    message += `\nPedido:\n`
    order.items.forEach((item) => {
        const itemTotal = item.price * item.quantity
        message += `• ${item.quantity}x ${item.name} ($${itemTotal.toLocaleString()})\n`
        if (item.notes) {
            message += `  Nota: ${item.notes}\n`
        }
    })

    message += `\nSubtotal: $${order.subtotal.toLocaleString()}\n`

    if (order.mode === "DELIVERY") {
        message += `Envío: $${order.deliveryFee.toLocaleString()}\n`
    }

    message += `TOTAL: $${order.total.toLocaleString()}\n`

    if (order.mode === "DELIVERY" && order.customerData.address) {
        message += `\nDirección: ${order.customerData.address}\n`
        if (order.customerData.addressDetails) {
            message += `Detalles: ${order.customerData.addressDetails}\n`
        }
    }

    if (order.orderNotes) {
        message += `\nNotas adicionales: ${order.orderNotes}`
    } else {
        message += `\nNotas adicionales: Sin notas`
    }

    return message
}

/**
 * Valida el estado del pedido y retorna errores específicos por campo.
 */
export function validateOrderState(state: Partial<OrderState>): OrderValidationResult {
    const errors: ValidationErrorKey[] = []
    const errorMessages: Record<ValidationErrorKey, string> = {
        mode: "",
        customerName: "",
        customerPhone: "",
        address: "",
        items: "",
        totals: "",
    }

    if (!state.mode) {
        errors.push("mode")
        errorMessages.mode = "Debes seleccionar un modo de entrega"
    }

    if (!state.customerData?.name?.trim()) {
        errors.push("customerName")
        errorMessages.customerName = "El nombre es obligatorio"
    }

    if (!state.customerData?.phone?.trim()) {
        errors.push("customerPhone")
        errorMessages.customerPhone = "El teléfono es obligatorio"
    }

    if (state.mode === "DELIVERY" && !state.customerData?.address?.trim()) {
        errors.push("address")
        errorMessages.address = "La dirección es obligatoria para delivery"
    }

    if (!state.items || state.items.length === 0) {
        errors.push("items")
        errorMessages.items = "El carrito está vacío"
    }

    if (!state.total || state.total <= 0) {
        errors.push("totals")
        errorMessages.totals = "El total del pedido es inválido"
    }

    return {
        valid: errors.length === 0,
        errors,
        errorMessages,
    }
}
