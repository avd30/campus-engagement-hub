interface StreamBadgeProps {
  stream: string;
}

export default function StreamBadge({ stream }: StreamBadgeProps) {
  const cls = stream === 'Engineering' ? 'bg-eng-bg text-eng-tx'
    : stream === 'Management' ? 'bg-mgmt-bg text-mgmt-tx'
    : 'bg-law-bg text-law-tx';
  return <span className={`inline-flex items-center text-[10px] font-semibold px-[7px] py-[2px] rounded-[4px] whitespace-nowrap ${cls}`}>{stream}</span>;
}
