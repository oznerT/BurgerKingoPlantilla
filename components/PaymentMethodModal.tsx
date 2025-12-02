"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CreditCard, Loader2 } from "lucide-react"
import { useOrder } from "@/context/order-context"

interface PaymentMethodModalProps {
    isOpen: boolean
    onClose: () => void
}

export function PaymentMethodModal({ isOpen, onClose }: PaymentMethodModalProps) {
    const { cart, setMercadoPagoInfo, saveOrder } = useOrder()
    const [loading, setLoading] = useState(false)

    const handleMercadoPago = async () => {
        setLoading(true)
        try {
            const response = await fetch("/api/mercadopago/create-preference", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: cart,
                }),
            })

            const data = await response.json()

            if (data.init_point && data.id) {
                // Guardar preferenceId usando método del contexto (evita mutación directa)
                setMercadoPagoInfo({ preferenceId: data.id })
                saveOrder() // Persiste en localStorage

                // Redirigir a Mercado Pago
                window.location.href = data.init_point
            } else {
                console.error("Error creating preference:", data)
                const errorMsg = data.message || data.error || "Error desconocido"
                const errorDetails = data.details ? JSON.stringify(data.details) : ""
                alert(`Error al iniciar el pago: ${errorMsg}\n${errorDetails}`)
            }
        } catch (error) {
            console.error("Error:", error)
            alert("Ocurrió un error al conectar con el servidor de pagos.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold">Confirmar Pago</DialogTitle>
                    <DialogDescription className="text-center">
                        Serás redirigido a Mercado Pago para completar el pago de forma segura
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Button
                        onClick={handleMercadoPago}
                        disabled={loading}
                        className="h-auto py-6 bg-[#009EE3] hover:bg-[#009EE3]/90 text-white flex flex-col items-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <>
                                <div className="flex items-center gap-2 text-lg font-bold">
                                    <CreditCard className="w-6 h-6" />
                                    Pagar con Mercado Pago
                                </div>
                                <span className="text-sm font-normal opacity-90">Tarjetas, Débito, Efectivo</span>
                            </>
                        )}
                    </Button>

                    <Button onClick={onClose} variant="outline">
                        Cancelar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
