import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dropdown({
  value,
  onChange,
  options,
  placeholder = 'Pilih...',
  align = 'left',
  style,
}) {
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const ref = useRef(null);
  const listRef = useRef(null);

  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = useCallback((opt) => {
    onChange(opt.value);
    setOpen(false);
  }, [onChange]);

  useEffect(() => {
    if (!open) { setFocusedIdx(-1); return; }
    const idx = options.findIndex(o => o.value === value);
    setFocusedIdx(idx >= 0 ? idx : 0);
  }, [open, options, value]);

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setFocusedIdx(i => Math.min(i + 1, options.length - 1)); break;
      case 'ArrowUp': e.preventDefault(); setFocusedIdx(i => Math.max(i - 1, 0)); break;
      case 'Enter':
      case ' ': e.preventDefault(); if (focusedIdx >= 0) handleSelect(options[focusedIdx]); break;
      case 'Escape': setOpen(false); break;
      case 'Tab': setOpen(false); break;
    }
  };

  useEffect(() => {
    if (open && listRef.current && focusedIdx >= 0) {
      const el = listRef.current.children[focusedIdx];
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIdx, open]);

  return (
    <div
      ref={ref}
      style={{ ...styles.wrapper, ...style }}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected?.icon && (
          <span style={styles.triggerIcon}>
            <selected.icon size={15} />
          </span>
        )}
        <span style={{
          ...styles.triggerLabel,
          color: selected ? 'var(--text-primary)' : 'var(--text-muted)',
        }}>
          {selected ? selected.label : placeholder}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18, ease: 'easeInOut' }}
          style={styles.chevron}
        >
          <ChevronDown size={14} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={listRef}
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              ...styles.menu,
              [align === 'right' ? 'right' : 'left']: 0,
            }}
            role="listbox"
          >
            {options.map((opt, i) => {
              const sel = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={sel}
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={() => setFocusedIdx(i)}
                  style={{
                    ...styles.option,
                    backgroundColor: sel
                      ? 'var(--primary-bg, #EEF2FF)'
                      : focusedIdx === i
                        ? 'var(--bg-card-hover, #F3F4F6)'
                        : 'transparent',
                    color: sel
                      ? 'var(--primary, #6366F1)'
                      : 'var(--text-secondary)',
                  }}
                >
                  {opt.icon && (
                    <span style={styles.optionIcon}>
                      <opt.icon
                        size={15}
                        color={sel ? 'var(--primary, #6366F1)' : 'var(--text-muted)'}
                      />
                    </span>
                  )}
                  <span style={{
                    ...styles.optionLabel,
                    fontWeight: sel ? 700 : 500,
                    color: sel ? 'var(--primary, #6366F1)' : 'var(--text-secondary)',
                  }}>
                    {opt.label}
                  </span>
                  {sel && (
                    <span style={styles.checkIcon}>
                      <Check size={13} strokeWidth={3} color="var(--primary, #6366F1)" />
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  wrapper: {
    position: 'relative',
    fontFamily: 'inherit',
    outline: 'none',
    minWidth: '100px',
  },
  trigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '7px 14px',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-input)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '12px',
    fontWeight: 500,
    transition: 'border-color 0.15s, box-shadow 0.15s',
    outline: 'none',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },
  triggerIcon: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    color: 'var(--text-muted)',
  },
  triggerLabel: {
    flex: 1,
    textAlign: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '12px',
    fontWeight: 600,
  },
  chevron: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    color: 'var(--text-muted)',
    lineHeight: 0,
  },
  menu: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    minWidth: '100%',
    width: 'max-content',
    maxWidth: '280px',
    maxHeight: '320px',
    overflowY: 'auto',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)',
    zIndex: 100,
    padding: '4px',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '9px 12px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    textAlign: 'left',
    borderRadius: '8px',
    transition: 'background-color 0.12s',
    fontFamily: 'inherit',
    outline: 'none',
  },
  optionIcon: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    width: '20px',
    justifyContent: 'center',
  },
  optionLabel: {
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  checkIcon: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    marginLeft: 'auto',
  },
};
