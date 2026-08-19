import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { ArrowRight, CalendarDays, Check, ChevronDown, Clock3, Database, Dumbbell, Flame, Headphones, LineChart, Menu, MessageCircle, MessagesSquare, Send, Star, TrendingUp, X } from 'lucide-react';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { MockAnalytics, MockAthlete, MockAvatar, MockCalendar, MockChat, MockConstructor, MockHistory, MockKbju, MockTrainer } from './mockups';

const queryClient = new QueryClient();

const SITE_ORIGIN = 'https://naore-fitness-site.vercel.app';

// Платформа NAORE — регистрация с предвыбором роли (client — атлет, trainer — тренер)
const REGISTER_URL = 'https://vibefitness-pearl.vercel.app/register';
const REGISTER_CLIENT = `${REGISTER_URL}?role=client`;
const REGISTER_TRAINER = `${REGISTER_URL}?role=trainer`;

function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    const setMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute('name', name); document.head.appendChild(tag); }
      tag.setAttribute('content', content);
    };
    const setProp = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute('property', property); document.head.appendChild(tag); }
      tag.setAttribute('content', content);
    };
    setMeta('description', description);
    setMeta('keywords', 'платформа для фитнес тренера, программа для фитнес тренера, приложение для фитнес тренера, сервис для фитнес тренера, конструктор тренировок, ведение клиентов, CRM для фитнес тренера, аналитика прогресса клиентов');
    const canonical = window.location.pathname === '/' ? SITE_ORIGIN + '/' : SITE_ORIGIN + window.location.pathname.replace(/\/$/, '');
    setProp('og:title', title);
    setProp('og:description', description);
    setProp('og:url', canonical);
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.setAttribute('rel', 'canonical'); document.head.appendChild(link); }
    link.setAttribute('href', canonical);
  }, [title, description]);
}

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="topbar">
    <Link href="/" className="brand" data-testid="link-home"><span className="brand-mark"><span>N</span></span> NAORE</Link>
    <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Открыть меню" aria-expanded={open} data-testid="button-mobile-menu">{open ? <X size={19} /> : <Menu size={19} />}</button>
    <nav className={`nav ${open ? 'open' : ''}`} aria-label="Основная навигация">
      <a href="#features" onClick={() => setOpen(false)} data-testid="link-features">Возможности</a>
      <a href="#for-athletes" onClick={() => setOpen(false)} data-testid="link-athletes">Атлетам</a>
      <a href="#for-trainers" onClick={() => setOpen(false)} data-testid="link-trainers">Тренерам</a>
      <a href="#pricing" onClick={() => setOpen(false)} data-testid="link-pricing">Тарифы</a>
      <a href="#faq" onClick={() => setOpen(false)} data-testid="link-faq">FAQ</a>
      <a href={REGISTER_CLIENT} className="nav-cta" data-testid="link-register">Начать <ArrowRight size={14} /></a>
    </nav>
  </header>;
}

function ProductPreview() {
  return <div className="product-visual" aria-label="Предпросмотр аналитики NAORE">
    <div className="app-frame">
      <div className="app-top"><span className="app-logo">NAORE / DASHBOARD</span><span className="app-status">СИСТЕМА В СЕТИ</span></div>
      <div className="app-body">
        <aside className="app-side" aria-hidden="true"><div className="side-pill active" /><div className="side-pill" /><div className="side-pill" /><div className="side-pill" /><div className="side-pill" /></aside>
        <div className="app-main">
          <div className="app-greeting">СРЕДА, 24 АПРЕЛЯ</div><div className="app-big">Ваш прогресс</div>
          <div className="metric-row"><div className="metric"><span>ТРЕНИРОВКИ</span><strong>18 <b>+3</b></strong></div><div className="metric"><span>ВЫПОЛНЕНО</span><strong>86% <b>+8%</b></strong></div></div>
          <div className="chart"><div className="chart-head"><strong>Нагрузка за неделю</strong><span>Последние 7 дней</span></div><svg viewBox="0 0 400 120" role="img" aria-label="График роста нагрузки"><path className="chart-grid" d="M0 25H400M0 60H400M0 95H400" /><path className="chart-area" d="M0 94L58 79L115 83L172 50L230 61L285 32L340 44L400 15V120H0Z" /><path className="chart-line" d="M0 94L58 79L115 83L172 50L230 61L285 32L340 44L400 15" /></svg></div>
          <div className="next-workout"><span>СЛЕДУЮЩАЯ ТРЕНИРОВКА<strong>Ноги / сила</strong></span><ArrowRight size={17} /></div>
        </div>
      </div>
    </div>
  </div>;
}

function HeroVisual() {
  return <div className="hero-visual">
    <div className="float-card float-a"><span className="fc-ico"><Flame size={17} /></span><span><span className="fc-label">Серия</span><span className="fc-value">12 дней</span></span></div>
    <div className="float-card float-b"><span className="fc-ico"><TrendingUp size={17} /></span><span><span className="fc-label">Прогресс</span><span className="fc-value">+8% за неделю</span></span></div>
    <div className="float-card float-c"><span className="fc-ico"><Dumbbell size={17} /></span><span><span className="fc-label">Тренировка</span><span className="fc-value">Ноги / сила</span></span></div>
    <ProductPreview />
  </div>;
}

const marqueeItems = ['Конструктор тренировок', 'Аналитика прогресса', 'Живой чат тренер↔клиент', 'Календарь и платежи', 'Калькулятор КБЖУ', 'Офлайн-доступ (PWA)'];

function Marquee() {
  return <div className="marquee" aria-hidden="true"><div className="marquee-track">
    {[0, 1].map((dup) => <div className="marquee-item" key={dup}>{marqueeItems.map((item) => <span key={item + dup}>{item} <b>/</b> </span>)}</div>)}
  </div></div>;
}

const goals = [
  { key: 'mass', Mock: MockConstructor, tab: 'Набор массы', title: 'Растите силу и объём', copy: 'Прогрессивная нагрузка, подходы и веса под контролем. Тренер собирает программу, вы видите, как растут показатели неделя за неделей.', stats: [['500+', 'упражнений'], ['8 нед', 'видимый рост']], label: 'СКРИН: программа набора массы · 16:10' },
  { key: 'cut', Mock: MockKbju, tab: 'Похудение', title: 'Снижайте вес системно', copy: 'Калькулятор КБЖУ и аналитика держат дефицит под контролем. Никаких догадок — только цифры и понятная динамика.', stats: [['КБЖУ', 'калькулятор'], ['7 дней', 'аналитика']], label: 'СКРИН: калькулятор КБЖУ · 16:10' },
  { key: 'track', Mock: MockHistory, tab: 'Трекинг результатов', title: 'Каждая тренировка — в истории', copy: 'Полный архив тренировок и результатов. Работает офлайн (PWA) — данные всегда под рукой, даже без интернета.', stats: [['100%', 'история'], ['PWA', 'офлайн']], label: 'СКРИН: история тренировок · 16:10' },
  { key: 'motivation', Mock: MockChat, tab: 'Мотивация', title: 'Не бросайте на полпути', copy: 'Живой чат с тренером, комментарии к упражнениям и видимый прогресс держат в тонусе. Поддержка там, где проходит тренировка.', stats: [['24/7', 'чат с тренером'], ['↗', 'динамика']], label: 'СКРИН: чат тренер↔клиент · 16:10' },
];

