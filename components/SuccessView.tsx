"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, Phone, Package, MapPin, FileText, Home, Clock, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useOrder } from "@/context/order-context"
import { useConfig } from "@/context/config-context"
import { buildWhatsAppURL, buildWhatsAppMessage } from "@/lib/whatsapp"
import { toast } from "sonner"

export function SuccessView() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { orderState, clearOrder, setMercadoPagoInfo } = useOrder()
    const { config } = useConfig()
    const [isRedirecting, setIsRedirecting] = useState(false)

    const paymentId = searchParams.get("payment_id")
    const paymentStatus = searchParams.get("status") as "approved" | "pending" | "rejected" | null

    // Actualizar estado con info de Mercado Pago
    useEffect(() => {
        if (paymentId && paymentStatus && orderState) {
            setMercadoPagoInfo({
                paymentId,
                status: paymentStatus,
            })
        }
    }, [paymentId, paymentStatus, orderState, setMercadoPagoInfo])

    const handleSendToWhatsApp = () => {
        if (!orderState) return

        const message = buildWhatsAppMessage(orderState)
        const whatsappUrl = buildWhatsAppURL(config.phone, message)

        // Abrir WhatsApp
        window.open(whatsappUrl, "_blank")

        // Toast de confirmación
        toast.success("Pedido enviado a la cocina ✅")

        // Limpiar estado completo
        clearOrder()

        // Redirigir a home después de 2 segundos
        setIsRedirecting(true)
        setTimeout(() => {
            router.push("/")
        }, 2000)
    }

    const handleBackToMenu = () => {
        router.push("/")
    }

    // Si no hay estado, mostrar mensaje de error
    if (!orderState) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
                        <Package className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-foreground">No encontramos tu pedido</h2>
                        <p className="text-muted-foreground">
                            Puede que hayas limpiado el navegador o que el enlace sea inválido
                        </p>
                    </div>
                    <Button onClick={handleBackToMenu} size="lg" className="w-full">
                        <Home className="w-4 h-4 mr-2" />
                        Volver al Menú
                    </Button>
                </div>
            </div>
        )
    }

    const isApproved = paymentStatus === "approved"
    const isPending = paymentStatus === "pending"
    const isRejected = paymentStatus === "rejected"

    const getStatusConfig = () => {
        if (isApproved) {
            return {
                icon: <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />,
                bg: "bg-green-100 dark:bg-green-900/20",
                title: "¡Pago Confirmado!",
                message: "Tu pedido está listo para ser procesado.",
            }
        }
        if (isPending) {
            return {
                icon: <Clock className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />,
                bg: "bg-yellow-100 dark:bg-yellow-900/20",
                title: "Pago Pendiente",
                message: "Estamos esperando la confirmación del pago.",
            }
        }
        if (isRejected) {
            return {
                icon: <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />,
                bg: "bg-red-100 dark:bg-red-900/20",
                title: "Pago Rechazado",
                message: "Hubo un problema con tu pago. Por favor intenta nuevamente.",
            }
        }

        // Unknown status or other
        return {
            icon: <XCircle className="w-12 h-12 text-gray-600 dark:text-gray-400" />,
            bg: "bg-gray-100 dark:bg-gray-900/20",
            title: "Estado Desconocido",
            message: "No pudimos verificar el estado del pago. Por favor contactanos.",
        }
    }

    const statusConfig = getStatusConfig()

    return (
        <div className="min-h-screen bg-secondary/20 py-8 px-4">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header de estado */}
                <div className="bg-card rounded-lg p-8 text-center shadow-lg border border-border">
                    <div className={`w-20 h-20 mx-auto mb-4 ${statusConfig.bg} rounded-full flex items-center justify-center`}>
                        {statusConfig.icon}
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{statusConfig.title}</h1>
                    <p className="text-muted-foreground">{statusConfig.message}</p>
                    {paymentId && (
                        <p className="text-sm text-muted-foreground mt-2">
                            ID de pago: <span className="font-mono">{paymentId}</span>
                        </p>
                    )}
                    <p className="text-muted-foreground mt-1">
                        {new Date().toLocaleString("es-AR", {
                            dateStyle: "long",
                            timeStyle: "short",
                        })}
                    </p>
                </div>

                {/* Modalidad */}
                <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
                    <div className="flex items-center gap-3 mb-4">
                        <Package className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-bold">Modalidad de Entrega</h2>
                    </div>
                    <Badge variant={orderState.mode === "DELIVERY" ? "default" : "secondary"} className="text-lg py-2 px-4">
                        {orderState.mode === "DELIVERY" ? "🚚 DELIVERY" : "🏪 RETIRO EN LOCAL"}
                    </Badge>
                </div>

                {/* Datos del cliente */}
                <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
                    <div className="flex items-center gap-3 mb-4">
                        <Phone className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-bold">Datos de Contacto</h2>
                    </div>
                    <div className="space-y-2 text-sm">
                        <p>
                            <span className="font-semibold">Nombre:</span> {orderState.customerData.name}
                        </p>
                        <p>
                            <span className="font-semibold">Teléfono:</span> {orderState.customerData.phone}
                        </p>
                        {orderState.mode === "DELIVERY" && orderState.customerData.address && (
                            <>
                                <div className="flex items-start gap-2 pt-2">
                                    <MapPin className="w-4 h-4 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Dirección:</p>
                                        <p>{orderState.customerData.address}</p>
                                        {orderState.customerData.addressDetails && (
                                            <p className="text-muted-foreground">{orderState.customerData.addressDetails}</p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Resumen del pedido */}
                <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-bold">Resumen del Pedido</h2>
                    </div>
                    <div className="space-y-3">
                        {orderState.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-start py-2 border-b border-border last:border-0">
                                <div className="flex-1">
                                    <p className="font-semibold">
                                        {item.quantity}x {item.name}
                                    </p>
                                    {item.notes && <p className="text-sm text-muted-foreground">Nota: {item.notes}</p>}
                                </div>
                                <p className="font-bold">${(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-border space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span className="font-semibold">${orderState.subtotal.toLocaleString()}</span>
                        </div>
                        {orderState.mode === "DELIVERY" && (
                            <div className="flex justify-between text-sm">
                                <span>Envío:</span>
                                <span className="font-semibold">${orderState.deliveryFee.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-bold pt-2">
                            <span>TOTAL:</span>
                            <span className="text-primary">${orderState.total.toLocaleString()}</span>
                        </div>
                    </div>

                    {orderState.orderNotes && (
                        <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-sm font-semibold mb-1">Notas adicionales:</p>
                            <p className="text-sm text-muted-foreground">{orderState.orderNotes}</p>
                        </div>
                    )}
                </div>

                {/* Botones */}
                <div className="space-y-3">
                    {!isApproved && (
                        <div className={`border rounded-lg p-4 text-center ${isPending ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : 'bg-red-100 border-red-300 text-red-800'}`}>
                            <p className="text-sm font-semibold">
                                {isPending
                                    ? "⏳ Tu pago está pendiente de confirmación"
                                    : "❌ Hubo un problema con el pago"}
                            </p>
                            <p className="text-xs mt-1 opacity-90">
                                {isPending ? "Te avisaremos cuando se acredite." : "Por favor intenta con otro medio de pago."}
                            </p>
                        </div>
                    )}

                    <Button
                        onClick={handleSendToWhatsApp}
                        disabled={!isApproved || isRedirecting}
                        size="lg"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-6"
                    >
                        {isRedirecting ? (
                            "Redirigiendo..."
                        ) : (
                            <>
                                <Phone className="w-5 h-5 mr-2" />
                                ENVIAR PEDIDO A LA COCINA (WhatsApp)
                            </>
                        )}
                    </Button>

                    <Button onClick={handleBackToMenu} variant="outline" size="lg" className="w-full">
                        <Home className="w-4 h-4 mr-2" />
                        Volver al Menú
                    </Button>
                </div>
            </div>
        </div>
    )
}
