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
      <div className="sticky top-0 z-[100] h-[52px] flex items-center px-6 gap-3 bg-gradient-to-r from-primary via-primary-mid to-primary shadow-[0_2px_12px_rgba(83,74,183,0.25)]">
        <div className="w-[30px] h-[30px] bg-primary-foreground rounded-xl flex items-center justify-center">
          <div className="w-4 h-4 bg-primary rounded-md" />
        </div>
        <span className="text-primary-foreground text-[15px] font-semibold tracking-tight">CampusConnect</span>
        <div className="ml-auto hidden sm:flex gap-2 items-center">
          <button onClick={onExportJSON} className="bg-white/15 text-primary-foreground border border-white/25 rounded-xl px-3.5 py-[6px] text-xs cursor-pointer transition-colors hover:bg-white/25 backdrop-blur-sm">Export backup</button>
          <button onClick={onImport} className="bg-white/15 text-primary-foreground border border-white/25 rounded-xl px-3.5 py-[6px] text-xs cursor-pointer transition-colors hover:bg-white/25 backdrop-blur-sm">Import backup</button>
          <button onClick={onExportCSV} className="bg-white/15 text-primary-foreground border border-white/25 rounded-xl px-3.5 py-[6px] text-xs cursor-pointer transition-colors hover:bg-white/25 backdrop-blur-sm">Export Excel</button>
        </div>
        <button className="sm:hidden ml-auto bg-white/15 text-primary-foreground border border-white/25 rounded-xl px-[10px] py-[6px] text-lg leading-none cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>&#8942;</button>
      </div>
      {menuOpen && (
        <div className="sm:hidden absolute top-[52px] right-0 left-0 bg-primary-dark z-[99] p-2 px-4 flex flex-col gap-[6px]">
          <button onClick={() => { onExportJSON(); setMenuOpen(false); }} className="bg-white/15 text-primary-foreground border border-white/25 rounded-xl px-3 py-2 text-xs text-left w-full cursor-pointer hover:bg-white/25">Export backup</button>
          <button onClick={() => { onImport(); setMenuOpen(false); }} className="bg-white/15 text-primary-foreground border border-white/25 rounded-xl px-3 py-2 text-xs text-left w-full cursor-pointer hover:bg-white/25">Import backup</button>
          <button onClick={() => { onExportCSV(); setMenuOpen(false); }} className="bg-white/15 text-primary-foreground border border-white/25 rounded-xl px-3 py-2 text-xs text-left w-full cursor-pointer hover:bg-white/25">Export Excel</button>
        </div>
      )}
    </>
  );
}
