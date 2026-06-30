import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const FROM_EMAIL = "Linternita Velas <pedidos@linternita.com.mx>";
const FALLBACK_FROM_EMAIL = "Linternita Velas <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? "laugomezc8@gmail.com";

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  aroma?: string;
  size?: string;
  eventDetails?: {
    ribbonColor?: string;
    cardColor?: string;
    eventName?: string;
    eventDate?: string;
    phrase?: string;
  };
}

interface NotifyPayload {
  orderId: string;
  orderNumber: number | string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
}

const fmt = (p: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(p);

function itemsHtml(items: OrderItem[]) {
  return items
    .map((item) => {
      const details = [item.aroma, item.size].filter(Boolean).join(" · ");
      const event = item.eventDetails;
      const eventLines = event
        ? [
            event.ribbonColor ? `🎀 Listón: ${event.ribbonColor}` : "",
            event.eventName ? `🎉 Evento: ${event.eventName}` : "",
            event.eventDate ? `📅 Fecha: ${event.eventDate}` : "",
            event.phrase ? `💬 Frase: "${event.phrase}"` : "",
          ].filter(Boolean).join("<br/>")
        : "";
      return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;">
            <strong>${item.name}</strong> x${item.quantity}
            ${details ? `<br/><span style="color:#888;font-size:13px;">${details}</span>` : ""}
            ${eventLines ? `<br/><span style="color:#C9A84C;font-size:13px;">${eventLines}</span>` : ""}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap;">
            ${fmt(item.subtotal)}
          </td>
        </tr>`;
    })
    .join("");
}

function adminEmailHtml(order: NotifyPayload) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#2C1810;">
      <h2 style="color:#C9A84C;">Nuevo pedido #${order.orderNumber}</h2>
      <p><strong>Cliente:</strong> ${order.customerName}</p>
      <p><strong>Correo:</strong> ${order.customerEmail}</p>
      <p><strong>Teléfono:</strong> ${order.customerPhone}</p>
      <p><strong>Dirección:</strong> ${order.customerAddress}</p>
      <p><strong>Método de pago:</strong> ${order.paymentMethod === "whatsapp" ? "WhatsApp / Transferencia" : order.paymentMethod}</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        ${itemsHtml(order.items)}
      </table>
      <p style="text-align:right;font-size:18px;font-weight:bold;margin-top:16px;">
        Total: <span style="color:#C9A84C;">${fmt(order.total)}</span>
      </p>
    </div>`;
}

function customerEmailHtml(order: NotifyPayload) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#2C1810;">
      <h2 style="color:#C9A84C;">¡Gracias por tu pedido, ${order.customerName.split(" ")[0]}! 🕯️</h2>
      <p>Recibimos tu pedido <strong>#${order.orderNumber}</strong> y ya lo estamos preparando con mucho cariño.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        ${itemsHtml(order.items)}
      </table>
      <p style="text-align:right;font-size:18px;font-weight:bold;margin-top:16px;">
        Total: <span style="color:#C9A84C;">${fmt(order.total)}</span>
      </p>
      <p style="margin-top:24px;">Te contactaremos por WhatsApp para confirmar los datos de pago y entrega.</p>
      <p style="color:#888;font-size:13px;margin-top:24px;">Linternita Velas Artesanales</p>
    </div>`;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY no configurada" }, { status: 500 });
  }

  const order = (await req.json()) as NotifyPayload;
  const resend = new Resend(apiKey);
  const from = process.env.RESEND_VERIFIED_FROM === "true" ? FROM_EMAIL : FALLBACK_FROM_EMAIL;

  const results = await Promise.allSettled([
    resend.emails.send({
      from,
      to: ADMIN_EMAIL,
      subject: `🛍️ Nuevo pedido #${order.orderNumber} — ${fmt(order.total)}`,
      html: adminEmailHtml(order),
    }),
    order.customerEmail
      ? resend.emails.send({
          from,
          to: order.customerEmail,
          subject: `Confirmación de tu pedido #${order.orderNumber} — Linternita`,
          html: customerEmailHtml(order),
        })
      : Promise.resolve(null),
  ]);

  const errors = results.filter((r) => r.status === "rejected");
  if (errors.length > 0) {
    console.error("Error enviando notificaciones de pedido:", errors);
  }

  return NextResponse.json({ ok: true });
}
