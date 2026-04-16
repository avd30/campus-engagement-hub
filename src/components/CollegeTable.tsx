import { College } from '@/types/campus';
import StreamBadge from './StreamBadge';
import TierBadge from './TierBadge';
import POEBadge from './POEBadge';
import ExpandedRow from './ExpandedRow';
import POEDetail from './POEDetail';
import TimelineView from './TimelineView';

interface CollegeTableProps {
  filtered: College[];
  total: number;
  expandedRow: string | null;
  selectedPoe: { cid: string; pid: string } | null;
  pendingDeleteCollege: string | null;
  pendingDeletePoe: { cid: string; pid: string } | null;
  timelineOpenFor: string | null;
  search: string;
  streamFilter: string;
  tierFilter: string;
  statusFilter: string;
  onSearchChange: (v: string) => void;
  onStreamChange: (v: string) => void;
  onTierChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onToggleRow: (cid: string) => void;
  onSelectPOE: (cid: string, pid: string) => void;
  onAddCollege: () => void;
  onEditCollege: (cid: string) => void;
  onAskDeleteCollege: (cid: string) => void;
  onConfirmDeleteCollege: (cid: string) => void;
  onCancelDeleteCollege: () => void;
  onAddPOE: (cid: string) => void;
  onEditPOE: (cid: string, pid: string) => void;
  onAskDeletePOE: (cid: string, pid: string) => void;
  onConfirmDeletePOE: (cid: string, pid: string) => void;
  onCancelDeletePOE: () => void;
  onToggleTimeline: (cid: string) => void;
  onCloseTimeline: (cid: string) => void;
  onMarkEngagement: (cid: string, pid: string) => void;
}

