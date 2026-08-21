import { prisma } from "@/lib/prisma"

type EmailInput = {
  to: string
  subject: string
  html: string
  template: string
  idempotencyKey: string
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)
}

export async function sendTransactionalEmail(input: EmailInput) {
  const existing = await prisma.emailDelivery.findUnique({
    where: { idempotencyKey: input.idempotencyKey },
  })

  if (existing?.status === "SENT") {
    return { sent: true, deliveryId: existing.id }
  }

  const delivery = existing ??
    (await prisma.emailDelivery.create({
      data: {
        toEmail: input.to.toLowerCase(),
        template: input.template,
        idempotencyKey: input.idempotencyKey,
      },
    }))

  if (!isEmailConfigured()) {
    await prisma.emailDelivery.update({
      where: { id: delivery.id },
      data: {
        status: "SKIPPED",
        error: "RESEND_API_KEY ou EMAIL_FROM não configurada.",
      },
    })
    return { sent: false, deliveryId: delivery.id, reason: "not_configured" as const }
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": input.idempotencyKey,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [input.to],
        subject: input.subject,
        html: input.html,
      }),
    })

    const payload = (await response.json().catch(() => ({}))) as { id?: string; message?: string }
    if (!response.ok) {
      throw new Error(payload.message ?? `Resend respondeu ${response.status}.`)
    }

    await prisma.emailDelivery.update({
      where: { id: delivery.id },
      data: { status: "SENT", providerId: payload.id ?? null, error: null },
    })
    return { sent: true, deliveryId: delivery.id }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha desconhecida no envio."
    await prisma.emailDelivery.update({
      where: { id: delivery.id },
      data: { status: "FAILED", error: message.slice(0, 500) },
    })
    return { sent: false, deliveryId: delivery.id, reason: "provider_error" as const }
  }
}

export function accessEmailHtml(input: { name: string; url: string; firstAccess: boolean }) {
  const name = escapeHtml(input.name)
  const url = escapeHtml(input.url)
  const title = input.firstAccess ? "Ative seu acesso KidsCard" : "Redefina sua senha KidsCard"
  const description = input.firstAccess
    ? "Seu pré-cadastro foi aprovado. Defina uma senha para concluir o primeiro acesso."
    : "Recebemos uma solicitação para redefinir sua senha."

  return `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#f4f6fb;font-family:Arial,sans-serif;color:#0f172a"><div style="max-width:560px;margin:0 auto;padding:40px 20px"><div style="background:#fff;border-radius:24px;padding:32px;border:1px solid #e2e8f0"><div style="font-size:14px;font-weight:700;color:#5b2cff">KidsCard</div><h1 style="font-size:26px;margin:12px 0">${title}</h1><p style="line-height:1.7">Olá, ${name}.</p><p style="line-height:1.7">${description}</p><p style="margin:28px 0"><a href="${url}" style="display:inline-block;background:#5b2cff;color:#fff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:999px">Definir nova senha</a></p><p style="font-size:13px;line-height:1.6;color:#64748b">Se você não reconhece esta solicitação, ignore este e-mail. O link é individual, temporário e só pode ser usado uma vez.</p></div></div></body></html>`
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    }
    return entities[character]
  })
}
