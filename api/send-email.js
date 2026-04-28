import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_ADDRESS = "Sam Mooney <sam@theideationbureau.com>"
const REPLY_TO     = "sam@theideationbureau.com"
const ALLOWED_ORIGINS = [
    "https://nuanced-checkout-246944.framer.app",
    "https://theideationbureau.com",
]

export default async function handler(req, res) {
    const origin = req.headers.origin ?? ""
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
        ? origin
        : ALLOWED_ORIGINS[0]

    res.setHeader("Access-Control-Allow-Origin", allowedOrigin)
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    if (req.method === "OPTIONS") return res.status(200).end()
    if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" })

    const { name, email } = req.body ?? {}

    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: "Name and valid email required" })
    }

    try {
        await resend.emails.send({
            from:    FROM_ADDRESS,
            to:      email,
            replyTo: REPLY_TO,
            subject: "Your application to The Ideation Bureau",
            text: `Hey ${name},

Thanks for applying to work with The Ideation Bureau.

Before we move forward, I'd like to get a clearer sense of what you're building.

Could you please share:
– Brand / company name
– What you're looking to build
– Timeline
– Any context you think is important

Once I have this, I'll review and come back to you with next steps.

Thanks,
Sam Mooney`,
        })
        return res.status(200).json({ success: true })
    } catch (err) {
        console.error("Resend error:", err)
        return res.status(500).json({ error: "Failed to send email" })
    }
}
