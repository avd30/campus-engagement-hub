interface TierBadgeProps {
  tier: string;
}

export default function TierBadge({ tier }: TierBadgeProps) {
  const isTop = ['Premier', 'IIM'].includes(tier);
  const cls = isTop ? 'bg-tier1-bg text-tier1-tx' : 'bg-tier2-bg text-tier2-tx';
  return <span className={`${cls} rounded-full px-2 py-0.5 text-[10px] font-medium`}>{tier}</span>;
}
