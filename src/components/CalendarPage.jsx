import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, ExternalLink } from 'lucide-react';

const calStyle = document.createElement('style');
calStyle.textContent = `
  .cal-nav-btn:hover { background-color: var(--bg-card-hover) !important; }
  .cal-nav-btn:focus-visible { outline: 2px solid var(--text-primary); outline-offset: 2px; border-radius: 10px; }
  .cal-day-cell:hover { border-color: var(--border-strong) !important; box-shadow: 0 1px 4px var(--border) !important; }
  .cal-day-cell:focus-visible { outline: 2px solid var(--text-primary); outline-offset: 2px; border-radius: 10px; }
  .cal-open-btn:hover { background-color: var(--border) !important; }
  .cal-open-btn:focus-visible { outline: 2px solid var(--text-primary); outline-offset: 2px; border-radius: 6px; }
  .cal-project-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important; }
`;
document.head.appendChild(calStyle);

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function formatDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function toLocalDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function CalendarPage({ projects = [], onNavigate, onSelectProject }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(today);
  const [animDir, setAnimDir] = useState(0);
  const gridRef = useRef(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const projectsByDate = useMemo(() => {
    const map = {};
    projects.forEach(p => {
      if (!p.deadline) return;
      const key = toLocalDateStr(new Date(p.deadline));
      if (!map[key]) map[key] = [];
      map[key].push(p);
    });
    return map;
  }, [projects]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const todayStr = toLocalDateStr(today);

  const prevMonth = () => { setAnimDir(-1); setViewDate(new Date(year, month - 1, 1)); };
  const nextMonth = () => { setAnimDir(1); setViewDate(new Date(year, month + 1, 1)); };

  const selectedDateStr = selectedDate ? toLocalDateStr(selectedDate) : null;
  const selectedProjects = selectedDateStr ? (projectsByDate[selectedDateStr] || []) : [];

  const dayVariants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div style={s.page}>
      {/* Page Header */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.h1}><CalendarIcon size={20} /> Kalender</h1>
          <p style={s.subtitle}>{projects.filter(p => p.deadline).length} project dengan deadline</p>
        </div>
      </div>

      <div style={s.twoCol}>
        {/* ─── LEFT: Calendar ─── */}
        <div style={s.calCol}>
          <div style={s.calCard}>
            {/* Month Nav */}
            <div style={s.nav}>
              <button type="button" onClick={prevMonth} className="cal-nav-btn" style={s.navBtn} aria-label="Bulan sebelumnya">
                <ChevronLeft size={18} />
              </button>
              <span style={s.monthLabel}>{MONTHS[month]} {year}</span>
              <button type="button" onClick={nextMonth} className="cal-nav-btn" style={s.navBtn} aria-label="Bulan berikutnya">
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Day Headers */}
            <div style={s.dayHeaders}>
              {DAYS.map(d => <div key={d} style={s.dayHeader}>{d}</div>)}
            </div>

            {/* Calendar Grid */}
            <div ref={gridRef} style={s.grid}>
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} style={s.emptyCell} />)}
              <AnimatePresence mode="popLayout" custom={animDir}>
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const date = new Date(year, month, day);
                  const dateStr = toLocalDateStr(date);
                  const isToday = dateStr === todayStr;
                  const isSelected = isSameDay(date, selectedDate);
                  const dayProjects = projectsByDate[dateStr] || [];
                  const moreCount = dayProjects.length > 2 ? dayProjects.length - 2 : 0;

                  return (
                    <motion.button
                      key={dateStr}
                      className="cal-day-cell"
                      layout
                      custom={animDir}
                      variants={dayVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      style={{
                        ...s.dayCell,
                        backgroundColor: isToday ? 'var(--bg-card-hover)' : isSelected ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                        borderColor: isToday ? 'var(--text-primary)' : isSelected ? 'var(--border-strong)' : 'var(--bg-card-hover)',
                        boxShadow: isSelected ? '0 1px 3px var(--border)' : 'none',
                      }}
                    >
                      <span style={{
                        ...s.dayNum,
                        color: isToday ? 'var(--text-primary)' : 'var(--text-primary)',
                        fontWeight: isToday ? 700 : 500,
                      }}>
                        {day}
                      </span>

                      {dayProjects.length > 0 && (
                        <div style={s.chipWrap}>
                          {dayProjects.slice(0, 2).map((p, j) => (
                            <motion.div
                              key={p.id}
                              initial={{ opacity: 0, x: -4 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: j * 0.03, duration: 0.15 }}
                              style={s.chip}
                              title={p.name}
                            >
                              <span style={{ ...s.chipDot, backgroundColor: p.color || 'var(--text-muted)' }} />
                              <span style={s.chipLabel}>{p.name}</span>
                            </motion.div>
                          ))}
                          {moreCount > 0 && (
                            <span style={s.moreChip}>+{moreCount} more</span>
                          )}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Agenda Panel ─── */}
        <div style={s.agendaCol}>
          <div style={s.agendaCard}>
            {/* Agenda Header */}
            <div style={s.agendaHeader}>
              <h2 style={s.agendaDate}>
                {selectedDate
                  ? `${String(selectedDate.getDate()).padStart(2, '0')} ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
                  : 'Pilih tanggal'}
              </h2>
              <span style={s.agendaCount}>{selectedProjects.length} project</span>
            </div>

            {/* Projects List */}
            {selectedDate && selectedProjects.length > 0 ? (
              <div style={s.projectList}>
                {selectedProjects.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                    className="cal-project-card"
                    style={s.projectCard}
                  >
                    <div style={{ ...s.projectBar, backgroundColor: p.color || 'var(--text-muted)' }} />
                    <div style={s.projectBody}>
                      <div style={s.projectHead}>
                        <span style={s.projectName}>{p.name}</span>
                      </div>
                      {p.description && (
                        <p style={s.projectDesc}>{p.description}</p>
                      )}
                      <div style={s.projectMeta}>
                        <span style={s.metaBadge}>
                          <span style={{ ...s.metaDot, backgroundColor: p.status === 'active' ? '#10B981' : p.status === 'completed' ? 'var(--text-muted)' : 'var(--text-muted)' }} />
                          {p.status === 'active' ? 'Active' : p.status === 'completed' ? 'Completed' : 'Archived'}
                        </span>
                        {p.deadline && (
                          <span style={s.metaDate}>
                            <Clock size={10} /> {formatDate(p.deadline)}
                          </span>
                        )}
                      </div>
                      <div style={s.projectFooter}>
                        <span style={s.workspace}>Workspace</span>
                        <button
                          type="button"
                          className="cal-open-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProject?.(p.id);
                            onNavigate?.('boards');
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              e.stopPropagation();
                              onSelectProject?.(p.id);
                              onNavigate?.('boards');
                            }
                          }}
                          style={s.openBtn}
                          aria-label={`Buka project ${p.name}`}
                        >
                          Open <ExternalLink size={11} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : selectedDate ? (
              <div style={s.emptyState}>
                <div style={s.emptyIcon}>
                  <CalendarIcon size={28} />
                </div>
                <p style={s.emptyTitle}>No deadlines on this day</p>
                <p style={s.emptyText}>There are no project deadlines scheduled for this date.</p>
              </div>
            ) : (
              <div style={s.emptyState}>
                <div style={s.emptyIcon}>
                  <CalendarIcon size={28} />
                </div>
                <p style={s.emptyTitle}>Select a date</p>
                <p style={s.emptyText}>Click on a date to view project deadlines.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    padding: '32px 36px',
    display: 'flex', flexDirection: 'column', gap: '24px',
    maxWidth: '1280px', margin: '0 auto', width: '100%',
  },
  pageHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  h1: {
    fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)',
    letterSpacing: '-0.8px', display: 'flex', alignItems: 'center', gap: '10px',
  },
  subtitle: { fontSize: '14px', color: 'var(--text-muted)', marginTop: '2px' },
  twoCol: {
    display: 'flex', gap: '24px', alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  calCol: { flex: '2 1 480px', minWidth: 0 },
  agendaCol: { flex: '1 1 280px', minWidth: '260px', maxWidth: '360px' },

  // ── Calendar Card ──
  calCard: {
    backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '16px', padding: '20px', boxShadow: '0 1px 4px var(--shadow-sm)',
  },
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: '16px',
  },
  navBtn: {
    width: '36px', height: '36px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', borderRadius: '10px', border: 'none',
    background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
    transition: 'background-color 0.12s',
  },
  monthLabel: {
    fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)',
  },

  // ── Day Headers ──
  dayHeaders: {
    display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '8px',
  },
  dayHeader: {
    textAlign: 'center', fontSize: '11px', fontWeight: 600,
    color: 'var(--text-muted)', padding: '4px 0',
  },

  // ── Grid ──
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px',
  },
  emptyCell: { minHeight: '88px' },
  dayCell: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
    gap: '4px', padding: '6px', borderRadius: '10px', border: '1.5px solid var(--bg-card-hover)',
    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    minHeight: '88px', width: '100', boxSizing: 'border-box',
    position: 'relative',
  },
  dayNum: {
    fontSize: '13px', lineHeight: 1,
  },

  // ── Project Chips ──
  chipWrap: {
    display: 'flex', flexDirection: 'column', gap: '2px', width: '100%',
    overflow: 'hidden', marginTop: '2px',
  },
  chip: {
    display: 'flex', alignItems: 'center', gap: '4px',
    height: '20px', padding: '0 6px', borderRadius: '999px',
    backgroundColor: 'var(--bg-subtle)', overflow: 'hidden',
    maxWidth: '100%', cursor: 'default',
  },
  chipDot: { width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0 },
  chipLabel: {
    fontSize: '9px', fontWeight: 600, color: 'var(--text-secondary)',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  moreChip: {
    fontSize: '9px', fontWeight: 600, color: 'var(--text-muted)',
    paddingLeft: '2px',
  },

  // ── Agenda Panel ──
  agendaCard: {
    backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '16px', padding: '20px', boxShadow: '0 1px 4px var(--shadow-sm)',
    display: 'flex', flexDirection: 'column', gap: '16px',
  },
  agendaHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: '8px',
  },
  agendaDate: {
    fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0,
  },
  agendaCount: {
    fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)',
    padding: '2px 8px', borderRadius: '999px',
    backgroundColor: 'var(--bg-card-hover)',
  },

  // ── Project List ──
  projectList: {
    display: 'flex', flexDirection: 'column', gap: '10px',
  },
  projectCard: {
    display: 'flex', borderRadius: '12px', border: '1px solid var(--border)',
    overflow: 'hidden', backgroundColor: 'var(--bg-card)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
    transition: 'box-shadow 0.12s',
  },
  projectBar: { width: '3px', flexShrink: 0 },
  projectBody: {
    flex: 1, padding: '12px 14px',
    display: 'flex', flexDirection: 'column', gap: '6px',
    overflow: 'hidden',
  },
  projectHead: {
    display: 'flex', alignItems: 'center', gap: '6px',
  },
  projectName: {
    fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  projectDesc: {
    fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0,
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  projectMeta: {
    display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap',
  },
  metaBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)',
  },
  metaDot: { width: '5px', height: '5px', borderRadius: '50%' },
  metaDate: {
    display: 'inline-flex', alignItems: 'center', gap: '3px',
    fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)',
  },
  projectFooter: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginTop: '2px',
  },
  workspace: {
    fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)',
  },
  openBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    padding: '4px 10px', borderRadius: '6px', border: 'none',
    backgroundColor: 'var(--bg-card-hover)', color: 'var(--text-secondary)',
    cursor: 'pointer', fontSize: '10px', fontWeight: 600,
    fontFamily: 'inherit', transition: 'background-color 0.12s',
  },

  // ── Empty State ──
  emptyState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: '8px', padding: '40px 12px',
    textAlign: 'center',
  },
  emptyIcon: {
    width: '48px', height: '48px', borderRadius: '12px',
    backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', color: 'var(--border-strong)',
  },
  emptyTitle: {
    fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0,
  },
  emptyText: {
    fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4,
  },
};
