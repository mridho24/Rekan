import React from 'react';
import { X, Calendar, Circle, Clock, CheckCircle2, ListChecks } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_CFG = {
  'To Do':       { icon: Circle,       color: '#F59E0B' },
  'In Progress': { icon: Clock,        color: '#3B82F6' },
  'Done':        { icon: CheckCircle2, color: 'var(--emerald)' },
};

const PRIORITY_COLORS = {
  High: 'var(--danger)', Medium: '#F59E0B', Low: 'var(--text-muted)',
};

const LABEL_COLORS = {
  Frontend:    { bg: '#DBEAFE', text: '#1D4ED8' },
  Backend:     { bg: '#D1FAE5', text: '#047857' },
  Database:    { bg: '#EDE9FE', text: '#6D28D9' },
  'UI/UX':     { bg: '#FCE7F3', text: '#BE185D' },
  API:         { bg: '#FEF3C7', text: '#B45309' },
  Dokumentasi: { bg: 'var(--bg-card-hover)', text: 'var(--text-secondary)' },
  Review:      { bg: '#CCFBF1', text: '#0F766E' },
  Perancangan: { bg: '#E0E7FF', text: '#4338CA' },
};

function formatDate(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function TaskDetailView({ isOpen, onClose, task, boards, projects }) {
  if (!task) return null;

  const sc = STATUS_CFG[task.status] || STATUS_CFG['To Do'];
  const Icon = sc.icon;
  const project = projects.find(p =>
    boards.some(b => b.id === task.boardId && b.projectId === p.id)
  );
  const board = boards.find(b => b.id === task.boardId);
  const subtaskTotal = task.subtasks?.length || 0;
  const subtaskDone = task.subtasks?.filter(s => s.done).length || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={s.overlay}>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} style={s.backdrop}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
            style={s.modal}
          >
            <div style={s.header}>
              <h3 style={s.title}>Detail Tugas</h3>
              <button onClick={onClose} style={s.closeBtn}><X size={18} /></button>
            </div>

            <div style={s.body}>
              <h2 style={s.taskTitle}>{task.title}</h2>

              {task.description && (
                <p style={s.description}>{task.description}</p>
              )}

              <div style={s.metaRow}>
                {project && (
                  <span style={{ ...s.metaBadge, borderLeftColor: project.color }}>
                    {project.name}
                  </span>
                )}
                {board && (
                  <span style={s.metaBadge}>{board.name}</span>
                )}
              </div>

              <div style={s.infoGrid}>
                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Status</span>
                  <span style={{
                    ...s.statusBadge,
                    backgroundColor: `${sc.color}18`,
                    color: sc.color,
                    borderColor: sc.color,
                  }}>
                    <Icon size={12} /> {task.status}
                  </span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Prioritas</span>
                  <span style={{
                    ...s.statusBadge,
                    backgroundColor: `${PRIORITY_COLORS[task.priority]}18`,
                    color: PRIORITY_COLORS[task.priority],
                    borderColor: PRIORITY_COLORS[task.priority],
                  }}>
                    <span style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      backgroundColor: PRIORITY_COLORS[task.priority],
                      display: 'inline-block',
                    }} />
                    {task.priority}
                  </span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Deadline</span>
                  <span style={s.infoValue}>
                    <Calendar size={12} /> {formatDate(task.deadline)}
                  </span>
                </div>
              </div>

              {task.labels?.length > 0 && (
                <div style={s.labelsRow}>
                  {task.labels.map(l => {
                    const c = LABEL_COLORS[l] || { bg: 'var(--bg-card-hover)', text: 'var(--text-secondary)' };
                    return <span key={l} style={{ ...s.label, backgroundColor: c.bg, color: c.text }}>{l}</span>;
                  })}
                </div>
              )}

              {subtaskTotal > 0 && (
                <div style={s.subtaskSection}>
                  <div style={s.subtaskHeader}>
                    <ListChecks size={14} />
                    <span>Subtasks</span>
                    <span style={s.subtaskCount}>{subtaskDone}/{subtaskTotal}</span>
                  </div>
                  <div style={s.progressBarBg}>
                    <div style={{
                      ...s.progressBarFill,
                      width: `${Math.round((subtaskDone / subtaskTotal) * 100)}%`,
                    }} />
                  </div>
                  <div style={s.subtaskList}>
                    {task.subtasks.map(st => (
                      <div key={st.id} style={s.subtaskItem}>
                        <div style={{
                          ...s.subCheckbox,
                          backgroundColor: st.done ? 'var(--emerald)' : 'transparent',
                          borderColor: st.done ? 'var(--emerald)' : 'var(--border-strong)',
                        }}>
                          {st.done && <CheckCircle2 size={8} color="#fff" />}
                        </div>
                        <span style={{
                          ...s.subText,
                          textDecoration: st.done ? 'line-through' : 'none',
                          color: st.done ? 'var(--text-muted)' : 'var(--text-secondary)',
                        }}>{st.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={s.footerMeta}>
                Dibuat • {formatDate(task.createdAt)}
                {task.completedAt && <> · Selesai • {formatDate(task.completedAt)}</>}
              </div>
            </div>

            <div style={s.actions}>
              <button onClick={onClose} style={s.closeAction}>Tutup</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const s = {
  overlay: {
    position: 'fixed', inset: 0, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '16px',
  },
  backdrop: {
    position: 'absolute', inset: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    backdropFilter: 'blur(6px)', zIndex: 1,
  },
  modal: {
    position: 'relative', zIndex: 2,
    backgroundColor: 'var(--bg-card)',
    borderRadius: 'var(--r-xl)', width: '100%',
    maxWidth: '520px', maxHeight: '90vh', overflow: 'auto',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
    border: '1px solid var(--border)',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 20px 0',
  },
  title: { fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' },
  closeBtn: {
    width: '32px', height: '32px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    borderRadius: 'var(--r-md)', border: 'none',
    background: 'transparent', color: 'var(--text-muted)',
    cursor: 'pointer', transition: 'var(--t-fast)',
  },
  body: { padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' },
  taskTitle: {
    fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)',
    letterSpacing: '-0.4px', lineHeight: 1.3,
  },
  description: {
    fontSize: '13px', color: 'var(--text-secondary)',
    lineHeight: 1.6, margin: 0,
  },
  metaRow: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  metaBadge: {
    fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)',
    padding: '3px 10px', borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    borderLeft: '3px solid',
  },
  infoGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: '10px', padding: '12px',
    backgroundColor: 'var(--bg-canvas)', borderRadius: 'var(--r-lg)',
  },
  infoItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  infoLabel: { fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' },
  infoValue: {
    display: 'flex', alignItems: 'center', gap: '4px',
    fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)',
  },
  statusBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    fontSize: '11px', fontWeight: 700, padding: '2px 8px',
    borderRadius: 'var(--r-sm)', border: '1px solid',
  },
  labelsRow: { display: 'flex', gap: '4px', flexWrap: 'wrap' },
  label: {
    padding: '2px 8px', borderRadius: 'var(--r-full)',
    fontSize: '10px', fontWeight: 700, letterSpacing: '0.2px',
  },
  subtaskSection: {
    padding: '12px', backgroundColor: 'var(--bg-canvas)',
    borderRadius: 'var(--r-lg)', display: 'flex', flexDirection: 'column', gap: '8px',
  },
  subtaskHeader: {
    display: 'flex', alignItems: 'center', gap: '6px',
    fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)',
  },
  subtaskCount: {
    fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)',
    marginLeft: 'auto',
  },
  progressBarBg: {
    height: '6px', borderRadius: 'var(--r-full)',
    backgroundColor: 'var(--border)', overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%', borderRadius: 'var(--r-full)',
    backgroundColor: 'var(--emerald)', transition: 'width 0.3s ease',
  },
  subtaskList: {
    display: 'flex', flexDirection: 'column', gap: '4px',
    marginTop: '4px',
  },
  subtaskItem: {
    display: 'flex', alignItems: 'center', gap: '6px', padding: '2px 0',
  },
  subCheckbox: {
    width: '14px', height: '14px', borderRadius: '3px',
    border: '1.5px solid',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  subText: { fontSize: '12px', fontWeight: 500, lineHeight: 1.3 },
  footerMeta: {
    fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic',
    borderTop: '1px solid var(--border)', paddingTop: '10px',
  },
  actions: {
    padding: '0 20px 16px', display: 'flex', justifyContent: 'flex-end',
  },
  closeAction: {
    padding: '8px 24px', borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)', background: 'transparent',
    color: 'var(--text-secondary)', cursor: 'pointer',
    fontWeight: 600, fontSize: '13px', transition: 'var(--t-fast)',
  },
};
