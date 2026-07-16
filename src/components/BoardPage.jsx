import React, { useState, useRef, useEffect } from 'react';
import {
  Plus, GripVertical, Calendar, Trash2, Edit3,
  MoreVertical, Circle, CheckCircle2, Clock,
  ChevronDown, FolderPlus, LayoutDashboard, Flag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskDetailModal from './TaskDetailModal';
import ConfirmDialog from './ConfirmDialog';

const COLUMNS = [
  { id: 'todo', title: 'To Do', icon: Circle, color: '#F59E0B' },
  { id: 'inprogress', title: 'In Progress', icon: Clock, color: '#3B82F6' },
  { id: 'done', title: 'Done', icon: CheckCircle2, color: '#10B981' },
];

const LABEL_COLORS = {
  Frontend:     { bg: '#DBEAFE', text: '#1D4ED8' },
  Backend:      { bg: '#D1FAE5', text: '#047857' },
  Database:     { bg: '#EDE9FE', text: '#6D28D9' },
  'UI/UX':      { bg: '#FCE7F3', text: '#BE185D' },
  API:          { bg: '#FEF3C7', text: '#B45309' },
  Dokumentasi:  { bg: '#F3F4F6', text: '#4B5563' },
  Review:       { bg: '#CCFBF1', text: '#0F766E' },
  Perancangan:  { bg: '#E0E7FF', text: '#4338CA' },
};

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

function getStatusFromColumn(columnId) {
  const map = { todo: 'To Do', inprogress: 'In Progress', done: 'Done' };
  return map[columnId] || 'To Do';
}

function getColumnFromStatus(status) {
  const map = { 'To Do': 'todo', 'In Progress': 'inprogress', 'Done': 'done' };
  return map[status] || 'todo';
}

function TaskCard({ task, onDelete, onClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 28, mass: 0.8 }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      style={tcStyles.card}
      whileHover={{ y: -2, boxShadow: 'var(--shadow-md)' }}
    >
      <div style={tcStyles.dragHandle}>
        <GripVertical size={12} color="var(--text-muted)" />
      </div>

      <div style={tcStyles.body}>
        <div style={tcStyles.headerRow}>
          <span style={tcStyles.title}>{task.title}</span>
          <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button
              className="btn-icon"
              style={{ padding: '2px', width: '22px', height: '22px' }}
              onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
            >
              <MoreVertical size={12} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -4 }}
                  transition={{ duration: 0.1 }}
                  style={tcStyles.menu}
                >
                  <button onClick={() => { onClick?.(); setMenuOpen(false); }} style={tcStyles.menuItem}>
                    <Edit3 size={11} /> Detail
                  </button>
                  <button onClick={() => { onDelete?.(task.id); setMenuOpen(false); }} style={{ ...tcStyles.menuItem, color: 'var(--danger)' }}>
                    <Trash2 size={11} /> Hapus
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {task.description && (
          <p style={tcStyles.desc}>{task.description}</p>
        )}

        {task.labels && task.labels.length > 0 && (
          <div style={tcStyles.labels}>
            {task.labels.map((label, i) => {
              const c = LABEL_COLORS[label] || { bg: '#F3F4F6', text: '#4B5563' };
              return (
                <span key={i} style={{ ...tcStyles.label, backgroundColor: c.bg, color: c.text }}>
                  {label}
                </span>
              );
            })}
          </div>
        )}

        {task.deadline && (
          <div style={tcStyles.footer}>
            <span style={tcStyles.date}>
              <Calendar size={10} /> {formatDate(task.deadline)}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

const tcStyles = {
  card: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-lg)',
    display: 'flex',
    gap: '0',
    overflow: 'hidden',
    cursor: 'grab',
    transition: 'box-shadow 0.2s, border-color 0.2s',
    position: 'relative',
  },
  dragHandle: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '10px 4px 0 6px',
    cursor: 'grab',
    flexShrink: 0,
    opacity: 0.4,
    transition: 'opacity 0.2s',
  },
  body: {
    flex: 1,
    padding: '10px 12px 10px 4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: 0,
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '4px',
  },
  title: {
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    lineHeight: 1.3,
    flex: 1,
  },
  desc: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  labels: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
  },
  label: {
    fontSize: '10px',
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 'var(--r-full)',
    letterSpacing: '0.2px',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '8px',
    marginTop: '2px',
  },
  date: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    fontSize: '10px',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  menu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '2px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-md)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 20,
    overflow: 'hidden',
    minWidth: '90px',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    width: '100%',
    padding: '6px 10px',
    border: 'none',
    background: 'none',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'var(--t-fast)',
    textAlign: 'left',
  },
};

