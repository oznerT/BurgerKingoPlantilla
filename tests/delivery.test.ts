import { describe, it, expect } from 'vitest'
import { calculateDeliveryFee } from '@/lib/order-utils'
import { settings } from '@/lib/default-data'

describe('calculateDeliveryFee', () => {
    it('returns correct fee for DELIVERY mode', () => {
        const fee = calculateDeliveryFee('DELIVERY')
        expect(fee).toBe(settings.deliveryFee)
    })

    it('returns 0 for PICKUP mode', () => {
        const fee = calculateDeliveryFee('PICKUP')
        expect(fee).toBe(0)
    })
})
