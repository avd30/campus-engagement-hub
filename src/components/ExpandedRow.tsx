import { College, getPOEType, formatDate, STATUS_COLORS } from '@/types/campus';
import POEDetail from './POEDetail';

interface ExpandedRowProps {
  college: College;
  selectedPoe: { cid: string; pid: string } | null;
  pendingDeletePoe: { cid: string; pid: string } | null;
  onSelectPOE: (cid: string, pid: string) => void;
  onAddPOE: (cid: string) => void;
  onEditPOE: (cid: string, pid: string) => void;
  onAskDeletePOE: (cid: string, pid: string) => void;
  onConfirmDeletePOE: (cid: string, pid: string) => void;
  onCancelDeletePOE: () => void;
  onMarkEngagement?: (cid: string, pid: string) => void;
}

export default function ExpandedRow({ college: c, selectedPoe, pendingDeletePoe, onSelectPOE, onAddPOE, onEditPOE, onAskDeletePOE, onConfirmDeletePOE, onCancelDeletePOE, onMarkEngagement }: ExpandedRowProps) {
  if (c.poes.length === 0) {
    return (
      <div className="p-4 text-xs text-muted-foreground text-center">
        No engagements yet for this college. <button onClick={() => onAddPOE(c.id)} className="text-primary hover:underline cursor-pointer bg-transparent border-none text-xs">Add one now.</button>
      </div>
    );
  }

  const selPoe = selectedPoe?.cid === c.id ? c.poes.find(p => p.id === selectedPoe.pid) : null;

  return (
    <div className="p-4">
      <div className="text-[10px] text-muted-foreground font-medium mb-2">Points of engagement — click a card to see details</div>
      <div className="flex flex-wrap gap-2 mb-3">
        {c.poes.map(p => {
          const t = getPOEType(p);
          const sc = STATUS_COLORS[p.status || 'planned'];
          const isSel = selectedPoe?.cid === c.id && selectedPoe?.pid === p.id;
          return (
            <div key={p.id} className={`bg-surface border rounded-xl p-2.5 cursor-pointer transition-all min-w-[140px] max-w-[200px] ${isSel ? 'border-primary shadow-md ring-1 ring-primary/30' : 'border-border hover:border-primary-mid hover:shadow-sm'}`}>
              <div onClick={() => onSelectPOE(c.id, p.id)}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="rounded-lg px-1.5 py-0.5 text-[9px] font-medium" style={{ background: t.bg, color: t.tx }}>{t.label}</span>
                  <span className="rounded-full px-1.5 py-0.5 text-[9px] font-medium" style={{ background: sc.bg, color: sc.tx }}>{sc.label}</span>
                </div>
                {p.eventDetail && <div className="text-[10px] text-foreground font-medium truncate">{p.eventDetail}</div>}
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {p.date ? formatDate(p.date) : 'No date set'}
                  {p.endDate ? ` – ${formatDate(p.endDate)}` : ''}
                </div>
                {p.assignedTo && <div className="text-[10px] text-muted-foreground mt-0.5">👤 {p.assignedTo}</div>}
              </div>
            </div>
          );
        })}
        <button onClick={() => onAddPOE(c.id)} className="bg-background text-muted-foreground border border-dashed border-border rounded-xl flex items-center justify-center min-w-[100px] p-3 cursor-pointer hover:border-primary-mid hover:text-primary transition-colors">
          <div className="text-center">
            <div className="text-lg">+</div>
            <div className="text-[10px]">Add engagement</div>
          </div>
        </button>
      </div>
      {selPoe && (
        <POEDetail
          poe={selPoe}
          onEdit={() => onEditPOE(c.id, selPoe.id)}
          onAskDelete={() => onAskDeletePOE(c.id, selPoe.id)}
          onConfirmDelete={() => onConfirmDeletePOE(c.id, selPoe.id)}
          onCancelDelete={onCancelDeletePOE}
          isPendingDelete={!!pendingDeletePoe && pendingDeletePoe.cid === c.id && pendingDeletePoe.pid === selPoe.id}
          onMarkEngagement={onMarkEngagement ? () => onMarkEngagement(c.id, selPoe.id) : undefined}
        />
      )}
    </div>
  );
}
