import type { LeadInput } from "@workspace/api-zod";

type Lead = LeadInput;

const TELEGRAM_API_BASE = "https://api.telegram.org";

const kindLabels: Record<Lead["kind"], string> = {
  waitlist: "Лист ожидания",
  support: "Поддержка",
};

/**
 * Escapes text for Telegram HTML parse mode.
 * Only &, < and > must be escaped.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function formatLeadMessage(lead: Lead): string {
  const lines: string[] = [];
  lines.push(`🟢 <b>Новая заявка NAORE</b>`);
  lines.push(`<b>Тип:</b> ${escapeHtml(kindLabels[lead.kind])}`);
  if (lead.name) lines.push(`<b>Имя:</b> ${escapeHtml(lead.name)}`);
  lines.push(`<b>Email:</b> ${escapeHtml(lead.email)}`);
  if (lead.role) lines.push(`<b>Роль:</b> ${escapeHtml(lead.role)}`);
  if (lead.product) lines.push(`<b>Продукт:</b> ${escapeHtml(lead.product)}`);
  if (lead.topic) lines.push(`<b>Тема:</b> ${escapeHtml(lead.topic)}`);
  if (lead.message) lines.push(`<b>Сообщение:</b>\n${escapeHtml(lead.message)}`);
  lines.push(`<b>Время:</b> ${escapeHtml(new Date().toISOString())}`);
  return lines.join("\n");
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

/**
 * Reads Telegram configuration from the environment.
 * Returns null when the integration is not configured so the caller can
 * decide how to degrade (e.g. respond with an error instead of crashing).
 */
export function getTelegramConfig(): TelegramConfig | null {
  const botToken = process.env["TELEGRAM_BOT_TOKEN"];
  const chatId = process.env["TELEGRAM_CHAT_ID"];
  if (!botToken || !chatId) return null;
  return { botToken, chatId };
}

/**
 * Delivers a lead to the configured Telegram chat.
 * Throws when the Telegram API rejects the request, so the caller can surface
 * a delivery failure to the client.
 */
export async function sendLeadToTelegram(
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
