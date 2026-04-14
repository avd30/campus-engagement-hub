import { POE, getPOEType, STATUS_COLORS, formatDate } from '@/types/campus';

interface TimelineViewProps {
  poes: POE[];
  onSelectPOE: (pid: string) => void;
  selectedPoeId?: string | null;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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
      <div className="bg-background border border-border rounded-xl p-6 text-center">
        <p className="text-xs text-muted-foreground">No engagements with dates to display on the timeline.</p>
      </div>
    );
  }

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
    <div className="overflow-x-auto pb-2">
      <div className="relative min-w-[700px]" style={{ height: totalHeight }}>
        {/* Month labels */}
        <div className="absolute top-0 left-0 right-0 flex" style={{ height: 16 }}>
          {AY_MONTH_ORDER.map((mIdx, i) => {
            const segWidth = 100 / 12;
            const left = i * segWidth;
            return (
              <div key={mIdx} className="absolute text-[9px] text-muted-foreground font-medium" style={{ left: `${left}%`, width: `${segWidth}%`, textAlign: 'center' }}>
                {MONTH_NAMES[mIdx].slice(0, 3)}
              </div>
            );
          })}
        </div>

        {/* Month ticks */}
        {AY_MONTH_ORDER.map((_, i) => (
          <div key={i} className="absolute w-px bg-border/60" style={{ left: `${(i * 100) / 12}%`, top: 16, bottom: 10 }} />
        ))}

        {/* The colored bar */}
        <div className="absolute left-0 right-0 rounded-full overflow-hidden flex" style={{ top: barY, height: 6 }}>
          {AY_MONTH_ORDER.map((_, i) => (
            <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-primary/20' : 'bg-primary/10'}`} />
          ))}
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
              <div className="absolute w-px bg-border" style={{ left: `${clampedLeft}%`, top: connectorTop, height: connectorHeight }} />
              {/* Dot */}
              <div className="absolute w-2 h-2 rounded-full -translate-x-1/2" style={{ left: `${clampedLeft}%`, top: barY + (ev.above ? -1 : 6), background: sc.bg }} />
              {/* Card */}
              <div
                className={`absolute w-[120px] rounded-lg p-1.5 cursor-pointer transition-all border ${isSelected ? 'ring-2 ring-primary shadow-md border-primary' : 'border-border hover:shadow-sm hover:border-primary-mid'}`}
                style={{ left: `${clampedLeft}%`, top: topPos, height: cardHeight, background: 'hsl(var(--surface))' }}
                onClick={() => onSelectPOE(ev.poe.id)}
              >
                <div className="flex items-center gap-1">
                  <span className="rounded px-1 py-px text-[8px] font-medium truncate" style={{ background: t.bg, color: t.tx }}>{t.label}</span>
                </div>
                {ev.poe.eventDetail && <div className="text-[8px] text-foreground truncate mt-0.5">{ev.poe.eventDetail}</div>}
                <div className="text-[8px] text-muted-foreground mt-0.5">{dateLabel}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
