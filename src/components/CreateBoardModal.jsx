import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = [
  { name: 'Indigo',   hex: '#6366F1' },
  { name: 'Emerald',  hex: '#10B981' },
  { name: 'Amber',    hex: '#F59E0B' },
  { name: 'Rose',     hex: '#F43F5E' },
  { name: 'Sky Blue', hex: '#0EA5E9' },
  { name: 'Violet',   hex: '#8B5CF6' },
  { name: 'Pink',     hex: '#EC4899' },
];

export default function CreateBoardModal({ isOpen, onClose, onSave, board }) {
  const [name,        setName]        = useState('');
  const [description, setDescription] = useState('');
  const [color,       setColor]       = useState('#6366F1');
  const [isPrivate,   setIsPrivate]   = useState(true);
  const [error,       setError]       = useState('');

  useEffect(() => {
    if (board) {
      setName(board.name);
      setDescription(board.description || '');
      setColor(board.color);
      setIsPrivate(board.isPrivate);
    } else {
      setName('');
      setDescription('');
      setColor('#6366F1');
      setIsPrivate(true);
    }
    setError('');
  }, [board, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Nama board wajib diisi.'); return; }
    if (name.trim().length < 3) { setError('Nama board minimal 3 karakter.'); return; }
    onSave({ name: name.trim(), description: description.trim() || null, color, isPrivate });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={s.overlay}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={s.backdrop}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.95, y: 20  }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
            style={s.modal}
          >
            {/* Header */}
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

            {/* Form */}
            <form onSubmit={handleSubmit} style={s.form}>
              {error && <div style={s.error}>{error}</div>}

              {/* Name */}
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

              {/* Description */}
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

              {/* Color picker */}
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

              {/* Private toggle */}
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

              {/* Actions */}
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
    maxWidth: '460px',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
    border: '1px solid var(--border)',
    overflow: 'hidden',
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'var(--bg-card)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  colorDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    backgroundColor: 'var(--bg-card)',
  },
  error: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    color: 'var(--danger)',
    padding: '10px 14px',
    borderRadius: 'var(--r-sm)',
    fontSize: '13px',
    border: '1px solid rgba(239,68,68,0.2)',
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
  colorGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '2px',
  },
  colorCircle: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.15s, outline 0.15s',
    flexShrink: 0,
  },
  toggleGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 0',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
  },
  toggleText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  toggleTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  toggleDesc: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  switch: {
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    cursor: 'pointer',
    border: 'none',
    padding: '3px',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.25s',
    flexShrink: 0,
  },
  switchThumb: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
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
    padding: '10px 24px',
    borderRadius: 'var(--r-md)',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '14px',
  },
};
