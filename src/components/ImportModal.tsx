import { useRef, useState, useCallback } from 'react';
import { College } from '@/types/campus';

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (colleges: College[]) => void;
}

export default function ImportModal({ open, onClose, onImport }: ImportModalProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        const colleges = parsed.colleges || parsed;
        if (!Array.isArray(colleges)) throw new Error('Invalid format');
        onImport(colleges);
        onClose();
      } catch {
        alert('Could not read the file. Make sure it is a valid CampusConnect backup (.json).');
      }
    };
    reader.readAsText(file);
  }, [onImport, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[1000] flex items-start justify-center pt-[60px] px-5 pb-5 overflow-y-auto" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-surface rounded-lg border border-border w-full max-w-[580px] shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
        <div className="flex items-center justify-between px-[18px] py-[14px] border-b border-border">
          <div className="text-sm font-semibold">Import backup</div>
          <button onClick={onClose} className="bg-transparent border-none text-xl text-muted-foreground cursor-pointer hover:text-foreground leading-none">&times;</button>
        </div>
        <div className="p-[18px]">
          <div
            className={`border-2 border-dashed rounded-sm p-6 text-center cursor-pointer transition-colors mb-[10px] ${over ? 'border-primary bg-primary-light' : 'border-border hover:border-primary-mid'}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setOver(true); }}
            onDragLeave={() => setOver(false)}
            onDrop={e => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          >
            <div className="text-[13px] font-medium mb-1">Click to choose file, or drag and drop</div>
            <div className="text-xs text-muted-foreground">Select a .json backup file exported from this app</div>
          </div>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          <div className="text-xs text-muted-foreground">Warning: importing will replace all your current data with the data in the file.</div>
        </div>
        <div className="flex justify-end gap-2 px-[18px] py-3 border-t border-border">
          <button onClick={onClose} className="px-[14px] py-[7px] rounded-sm text-xs font-medium border border-border bg-surface text-foreground hover:bg-background">Cancel</button>
        </div>
      </div>
    </div>
  );
}
