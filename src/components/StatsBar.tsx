import { College } from '@/types/campus';

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
          <div key={s.label} className="bg-surface border border-border rounded-xl p-3">
            <div className="text-[10px] text-muted-foreground font-medium mb-1">{s.icon} {s.label}</div>
            <div className="text-lg font-bold text-foreground leading-none">{s.val}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</div>
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="text-center">
            <div className="text-[10px] text-muted-foreground font-medium mb-1">{s.icon} {s.label}</div>
            <div className="text-xl font-bold text-foreground leading-none">{s.val}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
