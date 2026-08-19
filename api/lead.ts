import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * POST /api/lead — accepts a waitlist or support submission and delivers it to
 * Telegram. Telegram is the "database": leads are pushed to the configured chat
 * via the Bot API, there is no persistent store.
 *
 * Zero runtime dependencies on purpose: serverless functions run compiled JS
 * and this file imports only `@vercel/node` types (compile-time). Validation is
 * done by hand so nothing needs to be resolved/required at runtime.
 *
 * Env (Vercel → Settings → Environment Variables):
 *   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 */

const TELEGRAM_API_BASE = "https://api.telegram.org";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KINDS = ["waitlist", "support"] as const;
const ROLES = ["тренер", "атлет", "не указано"] as const;

type Kind = (typeof KINDS)[number];

interface Lead {
  kind: Kind;
  email: string;
  name?: string;
  role?: string;
  topic?: string;
  message?: string;
  product?: string;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

/** Validates the request body by hand and returns a normalized Lead or null. */
function parseLead(body: unknown): Lead | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;

  const kind = b["kind"];
  if (typeof kind !== "string" || !KINDS.includes(kind as Kind)) return null;

  const email = b["email"];
  if (typeof email !== "string" || !EMAIL_RE.test(email)) return null;

  const role = optionalString(b["role"]);
  if (role !== undefined && !ROLES.includes(role as (typeof ROLES)[number])) {
    return null;
  }

  return {
    kind: kind as Kind,
    email,
    name: optionalString(b["name"]),
    role,
    topic: optionalString(b["topic"]),
    message: optionalString(b["message"]),
    product: optionalString(b["product"]),
  };
}

const kindLabels: Record<Kind, string> = {
  waitlist: "Лист ожидания",
  support: "Поддержка",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatLeadMessage(lead: Lead): string {
  const lines: string[] = [];
  lines.push(`🟢 <b>Новая заявка NAORE</b>`);
  lines.push(`<b>Тип:</b> ${escapeHtml(kindLabels[lead.kind])}`);
  if (lead.name) lines.push(`<b>Имя:</b> ${escapeHtml(lead.name)}`);
  lines.push(`<b>Email:</b> ${escapeHtml(lead.email)}`);
  if (lead.role) lines.push(`<b>Роль:</b> ${escapeHtml(lead.role)}`);
  if (lead.product) lines.push(`<b>Продукт:</b> ${escapeHtml(lead.product)}`);
  if (lead.topic) lines.push(`<b>Тема:</b> ${escapeHtml(lead.topic)}`);
  if (lead.message)
    lines.push(`<b>Сообщение:</b>\n${escapeHtml(lead.message)}`);
  lines.push(`<b>Время:</b> ${escapeHtml(new Date().toISOString())}`);
  return lines.join("\n");
}

function getTelegramConfig(): { botToken: string; chatId: string } | null {
  const botToken = process.env["TELEGRAM_BOT_TOKEN"];
  const chatId = process.env["TELEGRAM_CHAT_ID"];
  if (!botToken || !chatId) return null;
  return { botToken, chatId };
}

async function sendLeadToTelegram(
  lead: Lead,
  config: { botToken: string; chatId: string },
): Promise<void> {
  const url = `${TELEGRAM_API_BASE}/bot${config.botToken}/sendMessage`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: formatLeadMessage(lead),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      const details = await response.text().catch(() => "");
      throw new Error(
        `Telegram API responded with ${response.status}: ${details}`,
      );
    }
  } finally {
    clearTimeout(timeout);
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Метод не поддерживается." });
    return;
  }

  // Vercel parses JSON bodies automatically, but be defensive if it arrives raw.
  let body: unknown = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = undefined;
    }
  }

  const lead = parseLead(body);
  if (!lead) {
    res
      .status(400)
      .json({ error: "Проверьте заполнение формы и попробуйте ещё раз." });
    return;
  }

  const config = getTelegramConfig();
  if (!config) {
    console.error(
      "Telegram is not configured (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID missing)",
    );
    res.status(503).json({
      error:
        "Отправка временно недоступна. Напишите нам на support@naore.ru — мы ответим.",
    });
    return;
  }

  try {
    await sendLeadToTelegram(lead, config);
  } catch (err) {
    console.error("Failed to deliver lead to Telegram", err);
    res.status(502).json({
      error:
        "Не удалось отправить заявку. Попробуйте ещё раз или напишите на support@naore.ru.",
    });
    return;
  }

  res.status(201).json({
    ok: true,
    message: "Заявка принята. Мы свяжемся с вами в ближайшее время.",
  });
}
