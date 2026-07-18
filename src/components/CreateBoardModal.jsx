import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, GripVertical, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CalendarPopover from './CalendarPopover';

const COLORS = [
  { name: 'Indigo',   hex: '#6366F1' },
  { name: 'Emerald',  hex: '#10B981' },
  { name: 'Amber',    hex: '#F59E0B' },
  { name: 'Rose',     hex: '#F43F5E' },
  { name: 'Sky Blue', hex: '#0EA5E9' },
  { name: 'Violet',   hex: '#8B5CF6' },
  { name: 'Pink',     hex: '#EC4899' },
];

function SubtaskItem({ subtask, onUpdate, onRemove }) {
  return (
    <div style={siStyles.row}>
      <GripVertical size={10} style={{ color: 'var(--text-muted)', opacity: 0.4, flexShrink: 0 }} />
      <input
        type="text"
        value={subtask.text}
        onChange={e => onUpdate({ ...subtask, text: e.target.value })}
        placeholder="Subtask..."
        style={siStyles.input}
      />
      <button type="button" onClick={onRemove} style={siStyles.removeBtn}>
        <Trash2 size={10} />
      </button>
    </div>
  );
}

const PRIORITY_OPTIONS = [
  { value: 'High',   color: '#EF4444' },
  { value: 'Medium', color: '#F59E0B' },
  { value: 'Low',    color: '#6B7280' },
];

const LABEL_PRESETS = ['Frontend', 'Backend', 'Database', 'UI/UX', 'API', 'Dokumentasi', 'Review', 'Perancangan'];

const siStyles = {
  row: {
    display: 'flex', alignItems: 'center', gap: '6px',
    paddingLeft: '8px',
  },
  input: {
    flex: 1, padding: '6px 8px', borderRadius: 'var(--r-sm)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)', fontSize: '12px',
    outline: 'none', fontFamily: 'inherit',
  },
  removeBtn: {
    width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer', opacity: 0.5, flexShrink: 0,
    padding: 0,
  },
};

