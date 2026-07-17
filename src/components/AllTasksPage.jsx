import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ListChecks, Calendar } from 'lucide-react';
import TaskDetailView from './TaskDetailView';

const STATUS_COLORS = {
  'To Do': '#F59E0B',
  'In Progress': '#3B82F6',
  'Done': '#10B981',
};

const PRIORITY_COLORS = {
  High: '#EF4444',
  Medium: '#F59E0B',
  Low: '#6B7280',
};

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isOverdue(iso) {
  if (!iso) return false;
  return new Date(iso) < new Date() && !isToday(iso);
}

function isToday(iso) {
  if (!iso) return false;
  return new Date(iso).toDateString() === new Date().toDateString();
}

export default function AllTasksPage({ tasks, boards, projects }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter && t.status !== statusFilter) return false;
      if (priorityFilter && t.priority !== priorityFilter) return false;
      if (projectFilter && t.projectId !== projectFilter) return false;
      return true;
    });
  }, [tasks, search, statusFilter, priorityFilter, projectFilter]);

  const hasActiveFilters = search || statusFilter || priorityFilter || projectFilter;

  const getProjectName = (id) => projects.find(p => p.id === id)?.name || '-';

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.h1}>All Tasks</h1>
          <p style={styles.subtitle}>
            {filteredTasks.length} tugas
            {hasActiveFilters && ` (dari ${tasks.length})`}
          </p>
        </div>
      </div>

      <div style={styles.filterBar}>
        <div style={styles.searchWrapper}>
          <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            placeholder="Cari tugas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">Semua Status</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">Semua Prioritas</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          value={projectFilter}
          onChange={e => setProjectFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">Semua Project</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <div style={styles.empty}>
          <ListChecks size={36} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
          <p style={styles.emptyText}>
            {hasActiveFilters ? 'Tidak ada tugas yang cocok.' : 'Belum ada tugas.'}
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task, i) => {
              const deadline = formatDate(task.deadline);
              const overdue = isOverdue(task.deadline);
              const today = isToday(task.deadline);
              const subtaskTotal = task.subtasks?.length || 0;
              const subtaskDone = task.subtasks?.filter(s => s.done).length || 0;

              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.025, duration: 0.2 }}
                  style={styles.card}
                  onClick={() => setSelectedTask(task)}
                >
                  <div style={{
                    ...styles.priorityBar,
                    backgroundColor: PRIORITY_COLORS[task.priority] || '#6B7280',
                  }} />
                  <div style={styles.cardBody}>
                    <div style={styles.cardTop}>
                      <span style={styles.cardTitle}>{task.title}</span>
                    </div>
                    <div style={styles.badgeRow}>
                      <span style={{
                        ...styles.badge,
                        backgroundColor: `${STATUS_COLORS[task.status]}18`,
                        color: STATUS_COLORS[task.status],
                      }}>{task.status}</span>
                      <span style={{
                        ...styles.badge,
                        backgroundColor: `${PRIORITY_COLORS[task.priority]}18`,
                        color: PRIORITY_COLORS[task.priority],
                      }}>{task.priority}</span>
                      {deadline && (
                        <span style={{
                          ...styles.badge,
                          backgroundColor: overdue ? 'var(--danger-bg)' : today ? 'var(--warning-bg)' : 'var(--border)',
                          color: overdue ? 'var(--danger)' : today ? 'var(--warning)' : 'var(--text-secondary)',
                        }}>
                          <Calendar size={10} style={{ marginRight: 3 }} />
                          {deadline}
                        </span>
                      )}
                      {subtaskTotal > 0 && (
                        <span style={{
                          ...styles.badge,
                          backgroundColor: 'var(--lavender)',
                          color: '#7C3AED',
                        }}>
                          {subtaskDone}/{subtaskTotal}
                        </span>
                      )}
                    </div>
                    {task.labels?.length > 0 && (
                      <div style={styles.labelRow}>
                        {task.labels.map(l => (
                          <span key={l} style={styles.label}>{l}</span>
                        ))}
                      </div>
                    )}
                    <div style={styles.metaRow}>
                      <span>{boards.find(b => b.id === task.boardId)?.name || '-'}</span>
                      <span style={{ color: 'var(--border-strong)' }}>·</span>
                      <span>{getProjectName(task.projectId)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <TaskDetailView
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        boards={boards}
        projects={projects}
      />
    </div>
  );
}

const styles = {
  page: {
    padding: '32px 36px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '1280px',
    margin: '0 auto',
    width: '100%',
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
  },
  h1: {
    fontSize: 'var(--text-2xl)',
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: '-0.8px',
    lineHeight: 1.1,
  },
  subtitle: {
    marginTop: '4px',
    fontSize: 'var(--text-base)',
    color: 'var(--text-muted)',
  },
  filterBar: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 12px',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-input)',
    flex: '1 1 200px',
    minWidth: '160px',
  },
  searchInput: {
    flex: 1,
    padding: '8px 0',
    border: 'none',
    background: 'none',
    color: 'var(--text-primary)',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'inherit',
  },
  select: {
    padding: '7px 28px 7px 10px',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontSize: '12px',
    fontWeight: 500,
    outline: 'none',
    fontFamily: 'inherit',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '12px',
  },
  card: {
    display: 'flex',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s, transform 0.2s',
  },
  priorityBar: {
    width: '4px',
    flexShrink: 0,
  },
  cardBody: {
    flex: 1,
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '8px',
  },
  cardTitle: {
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  badgeRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: 'var(--r-full)',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.2px',
  },
  labelRow: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
  },
  label: {
    padding: '2px 7px',
    borderRadius: 'var(--r-full)',
    fontSize: '10px',
    fontWeight: 600,
    backgroundColor: 'var(--emerald-bg)',
    color: 'var(--emerald-dark)',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  empty: {
    padding: '60px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    border: '1px dashed var(--border)',
    borderRadius: 'var(--r-lg)',
  },
  emptyText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
  },
};
