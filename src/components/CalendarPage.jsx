import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

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

export default function CalendarPage({ tasks = [], boards = [], projects = [] }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const boardMap = useMemo(() => {
    const m = {};
    boards.forEach(b => { m[b.id] = b; });
    return m;
  }, [boards]);

  const projectMap = useMemo(() => {
    const m = {};
    projects.forEach(p => { m[p.id] = p; });
    return m;
  }, [projects]);

  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach(task => {
      if (!task.deadline) return;
      const key = task.deadline.slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(task);
    });
    return map;
  }, [tasks]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const todayStr = today.toISOString().slice(0, 10);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const selectedDateStr = selectedDate ? selectedDate.toISOString().slice(0, 10) : null;
  const selectedTasks = selectedDateStr ? (tasksByDate[selectedDateStr] || []) : [];

  const cellSize = '36px';

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.h1}>
          <CalendarIcon size={20} /> Kalender
        </h1>
        <p style={styles.subtitle}>
          {tasks.filter(t => t.deadline).length} tugas dengan deadline
        </p>
      </div>

      <div style={styles.twoCol}>
        {/* Calendar Grid */}
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
                const dateStr = date.toISOString().slice(0, 10);
                const isToday = dateStr === todayStr;
                const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
                const dayTasks = tasksByDate[dateStr] || [];

                return (
                  <motion.button
                    key={day}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedDate(date)}
                    style={{
                      ...styles.cell,
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: isSelected ? 'var(--emerald)' : isToday ? 'var(--emerald-bg)' : 'transparent',
                      color: isSelected ? '#fff' : isToday ? 'var(--emerald-dark)' : 'var(--text-primary)',
                      fontWeight: isToday || isSelected ? 700 : 500,
                    }}
                  >
                    {day}
                    {dayTasks.length > 0 && (
                      <div style={styles.dotWrap}>
                        {dayTasks.slice(0, 3).map((t, j) => {
                          const board = boardMap[t.boardId];
                          return <div key={j} style={{ ...styles.dot, backgroundColor: board?.color || '#10B981' }} />;
                        })}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Task List */}
        <div style={styles.taskCol}>
          <div style={styles.taskCard}>
            <h2 style={styles.taskCardTitle}>
              {selectedDate
                ? `${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
                : 'Pilih tanggal'}
            </h2>
            <span className="badge badge-emerald">{selectedTasks.length} tugas</span>
          </div>

          {selectedDate && selectedTasks.length > 0 ? (
            <div style={styles.taskList}>
              {selectedTasks.map(task => {
                const board = boardMap[task.boardId];
                const project = projectMap[task.projectId];
                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={styles.taskItem}
                    onClick={() => setSelectedTask(task)}
                  >
                    <div style={{ ...styles.taskPriority, backgroundColor: task.priority === 'High' ? '#EF4444' : task.priority === 'Medium' ? '#F59E0B' : '#D1D5DB' }} />
                    <div style={styles.taskBody}>
                      <span style={styles.taskTitle}>{task.title}</span>
                      <div style={styles.taskMeta}>
                        {board && (
                          <span style={{ ...styles.metaTag, backgroundColor: hexToRgba(board.color || '#10B981', 0.12), color: board.color || '#10B981' }}>
                            {board.name}
                          </span>
                        )}
                        {project && (
                          <span style={styles.metaProject}>{project.name}</span>
                        )}
                        <span style={styles.metaPrio}>{task.priority}</span>
                      </div>
                    </div>
                    <Clock size={12} color="var(--text-muted)" />
                  </motion.div>
                );
              })}
            </div>
          ) : selectedDate ? (
            <div style={styles.emptyState}>
              <CalendarIcon size={32} color="var(--text-muted)" />
              <p style={styles.emptyText}>Tidak ada tugas di tanggal ini</p>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <CalendarIcon size={32} color="var(--text-muted)" />
              <p style={styles.emptyText}>Klik tanggal untuk melihat tugas</p>
            </div>
          )}
        </div>
      </div>

      {/* Simple task detail popup */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.overlay}
            onClick={() => setSelectedTask(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              style={styles.modal}
              onClick={e => e.stopPropagation()}
            >
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>{selectedTask.title}</h3>
                <button style={styles.modalClose} onClick={() => setSelectedTask(null)}>✕</button>
              </div>
              <div style={styles.modalBody}>
                {selectedTask.description && <p style={styles.modalDesc}>{selectedTask.description}</p>}
                <div style={styles.modalMeta}>
                  <span style={styles.modalMetaItem}>
                    <strong>Status:</strong> {selectedTask.status}
                  </span>
                  <span style={styles.modalMetaItem}>
                    <strong>Prioritas:</strong>
                    <span style={{ color: selectedTask.priority === 'High' ? '#EF4444' : selectedTask.priority === 'Medium' ? '#F59E0B' : '#6B7280' }}>
                      {selectedTask.priority}
                    </span>
                  </span>
                  <span style={styles.modalMetaItem}>
                    <strong>Deadline:</strong> {formatDate(selectedTask.deadline)}
                  </span>
                  {(() => {
                    const b = boardMap[selectedTask.boardId];
                    const p = projectMap[selectedTask.projectId];
                    return (
                      <>
                        {b && <span style={styles.modalMetaItem}><strong>Board:</strong> {b.name}</span>}
                        {p && <span style={styles.modalMetaItem}><strong>Project:</strong> {p.name}</span>}
                      </>
                    );
                  })()}
                </div>
                {selectedTask.labels?.length > 0 && (
                  <div style={styles.labelRow}>
                    {selectedTask.labels.map(l => (
                      <span key={l} style={styles.labelTag}>{l}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function hexToRgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
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
  metaTag: {
    fontSize: '10px',
    fontWeight: 600,
    padding: '1px 6px',
    borderRadius: 'var(--r-full)',
  },
  metaProject: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  metaPrio: {
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--text-muted)',
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
  labelRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
  },
  labelTag: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    backgroundColor: 'var(--border)',
    padding: '2px 8px',
    borderRadius: 'var(--r-full)',
  },
};
