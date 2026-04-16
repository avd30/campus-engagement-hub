interface TierBadgeProps {
  tier: string;
}

export default function TierBadge({ tier }: TierBadgeProps) {
  const isTop = ['Premier', 'IIM'].includes(tier);
  const cls = isTop ? 'bg-tier1-bg text-tier1-tx' : 'bg-tier2-bg text-tier2-tx';
  return <span className={`inline-flex items-center text-[10px] font-semibold px-[7px] py-[2px] rounded-[4px] whitespace-nowrap ${cls}`}>{tier}</span>;
}
