import { OrderState, OrderMode, OrderValidationResult, ValidationErrorKey } from "@/types/order"
import { settings } from "@/lib/default-data"

export const STORAGE_KEY = "burger-order-state"

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
    return mode === "DELIVERY" ? settings.deliveryFee : 0
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
