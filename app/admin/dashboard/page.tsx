"use client"

import { useState } from "react"
import { useConfig } from "@/context/config-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Plus, Pencil, Trash2, Save, DollarSign, ShoppingBag, RotateCcw, X } from "lucide-react"

export default function DashboardPage() {
    const { config, orders, updateConfig, updateProduct, deleteProduct, addProduct } = useConfig()
    const [activeTab, setActiveTab] = useState("analytics")

    // Analytics Data Preparation
    const totalSales = orders.reduce((acc, order) => acc + order.total, 0)
    const totalOrders = orders.length

    // Group orders by date for chart
    const salesByDate = orders.reduce((acc: any, order) => {
        const date = new Date(order.date).toLocaleDateString()
        if (!acc[date]) {
            acc[date] = { date, sales: 0, orders: 0 }
        }
        acc[date].sales += order.total
        acc[date].orders += 1
        return acc
    }, {})

    const chartData = Object.values(salesByDate).sort((a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <Tabs defaultValue="analytics" className="space-y-4" onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="analytics">Estadísticas</TabsTrigger>
                    <TabsTrigger value="menu">Menú y Productos</TabsTrigger>
                    <TabsTrigger value="settings">Configuración General</TabsTrigger>
                </TabsList>

                {/* ANALYTICS TAB */}
                <TabsContent value="analytics" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">Ingresos históricos</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pedidos Totales</CardTitle>
                                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalOrders}</div>
                                <p className="text-xs text-muted-foreground">Pedidos realizados</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Ventas por Día</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px] w-full">
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" vertical={false} />
                                            <XAxis
                                                dataKey="date"
                                                className="text-xs font-medium"
                                                tickLine={false}
                                                axisLine={false}
                                                dy={10}
                                            />
                                            <YAxis
                                                className="text-xs font-medium"
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `$${value}`}
                                            />
                                            <Tooltip
                                                cursor={{ fill: 'var(--muted)', opacity: 0.1 }}
                                                contentStyle={{
                                                    backgroundColor: 'var(--card)',
                                                    borderColor: 'var(--border)',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                }}
                                                itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                                                labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}
                                                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Ventas']}
                                            />
                                            <Bar
                                                dataKey="sales"
                                                fill="var(--primary)"
                                                radius={[6, 6, 0, 0]}
                                                maxBarSize={60}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-muted-foreground">
                                        No hay datos de ventas aún
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* MENU TAB */}
                <TabsContent value="menu" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">Productos</h3>
                        <ProductDialog onSubmit={addProduct} trigger={
                            <Button><Plus className="w-4 h-4 mr-2" /> Nuevo Producto</Button>
                        } />
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Categoría</TableHead>
                                        <TableHead>Precio</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {config.menuItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell>${item.price.toLocaleString()}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <ProductDialog
                                                    product={item}
                                                    onSubmit={updateProduct}
                                                    trigger={
                                                        <Button variant="ghost" size="icon"><Pencil className="w-4 h-4" /></Button>
                                                    }
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => {
                                                        if (confirm("¿Estás seguro de eliminar este producto?")) {
                                                            deleteProduct(item.id)
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SETTINGS TAB */}
                <TabsContent value="settings" className="space-y-4">
                    <SettingsTab config={config} onSave={updateConfig} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

function SettingsTab({ config, onSave }: { config: any, onSave: (newConfig: any) => void }) {
    const [localConfig, setLocalConfig] = useState(config)
    const [isDirty, setIsDirty] = useState(false)

    const handleChange = (field: string, value: string) => {
        setLocalConfig((prev: any) => ({ ...prev, [field]: value }))
        setIsDirty(true)
    }

    const handleSave = () => {
        onSave(localConfig)
        setIsDirty(false)
        alert("Cambios guardados correctamente")
    }

    const handleRevert = () => {
        if (confirm("¿Estás seguro de revertir los cambios no guardados?")) {
            setLocalConfig(config)
            setIsDirty(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Información del Restaurante</CardTitle>
                <CardDescription>Modificá los datos generales que se muestran en la landing page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Nombre</Label>
                        <Input
                            value={localConfig.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Slogan</Label>
                        <Input
                            value={localConfig.slogan}
                            onChange={(e) => handleChange("slogan", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label>Tagline (Subtítulo)</Label>
                        <Input
                            value={localConfig.tagline}
                            onChange={(e) => handleChange("tagline", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Teléfono (WhatsApp)</Label>
                        <Input
                            value={localConfig.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Dirección</Label>
                        <Input
                            value={localConfig.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label>Dirección exacta para el Mapa (Opcional)</Label>
                        <Input
                            value={localConfig.mapUrl || ""}
                            onChange={(e) => handleChange("mapUrl", e.target.value)}
                            placeholder="Ej: Av. San Martín 1234, Mendoza, Argentina"
                        />
                        <p className="text-xs text-muted-foreground">
                            Si el mapa no muestra la ubicación correcta, escribí aquí la dirección completa o las coordenadas para ser más preciso.
                        </p>
                    </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                        variant="outline"
                        onClick={handleRevert}
                        disabled={!isDirty}
                        className="text-muted-foreground"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Revertir Cambios
                    </Button>
                    <Button onClick={handleSave} disabled={!isDirty}>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Cambios
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

function ProductDialog({ product, onSubmit, trigger }: { product?: any, onSubmit: (p: any) => void, trigger: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState(product || {
        name: "",
        description: "",
        price: 0,
        category: "Hamburguesas",
        image: ""
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
        setOpen(false)
        if (!product) {
            setFormData({ name: "", description: "", price: 0, category: "Hamburguesas", image: "" })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{product ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Nombre</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Precio</Label>
                            <Input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Categoría</Label>
                            <Input
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>URL Imagen</Label>
                        <Input
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            placeholder="https://ejemplo.com/hamburguesa.jpg"
                        />
                        <p className="text-xs text-muted-foreground">
                            Pegá aquí el enlace de tu imagen. Podés usar imágenes de Google, Unsplash, o cualquier URL pública.
                        </p>
                        {formData.image && (
                            <div className="mt-2 relative aspect-video rounded-md overflow-hidden border border-border bg-muted">
                                <img
                                    src={formData.image}
                                    alt="Vista previa"
                                    className="object-cover w-full h-full"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                        </Button>
                        <Button type="submit">Guardar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
