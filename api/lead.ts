import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";

/**
 * POST /api/lead — accepts a waitlist or support submission and delivers it to
 * Telegram. Telegram is the "database": there is no persistent store, leads are
 * pushed to the configured chat via the Bot API.
 *
 * Self-contained on purpose: serverless functions run compiled JS, so this file
 * does not import workspace TypeScript-source packages (@workspace/*). It only
 * depends on `zod` and Node/Web globals.
 *
 * Env (Vercel → Settings → Environment Variables):
 *   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 */

const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SubmitLeadBody = z.object({
  kind: z.enum(["waitlist", "support"]),
  name: z.string().min(1).optional(),
  email: z.string().regex(emailRegExp),
  role: z.enum(["тренер", "атлет", "не указано"]).optional(),
  topic: z.string().optional(),
  message: z.string().optional(),
  product: z.string().optional(),
});

type Lead = z.infer<typeof SubmitLeadBody>;

const TELEGRAM_API_BASE = "https://api.telegram.org";

const kindLabels: Record<Lead["kind"], string> = {
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

interface TelegramConfig {
  botToken: string;
  chatId: string;
}

function getTelegramConfig(): TelegramConfig | null {
  const botToken = process.env["TELEGRAM_BOT_TOKEN"];
  const chatId = process.env["TELEGRAM_CHAT_ID"];
  if (!botToken || !chatId) return null;
  return { botToken, chatId };
}

async function sendLeadToTelegram(
  lead: Lead,
  config: TelegramConfig,
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

  const parsed = SubmitLeadBody.safeParse(req.body);
  if (!parsed.success) {
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
    await sendLeadToTelegram(parsed.data, config);
  } catch (err) {
    console.error("Failed to deliver lead to Telegram", err, parsed.data);
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
