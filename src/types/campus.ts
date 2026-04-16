export interface POEReport {
  actualTime?: string;
  leadersInvolved?: string;
  candidateCount?: number;
  reach?: string;
  driveLink?: string;
  summary?: string;
}

export type EngagementStatus = 'planned' | 'done' | 'not_done' | 'rescheduled';

export interface POE {
  id: string;
  type: string;
  customType?: string;
  eventDetail: string;
  date: string; // startDate (kept as 'date' for backward compat)
  endDate?: string;
  link: string;
  pocName: string;
  pocEmail: string;
  pocPhone: string;
  notes: string;
  status: EngagementStatus;
  assignedTo?: string;
  reminderEnabled: boolean;
  reminderDate?: string;
  reminderLeadDays?: number;
  report?: POEReport;
  notDoneReason?: string;
  notDoneNextAction?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface College {
  id: string;
  name: string;
  stream: string;
  tier: string;
  website: string;
  timeline?: string;
  nirf: number | null;
  notes: string;
  poes: POE[];
}

export interface POETypeInfo {
  label: string;
  bg: string;
  tx: string;
}

export const POE_TYPES: Record<string, POETypeInfo> = {
  placement_committee: { label: 'Placement Committee', bg: '#EAF3DE', tx: '#27500A' },
  guest_lecture: { label: 'Guest Lecture', bg: '#EEEDFE', tx: '#3C3489' },
  annual_fest: { label: 'Annual Fest', bg: '#F4C0D1', tx: '#72243E' },
  tech_fest: { label: 'Tech Fest', bg: '#FAEEDA', tx: '#633806' },
  cultural_fest: { label: 'Cultural Fest', bg: '#F5C4B3', tx: '#712B13' },
  hackathon: { label: 'Hackathon', bg: '#D3D1C7', tx: '#444441' },
  case_comp: { label: 'Case Competition', bg: '#9FE1CB', tx: '#085041' },
  fest_sponsor: { label: 'Fest Sponsorship', bg: '#FAC775', tx: '#633806' },
  others: { label: 'Others', bg: '#CECBF6', tx: '#3C3489' },
};

const LEGACY_MAP: Record<string, string> = {
  final_placement: 'placement_committee',
  summer_intern: 'placement_committee',
  ppt: 'placement_committee',
  poe1: 'others',
  poe2: 'others',
};

export function getPOEType(p: POE | string): POETypeInfo {
  if (!p) return { label: 'Unknown', bg: '#e5e3f0', tx: '#6b6b8a' };
  const id = typeof p === 'string' ? p : p.type;
  const customType = typeof p === 'object' ? p.customType : null;
  if (id === 'others' && customType) return { label: customType, bg: '#CECBF6', tx: '#3C3489' };
  const resolvedId = LEGACY_MAP[id] || id;
  return POE_TYPES[resolvedId] || { label: id, bg: '#e5e3f0', tx: '#6b6b8a' };
}

export function formatDate(d: string): string {
  if (!d) return '';
  try {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
}

export function uid(): string {
  return 'x' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

export const POE_TYPE_OPTIONS = [
  { value: 'placement_committee', label: 'Placement Committee' },
  { value: 'guest_lecture', label: 'Guest Lecture' },
  { value: 'annual_fest', label: 'Annual Fest' },
  { value: 'tech_fest', label: 'Tech Fest' },
  { value: 'cultural_fest', label: 'Cultural Fest' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'case_comp', label: 'Case Competition' },
  { value: 'fest_sponsor', label: 'Fest Sponsorship' },
  { value: 'others', label: 'Others' },
];

export const STREAM_TIERS: Record<string, string[]> = {
  Engineering: ['Premier', 'Tier 1'],
  Management: ['IIM', 'Others'],
};

export const STATUS_COLORS: Record<EngagementStatus, { bg: string; tx: string; label: string }> = {
  planned: { bg: 'hsl(217 91% 60%)', tx: '#fff', label: 'Planned' },
  done: { bg: 'hsl(142 71% 45%)', tx: '#fff', label: 'Done' },
  not_done: { bg: 'hsl(0 84% 60%)', tx: '#fff', label: 'Not Done' },
  rescheduled: { bg: 'hsl(45 93% 47%)', tx: '#000', label: 'Rescheduled' },
};

export function computeReminderDate(startDate: string, leadDays: number = 60): string {
  if (!startDate) return '';
  const d = new Date(startDate + 'T00:00:00');
  d.setDate(d.getDate() - leadDays);
  return d.toISOString().slice(0, 10);
}

export function migratePOE(p: any): POE {
  return {
    ...p,
    status: p.status || 'planned',
    reminderEnabled: p.reminderEnabled ?? true,
    reminderDate: p.reminderDate || (p.date ? computeReminderDate(p.date, p.reminderLeadDays || 60) : ''),
    reminderLeadDays: p.reminderLeadDays || 60,
    endDate: p.endDate || '',
    assignedTo: p.assignedTo || '',
    report: p.report || '',
    notes: p.notes || '',
    createdAt: p.createdAt || new Date().toISOString(),
    updatedAt: p.updatedAt || new Date().toISOString(),
  };
}