export default function CollegeTable(props: CollegeTableProps) {
  const { filtered, total, expandedRow, selectedPoe, pendingDeleteCollege, pendingDeletePoe,
    timelineOpenFor, search, streamFilter, tierFilter, statusFilter,
    onSearchChange, onStreamChange, onTierChange, onStatusChange,
    onToggleRow, onSelectPOE, onAddCollege, onEditCollege,
    onAskDeleteCollege, onConfirmDeleteCollege, onCancelDeleteCollege,
    onAddPOE, onEditPOE, onAskDeletePOE, onConfirmDeletePOE, onCancelDeletePOE,
    onToggleTimeline, onCloseTimeline, onMarkEngagement } = props;

  const filterChips = [
    { label: 'All', value: '' },
    { label: 'Planned', value: 'planned' },
    { label: 'Done', value: 'done' },
    { label: 'Not Done', value: 'not_done' },
    { label: 'Rescheduled', value: 'rescheduled' },
  ];

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 p-3 border-b border-border bg-toolbar flex-wrap">
        <div className="flex-1 min-w-[160px] max-w-full sm:max-w-[260px] relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-hint text-[13px] pointer-events-none">&#9906;</span>
          <input
            type="text"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search colleges..."
            className="w-full py-[6px] pl-8 pr-3 border border-border rounded-xl text-xs bg-surface text-foreground outline-none focus:border-primary-mid focus:ring-1 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-[6px] flex-wrap">
          <select value={streamFilter} onChange={e => onStreamChange(e.target.value)} className="flex-1 sm:flex-none py-[6px] px-2.5 border border-border rounded-xl text-xs bg-surface text-foreground outline-none cursor-pointer focus:border-primary-mid">
            <option value="">All streams</option>
            <option>Engineering</option>
            <option>Management</option>
          </select>
          <select value={tierFilter} onChange={e => onTierChange(e.target.value)} className="flex-1 sm:flex-none py-[6px] px-2.5 border border-border rounded-xl text-xs bg-surface text-foreground outline-none cursor-pointer focus:border-primary-mid">
            <option value="">All tiers</option>
            <option value="premier_iim">Premier / IIM</option>
            <option value="tier1_others">Tier 1 / Others</option>
          </select>
        </div>
        <div className="flex gap-1 flex-wrap">
          {filterChips.map(chip => (
            <button
              key={chip.value}
              onClick={() => onStatusChange(chip.value)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium border transition-colors cursor-pointer ${
                statusFilter === chip.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-surface text-muted-foreground border-border hover:border-primary-mid'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
        <div className="text-[11px] text-text-hint sm:text-right">{filtered.length} of {total}</div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['', 'College name', 'Stream', 'Tier', 'Notes', 'Points of engagement', ''].map((h, i) => (
                <th key={i} className="text-left text-[11px] font-semibold text-muted-foreground py-2 px-3 border-b border-border bg-toolbar whitespace-nowrap tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          {filtered.length === 0 ? (
            <tbody>
              <tr><td colSpan={7}>
                <div className="text-center py-12 text-muted-foreground">
                  <div className="text-[15px] font-medium mb-[6px] text-foreground">No colleges found</div>
                  <div className="text-xs mb-4">Try adjusting your search or filters</div>
                  <button onClick={onAddCollege} className="px-4 py-2 rounded-xl text-xs font-medium bg-primary text-primary-foreground border border-primary hover:bg-primary-dark">+ Add first college</button>
                </div>
              </td></tr>
            </tbody>
          ) : filtered.map(c => {
            const isExp = expandedRow === c.id;
            const isPendDel = pendingDeleteCollege === c.id;
            const isTimelineOpen = timelineOpenFor === c.id;
            const hasReminder = c.poes.some(p => p.reminderEnabled && p.status === 'planned');
            const hasReport = c.poes.some(p => p.status === 'done' && p.report);
            return (
              <tbody key={c.id}>
                <tr className={isExp ? 'bg-toolbar' : 'hover:bg-toolbar'}>
                  <td className="py-[10px] px-3 border-b border-border align-top w-9">
                    <button onClick={() => onToggleRow(c.id)} className="bg-transparent border-none text-text-hint text-[11px] p-[2px_4px] cursor-pointer rounded-md hover:bg-border hover:text-foreground">{isExp ? '▼' : '►'}</button>
                  </td>
                  <td className="py-[10px] px-3 border-b border-border align-top cursor-pointer" onClick={() => onToggleRow(c.id)}>
                    <div className="flex items-center gap-1.5">
                      <div className="font-semibold text-[13px] mb-[2px]">{c.name}</div>
                      {hasReminder && <span title="Has active reminders" className="text-[10px]">🔔</span>}
                      {hasReport && <span title="Has reports" className="text-[10px]">📊</span>}
                    </div>
                    {c.website && <a href={c.website} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} className="text-[11px] text-primary no-underline hover:underline block">{c.website.replace(/https?:\/\//, '').split('/')[0]}</a>}
                  </td>
                  <td className="py-[10px] px-3 border-b border-border align-top"><StreamBadge stream={c.stream} /></td>
                  <td className="py-[10px] px-3 border-b border-border align-top"><TierBadge tier={c.tier} /></td>
                  <td className="py-[10px] px-3 border-b border-border align-top"><div className="text-[11px] text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]" title={c.notes || ''}>{c.notes || '—'}</div></td>
                  <td className="py-[10px] px-3 border-b border-border align-top">
                    <div className="flex flex-wrap gap-1 items-center">
                      {c.poes.map(p => <POEBadge key={p.id} poe={p} onClick={() => onSelectPOE(c.id, p.id)} />)}
                      <button onClick={() => onAddPOE(c.id)} className="bg-background text-muted-foreground border border-dashed border-border rounded-lg text-[10px] px-[7px] py-[2px] cursor-pointer hover:border-primary-mid hover:text-primary">+ add</button>
                    </div>
                  </td>
                  <td className="py-[10px] px-3 border-b border-border align-top whitespace-nowrap">
                    {isPendDel ? (
                      <div className="flex flex-col items-start gap-[5px] bg-destructive-light border border-[#F09595] rounded-xl px-2 py-[6px]">
                        <span className="text-[11px] text-destructive-dark font-semibold">Delete?</span>
                        <div className="flex gap-1">
                          <button onClick={() => onConfirmDeleteCollege(c.id)} className="bg-destructive text-primary-foreground border-destructive text-[11px] px-[10px] py-[3px] rounded-lg font-medium">Yes</button>
                          <button onClick={onCancelDeleteCollege} className="px-[9px] py-[3px] rounded-lg text-[11px] font-medium border border-border bg-surface">No</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <button onClick={() => onToggleTimeline(c.id)} className="px-[9px] py-[3px] rounded-lg text-[11px] font-medium border border-primary bg-primary-light text-primary hover:bg-primary hover:text-primary-foreground transition-colors">Timeline</button>
                        <button onClick={() => onEditCollege(c.id)} className="px-[9px] py-[3px] rounded-lg text-[11px] font-medium border border-border bg-surface text-foreground hover:bg-background hover:border-primary-mid">Edit</button>
                        <button onClick={() => onAskDeleteCollege(c.id)} className="px-[9px] py-[3px] rounded-lg text-[11px] font-medium border border-[#F09595] bg-destructive-light text-destructive-dark hover:bg-[#F7C1C1]">Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
                {isTimelineOpen && (
                  <tr><td colSpan={7} className="p-0 bg-[#f8f7fd] border-b border-border">
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Engagement Timeline — {c.name}</div>
                        <button onClick={() => onCloseTimeline(c.id)} className="flex items-center gap-1 text-[12px] text-destructive hover:text-destructive-dark cursor-pointer bg-transparent border-none font-bold leading-none">✕ Close</button>
                      </div>
                      <TimelineView poes={c.poes} selectedPoeId={selectedPoe?.cid === c.id ? selectedPoe.pid : null} onSelectPOE={(pid) => onSelectPOE(c.id, pid)} />
                    </div>
                  </td></tr>
                )}
                {isExp && (
                  <tr><td colSpan={7} className="p-0 bg-[#f2f0fa] border-b border-border">
                    <ExpandedRow
                      college={c}
                      selectedPoe={selectedPoe}
                      pendingDeletePoe={pendingDeletePoe}
                      onSelectPOE={onSelectPOE}
                      onAddPOE={onAddPOE}
                      onEditPOE={onEditPOE}
                      onAskDeletePOE={onAskDeletePOE}
                      onConfirmDeletePOE={onConfirmDeletePOE}
                      onCancelDeletePOE={onCancelDeletePOE}
                      onMarkEngagement={onMarkEngagement}
                    />
                  </td></tr>
                )}
              </tbody>
            );
          })}
        </table>
      </div>

      {/* Mobile List */}
      <div className="sm:hidden p-[10px]">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-[15px] font-medium mb-[6px] text-foreground">No colleges found</div>
            <div className="text-xs mb-4">Try adjusting your search or filters</div>
            <button onClick={onAddCollege} className="px-4 py-2 rounded-xl text-xs font-medium bg-primary text-primary-foreground border border-primary hover:bg-primary-dark">+ Add first college</button>
          </div>
        ) : filtered.map(c => {
          const isExp = expandedRow === c.id;
          const isPendDel = pendingDeleteCollege === c.id;
          const isTimelineOpen = timelineOpenFor === c.id;
          return (
            <div key={c.id} className="bg-surface border border-border rounded-2xl mb-[10px] overflow-hidden">
              <div className="flex items-start justify-between p-[14px] cursor-pointer active:bg-toolbar" onClick={() => onToggleRow(c.id)}>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold mb-[5px]">{c.name}</div>
                  <div className="flex gap-[5px] flex-wrap items-center">
                    <StreamBadge stream={c.stream} />
                    <TierBadge tier={c.tier} />
                  </div>
                  {c.website && <div className="mt-[3px]"><a href={c.website} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} className="text-[11px] text-primary no-underline">{c.website.replace(/https?:\/\//, '').split('/')[0]}</a></div>}
                </div>
                <div className="text-xs text-text-hint ml-[10px] mt-[3px] flex-shrink-0">{isExp ? '▼' : '►'}</div>
              </div>
              {c.notes && <div className="px-[14px] pb-3 text-xs text-muted-foreground border-b border-border">{c.notes}</div>}
              {isExp && (
                <>
                  <div className="flex gap-2 p-[10px_14px] border-b border-border flex-wrap">
                    <button onClick={(e) => { e.stopPropagation(); onToggleTimeline(c.id); }} className="px-[9px] py-[3px] rounded-lg text-[11px] font-medium border border-primary bg-primary-light text-primary hover:bg-primary hover:text-primary-foreground transition-colors">Timeline</button>
                    <button onClick={() => onEditCollege(c.id)} className="px-[9px] py-[3px] rounded-lg text-[11px] font-medium border border-border bg-surface text-foreground">Edit college</button>
                    {isPendDel ? (
                      <div className="flex flex-col items-start gap-[5px] bg-destructive-light border border-[#F09595] rounded-xl px-2 py-[6px]">
                        <span className="text-[11px] text-destructive-dark font-semibold">Delete?</span>
                        <div className="flex gap-1">
                          <button onClick={() => onConfirmDeleteCollege(c.id)} className="bg-destructive text-primary-foreground border-destructive text-[11px] px-[10px] py-[3px] rounded-lg font-medium">Yes</button>
                          <button onClick={onCancelDeleteCollege} className="px-[9px] py-[3px] rounded-lg text-[11px] font-medium border border-border bg-surface">No</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => onAskDeleteCollege(c.id)} className="px-[9px] py-[3px] rounded-lg text-[11px] font-medium border border-[#F09595] bg-destructive-light text-destructive-dark">Delete</button>
                    )}
                  </div>
                  {isTimelineOpen && (
                    <div className="p-3 bg-[#f8f7fd] border-b border-border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Engagement Timeline</div>
                        <button onClick={() => onCloseTimeline(c.id)} className="flex items-center gap-1 text-[12px] text-destructive hover:text-destructive-dark cursor-pointer bg-transparent border-none font-bold leading-none">✕ Close</button>
                      </div>
                      <TimelineView poes={c.poes} selectedPoeId={selectedPoe?.cid === c.id ? selectedPoe.pid : null} onSelectPOE={(pid) => onSelectPOE(c.id, pid)} />
                    </div>
                  )}
                  <div className="p-3 bg-background">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Points of engagement</div>
                    {c.poes.length === 0 ? (
                      <div className="text-xs text-muted-foreground mb-2">No engagements yet.</div>
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-[5px] mb-2">
                          {c.poes.map(p => <POEBadge key={p.id} poe={p} onClick={() => onSelectPOE(c.id, p.id)} selected={selectedPoe?.cid === c.id && selectedPoe?.pid === p.id} />)}
                        </div>
                        {selectedPoe?.cid === c.id && (() => {
                          const p = c.poes.find(x => x.id === selectedPoe.pid);
                          if (!p) return null;
                          return (
                            <POEDetail
                              poe={p}
                              onEdit={() => onEditPOE(c.id, p.id)}
                              onAskDelete={() => onAskDeletePOE(c.id, p.id)}
                              onConfirmDelete={() => onConfirmDeletePOE(c.id, p.id)}
                              onCancelDelete={onCancelDeletePOE}
                              isPendingDelete={!!pendingDeletePoe && pendingDeletePoe.cid === c.id && pendingDeletePoe.pid === p.id}
                              onMarkEngagement={() => onMarkEngagement(c.id, p.id)}
                            />
                          );
                        })()}
                      </>
                    )}
                    <button onClick={() => onAddPOE(c.id)} className="mt-[6px] w-full text-center bg-transparent text-muted-foreground border border-dashed border-border rounded-xl text-[11px] px-[10px] py-[5px] cursor-pointer hover:border-primary-mid hover:text-primary">+ Add engagement</button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
