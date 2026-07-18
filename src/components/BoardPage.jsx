import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Plus, Calendar, Trash2, CheckCircle2, Circle,
  ChevronDown, ChevronRight, FolderPlus, LayoutDashboard,
  Flag, ListChecks, Clock, GripVertical,
  MoreHorizontal, Users, Layers, ArrowRight, ArrowLeft,
  Folder, KanbanSquare, SquareStack, Archive, Search, X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskDetailModal from './TaskDetailModal';
import ConfirmDialog from './ConfirmDialog';
import Dropdown from './Dropdown';

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

function SubtasksPreview({ subtasks, onToggleSubtask, taskId }) {
  const [open, setOpen] = useState(false);
  const total = subtasks?.length || 0;
  const done = subtasks?.filter(s => s.done).length || 0;
  if (total === 0) return null;

  return (
    <div style={{ marginTop: '2px' }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        style={spStyles.toggle}
      >
        <span style={spStyles.summary}>
          <ListChecks size={9} />
          {done}/{total}
        </span>
        {open ? <ChevronDown size={9} /> : <ChevronRight size={9} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={spStyles.list}>
              {subtasks.map(st => (
                <div key={st.id} style={spStyles.item}>
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleSubtask(taskId, st.id); }}
                    style={spStyles.checkBtn}
                  >
                    <div style={{
                      ...spStyles.checkbox,
                      backgroundColor: st.done ? '#10B981' : 'transparent',
                      borderColor: st.done ? '#10B981' : 'var(--border-strong)',
                    }}>
                      {st.done && <CheckCircle2 size={7} color="#fff" />}
                    </div>
                  </button>
                  <span style={{
                    ...spStyles.text,
                    textDecoration: st.done ? 'line-through' : 'none',
                    color: st.done ? 'var(--text-muted)' : 'var(--text-secondary)',
                  }}>{st.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const spStyles = {
  toggle: {
    display: 'flex', alignItems: 'center', gap: '3px',
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '1px 4px', borderRadius: 'var(--r-sm)',
    fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600,
  },
  summary: { display: 'flex', alignItems: 'center', gap: '3px' },
  list: { padding: '3px 0 1px 8px', display: 'flex', flexDirection: 'column', gap: '2px' },
  item: { display: 'flex', alignItems: 'center', gap: '5px', padding: '1px 0' },
  checkBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' },
  checkbox: { width: '12px', height: '12px', borderRadius: '3px', border: '1.5px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--t-fast)' },
  text: { fontSize: '10px', fontWeight: 500, lineHeight: 1.3 },
};

function BoardTask({ task, onToggleTask, onToggleSubtask }) {
  const isDone = task.status === 'Done';

  return (
    <div style={btStyles.row}>
      <button
        onClick={(e) => { e.stopPropagation(); onToggleTask(task.id); }}
        style={btStyles.checkBtn}
        title={isDone ? 'Tandai belum selesai' : 'Tandai selesai'}
      >
        <div style={{
          ...btStyles.checkbox,
          backgroundColor: isDone ? '#10B981' : 'transparent',
          borderColor: isDone ? '#10B981' : 'var(--border-strong)',
        }}>
          {isDone && <CheckCircle2 size={8} color="#fff" />}
        </div>
      </button>
      <div style={btStyles.content}>
        <span style={{
          ...btStyles.title,
          textDecoration: isDone ? 'line-through' : 'none',
          color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
        }}>{task.title}</span>
        {task.deadline && (
          <div style={btStyles.dateRow}>
            <Calendar size={8} /> {formatDate(task.deadline)}
        </div>
      )}

        <SubtasksPreview subtasks={task.subtasks} onToggleSubtask={onToggleSubtask} taskId={task.id} />
      </div>
    </div>
  );
}

const btStyles = {
  row: {
    display: 'flex', gap: '6px', alignItems: 'flex-start',
    padding: '4px 0', transition: 'background-color 0.15s',
  },
  checkBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '2px 0 0 0', flexShrink: 0,
  },
  checkbox: {
    width: '16px', height: '16px', borderRadius: '4px',
    border: '2px solid',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'var(--t-fast)',
  },
  content: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' },
  title: { fontSize: '12px', fontWeight: 600, lineHeight: 1.3 },
  dateRow: { display: 'flex', alignItems: 'center', gap: '3px', fontSize: '9px', color: 'var(--text-muted)', fontWeight: 500 },
};

function BoardCard({ board, tasks, onToggleTask, onToggleSubtask, onDeleteBoard, onAddTask, onMoveBoard }) {
  const [newTitle, setNewTitle] = useState('');
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [hoveredColId, setHoveredColId] = useState(null);

  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'Done').length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const isComplete = pct === 100 && total > 0;

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', board.id);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.5';
  };
  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.12 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 28, mass: 0.8 }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        ...bcStyles.card,
        borderColor: isComplete ? '#A7F3D0' : 'var(--border)',
      }}
      whileHover={{ y: -1, boxShadow: 'var(--shadow-md)' }}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'; }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; }}
    >
      <div style={{ ...bcStyles.colorBar, backgroundColor: board.color || '#6366F1' }} />

      <div style={bcStyles.body}>
        <div style={bcStyles.dragHandle}>
          <GripVertical size={12} color="var(--text-muted)" />
        </div>

        <div style={bcStyles.header}>
          <h3 style={bcStyles.name}>{board.name}</h3>
          {isComplete && (
            <span style={bcStyles.completeBadge}>
              <CheckCircle2 size={9} /> Selesai
            </span>
          )}
          
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
    <button
      onClick={(e) => { e.stopPropagation(); setShowMoveMenu(!showMoveMenu); }}
      style={bcStyles.moveBtn}
      title="Pindahkan board"
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'; e.currentTarget.style.opacity = '1'; }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.opacity = ''; }}
    >
      <MoreHorizontal size={14} />
    </button>
            <AnimatePresence>
              {showMoveMenu && (
                <>
                  <div 
                    style={{
                      position: 'fixed',
                      inset: 0,
                      zIndex: 100,
                    }}
                    onClick={(e) => { e.stopPropagation(); setShowMoveMenu(false); }}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 4 }}
                    transition={{ duration: 0.1 }}
                    style={bcStyles.moveMenu}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={bcStyles.moveMenuHeader}>Pindahkan ke:</div>
                    {COLUMNS.filter(col => col.id !== board.status).map(col => (
                      <button
                        key={col.id}
                        onMouseEnter={() => setHoveredColId(col.id)}
                        onMouseLeave={() => setHoveredColId(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveBoard?.(board.id, col.id);
                          setShowMoveMenu(false);
                        }}
                        style={{
                          ...bcStyles.moveMenuItem,
                          color: col.color,
                          backgroundColor: hoveredColId === col.id ? 'var(--bg-card-hover)' : 'transparent',
                        }}
                      >
                        {col.title}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => onDeleteBoard(board.id)}
            style={bcStyles.deleteBtn}
            title="Hapus board"
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FEE2E2'; e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.opacity = ''; }}
          >
            <Trash2 size={14} />
          </button>
        </div>

        {board.description && (
          <p style={bcStyles.desc}>{board.description}</p>
        )}

        <div style={bcStyles.progressWrap}>
          <div style={bcStyles.progressBar}>
            <motion.div
              layout
              style={{
                ...bcStyles.progressFill,
                width: `${pct}%`,
                backgroundColor: isComplete ? '#10B981' : board.color || '#6366F1',
              }}
            />
          </div>
          <span style={bcStyles.progressText}>{pct}%</span>
        </div>

        <div style={bcStyles.dateRow}>
          <Calendar size={9} />
          <span>{board.createdAt ? formatDate(board.createdAt) : '-'}</span>
        </div>

        <div style={bcStyles.taskList}>
          {tasks.length === 0 ? (
            <div style={bcStyles.emptyTasks}>Belum ada tugas</div>
          ) : (
            tasks.map(task => (
              <BoardTask
                key={task.id}
                task={task}
                onToggleTask={onToggleTask}
                onToggleSubtask={onToggleSubtask}
              />
            ))
          )}
        </div>

        <div style={bcStyles.addTaskRow}>
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && newTitle.trim()) {
                onAddTask?.(board.id, newTitle.trim());
                setNewTitle('');
              }
            }}
            placeholder="+ Tambah tugas..."
            style={bcStyles.addTaskInput}
          />
          {newTitle.trim() && (
            <button
              onClick={() => { onAddTask?.(board.id, newTitle.trim()); setNewTitle(''); }}
              style={bcStyles.addTaskBtn}
            >
              <Plus size={12} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const bcStyles = {
  card: {
    display: 'flex',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-xl)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
    transition: 'border-color 0.2s, box-shadow 0.2s, background-color 0.15s',
    cursor: 'grab',
  },
  colorBar: { width: '4px', flexShrink: 0 },
  body: {
    flex: 1, padding: '12px 14px 12px 6px',
    display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0,
  },
  dragHandle: {
    display: 'flex', justifyContent: 'center', opacity: 0.3, marginBottom: '2px',
  },
  header: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' },
  name: { fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.3px', flex: 1 },
  completeBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '3px',
    fontSize: '9px', fontWeight: 700, color: '#047857',
    backgroundColor: '#D1FAE5', padding: '1px 6px',
    borderRadius: 'var(--r-full)',
  },
  deleteBtn: {
    width: '26px', height: '26px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 'var(--r-sm)', border: 'none', background: 'transparent',
    color: '#EF4444', cursor: 'pointer', opacity: 0.75, flexShrink: 0,
    transition: 'background-color 0.15s, opacity 0.15s',
  },
  desc: { fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 },
  progressWrap: { display: 'flex', alignItems: 'center', gap: '6px' },
  progressBar: {
    flex: 1, height: '5px', borderRadius: 'var(--r-full)',
    backgroundColor: 'var(--border)', overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 'var(--r-full)', transition: 'width 0.3s ease' },
  progressText: { fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', minWidth: '28px', textAlign: 'right' },
  dateRow: { display: 'flex', alignItems: 'center', gap: '3px', fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' },
  taskList: { display: 'flex', flexDirection: 'column', gap: '1px', marginTop: '2px' },
  emptyTasks: { fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '4px 0' },
  addTaskRow: {
    display: 'flex', alignItems: 'center', gap: '4px',
    marginTop: '4px', paddingTop: '4px', borderTop: '1px solid var(--border)',
  },
  addTaskInput: {
    flex: 1, padding: '5px 8px', borderRadius: 'var(--r-sm)',
    border: '1px solid var(--border)', backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)', fontSize: '11px', outline: 'none',
    fontFamily: 'inherit',
  },
  addTaskBtn: {
    width: '22px', height: '22px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', borderRadius: 'var(--r-sm)', border: 'none',
    backgroundColor: 'var(--text-muted)', color: '#fff', cursor: 'pointer',
    flexShrink: 0,
  },
  moveBtn: {
    width: '26px', height: '26px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 'var(--r-sm)', border: 'none', background: 'transparent',
    color: 'var(--text-secondary)', cursor: 'pointer', opacity: 0.75, flexShrink: 0,
    transition: 'background-color 0.15s, opacity 0.15s',
  },
  moveMenu: {
    position: 'absolute', right: 0, top: 'calc(100% + 4px)',
    minWidth: '120px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-md)',
    boxShadow: 'var(--shadow-md)',
    zIndex: 101,
    padding: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  moveMenuHeader: {
    fontSize: '9px',
    fontWeight: 700,
    color: 'var(--text-muted)',
    padding: '4px 8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid var(--border)',
    marginBottom: '2px',
    textAlign: 'left',
  },
  moveMenuItem: {
    display: 'flex', alignItems: 'center',
    width: '100%', padding: '6px 8px',
    border: 'none', background: 'none', cursor: 'pointer',
    fontSize: '11px', fontWeight: 600,
    textAlign: 'left', borderRadius: 'var(--r-sm)',
    transition: 'background-color 0.1s',
    fontFamily: 'inherit',
  },
};

function BoardColumn({ column, boards, tasks, onTaskDrop, onToggleTask, onToggleSubtask, onDeleteBoard, onAddTask, getBoardTasks, isMobile, onMoveBoard }) {
  const [dragOver, setDragOver] = useState(false);
  const Icon = column.icon;

  return (
    <motion.div
      layout
      style={{
        ...colStyles.column,
        borderColor: dragOver ? column.color : 'var(--border)',
        backgroundColor: dragOver ? 'var(--bg-card-hover)' : 'transparent',
        minWidth: isMobile ? '100%' : colStyles.column.minWidth,
        maxWidth: isMobile ? '100%' : colStyles.column.maxWidth,
        maxHeight: isMobile ? 'none' : colStyles.column.maxHeight,
      }}
      onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => {
        e.preventDefault();
        setDragOver(false);
        const id = e.dataTransfer.getData('text/plain');
        if (id) onTaskDrop(id, column.id);
      }}
    >
      <div style={colStyles.header}>
        <div style={{ ...colStyles.headerLeft, color: column.color }}>
          <Icon size={15} strokeWidth={2.5} />
          <span style={colStyles.headerTitle}>{column.title}</span>
          <span style={{ ...colStyles.count, backgroundColor: `${column.color}18`, color: column.color }}>
            {boards.length}
          </span>
        </div>
      </div>

      <div style={colStyles.boardList}>
        <AnimatePresence mode="popLayout">
          {boards.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={colStyles.empty}>
              <p style={colStyles.emptyText}>Belum ada board</p>
            </motion.div>
          ) : (
            boards.map(board => (
              <BoardCard
                key={board.id}
                board={board}
                tasks={getBoardTasks(board.id)}
                onToggleTask={onToggleTask}
                onToggleSubtask={onToggleSubtask}
                onDeleteBoard={onDeleteBoard}
                onAddTask={onAddTask}
                onMoveBoard={onMoveBoard}
              />
            )))}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

const colStyles = {
  column: {
    flex: 1, minWidth: '280px', maxWidth: '440px',
    display: 'flex', flexDirection: 'column',
    borderRadius: 'var(--r-xl)',
    border: '1.5px solid var(--border)',
    transition: 'border-color 0.15s, background-color 0.15s',
    maxHeight: 'calc(100vh - 200px)',
  },
  header: {
    padding: '14px 16px',
    borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexShrink: 0,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '7px' },
  headerTitle: { fontSize: '13px', fontWeight: 700, letterSpacing: '-0.2px' },
  count: {
    fontSize: '11px', fontWeight: 700, padding: '1px 8px', borderRadius: 'var(--r-full)',
  },
  boardList: {
    flex: 1, overflowY: 'auto',
    padding: '8px', display: 'flex', flexDirection: 'column', gap: '10px',
  },
  empty: { padding: '20px', textAlign: 'center' },
  emptyText: { fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' },
};

function ProjectFilter({ projects, value, onChange }) {
  return (
    <Dropdown
      value={value}
      onChange={onChange}
      options={[
        { value: 'all', label: 'Semua Project', icon: FolderPlus },
        ...projects.map(p => ({ value: p.id, label: p.name, icon: FolderPlus })),
      ]}
      placeholder="Semua Project"
    />
  );
}

function ProjectCardMenu({ project, isActive, onSelectProject, onDeleteProject, onUpdateProjects, onArchiveRequest, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handleOpen = () => { onSelectProject(project.id); onClose(); };
  const handleReopen = () => { onUpdateProjects(prev => prev.map(p => p.id === project.id ? { ...p, status: 'active' } : p)); onClose(); };
  const handleArchive = () => { onArchiveRequest(project.id); onClose(); };
  const handleDelete = () => { onDeleteProject(project.id); onClose(); };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.96 }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
      style={styles.cardMenu}
      onClick={(e) => e.stopPropagation()}
    >
      <button style={styles.cardMenuItem} onClick={handleOpen}>
        <ArrowRight size={14} /> Open Project
      </button>
      {!isActive && (
        <button style={styles.cardMenuItem} onClick={handleReopen}>
          <FolderPlus size={14} /> Reopen Project
        </button>
      )}
      {isActive && (
        <button style={styles.cardMenuItem} onClick={handleArchive}>
          <Archive size={14} /> Archive Project
        </button>
      )}
      <div style={styles.cardMenuDivider} />
      <button style={{ ...styles.cardMenuItem, color: '#EF4444' }} onClick={handleDelete}>
        <Trash2 size={14} /> Delete Project
      </button>
    </motion.div>
  );
}

export default function BoardPage({
  tasks, onUpdateTasks, boards, onUpdateBoards, projects,
  currentProjectId, onSelectProject,
  onCreateBoard, onCompleteProject,
  onAddProject, onDeleteProject, onDeleteBoard,
  onUpdateProjects,
}) {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 960;
  const isXS = windowWidth < 480;

  const [selectedTask, setSelectedTask] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [menuProjectId, setMenuProjectId] = useState(null);
  const [viewMode, setViewMode] = useState('projects');
  const [archiveConfirmId, setArchiveConfirmId] = useState(null);
  const [completeConfirmId, setCompleteConfirmId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const selectedProject = currentProjectId;
  const hasProjectSelected = selectedProject && selectedProject !== 'all';
  const currentProject = projects.find(p => p.id === selectedProject);

  const projectBoards = useMemo(() =>
    boards.filter(b => b.projectId === selectedProject),
    [boards, selectedProject]
  );

  const projectTasks = useMemo(() =>
    tasks.filter(t => t.projectId === selectedProject),
    [tasks, selectedProject]
  );

  const q = searchQuery.toLowerCase().trim();
  const filteredBoards = q ? projectBoards.filter(b => b.name.toLowerCase().includes(q)) : projectBoards;

  const groupedBoards = useMemo(() => {
    const map = { todo: [], inprogress: [], done: [] };
    for (const board of filteredBoards) {
      const boardTasks = projectTasks.filter(t => t.boardId === board.id);
      const allDone = boardTasks.length > 0 && boardTasks.every(t => t.status === 'Done');
      const effectiveStatus = allDone ? 'done' : board.status;
      (map[effectiveStatus] || map.todo).push(board);
    }
    return map;
  }, [filteredBoards, projectTasks]);

  const activeProjects = useMemo(() => projects.filter(p => p.status === 'active'), [projects]);
  const completedProjects = useMemo(() => projects.filter(p => p.status === 'completed'), [projects]);
  const archivedProjects = useMemo(() => projects.filter(p => p.status === 'archived'), [projects]);
  const visibleProjects = viewMode === 'archived' ? archivedProjects : viewMode === 'completed' ? completedProjects : activeProjects;

  const filteredProjects = q ? visibleProjects.filter(p => p.name.toLowerCase().includes(q)) : visibleProjects;
  const filterTasks = (tasks) => q ? tasks.filter(t => t.title.toLowerCase().includes(q)) : tasks;

  const allDone = projectTasks.length > 0 && projectTasks.every(t => t.status === 'Done') && currentProject?.status === 'active';
  const isCompleted = currentProject?.status === 'completed';

  const handleBoardDrop = (boardId, columnId) => {
    onUpdateBoards(prev => prev.map(b =>
      b.id === boardId ? { ...b, status: columnId } : b
    ));
  };

  const handleTaskToggle = (taskId) => {
    onUpdateTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const newStatus = t.status === 'Done' ? 'To Do' : 'Done';
      return { ...t, status: newStatus, completedAt: newStatus === 'Done' ? new Date().toISOString() : undefined };
    }));
  };

  const handleSubtaskToggle = (taskId, subtaskId) => {
    onUpdateTasks(prev => prev.map(t => {
      if (t.id !== taskId || !t.subtasks) return t;
      return { ...t, subtasks: t.subtasks.map(st => st.id === subtaskId ? { ...st, done: !st.done } : st) };
    }));
  };

  const handleAddTask = (boardId, title) => {
    onUpdateTasks(prev => [{
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      projectId: selectedProject,
      boardId,
      title,
      description: null,
      priority: 'Medium',
      status: 'To Do',
      deadline: null,
      labels: [],
      subtasks: [],
    }, ...prev]);
  };

  const handleSaveTask = (updatedTask) => {
    onUpdateTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setSelectedTask(null);
  };

  const getBoardTasks = (boardId) => filterTasks(projectTasks.filter(t => t.boardId === boardId));

  return (
    <div style={{
      ...styles.page,
      padding: isMobile ? '16px 16px 32px' : '32px 36px',
    }}>
      <div style={{
        ...styles.header,
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'flex-start',
        gap: isMobile ? '12px' : '16px',
      }}>
        <div>
          <h1 style={styles.h1}>Boards</h1>
          {hasProjectSelected && (
            <p style={styles.subtitle}>{projectTasks.length} tugas di {projectBoards.length} board</p>
          )}
        </div>
        <div style={{
          ...styles.headerActions,
          flexWrap: 'wrap',
          marginTop: isMobile ? '4px' : '0',
        }}>
          <motion.div
            ref={searchRef}
            animate={{ width: isSearchOpen || searchQuery ? 200 : 36 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28, mass: 0.8 }}
            style={styles.searchBar}
          >
            <Search size={14} style={styles.searchIcon} onClick={() => { setIsSearchOpen(true); setTimeout(() => searchRef.current?.querySelector('input')?.focus(), 50); }} />
            <input
              type="text"
              placeholder="Cari..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => { if (!searchQuery) setIsSearchOpen(false); }}
              style={{
                ...styles.searchInput,
                opacity: isSearchOpen || searchQuery ? 1 : 0,
                pointerEvents: isSearchOpen || searchQuery ? 'auto' : 'none',
              }}
            />
            {(isSearchOpen || searchQuery) && (
              <button onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }} style={styles.searchClear}>
                <X size={14} />
              </button>
            )}
          </motion.div>
          <ProjectFilter projects={projects} value={selectedProject} onChange={onSelectProject} />
          {hasProjectSelected && (
            <>
              <button onClick={() => setShowDeleteConfirm(true)} title="Hapus project" style={styles.deleteProjectBtn}>
                <Trash2 size={12} />
              </button>
              <button className="btn btn-primary btn-sm" onClick={onCreateBoard}>
                <Plus size={15} /> Buat Board
              </button>
              <span style={styles.totalBadge}>{projectTasks.length} Tugas</span>
            </>
          )}
        </div>
      </div>

      {!hasProjectSelected && viewMode === 'projects' && (
        <div style={styles.projectListWrap}>
          <div style={styles.projectListHeader}>
            <div>
              <h2 style={styles.projectListTitle}>Projects</h2>
              <p style={styles.projectListSub}>
                {boards.length} board{boards.length !== 1 ? 's' : ''} across {activeProjects.length} project{activeProjects.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {completedProjects.length > 0 && (
                <button
                  onClick={() => setViewMode('completed')}
                  style={styles.statusBtn}
                >
                  <CheckCircle2 size={14} /> Completed ({completedProjects.length})
                </button>
              )}
              {archivedProjects.length > 0 && (
                <button
                  onClick={() => setViewMode('archived')}
                  style={styles.statusBtn}
                >
                  <Archive size={14} /> Archived ({archivedProjects.length})
                </button>
              )}
              <button className="btn btn-primary btn-sm" onClick={onAddProject}>
                <Plus size={15} /> New Project
              </button>
            </div>
          </div>
          {filteredProjects.length === 0 ? (
            <div style={styles.noProject}>
              {searchQuery ? (
                <>
                  <Search size={48} color="var(--text-muted)" />
                  <h2 style={styles.noProjectTitle}>No results found</h2>
                  <p style={styles.noProjectText}>
                    No projects match "{searchQuery}"
                  </p>
                </>
              ) : (
                <>
                  <FolderPlus size={48} color="var(--text-muted)" />
                  <h2 style={styles.noProjectTitle}>No projects yet</h2>
                  <p style={styles.noProjectText}>
                    Create your first project to start managing your work.
                  </p>
                  <button className="btn btn-primary" onClick={onAddProject} style={{ marginTop: '4px' }}>
                    <Plus size={16} /> Create Project
                  </button>
                </>
              )}
            </div>
          ) : (
            <div style={styles.projectGrid}>
              {filteredProjects.map((project, idx) => {
                const projectBoardCount = boards.filter(b => b.projectId === project.id).length;
                const projectTaskList = tasks.filter(t => t.projectId === project.id);
                const totalTasks = projectTaskList.length;
                const PROJECT_ICONS = [Folder, LayoutDashboard, KanbanSquare, Layers];
                const IconComponent = PROJECT_ICONS[idx % PROJECT_ICONS.length];

                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28, mass: 0.8 }}
                    style={styles.projectCard}
                    whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.08)', borderColor: project.color }}
                  >
                    <div style={{
                      ...styles.projectCardInner,
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: isMobile ? 'stretch' : 'center',
                      gap: isMobile ? '16px' : '20px',
                      padding: isMobile ? '16px' : '24px',
                    }}>
                      <div style={styles.projectCardLeft}>
                        <div style={{ ...styles.projectIconBox, backgroundColor: `${project.color}12` }}>
                          <IconComponent size={22} color={project.color} strokeWidth={1.5} />
                        </div>
                      </div>

                      <div style={styles.projectCardCenter}>
                        <div style={styles.projectCardTopRow}>
                          <h3 style={styles.projectCardName}>{project.name}</h3>
                          <div style={styles.projectCardActions}>
                            <span style={styles.statusBadge}>
                              <span style={{ ...styles.statusDot, backgroundColor: '#22C55E' }} />
                              Active
                            </span>
                            <div style={{ position: 'relative' }}>
                              <button
                                onClick={(e) => { e.stopPropagation(); setMenuProjectId(menuProjectId === project.id ? null : project.id); }}
                                style={styles.moreBtn}
                                title="More"
                              >
                                <MoreHorizontal size={16} color="#6B7280" />
                              </button>
                              <AnimatePresence>
                                {menuProjectId === project.id && (
                                  <ProjectCardMenu
                                    project={project}
                                    isActive={true}
                                    onSelectProject={onSelectProject}
                                    onDeleteProject={onDeleteProject}
                                    onUpdateProjects={onUpdateProjects}
                                    onArchiveRequest={(id) => setArchiveConfirmId(id)}
                                    onClose={() => setMenuProjectId(null)}
                                  />
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>

                        <p style={styles.projectWorkspace}>Personal Workspace</p>

                        <div style={styles.projectMeta}>
                          <span style={styles.projectMetaItem}>
                            <Layers size={14} />
                            {projectBoardCount} {projectBoardCount === 1 ? 'Board' : 'Boards'}
                          </span>
                          <span style={styles.metaSep} />
                          <span style={styles.projectMetaItem}>
                            <SquareStack size={14} />
                            {totalTasks} {totalTasks === 1 ? 'Task' : 'Tasks'}
                          </span>
                          <span style={styles.metaSep} />
                          <span style={styles.projectMetaItem}>
                            <Users size={14} />
                            1 Member
                          </span>
                        </div>
                      </div>

                      <div style={{
                        ...styles.projectCardRight,
                        marginTop: isMobile ? '8px' : '0',
                      }}>
                        <button
                          onClick={() => onSelectProject(project.id)}
                          style={{
                            ...styles.openBtn,
                            width: isMobile ? '100%' : 'auto',
                            justifyContent: isMobile ? 'center' : 'flex-start',
                          }}
                        >
                          Open Board
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!hasProjectSelected && viewMode === 'completed' && (
        <div style={styles.projectListWrap}>
          <div style={styles.projectListHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setViewMode('projects')} style={styles.backBtn}>
                <ArrowLeft size={16} />
              </button>
              <div>
                <h2 style={styles.projectListTitle}>Completed Projects</h2>
                <p style={styles.projectListSub}>
                  {completedProjects.length} completed project{completedProjects.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
          {filteredProjects.length === 0 ? (
            <div style={styles.noProject}>
              {searchQuery ? (
                <>
                  <Search size={48} color="var(--text-muted)" />
                  <h2 style={styles.noProjectTitle}>No results found</h2>
                  <p style={styles.noProjectText}>
                    No completed projects match "{searchQuery}"
                  </p>
                </>
              ) : (
                <>
                  <CheckCircle2 size={48} color="var(--text-muted)" />
                  <h2 style={styles.noProjectTitle}>No completed projects</h2>
                  <p style={styles.noProjectText}>
                    Completed projects will appear here when you finish them.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div style={styles.projectGrid}>
              {filteredProjects.map((project, idx) => {
                const projectBoardCount = boards.filter(b => b.projectId === project.id).length;
                const projectTaskList = tasks.filter(t => t.projectId === project.id);
                const totalTasks = projectTaskList.length;
                const PROJECT_ICONS = [Folder, LayoutDashboard, KanbanSquare, Layers];
                const IconComponent = PROJECT_ICONS[idx % PROJECT_ICONS.length];

                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28, mass: 0.8 }}
                    style={styles.projectCard}
                    whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.08)', borderColor: '#A7F3D0' }}
                  >
                    <div style={{
                      ...styles.projectCardInner,
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: isMobile ? 'stretch' : 'center',
                      gap: isMobile ? '16px' : '20px',
                      padding: isMobile ? '16px' : '24px',
                    }}>
                      <div style={styles.projectCardLeft}>
                        <div style={{ ...styles.projectIconBox, backgroundColor: '#D1FAE5' }}>
                          <IconComponent size={22} color="#10B981" strokeWidth={1.5} />
                        </div>
                      </div>

                      <div style={styles.projectCardCenter}>
                        <div style={styles.projectCardTopRow}>
                          <h3 style={styles.projectCardName}>{project.name}</h3>
                          <div style={styles.projectCardActions}>
                            <span style={styles.statusBadge}>
                              <span style={{ ...styles.statusDot, backgroundColor: '#10B981' }} />
                              Completed
                            </span>
                            <div style={{ position: 'relative' }}>
                              <button
                                onClick={(e) => { e.stopPropagation(); setMenuProjectId(menuProjectId === project.id ? null : project.id); }}
                                style={styles.moreBtn}
                                title="More"
                              >
                                <MoreHorizontal size={16} color="#6B7280" />
                              </button>
                              <AnimatePresence>
                                {menuProjectId === project.id && (
                                  <ProjectCardMenu
                                    project={project}
                                    isActive={false}
                                    onSelectProject={onSelectProject}
                                    onDeleteProject={onDeleteProject}
                                    onUpdateProjects={onUpdateProjects}
                                    onArchiveRequest={(id) => setArchiveConfirmId(id)}
                                    onClose={() => setMenuProjectId(null)}
                                  />
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>

                        <p style={styles.projectWorkspace}>Personal Workspace</p>

                        <div style={styles.projectMeta}>
                          <span style={styles.projectMetaItem}>
                            <Layers size={14} />
                            {projectBoardCount} {projectBoardCount === 1 ? 'Board' : 'Boards'}
                          </span>
                          <span style={styles.metaSep} />
                          <span style={styles.projectMetaItem}>
                            <SquareStack size={14} />
                            {totalTasks} {totalTasks === 1 ? 'Task' : 'Tasks'}
                          </span>
                          <span style={styles.metaSep} />
                          <span style={styles.projectMetaItem}>
                            <Users size={14} />
                            1 Member
                          </span>
                        </div>
                      </div>

                      <div style={{
                        ...styles.projectCardRight,
                        marginTop: isMobile ? '8px' : '0',
                      }}>
                        <button
                          onClick={() => onSelectProject(project.id)}
                          style={{
                            ...styles.openBtn,
                            width: isMobile ? '100%' : 'auto',
                            justifyContent: isMobile ? 'center' : 'flex-start',
                          }}
                        >
                          Open Board
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!hasProjectSelected && viewMode === 'archived' && (
        <div style={styles.projectListWrap}>
          <div style={styles.projectListHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setViewMode('projects')} style={styles.backBtn}>
                <ArrowLeft size={16} />
              </button>
              <div>
                <h2 style={styles.projectListTitle}>Archived Projects</h2>
                <p style={styles.projectListSub}>
                  {archivedProjects.length} archived project{archivedProjects.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
          {filteredProjects.length === 0 ? (
            <div style={styles.noProject}>
              {searchQuery ? (
                <>
                  <Search size={48} color="var(--text-muted)" />
                  <h2 style={styles.noProjectTitle}>No results found</h2>
                  <p style={styles.noProjectText}>
                    No archived projects match "{searchQuery}"
                  </p>
                </>
              ) : (
                <>
                  <Archive size={48} color="var(--text-muted)" />
                  <h2 style={styles.noProjectTitle}>No archived projects</h2>
                  <p style={styles.noProjectText}>
                    Archived projects will appear here.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div style={styles.projectGrid}>
              {filteredProjects.map((project, idx) => {
                const projectBoardCount = boards.filter(b => b.projectId === project.id).length;
                const projectTaskList = tasks.filter(t => t.projectId === project.id);
                const totalTasks = projectTaskList.length;
                const PROJECT_ICONS = [Folder, LayoutDashboard, KanbanSquare, Layers];
                const IconComponent = PROJECT_ICONS[idx % PROJECT_ICONS.length];

                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28, mass: 0.8 }}
                    style={styles.projectCard}
                    whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.08)', borderColor: '#ECECEC' }}
                  >
                    <div style={{
                      ...styles.projectCardInner,
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: isMobile ? 'stretch' : 'center',
                      gap: isMobile ? '16px' : '20px',
                      padding: isMobile ? '16px' : '24px',
                    }}>
                      <div style={styles.projectCardLeft}>
                        <div style={{ ...styles.projectIconBox, backgroundColor: '#F3F4F6' }}>
                          <IconComponent size={22} color="#9CA3AF" strokeWidth={1.5} />
                        </div>
                      </div>

                      <div style={styles.projectCardCenter}>
                        <div style={styles.projectCardTopRow}>
                          <h3 style={styles.projectCardName}>{project.name}</h3>
                          <div style={styles.projectCardActions}>
                            <span style={styles.statusBadge}>
                              <span style={{ ...styles.statusDot, backgroundColor: '#D1D5DB' }} />
                              Archived
                            </span>
                            <div style={{ position: 'relative' }}>
                              <button
                                onClick={(e) => { e.stopPropagation(); setMenuProjectId(menuProjectId === project.id ? null : project.id); }}
                                style={styles.moreBtn}
                                title="More"
                              >
                                <MoreHorizontal size={16} color="#6B7280" />
                              </button>
                              <AnimatePresence>
                                {menuProjectId === project.id && (
                                  <ProjectCardMenu
                                    project={project}
                                    isActive={false}
                                    onSelectProject={onSelectProject}
                                    onDeleteProject={onDeleteProject}
                                    onUpdateProjects={onUpdateProjects}
                                    onArchiveRequest={(id) => setArchiveConfirmId(id)}
                                    onClose={() => setMenuProjectId(null)}
                                  />
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>

                        <p style={styles.projectWorkspace}>Personal Workspace</p>

                        <div style={styles.projectMeta}>
                          <span style={styles.projectMetaItem}>
                            <Layers size={14} />
                            {projectBoardCount} {projectBoardCount === 1 ? 'Board' : 'Boards'}
                          </span>
                          <span style={styles.metaSep} />
                          <span style={styles.projectMetaItem}>
                            <SquareStack size={14} />
                            {totalTasks} {totalTasks === 1 ? 'Task' : 'Tasks'}
                          </span>
                          <span style={styles.metaSep} />
                          <span style={styles.projectMetaItem}>
                            <Users size={14} />
                            1 Member
                          </span>
                        </div>
                      </div>

                      <div style={{
                        ...styles.projectCardRight,
                        marginTop: isMobile ? '8px' : '0',
                      }}>
                        <button
                          onClick={() => onSelectProject(project.id)}
                          style={{
                            ...styles.openBtn,
                            width: isMobile ? '100%' : 'auto',
                            justifyContent: isMobile ? 'center' : 'flex-start',
                          }}
                        >
                          Open Board
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {hasProjectSelected && allDone && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={styles.completeBanner}>
          <div style={styles.completeBannerLeft}>
            <CheckCircle2 size={20} color="#10B981" />
            <span style={styles.completeBannerText}>
              Semua tugas di project <strong>{currentProject.name}</strong> sudah selesai!
            </span>
          </div>
          <button onClick={() => setCompleteConfirmId(currentProject.id)} style={styles.completeBtn}>
            <Flag size={14} /> Selesai
          </button>
        </motion.div>
      )}

      {hasProjectSelected && isCompleted && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ ...styles.completeBanner, backgroundColor: '#D1FAE5', borderColor: '#10B981' }}>
          <div style={styles.completeBannerLeft}>
            <CheckCircle2 size={20} color="#10B981" />
            <span style={{ ...styles.completeBannerText, color: '#047857' }}>
              Project <strong>{currentProject.name}</strong> sudah selesai
            </span>
          </div>
        </motion.div>
      )}

      {hasProjectSelected && (searchQuery ? filteredBoards.length === 0 : projectBoards.length === 0) && (
        <div style={styles.emptyBoard}>
          {searchQuery ? (
            <>
              <Search size={48} color="var(--text-muted)" />
              <h3 style={styles.emptyBoardTitle}>No boards found</h3>
              <p style={styles.emptyBoardText}>
                No boards match "{searchQuery}" in <strong>{currentProject.name}</strong>
              </p>
            </>
          ) : (
            <>
              <LayoutDashboard size={48} color="var(--text-muted)" />
              <h3 style={styles.emptyBoardTitle}>Belum Ada Board</h3>
              <p style={styles.emptyBoardText}>
                Buat board pertama untuk project <strong>{currentProject.name}</strong> dan mulai kelola tugas Anda.
              </p>
              <button className="btn btn-primary" onClick={onCreateBoard} style={{ padding: '10px 24px', fontSize: '15px' }}>
                <Plus size={16} /> Buat Board Baru
              </button>
            </>
          )}
        </div>
      )}

      {hasProjectSelected && (searchQuery ? filteredBoards.length > 0 : projectBoards.length > 0) && (
        <motion.div 
          layout 
          style={{
            ...styles.boardRow,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'flex-start',
            gap: '20px',
            paddingBottom: isMobile ? '10px' : '20px',
          }}
        >
          {COLUMNS.map(col => (
            <BoardColumn
              key={col.id}
              column={col}
              boards={groupedBoards[col.id]}
              tasks={projectTasks}
              onTaskDrop={handleBoardDrop}
              onToggleTask={handleTaskToggle}
              onToggleSubtask={handleSubtaskToggle}
              onDeleteBoard={onDeleteBoard}
              onAddTask={handleAddTask}
              getBoardTasks={getBoardTasks}
              isMobile={isMobile}
              onMoveBoard={handleBoardDrop}
            />
          ))}
        </motion.div>
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

      <ConfirmDialog
        isOpen={!!archiveConfirmId}
        onClose={() => setArchiveConfirmId(null)}
        onConfirm={() => {
          onUpdateProjects(prev => prev.map(p =>
            p.id === archiveConfirmId ? { ...p, status: 'archived' } : p
          ));
          setArchiveConfirmId(null);
        }}
        title="Arsipkan Project"
        message="Yakin ingin mengarsipkan project ini? Project akan disembunyikan dari daftar utama."
        confirmText="Ya, Arsipkan"
        cancelText="Batal"
      />

      <ConfirmDialog
        isOpen={!!completeConfirmId}
        onClose={() => setCompleteConfirmId(null)}
        onConfirm={() => {
          onCompleteProject(completeConfirmId);
          setCompleteConfirmId(null);
        }}
        title="Selesaikan Project"
        message="Yakin ingin menandai project ini sebagai selesai?"
        confirmText="Ya, Selesaikan"
        cancelText="Batal"
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
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    overflow: 'hidden',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border-soft)',
    background: 'var(--bg-secondary)',
    padding: '0 8px',
    height: 32,
    cursor: 'text',
  },
  searchIcon: {
    flexShrink: 0,
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: 'var(--text-sm)',
    color: 'var(--text-primary)',
    width: 140,
    flex: 1,
    fontFamily: 'inherit',
    transition: 'opacity 0.15s',
  },
  searchClear: {
    flexShrink: 0,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    color: 'var(--text-muted)',
  },
  totalBadge: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--emerald-dark)',
    backgroundColor: 'var(--emerald-bg)',
    padding: '6px 14px',
    borderRadius: 'var(--r-full)',
  },
  deleteProjectBtn: {
    width: '24px', height: '24px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 'var(--r-sm)', border: 'none', background: 'transparent',
    color: '#EF4444', cursor: 'pointer', opacity: 0.6,
  },
  boardRow: {
    display: 'flex',
    gap: '20px',
    flex: 1,
    alignItems: 'flex-start',
    overflowX: 'auto',
    paddingBottom: '20px',
  },

  emptyBoard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: '14px', padding: '60px 40px',
    border: '2px dashed var(--border)', borderRadius: 'var(--r-xl)', textAlign: 'center',
  },
  emptyBoardTitle: { fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.3px' },
  emptyBoardText: { fontSize: 'var(--text-base)', color: 'var(--text-muted)', maxWidth: '320px', lineHeight: 1.5 },
  completeBanner: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: '12px', padding: '14px 20px',
    borderRadius: 'var(--r-lg)', border: '1.5px solid #A7F3D0', backgroundColor: '#ECFDF5',
  },
  completeBannerLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  completeBannerText: { fontSize: 'var(--text-base)', color: '#065F46', fontWeight: 500 },
  completeBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 18px', borderRadius: 'var(--r-md)', border: 'none',
    backgroundColor: '#000', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '13px',
  },
  projectListWrap: {
    display: 'flex', flexDirection: 'column', gap: '24px',
  },
  projectListHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  projectListTitle: {
    fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)',
    letterSpacing: '-0.3px',
  },
  projectListSub: {
    marginTop: '2px',
    fontSize: '13px', color: '#9CA3AF', fontWeight: 400,
  },
  projectGrid: {
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #ECECEC',
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
    cursor: 'pointer',
  },
  projectCardInner: {
    display: 'flex', alignItems: 'center', gap: '20px',
    padding: '24px',
  },
  projectCardLeft: {
    flexShrink: 0,
  },
  projectIconBox: {
    width: '48px', height: '48px',
    borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background-color 0.18s ease',
  },
  projectCardCenter: {
    flex: 1, minWidth: 0,
    display: 'flex', flexDirection: 'column', gap: '6px',
  },
  projectCardTopRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: '12px',
  },
  statusBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    fontSize: '13px', fontWeight: 500, color: '#6B7280',
    background: 'none', border: '1px solid #E5E7EB', cursor: 'pointer',
    padding: '6px 14px', borderRadius: '10px',
    transition: 'background-color 0.15s ease, border-color 0.15s ease',
    fontFamily: 'inherit',
  },
  backBtn: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '36px', height: '36px',
    background: 'none', border: '1px solid #E5E7EB', cursor: 'pointer',
    borderRadius: '10px', color: '#374151',
    transition: 'background-color 0.15s ease',
    fontFamily: 'inherit',
  },
  projectCardName: {
    fontSize: '18px', fontWeight: 600, color: '#111827',
    letterSpacing: '-0.3px', lineHeight: 1.3,
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  projectCardActions: {
    display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
  },
  statusBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    fontSize: '13px', fontWeight: 500, color: '#6B7280',
  },
  statusDot: {
    width: '8px', height: '8px', borderRadius: '50%',
    display: 'inline-block',
  },
  moreBtn: {
    width: '32px', height: '32px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '8px', border: 'none', background: 'transparent',
    cursor: 'pointer', transition: 'background-color 0.15s ease',
  },
  cardMenu: {
    position: 'absolute', right: 0, top: 'calc(100% + 4px)',
    minWidth: '180px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #ECECEC',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)',
    zIndex: 50,
    padding: '4px',
    overflow: 'hidden',
  },
  cardMenuItem: {
    display: 'flex', alignItems: 'center', gap: '8px',
    width: '100%', padding: '9px 12px',
    border: 'none', background: 'none', cursor: 'pointer',
    fontSize: '13px', fontWeight: 500, color: '#374151',
    textAlign: 'left', borderRadius: '8px',
    transition: 'background-color 0.12s',
    fontFamily: 'inherit',
  },
  cardMenuDivider: {
    height: '1px', backgroundColor: '#F3F4F6',
    margin: '4px 8px',
  },
  projectWorkspace: {
    fontSize: '13px', fontWeight: 400, color: '#9CA3AF',
    margin: 0, lineHeight: 1.3,
  },
  projectMeta: {
    display: 'flex', alignItems: 'center', gap: '8px',
    flexWrap: 'wrap', marginTop: '2px',
  },
  projectMetaItem: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    fontSize: '13px', fontWeight: 500, color: '#6B7280',
  },
  metaSep: {
    width: '3px', height: '3px', borderRadius: '50%',
    backgroundColor: '#D1D5DB', flexShrink: 0,
  },
  projectCardRight: {
    flexShrink: 0,
  },
  openBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '8px 18px',
    borderRadius: '10px', border: '1px solid #E5E7EB',
    backgroundColor: '#FFFFFF',
    color: '#374151',
    fontSize: '13px', fontWeight: 600,
    cursor: 'pointer', whiteSpace: 'nowrap',
    transition: 'background-color 0.15s ease, border-color 0.15s ease',
  },
  noProject: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: '12px', padding: '80px 40px',
    border: '2px dashed #ECECEC', borderRadius: 'var(--r-xl)', textAlign: 'center', flex: 1,
  },
  noProjectTitle: { fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px' },
  noProjectText: { fontSize: 'var(--text-base)', color: 'var(--text-muted)', maxWidth: '380px', lineHeight: 1.5 },
};
