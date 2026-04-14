import { useMemo } from 'react';
import { College, getPOEType, formatDate, STATUS_COLORS } from '@/types/campus';

interface RemindersPanelProps {
  colleges: College[];
  onSelectEngagement: (cid: string, pid: string) => void;
}

export default function RemindersPanel({ colleges, onSelectEngagement }: RemindersPanelProps) {
  const reminders = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const items: { cid: string; pid: string; collegeName: string; poe: any; daysUntil: number }[] = [];
    colleges.forEach(c => {
      c.poes.forEach(p => {
        if (!p.reminderEnabled || p.status !== 'planned' || !p.reminderDate) return;
        const rd = new Date(p.reminderDate + 'T00:00:00');
        if (today >= rd) {
          const startD = p.date ? new Date(p.date + 'T00:00:00') : null;
          const daysUntil = startD ? Math.ceil((startD.getTime() - today.getTime()) / 86400000) : 999;
          items.push({ cid: c.id, pid: p.id, collegeName: c.name, poe: p, daysUntil });
        }
      });
    });
    return items.sort((a, b) => a.daysUntil - b.daysUntil);
  }, [colleges]);

  if (reminders.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-foreground">Reminders</span>
          <span className="text-[10px] bg-muted text-muted-foreground rounded-full px-2 py-0.5">0 Due</span>
        </div>
        <p className="text-xs text-muted-foreground text-center py-4">No reminders due 🎉</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-foreground">Reminders</span>
        <span className="text-[10px] bg-destructive-light text-destructive rounded-full px-2 py-0.5 font-medium">{reminders.length} Due</span>
      </div>
      <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
        {reminders.map(r => {
          const t = getPOEType(r.poe);
          const statusInfo = STATUS_COLORS[r.poe.status as keyof typeof STATUS_COLORS];
          return (
            <div key={`${r.cid}-${r.pid}`}>
              <button
                onClick={() => onSelectEngagement(r.cid, r.pid)}
                className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border cursor-pointer hover:border-primary-mid hover:shadow-sm transition-all w-full text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-foreground truncate">{r.poe.eventDetail || t.label}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{r.collegeName}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {formatDate(r.poe.date)}{r.poe.endDate ? ` – ${formatDate(r.poe.endDate)}` : ''}
                  </div>
                  {r.poe.assignedTo && <span className="text-[10px] text-muted-foreground"> · {r.poe.assignedTo}</span>}
                </div>
                <span className={`text-[10px] font-medium rounded-full px-2 py-0.5 whitespace-nowrap ${r.daysUntil <= 0 ? 'bg-destructive-light text-destructive' : 'bg-primary-light text-primary'}`}>
                  {r.daysUntil <= 0 ? 'Overdue' : `${r.daysUntil}d left`}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
