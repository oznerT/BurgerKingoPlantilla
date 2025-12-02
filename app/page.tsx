"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Menu, X, ShoppingCart, Phone, MapPin, Clock, Star, ChevronRight, Plus, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PaymentMethodModal } from "@/components/PaymentMethodModal"
import { OrderDataModal } from "@/components/OrderDataModal"
import { SuccessView } from "@/components/SuccessView"
import { Toaster } from "sonner"

// ========================================
// CONFIGURATION OBJECT - EDIT THIS TO REUSE THE TEMPLATE
// ========================================
import { useConfig } from "@/context/config-context"
import { useOrder } from "@/context/order-context"

// ========================================
// HELPER FUNCTIONS
// ========================================
function buildWhatsAppURL(phone: string, message: string): string {
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodedMessage}`
}

// ========================================
// COMPONENTS
// ========================================
type CartItem = {
  id: string | number
  name: string
  price: number
  quantity: number
  image?: string
}

function Header({
  cartCount,
  cartTotal,
  onOpenCart,
}: {
  cartCount: number
  cartTotal: number
  onOpenCart: () => void
}) {
  const { config: restaurantConfig } = useConfig()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: "Inicio", href: "#hero" },
    { label: "Menú", href: "#menu" },
    { label: "Ubicación", href: "#ubicacion" },
    { label: "Promos", href: "#promos" },
    { label: "Opiniones", href: "#testimonios" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center font-heading font-bold text-primary-foreground text-xl">
              BK
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">
              {restaurantConfig.name}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            {cartCount > 0 && (
              <button
                onClick={onOpenCart}
                className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-border hover:bg-secondary transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-foreground">{cartCount} ítems</span>
                <span className="text-sm text-muted-foreground">|</span>
                <span className="text-sm font-bold text-accent">${cartTotal.toLocaleString()}</span>
              </button>
            )}
            <Button
              onClick={() =>
                window.open(buildWhatsAppURL(restaurantConfig.phone, "¡Hola! Tengo una consulta"), "_blank")
              }
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <Phone className="w-4 h-4 mr-2" />
              Contacto
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            {cartCount > 0 && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  onOpenCart()
                }}
                className="w-full py-2 flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors text-left"
              >
                <ShoppingCart className="w-4 h-4 text-primary" />
                <span>
                  Tu pedido: {cartCount} ítems - ${cartTotal.toLocaleString()}
                </span>
              </button>
            )}
            <Button
              onClick={() => {
                window.open(buildWhatsAppURL(restaurantConfig.phone, "¡Hola! Tengo una consulta"), "_blank")
                setMobileMenuOpen(false)
              }}
              className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <Phone className="w-4 h-4 mr-2" />
              Contacto
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}

function Hero() {
  const { config: restaurantConfig } = useConfig()
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="/premium-gourmet-burger-close-up-hero-shot-dark-moo.jpg"
          alt="Hero burger"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-foreground mb-4 animate-fade-in">
          {restaurantConfig.slogan.toUpperCase()}
        </h1>
        <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          {restaurantConfig.tagline}
        </p>
        <Button
          size="lg"
          onClick={() => {
            const section = document.getElementById("menu")
            section?.scrollIntoView({ behavior: "smooth" })
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          Pedir ahora
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      icon: "🍔",
      title: "Elegís tu burger o promo favorita",
      description: "Navegás el menú y seleccionás lo que más te guste.",
    },
    {
      icon: "📱",
      title: "Agregás todo al carrito",
      description: "Revisás tu pedido y ajustás cantidades antes de confirmar.",
    },
    {
      icon: "🏠",
      title: "Confirmás por WhatsApp",
      description: "Te contactamos para coordinar envío o retiro.",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-center text-foreground mb-12 tracking-tight">
          CÓMO PEDIR
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="text-6xl mb-4">{step.icon}</div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MenuSection({ onAddToCart }: { onAddToCart: (item: any) => void }) {
  const { config: restaurantConfig } = useConfig()
  const [selectedCategory, setSelectedCategory] = useState("Hamburguesas")
  const categories = Array.from(new Set(restaurantConfig.menuItems.map((item) => item.category)))
  const filteredItems = restaurantConfig.menuItems.filter((item) => item.category === selectedCategory)

  return (
    <section id="menu" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-center text-foreground mb-8 tracking-tight">
          NUESTRO MENÚ
        </h2>

        {/* Category Pills */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all group"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-accent">${item.price.toLocaleString()}</span>
                  <Button
                    size="sm"
                    onClick={() => onAddToCart(item)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full"
                  >
                    Agregar <Plus className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PromoSection({ onAddToCart }: { onAddToCart: (item: any) => void }) {
  const { config: restaurantConfig } = useConfig()
  return (
    <section
      id="promos"
      className="py-16 md:py-24 bg-gradient-to-br from-red-900/20 to-orange-900/20 border-y border-border/50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-bold mb-4 animate-pulse">
            OFERTA LIMITADA
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            PROMOS DE LA SEMANA
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {restaurantConfig.promos.map((promo) => (
            <div
              key={promo.id}
              className="bg-card border border-accent/20 rounded-xl p-6 flex flex-col shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                {promo.urgency}
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">{promo.title}</h3>
              <p className="text-muted-foreground mb-6 flex-grow">{promo.description}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Precio Promo</span>
                  <span className="text-3xl font-bold text-accent">${promo.price.toLocaleString()}</span>
                </div>
                <Button
                  onClick={() => onAddToCart({ ...promo, category: "Promo" })}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
                >
                  Agregar al carrito
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const { config: restaurantConfig } = useConfig()
  return (
    <section id="testimonios" className="py-16 md:py-24 bg-secondary/20">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-center text-foreground mb-12 tracking-tight">
          QUÉ DICEN NUESTROS CLIENTES
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {restaurantConfig.testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm text-foreground/90 mb-4 leading-relaxed">"{testimonial.comment}"</p>
              <p className="text-xs font-semibold text-muted-foreground">— {testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function LocationSection() {
  const { config: restaurantConfig } = useConfig()

  // Use mapUrl if provided, otherwise fallback to address
  // This allows the user to specify a more precise location for the map
  const mapQuery = restaurantConfig.mapUrl || restaurantConfig.address
  const encodedQuery = encodeURIComponent(mapQuery)

  const mapUrl = `https://maps.google.com/maps?q=${encodedQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`
  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`

  return (
    <section id="ubicacion" className="py-16 md:py-24 bg-secondary/10">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-center text-foreground mb-12 tracking-tight">
          DÓNDE ESTAMOS
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Info Side */}
          <div className="space-y-8 order-2 md:order-1">
            <div className="bg-card p-8 rounded-2xl shadow-lg border border-border">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold mb-2">Ubicación</h3>
                  <p className="text-lg text-muted-foreground mb-2">{restaurantConfig.address}</p>
                  <p className="text-sm text-muted-foreground">{restaurantConfig.location}</p>
                  <Button
                    variant="link"
                    className="px-0 text-primary mt-2 h-auto font-semibold"
                    onClick={() => window.open(externalMapUrl, '_blank')}
                  >
                    Ver en Google Maps <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold mb-2">Horarios</h3>
                  <p className="text-muted-foreground mb-1">{restaurantConfig.hours.weekdays}</p>
                  <p className="text-muted-foreground">{restaurantConfig.hours.weekends}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Side */}
          <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-xl border border-border order-1 md:order-2 relative group">
            <iframe
              width="100%"
              height="100%"
              src={mapUrl}
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
            <div
              className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors cursor-pointer"
              onClick={() => window.open(externalMapUrl, '_blank')}
              title="Abrir en Google Maps"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const { config: restaurantConfig } = useConfig()
  return (
    <footer className="bg-secondary/50 py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center md:text-left">
          {/* Brand */}
          <div>
            <h4 className="font-heading text-xl font-bold text-foreground mb-3">{restaurantConfig.name}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{restaurantConfig.tagline}</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-bold text-foreground mb-3">CONTACTO</h4>
            <p className="text-sm text-muted-foreground leading-relaxed mb-1">{restaurantConfig.address}</p>
            <p className="text-sm text-muted-foreground">{restaurantConfig.phone}</p>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-heading text-lg font-bold text-foreground mb-3">SEGUINOS</h4>
            <p className="text-sm text-muted-foreground leading-relaxed mb-1">
              Instagram:{" "}
              <a
                href={`https://instagram.com/${restaurantConfig.socialMedia.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                {restaurantConfig.socialMedia.instagram}
              </a>
            </p>
            <p className="text-sm text-muted-foreground">Facebook: {restaurantConfig.socialMedia.facebook}</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © 2025 {restaurantConfig.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

function MobileCartBar({
  cartCount,
  cartTotal,
  onCheckout,
  onOpenCart,
}: {
  cartCount: number
  cartTotal: number
  onCheckout: () => void
  onOpenCart: () => void
}) {
  if (cartCount === 0) return null

  return (
    <div
      onClick={onOpenCart}
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] z-50 animate-in slide-in-from-bottom-full duration-300 cursor-pointer hover:bg-accent/5 transition-colors"
    >
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground">
              {cartCount}
            </Badge>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total a pagar</span>
            <span className="text-xl font-bold text-foreground font-heading">${cartTotal.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-primary font-bold">
          Ver Pedido
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}

function CartModal({
  isOpen,
  onClose,
  cart,
  total,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  total: number
  onUpdateQuantity: (id: string | number, delta: number) => void
  onRemoveItem: (id: string | number) => void
  onCheckout: () => void
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-background border-l border-border h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/20">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-xl font-bold text-foreground">Tu Pedido</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
              <p>Tu carrito está vacío</p>
              <Button
                variant="link"
                onClick={() => {
                  onClose()
                  const section = document.getElementById("menu")
                  section?.scrollIntoView({ behavior: "smooth" })
                }}
                className="mt-2 text-primary"
              >
                Ir al menú
              </Button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 bg-card p-3 rounded-lg border border-border">
                {item.image && (
                  <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-secondary">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-sm line-clamp-2">{item.name}</h3>
                    <div className="text-sm mt-1">
                      <span className="text-muted-foreground">${item.price.toLocaleString()} c/u</span>
                      <span className="mx-2 text-muted-foreground">·</span>
                      <span className="text-accent font-bold">${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 bg-secondary/50 rounded-full px-2 py-1">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-background text-foreground disabled:opacity-30 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-background text-foreground transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-border bg-secondary/20 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xl font-bold text-foreground">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
            <Button
              onClick={onCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-lg shadow-lg"
            >
              Continuar
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// ========================================
// MAIN PAGE COMPONENT
// ========================================
function BurgerLandingPageContent() {
  const searchParams = useSearchParams()
  const { config: restaurantConfig } = useConfig()
  const { cart, addToCart, updateCartQuantity, removeFromCart, cartTotal, cartCount } = useOrder()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isOrderDataModalOpen, setIsOrderDataModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  // Detectar si venimos de Mercado Pago
  const result = searchParams.get("result")

  // Si hay result=success, mostrar SuccessView
  if (result === "success") {
    return <SuccessView />
  }

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name || product.title,
      price: product.price,
      image: product.image,
    })
    setIsCartOpen(true)
  }

  const handleCheckout = () => {
    if (cart.length === 0) return
    setIsCartOpen(false)
    setIsOrderDataModalOpen(true)
  }

  const handleOrderDataContinue = () => {
    setIsOrderDataModalOpen(false)
    setIsPaymentModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <Header cartCount={cartCount} cartTotal={cartTotal} onOpenCart={() => setIsCartOpen(true)} />

      <main>
        <Hero />
        <HowItWorks />
        <MenuSection onAddToCart={handleAddToCart} />
        <PromoSection onAddToCart={handleAddToCart} />
        <LocationSection />
        <Testimonials />
      </main>

      <Footer />

      <MobileCartBar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onCheckout={handleCheckout}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        total={cartTotal}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      <OrderDataModal
        isOpen={isOrderDataModalOpen}
        onClose={() => setIsOrderDataModalOpen(false)}
        onContinue={handleOrderDataContinue}
      />

      <PaymentMethodModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />

      <Toaster position="top-center" richColors />
    </div>
  )
}

export default function BurgerLandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <BurgerLandingPageContent />
    </Suspense>
  )
}
