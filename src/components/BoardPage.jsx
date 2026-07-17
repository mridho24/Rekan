import React, { useState, useMemo } from 'react';
import {
  Plus, Calendar, Trash2, CheckCircle2, Circle,
  ChevronDown, ChevronRight, FolderPlus, LayoutDashboard,
  Flag, ListChecks, Clock, GripVertical,
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

function BoardCard({ board, tasks, onToggleTask, onToggleSubtask, onDeleteBoard, onAddTask }) {
  const [newTitle, setNewTitle] = useState('');
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
          <button
            onClick={() => onDeleteBoard(board.id)}
            style={bcStyles.deleteBtn}
            title="Hapus board"
          >
            <Trash2 size={10} />
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
    transition: 'border-color 0.2s, box-shadow 0.2s',
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
    width: '20px', height: '20px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 'var(--r-sm)', border: 'none', background: 'transparent',
    color: '#EF4444', cursor: 'pointer', opacity: 0.4, flexShrink: 0,
  },
  desc: { fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 },
  progressWrap: { display: 'flex', alignItems: 'center', gap: '6px' },
  progressBar: {
    flex: 1, height: '5px', borderRadius: 'var(--r-full)',
    backgroundColor: 'var(--border)', overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 'var(--r-full)', transition: 'width 0.3s ease' },
  progressText: { fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', minWidth: '28px', textAlign: 'right' },
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
};

function BoardColumn({ column, boards, tasks, onTaskDrop, onToggleTask, onToggleSubtask, onDeleteBoard, onAddTask, getBoardTasks }) {
  const [dragOver, setDragOver] = useState(false);
  const Icon = column.icon;

  return (
    <motion.div
      layout
      style={{
        ...colStyles.column,
        borderColor: dragOver ? column.color : 'var(--border)',
        backgroundColor: dragOver ? 'var(--bg-card-hover)' : 'transparent',
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
    <div style={pfStyles.wrap}>
      <FolderPlus size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
      <select value={value} onChange={e => onChange(e.target.value)} style={pfStyles.select}>
        <option value="all">Semua Project</option>
        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
    </div>
  );
}

const pfStyles = {
  wrap: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '0 12px', borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)', backgroundColor: 'var(--bg-input)',
  },
  select: {
    padding: '7px 0', border: 'none', background: 'none',
    color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600,
    outline: 'none', fontFamily: 'inherit', cursor: 'pointer', minWidth: '140px',
  },
};

export default function BoardPage({
  tasks, onUpdateTasks, boards, onUpdateBoards, projects,
  currentProjectId, onSelectProject,
  onCreateBoard, onCompleteProject,
  onAddProject, onDeleteProject, onDeleteBoard,
}) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const groupedBoards = useMemo(() => {
    const map = { todo: [], inprogress: [], done: [] };
    for (const board of projectBoards) {
      const boardTasks = projectTasks.filter(t => t.boardId === board.id);
      const allDone = boardTasks.length > 0 && boardTasks.every(t => t.status === 'Done');
      const effectiveStatus = allDone ? 'done' : board.status;
      (map[effectiveStatus] || map.todo).push(board);
    }
    return map;
  }, [projectBoards, projectTasks]);

  const allDone = projectTasks.length > 0 && projectTasks.every(t => t.status === 'Done');
  const isCompleted = currentProject?.completed || false;

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

  const getBoardTasks = (boardId) => projectTasks.filter(t => t.boardId === boardId);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>Boards</h1>
          <p style={styles.subtitle}>{projectTasks.length} tugas di {projectBoards.length} board</p>
        </div>
        <div style={styles.headerActions}>
          <button className="btn btn-ghost btn-sm" onClick={onAddProject}>
            <FolderPlus size={14} /> Project Baru
          </button>
          <ProjectFilter projects={projects} value={selectedProject} onChange={onSelectProject} />
          {hasProjectSelected && (
            <button onClick={() => setShowDeleteConfirm(true)} title="Hapus project" style={styles.deleteProjectBtn}>
              <Trash2 size={12} />
            </button>
          )}
          {hasProjectSelected && (
            <>
              <button className="btn btn-primary btn-sm" onClick={onCreateBoard}>
                <Plus size={15} /> Buat Board
              </button>
              <span style={styles.totalBadge}>{projectTasks.length} Tugas</span>
            </>
          )}
        </div>
      </div>

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

      {hasProjectSelected && !isCompleted && allDone && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={styles.completeBanner}>
          <div style={styles.completeBannerLeft}>
            <CheckCircle2 size={20} color="#10B981" />
            <span style={styles.completeBannerText}>
              Semua tugas di project <strong>{currentProject.name}</strong> sudah selesai!
            </span>
          </div>
          <button onClick={() => onCompleteProject(currentProject.id)} style={styles.completeBtn}>
            <Flag size={14} /> Tandai Selesai
          </button>
        </motion.div>
      )}

      {hasProjectSelected && currentProject?.completed && (
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

      {hasProjectSelected && projectBoards.length > 0 && (
        <motion.div layout style={styles.boardRow}>
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
  emptyBoard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: '14px', padding: '60px 40px',
    border: '2px dashed var(--border)', borderRadius: 'var(--r-xl)', textAlign: 'center',
  },
  emptyBoardTitle: { fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.3px' },
  emptyBoardText: { fontSize: 'var(--text-base)', color: 'var(--text-muted)', maxWidth: '320px', lineHeight: 1.5 },
  noProject: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: '12px', padding: '80px 40px',
    border: '2px dashed var(--border)', borderRadius: 'var(--r-xl)', textAlign: 'center', flex: 1,
  },
  noProjectTitle: { fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px' },
  noProjectText: { fontSize: 'var(--text-base)', color: 'var(--text-muted)', maxWidth: '380px', lineHeight: 1.5 },
};
