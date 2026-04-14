import { POE, getPOEType } from '@/types/campus';

interface POEBadgeProps {
  poe: POE;
  onClick: () => void;
  selected?: boolean;
}

export default function POEBadge({ poe, onClick, selected }: POEBadgeProps) {
  const t = getPOEType(poe);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`rounded-lg px-[7px] py-[2px] text-[10px] font-medium border-none cursor-pointer transition-all ${selected ? 'ring-2 ring-primary shadow-md scale-105' : ''}`}
      style={{ background: t.bg, color: t.tx }}
    >
      {t.label}
    </button>
  );
}
