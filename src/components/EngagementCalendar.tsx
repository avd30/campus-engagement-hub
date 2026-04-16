import { useState, useMemo } from 'react';
import { College, getPOEType, STATUS_COLORS, EngagementStatus } from '@/types/campus';

interface EngagementCalendarProps {
  colleges: College[];
  onSelectCollege: (cid: string, pid: string) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

interface CalendarEvent {
  cid: string;
  pid: string;
  label: string;
  collegeName: string;
  status: EngagementStatus;
  startDate: Date;
  endDate: Date;
}

export default function EngagementCalendar({ colleges, onSelectCollege }: EngagementCalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const events = useMemo(() => {
    const list: CalendarEvent[] = [];
    colleges.forEach(c => {
      c.poes.forEach(p => {
        if (!p.date) return;
        const t = getPOEType(p);
        const startDate = new Date(p.date + 'T00:00:00');
        const endDate = p.endDate ? new Date(p.endDate + 'T00:00:00') : startDate;
        list.push({
          cid: c.id, pid: p.id,
          label: `${c.name}: ${t.label}`,
          collegeName: c.name,
          status: (p.status || 'planned') as EngagementStatus,
          startDate, endDate,
        });
      });
    });
    return list;
  }, [colleges]);

  // Build day -> events map for the current month (handling multi-day spans)
  const dayEventsMap = useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {};
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    events.forEach(ev => {
      // Check if event overlaps with this month
      if (ev.endDate < monthStart || ev.startDate > monthEnd) return;
      const start = Math.max(ev.startDate.getDate(), ev.startDate < monthStart ? 1 : ev.startDate.getDate());
      const end = Math.min(ev.endDate > monthEnd ? monthEnd.getDate() : ev.endDate.getDate(), monthEnd.getDate());
      
      // Only add to the first day in this month (for rendering as a span)
      const startDay = ev.startDate.getMonth() === month && ev.startDate.getFullYear() === year ? ev.startDate.getDate() : 1;
      if (!map[startDay]) map[startDay] = [];
      map[startDay].push(ev);
    });
    return map;
  }, [events, year, month]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const statusColor = (s: EngagementStatus) => STATUS_COLORS[s] || STATUS_COLORS.planned;

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
        <button onClick={prevMonth} className="text-primary-foreground bg-transparent border-none cursor-pointer text-lg font-bold hover:opacity-70 px-2">‹</button>
        <span className="text-sm font-semibold">{MONTH_NAMES[month]} {year}</span>
        <button onClick={nextMonth} className="text-primary-foreground bg-transparent border-none cursor-pointer text-lg font-bold hover:opacity-70 px-2">›</button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold py-1.5 bg-primary-light text-primary-dark">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const key = day ? `${year}-${month}-${day}` : `empty-${i}`;
          const eventsForDay = day ? dayEventsMap[day] : undefined;
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const MAX_VISIBLE = 2;

          return (
            <div
              key={key}
              className={`min-h-[68px] border-b border-r border-border p-1 ${day ? 'bg-surface' : 'bg-muted/30'} ${isToday ? 'ring-1 ring-inset ring-primary' : ''}`}
            >
              {day && (
                <>
                  <div className={`text-[11px] mb-0.5 ${isToday ? 'font-bold text-primary' : 'text-muted-foreground'}`}>{day}</div>
                  {eventsForDay?.slice(0, MAX_VISIBLE).map((ev, ei) => {
                    const sc = statusColor(ev.status);
                    return (
                      <button
                        key={ei}
                        onClick={() => onSelectCollege(ev.cid, ev.pid)}
                        className="block w-full text-left text-[8px] leading-tight font-medium rounded px-1 py-0.5 mb-0.5 cursor-pointer truncate border-none"
                        style={{ background: sc.bg, color: sc.tx }}
                        title={ev.label}
                      >
                        {ev.collegeName}
                      </button>
                    );
                  })}
                  {eventsForDay && eventsForDay.length > MAX_VISIBLE && (
                    <div className="text-[8px] text-muted-foreground font-medium px-1">+{eventsForDay.length - MAX_VISIBLE} more</div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
