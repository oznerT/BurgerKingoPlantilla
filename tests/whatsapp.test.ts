import { describe, it, expect } from 'vitest'
import { buildWhatsAppMessage } from '@/lib/whatsapp'
import { OrderState } from '@/types/order'

describe('buildWhatsAppMessage', () => {
    it('builds correct message for delivery order', () => {
        const order: OrderState = {
            mode: 'DELIVERY',
            items: [
                { id: 1, name: 'Burger', price: 1000, quantity: 2, notes: 'Sin cebolla' },
                { id: 2, name: 'Papas', price: 500, quantity: 1 }
            ],
            subtotal: 2500,
            deliveryFee: 500,
            total: 3000,
            customerData: {
                name: 'Juan Perez',
                phone: '123456789',
                address: 'Calle Falsa 123',
                addressDetails: 'PB A'
            },
            timestamp: new Date().toISOString(),
            mercadoPago: {
                paymentId: '1234567890'
            }
        }

        const message = buildWhatsAppMessage(order)

        expect(message).toContain('Hola! Pago realizado ✅')
        expect(message).toContain('ID de pago Mercado Pago: 1234567890')
        expect(message).toContain('Modalidad: DELIVERY')
        expect(message).toContain('Nombre: Juan Perez')
        expect(message).toContain('Teléfono: 123456789')
        expect(message).toContain('2x Burger ($2.000)')
        expect(message).toContain('Nota: Sin cebolla')
        expect(message).toContain('1x Papas ($500)')
        expect(message).toContain('Subtotal: $2.500')
        expect(message).toContain('Envío: $500')
        expect(message).toContain('TOTAL: $3.000')
        expect(message).toContain('Dirección: Calle Falsa 123')
        expect(message).toContain('Detalles: PB A')
        expect(message).toContain('Notas adicionales: Sin notas')
    })
})
