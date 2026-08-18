# Публикация на Vercel

Фронт (Vite SPA) раздаётся как статика, `/api/*` — serverless-функции
(`api/lead.ts`, `api/healthz.ts`). «База» лидов — Telegram-бот через Bot API,
отдельная БД не нужна.

## 1. Telegram
1. @BotFather → `/newbot` → скопируй **токен** (`TELEGRAM_BOT_TOKEN`).
2. Напиши боту любое сообщение, открой
   `https://api.telegram.org/bot<ТОКЕН>/getUpdates`, возьми `chat.id`
   (`TELEGRAM_CHAT_ID`) — это НЕ id самого бота, а чат-получатель.

## 2. Импорт в Vercel
- New Project → импортируй репозиторий. **Root Directory = корень репозитория**
  (где лежит этот файл и `vercel.json`).
- Framework Preset: **Other** (всё уже задано в `vercel.json`:
  build фронта, `outputDirectory`, SPA-rewrites, pnpm).

## 3. Переменные окружения (Project → Settings → Environment Variables)
```
TELEGRAM_BOT_TOKEN = 123456789:AA...
TELEGRAM_CHAT_ID    = 123456789
```
Добавь для Production (и Preview, если нужно) → **Redeploy**.
Без них `/api/lead` вернёт 503, формы покажут «Отправка временно недоступна».

## 4. Домен и SEO
- Project → Settings → Domains → добавь домен, Vercel подскажет DNS, HTTPS сам.
- Канонический адрес зашит как `https://naore.ru` в `index.html`,
  `public/robots.txt`, `public/sitemap.xml` и `SITE_ORIGIN` в `App.tsx` —
  если домен другой, заменить `naore.ru` во всех этих местах.

## 5. Юр. реквизиты (обязательно до публикации)
В `artifacts/naore-fitness/src/App.tsx`, функция `LegalPage`, заменить
плейсхолдеры (ИП/ООО, ИНН, ОГРН, адрес, дата) и удалить жёлтую плашку
`data-testid="text-legal-requisites"`.

## Проверка после деплоя
```
curl https://<домен>/api/healthz
curl -X POST https://<домен>/api/lead -H "Content-Type: application/json" \
  -d '{"kind":"support","name":"Тест","email":"t@e.ru","role":"тренер","topic":"Проверка","message":"Тестовое сообщение"}'
```
Заявка должна прийти в Telegram, ответ — `201`.

## Локальная разработка
```
corepack pnpm install
# терминал 1 — API (Express)
PORT=5000 TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... corepack pnpm --filter @workspace/api-server run dev
# терминал 2 — фронт (Vite проксирует /api → :5000)
corepack pnpm --filter @workspace/naore-fitness run dev
```
Либо `vercel dev` из корня — поднимет фронт и функции как в проде.
