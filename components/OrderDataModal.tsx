"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Truck, Store } from "lucide-react"
import { useOrder } from "@/context/order-context"
import { OrderMode } from "@/types/order"
import { validateOrderState } from "@/lib/order-utils"

interface OrderDataModalProps {
    isOpen: boolean
    onClose: () => void
    onContinue: () => void
}

export function OrderDataModal({ isOpen, onClose, onContinue }: OrderDataModalProps) {
    const { orderState, createCompleteOrder, cart, cartTotal } = useOrder()

    const [mode, setMode] = useState<OrderMode>("DELIVERY")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [addressDetails, setAddressDetails] = useState("")
    const [notes, setNotes] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (orderState) {
            if (orderState.mode) setMode(orderState.mode)
            if (orderState.customerData.name) setName(orderState.customerData.name)
            if (orderState.customerData.phone) setPhone(orderState.customerData.phone)
            if (orderState.customerData.address) setAddress(orderState.customerData.address)
            if (orderState.customerData.addressDetails) setAddressDetails(orderState.customerData.addressDetails)
            if (orderState.orderNotes) setNotes(orderState.orderNotes)
        }
    }, [orderState, isOpen])

    const handleContinue = () => {
        console.log("handleContinue called")
        const validation = validateOrderState({
            mode,
            customerData: {
                name,
                phone,
                address: mode === "DELIVERY" ? address : undefined,
            },
            items: cart,
            total: cartTotal,
        })

        console.log("Validation:", validation)

        if (!validation.valid) {
            setErrors(validation.errorMessages)
            return
        }

        createCompleteOrder(
            mode,
            {
                name,
                phone,
                address: mode === "DELIVERY" ? address : undefined,
                addressDetails: mode === "DELIVERY" ? addressDetails : undefined,
            },
            notes
        )
        onContinue()
    }

    const isValid = () => {
        if (!name.trim() || !phone.trim()) return false
        if (mode === "DELIVERY" && !address.trim()) return false
        return true
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Datos del Pedido</DialogTitle>
                    <DialogDescription>Completá tus datos para continuar con el pago</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Modalidad</Label>
                        <RadioGroup value={mode} onValueChange={(value) => setMode(value as OrderMode)}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <RadioGroupItem value="DELIVERY" id="delivery" className="peer sr-only" />
                                    <Label
                                        htmlFor="delivery"
                                        className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                                    >
                                        <Truck className="mb-3 h-8 w-8" />
                                        <span className="text-sm font-bold">DELIVERY</span>
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem value="PICKUP" id="pickup" className="peer sr-only" />
                                    <Label
                                        htmlFor="pickup"
                                        className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                                    >
                                        <Store className="mb-3 h-8 w-8" />
                                        <span className="text-sm font-bold">RETIRO EN LOCAL</span>
                                    </Label>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Nombre completo <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej: Juan Pérez"
                                className={errors.customerName ? "border-destructive" : ""}
                            />
                            {errors.customerName && <p className="text-sm text-destructive">{errors.customerName}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">
                                Teléfono <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Ej: +54 9 261 123 4567"
                                className={errors.customerPhone ? "border-destructive" : ""}
                            />
                            {errors.customerPhone && <p className="text-sm text-destructive">{errors.customerPhone}</p>}
                        </div>

                        {mode === "DELIVERY" && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="address">
                                        Dirección <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Ej: Av. San Martín 500"
                                        className={errors.address ? "border-destructive" : ""}
                                    />
                                    {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="addressDetails">Detalles (piso, depto, etc.)</Label>
                                    <Input
                                        id="addressDetails"
                                        value={addressDetails}
                                        onChange={(e) => setAddressDetails(e.target.value)}
                                        placeholder="Ej: Piso 3, Depto B"
                                    />
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                            <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Ej: Timbre roto, llamar al llegar"
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button onClick={onClose} variant="outline" className="flex-1" type="button">
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleContinue}
                            disabled={!isValid()}
                            className="flex-1 bg-primary hover:bg-primary/90"
                        >
                            Continuar al Pago
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
