import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// ─── Edit these to match your setup ──────────────────────────────────────────
const FROM_ADDRESS   = "Sam Mooney <sam@theideationbureau.com>"  // must be a verified Resend domain
const REPLY_TO       = "sam@theideationbureau.com"
const ALLOWED_ORIGIN = "https://nuanced-checkout-246944.framer.app"    // your Framer published URL
// ─────────────────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN)
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    if (req.method === "OPTIONS") return res.status(200).end()
    if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" })

    const { email } = req.body ?? {}

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: "Valid email required" })
    }

    try {
        await resend.emails.send({
            from:    FROM_ADDRESS,
            to:      email,
            replyTo: REPLY_TO,
            subject: "Your application to The Ideation Bureau",
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:48px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#fffdf7;border:1px solid #d9d0bc;max-width:560px;width:100%;">

          <!-- Header bar -->
          <tr>
            <td style="background:#2d1a0e;padding:28px 40px;">
              <p style="margin:0;color:#d4b87a;font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;">
                The Ideation Bureau
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 40px 40px;">
              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#2d1a0e;">Hey there,</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#2d1a0e;">
                Thanks for applying to work with The Ideation Bureau.
              </p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#2d1a0e;">
                Before we move forward, I'd like to get a clearer sense of what you're building.
              </p>
              <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:#2d1a0e;">Could you please share:</p>

              <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr><td style="padding:5px 0;font-size:15px;line-height:1.7;color:#2d1a0e;">&ndash;&nbsp; Brand / company name</td></tr>
                <tr><td style="padding:5px 0;font-size:15px;line-height:1.7;color:#2d1a0e;">&ndash;&nbsp; What you're looking to build</td></tr>
                <tr><td style="padding:5px 0;font-size:15px;line-height:1.7;color:#2d1a0e;">&ndash;&nbsp; Timeline</td></tr>
                <tr><td style="padding:5px 0;font-size:15px;line-height:1.7;color:#2d1a0e;">&ndash;&nbsp; Any context you think is important</td></tr>
              </table>

              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#2d1a0e;">
                Once I have this, I'll review and come back to you with next steps.
              </p>
              <p style="margin:0 0 4px;font-size:15px;line-height:1.7;color:#2d1a0e;">Thanks,</p>
              <p style="margin:0;font-size:15px;font-weight:700;line-height:1.7;color:#2d1a0e;">Sam Mooney</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #d9d0bc;padding:20px 40px;">
              <p style="margin:0;font-size:10px;color:#9a8f7e;letter-spacing:2px;text-transform:uppercase;">
                The Ideation Bureau &nbsp;&middot;&nbsp; APP/001
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
        })

        return res.status(200).json({ success: true })
    } catch (err) {
        console.error("Resend error:", err)
        return res.status(500).json({ error: "Failed to send email" })
    }
}
