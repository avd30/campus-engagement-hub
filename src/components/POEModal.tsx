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
    <div className="fixed inset-0 bg-black/40 z-[1000] flex items-start justify-center pt-[60px] sm:pt-[60px] pt-5 px-[10px] sm:px-5 pb-5 overflow-y-auto" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-surface rounded-2xl border border-border w-full max-w-[620px] shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="text-sm font-semibold">{poe ? 'Edit engagement' : 'Add engagement'}</div>
          <button onClick={onClose} className="bg-transparent border-none text-xl text-muted-foreground cursor-pointer hover:text-foreground leading-none">&times;</button>
        </div>
        <div className="p-5 max-h-[65vh] overflow-y-auto">
          <div className="mb-3">
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Type of engagement *</label>
            <select value={type} onChange={e => setType(e.target.value)} className={inputCls + ' cursor-pointer'}>
              {POE_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          {type === 'others' && (
            <div className="mb-3"><label className="text-[11px] font-semibold text-muted-foreground block mb-1">Name this engagement type *</label><input value={customType} onChange={e => setCustomType(e.target.value)} className={inputCls} placeholder="e.g. Industry Visit, Workshop..." /></div>
          )}
          <div className="mb-3"><label className="text-[11px] font-semibold text-muted-foreground block mb-1">Event / engagement detail</label><input value={eventDetail} onChange={e => setEventDetail(e.target.value)} className={inputCls} placeholder="e.g. BTech final placement drive 2024-25" /></div>

          <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Start date *</label>
              <input type="date" value={date} onChange={e => { const v = e.target.value; setDate(v); if (endDate === date) setEndDate(v); }} className={inputCls} />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1">End date <span className="font-normal text-text-hint">(optional)</span></label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputCls} min={date} disabled={endDate === date && date !== ''} />
              <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer text-[11px] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={!!(date && endDate === date)}
                  onChange={e => {
                    if (e.target.checked && date) setEndDate(date);
                    else setEndDate('');
                  }}
                  className="accent-primary"
                />
                Same as start date (1-day event)
              </label>
            </div>
          </div>

          <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
            <div><label className="text-[11px] font-semibold text-muted-foreground block mb-1">Website / event link</label><input value={link} onChange={e => setLink(e.target.value)} className={inputCls} placeholder="https://..." /></div>
            <div><label className="text-[11px] font-semibold text-muted-foreground block mb-1">Assigned to</label><input value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className={inputCls} placeholder="Person responsible" /></div>
          </div>

          <div className="border-t border-border my-3" />
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Reminder settings</div>
          <div className="mb-3 flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input type="checkbox" checked={reminderEnabled} onChange={e => setReminderEnabled(e.target.checked)} className="accent-primary" />
              Enable reminder
            </label>
            {reminderEnabled && (
              <select value={reminderLeadDays} onChange={e => setReminderLeadDays(Number(e.target.value))} className="py-1 px-2 border border-border rounded-md text-xs bg-surface cursor-pointer">
                <option value={30}>30 days before</option>
                <option value={45}>45 days before</option>
                <option value={60}>60 days before</option>
                <option value={90}>90 days before</option>
              </select>
            )}
          </div>

          <div className="border-t border-border my-3" />
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Point of contact</div>
          <div className="mb-3 grid grid-cols-1 sm:grid-cols-3 gap-[10px]">
            <div><label className="text-[11px] font-semibold text-muted-foreground block mb-1">Name</label><input value={pocName} onChange={e => setPocName(e.target.value)} className={inputCls} placeholder="Full name" /></div>
            <div><label className="text-[11px] font-semibold text-muted-foreground block mb-1">Email</label><input value={pocEmail} onChange={e => setPocEmail(e.target.value)} className={inputCls} placeholder="tpo@college.ac.in" /></div>
            <div><label className="text-[11px] font-semibold text-muted-foreground block mb-1">Phone</label><input value={pocPhone} onChange={e => setPocPhone(e.target.value)} className={inputCls} placeholder="+91 ..." /></div>
          </div>
          <div className="mb-3"><label className="text-[11px] font-semibold text-muted-foreground block mb-1">Notes / action items</label><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className={inputCls + ' resize-y'} placeholder="Key details, deadlines..." /></div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-medium border border-border bg-surface text-foreground hover:bg-background">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg text-xs font-medium bg-primary text-primary-foreground border border-primary hover:bg-primary-dark">Save engagement</button>
        </div>
      </div>
    </div>
  );
}
