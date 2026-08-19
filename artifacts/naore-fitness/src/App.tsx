import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, BarChart3, Check, ChevronDown, CircleUserRound, Clock3, Database, Gauge, Headphones, Menu, MessageCircle, Radar, Send, ShieldCheck, X } from 'lucide-react';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

const SITE_ORIGIN = 'https://naore.ru';

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
    setMeta('keywords', 'платформа для тренеров, приложение для тренировок, конструктор тренировок, онлайн-коучинг, калькулятор КБЖУ, трекер тренировок');
    const url = SITE_ORIGIN + window.location.pathname.replace(/\/$/, '') + (window.location.pathname === '/' ? '' : '');
    const canonical = window.location.pathname === '/' ? SITE_ORIGIN + '/' : url;
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
  return <header className="container-wide topbar">
    <Link href="/" className="brand" data-testid="link-home"><span className="brand-mark"><span>N</span></span> NAORE <span style={{ color: 'hsl(var(--primary))' }}>FITNESS</span></Link>
    <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Открыть меню" aria-expanded={open} data-testid="button-mobile-menu">{open ? <X size={19} /> : <Menu size={19} />}</button>
    <nav className={`nav ${open ? 'open' : ''}`} aria-label="Основная навигация">
      <a href="#for-trainers" onClick={() => setOpen(false)} data-testid="link-trainers">Тренерам</a>
      <a href="#for-athletes" onClick={() => setOpen(false)} data-testid="link-athletes">Атлетам</a>
      <a href="#roadmap" onClick={() => setOpen(false)} data-testid="link-roadmap">Экосистема</a>
      <a href="#faq" onClick={() => setOpen(false)} data-testid="link-faq">FAQ</a>
      <Link href="/support" className="nav-cta" data-testid="link-support">Поддержка <ArrowRight size={14} /></Link>
    </nav>
  </header>;
}

