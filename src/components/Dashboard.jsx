import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Plus, LayoutDashboard, CheckSquare, Clock,
  MoreVertical, Lock, Globe, Calendar, Trash2, Edit3,
  Target, Flame, TrendingUp, Activity, ChevronDown,
  ListTodo, Circle, ArrowUpRight, FolderPlus,
  Archive, CheckCircle2, ArrowLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StatsCard from './StatsCard';
import Dropdown from './Dropdown';

// ─── Helpers ────────────────────────────────────────────
function hexToRgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function formatDate(iso) {
  const d = new Date(iso);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

// ─── Activity Calendar ─────────────────────────────────
const WEEKS = 26;
const DAYS_PER_WEEK = 7;
const DAY_LABELS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

/**
 * Build activity grid from completed tasks & projects.
 */
function buildActivityData(boards, tasks, projects) {
  const data = Array.from({ length: WEEKS }, () => Array(DAYS_PER_WEEK).fill(0));

  // Count completed tasks
  const doneTasks = tasks.filter(t => t.status === 'Done');
  doneTasks.forEach((t, i) => {
    const dayOffset = (i * 3) % (WEEKS * DAYS_PER_WEEK);
    const w = Math.floor(dayOffset / DAYS_PER_WEEK);
    const d = dayOffset % DAYS_PER_WEEK;
    data[w][d] = Math.min(data[w][d] + 1, 8);
  });

  // Add activity for completed projects
  projects.filter(p => p.status === 'completed').forEach((p) => {
    const w = Math.floor(Math.random() * Math.max(WEEKS - 2, 1)) + 1;
    const d = Math.floor(Math.random() * DAYS_PER_WEEK);
    data[w][d] = Math.min(data[w][d] + 3, 8);
  });

  return data;
}

function getActivityColor(count) {
  if (count === 0) return 'var(--border)';
  if (count <= 2) return 'var(--emerald-border)';
  if (count <= 4) return 'var(--emerald-light)';
  if (count <= 6) return 'var(--emerald)';
  return 'var(--emerald-dark)';
}

// Smooth tooltip component
function CellTooltip({ count, date }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.9 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      style={calStyles.tooltip}
    >
      <span style={{ fontWeight: 700, color: '#fff' }}>{count}</span>
      <span style={{ color: 'rgba(255,255,255,0.75)' }}>
        {count === 1 ? ' task' : ' tasks'} selesai
      </span>
      {date && (
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginLeft: 4 }}>
          · {date}
        </span>
      )}
      <div style={calStyles.tooltipArrow} />
    </motion.div>
  );
}

