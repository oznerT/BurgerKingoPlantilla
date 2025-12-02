import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SuccessView } from '@/components/SuccessView'
import { ConfigProvider } from '@/context/config-context'
import { useSearchParams } from 'next/navigation'

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useSearchParams: vi.fn(),
    useRouter: () => ({
        push: vi.fn(),
    }),
}))

// Mock order context with a valid order
const mockOrderState = {
    mode: 'DELIVERY',
    items: [{ id: 1, name: 'Burger', price: 1000, quantity: 1 }],
    subtotal: 1000,
    deliveryFee: 500,
    total: 1500,
    customerData: { name: 'Test', phone: '123' },
    timestamp: new Date().toISOString(),
}

// Mock useOrder to return state
vi.mock('@/context/order-context', async () => {
    const actual = await vi.importActual('@/context/order-context')
    return {
        ...actual,
        useOrder: () => ({
            orderState: mockOrderState,
            clearOrder: vi.fn(),
            setMercadoPagoInfo: vi.fn(),
        }),
    }
})

describe('SuccessView', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders approved status correctly', () => {
        vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams('?result=success&status=approved&payment_id=123456'))

        render(
            <ConfigProvider>
                <SuccessView />
            </ConfigProvider>
        )

        expect(screen.getByText('¡Pago Confirmado!')).toBeDefined()
        expect(screen.getByText('ENVIAR PEDIDO A LA COCINA (WhatsApp)')).toBeDefined()
    })

    it('renders pending status correctly', () => {
        vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams('?result=success&status=pending&payment_id=123456'))

        render(
            <ConfigProvider>
                <SuccessView />
            </ConfigProvider>
        )

        expect(screen.getByText('Pago Pendiente')).toBeDefined()
        expect(screen.getByText('⏳ Tu pago está pendiente de confirmación')).toBeDefined()
    })

    it('renders rejected status correctly', () => {
        vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams('?result=success&status=rejected&payment_id=123456'))

        render(
            <ConfigProvider>
                <SuccessView />
            </ConfigProvider>
        )

        expect(screen.getByText('Pago Rechazado')).toBeDefined()
        expect(screen.getByText('❌ Hubo un problema con el pago')).toBeDefined()
    })

    it('renders unknown status correctly', () => {
        vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams('?result=success&status=unknown&payment_id=123456'))

        render(
            <ConfigProvider>
                <SuccessView />
            </ConfigProvider>
        )

        expect(screen.getByText('Estado Desconocido')).toBeDefined()
    })
})
