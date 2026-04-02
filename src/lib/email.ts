import nodemailer from 'nodemailer'

type EmailPayload = {
  to: string
  subject: string
  text: string
  html?: string
}

function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !port || !user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

export async function sendEmail(payload: EmailPayload) {
  const transporter = getTransporter()
  if (!transporter) {
    return { sent: false, reason: 'SMTP_NOT_CONFIGURED' as const }
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER
  await transporter.sendMail({
    from,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  })

  return { sent: true as const }
}
