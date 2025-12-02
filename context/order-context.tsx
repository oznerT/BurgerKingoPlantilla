"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { OrderState, CartItem, OrderMode, CustomerData } from "@/types/order"
import {
    saveOrderState,
    loadOrderState,
    clearOrderState,
    calculateDeliveryFee,
} from "@/lib/order-utils"

interface OrderContextType {
    orderState: OrderState | null
    cart: CartItem[]
    addToCart: (item: Omit<CartItem, "quantity">) => void
    removeFromCart: (id: string | number) => void
    updateCartQuantity: (id: string | number, delta: number) => void
    setOrderMode: (mode: OrderMode) => void
    setCustomerData: (data: CustomerData) => void
    setOrderNotes: (notes: string) => void
    setMercadoPagoInfo: (info: {
        preferenceId?: string
        paymentId?: string
        status?: "approved" | "pending" | "rejected" | "in_process" | "cancelled"
    }) => void
    createCompleteOrder: (mode: OrderMode, customerData: CustomerData, orderNotes?: string) => void
    saveOrder: () => void
    clearOrder: () => void
    cartTotal: number
    cartCount: number
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: ReactNode }) {
    const [orderState, setOrderState] = useState<OrderState | null>(null)
    const [cart, setCart] = useState<CartItem[]>([])

    useEffect(() => {
        const savedOrder = loadOrderState()
        if (savedOrder) {
            setOrderState(savedOrder)
            setCart(savedOrder.items)
        } else {
            const savedCart = localStorage.getItem("burger-cart")
            if (savedCart) {
                try {
                    setCart(JSON.parse(savedCart))
                } catch (e) {
                    console.error("Error loading cart", e)
                }
            }
        }
    }, [])

    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem("burger-cart", JSON.stringify(cart))
        }
    }, [cart])

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

    const addToCart = (product: Omit<CartItem, "quantity">) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id)
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            } else {
                return [...prevCart, { ...product, quantity: 1 }]
            }
        })
    }

    const removeFromCart = (id: string | number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id))
    }

    const updateCartQuantity = (id: string | number, delta: number) => {
        setCart((prevCart) =>
            prevCart.map((item) => {
                if (item.id === id) {
                    const newQuantity = Math.max(1, item.quantity + delta)
                    return { ...item, quantity: newQuantity }
                }
                return item
            })
        )
    }

    const setOrderMode = (mode: OrderMode) => {
        setOrderState((prev) => ({
            mode,
            items: cart,
            subtotal: cartTotal,
            deliveryFee: calculateDeliveryFee(mode),
            total: cartTotal + calculateDeliveryFee(mode),
            customerData: prev?.customerData || { name: "", phone: "" },
            orderNotes: prev?.orderNotes,
            mercadoPago: prev?.mercadoPago,
            timestamp: new Date().toISOString(),
        }))
    }

    const setCustomerData = (data: CustomerData) => {
        setOrderState((prev) => {
            if (!prev) {
                return {
                    mode: "DELIVERY" as OrderMode,
                    items: cart,
                    subtotal: cartTotal,
                    deliveryFee: 0,
                    total: cartTotal,
                    customerData: data,
                    timestamp: new Date().toISOString(),
                }
            }
            return {
                ...prev,
                customerData: data,
            }
        })
    }

    const setOrderNotes = (notes: string) => {
        setOrderState((prev) => {
            if (!prev) return null
            return {
                ...prev,
                orderNotes: notes,
            }
        })
    }

    const setMercadoPagoInfo = (info: {
        preferenceId?: string
        paymentId?: string
        status?: "approved" | "pending" | "rejected" | "in_process" | "cancelled"
    }) => {
        setOrderState((prev) => {
            if (!prev) return null
            return {
                ...prev,
                mercadoPago: {
                    ...prev.mercadoPago,
                    ...info,
                },
            }
        })
    }

    const createCompleteOrder = (mode: OrderMode, customerData: CustomerData, orderNotes?: string) => {
        const deliveryFee = calculateDeliveryFee(mode)
        const newOrder: OrderState = {
            mode,
            items: cart,
            subtotal: cartTotal,
            deliveryFee,
            total: cartTotal + deliveryFee,
            customerData,
            orderNotes,
            timestamp: new Date().toISOString(),
        }
        setOrderState(newOrder)
    }

    const saveOrder = () => {
        if (orderState) {
            saveOrderState(orderState)
        }
    }

    const clearOrder = () => {
        setOrderState(null)
        setCart([])
        clearOrderState()
        localStorage.removeItem("burger-cart")
    }

    return (
        <OrderContext.Provider
            value={{
                orderState,
                cart,
                addToCart,
                removeFromCart,
                updateCartQuantity,
                setOrderMode,
                setCustomerData,
                setOrderNotes,
                setMercadoPagoInfo,
                createCompleteOrder,
                saveOrder,
                clearOrder,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </OrderContext.Provider>
    )
}

export function useOrder() {
    const context = useContext(OrderContext)
    if (context === undefined) {
        throw new Error("useOrder must be used within an OrderProvider")
    }
    return context
}
