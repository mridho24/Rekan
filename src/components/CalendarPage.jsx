import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, FolderPlus } from 'lucide-react';

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function toLocalDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function CalendarPage({ projects = [] }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

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

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const selectedDateStr = selectedDate ? toLocalDateStr(selectedDate) : null;
  const selectedProjects = selectedDateStr ? (projectsByDate[selectedDateStr] || []) : [];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.h1}>
          <CalendarIcon size={20} /> Kalender
        </h1>
        <p style={styles.subtitle}>
          {projects.filter(p => p.deadline).length} project dengan deadline
        </p>
      </div>

      <div style={styles.twoCol}>
        <div style={styles.calendarCol}>
          <div style={styles.calendarCard}>
            <div style={styles.calendarNav}>
              <button style={styles.navBtn} onClick={prevMonth}>
                <ChevronLeft size={16} />
              </button>
              <span style={styles.monthLabel}>
                {MONTHS[month]} {year}
              </span>
              <button style={styles.navBtn} onClick={nextMonth}>
                <ChevronRight size={16} />
              </button>
            </div>

            <div style={styles.dayHeaders}>
              {DAYS.map(d => (
                <div key={d} style={styles.dayHeader}>{d}</div>
              ))}
            </div>

            <div style={styles.grid}>
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} style={styles.cell} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = new Date(year, month, day);
                const dateStr = toLocalDateStr(date);
                const isToday = dateStr === todayStr;
                const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
                const dayProjects = projectsByDate[dateStr] || [];

                return (
                  <motion.button
                    key={day}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedDate(date)}
                    style={{
                      ...styles.cell,
                      backgroundColor: isSelected ? 'var(--emerald)' : isToday ? 'var(--emerald-bg)' : 'transparent',
                      color: isSelected ? '#fff' : isToday ? 'var(--emerald-dark)' : 'var(--text-primary)',
                      fontWeight: isToday || isSelected ? 700 : 500,
                    }}
                  >
                    {day}
                    {dayProjects.length > 0 && (
                      <div style={styles.dotWrap}>
                        {dayProjects.slice(0, 3).map((p, j) => (
                          <div key={j} style={{ ...styles.dot, backgroundColor: p.color || '#10B981' }} />
                        ))}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={styles.taskCol}>
          <div style={styles.taskCard}>
            <h2 style={styles.taskCardTitle}>
              {selectedDate
                ? `${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
                : 'Pilih tanggal'}
            </h2>
            <span className="badge badge-emerald">{selectedProjects.length} project</span>
          </div>

          {selectedDate && selectedProjects.length > 0 ? (
            <div style={styles.taskList}>
              {selectedProjects.map(project => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={styles.taskItem}
                  onClick={() => setSelectedProject(project)}
                >
                  <div style={{ ...styles.taskPriority, backgroundColor: project.color || '#10B981' }} />
                  <div style={styles.taskBody}>
                    <span style={styles.taskTitle}>{project.name}</span>
                    <div style={styles.taskMeta}>
                      <span style={styles.metaProject}>
                        {project.description || 'Tidak ada deskripsi'}
                      </span>
                    </div>
                  </div>
                  <Clock size={12} color="var(--text-muted)" />
                </motion.div>
              ))}
            </div>
          ) : selectedDate ? (
            <div style={styles.emptyState}>
              <CalendarIcon size={32} color="var(--text-muted)" />
              <p style={styles.emptyText}>Tidak ada project dengan deadline di tanggal ini</p>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <CalendarIcon size={32} color="var(--text-muted)" />
              <p style={styles.emptyText}>Klik tanggal untuk melihat project</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.overlay}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              style={styles.modal}
              onClick={e => e.stopPropagation()}
            >
              <div style={styles.modalHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: selectedProject.color || '#10B981' }} />
                  <h3 style={styles.modalTitle}>{selectedProject.name}</h3>
                </div>
                <button style={styles.modalClose} onClick={() => setSelectedProject(null)}>✕</button>
              </div>
              <div style={styles.modalBody}>
                {selectedProject.description && (
                  <p style={styles.modalDesc}>{selectedProject.description}</p>
                )}
                <div style={styles.modalMeta}>
                  <span style={styles.modalMetaItem}>
                    <strong>Status:</strong> {selectedProject.status === 'active' ? 'Aktif' : selectedProject.status === 'completed' ? 'Selesai' : 'Diarsipkan'}
                  </span>
                  <span style={styles.modalMetaItem}>
                    <strong>Deadline:</strong> {formatDate(selectedProject.deadline)}
                  </span>
                  {selectedProject.createdAt && (
                    <span style={styles.modalMetaItem}>
                      <strong>Dibuat:</strong> {formatDate(selectedProject.createdAt)}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  page: {
    padding: '32px 36px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    maxWidth: '1100px',
    margin: '0 auto',
    width: '100%',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  h1: {
    fontSize: 'var(--text-2xl)',
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: '-0.8px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  subtitle: {
    fontSize: 'var(--text-base)',
    color: 'var(--text-muted)',
  },
  twoCol: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  calendarCol: {
    flex: '2 1 400px',
    minWidth: 0,
  },
  taskCol: {
    flex: '1 1 260px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minWidth: 0,
  },
  calendarCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-lg)',
    padding: '20px',
    boxShadow: 'var(--shadow-sm)',
  },
  calendarNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  navBtn: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'var(--t-fast)',
  },
  monthLabel: {
    fontSize: 'var(--text-md)',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  dayHeaders: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    marginBottom: '6px',
  },
  dayHeader: {
    textAlign: 'center',
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    padding: '4px 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
    justifyItems: 'center',
  },
  cell: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--r-md)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    position: 'relative',
    transition: 'background-color 0.12s',
  },
  dotWrap: {
    display: 'flex',
    gap: '2px',
    position: 'absolute',
    bottom: '3px',
  },
  dot: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
  },
  taskCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    flexWrap: 'wrap',
  },
  taskCardTitle: {
    fontSize: 'var(--text-base)',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-md)',
    cursor: 'pointer',
    transition: 'box-shadow 0.12s',
  },
  taskPriority: {
    width: '3px',
    height: '32px',
    borderRadius: '2px',
    flexShrink: 0,
  },
  taskBody: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    overflow: 'hidden',
  },
  taskTitle: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  taskMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap',
  },
  metaProject: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  emptyState: {
    padding: '40px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  emptyText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: 'var(--r-lg)',
    maxWidth: '440px',
    width: '100%',
    boxShadow: 'var(--shadow-xl)',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid var(--border)',
  },
  modalTitle: {
    fontSize: 'var(--text-md)',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  modalClose: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '4px',
  },
  modalBody: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  modalDesc: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    margin: 0,
  },
  modalMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  modalMetaItem: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)',
    display: 'flex',
    gap: '4px',
  },
};