function GoalTabs() {
  const [index, setIndex] = useState(0);
  const goal = goals[index];
  return <>
    <div className="goal-tabs" role="tablist">
      {goals.map((g, i) => <button key={g.key} role="tab" aria-selected={i === index} className={`goal-tab ${i === index ? 'active' : ''}`} onClick={() => setIndex(i)} data-testid={`tab-goal-${g.key}`}>{g.tab}</button>)}
    </div>
    <div className="goal-panel">
      <div className="goal-copy">
        <h3>{goal.title}</h3>
        <p>{goal.copy}</p>
        <div className="goal-stats">{goal.stats.map(([value, label]) => <div className="goal-stat" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
        <a href={REGISTER_CLIENT} className="btn btn-primary" style={{ marginTop: 26 }} data-testid={`button-goal-${goal.key}`}>Начать бесплатно <ArrowRight size={16} /></a>
      </div>
      <goal.Mock ratio="wide" />
    </div>
  </>;
}

const features = [
  { icon: Dumbbell, Mock: MockConstructor, title: 'Конструктор тренировок', copy: 'Собирайте программы из упражнений — подходы, веса, расписание.', label: 'СКРИН: конструктор · 16:10' },
  { icon: LineChart, Mock: MockAnalytics, title: 'Аналитика прогресса', copy: 'Динамика по неделям вместо ощущений: объём, выполнение, тренды.', label: 'СКРИН: аналитика · 16:10' },
  { icon: MessagesSquare, Mock: MockChat, title: 'Живой чат', copy: 'Комментарии к упражнениям и общение тренер↔клиент в тренировке.', label: 'СКРИН: чат · 16:10' },
  { icon: CalendarDays, Mock: MockCalendar, title: 'Календарь и платежи', copy: 'Расписание, напоминания и оплаты — в одном кабинете.', label: 'СКРИН: календарь · 16:10' },
];

const trainerValues = ['Конструктор тренировок', 'Единый кабинет клиентов', 'Аналитика прогресса клиентов', 'Живой чат тренер↔клиент', 'Календарь и платежи'];
const athleteValues = ['Персональная программа от тренера', 'Трекер тренировок и архив', 'Аналитика результатов по неделям', 'Калькулятор КБЖУ', 'Офлайн-доступ (PWA)'];

function ValueBlock({ role, title, values, action, href, media, reverse = false }: { role: string; title: string; values: string[]; action: string; href: string; media: ReactNode; reverse?: boolean }) {
  return <div className={`value-block ${reverse ? 'reverse' : ''}`}>
    <div className="value-media">{media}</div>
    <div className="value-body">
      <span className="value-role">{role}</span>
      <h3>{title}</h3>
      <div className="value-list">{values.map((value, i) => <div className="value-item" key={value}><span className="value-check"><Check size={13} /></span> <span data-testid={`text-value-${role}-${i}`}>{value}</span></div>)}</div>
      <a href={href} className="btn btn-primary" data-testid={`button-value-${role}`}>{action} <ArrowRight size={16} /></a>
    </div>
  </div>;
}

const reviews = [
  { name: 'Мария К.', handle: 'атлет', text: 'Наконец-то весь план, прогресс и переписка с тренером в одном месте. За два месяца — заметный результат.' },
  { name: 'Дмитрий Р.', handle: 'тренер', text: 'Веду 20 клиентов без хаоса в мессенджерах. Конструктор и аналитика экономят часы каждую неделю.' },
  { name: 'Анна С.', handle: 'атлет', text: 'Калькулятор КБЖУ и понятная динамика помогли не бросить. Всё под рукой, даже офлайн.' },
];

function Reviews() {
  return <div className="reviews-track">
    {reviews.map((r) => <div className="review-card" key={r.name}>
      <div className="review-stars" aria-label="5 из 5">{[0, 1, 2, 3, 4].map((s) => <Star key={s} size={15} fill="currentColor" strokeWidth={0} />)}</div>
      <p className="review-text">{r.text}</p>
      <div className="review-user"><MockAvatar name={r.name} /><span><span className="review-name" style={{ display: 'block' }}>{r.name}</span><span className="review-handle">{r.handle}</span></span></div>
    </div>)}
  </div>;
}

const plans = [
  { name: 'Старт', price: 'Бесплатно', note: '', href: REGISTER_CLIENT, cta: 'Начать бесплатно', featured: false, list: ['Личный профиль атлета', 'Трекер тренировок и архив', 'Калькулятор КБЖУ', 'Офлайн-доступ (PWA)'] },
  { name: 'Pro', price: 'Скоро', note: 'ранний доступ', href: REGISTER_CLIENT, cta: 'В лист ожидания', featured: true, list: ['Всё из тарифа Старт', 'Расширенная аналитика', 'Персональная программа от тренера', 'Приоритетная поддержка'] },
  { name: 'Тренер', price: 'Скоро', note: 'ранний доступ', href: REGISTER_TRAINER, cta: 'Стать тренером', featured: false, list: ['Единый кабинет клиентов', 'Конструктор тренировок', 'Аналитика клиентов', 'Календарь и платежи'] },
];

function Pricing() {
  return <div className="pricing-grid">
    {plans.map((p) => <div className={`plan ${p.featured ? 'featured' : ''}`} key={p.name}>
      <div className="plan-name">{p.name}{p.featured && <span className="badge">Популярно</span>}</div>
      <div className="plan-price">{p.price} {p.note && <small>{p.note}</small>}</div>
      <ul className="plan-list">{p.list.map((item) => <li key={item}><Check size={16} /> <span>{item}</span></li>)}</ul>
      <a href={p.href} className={`btn ${p.featured ? 'btn-primary' : 'btn-ghost'}`} data-testid={`button-plan-${p.name}`}>{p.cta} <ArrowRight size={16} /></a>
    </div>)}
  </div>;
}

function LeadForm({ product = 'Поддержка', onDone }: { product?: string; onDone?: () => void }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus('error'); setMessage('Введите корректный email.'); return; }
    setStatus('loading'); setMessage('');
    try {
      const response = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'waitlist', email, product }) });
      if (!response.ok) throw new Error('network');
      setStatus('success'); setMessage('Готово. Сообщим, когда появится ранний доступ.'); onDone?.();
    } catch { setStatus('error'); setMessage('Не удалось отправить заявку. Попробуйте ещё раз или напишите нам напрямую.'); }
  };
  if (status === 'success') return <p className="form-message" role="status" data-testid={`status-success-${product}`}>{message}</p>;
  return <form className="wait-form" onSubmit={submit} noValidate>
    <label className="form-label" style={{ flex: 1 }}><span className="sr-only">Email</span><input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ваш email" required aria-invalid={status === 'error'} data-testid={`input-email-${product}`} /></label>
    <button className="btn btn-primary btn-small" type="submit" disabled={status === 'loading'} data-testid={`button-waitlist-${product}`}>{status === 'loading' ? 'Отправка…' : 'В лист ожидания'} <ArrowRight size={14} /></button>
    {message && <p className="form-message error" role="alert" data-testid={`status-error-${product}`}>{message}</p>}
  </form>;
}

