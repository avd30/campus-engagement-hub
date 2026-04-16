import { useState } from 'react';
import { POE, POEReport, EngagementStatus, computeReminderDate } from '@/types/campus';

interface MarkEngagementModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<POE>) => void;
  poe: POE | null;
}

type MarkStep = 'choose' | 'done_report' | 'not_done_reason' | 'reschedule';

export default function MarkEngagementModal({ open, onClose, onSave, poe }: MarkEngagementModalProps) {
  const [step, setStep] = useState<MarkStep>('choose');
  const [actualTime, setActualTime] = useState('');
  const [leadersInvolved, setLeadersInvolved] = useState('');
  const [candidateCount, setCandidateCount] = useState<number | ''>('');
  const [reach, setReach] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [summary, setSummary] = useState('');
  const [reason, setReason] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');

  if (!open || !poe) return null;

  const inputCls = "w-full py-[7px] px-[10px] border border-border rounded-md text-xs bg-surface text-foreground outline-none focus:border-primary-mid";

  const handleDone = () => {
    const report: POEReport = {
      actualTime: actualTime.trim(),
      leadersInvolved: leadersInvolved.trim(),
      candidateCount: candidateCount ? Number(candidateCount) : undefined,
      reach: reach.trim(),
      driveLink: driveLink.trim(),
      summary: summary.trim(),
    };
    onSave({ status: 'done' as EngagementStatus, report, updatedAt: new Date().toISOString() });
    onClose();
    resetForm();
  };

  const handleNotDone = () => {
    onSave({ status: 'not_done' as EngagementStatus, notDoneReason: reason.trim(), notDoneNextAction: nextAction.trim(), updatedAt: new Date().toISOString() });
    onClose();
    resetForm();
  };

  const handleReschedule = () => {
    if (!newStartDate) { alert('Please enter new start date'); return; }
    onSave({
      status: 'rescheduled' as EngagementStatus,
      date: newStartDate,
      endDate: newEndDate || '',
      reminderDate: poe.reminderEnabled ? computeReminderDate(newStartDate, poe.reminderLeadDays || 60) : '',
      updatedAt: new Date().toISOString(),
    });
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setStep('choose');
    setActualTime(''); setLeadersInvolved(''); setCandidateCount('');
    setReach(''); setDriveLink(''); setSummary('');
    setReason(''); setNextAction('');
    setNewStartDate(''); setNewEndDate('');
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[1000] flex items-start justify-center pt-[60px] px-5 pb-5 overflow-y-auto" onClick={e => { if (e.target === e.currentTarget) { onClose(); resetForm(); } }}>
      <div className="bg-surface rounded-2xl border border-border w-full max-w-[520px] shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="text-sm font-semibold">Mark engagement</div>
          <button onClick={() => { onClose(); resetForm(); }} className="bg-transparent border-none text-xl text-muted-foreground cursor-pointer hover:text-foreground">&times;</button>
        </div>
        <div className="p-5">
          {step === 'choose' && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-muted-foreground mb-1">How would you like to mark <strong>{poe.eventDetail || 'this engagement'}</strong>?</p>
              <button onClick={() => setStep('done_report')} className="w-full py-3 rounded-xl text-sm font-semibold bg-[hsl(142_71%_45%)] text-white border-none cursor-pointer hover:opacity-90">✓ Done</button>
              <button onClick={() => setStep('not_done_reason')} className="w-full py-3 rounded-xl text-sm font-semibold bg-[hsl(0_84%_60%)] text-white border-none cursor-pointer hover:opacity-90">✗ Not Done</button>
              <button onClick={() => setStep('reschedule')} className="w-full py-3 rounded-xl text-sm font-semibold bg-[hsl(45_93%_47%)] text-black border-none cursor-pointer hover:opacity-90">↻ Rescheduled</button>
            </div>
          )}

          {step === 'done_report' && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Engagement report</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div><label className="text-[11px] text-muted-foreground block mb-1">Actual time</label><input value={actualTime} onChange={e => setActualTime(e.target.value)} className={inputCls} placeholder="e.g. 2 hours" /></div>
                <div><label className="text-[11px] text-muted-foreground block mb-1">Leaders involved</label><input value={leadersInvolved} onChange={e => setLeadersInvolved(e.target.value)} className={inputCls} placeholder="Names" /></div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div><label className="text-[11px] text-muted-foreground block mb-1">Candidate count</label><input type="number" value={candidateCount} onChange={e => setCandidateCount(e.target.value ? Number(e.target.value) : '')} className={inputCls} placeholder="0" /></div>
                <div><label className="text-[11px] text-muted-foreground block mb-1">Reach</label><input value={reach} onChange={e => setReach(e.target.value)} className={inputCls} placeholder="e.g. 500 students" /></div>
              </div>
              <div className="mb-2"><label className="text-[11px] text-muted-foreground block mb-1">Google Drive link</label><input value={driveLink} onChange={e => setDriveLink(e.target.value)} className={inputCls} placeholder="https://drive.google.com/..." /></div>
              <div className="mb-3"><label className="text-[11px] text-muted-foreground block mb-1">Summary</label><textarea value={summary} onChange={e => setSummary(e.target.value)} rows={3} className={inputCls + ' resize-y'} placeholder="Brief summary of the engagement..." /></div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setStep('choose')} className="px-4 py-2 rounded-lg text-xs border border-border bg-surface">Back</button>
                <button onClick={handleDone} className="px-4 py-2 rounded-lg text-xs font-medium bg-[hsl(142_71%_45%)] text-white border-none cursor-pointer">Save report & mark done</button>
              </div>
            </div>
          )}

          {step === 'not_done_reason' && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Why was it not done?</p>
              <div className="mb-2"><label className="text-[11px] text-muted-foreground block mb-1">Reason</label><textarea value={reason} onChange={e => setReason(e.target.value)} rows={2} className={inputCls + ' resize-y'} placeholder="Reason for not completing..." /></div>
              <div className="mb-3"><label className="text-[11px] text-muted-foreground block mb-1">Next action (optional)</label><input value={nextAction} onChange={e => setNextAction(e.target.value)} className={inputCls} placeholder="What's the next step?" /></div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setStep('choose')} className="px-4 py-2 rounded-lg text-xs border border-border bg-surface">Back</button>
                <button onClick={handleNotDone} className="px-4 py-2 rounded-lg text-xs font-medium bg-[hsl(0_84%_60%)] text-white border-none cursor-pointer">Mark not done</button>
              </div>
            </div>
          )}

          {step === 'reschedule' && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Reschedule engagement</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div><label className="text-[11px] text-muted-foreground block mb-1">New start date *</label><input type="date" value={newStartDate} onChange={e => setNewStartDate(e.target.value)} className={inputCls} /></div>
                <div><label className="text-[11px] text-muted-foreground block mb-1">New end date</label><input type="date" value={newEndDate} onChange={e => setNewEndDate(e.target.value)} className={inputCls} min={newStartDate} /></div>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setStep('choose')} className="px-4 py-2 rounded-lg text-xs border border-border bg-surface">Back</button>
                <button onClick={handleReschedule} className="px-4 py-2 rounded-lg text-xs font-medium bg-[hsl(45_93%_47%)] text-black border-none cursor-pointer">Reschedule</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