function Column({ column, tasks, onTaskDrop, onDeleteTask, onTaskClick }) {
  const [dragOver, setDragOver] = useState(false);
  const Icon = column.icon;

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onTaskDrop(taskId, column.id);
    }
  };

  return (
    <motion.div
      layout
      style={{
        ...colStyles.column,
        borderColor: dragOver ? column.color : 'var(--border)',
        backgroundColor: dragOver ? 'var(--bg-card-hover)' : 'transparent',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div style={colStyles.header}>
        <div style={{ ...colStyles.headerLeft, color: column.color }}>
          <Icon size={16} strokeWidth={2.5} />
          <span style={colStyles.headerTitle}>{column.title}</span>
          <span style={{ ...colStyles.count, backgroundColor: `${column.color}18`, color: column.color }}>
            {tasks.length}
          </span>
        </div>
      </div>

      <div style={colStyles.taskList}>
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={colStyles.empty}
            >
              <p style={colStyles.emptyText}>Belum ada tugas</p>
              <p style={{ ...colStyles.emptySub, color: column.color }}>
                Seret tugas ke sini
              </p>
            </motion.div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
                onClick={() => onTaskClick?.(task)}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const colStyles = {
  column: {
    flex: '1 1 0',
    minWidth: '280px',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--r-xl)',
    padding: '16px',
    transition: 'border-color 0.2s, background-color 0.2s',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  headerTitle: {
    fontSize: 'var(--text-base)',
    fontWeight: 700,
    letterSpacing: '-0.2px',
  },
  count: {
    fontSize: '11px',
    fontWeight: 700,
    padding: '1px 7px',
    borderRadius: 'var(--r-full)',
    lineHeight: '18px',
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minHeight: '100px',
    flex: 1,
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 16px',
    gap: '4px',
    border: '1.5px dashed var(--border)',
    borderRadius: 'var(--r-lg)',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  emptySub: {
    fontSize: '11px',
    fontWeight: 600,
    opacity: 0.7,
  },
};

function ProjectFilter({ projects = [], value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = projects.find(p => p.id === value);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={pfStyles.trigger}
      >
        {selected && (
          <div style={{ ...pfStyles.dot, backgroundColor: selected.color }} />
        )}
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {selected?.name ?? 'Pilih Project'}
        </span>
        <ChevronDown size={13} color="var(--text-muted)" style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.13 }}
            style={pfStyles.dropdown}
          >
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => { onChange(p.id); setOpen(false); }}
                style={{ ...pfStyles.option, fontWeight: value === p.id ? 700 : 500 }}
              >
                <div style={{ ...pfStyles.dot, backgroundColor: p.color }} />
                {p.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const pfStyles = {
  trigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-card)',
    cursor: 'pointer',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    right: 0,
    minWidth: '180px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-md)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 50,
    overflow: 'hidden',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '9px 14px',
    border: 'none',
    background: 'none',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    textAlign: 'left',
  },
};

export default function BoardPage({
  tasks = [],
  onUpdateTasks,
  projects = [],
  boards = [],
  currentProjectId = 'all',
  onSelectProject = () => {},
  onCreateBoard = () => {},
  onCompleteProject = () => {},
  onAddProject = () => {},
  onDeleteProject = () => {},
}) {
  const selectedProject = currentProjectId;
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const currentProject = projects.find(p => p.id === selectedProject);
  const hasProjectSelected = selectedProject !== 'all' && currentProject;
  const projectBoards = hasProjectSelected
    ? boards.filter(b => b.projectId === selectedProject)
    : [];
  const projectTasks = hasProjectSelected
    ? tasks.filter(t => t.projectId === selectedProject)
    : [];

  const allDone = projectTasks.length > 0 && projectTasks.every(t => t.status === 'Done');
  const isCompleted = currentProject?.completed;

  const handleTaskDrop = (taskId, toColumnId) => {
    const newStatus = getStatusFromColumn(toColumnId);
    const updatedTasks = tasks.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    onUpdateTasks?.(updatedTasks);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Hapus tugas ini?')) {
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      onUpdateTasks?.(updatedTasks);
    }
  };

  const handleSaveTask = (updatedTask) => {
    const updatedTasks = tasks.map(t =>
      t.id === updatedTask.id ? updatedTask : t
    );
    onUpdateTasks?.(updatedTasks);
  };

  const grouped = {
    todo: projectTasks.filter(t => getColumnFromStatus(t.status) === 'todo'),
    inprogress: projectTasks.filter(t => getColumnFromStatus(t.status) === 'inprogress'),
    done: projectTasks.filter(t => getColumnFromStatus(t.status) === 'done'),
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>Board</h1>
          <p style={styles.subtitle}>Kelola tugas Anda dengan drag & drop antar kolom.</p>
        </div>
        <div style={styles.headerActions}>
          <button className="btn btn-ghost btn-sm" onClick={onAddProject}>
            <FolderPlus size={14} /> Project Baru
          </button>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ProjectFilter
              projects={projects}
              value={selectedProject}
              onChange={onSelectProject}
            />
            {hasProjectSelected && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                title="Hapus project"
                style={styles.deleteProjectBtn}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
          {hasProjectSelected && (
            <>
              <button className="btn btn-primary btn-sm" onClick={onCreateBoard}>
                <Plus size={15} /> Buat Board
              </button>
              <span style={styles.totalBadge}>
                {projectTasks.length} Tugas
              </span>
            </>
          )}
        </div>
      </div>

      {/* No project selected */}
      {!hasProjectSelected && (
        <div style={styles.noProject}>
          <FolderPlus size={48} color="var(--text-muted)" />
          <h2 style={styles.noProjectTitle}>Pilih atau Buat Project</h2>
          <p style={styles.noProjectText}>
            Pilih project dari dropdown di atas, atau buat project baru untuk mulai bekerja.
          </p>
          <button className="btn btn-primary" onClick={onAddProject} style={{ marginTop: '4px' }}>
            <Plus size={16} /> Buat Project Baru
          </button>
        </div>
      )}

      {/* Project completion banner */}
      {/* Project completion banner */}
      {hasProjectSelected && !isCompleted && allDone && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.completeBanner}
        >
          <div style={styles.completeBannerLeft}>
            <CheckCircle2 size={20} color="#10B981" />
            <span style={styles.completeBannerText}>
              Semua tugas di project <strong>{currentProject.name}</strong> sudah selesai!
            </span>
          </div>
          <button
            onClick={() => onCompleteProject(currentProject.id)}
            style={styles.completeBtn}
          >
            <Flag size={14} /> Tandai Selesai
          </button>
        </motion.div>
      )}

      {hasProjectSelected && currentProject?.completed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ ...styles.completeBanner, backgroundColor: '#D1FAE5', borderColor: '#10B981' }}
        >
          <div style={styles.completeBannerLeft}>
            <CheckCircle2 size={20} color="#10B981" />
            <span style={{ ...styles.completeBannerText, color: '#047857' }}>
              Project <strong>{currentProject.name}</strong> sudah selesai
            </span>
          </div>
        </motion.div>
      )}

      {/* Board columns */}
      {hasProjectSelected && projectBoards.length > 0 && (
        <motion.div layout style={styles.board}>
          {COLUMNS.map(col => (
            <Column
              key={col.id}
              column={col}
              tasks={grouped[col.id]}
              onTaskDrop={handleTaskDrop}
              onDeleteTask={handleDeleteTask}
              onTaskClick={setSelectedTask}
            />
          ))}
        </motion.div>
      )}

      {hasProjectSelected && projectBoards.length === 0 && (
        <div style={styles.emptyBoard}>
          <LayoutDashboard size={48} color="var(--text-muted)" />
          <h3 style={styles.emptyBoardTitle}>Belum Ada Board</h3>
          <p style={styles.emptyBoardText}>
            Buat board pertama untuk project <strong>{currentProject.name}</strong> dan mulai kelola tugas Anda.
          </p>
          <button className="btn btn-primary" onClick={onCreateBoard} style={{ padding: '10px 24px', fontSize: '15px' }}>
            <Plus size={16} /> Buat Board Baru
          </button>
        </div>
      )}

      <TaskDetailModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onSave={handleSaveTask}
        task={selectedTask}
        boards={boards}
        projects={projects}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => onDeleteProject(selectedProject)}
        title="Hapus Project"
        message={`Yakin ingin menghapus project "${currentProject?.name}"? Semua board dan tugas di dalamnya juga akan ikut terhapus.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        danger
      />
    </div>
  );
}

const styles = {
  page: {
    padding: '32px 36px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    maxWidth: '1280px',
    margin: '0 auto',
    width: '100%',
    height: '100%',
  },
  header: {
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
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  totalBadge: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--emerald-dark)',
    backgroundColor: 'var(--emerald-bg)',
    padding: '6px 14px',
    borderRadius: 'var(--r-full)',
  },
  board: {
    display: 'flex',
    gap: '20px',
    flex: 1,
    alignItems: 'flex-start',
    overflowX: 'auto',
    paddingBottom: '20px',
  },
  completeBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
    padding: '14px 20px',
    borderRadius: 'var(--r-lg)',
    border: '1.5px solid #A7F3D0',
    backgroundColor: '#ECFDF5',
  },
  completeBannerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  completeBannerText: {
    fontSize: 'var(--text-base)',
    color: '#065F46',
    fontWeight: 500,
  },
  completeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 18px',
    borderRadius: 'var(--r-md)',
    border: 'none',
    backgroundColor: '#000',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '13px',
  },
  emptyBoard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '14px',
    padding: '60px 40px',
    border: '2px dashed var(--border)',
    borderRadius: 'var(--r-xl)',
    textAlign: 'center',
  },
  deleteProjectBtn: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--r-sm)',
    border: 'none',
    background: 'transparent',
    color: '#EF4444',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
    opacity: 0.6,
  },
  emptyBoardTitle: {
    fontSize: 'var(--text-lg)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.3px',
  },
  emptyBoardText: {
    fontSize: 'var(--text-base)',
    color: 'var(--text-muted)',
    maxWidth: '320px',
    lineHeight: 1.5,
  },
  noProject: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '80px 40px',
    border: '2px dashed var(--border)',
    borderRadius: 'var(--r-xl)',
    textAlign: 'center',
    flex: 1,
  },
  noProjectTitle: {
    fontSize: 'var(--text-xl)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.5px',
  },
  noProjectText: {
    fontSize: 'var(--text-base)',
    color: 'var(--text-muted)',
    maxWidth: '380px',
    lineHeight: 1.5,
  },
};
