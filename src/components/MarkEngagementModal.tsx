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
  const [candidateCount, setCandidateCount] = useState<string | number>('');
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
    <div className="fixed inset-0 bg-foreground/40 z-50 flex items-center justify-center p-4">
      <div onClick={(e) => { if (e.target === e.currentTarget) { onClose(); resetForm(); } }} className="w-full h-full flex items-center justify-center">
        <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Mark engagement</h2>
            <button onClick={() => { onClose(); resetForm(); }} className="bg-transparent border-none text-xl text-muted-foreground cursor-pointer hover:text-foreground">×</button>
          </div>

          {step === 'choose' && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-muted-foreground">How would you like to mark <strong>{poe.eventDetail || 'this engagement'}</strong>?</p>
              <button onClick={() => setStep('done_report')} className="w-full py-3 rounded-xl text-sm font-semibold text-primary-foreground border-none cursor-pointer hover:opacity-90" style={{ background: 'hsl(142 71% 45%)' }}>✓ Done</button>
              <button onClick={() => setStep('not_done_reason')} className="w-full py-3 rounded-xl text-sm font-semibold text-primary-foreground border-none cursor-pointer hover:opacity-90" style={{ background: 'hsl(0 84% 60%)' }}>✗ Not Done</button>
              <button onClick={() => setStep('reschedule')} className="w-full py-3 rounded-xl text-sm font-semibold text-foreground border-none cursor-pointer hover:opacity-90" style={{ background: 'hsl(45 93% 47%)' }}>↻ Rescheduled</button>
            </div>
          )}

          {step === 'done_report' && (
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-foreground">Engagement report</h3>
              <div><label className="text-[11px] text-muted-foreground">Actual time</label><input value={actualTime} onChange={e => setActualTime(e.target.value)} className={inputCls} placeholder="e.g. 2 hours" /></div>
              <div><label className="text-[11px] text-muted-foreground">Leaders involved</label><input value={leadersInvolved} onChange={e => setLeadersInvolved(e.target.value)} className={inputCls} placeholder="Names" /></div>
              <div><label className="text-[11px] text-muted-foreground">Candidate count</label><input type="number" value={candidateCount} onChange={e => setCandidateCount(e.target.value ? Number(e.target.value) : '')} className={inputCls} placeholder="0" /></div>
              <div><label className="text-[11px] text-muted-foreground">Reach</label><input value={reach} onChange={e => setReach(e.target.value)} className={inputCls} placeholder="e.g. 500 students" /></div>
              <div><label className="text-[11px] text-muted-foreground">Google Drive link</label><input value={driveLink} onChange={e => setDriveLink(e.target.value)} className={inputCls} placeholder="https://drive.google.com/..." /></div>
              <div><label className="text-[11px] text-muted-foreground">Summary</label><textarea value={summary} onChange={e => setSummary(e.target.value)} className={inputCls + ' min-h-[60px] resize-y'} placeholder="Brief summary..." /></div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => setStep('choose')} className="px-4 py-2 rounded-xl text-xs font-medium border border-border bg-surface text-foreground cursor-pointer">Back</button>
                <button onClick={handleDone} className="px-4 py-2 rounded-xl text-xs font-medium text-primary-foreground border-none cursor-pointer" style={{ background: 'hsl(142 71% 45%)' }}>Save report</button>
              </div>
            </div>
          )}

          {step === 'not_done_reason' && (
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-foreground">Why was it not done?</h3>
              <div><label className="text-[11px] text-muted-foreground">Reason</label><textarea value={reason} onChange={e => setReason(e.target.value)} className={inputCls + ' min-h-[60px] resize-y'} placeholder="Explain why..." /></div>
              <div><label className="text-[11px] text-muted-foreground">Next action</label><input value={nextAction} onChange={e => setNextAction(e.target.value)} className={inputCls} placeholder="What should happen next?" /></div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => setStep('choose')} className="px-4 py-2 rounded-xl text-xs font-medium border border-border bg-surface text-foreground cursor-pointer">Back</button>
                <button onClick={handleNotDone} className="px-4 py-2 rounded-xl text-xs font-medium text-primary-foreground border-none cursor-pointer" style={{ background: 'hsl(0 84% 60%)' }}>Save</button>
              </div>
            </div>
          )}

          {step === 'reschedule' && (
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-foreground">Reschedule engagement</h3>
              <div><label className="text-[11px] text-muted-foreground">New start date *</label><input type="date" value={newStartDate} onChange={e => setNewStartDate(e.target.value)} className={inputCls} /></div>
              <div><label className="text-[11px] text-muted-foreground">New end date</label><input type="date" value={newEndDate} onChange={e => setNewEndDate(e.target.value)} className={inputCls} min={newStartDate} /></div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => setStep('choose')} className="px-4 py-2 rounded-xl text-xs font-medium border border-border bg-surface text-foreground cursor-pointer">Back</button>
                <button onClick={handleReschedule} className="px-4 py-2 rounded-xl text-xs font-medium text-foreground border-none cursor-pointer" style={{ background: 'hsl(45 93% 47%)' }}>Reschedule</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