function SupportForm() {
  const [values, setValues] = useState({ name: '', email: '', role: '', subject: '', message: '', honey: '' });
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const update = (key: keyof typeof values, value: string) => setValues((old) => ({ ...old, [key]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (values.honey) return;
    if (!values.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || !values.role || !values.subject.trim() || values.message.trim().length < 10) { setStatus('error'); setError('Заполните все поля. Сообщение должно содержать не менее 10 символов.'); return; }
    if (!consent) { setStatus('error'); setError('Отметьте согласие на обработку персональных данных.'); return; }
    setStatus('loading'); setError('');
    try {
      const response = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'support', name: values.name.trim(), email: values.email.trim(), role: values.role, topic: values.subject.trim(), message: values.message.trim() }) });
      if (!response.ok) throw new Error('network');
      setStatus('success');
    } catch { setStatus('error'); setError('Не удалось отправить сообщение. Проверьте соединение и попробуйте снова.'); }
  };
  if (status === 'success') return <div className="review-card" role="status"><Check size={26} style={{ color: 'hsl(var(--primary))' }} /><h3 style={{ font: '600 24px var(--app-font-display)', margin: '14px 0 8px' }}>Сообщение отправлено.</h3><p className="section-copy">Мы рядом — отвечаем в течение 24 часов.</p></div>;
  return <form className="support-form" onSubmit={submit} noValidate>
    <input tabIndex={-1} aria-hidden="true" className="field" style={{ display: 'none' }} value={values.honey} onChange={(e) => update('honey', e.target.value)} />
    <div className="form-grid"><label className="form-label"><span>Имя</span><input className="field" value={values.name} onChange={(e) => update('name', e.target.value)} required data-testid="input-support-name" /></label><label className="form-label"><span>Email</span><input className="field" type="email" value={values.email} onChange={(e) => update('email', e.target.value)} required data-testid="input-support-email" /></label></div>
    <div className="form-grid"><label className="form-label"><span>Роль</span><select className="field" value={values.role} onChange={(e) => update('role', e.target.value)} required data-testid="select-support-role"><option value="">Выберите роль</option><option value="тренер">Тренер</option><option value="атлет">Атлет</option></select></label><label className="form-label"><span>Тема</span><input className="field" value={values.subject} onChange={(e) => update('subject', e.target.value)} required data-testid="input-support-subject" /></label></div>
    <label className="form-label"><span>Сообщение</span><textarea className="field" value={values.message} onChange={(e) => update('message', e.target.value)} required data-testid="textarea-support-message" /></label>
    <label className="consent-label"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} data-testid="checkbox-support-consent" /> <span>Я соглашаюсь на обработку моих персональных данных в соответствии с <Link href="/legal">Политикой конфиденциальности</Link>.</span></label>
    {error && <p className="form-message error" role="alert" data-testid="status-support-error">{error}</p>}
    <button className="btn btn-primary" disabled={status === 'loading'} type="submit" data-testid="button-support-submit">{status === 'loading' ? 'Отправка…' : 'Отправить сообщение'} <Send size={15} /></button>
  </form>;
}

const faqs = [
  ['Сколько стоит?', 'На старте NAORE можно начать бесплатно. Условия для отдельных функций и ролей будут обозначены до подключения.'],
  ['Чем отличается от заметок и мессенджеров?', 'NAORE соединяет конструктор тренировок, кабинет клиента, аналитику, комментарии к упражнениям, календарь и платежи в одной системе — вместо разрозненных переписок.'],
  ['Нужен ли тренер атлету?', 'Нет. Атлет может тренироваться самостоятельно, а персональная программа от тренера доступна, если нужна внешняя экспертиза и поддержка.'],
  ['Мои данные в безопасности?', 'Да. Приватность и безопасность данных — один из принципов NAORE. Доступ к данным ограничен правилами RLS.'],
  ['Работает без интернета?', 'Да, приложение поддерживает офлайн-доступ в формате PWA.'],
  ['Когда выйдут AI-Trainer, Connect, Shop и Tematika?', 'Это активная дорожная карта NAORE. Оставьте email в листе ожидания — сообщим, когда каждый продукт будет готов к раннему доступу.'],
];

function FAQ() {
  const [active, setActive] = useState<number | null>(null);
  return <div className="faq-wrap">{faqs.map(([question, answer], index) => <div className="faq-item" key={question}><button className="faq-question" onClick={() => setActive(active === index ? null : index)} aria-expanded={active === index} aria-controls={`faq-answer-${index}`} data-testid={`button-faq-${index}`}><span>{question}</span><ChevronDown size={19} /></button>{active === index && <div className="faq-answer" id={`faq-answer-${index}`} data-testid={`text-faq-answer-${index}`}>{answer}</div>}</div>)}</div>;
}

function CookieBanner() {
  const [visible, setVisible] = useState(() => localStorage.getItem('naore-cookie-choice') === null);
  const choose = (choice: string) => { localStorage.setItem('naore-cookie-choice', choice); setVisible(false); };
  if (!visible) return null;
  return <aside className="cookie" role="dialog" aria-label="Настройки файлов cookie"><p>Мы используем только необходимые файлы cookie для работы сайта. Ненужные cookie не включаются без вашего согласия.</p><div className="cookie-actions"><button className="btn btn-primary btn-small" onClick={() => choose('necessary')} data-testid="button-cookie-decline">Оставить только необходимые</button><button className="btn btn-ghost btn-small" onClick={() => choose('all')} data-testid="button-cookie-accept">Разрешить все</button></div></aside>;
}

