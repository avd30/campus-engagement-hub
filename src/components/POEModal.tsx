import { useState, useEffect } from 'react';
import { POE, POE_TYPE_OPTIONS, computeReminderDate } from '@/types/campus';

interface POEModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<POE, 'id'>) => void;
  poe?: POE | null;
}

export default function POEModal({ open, onClose, onSave, poe }: POEModalProps) {
  const [type, setType] = useState('placement_committee');
  const [customType, setCustomType] = useState('');
  const [eventDetail, setEventDetail] = useState('');
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [link, setLink] = useState('');
  const [pocName, setPocName] = useState('');
  const [pocEmail, setPocEmail] = useState('');
  const [pocPhone, setPocPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderLeadDays, setReminderLeadDays] = useState(60);

  useEffect(() => {
    if (poe) {
      setType(poe.type); setCustomType(poe.customType || '');
      setEventDetail(poe.eventDetail || ''); setDate(poe.date || '');
      setEndDate(poe.endDate || '');
      setLink(poe.link || ''); setPocName(poe.pocName || '');
      setPocEmail(poe.pocEmail || ''); setPocPhone(poe.pocPhone || '');
      setNotes(poe.notes || '');
      setAssignedTo(poe.assignedTo || '');
      setReminderEnabled(poe.reminderEnabled ?? true);
      setReminderLeadDays(poe.reminderLeadDays || 60);
    } else {
      setType('placement_committee'); setCustomType('');
      setEventDetail(''); setDate(''); setEndDate(''); setLink('');
      setPocName(''); setPocEmail(''); setPocPhone(''); setNotes('');
      setAssignedTo(''); setReminderEnabled(true); setReminderLeadDays(60);
    }
  }, [poe, open]);

  if (!open) return null;

  const handleSave = () => {
    if (type === 'others' && !customType.trim()) { alert('Please name this engagement type.'); return; }
    const now = new Date().toISOString();
    onSave({
      type, customType: type === 'others' ? customType.trim() : '',
      eventDetail: eventDetail.trim(), date, endDate: endDate || '',
      link: link.trim(),
      pocName: pocName.trim(), pocEmail: pocEmail.trim(),
      pocPhone: pocPhone.trim(), notes: notes.trim(),
      status: poe?.status || 'planned',
      assignedTo: assignedTo.trim(),
      reminderEnabled,
      reminderLeadDays,
      reminderDate: reminderEnabled && date ? computeReminderDate(date, reminderLeadDays) : '',
      report: poe?.report,
      notDoneReason: poe?.notDoneReason,
      notDoneNextAction: poe?.notDoneNextAction,
      createdAt: poe?.createdAt || now,
      updatedAt: now,
    });
    onClose();
  };

  const inputCls = "w-full py-[7px] px-[10px] border border-border rounded-md text-xs bg-surface text-foreground outline-none focus:border-primary-mid focus:ring-1 focus:ring-primary/20";

  return (
    <div className="fixed inset-0 bg-foreground/40 z-50 flex items-center justify-center p-4">
      <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} className="w-full h-full flex items-center justify-center">
        <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">{poe ? 'Edit engagement' : 'Add engagement'}</h2>
            <button onClick={onClose} className="bg-transparent border-none text-xl text-muted-foreground cursor-pointer hover:text-foreground">×</button>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Type of engagement *</label>
              <select value={type} onChange={e => setType(e.target.value)} className={inputCls + ' cursor-pointer'}>
                {POE_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            {type === 'others' && (
              <div>
                <label className="text-[11px] text-muted-foreground font-medium">Name this engagement type *</label>
                <input value={customType} onChange={e => setCustomType(e.target.value)} className={inputCls} placeholder="e.g. Industry Visit, Workshop..." />
              </div>
            )}
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Event / engagement detail</label>
              <input value={eventDetail} onChange={e => setEventDetail(e.target.value)} className={inputCls} placeholder="e.g. BTech final placement drive 2024-25" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground font-medium">Start date *</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-medium">End date (optional)</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputCls} min={date} />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Website / event link</label>
              <input value={link} onChange={e => setLink(e.target.value)} className={inputCls} placeholder="https://..." />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Assigned to</label>
              <input value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className={inputCls} placeholder="Person responsible" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium block mb-1">Reminder settings</label>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={reminderEnabled} onChange={e => setReminderEnabled(e.target.checked)} className="accent-primary" />
                <span className="text-xs text-foreground">Enable reminder</span>
              </div>
              {reminderEnabled && (
                <select value={reminderLeadDays} onChange={e => setReminderLeadDays(Number(e.target.value))} className="mt-1 py-1 px-2 border border-border rounded-md text-xs bg-surface cursor-pointer">
                  <option value={30}>30 days before</option>
                  <option value={45}>45 days before</option>
                  <option value={60}>60 days before</option>
                  <option value={90}>90 days before</option>
                </select>
              )}
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium block mb-1">Point of contact</label>
              <div className="flex flex-col gap-2">
                <input value={pocName} onChange={e => setPocName(e.target.value)} className={inputCls} placeholder="Full name" />
                <input value={pocEmail} onChange={e => setPocEmail(e.target.value)} className={inputCls} placeholder="tpo@college.ac.in" />
                <input value={pocPhone} onChange={e => setPocPhone(e.target.value)} className={inputCls} placeholder="+91 ..." />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} className={inputCls + ' min-h-[60px] resize-y'} placeholder="Any additional details..." />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium border border-border bg-surface text-foreground hover:bg-background cursor-pointer">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 rounded-xl text-xs font-medium bg-primary text-primary-foreground border border-primary hover:bg-primary-dark cursor-pointer">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
