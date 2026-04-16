import { useState, useEffect } from 'react';
import { College, STREAM_TIERS } from '@/types/campus';

interface CollegeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<College, 'id' | 'poes' | 'nirf'>) => void;
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
    onSave({ name: name.trim(), stream, tier, website: website.trim(), timeline: '', notes: notes.trim() });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[1000] flex items-start justify-center pt-[60px] px-5 pb-5 overflow-y-auto" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-surface rounded-lg border border-border w-full max-w-[580px] shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
        <div className="flex items-center justify-between px-[18px] py-[14px] border-b border-border">
          <div className="text-sm font-semibold">{college ? 'Edit college' : 'Add college'}</div>
          <button onClick={onClose} className="bg-transparent border-none text-xl text-muted-foreground cursor-pointer hover:text-foreground leading-none">&times;</button>
        </div>
        <div className="p-[18px]">
          <div className="mb-3"><label className="text-[11px] font-semibold text-muted-foreground block mb-1">College name *</label><input value={name} onChange={e => setName(e.target.value)} className="w-full py-[7px] px-[10px] border border-border rounded-sm text-xs bg-surface text-foreground outline-none focus:border-primary-mid" placeholder="e.g. IIT Bombay" /></div>
          <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
            <div><label className="text-[11px] font-semibold text-muted-foreground block mb-1">Stream</label>
              <select value={stream} onChange={e => setStream(e.target.value)} className="w-full py-[7px] px-[10px] border border-border rounded-sm text-xs bg-surface text-foreground outline-none focus:border-primary-mid cursor-pointer">
                <option>Engineering</option><option>Management</option>
              </select>
            </div>
            <div><label className="text-[11px] font-semibold text-muted-foreground block mb-1">Tier</label>
              <select value={tier} onChange={e => setTier(e.target.value)} className="w-full py-[7px] px-[10px] border border-border rounded-sm text-xs bg-surface text-foreground outline-none focus:border-primary-mid cursor-pointer">
                {tiers.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-3"><label className="text-[11px] font-semibold text-muted-foreground block mb-1">Official website</label><input value={website} onChange={e => setWebsite(e.target.value)} className="w-full py-[7px] px-[10px] border border-border rounded-sm text-xs bg-surface text-foreground outline-none focus:border-primary-mid" placeholder="https://placements.iitb.ac.in" /></div>


          <div className="mb-3"><label className="text-[11px] font-semibold text-muted-foreground block mb-1">Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full py-[7px] px-[10px] border border-border rounded-sm text-xs bg-surface text-foreground outline-none focus:border-primary-mid resize-y" placeholder="Key contacts, strategy, engagement history..." /></div>
        </div>
        <div className="flex justify-end gap-2 px-[18px] py-3 border-t border-border">
          <button onClick={onClose} className="px-[14px] py-[7px] rounded-sm text-xs font-medium border border-border bg-surface text-foreground hover:bg-background">Cancel</button>
          <button onClick={handleSave} className="px-[14px] py-[7px] rounded-sm text-xs font-medium bg-primary text-primary-foreground border border-primary hover:bg-primary-dark">Save college</button>
        </div>
      </div>
    </div>
  );
}