function Footer() {
  return <footer className="footer"><div className="container-wide footer-grid"><div><Link href="/" className="brand"><span className="brand-mark"><span>N</span></span> NAORE</Link><p className="footer-note">Платформа, где тренер и атлет работают на результат в одном месте.</p></div><div><h3>Возможности</h3><Link href="/constructor">Конструктор тренировок</Link><Link href="/clients">Ведение клиентов</Link><Link href="/crm">CRM для тренера</Link><Link href="/analytics">Аналитика прогресса</Link><Link href="/progress">Отслеживание прогресса</Link><Link href="/communication">Коммуникация</Link><Link href="/personal-trainer">Персональный тренер</Link><Link href="/online-trainer">Онлайн-тренер</Link><Link href="/workout-diary">Дневник тренировок</Link><Link href="/automation">Автоматизация</Link><Link href="/client">Для клиента</Link><Link href="/online-training">Онлайн-тренировки</Link></div><div><h3>Продукты</h3><a href="#roadmap">AI-Trainer <span className="badge">Скоро</span></a><a href="#roadmap">NAORE Connect <span className="badge">Скоро</span></a><a href="#roadmap">NAORE Shop <span className="badge">Скоро</span></a><a href="#roadmap">NAORE Tematika <span className="badge">Скоро</span></a></div><div><h3>Контакты</h3><Link href="/support">Поддержка</Link><a href="mailto:support@naore.ru">support@naore.ru</a><a href="https://t.me/" target="_blank" rel="noreferrer">Telegram-чат</a><Link href="/legal">Правовая информация</Link></div></div><div className="container-wide footer-bottom"><span>© 2026 NAORE Fitness</span><span>Результат начинается с порядка.</span></div></footer>;
}

function SupportSection() {
  return <section className="section" id="support"><div className="container-wide support-card"><div><span className="eyebrow">Служба поддержки</span><h2 className="support-title">Мы рядом на каждом шаге</h2><p className="section-copy">Отвечаем в течение 24 часов. Поможем тренерам с переносом клиентов.</p><div className="contact-lines"><a className="contact-line" href="mailto:support@naore.ru"><Headphones size={16} /> support@naore.ru</a><a className="contact-line" href="https://t.me/" target="_blank" rel="noreferrer"><MessageCircle size={16} /> Telegram-чат</a><Link className="contact-line" href="/support"><Database size={16} /> FAQ и база знаний <ArrowRight size={14} /></Link></div></div><SupportForm /></div></section>;
}

function Home() {
  usePageMeta('Платформа для фитнес-тренеров — тренировки, клиенты и аналитика', 'Создавайте тренировки, ведите клиентов, отслеживайте прогресс и общайтесь в одном сервисе. Без хаоса в мессенджерах.');
  return <div className="site-shell noise"><a href="#main" className="skip-link">Перейти к содержанию</a><Header /><main id="main">
    <section className="hero grid-lines"><div className="container-wide hero-grid">
      <div>
        <div className="hero-badge"><b>NEW</b> Платформа для фитнес-тренеров</div>
        <h1>Всё для работы тренера<br />с клиентами — <em>в одном месте.</em></h1>
        <p className="hero-sub">Создавайте тренировки, ведите клиентов, отслеживайте прогресс и общайтесь — в одном сервисе. Без хаоса в мессенджерах.</p>
        <div className="actions" id="start"><a href={REGISTER_TRAINER} className="btn btn-primary" data-testid="button-start-free">Попробовать бесплатно <ArrowRight size={16} /></a><a href={REGISTER_CLIENT} className="btn btn-ghost" data-testid="button-trainer-cabinet">Я атлет — тренироваться</a></div>
        <div className="trust-row"><span className="trust-item"><span className="trust-dot" /> Данные под защитой (RLS)</span><span className="trust-item"><span className="trust-dot" /> Работает офлайн (PWA)</span><span className="trust-item"><span className="trust-dot" /> Русскоязычная платформа</span></div>
      </div>
      <HeroVisual />
    </div></section>

    <Marquee />

    <section className="section statement"><div className="container-wide"><span className="eyebrow" style={{ justifyContent: 'center' }}>Один рабочий процесс</span><h2>Тренировки, клиенты и прогресс — <em>в одном рабочем пространстве.</em></h2></div></section>

    <section className="section tight" id="goals"><div className="container-wide"><div className="section-head"><span className="eyebrow">Определите свою цель</span><h2 className="section-title">Одна платформа — под любую задачу</h2></div><GoalTabs /></div></section>

    <section className="section band" id="features"><div className="container-wide"><div className="section-head"><span className="eyebrow">Возможности</span><h2 className="section-title">Всё для системной тренировки</h2><p className="section-copy">Конструктор, аналитика, чат и календарь — в одном кабинете, а не в десяти приложениях.</p></div>
      <div className="feature-grid">{features.map((f) => { const Icon = f.icon; return <div className="feature-card" key={f.title}><f.Mock ratio="wide" /><div className="fc-body"><span className="value-check" style={{ marginBottom: 14 }}><Icon size={14} /></span><h3>{f.title}</h3><p>{f.copy}</p></div></div>; })}</div>
    </div></section>

    <section className="section" id="for-athletes"><div className="container-wide">
      <ValueBlock role="Для атлетов" title="Понятный план, видимый прогресс, поддержка тренера" values={athleteValues} action="Начать тренироваться" href={REGISTER_CLIENT} media={<MockAthlete />} />
    </div></section>
    <section className="section band" id="for-trainers"><div className="container-wide">
      <ValueBlock role="Для тренеров" title="Ведите клиентов профессионально и масштабируйтесь" values={trainerValues} action="Стать тренером на NAORE" href={REGISTER_TRAINER} media={<MockTrainer />} reverse />
    </div></section>

    <section className="section" id="reviews"><div className="container-wide"><div className="section-head"><span className="eyebrow">Отзывы</span><h2 className="section-title">Что говорят пользователи</h2></div><Reviews /></div></section>

    <section className="section band" id="pricing"><div className="container-wide"><div className="section-head"><span className="eyebrow">Тарифы</span><h2 className="section-title">Начните бесплатно</h2><p className="section-copy">Старт — бесплатно. Расширенные тарифы для атлетов и тренеров — на подходе.</p></div><Pricing /></div></section>

    <section className="section" id="roadmap"><div className="container-wide"><div className="roadmap-head"><span className="eyebrow" style={{ justifyContent: 'center' }}>Дорожная карта</span><h2 className="section-title" style={{ marginInline: 'auto' }}>NAORE растёт — скоро в экосистеме</h2><p className="section-copy">Оставьте почту — узнаете первыми и получите ранний доступ.</p></div>
      <div className="roadmap-grid">
        <div className="roadmap-card"><span className="badge">Скоро</span><h3>AI-Trainer</h3><p>ИИ-тренер на базе особенностей вашего организма и целей подбирает эффективные упражнения под ваши тренировки.</p><LeadForm product="AI-Trainer" /></div>
        <div className="roadmap-card"><span className="badge">Скоро</span><h3>NAORE Connect</h3><p>Отслеживайте показатели со спортивных аксессуаров — пульсометры, GPS-мониторинг атлета и другие датчики.</p><LeadForm product="NAORE Connect" /></div>
        <div className="roadmap-card"><span className="badge">Скоро</span><h3>NAORE Shop</h3><p>Спортивное питание от партнёров, прошедшее лабораторную проверку под нашим контролем.</p><LeadForm product="NAORE Shop" /></div>
        <div className="roadmap-card"><span className="badge">Скоро</span><h3>NAORE Tematika</h3><p>Пишите о своём деле, создавайте личный бренд и находите единомышленников — главная платформа для экспертов.</p><LeadForm product="NAORE Tematika" /></div>
      </div>
    </div></section>

    <section className="section band" id="faq"><div className="container-wide"><div className="section-head"><span className="eyebrow">FAQ</span><h2 className="section-title">Коротко о главном</h2></div><FAQ /></div></section>

    <SupportSection />

    <section className="section" id="final-cta"><div className="container-wide"><div className="cta-card"><span className="eyebrow" style={{ justifyContent: 'center' }}>Следующий подход</span><h2>Готовы тренироваться и вести клиентов по-новому?</h2><div className="cta-actions"><a href={REGISTER_CLIENT} className="btn btn-primary" data-testid="button-final-start">Начать бесплатно <ArrowRight size={16} /></a><a href={REGISTER_TRAINER} className="btn btn-ghost" data-testid="button-final-trainer">Стать тренером</a></div></div></div></section>
  </main><Footer /><CookieBanner /></div>;
}

