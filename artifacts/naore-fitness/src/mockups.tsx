import { ReactNode } from 'react';
import { ArrowRight, CalendarDays, Flame, Send, TrendingUp } from 'lucide-react';

// Кодовые UI-мокапы в фирменном стиле NAORE — заменяют фото-плейсхолдеры.
function MockFrame({ ratio, title, children }: { ratio: 'wide' | 'tall'; title: string; children: ReactNode }) {
  return <div className={`mock-wrap ${ratio}`}><div className="mockframe" role="img" aria-label={`Мокап: ${title}`}>
    <div className="mk-bar"><span className="mk-dot on" /><span className="mk-dot" /><span className="mk-dot" /><span className="mk-title">{title}</span></div>
    <div className="mk-body">{children}</div>
  </div></div>;
}

export function MockConstructor({ ratio = 'wide' }: { ratio?: 'wide' | 'tall' }) {
  return <MockFrame ratio={ratio} title="NAORE / Конструктор">
    <div className="mk-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span className="mk-h">День ног · сила</span><span className="mk-badge" style={{ font: '600 9.5px var(--app-font-mono)', color: 'hsl(var(--primary))' }}>4 упражнения</span></div>
    <div className="mk-ex"><span><b>Приседания со штангой</b><br /><span>отдых 120с</span></span><span className="mk-badge">4×8</span></div>
    <div className="mk-ex"><span><b>Жим ногами</b><br /><span>отдых 90с</span></span><span className="mk-badge">3×12</span></div>
    <div className="mk-ex"><span><b>Выпады с гантелями</b><br /><span>отдых 90с</span></span><span className="mk-badge">3×10</span></div>
    <div className="mk-ex"><span><b>Сгибания голени</b><br /><span>отдых 60с</span></span><span className="mk-badge">3×15</span></div>
  </MockFrame>;
}

