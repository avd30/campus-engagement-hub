import { useState, useMemo, useCallback, useRef } from 'react';
import * as XLSX from 'xlsx';
import { College, getPOEType, STATUS_COLORS } from '@/types/campus';
import { useCollegeStore } from '@/store/useCollegeStore';
import TopBar from '@/components/TopBar';
import StatsBar from '@/components/StatsBar';
import EngagementCalendar from '@/components/EngagementCalendar';
import RemindersPanel from '@/components/RemindersPanel';
import CollegeTable from '@/components/CollegeTable';
import CollegeModal from '@/components/CollegeModal';
import POEModal from '@/components/POEModal';
import MarkEngagementModal from '@/components/MarkEngagementModal';
import ImportModal from '@/components/ImportModal';
import Toast from '@/components/Toast';

const Index = () => {
  const store = useCollegeStore();
  const [search, setSearch] = useState('');
  const [streamFilter, setStreamFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [collegeModal, setCollegeModal] = useState<{ open: boolean; college: College | null }>({ open: false, college: null });
  const [poeModal, setPoeModal] = useState<{ open: boolean; cid: string; poe: any }>({ open: false, cid: '', poe: null });
  const [markModal, setMarkModal] = useState<{ open: boolean; cid: string; poe: any }>({ open: false, cid: '', poe: null });
  const [importOpen, setImportOpen] = useState(false);
  const [timelineOpenFor, setTimelineOpenFor] = useState<string | null>(null);
  const [prioritizedCollegeId, setPrioritizedCollegeId] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const toggleTimeline = useCallback((cid: string) => {
    setTimelineOpenFor(prev => prev === cid ? null : cid);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const list = store.db.filter(c => {
      if (q && !c.name.toLowerCase().includes(q) && !(c.notes || '').toLowerCase().includes(q)) return false;
      if (streamFilter && c.stream !== streamFilter) return false;
      if (tierFilter && c.tier !== tierFilter) return false;
      if (statusFilter) {
        const hasStatus = c.poes.some(p => p.status === statusFilter);
        if (!hasStatus) return false;
      }
      return true;
    });
    if (prioritizedCollegeId) {
      const idx = list.findIndex(c => c.id === prioritizedCollegeId);
      if (idx > 0) {
        const [item] = list.splice(idx, 1);
        list.unshift(item);
      }
    }
    return list;
  }, [store.db, search, streamFilter, tierFilter, statusFilter, prioritizedCollegeId]);

  const handleCalendarSelect = useCallback((cid: string, pid: string) => {
    setPrioritizedCollegeId(cid);
    store.selectPOE(cid, pid);
    setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [store]);

  const handleMarkEngagement = useCallback((cid: string, pid: string) => {
    const c = store.db.find(x => x.id === cid);
    const p = c?.poes.find(x => x.id === pid);
    if (p) setMarkModal({ open: true, cid, poe: p });
  }, [store.db]);

  const exportJSON = useCallback(() => {
    const cleaned = store.db.map(({ timeline, ...rest }) => rest);
    const data = JSON.stringify({ version: 2, exported: new Date().toISOString(), colleges: cleaned }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campusconnect-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    store.toast('Backup downloaded');
  }, [store]);

  const exportCSV = useCallback(() => {
    const headers = [
      'College', 'Stream', 'Tier', 'Website', 'College Notes',
      'POE Type', 'Custom Type', 'Event Detail',
      'Start Date', 'End Date', 'Status', 'Assigned To',
      'Reminder Enabled', 'Reminder Date',
      'Event Link', 'POC Name', 'POC Email', 'POC Phone', 'POE Notes',
      'Actual Time', 'Leaders Involved', 'Candidate Count', 'Reach', 'Drive Link', 'Summary'
    ];
    const rows: string[][] = [];
    store.db.forEach(c => {
      if (c.poes.length === 0) {
        rows.push([c.name, c.stream, c.tier, c.website || '', c.notes || '', ...Array(20).fill('')]);
      } else {
        c.poes.forEach(p => {
          const t = getPOEType(p);
          const r = p.report || {};
          rows.push([
            c.name, c.stream, c.tier, c.website || '', c.notes || '',
            t.label, p.customType || '', p.eventDetail || '',
            p.date || '', p.endDate || '', p.status || 'planned', p.assignedTo || '',
            p.reminderEnabled ? 'Yes' : 'No', p.reminderDate || '',
            p.link || '', p.pocName || '', p.pocEmail || '', p.pocPhone || '', p.notes || '',
            r.actualTime || '', r.leadersInvolved || '',
            r.candidateCount != null ? String(r.candidateCount) : '',
            r.reach || '', r.driveLink || '', r.summary || ''
          ]);
        });
      }
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    ws['!cols'] = headers.map(() => ({ wch: 18 }));
    XLSX.utils.book_append_sheet(wb, ws, 'Campus Engagements');
    XLSX.writeFile(wb, `campusconnect-${new Date().toISOString().slice(0, 10)}.xlsx`);
    store.toast('Excel file exported');
  }, [store]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar onExportJSON={exportJSON} onImport={() => setImportOpen(true)} onExportCSV={exportCSV} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-foreground">Campus engagement tracker</h1>
            <p className="text-[11px] text-muted-foreground">{store.db.length} college{store.db.length !== 1 ? 's' : ''} tracked · AY 2024-25 · Data synced via Firebase</p>
          </div>
          <button onClick={() => setCollegeModal({ open: true, college: null })} className="px-4 py-2 rounded-xl text-xs font-medium bg-primary text-primary-foreground border border-primary hover:bg-primary-dark shadow-sm cursor-pointer">+ Add college</button>
        </div>

        {/* Desktop: Stats + Reminders (left) | Calendar (right) */}
        <div className="hidden sm:grid sm:grid-cols-[1fr_1fr] gap-4 mb-4">
          <div className="flex flex-col gap-4">
            <StatsBar db={store.db} />
            <RemindersPanel colleges={store.db} onSelectEngagement={handleCalendarSelect} />
          </div>
          <EngagementCalendar colleges={store.db} onSelectCollege={handleCalendarSelect} />
        </div>

        {/* Mobile: stacked */}
        <div className="sm:hidden flex flex-col gap-3 mb-4">
          <div className="grid grid-cols-2 gap-2">
            <StatsBar db={store.db} variant="compact" />
          </div>
          <RemindersPanel colleges={store.db} onSelectEngagement={handleCalendarSelect} />
          <EngagementCalendar colleges={store.db} onSelectCollege={handleCalendarSelect} />
        </div>

        <div ref={tableRef}>
          <CollegeTable
            filtered={filtered}
            total={store.db.length}
            expandedRow={store.expandedRow}
            selectedPoe={store.selectedPoe}
            pendingDeleteCollege={store.pendingDeleteCollege}
            pendingDeletePoe={store.pendingDeletePoe}
            timelineOpenFor={timelineOpenFor}
            search={search}
            streamFilter={streamFilter}
            tierFilter={tierFilter}
            statusFilter={statusFilter}
            onSearchChange={setSearch}
            onStreamChange={setStreamFilter}
            onTierChange={setTierFilter}
            onStatusChange={setStatusFilter}
            onToggleRow={store.toggleRow}
            onSelectPOE={store.selectPOE}
            onAddCollege={() => setCollegeModal({ open: true, college: null })}
            onEditCollege={cid => setCollegeModal({ open: true, college: store.db.find(c => c.id === cid) || null })}
            onAskDeleteCollege={store.setPendingDeleteCollege}
            onConfirmDeleteCollege={store.deleteCollege}
            onCancelDeleteCollege={() => store.setPendingDeleteCollege(null)}
            onAddPOE={cid => { store.toggleRow(cid); setPoeModal({ open: true, cid, poe: null }); }}
            onEditPOE={(cid, pid) => { const c = store.db.find(x => x.id === cid); const p = c?.poes.find(x => x.id === pid); if (p) setPoeModal({ open: true, cid, poe: p }); }}
            onAskDeletePOE={(cid, pid) => store.setPendingDeletePoe({ cid, pid })}
            onConfirmDeletePOE={store.deletePOE}
            onCancelDeletePOE={() => store.setPendingDeletePoe(null)}
            onMarkEngagement={handleMarkEngagement}
            timelineOpenFor={timelineOpenFor}
            onToggleTimeline={toggleTimeline}
            onCloseTimeline={(cid: string) => {
              setTimelineOpenFor(prev => prev === cid ? null : prev);
              if (store.expandedRow === cid) store.toggleRow(cid);
            }}
          />
        </div>
      </div>

      <CollegeModal
        open={collegeModal.open}
        onClose={() => setCollegeModal({ open: false, college: null })}
        onSave={data => {
          if (collegeModal.college) store.updateCollege(collegeModal.college.id, data);
          else store.addCollege({ ...data, nirf: null } as any);
        }}
        college={collegeModal.college}
      />
      <POEModal
        open={poeModal.open}
        onClose={() => setPoeModal({ open: false, cid: '', poe: null })}
        onSave={data => {
          if (poeModal.poe) store.updatePOE(poeModal.cid, poeModal.poe.id, data);
          else store.addPOE(poeModal.cid, data);
        }}
        poe={poeModal.poe}
      />
      <MarkEngagementModal
        open={markModal.open}
        onClose={() => setMarkModal({ open: false, cid: '', poe: null })}
        onSave={data => {
          store.updatePOE(markModal.cid, markModal.poe.id, data);
        }}
        poe={markModal.poe}
      />
      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} onImport={store.importData} />
      <Toast message={store.toastMsg} />
    </div>
  );
};

export default Index;