function SupportPage() {
  usePageMeta('Поддержка NAORE Fitness — помощь тренерам и атлетам', 'Поддержка NAORE Fitness, FAQ и форма обратной связи для тренеров и атлетов.');
  return <div className="site-shell noise"><Header /><main><div className="container-wide page-intro"><span className="eyebrow" style={{ justifyContent: 'center' }}>NAORE / Поддержка</span><h1>Разберёмся. <span>Без лишних слов.</span></h1><p className="section-copy">Мы рядом на каждом шаге. Отвечаем в течение 24 часов.</p></div><section className="section tight"><div className="container-wide support-card"><div><span className="eyebrow">Форма обратной связи</span><h2 className="support-title">Есть вопрос? Напишите нам.</h2><p className="section-copy">Выберите роль, опишите тему и мы вернёмся с ответом.</p><div className="contact-lines"><a className="contact-line" href="mailto:support@naore.ru"><Headphones size={16} /> support@naore.ru</a><a className="contact-line" href="https://t.me/" target="_blank" rel="noreferrer"><MessageCircle size={16} /> Telegram-чат</a><span className="contact-line"><Clock3 size={16} /> Отвечаем в течение 24 часов</span></div></div><SupportForm /></div></section><section className="section band"><div className="container-wide"><div className="section-head"><span className="eyebrow">FAQ / база знаний</span><h2 className="section-title">Ответы на частые вопросы</h2></div><FAQ /></div></section></main><Footer /><CookieBanner /></div>;
}