export function MockAnalytics({ ratio = 'wide' }: { ratio?: 'wide' | 'tall' }) {
  const bars = [42, 55, 48, 66, 60, 78, 72, 90];
  return <MockFrame ratio={ratio} title="NAORE / Аналитика">
    <div className="mk-metrics">
      <div className="mk-metric"><span>Объём за неделю</span><strong>12.4т <b>+9%</b></strong></div>
      <div className="mk-metric"><span>Выполнено</span><strong>86% <b>+8%</b></strong></div>
    </div>
    <div className="mk-row" style={{ justifyContent: 'space-between', display: 'flex' }}><span className="mk-sub">Нагрузка · 8 недель</span><TrendingUp size={13} style={{ color: 'hsl(var(--primary))' }} /></div>
    <div className="mk-bars">{bars.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
  </MockFrame>;
}

export function MockChat({ ratio = 'wide' }: { ratio?: 'wide' | 'tall' }) {
  return <MockFrame ratio={ratio} title="NAORE / Чат">
    <div className="mk-row"><span className="mk-avatar">Д</span><span><span className="mk-h" style={{ fontSize: 12 }}>Тренер · Дмитрий</span><br /><span className="mk-sub">онлайн</span></span></div>
    <div className="mk-msgs">
      <div className="mk-msg them">По приседу добавь 2.5 кг — техника отличная 👌</div>
      <div className="mk-msg me">Понял! Колени не заваливались?</div>
      <div className="mk-msg them">Нет, всё ровно. Держим темп.</div>
      <div className="mk-msg me">Записал в план на среду 💪</div>
    </div>
    <div className="mk-ex" style={{ marginTop: 'auto' }}><span style={{ color: 'hsl(var(--muted-foreground))', fontSize: 10 }}>Комментарий к упражнению…</span><Send size={13} style={{ color: 'hsl(var(--primary))' }} /></div>
  </MockFrame>;
}

export function MockCalendar({ ratio = 'wide' }: { ratio?: 'wide' | 'tall' }) {
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  const active = [2, 4, 9, 11, 16, 18, 23, 25];
  return <MockFrame ratio={ratio} title="NAORE / Календарь">
    <div className="mk-row" style={{ justifyContent: 'space-between', display: 'flex' }}><span className="mk-h">Апрель</span><span className="mk-sub">8 тренировок</span></div>
    <div className="mk-cal">{['П', 'В', 'С', 'Ч', 'П', 'С', 'В'].map((d, i) => <i key={'h' + i} style={{ border: 'none', background: 'transparent', color: 'hsl(var(--muted-foreground))', fontSize: 8 }}>{d}</i>)}{days.map((d) => <i key={d} className={active.includes(d) ? 'on' : ''}>{d}</i>)}</div>
    <div className="mk-hero" style={{ marginTop: 'auto' }}><span><span className="mk-sub">Следующая · СР 09:00</span><br /><b>Ноги / сила</b></span><CalendarDays size={16} style={{ color: 'hsl(var(--primary))' }} /></div>
  </MockFrame>;
}

export function MockKbju({ ratio = 'wide' }: { ratio?: 'wide' | 'tall' }) {
  return <MockFrame ratio={ratio} title="NAORE / КБЖУ">
    <div className="mk-row" style={{ justifyContent: 'space-between', display: 'flex' }}><span className="mk-h">Дневная норма</span><span className="mk-badge" style={{ color: 'hsl(var(--primary))', font: '600 10px var(--app-font-mono)' }}>2 240 ккал</span></div>
    <div className="mk-macros">
      <div className="mk-macro"><span>Белки</span><div className="mk-barline"><i style={{ width: '72%' }} /></div><strong>168 г</strong></div>
      <div className="mk-macro"><span>Жиры</span><div className="mk-barline"><i style={{ width: '55%' }} /></div><strong>62 г</strong></div>
      <div className="mk-macro"><span>Углеводы</span><div className="mk-barline"><i style={{ width: '64%' }} /></div><strong>240 г</strong></div>
    </div>
    <div className="mk-hero" style={{ marginTop: 'auto' }}><span><span className="mk-sub">Осталось сегодня</span><br /><b>620 ккал</b></span><span className="na-ringwrap"><svg className="na-ring" viewBox="0 0 74 74"><circle className="bg" cx="37" cy="37" r="32" /><circle className="fg" cx="37" cy="37" r="32" /></svg><b>72%</b></span></div>
  </MockFrame>;
}

export function MockHistory({ ratio = 'wide' }: { ratio?: 'wide' | 'tall' }) {
  const rows = [['12 апр', 'Грудь / плечи', '9.8т'], ['10 апр', 'Ноги / сила', '12.4т'], ['08 апр', 'Спина / бицепс', '10.1т'], ['06 апр', 'Кардио / кор', '—']];
  return <MockFrame ratio={ratio} title="NAORE / История">
    <div className="mk-row" style={{ justifyContent: 'space-between', display: 'flex' }}><span className="mk-h">Последние тренировки</span><span className="mk-sub">архив</span></div>
    {rows.map((r) => <div className="mk-ex" key={r[0]}><span><b>{r[1]}</b><br /><span>{r[0]}</span></span><span className="mk-badge">{r[2]}</span></div>)}
    <div style={{ marginTop: 'auto' }}><div className="mk-sub" style={{ marginBottom: 6 }}>Цель месяца · 78%</div><div className="mk-prog"><i style={{ width: '78%' }} /></div></div>
  </MockFrame>;
}

export function MockAthlete() {
  const bars = [40, 52, 46, 63, 58, 75, 82];
  return <MockFrame ratio="tall" title="NAORE / Кабинет атлета">
    <div className="mk-row"><span className="mk-avatar">К</span><span><span className="mk-h" style={{ fontSize: 13 }}>Кирилл</span><br /><span className="mk-sub">атлет · 12-я неделя</span></span></div>
    <div className="mk-hero"><span><span className="mk-sub">Сегодня · 09:00</span><br /><b>Ноги / сила</b></span><ArrowRight size={16} style={{ color: 'hsl(var(--primary))' }} /></div>
    <div className="mk-metrics">
      <div className="mk-metric"><span>Серия</span><strong>12 дней</strong></div>
      <div className="mk-metric"><span>Выполнено</span><strong>86% <b>+8%</b></strong></div>
    </div>
    <div className="mk-sub">Прогресс · 7 недель</div>
    <div className="mk-bars">{bars.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
    <div className="mk-hero" style={{ marginTop: 'auto', border: '1px solid hsl(var(--border))', background: 'hsl(var(--surface-2) / .55)' }}><span><span className="mk-sub">КБЖУ сегодня</span><br /><b>1 620 / 2 240 ккал</b></span><Flame size={15} style={{ color: 'hsl(var(--primary))' }} /></div>
  </MockFrame>;
}

export function MockTrainer() {
  const clients = [['Мария К.', '92%', 68], ['Игорь П.', '74%', 74], ['Анна С.', '88%', 61], ['Олег Т.', '65%', 44]];
  return <MockFrame ratio="tall" title="NAORE / Кабинет тренера">
    <div className="mk-row" style={{ justifyContent: 'space-between', display: 'flex' }}><span className="mk-h">Клиенты</span><span className="mk-badge" style={{ color: 'hsl(var(--primary))', font: '600 10px var(--app-font-mono)' }}>20 активных</span></div>
    <div className="mk-metrics">
      <div className="mk-metric"><span>Средн. выполнение</span><strong>81% <b>+5%</b></strong></div>
      <div className="mk-metric"><span>Тренировок / нед</span><strong>96</strong></div>
    </div>
    <div className="mk-sub" style={{ marginTop: 2 }}>Мои клиенты</div>
    <div>{clients.map((c) => <div className="mk-client" key={c[0] as string}><span className="mk-avatar" style={{ width: 24, height: 24, fontSize: 9 }}>{(c[0] as string).charAt(0)}</span><b>{c[0]}</b><span style={{ width: 54 }}><div className="mk-prog"><i style={{ width: `${c[2]}%` }} /></div></span><span>{c[1]}</span></div>)}</div>
    <div className="mk-hero" style={{ marginTop: 'auto' }}><span><span className="mk-sub">Новая заявка</span><br /><b>+1 клиент на разбор</b></span><ArrowRight size={16} style={{ color: 'hsl(var(--primary))' }} /></div>
  </MockFrame>;
}

export function MockAvatar({ name }: { name: string }) {
  const initials = name.split(' ').map((p) => p.charAt(0)).join('').slice(0, 2).toUpperCase();
  return <span className="mk-avatar" style={{ width: 44, height: 44, fontSize: 15, borderRadius: '50%' }} aria-hidden="true">{initials}</span>;
}
