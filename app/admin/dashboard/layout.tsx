"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, Utensils, Settings, BarChart3 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        const auth = localStorage.getItem("admin-auth")
        if (auth !== "true") {
            router.push("/admin")
        } else {
            setIsAuthorized(true)
        }
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem("admin-auth")
        router.push("/admin")
    }

    if (!isAuthorized) return null

    const navItems = [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        // We'll implement tabs in the main dashboard page instead of separate routes for simplicity
        // but keeping the structure ready for expansion
    ]

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-card border-r border-border p-4 flex flex-col">
                <div className="mb-8 px-2">
                    <h1 className="font-heading text-xl font-bold text-primary">BURGER KINGO</h1>
                    <p className="text-xs text-muted-foreground">Panel de Control</p>
                </div>

                <nav className="space-y-2 flex-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${pathname === item.href
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto pt-4 border-t border-border space-y-2">
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                            if (window.confirm("¿Estás seguro de que querés volver a la página principal? Se cerrará tu sesión.")) {
                                localStorage.removeItem("admin-auth")
                                router.push("/")
                            }
                        }}
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Volver a la web
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-muted-foreground"
                        onClick={() => {
                            if (window.confirm("¿Estás seguro de que querés cerrar sesión?")) {
                                handleLogout()
                            }
                        }}
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Cerrar Sesión
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">{children}</main>
        </div>
    )
}
