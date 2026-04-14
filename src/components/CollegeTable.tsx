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
    <div>
      {/* Toolbar */}
      <div className="bg-surface border border-border rounded-2xl p-3 mb-3">
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">⚲</span>
            <input
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search colleges..."
              className="w-full py-[6px] pl-8 pr-3 border border-border rounded-xl text-xs bg-surface text-foreground outline-none focus:border-primary-mid focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2">
            <select value={streamFilter} onChange={e => onStreamChange(e.target.value)} className="flex-1 sm:flex-none py-[6px] px-2.5 border border-border rounded-xl text-xs bg-surface text-foreground outline-none cursor-pointer focus:border-primary-mid">
              <option value="">All streams</option>
              <option>Engineering</option>
              <option>Management</option>
            </select>
            <select value={tierFilter} onChange={e => onTierChange(e.target.value)} className="flex-1 sm:flex-none py-[6px] px-2.5 border border-border rounded-xl text-xs bg-surface text-foreground outline-none cursor-pointer focus:border-primary-mid">
              <option value="">All tiers</option>
              <option>Premier</option>
              <option>Tier 1</option>
              <option>IIM</option>
              <option>Others</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
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
          <span className="ml-auto text-[10px] text-muted-foreground">{filtered.length} of {total}</span>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block bg-surface border border-border rounded-2xl overflow-hidden">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-muted/50">
              {['', 'College name', 'Stream', 'Tier', 'Notes', 'Points of engagement', ''].map((h, i) => (
                <th key={i} className="text-left px-3 py-2 text-[10px] text-muted-foreground font-medium border-b border-border">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-muted-foreground">
                  <div>No colleges found</div>
                  <div className="text-[10px] mt-1">Try adjusting your search or filters</div>
                  <button onClick={onAddCollege} className="text-primary hover:underline text-xs mt-2 bg-transparent border-none cursor-pointer">+ Add first college</button>
                </td>
              </tr>
            ) : filtered.map(c => {
              const isExp = expandedRow === c.id;
              const isPendDel = pendingDeleteCollege === c.id;
              const isTimelineOpen = timelineOpenFor === c.id;
              const hasReminder = c.poes.some(p => p.reminderEnabled && p.status === 'planned');
              const hasReport = c.poes.some(p => p.status === 'done' && p.report);
              return (
                <tr key={c.id} className="border-b border-border/50 last:border-b-0">
                  <td className="px-2 py-2 w-6">
                    <button onClick={() => onToggleRow(c.id)} className="bg-transparent border-none text-text-hint text-[11px] p-[2px_4px] cursor-pointer rounded-md hover:bg-border hover:text-foreground">{isExp ? '▼' : '►'}</button>
                  </td>
                  <td className="px-3 py-2">
                    <div className="cursor-pointer" onClick={() => onToggleRow(c.id)}>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-foreground">{c.name}</span>
                        {hasReminder && <span>🔔</span>}
                        {hasReport && <span>📊</span>}
                      </div>
                      {c.website && (
                        <a href={c.website} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-[11px] text-primary no-underline hover:underline block">
                          {c.website.replace(/https?:\/\//, '').split('/')[0]}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2"><StreamBadge stream={c.stream} /></td>
                  <td className="px-3 py-2"><TierBadge tier={c.tier} /></td>
                  <td className="px-3 py-2 text-muted-foreground max-w-[150px] truncate">{c.notes || '—'}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {c.poes.map(p => <POEBadge key={p.id} poe={p} onClick={() => onSelectPOE(c.id, p.id)} />)}
                      <button onClick={() => onAddPOE(c.id)} className="bg-background text-muted-foreground border border-dashed border-border rounded-lg text-[10px] px-[7px] py-[2px] cursor-pointer hover:border-primary-mid hover:text-primary">+ add</button>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {isPendDel ? (
                      <span className="flex items-center gap-1">
                        <span className="text-[11px] text-destructive font-medium">Delete?</span>
                        <button onClick={() => onConfirmDeleteCollege(c.id)} className="bg-destructive text-primary-foreground border-destructive text-[11px] px-[10px] py-[3px] rounded-lg font-medium cursor-pointer">Yes</button>
                        <button onClick={onCancelDeleteCollege} className="bg-surface text-foreground border border-border text-[11px] px-[10px] py-[3px] rounded-lg font-medium cursor-pointer">No</button>
                      </span>
                    ) : (
                      <div className="flex gap-1">
                        <button onClick={() => onToggleTimeline(c.id)} className="px-[9px] py-[3px] rounded-lg text-[11px] font-medium border border-primary bg-primary-light text-primary hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">Timeline</button>
                        <button onClick={() => onEditCollege(c.id)} className="px-[9px] py-[3px] rounded-lg text-[11px] font-medium border border-border bg-surface text-foreground hover:bg-background hover:border-primary-mid cursor-pointer">Edit</button>
                        <button onClick={() => onAskDeleteCollege(c.id)} className="px-[9px] py-[3px] rounded-lg text-[11px] font-medium border border-destructive/50 bg-destructive-light text-destructive-dark hover:bg-destructive/20 cursor-pointer">Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Expanded rows and timelines */}
        {filtered.map(c => {
          const isExp = expandedRow === c.id;
          const isTimelineOpen = timelineOpenFor === c.id;
          if (!isExp && !isTimelineOpen) return null;
          return (
            <div key={`exp-${c.id}`} className="border-t border-border">
              {isTimelineOpen && (
                <div className="p-4 bg-background">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-foreground">Engagement Timeline — {c.name}</span>
                    <button onClick={() => onCloseTimeline(c.id)} className="flex items-center gap-1 text-[12px] text-destructive hover:text-destructive-dark cursor-pointer bg-transparent border-none font-bold leading-none">✕ Close</button>
                  </div>
                  <TimelineView poes={c.poes} onSelectPOE={(pid) => onSelectPOE(c.id, pid)} />
                </div>
              )}
              {isExp && (
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
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile List */}
      <div className="sm:hidden flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="bg-surface border border-border rounded-2xl p-6 text-center">
            <div className="text-sm text-foreground font-medium">No colleges found</div>
            <div className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</div>
            <button onClick={onAddCollege} className="text-primary hover:underline text-xs mt-2 bg-transparent border-none cursor-pointer">+ Add first college</button>
          </div>
        ) : filtered.map(c => {
          const isExp = expandedRow === c.id;
          const isPendDel = pendingDeleteCollege === c.id;
          const isTimelineOpen = timelineOpenFor === c.id;
          return (
            <div key={c.id} className="bg-surface border border-border rounded-2xl overflow-hidden">
              <div className="p-3">
                <div className="flex items-start justify-between cursor-pointer" onClick={() => onToggleRow(c.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground text-sm">{c.name}</span>
                      <StreamBadge stream={c.stream} />
                      <TierBadge tier={c.tier} />
                    </div>
                    {c.website && (
                      <a href={c.website} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-[11px] text-primary no-underline">{c.website.replace(/https?:\/\//, '').split('/')[0]}</a>
                    )}
                  </div>
                  <span className="text-muted-foreground text-sm">{isExp ? '▼' : '►'}</span>
                </div>
                {c.notes && <div className="text-[11px] text-muted-foreground mt-1 truncate">{c.notes}</div>}
                {isExp && (
                  <>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      <button onClick={(e) => { e.stopPropagation(); onToggleTimeline(c.id); }} className="px-[9px] py-[3px] rounded-lg text-[11px] font-medium border border-primary bg-primary-light text-primary hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">Timeline</button>
                      <button onClick={() => onEditCollege(c.id)} className="px-[9px] py-[3px] rounded-lg text-[11px] font-medium border border-border bg-surface text-foreground cursor-pointer">Edit college</button>
                      {isPendDel ? (
                        <span className="flex items-center gap-1">
                          <span className="text-[11px] text-destructive font-medium">Delete?</span>
                          <button onClick={() => onConfirmDeleteCollege(c.id)} className="bg-destructive text-primary-foreground border-destructive text-[11px] px-[10px] py-[3px] rounded-lg font-medium cursor-pointer">Yes</button>
                          <button onClick={onCancelDeleteCollege} className="bg-surface text-foreground border border-border text-[11px] px-[10px] py-[3px] rounded-lg font-medium cursor-pointer">No</button>
                        </span>
                      ) : (
                        <button onClick={() => onAskDeleteCollege(c.id)} className="px-[9px] py-[3px] rounded-lg text-[11px] font-medium border border-destructive/50 bg-destructive-light text-destructive-dark cursor-pointer">Delete</button>
                      )}
                    </div>

                    {isTimelineOpen && (
                      <div className="mt-3 bg-background rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-foreground">Engagement Timeline</span>
                          <button onClick={() => onCloseTimeline(c.id)} className="flex items-center gap-1 text-[12px] text-destructive hover:text-destructive-dark cursor-pointer bg-transparent border-none font-bold leading-none">✕ Close</button>
                        </div>
                        <TimelineView poes={c.poes} onSelectPOE={(pid) => onSelectPOE(c.id, pid)} />
                      </div>
                    )}

                    <div className="mt-3">
                      <div className="text-[10px] text-muted-foreground font-medium mb-1.5">Points of engagement</div>
                      {c.poes.length === 0 ? (
                        <div className="text-center py-3">
                          <div className="text-xs text-muted-foreground">No engagements yet.</div>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-wrap gap-1 mb-2">
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
