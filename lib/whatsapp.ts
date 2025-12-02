import { OrderState } from "@/types/order"

export function buildWhatsAppURL(phone: string, message: string): string {
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodedMessage}`
}

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
