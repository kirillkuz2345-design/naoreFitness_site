import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SubmitLeadBody } from "@workspace/api-zod";
import { getTelegramConfig, sendLeadToTelegram } from "@workspace/leads";

/**
 * POST /api/lead — accepts a waitlist or support submission and delivers it to
 * Telegram. Telegram is the "database": there is no persistent store, leads are
 * pushed to the configured chat via the Bot API.
 *
 * Env (set in Vercel Project → Settings → Environment Variables):
 *   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 */
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
    // Log the full lead so it is not lost if delivery fails.
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
