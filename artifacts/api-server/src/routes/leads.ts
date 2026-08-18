import { Router, type IRouter, type Request, type Response } from "express";
import { SubmitLeadBody } from "@workspace/api-zod";
import { getTelegramConfig, sendLeadToTelegram } from "@workspace/leads";

const router: IRouter = Router();

// Lightweight in-memory rate limiter: max submissions per IP per window.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS,
  );
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

router.post("/lead", async (req: Request, res: Response) => {
  const ip = req.ip ?? "unknown";
  if (isRateLimited(ip)) {
    res
      .status(429)
      .json({ error: "Слишком много заявок. Попробуйте через минуту." });
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
    req.log.error(
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
    req.log.error({ err, lead: parsed.data }, "Failed to deliver lead to Telegram");
    res.status(502).json({
      error:
        "Не удалось отправить заявку. Попробуйте ещё раз или напишите на support@naore.ru.",
    });
    return;
  }

  req.log.info({ kind: parsed.data.kind }, "Lead delivered to Telegram");
  res.status(201).json({
    ok: true,
    message: "Заявка принята. Мы свяжемся с вами в ближайшее время.",
  });
});

export default router;
