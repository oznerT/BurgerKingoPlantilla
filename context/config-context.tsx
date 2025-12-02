"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { defaultRestaurantConfig } from "@/lib/default-data"

type Config = typeof defaultRestaurantConfig

type Order = {
    id: string
    date: string
    total: number
    items: any[]
}

type ConfigContextType = {
    config: Config
    orders: Order[]
    updateConfig: (newConfig: Partial<Config>) => void
    addOrder: (total: number, items: any[]) => void
    updateProduct: (product: any) => void
    deleteProduct: (id: number | string) => void
    addProduct: (product: any) => void
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export function ConfigProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<Config>(defaultRestaurantConfig)
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        const savedConfig = localStorage.getItem("restaurant-config")
        const savedOrders = localStorage.getItem("restaurant-orders")

        if (savedConfig) {
            try {
                setConfig(JSON.parse(savedConfig))
            } catch (e) {
                console.error("Failed to parse config", e)
            }
        }

        if (savedOrders) {
            try {
                setOrders(JSON.parse(savedOrders))
            } catch (e) {
                console.error("Failed to parse orders", e)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save to localStorage whenever changes occur
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("restaurant-config", JSON.stringify(config))
        }
    }, [config, isLoaded])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("restaurant-orders", JSON.stringify(orders))
        }
    }, [orders, isLoaded])

    const updateConfig = (newConfig: Partial<Config>) => {
        setConfig((prev) => ({ ...prev, ...newConfig }))
    }

    const addOrder = (total: number, items: any[]) => {
        const newOrder: Order = {
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(),
            total,
            items,
        }
        setOrders((prev) => [...prev, newOrder])
    }

    const updateProduct = (updatedProduct: any) => {
        setConfig((prev) => ({
            ...prev,
            menuItems: prev.menuItems.map((item) =>
                item.id === updatedProduct.id ? updatedProduct : item
            ),
        }))
    }

    const deleteProduct = (id: number | string) => {
        setConfig((prev) => ({
            ...prev,
            menuItems: prev.menuItems.filter((item) => item.id !== id),
        }))
    }

    const addProduct = (product: any) => {
        setConfig((prev) => ({
            ...prev,
            menuItems: [...prev.menuItems, { ...product, id: Date.now() }],
        }))
    }

    return (
        <ConfigContext.Provider
            value={{
                config,
                orders,
                updateConfig,
                addOrder,
                updateProduct,
                deleteProduct,
                addProduct,
            }}
        >
            {children}
        </ConfigContext.Provider>
    )
}

export function useConfig() {
    const context = useContext(ConfigContext)
    if (context === undefined) {
        throw new Error("useConfig must be used within a ConfigProvider")
    }
    return context
}
