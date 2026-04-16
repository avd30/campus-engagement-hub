import { POE, getPOEType, STATUS_COLORS, formatDate } from '@/types/campus';

interface TimelineViewProps {
  poes: POE[];
  onSelectPOE: (pid: string) => void;
  selectedPoeId?: string | null;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const AY_MONTH_ORDER = [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2];

function dateToAYPct(d: Date): number {
  const m = d.getMonth();
  const ayIndex = AY_MONTH_ORDER.indexOf(m);
  const dayFraction = (d.getDate() - 1) / new Date(d.getFullYear(), m + 1, 0).getDate();
  return ((ayIndex + dayFraction) * 100) / 12;
}

export default function TimelineView({ poes, onSelectPOE, selectedPoeId }: TimelineViewProps) {
  const events = poes
    .filter(p => p.date)
    .map(p => {
      const startDate = new Date(p.date + 'T00:00:00');
      const endDate = p.endDate ? new Date(p.endDate + 'T00:00:00') : startDate;
      return { poe: p, startDate, endDate };
    })
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  if (events.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-muted-foreground">
        No engagements with dates to display on the timeline.
      </div>
    );
  }

  // Assign stagger levels
  const positioned = (() => {
    const aboveBuckets: { leftPct: number; rightPct: number; level: number }[] = [];
    const belowBuckets: { leftPct: number; rightPct: number; level: number }[] = [];

    return events.map((ev, idx) => {
      const leftPct = dateToAYPct(ev.startDate);
      const rightPct = dateToAYPct(ev.endDate);
      const isMultiDay = ev.poe.endDate && ev.poe.endDate !== ev.poe.date;
      const above = idx % 2 === 0;
      const bucket = above ? aboveBuckets : belowBuckets;

      let level = 0;
      for (const prev of bucket) {
        if (!(rightPct < prev.leftPct - 8 || leftPct > prev.rightPct + 8)) {
          level = Math.max(level, prev.level + 1);
        }
      }
      bucket.push({ leftPct, rightPct, level });
      return { ...ev, leftPct, rightPct, above, level, isMultiDay };
    });
  })();

  const maxAboveLevel = Math.max(0, ...positioned.filter(e => e.above).map(e => e.level));
  const maxBelowLevel = Math.max(0, ...positioned.filter(e => !e.above).map(e => e.level));

  const cardHeight = 56;
  const cardGap = 8;
  const baseOffset = 20;
  const aboveSpace = baseOffset + (maxAboveLevel + 1) * (cardHeight + cardGap);
  const belowSpace = baseOffset + (maxBelowLevel + 1) * (cardHeight + cardGap);
  const barY = aboveSpace;
  const totalHeight = barY + 6 + belowSpace + 10;

  return (
    <div className="p-4 overflow-x-auto">
      <div className="relative min-w-[800px]" style={{ height: `${totalHeight}px` }}>
        {/* Month labels */}
        <div className="absolute left-0 right-4 flex" style={{ top: `${barY - 18}px` }}>
          {AY_MONTH_ORDER.map((mIdx, i) => {
            const segWidth = 100 / 12;
            const left = i * segWidth;
            return (
              <div key={mIdx} className="absolute text-center" style={{ left: `${left}%`, width: `${segWidth}%` }}>
                <span className="text-[10px] font-semibold text-muted-foreground">{MONTH_NAMES[mIdx].slice(0, 3)}</span>
              </div>
            );
          })}
        </div>

        {/* Month ticks */}
        {AY_MONTH_ORDER.map((_, i) => (
          <div key={`tick-${i}`} className="absolute" style={{ left: `${(i * 100) / 12}%`, top: `${barY - 6}px`, width: '1px', height: '18px', background: 'hsl(var(--primary-mid))', opacity: 0.5 }} />
        ))}
        <div className="absolute" style={{ left: '100%', top: `${barY - 6}px`, width: '1px', height: '18px', background: 'hsl(var(--primary-mid))', opacity: 0.5 }} />

        {/* The colored bar */}
        <div className="absolute left-0 right-0 flex rounded-full overflow-hidden" style={{ top: `${barY}px`, height: '6px' }}>
          {AY_MONTH_ORDER.map((_, i) => (
            <div key={i} className="h-full" style={{ width: `${100 / 12}%`, background: i < 4 ? 'hsl(var(--primary-light))' : i < 8 ? 'hsl(var(--primary-mid))' : 'hsl(var(--primary))', opacity: 0.5 + (i / 12) * 0.5 }} />
          ))}
          <div className="absolute right-[-8px] top-1/2 -translate-y-1/2" style={{ width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderLeft: '9px solid hsl(var(--primary))' }} />
        </div>

        {/* Events */}
        {positioned.map((ev) => {
          const t = getPOEType(ev.poe);
          const sc = STATUS_COLORS[ev.poe.status || 'planned'];
          const isSelected = selectedPoeId === ev.poe.id;
          const offset = baseOffset + ev.level * (cardHeight + cardGap);
          const topPos = ev.above ? barY - offset - cardHeight : barY + 6 + offset;
          const connectorTop = ev.above ? topPos + cardHeight : barY + 6;
          const connectorHeight = ev.above ? barY - (topPos + cardHeight) : topPos - (barY + 6);
          const clampedLeft = Math.min(ev.leftPct, 95);

          const dateLabel = ev.isMultiDay
            ? `${ev.startDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} – ${ev.endDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`
            : ev.startDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

          return (
            <div key={ev.poe.id}>
              {/* Connector */}
              <div className="absolute" style={{ left: `${clampedLeft}%`, top: `${connectorTop}px`, height: `${Math.max(connectorHeight, 0)}px`, width: '2px', background: t.tx, opacity: 0.3, transform: 'translateX(50%)' }} />
              {/* Dot */}
              <div className="absolute rounded-full border-2" style={{ borderColor: sc.bg, background: sc.bg, left: `${clampedLeft}%`, top: `${barY - 4}px`, width: '12px', height: '12px', transform: 'translateX(-3px)' }} />
              {/* Card */}
              <div
                className={`absolute rounded-xl shadow-sm px-2.5 py-1.5 text-center cursor-pointer transition-all z-10 ${isSelected ? 'ring-2 ring-primary scale-105' : 'hover:scale-105 hover:shadow-md'}`}
                style={{
                  left: ev.isMultiDay ? `${clampedLeft}%` : `${clampedLeft}%`,
                  width: ev.isMultiDay ? `${Math.max(ev.rightPct - ev.leftPct, 8)}%` : undefined,
                  minWidth: ev.isMultiDay ? undefined : '100px',
                  top: `${topPos}px`,
                  transform: ev.isMultiDay ? undefined : 'translateX(-50%)',
                  background: t.bg,
                  color: t.tx,
                  border: `1.5px solid ${sc.bg}`,
                }}
                onClick={() => onSelectPOE(ev.poe.id)}
              >
                <div className="text-[10px] font-semibold leading-tight truncate">{t.label}</div>
                {ev.poe.eventDetail && <div className="text-[9px] leading-tight mt-[1px] truncate">{ev.poe.eventDetail}</div>}
                <div className="text-[8px] mt-[1px] opacity-70">{dateLabel}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
