import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { OrderProvider, useOrder } from '@/context/order-context'

describe('OrderContext LocalStorage', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.clearAllMocks()
    })

    it('clears localStorage when cart is empty', () => {
        const { result } = renderHook(() => useOrder(), {
            wrapper: OrderProvider,
        })

        // Add item
        act(() => {
            result.current.addToCart({ id: 1, name: 'Burger', price: 1000 })
        })

        // Check localStorage
        expect(localStorage.getItem('burger-cart')).toBeTruthy()

        // Remove item
        act(() => {
            result.current.removeFromCart(1)
        })

        // Check localStorage is empty
        expect(localStorage.getItem('burger-cart')).toBeNull()
    })

    it('clears everything on clearOrder', () => {
        const { result } = renderHook(() => useOrder(), {
            wrapper: OrderProvider,
        })

        // Add item and create order
        act(() => {
            result.current.addToCart({ id: 1, name: 'Burger', price: 1000 })
            result.current.createCompleteOrder('DELIVERY', { name: 'Test', phone: '123' })
        })

        // Check state
        expect(result.current.cart.length).toBe(1)
        expect(result.current.orderState).not.toBeNull()

        // Clear order
        act(() => {
            result.current.clearOrder()
        })

        // Check state cleared
        expect(result.current.cart.length).toBe(0)
        expect(result.current.orderState).toBeNull()
        expect(localStorage.getItem('burger-cart')).toBeNull()
        expect(localStorage.getItem('burger-order-state')).toBeNull()
    })
})
