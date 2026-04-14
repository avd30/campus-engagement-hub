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
    <div className="fixed inset-0 bg-foreground/40 z-50 flex items-center justify-center p-4">
      <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} className="w-full h-full flex items-center justify-center">
        <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Import backup</h2>
            <button onClick={onClose} className="bg-transparent border-none text-xl text-muted-foreground cursor-pointer hover:text-foreground">×</button>
          </div>
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${over ? 'border-primary bg-primary-light' : 'border-border hover:border-primary-mid'}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setOver(true); }}
            onDragLeave={() => setOver(false)}
            onDrop={e => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          >
            <div className="text-3xl mb-2">📁</div>
            <div className="text-xs font-medium text-foreground">Click to choose file, or drag and drop</div>
            <div className="text-[10px] text-muted-foreground mt-1">Select a .json backup file exported from this app</div>
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>
          <p className="text-[10px] text-destructive mt-3">Warning: importing will replace all your current data with the data in the file.</p>
          <div className="flex justify-end mt-4">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium border border-border bg-surface text-foreground hover:bg-background cursor-pointer">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
