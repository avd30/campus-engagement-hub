import { useState } from 'react';

interface TopBarProps {
  onExportJSON: () => void;
  onImport: () => void;
  onExportCSV: () => void;
}

export default function TopBar({ onExportJSON, onImport, onExportCSV }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="bg-primary text-primary-foreground px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="font-bold text-base tracking-tight">CampusConnect</div>
        <div className="hidden sm:flex gap-2">
          <button onClick={onExportJSON} className="bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/25 rounded-xl px-3 py-1.5 text-xs cursor-pointer hover:bg-primary-foreground/25">Export backup</button>
          <button onClick={onImport} className="bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/25 rounded-xl px-3 py-1.5 text-xs cursor-pointer hover:bg-primary-foreground/25">Import backup</button>
          <button onClick={onExportCSV} className="bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/25 rounded-xl px-3 py-1.5 text-xs cursor-pointer hover:bg-primary-foreground/25">Export Excel</button>
        </div>
        <button className="sm:hidden bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/25 rounded-xl px-2.5 py-1 text-base cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>⋮</button>
      </div>
      {menuOpen && (
        <div className="sm:hidden bg-primary px-4 pb-3 flex flex-col gap-2">
          <button onClick={() => { onExportJSON(); setMenuOpen(false); }} className="bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/25 rounded-xl px-3 py-2 text-xs text-left w-full cursor-pointer hover:bg-primary-foreground/25">Export backup</button>
          <button onClick={() => { onImport(); setMenuOpen(false); }} className="bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/25 rounded-xl px-3 py-2 text-xs text-left w-full cursor-pointer hover:bg-primary-foreground/25">Import backup</button>
          <button onClick={() => { onExportCSV(); setMenuOpen(false); }} className="bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/25 rounded-xl px-3 py-2 text-xs text-left w-full cursor-pointer hover:bg-primary-foreground/25">Export Excel</button>
        </div>
      )}
    </>
  );
}
