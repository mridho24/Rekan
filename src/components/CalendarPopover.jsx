import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, Calendar as CalendarIcon } from 'lucide-react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
} from '@floating-ui/react';

const hoverStyle = document.createElement('style');
hoverStyle.textContent = `
  .cal-day-btn { height: 40px; border-radius: 10px; border: 1.5px solid transparent; cursor: pointer; font-size: 13px; font-family: inherit; text-align: center; transition: background-color 0.12s, border-color 0.12s, color 0.12s; display: flex; align-items: center; justify-content: center; }
  .cal-day-btn:hover { background-color: var(--bg-card-hover) !important; }
  .cal-day-btn:focus-visible { outline: 2px solid var(--text-primary); outline-offset: 2px; }
  .cal-nav-btn:hover { background-color: var(--bg-card-hover) !important; }
  .cal-nav-btn:focus-visible { outline: 2px solid var(--text-primary); outline-offset: 2px; border-radius: 8px; }
  .cal-header-btn:hover { background-color: var(--bg-card-hover) !important; }
  .cal-header-btn:focus-visible { outline: 2px solid var(--text-primary); outline-offset: 2px; border-radius: 6px; }
  .cal-picker-cell:hover { background-color: var(--bg-card-hover) !important; }
  .cal-picker-cell:focus-visible { outline: 2px solid var(--text-primary); outline-offset: 2px; border-radius: 10px; }
  .cal-footer-btn:hover { background-color: var(--bg-card-hover) !important; }
  .cal-footer-btn:focus-visible { outline: 2px solid var(--text-primary); outline-offset: 2px; border-radius: 8px; }
  .cal-year-nav-btn:hover { background-color: var(--bg-card-hover) !important; }
  .cal-year-nav-btn:focus-visible { outline: 2px solid var(--text-primary); outline-offset: 2px; border-radius: 8px; }
`;
document.head.appendChild(hoverStyle);

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function formatDateDisplay(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function toLocalDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isToday(d) {
  return isSameDay(d, new Date());
}

const YEAR_STEP = 16;

function CalendarPopover({ value, onChange, placeholder = 'Pilih tanggal', disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => value ? new Date(value) : new Date());
  const [selected, setSelected] = useState(value ? new Date(value) : null);
  const [mode, setMode] = useState('days');
  const [yearBase, setYearBase] = useState(() => Math.floor((value ? new Date(value).getFullYear() : new Date().getFullYear()) / YEAR_STEP) * YEAR_STEP);
  const [animDir, setAnimDir] = useState(0);
  const focusRef = useRef(null);
  const dayGridRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
    middleware: [offset(8), flip(), shift({ padding: 16 })],
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, role]);

  useEffect(() => {
    if (value) {
      setSelected(new Date(value));
    }
  }, [value]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
      if (e.key === 'Enter' && selected) {
        onChange(toLocalDateStr(selected));
        setIsOpen(false);
      }
      if (mode === 'days' && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        navigateDay(e.key);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, selected, onChange, mode]);

  const navigateDay = (key) => {
    const d = selected ? new Date(selected) : new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const step = key === 'ArrowUp' ? -7 : key === 'ArrowDown' ? 7 : key === 'ArrowLeft' ? -1 : 1;
    d.setDate(d.getDate() + step);
    setSelected(d);
    setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  const handleDayClick = useCallback((day) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setSelected(d);
    onChange(toLocalDateStr(d));
    setIsOpen(false);
  }, [viewDate, onChange]);

  const handleToday = useCallback(() => {
    const d = new Date();
    setSelected(d);
    setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
    onChange(toLocalDateStr(d));
    setIsOpen(false);
  }, [onChange]);

  const handleClear = useCallback(() => {
    setSelected(null);
    onChange('');
    setIsOpen(false);
  }, [onChange]);

  const prevMonth = () => { setAnimDir(-1); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)); };
  const nextMonth = () => { setAnimDir(1); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)); };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const selectMonth = (m) => {
    setViewDate(new Date(year, m, 1));
    setMode('days');
  };

  const selectYear = (y) => {
    setViewDate(new Date(y, month, 1));
    setMode('days');
  };

  const displayText = value ? formatDateDisplay(value) : '';

  const dayVariants = {
    enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  };

  const today = new Date();

  return (
    <>
      <div
        ref={refs.setReference}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="Pilih tanggal"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); !disabled && setIsOpen(!isOpen); } }}
        style={{
          ...s.trigger,
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          borderColor: isOpen ? 'var(--emerald)' : 'var(--border)',
        }}
        {...getReferenceProps()}
      >
        <CalendarIcon size={14} color={value ? 'var(--emerald)' : 'var(--text-muted)'} />
        <span style={{ color: value ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '13px' }}>
          {displayText || placeholder}
        </span>
        {value && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleClear(); }}
            style={s.clearBtn}
            aria-label="Hapus tanggal"
          >
            ×
          </button>
        )}
      </div>

      <FloatingPortal>
        <AnimatePresence>
          {isOpen && (
            <div ref={refs.setFloating} style={{ ...floatingStyles, zIndex: 9999, backgroundColor: '#FFFFFF', borderRadius: '16px' }} key="calendar-floating">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={s.popover}
              role="dialog"
              aria-label="Pilih tanggal"
              {...getFloatingProps()}
            >
              {/* ── Header ── */}
              <div style={s.header}>
                <button type="button" onClick={prevMonth} className="cal-nav-btn" style={s.navBtn} aria-label="Sebelumnya">
                  <ChevronLeft size={16} />
                </button>

                <div style={s.headerLabelGroup}>
                  <button
                    type="button"
                    onClick={() => setMode(mode === 'months' ? 'days' : 'months')}
                    className="cal-header-btn"
                    style={s.headerLabelBtn}
                  >
                    {MONTHS[month]}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode(mode === 'years' ? 'days' : 'years')}
                    className="cal-header-btn"
                    style={s.headerLabelBtn}
                  >
                    {year}
                  </button>
                  <ChevronDown size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                </div>

                <button type="button" onClick={nextMonth} className="cal-nav-btn" style={s.navBtn} aria-label="Berikutnya">
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* ── Month Picker (3x4) ── */}
              {mode === 'months' && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="month-picker"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    style={s.pickerGrid3x4}
                  >
                    {MONTHS_SHORT.map((m, i) => (
                      <button
                        key={i}
                        type="button"
                        className="cal-picker-cell"
                        onClick={() => selectMonth(i)}
                        style={{
                          ...s.pickerCell,
                          backgroundColor: i === month ? 'var(--text-primary)' : 'transparent',
                          color: i === month ? '#fff' : 'var(--text-secondary)',
                        }}
                      >
                        {m}
                      </button>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* ── Year Picker (4x4) ── */}
              {mode === 'years' && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`year-picker-${yearBase}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    style={s.yearWrap}
                  >
                    <div style={s.pickerGrid4x4}>
                      {Array.from({ length: YEAR_STEP }).map((_, i) => {
                        const y = yearBase + i;
                        return (
                          <button
                            key={y}
                            type="button"
                            className="cal-picker-cell"
                            onClick={() => selectYear(y)}
                            style={{
                              ...s.pickerCell,
                              backgroundColor: y === year ? 'var(--text-primary)' : 'transparent',
                              color: y === year ? '#fff' : 'var(--text-secondary)',
                            }}
                          >
                            {y}
                          </button>
                        );
                      })}
                    </div>
                    <div style={s.yearNav}>
                      <button type="button" className="cal-year-nav-btn" onClick={() => setYearBase(yb => yb - YEAR_STEP)} style={s.yearNavBtn}>
                        <ChevronLeft size={14} /> Sebelumnya
                      </button>
                      <button type="button" className="cal-year-nav-btn" onClick={() => setYearBase(yb => yb + YEAR_STEP)} style={s.yearNavBtn}>
                        Berikutnya <ChevronRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* ── Days Grid ── */}
              {mode === 'days' && (
                <>
                  <div style={s.dayHeaders}>
                    {DAYS.map(d => (
                      <div key={d} style={s.dayHeader}>{d}</div>
                    ))}
                  </div>

                  <div ref={dayGridRef} style={s.grid}>
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`empty-${i}`} style={s.cell} />
                    ))}
                    <AnimatePresence mode="popLayout" custom={animDir}>
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const d = new Date(year, month, day);
                        const isSelectedDate = selected && isSameDay(d, selected);
                        const isTodayDate = isToday(d);

                        return (
                          <motion.button
                            key={d.toISOString()}
                            layout
                            custom={animDir}
                            variants={dayVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                            type="button"
                            className="cal-day-btn"
                            onClick={() => handleDayClick(day)}
                            aria-label={`${day} ${MONTHS[month]} ${year}`}
                            aria-selected={isSelectedDate}
                            style={{
                              ...s.dayBtn,
                              backgroundColor: isSelectedDate ? 'var(--text-primary)' : 'transparent',
                              color: isSelectedDate ? '#fff' : isTodayDate ? 'var(--text-primary)' : 'var(--text-primary)',
                              border: isTodayDate && !isSelectedDate ? '1.5px solid var(--text-primary)' : '1.5px solid transparent',
                              fontWeight: isSelectedDate || isTodayDate ? 600 : 400,
                            }}
                          >
                            {day}
                          </motion.button>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </>
              )}

              {/* ── Footer ── */}
              <div style={s.footer}>
                <button type="button" className="cal-footer-btn" onClick={handleToday} style={s.footerBtn}>
                  Hari Ini
                </button>
                <div style={{ flex: 1 }} />
                {selected && (
                  <button type="button" className="cal-footer-btn" onClick={handleClear} style={s.clearFooterBtn}>
                    Hapus
                  </button>
                )}
              </div>
            </motion.div>
          </div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  );
}

const s = {
  trigger: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '10px 14px', borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-input)',
    transition: 'border-color 0.15s',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    minHeight: '42px',
  },
  clearBtn: {
    marginLeft: 'auto', background: 'none', border: 'none',
    color: 'var(--text-muted)', cursor: 'pointer',
    fontSize: '16px', padding: '0 2px', lineHeight: 1,
  },
  popover: {
    width: '340px',
    backgroundColor: '#FFFFFF',
    border: '1px solid rgba(0,0,0,0.06)',
    borderRadius: '16px',
    boxShadow: '0 12px 40px rgba(0,0,0,.12)',
    padding: '16px',
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  headerLabelGroup: {
    display: 'flex', alignItems: 'center', gap: '2px',
  },
  headerLabelBtn: {
    fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)',
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '4px 6px', borderRadius: '6px',
    fontFamily: 'inherit',
    transition: 'background-color 0.12s',
  },
  navBtn: {
    width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '8px', border: 'none', background: 'transparent',
    color: 'var(--text-muted)', cursor: 'pointer',
    transition: 'background-color 0.12s',
  },
  pickerGrid3x4: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px',
  },
  pickerGrid4x4: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px',
  },
  pickerCell: {
    padding: '10px 4px', borderRadius: '10px', border: 'none',
    cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit',
    textAlign: 'center', fontWeight: 500,
    transition: 'background-color 0.12s, color 0.12s',
  },
  yearWrap: {
    display: 'flex', flexDirection: 'column', gap: '10px',
  },
  yearNav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: '8px',
  },
  yearNavBtn: {
    display: 'flex', alignItems: 'center', gap: '4px',
    padding: '6px 10px', borderRadius: '8px', border: 'none',
    background: 'transparent', color: 'var(--text-muted)',
    cursor: 'pointer', fontSize: '11px', fontWeight: 600,
    fontFamily: 'inherit',
    transition: 'background-color 0.12s',
  },
  dayHeaders: {
    display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px',
  },
  dayHeader: {
    textAlign: 'center', fontSize: '11px', fontWeight: 600,
    color: 'var(--text-muted)', padding: '4px 0',
  },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px',
  },
  cell: { height: '40px' },
  dayBtn: {
    height: '40px', borderRadius: '10px', border: '1.5px solid transparent',
    cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit',
    textAlign: 'center', transition: 'background-color 0.12s, border-color 0.12s, color 0.12s',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  footer: {
    display: 'flex', alignItems: 'center', gap: '8px',
    paddingTop: '12px', borderTop: '1px solid var(--border)',
  },
  footerBtn: {
    padding: '6px 12px', borderRadius: '8px', border: 'none',
    background: 'transparent', color: 'var(--text-muted)',
    cursor: 'pointer', fontSize: '12px', fontWeight: 600,
    fontFamily: 'inherit', transition: 'background-color 0.12s',
  },
  clearFooterBtn: {
    padding: '6px 12px', borderRadius: '8px', border: 'none',
    background: 'transparent', color: 'var(--danger)',
    cursor: 'pointer', fontSize: '12px', fontWeight: 600,
    fontFamily: 'inherit', transition: 'background-color 0.12s',
  },
};

export default CalendarPopover;
export { formatDateDisplay, toLocalDateStr };