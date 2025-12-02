import { MercadoPagoConfig, Preference } from "mercadopago"

export async function POST(req: Request) {
    let preferenceData: any = {}
    try {
        if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
            console.error("MERCADOPAGO_ACCESS_TOKEN is not defined")
            return Response.json({ error: "Server configuration error: Missing access token" }, { status: 500 })
        }

        const client = new MercadoPagoConfig({
            accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
        })

        const { items } = await req.json()

        // Dynamic URL detection
        const host = req.headers.get("host")
        const protocol = req.headers.get("x-forwarded-proto") || "http"
        const dynamicUrl = host ? `${protocol}://${host}` : null
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || dynamicUrl || "http://localhost:3000"

        console.log("Creating preference with siteUrl:", siteUrl)

        const preference = new Preference(client)

        const backUrls = {
            success: `${siteUrl}/?result=success&status=approved`,
            failure: `${siteUrl}/?result=success&status=rejected`,
            pending: `${siteUrl}/?result=success&status=pending`,
        }

        preferenceData = {
            body: {
                items: items.map((item: any) => ({
                    id: item.id.toString(),
                    title: item.name,
                    quantity: item.quantity,
                    unit_price: Number(item.price),
                    currency_id: "ARS",
                })),
                back_urls: backUrls,
                ...((siteUrl.startsWith("https")) && { auto_return: "approved" }),
            },
        }

        console.log("Preference payload:", JSON.stringify(preferenceData, null, 2))

        const response = await preference.create(preferenceData)

        return Response.json({ id: response.id, init_point: response.init_point })
    } catch (error: any) {
        console.error("Error creating preference:", error)
        const errorMessage = error.message || "Unknown error"
        const errorDetails = error.cause || error
        return Response.json(
            {
                error: "Error creating preference",
                message: errorMessage,
                details: errorDetails,
                debug_payload: preferenceData, // Include payload for debugging
            },
            { status: 500 }
        )
    }
}
