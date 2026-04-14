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

  return (
    <div className="bg-background border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="rounded-lg px-2 py-0.5 text-[10px] font-medium" style={{ background: t.bg, color: t.tx }}>{t.label}</span>
        <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: sc.bg, color: sc.tx }}>{sc.label}</span>
        {poe.eventDetail && <span className="text-xs text-foreground font-medium">{poe.eventDetail}</span>}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {onMarkEngagement && poe.status === 'planned' && (
          <button onClick={onMarkEngagement} className="px-[9px] py-[3px] rounded-lg text-[11px] font-medium border border-primary bg-primary-light text-primary hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">Mark</button>
        )}
        <button onClick={onEdit} className="px-[9px] py-[3px] rounded-lg text-[11px] font-medium border border-border bg-surface text-foreground hover:bg-background hover:border-primary-mid cursor-pointer">Edit</button>
        {isPendingDelete ? (
          <span className="flex items-center gap-1">
            <span className="text-[11px] text-destructive font-medium">Delete?</span>
            <button onClick={onConfirmDelete} className="bg-destructive text-primary-foreground border-destructive text-[11px] px-[10px] py-[3px] rounded-lg font-medium cursor-pointer">Yes</button>
            <button onClick={onCancelDelete} className="bg-surface text-foreground border border-border text-[11px] px-[10px] py-[3px] rounded-lg font-medium cursor-pointer">No</button>
          </span>
        ) : (
          <button onClick={onAskDelete} className="px-[9px] py-[3px] rounded-lg text-[11px] font-medium border border-destructive/50 bg-destructive-light text-destructive-dark hover:bg-destructive/20 cursor-pointer">Delete</button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div><span className="text-muted-foreground">Start date</span><div className="text-foreground font-medium">{poe.date ? formatDate(poe.date) : '—'}</div></div>
        {poe.endDate && <div><span className="text-muted-foreground">End date</span><div className="text-foreground font-medium">{formatDate(poe.endDate)}</div></div>}
        {poe.assignedTo && <div><span className="text-muted-foreground">Assigned to</span><div className="text-foreground font-medium">{poe.assignedTo}</div></div>}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div><span className="text-muted-foreground">POC name</span><div className="text-foreground">{poe.pocName || '—'}</div></div>
        <div><span className="text-muted-foreground">POC email</span><div>{poe.pocEmail ? <a href={`mailto:${poe.pocEmail}`} className="text-primary hover:underline">{poe.pocEmail}</a> : '—'}</div></div>
        <div><span className="text-muted-foreground">POC phone</span><div className="text-foreground">{poe.pocPhone || '—'}</div></div>
        <div><span className="text-muted-foreground">Event link</span><div>{poe.link ? <a href={poe.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{poe.link}</a> : '—'}</div></div>
      </div>

      {poe.reminderEnabled && poe.reminderDate && (
        <div className="text-[10px] text-muted-foreground mb-3">
          <span className="font-medium">Reminder:</span> {formatDate(poe.reminderDate)} ({poe.reminderLeadDays || 60} days before)
        </div>
      )}

      <div className="text-xs mb-3">
        <span className="text-muted-foreground">Notes</span>
        <div className="text-foreground mt-0.5">{poe.notes || '—'}</div>
      </div>

      {poe.report && poe.status === 'done' && (
        <div className="border-t border-border pt-3 mt-3">
          <h4 className="text-xs font-semibold text-foreground mb-2">📊 Engagement report</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {poe.report.actualTime && <div><span className="text-muted-foreground">Time:</span> {poe.report.actualTime}</div>}
            {poe.report.leadersInvolved && <div><span className="text-muted-foreground">Leaders:</span> {poe.report.leadersInvolved}</div>}
            {poe.report.candidateCount != null && <div><span className="text-muted-foreground">Candidates:</span> {poe.report.candidateCount}</div>}
            {poe.report.reach && <div><span className="text-muted-foreground">Reach:</span> {poe.report.reach}</div>}
            {poe.report.driveLink && <div><span className="text-muted-foreground">Drive:</span> <a href={poe.report.driveLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{poe.report.driveLink}</a></div>}
          </div>
          {poe.report.summary && <div className="text-xs mt-2"><span className="text-muted-foreground">Summary:</span> {poe.report.summary}</div>}
        </div>
      )}

      {poe.status === 'not_done' && poe.notDoneReason && (
        <div className="border-t border-border pt-3 mt-3">
          <h4 className="text-xs font-semibold text-foreground mb-1">Reason not done</h4>
          <p className="text-xs text-foreground">{poe.notDoneReason}</p>
          {poe.notDoneNextAction && <p className="text-xs text-muted-foreground mt-1">Next action: {poe.notDoneNextAction}</p>}
        </div>
      )}
    </div>
  );
}
