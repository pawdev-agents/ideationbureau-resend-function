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
            text: `Hi ${name},

I'm Sam, founder of The Ideation Bureau.

Firstly, thanks so much for reaching out. I really appreciate you taking the time to get in touch.

Before we jump into ideas, I'd love to understand a little more about what you're building.

Could you tell me a little more about your project?
- Brand / company name
- What are you looking to build?
- When are you hoping to launch?
- Anything else you'd like us to know?


Once I've had a chance to read through everything, I'll come back to you with the next steps and how I think we can help.

Thanks,
Sam`,
        })
        return res.status(200).json({ success: true })
    } catch (err) {
        console.error("Resend error:", err)
        return res.status(500).json({ error: "Failed to send email" })
    }
}
