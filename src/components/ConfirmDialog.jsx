import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Hapus', cancelText = 'Batal', danger = true }) {
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
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0.12 }}
            style={s.modal}
          >
            <button onClick={onClose} style={s.closeBtn}>
              <X size={16} />
            </button>

            <div style={s.iconWrap}>
              <div style={{ ...s.iconBg, backgroundColor: danger ? '#FEF2F2' : '#FFFBEB' }}>
                <AlertTriangle size={20} color={danger ? 'var(--danger)' : '#F59E0B'} />
              </div>
            </div>

            <h3 style={s.title}>{title || 'Konfirmasi'}</h3>
            <p style={s.message}>{message || 'Yakin ingin melanjutkan?'}</p>

            <div style={s.actions}>
              <button onClick={onClose} style={s.cancelBtn}>{cancelText}</button>
              <button
                onClick={() => { onConfirm?.(); onClose(); }}
                style={{ ...s.confirmBtn, backgroundColor: danger ? 'var(--danger)' : '#000' }}
              >
                {confirmText}
              </button>
            </div>
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
    zIndex: 1100,
    padding: '16px',
  },
  backdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
    zIndex: 1,
  },
  modal: {
    position: 'relative',
    zIndex: 2,
    backgroundColor: 'var(--bg-card)',
    borderRadius: 'var(--r-xl)',
    width: '100%',
    maxWidth: '380px',
    padding: '28px 24px 20px',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
    border: '1px solid var(--border)',
    textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: 'var(--r-sm)',
    display: 'flex',
  },
  iconWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '12px',
  },
  iconBg: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '6px',
    letterSpacing: '-0.2px',
  },
  message: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
    marginBottom: '20px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  cancelBtn: {
    flex: 1,
    padding: '10px',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px',
  },
  confirmBtn: {
    flex: 1,
    padding: '10px',
    borderRadius: 'var(--r-md)',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '14px',
  },
};