function TaskForm({ task, index, onUpdate, onRemove }) {
  const addSubtask = () => {
    onUpdate({ ...task, subtasks: [...(task.subtasks || []), { text: '' }] });
  };

  const updateSubtask = (i, st) => {
    const next = [...(task.subtasks || [])];
    next[i] = st;
    onUpdate({ ...task, subtasks: next });
  };

  const removeSubtask = (i) => {
    onUpdate({ ...task, subtasks: (task.subtasks || []).filter((_, idx) => idx !== i) });
  };

  const addLabel = (label) => {
    if (!(task.labels || []).includes(label)) {
      onUpdate({ ...task, labels: [...(task.labels || []), label] });
    }
  };

  const removeLabel = (label) => {
    onUpdate({ ...task, labels: (task.labels || []).filter(l => l !== label) });
  };

  const handleLabelInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      addLabel(e.target.value.trim());
      e.target.value = '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      style={tfStyles.card}
    >
      <div style={tfStyles.header}>
        <span style={tfStyles.index}>Tugas {index + 1}</span>
        <button type="button" onClick={onRemove} style={tfStyles.removeBtn}>
          <Trash2 size={11} /> Hapus
        </button>
      </div>

      <input
        type="text"
        value={task.title}
        onChange={e => onUpdate({ ...task, title: e.target.value })}
        placeholder="Judul tugas..."
        style={tfStyles.input}
        autoFocus={index > 0}
      />

      {/* Priority */}
      <div style={tfStyles.priorityRow}>
        <Flag size={12} color="var(--text-muted)" />
        {PRIORITY_OPTIONS.map(opt => {
          const sel = (task.priority || 'Medium') === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onUpdate({ ...task, priority: opt.value })}
              style={{
                ...tfStyles.priorityBtn,
                backgroundColor: sel ? `${opt.color}18` : 'transparent',
                borderColor: sel ? opt.color : 'var(--border)',
                color: sel ? opt.color : 'var(--text-secondary)',
              }}
            >
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: opt.color }} />
              {opt.value}
            </button>
          );
        })}
      </div>

      <CalendarPopover
        value={task.deadline || ''}
        onChange={(val) => onUpdate({ ...task, deadline: val })}
        placeholder="Deadline tugas"
      />

      {/* Labels */}
      <div>
        <div style={tfStyles.labelsWrap}>
          {(task.labels || []).map(label => (
            <span key={label} style={tfStyles.labelChip}>
              {label}
              <button type="button" onClick={() => removeLabel(label)} style={tfStyles.labelRemove}>×</button>
            </span>
          ))}
        </div>
        <div style={tfStyles.presetsWrap}>
          {LABEL_PRESETS.filter(p => !(task.labels || []).includes(p)).map(p => (
            <button key={p} type="button" onClick={() => addLabel(p)} style={tfStyles.presetBtn}>
              + {p}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Tambah label sendiri..."
          onKeyDown={handleLabelInput}
          style={tfStyles.labelInput}
        />
      </div>

      {(task.subtasks || []).map((st, i) => (
        <SubtaskItem
          key={i}
          subtask={st}
          onUpdate={st2 => updateSubtask(i, st2)}
          onRemove={() => removeSubtask(i)}
        />
      ))}

      <button type="button" onClick={addSubtask} style={tfStyles.addSubBtn}>
        <Plus size={10} /> Subtask
      </button>
    </motion.div>
  );
}

const tfStyles = {
  card: {
    padding: '10px 12px', borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-canvas)',
    display: 'flex', flexDirection: 'column', gap: '6px',
    overflow: 'hidden',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  index: { fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' },
  removeBtn: {
    display: 'flex', alignItems: 'center', gap: '3px',
    background: 'none', border: 'none', color: '#EF4444',
    cursor: 'pointer', fontSize: '10px', fontWeight: 600, opacity: 0.6, padding: 0,
  },
  input: {
    padding: '7px 10px', borderRadius: 'var(--r-sm)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)', fontSize: '12px',
    outline: 'none', fontFamily: 'inherit', fontWeight: 600,
  },
  priorityRow: {
    display: 'flex', alignItems: 'center', gap: '4px',
  },
  priorityBtn: {
    display: 'flex', alignItems: 'center', gap: '4px',
    padding: '3px 7px', borderRadius: 'var(--r-sm)',
    border: '1px solid var(--border)',
    cursor: 'pointer', fontSize: '10px', fontWeight: 600,
    fontFamily: 'inherit', transition: 'var(--t-fast)',
  },

  labelsWrap: {
    display: 'flex', flexWrap: 'wrap', gap: '3px', marginBottom: '4px',
  },
  labelChip: {
    display: 'inline-flex', alignItems: 'center', gap: '3px',
    padding: '2px 6px', borderRadius: 'var(--r-full)',
    backgroundColor: '#DBEAFE', color: '#1D4ED8',
    fontSize: '10px', fontWeight: 600,
  },
  labelRemove: {
    background: 'none', border: 'none', color: '#1D4ED8',
    cursor: 'pointer', padding: 0, fontSize: '12px', lineHeight: 1, opacity: 0.6,
  },
  presetsWrap: {
    display: 'flex', flexWrap: 'wrap', gap: '3px', marginBottom: '4px',
  },
  presetBtn: {
    padding: '2px 6px', borderRadius: 'var(--r-full)',
    border: '1px dashed var(--border)', background: 'transparent',
    color: 'var(--text-muted)', cursor: 'pointer', fontSize: '9px', fontWeight: 600,
    fontFamily: 'inherit',
  },
  labelInput: {
    width: '100%', padding: '4px 8px', borderRadius: 'var(--r-sm)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)', fontSize: '10px',
    outline: 'none', fontFamily: 'inherit',
  },
  addSubBtn: {
    display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center',
    padding: '5px', borderRadius: 'var(--r-sm)',
    border: '1px dashed var(--border)', background: 'transparent',
    color: 'var(--text-muted)', cursor: 'pointer', fontSize: '10px', fontWeight: 600,
    transition: 'var(--t-fast)',
  },
};

export default function CreateBoardModal({ isOpen, onClose, onSave, board }) {
  const [name,        setName]        = useState('');
  const [description, setDescription] = useState('');
  const [color,       setColor]       = useState('#6366F1');
  const [isPrivate,   setIsPrivate]   = useState(true);
  const [tasks,       setTasks]       = useState([]);
  const [error,       setError]       = useState('');
  const [showTasks,   setShowTasks]   = useState(false);

  useEffect(() => {
    if (board) {
      setName(board.name);
      setDescription(board.description || '');
      setColor(board.color);
      setIsPrivate(board.isPrivate);
      setTasks([]);
    } else {
      setName('');
      setDescription('');
      setColor('#6366F1');
      setIsPrivate(true);
      setTasks([]);
    }
    setError('');
    setShowTasks(false);
  }, [board, isOpen]);

  const updateTask = (index, updated) => {
    setTasks(prev => prev.map((t, i) => i === index ? updated : t));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Nama board wajib diisi.'); return; }
    if (name.trim().length < 3) { setError('Nama board minimal 3 karakter.'); return; }

    const validTasks = tasks.filter(t => t.title.trim());
    if (validTasks.length !== tasks.length) {
      setError('Ada tugas yang judulnya kosong. Isi atau hapus.');
      return;
    }

    onSave({
      board: { name: name.trim(), description: description.trim() || null, color, isPrivate },
      tasks: validTasks,
    });
    onClose();
  };

  const addNewTask = () => {
    setTasks(prev => [...prev, { title: '', deadline: '', priority: 'Medium', labels: [], subtasks: [] }]);
    setShowTasks(true);
  };

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
              <div style={s.headerLeft}>
                <motion.div
                  layout
                  animate={{ backgroundColor: color }}
                  transition={{ duration: 0.2 }}
                  style={s.colorDot}
                />
                <h3 style={s.title}>{board ? 'Ubah Board' : 'Buat Board Baru'}</h3>
              </div>
              <button onClick={onClose} style={s.closeBtn} aria-label="Tutup">
                <X size={18} />
              </button>
            </div>

            <div style={s.scrollBody}>
              <form onSubmit={handleSubmit} style={s.form}>
                {error && <div style={s.error}>{error}</div>}

                <div style={s.inputGroup}>
                  <label style={s.label}>Nama Board *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Masukkan nama board"
                    style={s.input}
                    autoFocus
                  />
                </div>

                <div style={s.inputGroup}>
                  <label style={s.label}>Deskripsi</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Masukkan deskripsi detail (opsional)"
                    rows={3}
                    style={s.textarea}
                  />
                </div>

                <div style={s.inputGroup}>
                  <label style={s.label}>Warna Tema Board</label>
                  <div style={s.colorGrid}>
                    {COLORS.map(c => {
                      const sel = color === c.hex;
                      return (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => setColor(c.hex)}
                          title={c.name}
                          style={{
                            ...s.colorCircle,
                            backgroundColor: c.hex,
                            outline: sel ? `3px solid ${c.hex}` : 'none',
                            outlineOffset: sel ? '3px' : '0',
                            transform: sel ? 'scale(1.15)' : 'scale(1)',
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                <div style={s.toggleGroup}>
                  <div style={s.toggleText}>
                    <span style={s.toggleTitle}>Board Privat</span>
                    <span style={s.toggleDesc}>Hanya Anda yang dapat mengakses board ini.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPrivate(v => !v)}
                    style={{
                      ...s.switch,
                      backgroundColor: isPrivate ? '#10B981' : 'var(--border)',
                    }}
                  >
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      style={{
                        ...s.switchThumb,
                        marginLeft: isPrivate ? 'auto' : '0',
                      }}
                    />
                  </button>
                </div>

                {/* Tasks section */}
                <div style={s.tasksSection}>
                  <div style={s.tasksHeader}>
                    <span style={s.tasksTitle}>Tugas & Subtugas</span>
                    {tasks.length > 0 && (
                      <span style={s.tasksCount}>{tasks.length} tugas</span>
                    )}
                  </div>

                  <AnimatePresence mode="popLayout">
                    {tasks.map((task, i) => (
                      <TaskForm
                        key={i}
                        task={task}
                        index={i}
                        onUpdate={updated => updateTask(i, updated)}
                        onRemove={() => setTasks(prev => prev.filter((_, idx) => idx !== i))}
                      />
                    ))}
                  </AnimatePresence>

                  {!showTasks ? (
                    <button type="button" onClick={addNewTask} style={s.addTaskBtn}>
                      <Plus size={13} /> Tambah Tugas
                    </button>
                  ) : (
                    <button type="button" onClick={addNewTask} style={s.addTaskBtnSm}>
                      <Plus size={11} /> Tambah Tugas Lain
                    </button>
                  )}
                </div>

                <div style={s.actions}>
                  <button type="button" onClick={onClose} style={s.cancelBtn}>Batal</button>
                  <motion.button
                    type="submit"
                    whileHover={{ filter: 'brightness(1.1)' }}
                    whileTap={{ scale: 0.97 }}
                    animate={{ backgroundColor: color }}
                    transition={{ duration: 0.2 }}
                    style={s.saveBtn}
                  >
                    {board ? 'Simpan' : 'Buat'}
                  </motion.button>
                </div>
              </form>
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
    maxWidth: '480px', maxHeight: '90vh',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
    border: '1px solid var(--border)',
  },
  scrollBody: {
    overflowY: 'auto', flex: 1,
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'var(--bg-card)', flexShrink: 0,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  colorDot: { width: '12px', height: '12px', borderRadius: '50%' },
  title: { fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.3px' },
  closeBtn: {
    background: 'none', border: 'none', color: 'var(--text-muted)',
    cursor: 'pointer', padding: '6px', borderRadius: 'var(--r-sm)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  form: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' },
  error: {
    backgroundColor: 'rgba(239,68,68,0.08)', color: 'var(--danger)',
    padding: '10px 14px', borderRadius: 'var(--r-sm)',
    fontSize: '13px', border: '1px solid rgba(239,68,68,0.2)',
  },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '7px' },
  label: {
    fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)',
    textTransform: 'uppercase', letterSpacing: '0.6px',
  },
  input: {
    padding: '11px 14px', borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)', backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)', fontSize: '14px', outline: 'none', width: '100%',
  },
  textarea: {
    padding: '11px 14px', borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)', backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)', fontSize: '14px',
    resize: 'vertical', outline: 'none', fontFamily: 'inherit', width: '100%',
  },
  colorGrid: {
    display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '2px',
  },
  colorCircle: {
    width: '30px', height: '30px', borderRadius: '50%',
    border: 'none', cursor: 'pointer', transition: 'transform 0.15s, outline 0.15s',
    flexShrink: 0,
  },
  toggleGroup: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
  },
  toggleText: { display: 'flex', flexDirection: 'column', gap: '2px' },
  toggleTitle: { fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' },
  toggleDesc: { fontSize: '12px', color: 'var(--text-muted)' },
  switch: {
    width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer',
    border: 'none', padding: '3px', display: 'flex', alignItems: 'center',
    transition: 'background-color 0.25s', flexShrink: 0,
  },
  switchThumb: {
    width: '18px', height: '18px', borderRadius: '50%',
    backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
  tasksSection: {
    display: 'flex', flexDirection: 'column', gap: '8px',
  },
  tasksHeader: {
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  tasksTitle: {
    fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)',
    textTransform: 'uppercase', letterSpacing: '0.6px',
  },
  tasksCount: {
    fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)',
  },
  addTaskBtn: {
    display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center',
    padding: '10px', borderRadius: 'var(--r-md)',
    border: '2px dashed var(--border)', background: 'transparent',
    color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
    transition: 'var(--t-fast)',
  },
  addTaskBtnSm: {
    display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center',
    padding: '6px', borderRadius: 'var(--r-sm)',
    border: '1px dashed var(--border)', background: 'transparent',
    color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, fontSize: '11px',
    transition: 'var(--t-fast)',
  },
  actions: {
    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px',
  },
  cancelBtn: {
    padding: '10px 18px', borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)', backgroundColor: 'transparent',
    color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
  },
  saveBtn: {
    padding: '10px 24px', borderRadius: 'var(--r-md)',
    border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '14px',
  },
};
