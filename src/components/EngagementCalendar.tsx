import { useState, useMemo } from 'react';
import { College, getPOEType, STATUS_COLORS, EngagementStatus } from '@/types/campus';

interface EngagementCalendarProps {
  colleges: College[];
  onSelectCollege: (cid: string, pid: string) => void;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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

  const dayEventsMap = useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {};
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    events.forEach(ev => {
      if (ev.endDate < monthStart || ev.startDate > monthEnd) return;
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
    <div className="bg-surface border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="bg-transparent border-none text-foreground cursor-pointer text-lg hover:text-primary">‹</button>
        <span className="text-sm font-semibold text-foreground">{MONTH_NAMES[month]} {year}</span>
        <button onClick={nextMonth} className="bg-transparent border-none text-foreground cursor-pointer text-lg hover:text-primary">›</button>
      </div>

      <div className="grid grid-cols-7 gap-0">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center py-1">
            <span className="text-[10px] text-muted-foreground font-medium">{d}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0">
        {cells.map((day, i) => {
          const key = day ? `${year}-${month}-${day}` : `empty-${i}`;
          const eventsForDay = day ? dayEventsMap[day] : undefined;
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const MAX_VISIBLE = 2;

          return (
            <div key={key} className="min-h-[60px] border border-border/50 p-0.5">
              {day && (
                <>
                  <div className={`text-[10px] font-medium mb-0.5 text-center ${isToday ? 'bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center mx-auto' : 'text-muted-foreground'}`}>
                    {day}
                  </div>
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
                    <div className="text-[8px] text-muted-foreground text-center">
                      +{eventsForDay.length - MAX_VISIBLE} more
                    </div>
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
