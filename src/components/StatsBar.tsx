import { College, STATUS_COLORS } from '@/types/campus';

interface StatsBarProps {
  db: College[];
  variant?: 'compact';
}

export default function StatsBar({ db, variant }: StatsBarProps) {
  const total = db.length;
  const totalPoes = db.reduce((a, c) => a + c.poes.length, 0);
  const eng = db.filter(c => c.stream === 'Engineering').length;
  const mgmt = db.filter(c => c.stream === 'Management').length;
  const topTier = db.filter(c => ['Premier', 'IIM'].includes(c.tier)).length;
  const donePoes = db.reduce((a, c) => a + c.poes.filter(p => p.status === 'done').length, 0);
  const plannedPoes = db.reduce((a, c) => a + c.poes.filter(p => p.status === 'planned').length, 0);

  const stats = [
    { label: 'Total colleges', val: total, sub: `${eng} Eng · ${mgmt} Mgmt`, icon: '🏫' },
    { label: 'Top tier', val: topTier, sub: 'Premier & IIM', icon: '⭐' },
    { label: 'Engagements', val: totalPoes, sub: `${donePoes} done · ${plannedPoes} planned`, icon: '📋' },
    { label: 'Avg / college', val: total ? (totalPoes / total).toFixed(1) : '0', sub: 'points of engagement', icon: '📊' },
  ];

  if (variant === 'compact') {
    return (
      <>
        {stats.map(s => (
          <div key={s.label} className="bg-surface border border-border rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm">{s.icon}</span>
              <span className="text-[11px] text-muted-foreground">{s.label}</span>
            </div>
            <div className="text-[22px] font-bold text-foreground tracking-tight">{s.val}</div>
            <div className="text-[10px] text-text-hint mt-[2px]">{s.sub}</div>
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5 sm:mb-5">
      {stats.map(s => (
        <div key={s.label} className="bg-surface border border-border rounded-2xl p-3 sm:px-4 sm:py-3 shadow-sm">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-sm">{s.icon}</span>
            <span className="text-[11px] text-muted-foreground">{s.label}</span>
          </div>
          <div className="text-[22px] font-bold text-foreground tracking-tight">{s.val}</div>
          <div className="text-[10px] text-text-hint mt-[2px]">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}
