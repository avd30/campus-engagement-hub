import { useState, useEffect } from 'react';
import { College, STREAM_TIERS } from '@/types/campus';

interface CollegeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<College, 'id' | 'poes'>) => void;
  college?: College | null;
}

export default function CollegeModal({ open, onClose, onSave, college }: CollegeModalProps) {
  const [name, setName] = useState('');
  const [stream, setStream] = useState('Engineering');
  const [tier, setTier] = useState('Premier');
  const [website, setWebsite] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (college) {
      setName(college.name);
      setStream(college.stream);
      setTier(college.tier);
      setWebsite(college.website || '');
      setNotes(college.notes || '');
    } else {
      setName(''); setStream('Engineering'); setTier('Premier');
      setWebsite(''); setNotes('');
    }
  }, [college, open]);

  useEffect(() => {
    const tiers = STREAM_TIERS[stream] || ['Premier', 'Tier 1'];
    if (!tiers.includes(tier)) setTier(tiers[0]);
  }, [stream]);

  if (!open) return null;

  const tiers = STREAM_TIERS[stream] || ['Premier', 'Tier 1'];

  const handleSave = () => {
    if (!name.trim()) { alert('College name is required.'); return; }
    onSave({ name: name.trim(), stream, tier, website: website.trim(), timeline: '', nirf: null, notes: notes.trim() });
    onClose();
  };

  const inputCls = "w-full py-[7px] px-[10px] border border-border rounded-sm text-xs bg-surface text-foreground outline-none focus:border-primary-mid";

  return (
    <div className="fixed inset-0 bg-foreground/40 z-50 flex items-center justify-center p-4">
      <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} className="w-full h-full flex items-center justify-center">
        <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">{college ? 'Edit college' : 'Add college'}</h2>
            <button onClick={onClose} className="bg-transparent border-none text-xl text-muted-foreground cursor-pointer hover:text-foreground">×</button>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">College name *</label>
              <input value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="e.g. IIT Bombay" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Stream</label>
              <select value={stream} onChange={e => setStream(e.target.value)} className={inputCls + ' cursor-pointer'}>
                <option>Engineering</option>
                <option>Management</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Tier</label>
              <select value={tier} onChange={e => setTier(e.target.value)} className={inputCls + ' cursor-pointer'}>
                {tiers.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Official website</label>
              <input value={website} onChange={e => setWebsite(e.target.value)} className={inputCls} placeholder="https://placements.iitb.ac.in" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} className={inputCls + ' min-h-[60px] resize-y'} placeholder="Additional notes..." />
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
