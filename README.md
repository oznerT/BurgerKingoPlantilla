# Burger Kingo Landing Page

Plantilla de Landing Page para restaurante de hamburguesas (o cualquier otro rubro) con carrito de compras, integración con WhatsApp y Mercado Pago.

## Características

-   **Diseño Moderno**: UI atractiva y responsive.
-   **Carrito de Compras**: Gestión de productos y cantidades.
-   **Pedidos por WhatsApp**: Generación automática de mensajes con el detalle del pedido.
-   **Mercado Pago**: Integración para pagos online (Checkout Pro).
-   **Panel de Administración**: Dashboard para gestionar productos y ver métricas (Demo).

## Configuración

La configuración del sitio (nombre, teléfono, menú, etc.) se encuentra centralizada en `lib/default-data.ts`.

### Mercado Pago

Para habilitar Mercado Pago, renombra `.env.example` a `.env.local` y agrega tu `MERCADOPAGO_ACCESS_TOKEN`.

## Panel de Administración (Demo)

El panel de administración se encuentra en `/admin`.

**Credenciales de Demo:**
-   Usuario: `admin`
-   Contraseña: `123`

> [!NOTE]
> **Importante**: El dashboard actual utiliza datos de prueba (mock data) y la autenticación es solo para fines demostrativos. En un entorno de producción, se debe integrar con un backend real y un sistema de autenticación seguro.

## Tests

El proyecto incluye tests unitarios con Vitest.

```bash
npm run test
```
