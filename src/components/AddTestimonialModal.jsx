import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';

const COLORS = [
  '#6366F1', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
];

export default function AddTestimonialModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [color, setColor] = useState(COLORS[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setRole('');
      setContent('');
      setRating(5);
      setColor(COLORS[0]);
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Nama wajib diisi.'); return; }
    if (name.trim().length < 2) { setError('Nama minimal 2 karakter.'); return; }
    if (!content.trim()) { setError('Testimoni wajib diisi.'); return; }
    if (content.trim().length < 10) { setError('Testimoni minimal 10 karakter.'); return; }

    onAdd({
      name: name.trim(),
      role: role.trim() || null,
      content: content.trim(),
      rating,
      color,
    });
    onClose();
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
              <h2 style={s.title}>Buat Testimoni</h2>
              <button onClick={onClose} style={s.closeBtn}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={s.form}>
              {error && <div style={s.error}>{error}</div>}

              <div style={s.inputGroup}>
                <label style={s.label}>Nama</label>
                <input
                  style={s.input}
                  placeholder="Masukkan nama Anda"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoFocus
                />
              </div>

              <div style={s.inputGroup}>
                <label style={s.label}>Posisi / Role</label>
                <input
                  style={s.input}
                  placeholder="Contoh: Frontend Developer"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                />
              </div>

              <div style={s.inputGroup}>
                <label style={s.label}>Rating</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '4px',
                        cursor: 'pointer',
                        color: i <= rating ? '#F59E0B' : 'var(--border)',
                        transition: 'var(--t-fast)',
                        transform: i <= rating ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      <Star size={24} fill={i <= rating ? '#F59E0B' : 'none'} strokeWidth={i <= rating ? 0 : 1.5} />
                    </button>
                  ))}
                </div>
              </div>

              <div style={s.inputGroup}>
                <label style={s.label}>Testimoni</label>
                <textarea
                  style={s.textarea}
                  placeholder="Tulis pengalaman Anda menggunakan Rekan..."
                  rows={4}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
              </div>

              <div style={s.inputGroup}>
                <label style={s.label}>Warna Aksen</label>
                <div style={s.colorGrid}>
                  {COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      style={{
                        ...s.colorCircle,
                        backgroundColor: c,
                        outline: color === c ? `3px solid ${c}` : 'none',
                        outlineOffset: color === c ? '3px' : '0',
                        transform: color === c ? 'scale(1.15)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={s.actions}>
                <button type="button" onClick={onClose} style={s.cancelBtn}>
                  Batal
                </button>
                <button type="submit" style={s.saveBtn}>
                  Kirim Testimoni
                </button>
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
    maxWidth: '480px',
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
    lineHeight: 1.5,
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
    backgroundColor: 'var(--btn-primary-bg)',
    color: 'var(--btn-primary-text)',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '14px',
  },
};