function ActivityCalendar({ boards, tasks, projects, selectedProject }) {
  const [hovered, setHovered] = useState(null);
  const [cellRects, setCellRects] = useState({});
  const cellRefs = useRef({});

  const activityData = useMemo(() => {
    const filteredBoards = selectedProject === 'all'
      ? boards
      : boards.filter(b => b.projectId === selectedProject);
    const filteredTasks = selectedProject === 'all'
      ? tasks
      : tasks.filter(t => t.projectId === selectedProject);
    const filteredProjects = selectedProject === 'all'
      ? projects
      : projects.filter(p => p.id === selectedProject);
    return buildActivityData(filteredBoards, filteredTasks, filteredProjects);
  }, [boards, tasks, projects, selectedProject]);

  const today = new Date();

  const getDateLabel = (wi, di) => {
    const daysAgo = (WEEKS - 1 - wi) * 7 + (6 - di);
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return formatDate(d.toISOString());
  };

  const handleMouseEnter = (wi, di, count, e) => {
    setHovered({ wi, di, count, date: getDateLabel(wi, di) });
  };

  return (
    <div style={calStyles.wrapper}>
      <div style={calStyles.header}>
        <div style={calStyles.titleRow}>
          <Activity size={16} color="var(--text-muted)" />
          <span style={calStyles.title}>Aktivitas Penyelesaian Tugas</span>
        </div>
        <div style={calStyles.legend}>
          {[0, 2, 4, 6, 8].map(v => (
            <div key={v} style={{ ...calStyles.legendCell, backgroundColor: getActivityColor(v) }} />
          ))}
          <span style={calStyles.legendLabel}>Lebih banyak</span>
        </div>
      </div>

      <div style={calStyles.gridWrapper}>
        {/* Day labels */}
        <div style={calStyles.dayLabels}>
          {DAY_LABELS.map(d => (
            <span key={d} style={calStyles.dayLabel}>{d}</span>
          ))}
        </div>

        {/* Activity grid */}
        <div style={calStyles.grid}>
          {activityData.map((week, wi) =>
            week.map((count, di) => {
              const key = `${wi}-${di}`;
              const isHov = hovered?.wi === wi && hovered?.di === di;
              return (
                <div key={key} style={{ position: 'relative' }}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: 1,
                      scale: isHov ? 1.45 : 1,
                      backgroundColor: getActivityColor(count),
                    }}
                    transition={{
                      opacity: { delay: (wi * 7 + di) * 0.002 },
                      scale: { duration: 0.18, ease: 'easeOut' },
                      backgroundColor: { duration: 0.2 },
                    }}
                    onMouseEnter={e => handleMouseEnter(wi, di, count, e)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ ...calStyles.cell, zIndex: isHov ? 10 : 1, position: 'relative' }}
                  />
                  <AnimatePresence>
                    {isHov && (
                      <div style={calStyles.tooltipAnchor}>
                        <CellTooltip count={count} date={hovered?.date} />
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

const calStyles = {
  wrapper: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-lg)',
    padding: '20px 24px',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '8px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  title: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  legend: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
  },
  legendCell: {
    width: '10px',
    height: '10px',
    borderRadius: '2px',
  },
  legendLabel: {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
    marginLeft: '4px',
  },
  gridWrapper: {
    display: 'flex',
    gap: '6px',
    alignItems: 'flex-start',
    width: '100%',
  },
  dayLabels: {
    display: 'grid',
    gridTemplateRows: `repeat(${DAYS_PER_WEEK}, 13px)`,
    gap: '3px',
    paddingTop: '1px',
    flexShrink: 0,
  },
  dayLabel: {
    fontSize: '9px',
    color: 'var(--text-muted)',
    fontWeight: 500,
    lineHeight: '13px',
    whiteSpace: 'nowrap',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: `repeat(${WEEKS}, 1fr)`,
    gridTemplateRows: `repeat(${DAYS_PER_WEEK}, 13px)`,
    gridAutoFlow: 'column',
    gap: '3px',
    flex: 1,
    minWidth: 0,
  },
  cell: {
    width: '100%',
    height: '13px',
    borderRadius: '3px',
    cursor: 'default',
  },
  tooltipAnchor: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: '6px',
    zIndex: 100,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
  },
  tooltip: {
    backgroundColor: 'rgba(17,24,39,0.92)',
    backdropFilter: 'blur(4px)',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    whiteSpace: 'nowrap',
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: '-4px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '4px solid transparent',
    borderRight: '4px solid transparent',
    borderTop: '4px solid rgba(17,24,39,0.92)',
  },
};

// ─── Project Filter Dropdown ────────────────────────────
function ProjectFilter({ projects = [], value, onChange }) {
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

// ─── Board Card ─────────────────────────────────────────
function BoardCard({ board, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const boardColor = board.color || '#10B981';

  const completedCount = board.completedTasks ?? 0;
  const totalCount = board.totalTasks ?? 0;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -3 }}
      style={{
        ...bcStyles.card,
        borderLeft: `4px solid ${boardColor}`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `var(--shadow-md), 0 0 0 1px ${hexToRgba(boardColor, 0.2)}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        setMenuOpen(false);
      }}
    >
      {/* Header */}
      <div style={bcStyles.header}>
        <h3 style={bcStyles.name}>{board.name}</h3>
        <div style={{ position: 'relative' }}>
          <button
            className="btn-icon"
            onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }}
            style={{ opacity: menuOpen ? 1 : undefined }}
          >
            <MoreVertical size={15} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -4 }}
                transition={{ duration: 0.13 }}
                style={bcStyles.menu}
              >
                <button onClick={() => { onEdit(board); setMenuOpen(false); }} style={bcStyles.menuItem}>
                  <Edit3 size={13} /> Ubah
                </button>
                <button onClick={() => { onDelete(board.id); setMenuOpen(false); }} style={{ ...bcStyles.menuItem, color: 'var(--danger)' }}>
                  <Trash2 size={13} /> Hapus
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Description */}
      <p style={bcStyles.desc}>{board.description || 'Tidak ada deskripsi.'}</p>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div style={bcStyles.progressSection}>
          <div className="progress-track" style={{ flexGrow: 1 }}>
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              style={{ background: boardColor }}
            />
          </div>
          <span style={bcStyles.progressLabel}>{progress}%</span>
        </div>
      )}

      {/* Footer */}
      <div style={bcStyles.footer}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={bcStyles.meta}>
            {board.isPrivate
              ? <><Lock size={10} /> Privat</>
              : <><Globe size={10} /> Publik</>
            }
          </span>
          {totalCount > 0 && (
            <span style={bcStyles.meta}>
              <CheckSquare size={10} /> {completedCount}/{totalCount}
            </span>
          )}
        </div>
        <span style={bcStyles.date}>{formatDate(board.createdAt)}</span>
      </div>
    </motion.div>
  );
}

const bcStyles = {
  card: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-lg)',
    padding: '18px 20px',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    transition: 'box-shadow 0.2s, transform 0.2s',
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '8px',
  },
  name: {
    fontSize: 'var(--text-md)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.2px',
    lineHeight: 1.2,
  },
  desc: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    flexGrow: 1,
  },
  progressSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  progressLabel: {
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--text-muted)',
    minWidth: '28px',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '10px',
    borderTop: '1px solid var(--border)',
  },
  meta: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--text-muted)',
  },
  date: {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
  },
  menu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '4px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-md)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 20,
    overflow: 'hidden',
    minWidth: '110px',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '8px 12px',
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

// ─── Task List ──────────────────────────────────────────
function TaskRow({ task }) {
  const priorityConf = {
    High: { cls: 'badge-danger', label: 'Tinggi' },
    Medium: { cls: 'badge-warning', label: 'Sedang' },
    Low: { cls: 'badge-sky', label: 'Rendah' },
  };
  const p = priorityConf[task.priority] || priorityConf.Low;

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      style={trStyles.row}
    >
      <div style={trStyles.left}>
        <span className={`badge ${p.cls}`}>{p.label}</span>
        <span style={trStyles.title}>{task.title}</span>
      </div>
      {task.deadline && (
        <span style={trStyles.deadline}>
          <Calendar size={11} />
          {formatDate(task.deadline)}
        </span>
      )}
    </motion.div>
  );
}

const trStyles = {
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid var(--border)',
    gap: '12px',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    overflow: 'hidden',
  },
  title: {
    fontSize: 'var(--text-base)',
    fontWeight: 500,
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  deadline: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
};

// ─── Main Dashboard ─────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};

export default function Dashboard({ boards, tasks, onCreateBoard, onEditBoard, onDeleteBoard, projects = [], currentProjectId = 'all', onSelectProject = () => { }, onAddProject = () => { } }) {
  const selectedProject = currentProjectId;
  const setSelectedProject = onSelectProject;

  const   totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completePct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const [projectViewMode, setProjectViewMode] = useState('active');
  const activeProjList = useMemo(() => projects.filter(p => p.status === 'active'), [projects]);
  const completedProjList = useMemo(() => projects.filter(p => p.status === 'completed'), [projects]);
  const archivedProjList = useMemo(() => projects.filter(p => p.status === 'archived'), [projects]);
  const visibleProjList = projectViewMode === 'active' ? activeProjList : projectViewMode === 'completed' ? completedProjList : archivedProjList;

  const enrichedBoards = useMemo(() => boards.map(b => {
    const boardTasks = tasks.filter(t => t.boardId === b.id);
    const totalTasks = boardTasks.length;
    const completedTasks = boardTasks.filter(t => t.status === 'Done').length;
    return { ...b, totalTasks, completedTasks };
  }), [boards, tasks]);

  // Filter boards shown in the card grid
  const visibleBoards = selectedProject === 'all'
    ? enrichedBoards
    : enrichedBoards.filter(b => b.projectId === selectedProject);

  return (
    <div style={styles.page}>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.h1}>Dashboard</h1>
          <p style={styles.subtitle}>Selamat datang kembali! Pantau progres pekerjaan Anda hari ini.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-ghost" onClick={onAddProject}>
            <Plus size={16} /> Project Baru
          </button>

        </div>
      </div>

      {/* Stats Row */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" style={styles.statsGrid}>
        <motion.div variants={itemVariants}>
          <StatsCard label="Total Boards" value={boards.length} icon={LayoutDashboard} color="sky" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard label="Total Tugas" value={totalTasks} percentage={completePct} icon={Target} color="emerald" trend={8} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard label="Selesai" value={completedTasks} percentage={completePct} icon={CheckSquare} color="emerald" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard label="Project Aktif" value={activeProjects} icon={Flame} color="warning" />
        </motion.div>
      </motion.div>

      {/* Activity Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div style={styles.calendarSection}>
          <div style={styles.calendarHeader}>
            <div />
            <ProjectFilter
              projects={projects}
              value={selectedProject}
              onChange={setSelectedProject}
            />
          </div>
          <ActivityCalendar boards={enrichedBoards} tasks={tasks} projects={projects} selectedProject={selectedProject} />
        </div>
      </motion.div>

      {/* Project List + Task Overview (2-col) */}
      <div style={styles.twoCol}>
        {/* Left: Project List */}
        <div style={styles.leftCol}>
          <div style={styles.sectionHead}>
            <h2 style={styles.h2}>
              <FolderPlus size={16} /> {projectViewMode === 'active' ? 'Project Aktif' : projectViewMode === 'completed' ? 'Project Selesai' : 'Project Arsip'}
            </h2>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {projectViewMode !== 'active' && (
                <button className="btn btn-ghost btn-sm" onClick={() => setProjectViewMode('active')}>
                  <ArrowLeft size={13} /> Aktif
                </button>
              )}
              {completedProjList.length > 0 && projectViewMode !== 'completed' && (
                <button className="btn btn-ghost btn-sm" onClick={() => setProjectViewMode('completed')}>
                  <CheckCircle2 size={13} /> {completedProjList.length}
                </button>
              )}
              {archivedProjList.length > 0 && projectViewMode !== 'archived' && (
                <button className="btn btn-ghost btn-sm" onClick={() => setProjectViewMode('archived')}>
                  <Archive size={13} /> {archivedProjList.length}
                </button>
              )}
            </div>
          </div>

          {visibleProjList.length === 0 ? (
            <div style={styles.empty}>
              <FolderPlus size={36} color="var(--text-muted)" />
              <p style={styles.emptyText}>
                {projectViewMode === 'active' ? 'Belum ada project aktif.' : projectViewMode === 'completed' ? 'Belum ada project selesai.' : 'Belum ada project diarsipkan.'}
              </p>
            </div>
          ) : (
            <div style={styles.boardGridWrap}>
              {visibleProjList.map(project => {
                const projectBoards = boards.filter(b => b.projectId === project.id);
                const isInactive = project.status !== 'active';
                return (
                  <div key={project.id} style={{ ...styles.projectBlock, opacity: isInactive ? 0.7 : 1 }}>
                    <div style={styles.projectBlockHead}>
                      <div style={{ ...styles.blockDot, backgroundColor: project.color || 'var(--text-muted)' }} />
                      <span style={styles.blockName}>{project.name}</span>
                      {project.deadline && (
                        <span style={styles.blockDeadline}>{formatDate(project.deadline)}</span>
                      )}
                      <span style={styles.blockCount}>{projectBoards.length}</span>
                    </div>
                    <div style={styles.blockList}>
                      {projectBoards.length === 0 ? (
                        <div style={styles.blockEmpty}>Belum ada board</div>
                      ) : (
                        projectBoards.map(board => (
                          <div key={board.id} style={styles.blockItem}>
                            <div style={{ ...styles.blockItemDot, backgroundColor: board.color || '#10B981' }} />
                            <span style={styles.blockItemName}>{board.name}</span>
                            <span style={styles.blockItemDate}>{formatDate(board.createdAt)}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Task Overview */}
        <div style={styles.rightCol}>
          <div style={styles.sectionHead}>
            <h2 style={styles.h2}>Ringkasan Tugas</h2>
            <span className="badge badge-emerald">{tasks.length} Total</span>
          </div>

          <div style={styles.summaryPanel}>
            {/* Status Distribution */}
            <div style={styles.distList}>
              {[
                { label: 'To Do', count: tasks.filter(t => t.status === 'To Do').length, color: '#F59E0B', bg: '#FFFBEB', icon: ListTodo },
                { label: 'In Progress', count: tasks.filter(t => t.status === 'In Progress').length, color: '#3B82F6', bg: '#DBEAFE', icon: Clock },
                { label: 'Done', count: tasks.filter(t => t.status === 'Done').length, color: '#10B981', bg: '#D1FAE5', icon: CheckSquare },
              ].map(item => {
                const pct = tasks.length > 0 ? Math.round((item.count / tasks.length) * 100) : 0;
                const Icon = item.icon;
                return (
                  <div key={item.label} style={styles.distItem}>
                    <div style={styles.distHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ ...styles.distIcon, backgroundColor: item.bg, color: item.color }}>
                          <Icon size={14} />
                        </div>
                        <span style={styles.distLabel}>{item.label}</span>
                      </div>
                      <span style={{ ...styles.distCount, color: item.color }}>{item.count}</span>
                    </div>
                    <div style={styles.progressTrack}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        style={{ ...styles.progressFill, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            <div style={styles.divider} />

            {/* Recent Boards */}
            <div style={styles.recentSection}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Activity size={13} color="var(--text-muted)" />
                <span style={styles.recentTitle}>Board Terbaru</span>
              </div>
              {boards.length === 0 ? (
                <p style={styles.recentEmpty}>Belum ada board.</p>
              ) : (
                <div style={styles.recentList}>
                  {boards.slice(0, 4).map(board => (
                    <div key={board.id} style={styles.recentItem}>
                      <div style={{ ...styles.recentDot, backgroundColor: board.color || '#10B981' }} />
                      <span style={styles.recentName}>{board.name}</span>
                      <span style={styles.recentDate}>{formatDate(board.createdAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: '32px 36px',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  calendarSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  calendarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  twoCol: {
    display: 'flex',
    gap: '28px',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  leftCol: {
    flex: '3 1 480px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  rightCol: {
    flex: '2 1 280px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  h2: {
    fontSize: 'var(--text-lg)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.3px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  projectBadge: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    backgroundColor: 'var(--border)',
    padding: '2px 8px',
    borderRadius: 'var(--r-full)',
  },
  boardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '16px',
  },
  taskPanel: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-lg)',
    padding: '16px 20px',
    boxShadow: 'var(--shadow-sm)',
  },
  summaryPanel: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-lg)',
    padding: '20px',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  distList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  distItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  distHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  distIcon: {
    width: '28px',
    height: '28px',
    borderRadius: 'var(--r-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  distLabel: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  distCount: {
    fontSize: 'var(--text-base)',
    fontWeight: 700,
  },
  progressTrack: {
    height: '4px',
    backgroundColor: 'var(--border)',
    borderRadius: 'var(--r-full)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 'var(--r-full)',
    transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border)',
  },
  recentSection: {},
  recentTitle: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  recentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  recentItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 0',
  },
  recentDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  recentName: {
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--text-primary)',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  recentDate: {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
    whiteSpace: 'nowrap',
  },
  recentEmpty: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    textAlign: 'center',
    padding: '12px',
  },
  empty: {
    padding: '40px 20px',
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
    maxWidth: '240px',
  },
  boardGridWrap: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '14px',
    alignItems: 'start',
  },
  projectBlock: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-lg)',
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden',
  },
  projectBlockHead: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderBottom: '1px solid var(--border)',
  },
  blockDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  blockName: {
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  blockCount: {
    fontSize: '10px',
    fontWeight: 700,
    color: 'var(--text-muted)',
    backgroundColor: 'var(--bg-subtle)',
    padding: '0 7px',
    borderRadius: 'var(--r-full)',
    lineHeight: '18px',
  },
  blockDeadline: {
    fontSize: '11px',
    color: 'var(--rose)',
    fontWeight: 600,
    marginLeft: 'auto',
    marginRight: '6px',
  },
  blockList: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '220px',
    overflowY: 'auto',
  },
  blockItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 16px',
    transition: 'background 0.1s',
    borderBottom: '1px solid var(--border)',
  },
  blockItemDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  blockItemName: {
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  blockItemDate: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  blockEmpty: {
    padding: '14px 16px',
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
};
