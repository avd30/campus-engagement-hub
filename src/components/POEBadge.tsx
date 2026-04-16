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
      className="text-[10px] font-semibold px-[7px] py-[2px] rounded-[4px] cursor-pointer transition-opacity border-none whitespace-nowrap hover:opacity-80"
      style={{
        background: t.bg,
        color: t.tx,
        outline: selected ? `2px solid ${t.tx}` : 'none',
        outlineOffset: selected ? '1px' : undefined,
      }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {t.label}
    </button>
  );
}