function ProductPreview() {
  return <div className="product-visual" aria-label="Предпросмотр аналитики NAORE Fitness">
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

function SectionIntro({ eyebrow, title, copy, id }: { eyebrow: string; title: string; copy?: string; id?: string }) {
  return <div id={id}><span className="eyebrow">{eyebrow}</span><h2 className="section-title">{title}</h2>{copy && <p className="section-copy">{copy}</p>}</div>;
}

// Платформа NAORE — регистрация с предвыбором роли (client — атлет, trainer — тренер)
const REGISTER_URL = 'https://vibefitness-pearl.vercel.app/register';
const REGISTER_CLIENT = `${REGISTER_URL}?role=client`;
const REGISTER_TRAINER = `${REGISTER_URL}?role=trainer`;

const trainerValues = ['Конструктор тренировок', 'Единый кабинет клиентов', 'Аналитика прогресса клиентов', 'Живой чат тренер↔клиент (комментарии к упражнениям)', 'Календарь и платежи'];
const athleteValues = ['Персональная программа от тренера', 'Трекер тренировок и архив', 'Аналитика результатов по неделям', 'Калькулятор КБЖУ', 'Офлайн-доступ (PWA)'];

function ValuePanel({ role, title, values, action, href, reverse = false }: { role: string; title: string; values: string[]; action: string; href: string; reverse?: boolean }) {
  return <div className={`split-section ${reverse ? 'reverse' : ''}`}>
    <SectionIntro eyebrow={role} title={title} />
    <div className="role-panel"><span className="role-label">{role.toUpperCase()}</span><h3>Всё нужное для движения вперёд.</h3><div className="value-list">{values.map((value, index) => <div className="value-item" key={value}><Check size={16} /> <span data-testid={`text-value-${role}-${index}`}>{value}</span></div>)}</div><a href={href} className="btn btn-primary" data-testid={`button-${role}`}>{action} <ArrowRight size={15} /></a></div>
  </div>;
}

function LeadForm({ compact = false, product = 'Поддержка', onDone }: { compact?: boolean; product?: string; onDone?: () => void }) {
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
  return <form className={compact ? 'wait-form' : 'support-form'} onSubmit={submit} noValidate>
    <label className="form-label"><span className="sr-only">Email</span><input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ваш email" required aria-invalid={status === 'error'} data-testid={`input-email-${product}`} /></label>
    <button className="btn btn-primary btn-small" type="submit" disabled={status === 'loading'} data-testid={`button-waitlist-${product}`}>{status === 'loading' ? 'Отправка…' : 'В лист ожидания'} <ArrowRight size={14} /></button>
    <p className="consent-note">Нажимая кнопку, вы соглашаетесь на обработку email согласно <Link href="/legal">Политике конфиденциальности</Link>.</p>
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
  if (status === 'success') return <div className="role-panel" role="status"><Check size={26} className="usp-icon" /><h3>Сообщение отправлено.</h3><p className="section-copy">Мы рядом — отвечаем в течение 24 часов.</p></div>;
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
  return <footer className="footer"><div className="container-wide footer-grid"><div><Link href="/" className="brand"><span className="brand-mark"><span>N</span></span> NAORE <span style={{ color: 'hsl(var(--primary))' }}>FITNESS</span></Link><p className="footer-note">Платформа, где тренер и атлет работают на результат в одном месте.</p></div><div><h3>Навигация</h3><a href="#for-trainers">Тренерам</a><a href="#for-athletes">Атлетам</a><a href="#how">Как это работает</a><a href="#faq">FAQ</a></div><div><h3>Продукты</h3><a href="#roadmap">AI-Trainer <span className="badge">Скоро</span></a><a href="#roadmap">NAORE Connect <span className="badge">Скоро</span></a><a href="#roadmap">NAORE Shop <span className="badge">Скоро</span></a><a href="#roadmap">NAORE Tematika <span className="badge">Скоро</span></a></div><div><h3>Контакты</h3><Link href="/support">Поддержка</Link><a href="mailto:support@naore.ru">support@naore.ru</a><a href="https://t.me/" target="_blank" rel="noreferrer">Telegram-чат</a><Link href="/legal">Правовая информация</Link></div></div><div className="container-wide footer-bottom"><span>© 2026 NAORE Fitness</span><span>Результат начинается с порядка.</span></div></footer>;
}

function SupportSection() {
  return <section className="section" id="support"><div className="container-wide support-card"><div><span className="eyebrow">Служба поддержки</span><h2 className="support-title">Поддержка NAORE — мы рядом на каждом шаге</h2><p className="section-copy">Отвечаем в течение 24 часов. Поможем тренерам с переносом клиентов.</p><div className="contact-lines"><a className="contact-line" href="mailto:support@naore.ru"><Headphones size={16} /> support@naore.ru</a><a className="contact-line" href="https://t.me/" target="_blank" rel="noreferrer"><MessageCircle size={16} /> Telegram-чат</a><Link className="contact-line" href="/support"><Database size={16} /> FAQ и база знаний <ArrowRight size={14} /></Link></div></div><SupportForm /></div></section>;
}

function Home() {
  usePageMeta('NAORE Fitness — платформа для тренеров и атлетов', 'NAORE Fitness: конструктор тренировок, аналитика прогресса и живое общение тренер-клиент. Приложение для тренировок и онлайн-коучинга.');
  return <div className="site-shell noise"><a href="#main" className="skip-link">Перейти к содержанию</a><Header /><main id="main">
    <section className="hero grid-lines"><div className="container-wide hero-grid"><div><span className="eyebrow">ПЛАТФОРМА ДЛЯ РЕЗУЛЬТАТА</span><h1>Тренер и атлет.<br /><em>В одном месте.</em></h1><p className="hero-sub">Конструктор тренировок, аналитика прогресса и живое общение тренер↔клиент. Без хаоса в мессенджерах.</p><div className="actions" id="start"><a href={REGISTER_CLIENT} className="btn btn-primary" data-testid="button-start-free">Начать бесплатно <ArrowRight size={16} /></a><a href={REGISTER_TRAINER} className="btn btn-ghost" data-testid="button-trainer-cabinet">Я тренер — завести кабинет</a></div><div className="trust-row"><span className="trust-item"><span className="trust-dot" /> Данные под защитой (RLS)</span><span className="trust-item"><span className="trust-dot" /> Работает офлайн (PWA)</span><span className="trust-item"><span className="trust-dot" /> Русскоязычная платформа</span></div></div><ProductPreview /></div></section>
    <section className="section band"><div className="container-wide problem-grid"><SectionIntro eyebrow="Проблема → решение" title="Тренировки, планы и переписка больше не разбросаны по десяти приложениям" /><div className="problem-list"><div className="problem-card"><span className="number">01 / СТРУКТУРА</span><div><h3>Всё по плану</h3><p>Программа, упражнения и расписание собраны в одном кабинете.</p></div></div><div className="problem-card"><span className="number">02 / КОНТРОЛЬ</span><div><h3>Видимый прогресс</h3><p>Аналитика показывает динамику по неделям, а не оставляет ощущениям решать за вас.</p></div></div><div className="problem-card"><span className="number">03 / СВЯЗЬ</span><div><h3>Живая коммуникация</h3><p>Комментарии к упражнениям и общение тренера с клиентом — там, где проходит тренировка.</p></div></div></div></div></section>
    <section className="section" id="for-trainers"><div className="container-wide"><ValuePanel role="Для тренеров" title="Тренерам: ведите клиентов профессионально и масштабируйтесь" values={trainerValues} action="Стать тренером на NAORE" href={REGISTER_TRAINER} /></div></section>
    <section className="section band" id="for-athletes"><div className="container-wide"><ValuePanel role="Для атлетов" title="Атлетам: понятный план, видимый прогресс, поддержка тренера" values={athleteValues} action="Начать тренироваться" href={REGISTER_CLIENT} reverse /></div></section>
    <section className="section" id="how"><div className="container-wide"><SectionIntro eyebrow="Как это работает" title="Три шага до системной тренировки" /><div className="steps"><div className="step"><span className="step-number">01</span><h3>Зарегистрируйтесь</h3><p>Выберите роль тренера или атлета и создайте свой профиль.</p></div><div className="step"><span className="step-number">02</span><h3>Соберите план</h3><p>Тренер собирает план / атлет получает программу.</p></div><div className="step"><span className="step-number">03</span><h3>Двигайтесь вперёд</h3><p>Тренируетесь, отслеживаете прогресс, общаетесь — всё в NAORE.</p></div></div></div></section>
    <section className="section band"><div className="container-wide"><SectionIntro eyebrow="Почему NAORE" title="Система, которая держит фокус на результате" /><div className="usp-grid"><div className="usp"><CircleUserRound className="usp-icon" size={22} /><h3>Одна платформа для обеих сторон</h3><p>Тренер и атлет работают в одном пространстве.</p></div><div className="usp"><BarChart3 className="usp-icon" size={22} /><h3>Аналитика, а не ощущения</h3><p>Решения на основе аналитики прогресса.</p></div><div className="usp"><ShieldCheck className="usp-icon" size={22} /><h3>Приватность и безопасность</h3><p>Данные защищены правилами RLS.</p></div><div className="usp"><Gauge className="usp-icon" size={22} /><h3>Premium-опыт</h3><p>Быстрый, тёмный, PWA/офлайн.</p></div><div className="usp"><MessageCircle className="usp-icon" size={22} /><h3>Русскоязычная платформа</h3><p>Инструменты и поддержка на вашем языке.</p></div><div className="usp"><Radar className="usp-icon" size={22} /><h3>Активная дорожная карта</h3><p>Экосистема NAORE постоянно растёт.</p></div></div></div></section>
    <section className="section" id="roadmap"><div className="container-wide"><div className="roadmap-head"><SectionIntro eyebrow="Дорожная карта" title="NAORE растёт — скоро в экосистеме" /><p className="section-copy">Мы постоянно добавляем инструменты. Оставьте почту — узнаете первыми и получите ранний доступ.</p></div><div className="roadmap-grid"><div className="roadmap-card"><span className="badge">Скоро</span><h3>AI-Trainer</h3><p>ИИ-тренер на базе особенностей вашего организма и целей подбирает эффективные упражнения под ваши тренировки.</p><LeadForm compact product="AI-Trainer" /></div><div className="roadmap-card"><span className="badge">Скоро</span><h3>NAORE Connect</h3><p>Отслеживайте показатели со спортивных аксессуаров — пульсометры, GPS-мониторинг атлета и другие датчики.</p><LeadForm compact product="NAORE Connect" /></div><div className="roadmap-card"><span className="badge">Скоро</span><h3>NAORE Shop</h3><p>Спортивное питание от партнёров, прошедшее лабораторную проверку под нашим контролем.</p><LeadForm compact product="NAORE Shop" /></div><div className="roadmap-card"><span className="badge">Скоро</span><h3>NAORE Tematika</h3><p>Пишите о своём деле, создавайте личный бренд и находите единомышленников — главная платформа для экспертов.</p><LeadForm compact product="NAORE Tematika" /></div></div></div></section>
    <section className="section band" id="faq"><div className="container-wide"><SectionIntro eyebrow="FAQ" title="Коротко о главном" /><FAQ /></div></section><SupportSection />
    <section className="final-cta grid-lines" id="final-cta"><div className="container-wide"><span className="eyebrow">Следующий подход</span><h2>Готовы тренироваться и вести клиентов по-новому?</h2><div className="actions" style={{ justifyContent: 'center' }}><a href={REGISTER_CLIENT} className="btn btn-primary" data-testid="button-final-start">Начать бесплатно <ArrowRight size={16} /></a><a href={REGISTER_TRAINER} className="btn btn-ghost" data-testid="button-final-trainer">Стать тренером</a></div></div></section>
  </main><Footer /><CookieBanner /></div>;
}

function SupportPage() {
  usePageMeta('Поддержка NAORE Fitness — помощь тренерам и атлетам', 'Поддержка NAORE Fitness, FAQ и форма обратной связи для тренеров и атлетов.');
  return <div className="site-shell noise"><Header /><main><div className="container-wide page-intro"><span className="eyebrow">NAORE / ПОДДЕРЖКА</span><h1>Разберёмся.<br /><span style={{ color: 'hsl(var(--primary))' }}>Без лишних слов.</span></h1><p className="section-copy">Мы рядом на каждом шаге. Отвечаем в течение 24 часов.</p></div><section className="section"><div className="container-wide support-card"><div><span className="eyebrow">Форма обратной связи</span><h2 className="support-title">Есть вопрос?<br />Напишите нам.</h2><p className="section-copy">Выберите роль, опишите тему и мы вернёмся с ответом.</p><div className="contact-lines"><a className="contact-line" href="mailto:support@naore.ru"><Headphones size={16} /> support@naore.ru</a><a className="contact-line" href="https://t.me/" target="_blank" rel="noreferrer"><MessageCircle size={16} /> Telegram-чат</a><span className="contact-line"><Clock3 size={16} /> Отвечаем в течение 24 часов</span></div></div><SupportForm /></div></section><section className="section band"><div className="container-wide"><SectionIntro eyebrow="FAQ / база знаний" title="Ответы на частые вопросы" /><FAQ /></div></section></main><Footer /><CookieBanner /></div>;
}

function LegalPage() {
  usePageMeta('Политика конфиденциальности NAORE Fitness', 'Политика обработки персональных данных (152-ФЗ), файлы cookie, согласие и реквизиты оператора NAORE Fitness.');
  const accent = { color: 'hsl(var(--primary))' };
  return <div className="site-shell noise"><Header /><main className="container-wide legal">
    <span className="eyebrow">NAORE / ПРАВОВАЯ ИНФОРМАЦИЯ</span>
    <h1>Прозрачно о<br /><span style={accent}>ваших данных.</span></h1>
    <p className="section-copy">Политика в отношении обработки персональных данных (далее — «Политика») определяет порядок обработки и защиты персональных данных пользователей сайта NAORE Fitness (далее — «Сайт») в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».</p>
    <p className="legal-note" data-testid="text-legal-requisites">⚠️ Реквизиты оператора нужно заполнить перед публикацией: Оператор — [ИП/ООО «___»], ИНН [___], ОГРН/ОГРНИП [___], адрес [___], email support@naore.ru. Дата вступления в силу: [дата].</p>

    <h2>1. Оператор персональных данных</h2>
    <p>Оператором персональных данных является [ИП/ООО «___»], ИНН [___], ОГРН/ОГРНИП [___], адрес: [___] (далее — «Оператор»). Контакт по вопросам обработки данных: <a href="mailto:support@naore.ru" style={accent}>support@naore.ru</a>.</p>

    <h2>2. Какие данные мы обрабатываем</h2>
    <p>Оператор обрабатывает только те данные, которые вы добровольно передаёте через формы Сайта:</p>
    <ul>
      <li>имя;</li>
      <li>адрес электронной почты (email);</li>
      <li>роль (тренер или атлет);</li>
      <li>тема и текст обращения;</li>
      <li>интересующий продукт (при подписке на лист ожидания).</li>
    </ul>
    <p>Специальные и биометрические категории персональных данных не собираются. Сайт не предназначен для лиц младше 18 лет без согласия законных представителей.</p>

    <h2>3. Цели обработки</h2>
    <ul>
      <li>ответ на обращение и связь с вами по теме NAORE Fitness;</li>
      <li>информирование о запуске продуктов и раннем доступе (при подписке на лист ожидания);</li>
      <li>улучшение работы Сайта и качества поддержки.</li>
    </ul>

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
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={Home} /><Route path="/support" component={SupportPage} /><Route path="/legal" component={LegalPage} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;