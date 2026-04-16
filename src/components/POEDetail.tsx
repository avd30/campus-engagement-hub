import { useEffect, useRef } from 'react';
import { POE, getPOEType, formatDate, STATUS_COLORS } from '@/types/campus';

interface POEDetailProps {
  poe: POE;
  onEdit: () => void;
  onAskDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  isPendingDelete: boolean;
  onMarkEngagement?: () => void;
}

export default function POEDetail({ poe, onEdit, onAskDelete, onConfirmDelete, onCancelDelete, isPendingDelete, onMarkEngagement }: POEDetailProps) {
  const t = getPOEType(poe);
  const sc = STATUS_COLORS[poe.status || 'planned'];
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }, [poe.id]);

  return (
    <div ref={detailRef} className="bg-surface border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center text-[10px] font-semibold px-[7px] py-[2px] rounded-md" style={{ background: t.bg, color: t.tx }}>{t.label}</span>
          <span className="inline-flex items-center text-[9px] font-semibold px-2 py-[2px] rounded-full" style={{ background: sc.bg, color: sc.tx }}>{sc.label}</span>
          {poe.eventDetail && <span className="text-[13px] font-semibold">{poe.eventDetail}</span>}
        </div>
        <div className="flex gap-[6px] flex-wrap">
          {onMarkEngagement && poe.status === 'planned' && (
            <button onClick={onMarkEngagement} className="px-[9px] py-[3px] rounded-lg text-[11px] font-medium bg-primary text-primary-foreground border border-primary hover:bg-primary-dark">Mark</button>
          )}
          <button onClick={onEdit} className="px-[9px] py-[3px] rounded-lg text-[11px] font-medium border border-border bg-surface text-foreground hover:bg-background hover:border-primary-mid">Edit</button>
          {isPendingDelete ? (
            <div className="flex flex-col items-start gap-[5px] bg-destructive-light border border-[#F09595] rounded-lg px-2 py-[6px]">
              <span className="text-[11px] text-destructive-dark font-semibold">Delete?</span>
              <div className="flex gap-1">
                <button onClick={onConfirmDelete} className="bg-destructive text-primary-foreground border-destructive text-[11px] px-[10px] py-[3px] rounded-md font-medium hover:opacity-90">Yes</button>
                <button onClick={onCancelDelete} className="px-[9px] py-[3px] rounded-md text-[11px] font-medium border border-border bg-surface">No</button>
              </div>
            </div>
          ) : (
            <button onClick={onAskDelete} className="px-[9px] py-[3px] rounded-lg text-[11px] font-medium border border-[#F09595] bg-destructive-light text-destructive-dark hover:bg-[#F7C1C1]">Delete</button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-[10px] mb-[10px]">
        <div><div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mb-[3px]">Start date</div><div className="text-xs">{poe.date ? formatDate(poe.date) : '—'}</div></div>
        {poe.endDate && <div><div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mb-[3px]">End date</div><div className="text-xs">{formatDate(poe.endDate)}</div></div>}
        {poe.assignedTo && <div><div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mb-[3px]">Assigned to</div><div className="text-xs">{poe.assignedTo}</div></div>}
        <div><div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mb-[3px]">POC name</div><div className="text-xs">{poe.pocName || '—'}</div></div>
        <div className="overflow-hidden"><div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mb-[3px]">POC email</div><div className="text-xs truncate">{poe.pocEmail ? <a href={`mailto:${poe.pocEmail}`} className="text-primary no-underline hover:underline">{poe.pocEmail}</a> : '—'}</div></div>
        <div><div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mb-[3px]">POC phone</div><div className="text-xs">{poe.pocPhone || '—'}</div></div>
        <div className="sm:col-span-2"><div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mb-[3px]">Event link</div><div className="text-xs">{poe.link ? <a href={poe.link} target="_blank" rel="noopener" className="text-primary no-underline hover:underline">{poe.link}</a> : '—'}</div></div>
      </div>
      {poe.reminderEnabled && poe.reminderDate && (
        <div className="mb-2"><span className="text-[10px] text-muted-foreground font-semibold uppercase">Reminder:</span> <span className="text-[11px]">{formatDate(poe.reminderDate)} ({poe.reminderLeadDays || 60} days before)</span></div>
      )}
      <div><div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mb-[3px]">Notes</div><div className="text-xs text-muted-foreground whitespace-pre-wrap">{poe.notes || '—'}</div></div>

      {/* Report section */}
      {poe.report && poe.status === 'done' && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">📊 Engagement report</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {poe.report.actualTime && <div><span className="text-[10px] text-muted-foreground">Time:</span> <span className="text-xs">{poe.report.actualTime}</span></div>}
            {poe.report.leadersInvolved && <div><span className="text-[10px] text-muted-foreground">Leaders:</span> <span className="text-xs">{poe.report.leadersInvolved}</span></div>}
            {poe.report.candidateCount != null && <div><span className="text-[10px] text-muted-foreground">Candidates:</span> <span className="text-xs">{poe.report.candidateCount}</span></div>}
            {poe.report.reach && <div><span className="text-[10px] text-muted-foreground">Reach:</span> <span className="text-xs">{poe.report.reach}</span></div>}
            {poe.report.driveLink && <div className="col-span-2"><span className="text-[10px] text-muted-foreground">Drive:</span> <a href={poe.report.driveLink} target="_blank" rel="noopener" className="text-xs text-primary hover:underline">{poe.report.driveLink}</a></div>}
          </div>
          {poe.report.summary && <div className="mt-2"><span className="text-[10px] text-muted-foreground">Summary:</span> <span className="text-xs">{poe.report.summary}</span></div>}
        </div>
      )}

      {/* Not done reason */}
      {poe.status === 'not_done' && poe.notDoneReason && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="text-[10px] font-semibold text-destructive uppercase tracking-wider mb-1">Reason not done</div>
          <div className="text-xs">{poe.notDoneReason}</div>
          {poe.notDoneNextAction && <div className="text-xs mt-1 text-muted-foreground">Next action: {poe.notDoneNextAction}</div>}
        </div>
      )}
    </div>
  );
}
