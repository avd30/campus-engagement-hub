interface StreamBadgeProps {
  stream: string;
}

export default function StreamBadge({ stream }: StreamBadgeProps) {
  const cls = stream === 'Engineering' ? 'bg-eng-bg text-eng-tx'
    : stream === 'Management' ? 'bg-mgmt-bg text-mgmt-tx'
    : 'bg-law-bg text-law-tx';
  return <span className={`${cls} rounded-full px-2 py-0.5 text-[10px] font-medium`}>{stream}</span>;
}