function LegalPage() {
  usePageMeta('Политика конфиденциальности NAORE Fitness', 'Политика обработки персональных данных (152-ФЗ), файлы cookie, согласие и реквизиты оператора NAORE Fitness.');
  const accent = { color: 'hsl(var(--primary))' };
  return <div className="site-shell noise"><Header /><main className="container-wide legal">
    <span className="eyebrow">NAORE / Правовая информация</span>
    <h1>Прозрачно о <span>ваших данных.</span></h1>
    <p className="section-copy">Политика в отношении обработки персональных данных (далее — «Политика») определяет порядок обработки и защиты персональных данных пользователей сайта NAORE Fitness (далее — «Сайт») в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».</p>
    <p className="legal-note" data-testid="text-legal-requisites">⚠️ Реквизиты оператора нужно заполнить перед публикацией: Оператор — [ИП/ООО «___»], ИНН [___], ОГРН/ОГРНИП [___], адрес [___], email support@naore.ru. Дата вступления в силу: [дата].</p>
    <h2>1. Оператор персональных данных</h2>
    <p>Оператором персональных данных является [ИП/ООО «___»], ИНН [___], ОГРН/ОГРНИП [___], адрес: [___] (далее — «Оператор»). Контакт по вопросам обработки данных: <a href="mailto:support@naore.ru" style={accent}>support@naore.ru</a>.</p>
    <h2>2. Какие данные мы обрабатываем</h2>
    <p>Оператор обрабатывает только те данные, которые вы добровольно передаёте через формы Сайта:</p>
    <ul><li>имя;</li><li>адрес электронной почты (email);</li><li>роль (тренер или атлет);</li><li>тема и текст обращения;</li><li>интересующий продукт (при подписке на лист ожидания).</li></ul>
    <p>Специальные и биометрические категории персональных данных не собираются. Сайт не предназначен для лиц младше 18 лет без согласия законных представителей.</p>
    <h2>3. Цели обработки</h2>
    <ul><li>ответ на обращение и связь с вами по теме NAORE Fitness;</li><li>информирование о запуске продуктов и раннем доступе (при подписке на лист ожидания);</li><li>улучшение работы Сайта и качества поддержки.</li></ul>
    <h2>4. Правовые основания и согласие</h2>
    <p>Правовым основанием обработки является ваше согласие, выражаемое путём отметки соответствующего чекбокса и/или отправки формы, а также законные интересы Оператора по обработке обращений. Отправляя форму, вы подтверждаете согласие на обработку указанных персональных данных в перечисленных выше целях.</p>
    <p>Вы вправе отозвать согласие в любой момент, направив запрос на <a href="mailto:support@naore.ru" style={accent}>support@naore.ru</a>. После отзыва Оператор прекращает обработку и удаляет данные, если нет иных законных оснований для их хранения.</p>
    <h2>5. Хранение, передача и защита</h2>
    <p>Обращения с Сайта доставляются Оператору через мессенджер Telegram и хранятся не дольше, чем это необходимо для целей обработки, после чего удаляются. Оператор не продаёт персональные данные и не передаёт их третьим лицам, за исключением случаев, предусмотренных законодательством РФ. Для доставки сообщений используется сервис Telegram (Telegram FZ-LLC).</p>
    <p>Оператор принимает технические и организационные меры для защиты данных от неправомерного доступа, изменения, раскрытия или уничтожения. Доступ к данным платформы ограничивается правилами разграничения доступа (RLS).</p>
    <h2>6. Права субъекта персональных данных</h2>
    <p>В соответствии со ст. 14 152-ФЗ вы имеете право: получать сведения об обработке ваших данных; требовать их уточнения, блокирования или уничтожения в случае неполноты, неточности или неправомерной обработки; отозвать согласие; обжаловать действия Оператора в Роскомнадзоре или в суде. Для реализации прав направьте запрос на <a href="mailto:support@naore.ru" style={accent}>support@naore.ru</a>.</p>
    <h2>7. Файлы cookie</h2>
    <p>Сайт использует только необходимые файлы cookie, обеспечивающие его работу (например, сохранение вашего выбора в баннере cookie). Аналитические и рекламные cookie не включаются без вашего согласия. Управлять выбором можно в баннере при первом посещении; настройки браузера также позволяют ограничить использование cookie.</p>
    <h2>8. Изменения Политики</h2>
    <p>Оператор вправе изменять настоящую Политику. Актуальная редакция всегда доступна на этой странице. Существенные изменения вступают в силу с момента публикации.</p>
    <h2>9. Условия использования</h2>
    <p>Материалы Сайта предоставляются для ознакомления с платформой NAORE Fitness. Функции и продукты дорожной карты могут появляться поэтапно; перед подключением отдельных функций условия будут обозначены отдельно.</p>
    <p>По вопросам обработки данных напишите на <a href="mailto:support@naore.ru" style={accent}>support@naore.ru</a>.</p>
  </main><Footer /><CookieBanner /></div>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={Home} /><Route path="/support" component={SupportPage} /><Route path="/legal" component={LegalPage} /><Route path="/constructor"><ProductLanding page={productPages.constr} /></Route><Route path="/clients"><ProductLanding page={productPages.clients} /></Route><Route path="/crm"><ProductLanding page={productPages.crm} /></Route><Route path="/analytics"><ProductLanding page={productPages.analytics} /></Route><Route path="/progress"><ProductLanding page={productPages.progress} /></Route><Route path="/communication"><ProductLanding page={productPages.communication} /></Route><Route path="/personal-trainer"><ProductLanding page={productPages.personalTrainer} /></Route><Route path="/online-trainer"><ProductLanding page={productPages.onlineTrainer} /></Route><Route path="/workout-diary"><ProductLanding page={productPages.workoutDiary} /></Route><Route path="/automation"><ProductLanding page={productPages.automation} /></Route><Route path="/client"><ProductLanding page={productPages.client} /></Route><Route path="/online-training"><ProductLanding page={productPages.onlineTraining} /></Route><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;

// ===== SEO-посадочные (P1) по брифам SEO Master =====
const productPages: Record<string, {
  eyebrow: string; title: string; description: string; h1: string; intro: string;
  ctaLabel: string; ctaHref: string; mock: ReactNode; sections: [string, string][]; related: [string, string][];
}> = {
  constr: {
    eyebrow: 'Конструктор тренировок',
    title: 'Конструктор тренировок онлайн для фитнес-тренеров',
    description: 'Создавайте персональные тренировки и программы для клиентов онлайн. Конструктор тренировок для фитнес-тренеров.',
    h1: 'Конструктор тренировок для тренера',
    intro: 'Собирайте персональные тренировки и программы для клиентов онлайн — без таблиц, заметок и пересланных файлов.',
    ctaLabel: 'Создать первую тренировку', ctaHref: REGISTER_TRAINER, mock: <MockConstructor ratio="wide" />,
    sections: [
      ['Создайте тренировку за несколько минут', 'Добавляйте упражнения, задавайте подходы, повторы, вес и отдых. Готовая тренировка собирается за пару минут.'],
      ['Программа под каждого клиента', 'Стройте персональные программы под цель и уровень. У каждого клиента — свой план, а не общий шаблон.'],
      ['Библиотека упражнений', 'Выбирайте упражнения из библиотеки с параметрами. Единая база ускоряет сборку и держит формулировки одинаковыми.'],
      ['Повторное использование программ', 'Сохраняйте программы как шаблоны и переиспользуйте для новых клиентов. Меньше рутины — больше работы с людьми.'],
      ['Изменение программы без хаоса', 'Корректируйте план на ходу: клиент сразу видит актуальную версию, история изменений не теряется.'],
      ['Назначение тренировок клиентам', 'Назначайте тренировки конкретным клиентам и датам. Никаких потерянных сообщений и файлов.'],
      ['История тренировок и результатов', 'Каждая выполненная тренировка сохраняется в историю с результатами — основа для аналитики прогресса.'],
    ],
    related: [['Ведение клиентов', '/clients'], ['Аналитика прогресса', '/analytics'], ['Отслеживание прогресса', '/progress']],
  },
  clients: {
    eyebrow: 'Ведение клиентов',
    title: 'Ведение клиентов фитнес-тренера — программа для работы с клиентами',
    description: 'Ведите клиентов, тренировки, результаты и историю взаимодействия в одном месте.',
    h1: 'Ведение клиентов без Excel и десятков чатов',
    intro: 'Клиенты, тренировки, результаты и общение — в одном рабочем пространстве, а не в разрозненных таблицах и мессенджерах.',
    ctaLabel: 'Добавить первого клиента', ctaHref: REGISTER_TRAINER, mock: <MockTrainer />,
    sections: [
      ['Все клиенты в одной системе', 'Единый список клиентов вместо разрозненных таблиц и чатов. Всегда видно, кто на связи и что у него в работе.'],
      ['Карточка каждого клиента', 'Профиль, цели, программа, результаты и общение — в одной карточке. Контекст клиента открывается в один клик.'],
      ['Вся история работы', 'Тренировки, изменения и переписка сохраняются. Легко вспомнить, что было месяц назад, и не начинать с нуля.'],
      ['Тренировки рядом с данными клиента', 'Программа и прогресс лежат в той же карточке — не нужно сопоставлять файлы из разных мест.'],
      ['Прогресс клиента в одном месте', 'Динамика результатов доступна прямо в карточке — видно, работает ли план.'],
      ['Общение без потери контекста', 'Комментарии и сообщения привязаны к клиенту и упражнениям. Ничего не теряется в общем чате.'],
    ],
    related: [['Конструктор тренировок', '/constructor'], ['CRM для тренера', '/crm'], ['Аналитика прогресса', '/analytics'], ['Коммуникация', '/communication']],
  },
  crm: {
    eyebrow: 'CRM',
    title: 'CRM для фитнес-тренера — клиенты, тренировки и прогресс',
    description: 'CRM для фитнес-тренера: клиенты, программы тренировок, результаты и коммуникация в одном рабочем пространстве.',
    h1: 'CRM для фитнес-тренера',
    intro: 'Клиенты, программы, результаты и общение — связанными между собой, а не разбросанными по Excel и мессенджерам.',
    ctaLabel: 'Попробовать CRM', ctaHref: REGISTER_TRAINER, mock: <MockTrainer />,
    sections: [
      ['Что такое CRM для фитнес-тренера', 'Система, где хранятся клиенты, программы, результаты и общение. Один рабочий центр вместо десятка инструментов.'],
      ['Клиенты', 'База клиентов с профилями, целями и статусами. Видно, кто активен и кому нужна корректировка.'],
      ['Тренировки и программы', 'Программы и назначенные тренировки закреплены за клиентом. История не теряется при изменениях.'],
      ['Результаты', 'Результаты тренировок собираются автоматически и превращаются в аналитику прогресса.'],
      ['Коммуникация', 'Общение с клиентом рядом с его данными — без переключений между приложениями.'],
      ['Почему CRM лучше Excel и мессенджеров', 'Данные связаны и не дублируются, историю легко искать, ничего не теряется в переписке.'],
    ],
    related: [['Ведение клиентов', '/clients'], ['Конструктор тренировок', '/constructor'], ['Автоматизация', '/automation'], ['Аналитика прогресса', '/analytics']],
  },
  analytics: {
    eyebrow: 'Аналитика',
    title: 'Аналитика прогресса клиентов для фитнес-тренера',
    description: 'Отслеживайте результаты клиентов, историю тренировок и динамику прогресса в одном сервисе.',
    h1: 'Видите прогресс клиента, а не просто список тренировок',
    intro: 'Динамика результатов, выполнение программы и рост по упражнениям — в понятных графиках, а не в ощущениях.',
    ctaLabel: 'Посмотреть аналитику', ctaHref: REGISTER_TRAINER, mock: <MockAnalytics ratio="wide" />,
    sections: [
      ['Динамика результатов', 'Смотрите, как меняются показатели клиента по неделям. Тренды заметны раньше, чем по ощущениям.'],
      ['История тренировок', 'Полный архив выполненных тренировок с результатами — основа для выводов и корректировок.'],
      ['Анализ выполнения программы', 'Видно, какие тренировки выполнены, а какие пропущены. Дисциплина клиента — в цифрах.'],
      ['Прогресс по упражнениям', 'Отслеживайте рост по конкретным упражнениям: вес, объём, повторы.'],
      ['Сравнение результатов за период', 'Сравнивайте показатели за недели и месяцы, чтобы оценить эффективность плана.'],
      ['Как аналитика помогает корректировать процесс', 'Опирайтесь на данные, а не на догадки: меняйте нагрузку там, где это действительно нужно.'],
    ],
    related: [['Отслеживание прогресса', '/progress'], ['Конструктор тренировок', '/constructor'], ['Ведение клиентов', '/clients']],
  },
  progress: {
    eyebrow: 'Прогресс',
    title: 'Отслеживание прогресса тренировок онлайн',
    description: 'Следите за результатами тренировок, выполнением программы и динамикой показателей вместе с тренером.',
    h1: 'Отслеживайте прогресс каждой тренировки',
    intro: 'История тренировок, динамика результатов и выполнение программы — под рукой, даже офлайн (PWA).',
    ctaLabel: 'Отслеживать прогресс', ctaHref: REGISTER_CLIENT, mock: <MockHistory ratio="wide" />,
    sections: [
      ['История тренировок', 'Каждая тренировка сохраняется в историю. Всегда видно, что и когда вы делали.'],
      ['Динамика результатов', 'Показатели растут на графиках, а не остаются в ощущениях.'],
      ['Выполнение программы', 'Отмечайте выполнение и видите, насколько держитесь плана.'],
      ['Прогресс по упражнениям', 'Следите за ростом по каждому упражнению: вес, повторы, объём.'],
      ['Результаты за период', 'Смотрите итоги за неделю и месяц — понятно, движетесь ли вперёд.'],
      ['Прогресс вместе с тренером', 'Тренер видит те же данные и вовремя корректирует план.'],
    ],
    related: [['Аналитика прогресса', '/analytics'], ['Конструктор тренировок', '/constructor'], ['Коммуникация с тренером', '/communication']],
  },
  communication: {
    eyebrow: 'Коммуникация',
    title: 'Приложение для общения тренера и клиента',
    description: 'Общайтесь с клиентами там же, где находятся тренировки, результаты и прогресс. Без хаоса в мессенджерах.',
    h1: 'Общение с клиентом — там же, где его тренировки',
    intro: 'Комментарии к упражнениям, вопросы и обратная связь — рядом с тренировками и прогрессом, а не в общем чате.',
    ctaLabel: 'Посмотреть, как это работает', ctaHref: REGISTER_TRAINER, mock: <MockChat ratio="wide" />,
    sections: [
      ['Почему мессенджеры становятся проблемой', 'В WhatsApp и Telegram планы, правки и вопросы тонут вперемешку с личным. Историю сложно искать.'],
      ['Единое пространство тренера и клиента', 'Общение живёт рядом с тренировками и результатами. Весь контекст клиента — в одном месте.'],
      ['Общение + тренировки + прогресс', 'Комментируйте упражнения, отвечайте на вопросы и видите прогресс — не переключаясь между приложениями.'],
    ],
    related: [['Ведение клиентов', '/clients'], ['Конструктор тренировок', '/constructor'], ['CRM для тренера', '/crm']],
  },
  personalTrainer: {
    eyebrow: 'Персональный тренер',
    title: 'Программа для персонального тренера — клиенты и тренировки',
    description: 'Управляйте клиентами, создавайте персональные программы и контролируйте прогресс в одном сервисе.',
    h1: 'Рабочее пространство персонального тренера',
    intro: 'Клиенты, персональные программы, прогресс и общение — в одном сервисе, без Excel и десятков чатов.',
    ctaLabel: 'Начать работу', ctaHref: REGISTER_TRAINER, mock: <MockTrainer />,
    sections: [
      ['Ведите всех клиентов в одном месте', 'Единая база клиентов вместо таблиц и чатов: статусы, цели и история — под рукой.'],
      ['Создавайте персональные программы', 'Собирайте план под каждого клиента в конструкторе — за минуты, а не за вечер.'],
      ['Контролируйте выполнение', 'Видно, какие тренировки выполнены, а какие пропущены. Дисциплина — в цифрах.'],
      ['Отслеживайте прогресс', 'Динамика результатов по неделям помогает вовремя корректировать нагрузку.'],
      ['Общайтесь с клиентами', 'Комментарии и сообщения рядом с тренировками — без потери контекста.'],
      ['Работайте без Excel и десятков чатов', 'Один рабочий центр вместо разрозненных инструментов.'],
    ],
    related: [['Ведение клиентов', '/clients'], ['Конструктор тренировок', '/constructor'], ['Аналитика прогресса', '/analytics']],
  },
  onlineTrainer: {
    eyebrow: 'Онлайн-тренер',
    title: 'Программа для онлайн-тренера — ведение клиентов дистанционно',
    description: 'Ведите онлайн-клиентов, назначайте тренировки, отслеживайте прогресс и общайтесь в одном сервисе.',
    h1: 'Всё для работы онлайн-тренера',
    intro: 'Ведите клиентов дистанционно: программы, назначения, прогресс и общение — в одном рабочем пространстве.',
    ctaLabel: 'Начать работу', ctaHref: REGISTER_TRAINER, mock: <MockTrainer />,
    sections: [
      ['Ведение клиентов онлайн', 'Работайте с клиентами дистанционно: вся информация о каждом — в одной карточке.'],
      ['Тренировочные программы', 'Собирайте и переиспользуйте программы под цель клиента.'],
      ['Назначение тренировок', 'Назначайте тренировки на даты — клиент видит актуальный план, файлы не теряются.'],
      ['Контроль выполнения', 'Отмечайте и отслеживайте выполнение без напоминаний в мессенджерах.'],
      ['Аналитика прогресса', 'Динамика результатов помогает вести клиента к цели по данным.'],
      ['Как масштабировать онлайн-практику', 'Меньше рутины на клиента — больше клиентов без потери качества.'],
    ],
    related: [['Ведение клиентов', '/clients'], ['Коммуникация', '/communication'], ['Автоматизация', '/automation']],
  },
  workoutDiary: {
    eyebrow: 'Дневник тренировок',
    title: 'Дневник тренировок онлайн — история и прогресс',
    description: 'Ведите историю тренировок, сохраняйте результаты и отслеживайте прогресс вместе с тренером.',
    h1: 'Дневник тренировок с историей прогресса',
    intro: 'Записывайте тренировки, храните результаты и следите за прогрессом — под рукой, даже офлайн (PWA).',
    ctaLabel: 'Начать вести дневник', ctaHref: REGISTER_CLIENT, mock: <MockHistory ratio="wide" />,
    sections: [
      ['Записывайте каждую тренировку', 'Фиксируйте упражнения, подходы и веса. Ничего не забывается.'],
      ['Сохраняйте результаты', 'Результаты остаются в истории и превращаются в динамику.'],
      ['Отслеживайте изменения', 'Видите рост показателей на графиках, а не в ощущениях.'],
      ['Смотрите историю тренировок', 'Полный архив под рукой, даже без интернета (PWA).'],
      ['Делитесь результатами с тренером', 'Тренер видит те же данные и корректирует план.'],
      ['Как дневник связан с аналитикой', 'Записи автоматически складываются в аналитику прогресса.'],
    ],
    related: [['Отслеживание прогресса', '/progress'], ['Аналитика прогресса', '/analytics'], ['Конструктор тренировок', '/constructor']],
  },
  automation: {
    eyebrow: 'Автоматизация',
    title: 'Автоматизация работы фитнес-тренера',
    description: 'Автоматизируйте ведение клиентов, программы тренировок, прогресс и коммуникацию. Освободите время для работы с клиентами.',
    h1: 'Автоматизируйте рутину — занимайтесь клиентами',
    intro: 'Меньше ручного переноса данных между Excel и мессенджерами — больше времени на реальную работу с клиентами.',
    ctaLabel: 'Автоматизировать работу', ctaHref: REGISTER_TRAINER, mock: <MockTrainer />,
    sections: [
      ['Что можно автоматизировать', 'Рутину вокруг клиентов, программ, прогресса и общения — в одном сервисе.'],
      ['Клиенты', 'База клиентов и статусы обновляются по мере работы.'],
      ['Тренировки', 'Переиспользуйте программы-шаблоны вместо сборки с нуля.'],
      ['Прогресс', 'Результаты собираются автоматически и превращаются в аналитику.'],
      ['Коммуникация', 'Контекст клиента под рукой — меньше повторяющихся вопросов.'],
      ['Сколько времени получает тренер', 'Освободите часы в неделю на реальную работу с клиентами.'],
    ],
    related: [['CRM для тренера', '/crm'], ['Ведение клиентов', '/clients'], ['Конструктор тренировок', '/constructor']],
  },
  client: {
    eyebrow: 'Для клиента',
    title: 'Приложение для клиентов фитнес-тренера',
    description: 'Получайте тренировки, отмечайте выполнение, отслеживайте прогресс и общайтесь с тренером в одном приложении.',
    h1: 'Ваша тренировка, прогресс и тренер — в одном месте',
    intro: 'Получайте программу от тренера, отмечайте выполнение, следите за прогрессом и общайтесь — в одном приложении.',
    ctaLabel: 'Открыть приложение', ctaHref: REGISTER_CLIENT, mock: <MockAthlete />,
    sections: [
      ['Получайте программу тренировок', 'Тренер назначает план — он всегда актуален и под рукой.'],
      ['Отмечайте выполнение', 'Отмечайте выполненные тренировки в пару касаний.'],
      ['Смотрите свой прогресс', 'Динамика результатов — на понятных графиках.'],
      ['Общайтесь с тренером', 'Вопросы и обратная связь рядом с упражнениями.'],
      ['Храните историю тренировок', 'Весь архив сохраняется и работает офлайн (PWA).'],
    ],
    related: [['Отслеживание прогресса', '/progress'], ['Дневник тренировок', '/workout-diary'], ['Коммуникация', '/communication']],
  },
  onlineTraining: {
    eyebrow: 'Онлайн-тренировки',
    title: 'Платформа для онлайн-тренировок и работы тренера',
    description: 'Проводите онлайн-тренировки, ведите клиентов, назначайте программы и контролируйте прогресс в одном сервисе.',
    h1: 'Платформа для онлайн-тренировок',
    intro: 'Проводите онлайн-тренировки, ведите клиентов, назначайте программы и контролируйте прогресс — в одном сервисе.',
    ctaLabel: 'Начать работу', ctaHref: REGISTER_TRAINER, mock: <MockConstructor ratio="wide" />,
    sections: [
      ['Работа с клиентами онлайн', 'Ведите клиентов дистанционно: карточки, цели и история — в одном месте.'],
      ['Тренировочные программы', 'Собирайте программы под цель и переиспользуйте их.'],
      ['Контроль выполнения', 'Видно, кто выполняет план, а кому нужна корректировка.'],
      ['Аналитика прогресса', 'Динамика результатов ведёт клиента к цели по данным.'],
      ['Коммуникация', 'Общение рядом с тренировками — без хаоса в мессенджерах.'],
    ],
    related: [['Онлайн-тренер', '/online-trainer'], ['Конструктор тренировок', '/constructor'], ['Ведение клиентов', '/clients']],
  },

};

function ProductLanding({ page }: { page: (typeof productPages)[string] }) {
  usePageMeta(page.title, page.description);
  return <div className="site-shell noise"><a href="#main" className="skip-link">Перейти к содержанию</a><Header /><main id="main">
    <section className="section lp-top"><div className="container-wide lp-hero">
      <div>
        <span className="eyebrow">{page.eyebrow}</span>
        <h1>{page.h1}</h1>
        <p>{page.intro}</p>
        <a href={page.ctaHref} className="btn btn-primary" data-testid="lp-cta">{page.ctaLabel} <ArrowRight size={16} /></a>
      </div>
      <div>{page.mock}</div>
    </div></section>
    <section className="section band"><div className="container-wide">
      <div className="lp-sections">{page.sections.map(([h2, body]) => <div className="lp-card" key={h2}><span className="value-check" style={{ marginBottom: 12 }}><Check size={13} /></span><h3>{h2}</h3><p>{body}</p></div>)}</div>
    </div></section>
    <section className="section"><div className="container-wide">
      <div className="section-head"><span className="eyebrow">Смотрите также</span><h2 className="section-title">Соседние возможности</h2></div>
      <div className="lp-related">{page.related.map(([label, href]) => <Link key={href} href={href}>{label} <ArrowRight size={14} /></Link>)}</div>
    </div></section>
    <section className="section" id="final-cta"><div className="container-wide"><div className="cta-card"><span className="eyebrow" style={{ justifyContent: 'center' }}>NAORE</span><h2>{page.h1}</h2><div className="cta-actions"><a href={page.ctaHref} className="btn btn-primary">{page.ctaLabel} <ArrowRight size={16} /></a><a href="/" className="btn btn-ghost">На главную</a></div></div></div></section>
  </main><Footer /><CookieBanner /></div>;
}
