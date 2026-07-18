import React, { useState, useEffect } from 'react';
import { X, Circle, Clock, CheckCircle2, Save, Plus, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CalendarPopover from './CalendarPopover';

const STATUS_OPTIONS = [
  { value: 'To Do', label: 'To Do', icon: Circle, color: '#F59E0B' },
  { value: 'In Progress', label: 'In Progress', icon: Clock, color: '#3B82F6' },
  { value: 'Done', label: 'Done', icon: CheckCircle2, color: '#10B981' },
];

const PRIORITY_OPTIONS = [
  { value: 'High', label: 'High', color: 'var(--danger)' },
  { value: 'Medium', label: 'Medium', color: '#F59E0B' },
  { value: 'Low', label: 'Low', color: 'var(--text-muted)' },
];

function formatDateInput(iso) {
  if (!iso) return '';
  return new Date(iso).toISOString().split('T')[0];
}

const LABEL_PRESETS = [
  'Frontend', 'Backend', 'Database', 'UI/UX', 'API', 'Dokumentasi', 'Review', 'Perancangan',
];

const LABEL_COLORS = {
  Frontend:    { bg: '#DBEAFE', text: '#1D4ED8' },
  Backend:     { bg: '#D1FAE5', text: 'var(--emerald-dark)' },
  Database:    { bg: '#EDE9FE', text: '#6D28D9' },
  'UI/UX':     { bg: '#FCE7F3', text: '#BE185D' },
  API:         { bg: '#FEF3C7', text: '#B45309' },
  Dokumentasi: { bg: 'var(--bg-card-hover)', text: 'var(--text-secondary)' },
  Review:      { bg: '#CCFBF1', text: '#0F766E' },
  Perancangan: { bg: '#E0E7FF', text: '#4338CA' },
};

export default function TaskDetailModal({ isOpen, onClose, onSave, task, boards = [], projects = [] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState('');
  const [labels, setLabels] = useState([]);
  const [labelInput, setLabelInput] = useState('');
  const [showPresets, setShowPresets] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'To Do');
      setPriority(task.priority || 'Medium');
      setDeadline(formatDateInput(task.deadline));
      setLabels(task.labels || []);
    } else {
      setTitle('');
      setDescription('');
      setStatus('To Do');
      setPriority('Medium');
      setDeadline('');
      setLabels([]);
    }
    setLabelInput('');
    setShowPresets(false);
    setError('');
  }, [task, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Judul tugas wajib diisi.'); return; }

    onSave({
      ...task,
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      boardId: task?.boardId || null,
      labels,
    });
    onClose();
  };

  const addLabel = (l) => {
    const trimmed = l.trim();
    if (trimmed && !labels.includes(trimmed)) {
      setLabels(prev => [...prev, trimmed]);
    }
    setLabelInput('');
    setShowPresets(false);
  };

  const removeLabel = (l) => {
    setLabels(prev => prev.filter(x => x !== l));
  };

  const project = task ? projects.find(p =>
    boards.some(b => b.id === task.boardId && b.projectId === p.id)
  ) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={s.overlay}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={s.backdrop}
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
              <button onClick={onClose} style={s.closeBtn}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={s.form}>
              {error && <div style={s.error}>{error}</div>}

              {project && (
                <div style={s.metaRow}>
                  <span style={{ ...s.metaBadge, borderLeftColor: project.color }}>
                    {project.name}
                  </span>
                </div>
              )}

              {/* Title */}
              <div style={s.inputGroup}>
                <label style={s.label}>Judul</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Masukkan judul tugas"
                  style={s.input}
                  autoFocus
                />
              </div>

              {/* Description */}
              <div style={s.inputGroup}>
                <label style={s.label}>Deskripsi</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Masukkan deskripsi tugas (opsional)"
                  rows={3}
                  style={s.textarea}
                />
              </div>

              {/* Two columns: Status & Priority */}
              <div style={s.row}>
                <div style={{ ...s.inputGroup, flex: 1 }}>
                  <label style={s.label}>Status</label>
                  <div style={s.selectGroup}>
                    {STATUS_OPTIONS.map(opt => {
                      const sel = status === opt.value;
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setStatus(opt.value)}
                          style={{
                            ...s.statusBtn,
                            backgroundColor: sel ? `${opt.color}18` : 'transparent',
                            borderColor: sel ? opt.color : 'var(--border)',
                            color: sel ? opt.color : 'var(--text-secondary)',
                          }}
                        >
                          <Icon size={13} />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ ...s.inputGroup, flex: 1 }}>
                  <label style={s.label}>Prioritas</label>
                  <div style={s.selectGroup}>
                    {PRIORITY_OPTIONS.map(opt => {
                      const sel = priority === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setPriority(opt.value)}
                          style={{
                            ...s.priorityBtn,
                            backgroundColor: sel ? `${opt.color}18` : 'transparent',
                            borderColor: sel ? opt.color : 'var(--border)',
                            color: sel ? opt.color : 'var(--text-secondary)',
                          }}
                        >
                          <div style={{ ...s.priorityDot, backgroundColor: opt.color }} />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Deadline */}
              <div style={s.inputGroup}>
                <label style={s.label}>Deadline</label>
                <CalendarPopover
                  value={deadline}
                  onChange={setDeadline}
                  placeholder="Pilih deadline"
                />
              </div>

              {/* Labels / Kategori */}
              <div style={s.inputGroup}>
                <label style={s.label}>Kategori</label>
                <div style={s.labelsRow}>
                  <div style={s.labelInputWrapper}>
                    <Tag size={13} color="var(--text-muted)" />
                    <input
                      type="text"
                      value={labelInput}
                      onChange={e => setLabelInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') { e.preventDefault(); addLabel(labelInput); }
                      }}
                      onFocus={() => setShowPresets(true)}
                      placeholder="Tambah kategori..."
                      style={s.labelInput}
                    />
                    {labelInput && (
                      <button type="button" onClick={() => addLabel(labelInput)} style={s.labelAddBtn}>
                        <Plus size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Selected labels */}
                {labels.length > 0 && (
                  <div style={s.labelsList}>
                    {labels.map(l => {
                      const c = LABEL_COLORS[l] || { bg: 'var(--bg-card-hover)', text: 'var(--text-secondary)' };
                      return (
                        <span key={l} style={{ ...s.labelBadge, backgroundColor: c.bg, color: c.text }}>
                          {l}
                          <button type="button" onClick={() => removeLabel(l)} style={s.labelRemove}>&times;</button>
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Preset suggestions */}
                <AnimatePresence>
                  {showPresets && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      style={s.presets}
                    >
                      {LABEL_PRESETS.filter(p => !labels.includes(p)).map(p => (
                        <button key={p} type="button" onClick={() => addLabel(p)} style={s.presetBtn}>
                          {p}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions */}
              <div style={s.actions}>
                <button type="button" onClick={onClose} style={s.cancelBtn}>Batal</button>
                <motion.button
                  type="submit"
                  whileHover={{ filter: 'brightness(1.1)' }}
                  whileTap={{ scale: 0.97 }}
                  style={s.saveBtn}
                >
                  <Save size={14} /> Simpan
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const s = {
  overlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  backdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    backdropFilter: 'blur(6px)',
    zIndex: 1,
  },
  modal: {
    position: 'relative',
    zIndex: 2,
    backgroundColor: 'var(--bg-card)',
    borderRadius: 'var(--r-xl)',
    width: '100%',
    maxWidth: '560px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
    border: '1px solid var(--border)',
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.3px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: 'var(--r-sm)',
    display: 'flex',
  },
  form: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  error: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    color: 'var(--danger)',
    padding: '10px 14px',
    borderRadius: 'var(--r-sm)',
    fontSize: '13px',
    border: '1px solid rgba(239,68,68,0.2)',
  },
  metaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  metaBadge: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    backgroundColor: 'var(--bg-card-hover)',
    padding: '3px 10px',
    borderRadius: 'var(--r-sm)',
    borderLeft: '3px solid',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
  },
  label: {
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
  },
  input: {
    padding: '11px 14px',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
  },
  textarea: {
    padding: '11px 14px',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    resize: 'vertical',
    outline: 'none',
    fontFamily: 'inherit',
    width: '100%',
  },
  row: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  selectGroup: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  statusBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '7px 12px',
    borderRadius: 'var(--r-md)',
    border: '1.5px solid var(--border)',
    background: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600,
    transition: 'all 0.15s',
  },
  priorityBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '7px 12px',
    borderRadius: 'var(--r-md)',
    border: '1.5px solid var(--border)',
    background: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600,
    transition: 'all 0.15s',
  },
  priorityDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },

  select: {
    padding: '11px 14px',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  labelsRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  labelInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '9px 12px',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-input)',
  },
  labelInput: {
    border: 'none',
    background: 'none',
    color: 'var(--text-primary)',
    fontSize: '13px',
    outline: 'none',
    flex: 1,
    fontFamily: 'inherit',
  },
  labelAddBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--emerald)',
    border: 'none',
    color: '#fff',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    cursor: 'pointer',
    flexShrink: 0,
  },
  labelsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px',
    marginTop: '2px',
  },
  labelBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 'var(--r-full)',
    letterSpacing: '0.2px',
  },
  labelRemove: {
    background: 'none',
    border: 'none',
    color: 'inherit',
    cursor: 'pointer',
    fontSize: '14px',
    lineHeight: 1,
    padding: 0,
    opacity: 0.6,
  },
  presets: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    padding: '8px 10px',
    backgroundColor: 'var(--bg-card-hover)',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
  },
  presetBtn: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-full)',
    padding: '3px 10px',
    cursor: 'pointer',
    transition: 'var(--t-fast)',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '4px',
  },
  cancelBtn: {
    padding: '10px 18px',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px',
  },
  saveBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 24px',
    borderRadius: 'var(--r-md)',
    border: 'none',
    backgroundColor: 'var(--btn-primary-bg)',
    color: 'var(--btn-primary-text)',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '14px',
  },
};
