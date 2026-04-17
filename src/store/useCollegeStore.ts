import { useState, useCallback, useEffect, useRef } from 'react';
import { College, POE, uid, migratePOE } from '@/types/campus';
import { fetchColleges, saveColleges } from '@/lib/appScript';

// ── INITIAL SEED DATA ────────────────────────────────────────────────────────
// Used only on first load if the sheet is empty.
const INITIAL_DATA: College[] = [
  {
    id: "xooo2on8mnpmmp2m",
    name: "IIT Hyderabad",
    stream: "Engineering",
    tier: "Premier",
    website: "https://www.iith.ac.in",
    timeline: "",
    nirf: null,
    notes: "",
    poes: [
      { id: "xf0k7cbomnpo9ct3", type: "annual_fest", customType: "", eventDetail: "Elan & Vision- Tech+Cultural Fest", date: "2026-01-01", endDate: "2026-01-03", link: "https://elan.org.in/", pocName: "Sponsorship Head", pocEmail: "ELAN.NVISION.SPONSORSHIP@SA.IITH.AC.IN", pocPhone: "+91 88320 28101", notes: "Have send the brochure. 25000+ attendees.", status: "planned", reminderEnabled: true, reminderDate: "2025-11-02", reminderLeadDays: 60, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ]
  },
];

// ── MIGRATION ────────────────────────────────────────────────────────────────
function migrateData(colleges: College[]): College[] {
  return colleges.map(c => ({ ...c, poes:( c.poes || []).map(migratePOE) }));
}

// ── STORE ────────────────────────────────────────────────────────────────────
export function useCollegeStore() {
  const [db, setDb]           = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Track whether we're mid-save to avoid overwriting with stale poll data
  const isSaving = useRef(false);

  const [expandedRow, setExpandedRow]               = useState<string | null>(null);
  const [selectedPoe, setSelectedPoe]               = useState<{ cid: string; pid: string } | null>(null);
  const [pendingDeleteCollege, setPendingDeleteCollege] = useState<string | null>(null);
  const [pendingDeletePoe, setPendingDeletePoe]     = useState<{ cid: string; pid: string } | null>(null);
  const [toastMsg, setToastMsg]                     = useState('');

  // ── LOAD + POLL ────────────────────────────────────────────────────────────
  // Fetches data on mount, then polls every 30 seconds so teammates'
  // changes appear without a page refresh.
  
  const loadData = useCallback(async () => {
    if (isSaving.current) return; // don't overwrite mid-save
    try {
      const colleges = await fetchColleges();
      if (colleges.length === 0 && db.length === 0) {
        // First-time setup: seed initial data
        await saveColleges(INITIAL_DATA);
        setDb(JSON.parse(JSON.stringify(INITIAL_DATA)));
      } else {
        setDb(migrateData(colleges));
      }
      setSyncError(null);
    } catch (err) {
      setSyncError('Could not reach the database. Check your connection.');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [db.length]);

  useEffect(() => {
    loadData();                                  // initial load
    const interval = setInterval(loadData, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── PERSIST ────────────────────────────────────────────────────────────────
  // Updates local state immediately (feels instant for the user),
  // then writes to Google Sheets in the background.

  const persist = useCallback(async (newDb: College[]) => {
    isSaving.current = true;
    setDb(newDb);
    try {
      await saveColleges(newDb);
      setSyncError(null);
    } catch (err) {
      setSyncError('Save failed. Changes may not have synced.');
      console.error('Save error:', err);
    } finally {
      // Allow polls again after a short buffer
      setTimeout(() => { isSaving.current = false; }, 5000);
    }
  }, []);

  // ── TOAST ──────────────────────────────────────────────────────────────────
  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  }, []);

  // ── UI STATE ───────────────────────────────────────────────────────────────
  const toggleRow = useCallback((cid: string) => {
    setExpandedRow(prev => prev === cid ? null : cid);
    setSelectedPoe(prev => prev && prev.cid !== cid ? null : prev);
    setPendingDeleteCollege(null);
  }, []);

  const selectPOE = useCallback((cid: string, pid: string) => {
    setSelectedPoe(prev => {
      if (prev && prev.cid === cid && prev.pid === pid) return null;
      return { cid, pid };
    });
    setExpandedRow(cid);
    setPendingDeletePoe(null);
  }, []);

  // ── COLLEGE CRUD ───────────────────────────────────────────────────────────
  const addCollege = useCallback((data: Omit<College, 'id' | 'poes'>) => {
    const newDb = [...db, { id: uid(), ...data, poes: [] }];
    persist(newDb);
    toast('College added');
  }, [db, persist, toast]);

  const updateCollege = useCallback((id: string, data: Partial<College>) => {
    const newDb = db.map(c => c.id === id ? { ...c, ...data } : c);
    persist(newDb);
    toast('College updated');
  }, [db, persist, toast]);

  const deleteCollege = useCallback((cid: string) => {
    persist(db.filter(c => c.id !== cid));
    if (expandedRow === cid) setExpandedRow(null);
    if (selectedPoe?.cid === cid) setSelectedPoe(null);
    setPendingDeleteCollege(null);
    toast('College deleted');
  }, [db, expandedRow, selectedPoe, persist, toast]);

  // ── POE CRUD ───────────────────────────────────────────────────────────────
  const addPOE = useCallback((cid: string, data: Omit<POE, 'id'>) => {
    const newPoe = { id: uid(), ...data };
    const newDb = db.map(c => c.id === cid ? { ...c, poes: [...c.poes, newPoe] } : c);
    persist(newDb);
    setSelectedPoe({ cid, pid: newPoe.id });
    setExpandedRow(cid);
    toast('Engagement added');
  }, [db, persist, toast]);

  const updatePOE = useCallback((cid: string, pid: string, data: Partial<POE>) => {
    const newDb = db.map(c =>
      c.id === cid
        ? { ...c, poes: c.poes.map(p => p.id === pid ? { ...p, ...data, updatedAt: new Date().toISOString() } : p) }
        : c
    );
    persist(newDb);
    toast('Engagement updated');
  }, [db, persist, toast]);

  const deletePOE = useCallback((cid: string, pid: string) => {
    const newDb = db.map(c => c.id === cid ? { ...c, poes: c.poes.filter(p => p.id !== pid) } : c);
    persist(newDb);
    if (selectedPoe?.pid === pid) setSelectedPoe(null);
    setPendingDeletePoe(null);
    toast('Engagement deleted');
  }, [db, selectedPoe, persist, toast]);

  // ── IMPORT ─────────────────────────────────────────────────────────────────
  const importData = useCallback((colleges: College[]) => {
    persist(migrateData(colleges));
    setExpandedRow(null);
    setSelectedPoe(null);
    toast(`Imported ${colleges.length} colleges successfully`);
  }, [persist, toast]);

  // ── RETURN ─────────────────────────────────────────────────────────────────
  return {
    db, isLoading, syncError,
    expandedRow, selectedPoe, pendingDeleteCollege, pendingDeletePoe, toastMsg,
    toggleRow, selectPOE,
    addCollege, updateCollege, deleteCollege,
    addPOE, updatePOE, deletePOE,
    importData,
    setPendingDeleteCollege, setPendingDeletePoe, toast,
  };
}