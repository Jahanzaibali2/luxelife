import type { Order } from './types.js'

const ADMIN_EMAIL = 'jahanzaibalikhawaja26@gmail.com'
const FROM_EMAIL = 'LuxeLife <orders@luxelife.site>'

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set — skipping email:', subject)
    return
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    })

    if (!res.ok) {
      console.error('Failed to send email:', subject, await res.text())
    }
  } catch (err) {
    console.error('Failed to send email:', subject, err)
  }
}

// Customer-supplied text goes into HTML — escape it.
function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
}

function money(amount: number, currency: string) {
  return `${currency} ${amount.toFixed(2)}`
}

function itemsHtml(order: Order) {
  return order.items
    .map(
      (item) =>
        `<tr><td style="padding:6px 0">${esc(item.name)}${item.variant ? ` (${esc(item.variant)})` : ''} × ${item.quantity}</td><td style="padding:6px 0;text-align:right">${money(item.price * item.quantity, item.currency)}</td></tr>`,
    )
    .join('')
}

export async function sendOrderReceivedEmail(order: Order) {
  const paid = order.paymentStatus === 'paid'
  const statusLine = paid
    ? 'Your payment has been confirmed.'
    : 'Payment is due on delivery (Cash on Delivery).'

  const html = `
    <h2>Thank you for your order, ${esc(order.customer.firstName)}!</h2>
    <p>Your order <strong>${order.orderNumber}</strong> has been received. ${statusLine}</p>
    <table style="width:100%;border-collapse:collapse">${itemsHtml(order)}</table>
    <p style="text-align:right"><strong>Total: ${money(order.subtotal, order.currency)}</strong></p>
    <p>We'll notify you once your order ships.</p>
  `

  await sendEmail(
    order.customer.email,
    paid ? `Order ${order.orderNumber} confirmed — payment received` : `Order ${order.orderNumber} received`,
    html,
  )
}

export async function sendAdminNewOrderEmail(order: Order) {
  const html = `
    <h2>New order placed: ${order.orderNumber}</h2>
    <p>${esc(`${order.customer.firstName} ${order.customer.lastName} — ${order.customer.email} — ${order.customer.phone}`)}</p>
    <p>Payment: ${order.paymentProvider.toUpperCase()} (${order.paymentStatus})</p>
    <table style="width:100%;border-collapse:collapse">${itemsHtml(order)}</table>
    <p style="text-align:right"><strong>Total: ${money(order.subtotal, order.currency)}</strong></p>
  `

  await sendEmail(ADMIN_EMAIL, `New order: ${order.orderNumber}`, html)
}
