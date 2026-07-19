import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = ['welcome', 'boards', 'tasks', 'ready'];
const TOTAL = STEPS.length;

const styleId = 'onboarding-styles';
if (!document.getElementById(styleId)) {
  const s = document.createElement('style');
  s.id = styleId;
  s.textContent = `
    .onb-page {
      background: var(--bg-page);
      position: relative;
      overflow: hidden;
      width: 100%;
      flex: 1;
    }
    .onb-page::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 55% 40% at 78% 55%, rgba(16,185,129,0.07) 0%, transparent 70%),
        radial-gradient(ellipse 35% 30% at 20% 45%, rgba(16,185,129,0.04) 0%, transparent 60%);
      pointer-events: none;
    }
    .onb-blob {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(70px);
      opacity: 0.4;
    }
    @media (max-width: 960px) {
      .onb-inner {
        flex-direction: column !important;
        gap: 32px !important;
        padding: 40px 24px !important;
        align-items: center !important;
        text-align: center !important;
      }
      .onb-left {
        flex: 1 1 100% !important;
        max-width: 100% !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
      }
      .onb-left p {
        margin-left: auto !important;
        margin-right: auto !important;
      }
      .onb-right {
        flex: 1 1 100% !important;
        max-width: 100% !important;
        width: 100% !important;
      }
      .onb-right-card {
        max-width: 520px !important;
        width: 100% !important;
      }
    }
  `;
  document.head.appendChild(s);
}

const sf = document.createElement('template');
sf.innerHTML = '<svg><filter id="shadow-s"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.08"/></filter><filter id="shadow-m"><feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.1"/></filter></svg>';
if (!document.getElementById('shadow-s')) {
  const f = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  f.style.cssText = 'position:absolute;width:0;height:0';
  f.innerHTML = '<filter id="shadow-s"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.08"/></filter><filter id="shadow-m"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.1"/></filter><filter id="shadow-lg"><feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.12"/></filter>';
  document.body.appendChild(f);
}

function Progress({ current }) {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {Array.from({ length: TOTAL }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === current ? '28px' : '8px',
            height: '6px',
            borderRadius: '3px',
            backgroundColor: i <= current ? 'var(--emerald)' : 'var(--border)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      ))}
    </div>
  );
}

function CheckItem({ children, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '14px',
        color: 'var(--text-secondary)',
        lineHeight: 1.4,
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.15, type: 'spring', stiffness: 300, damping: 18 }}
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: 'var(--emerald)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <motion.path
            d="M1 4L3.5 6.5L9 1"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: delay + 0.3, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
      </motion.div>
      {children}
    </motion.div>
  );
}

// ─── SVG App Mockups ───────────────────────────

/* Dashboard Mockup */
function MockDashboard() {
  return (
    <svg viewBox="0 0 600 420" fill="none" style={{ width: '100%', height: '100%' }}>
      {/* Page background */}
      <rect width="600" height="420" rx="16" fill="var(--bg-canvas)" />

      {/* ── Sidebar ── */}
      <rect x="0" y="0" width="72" height="420" fill="var(--bg-sidebar)" rx="0" />
      <rect x="16" y="18" width="40" height="40" rx="10" fill="var(--emerald)" opacity="0.12" />
      <rect x="26" y="28" width="20" height="20" rx="6" fill="var(--emerald)" />
      <g transform="translate(16, 80)">
        {[
          [0, '--emerald', 0.12], [42, '', 0], [84, '', 0],
          [126, '', 0], [168, '', 0],
        ].map(([y, c, o], i) => (
          <g key={i}>
            <rect x="0" y={y} width="40" height="40" rx="10" fill={c ? `var(${c})` : 'transparent'} fillOpacity={c ? o : 0} />
            <rect x="12" y={y + 11} width="16" height="4" rx="2" fill={c ? 'var(--emerald)' : 'var(--text-muted)'} opacity={c ? 0.7 : 0.35} />
            <rect x="10" y={y + 19} width="20" height="3" rx="1.5" fill={c ? 'var(--emerald)' : 'var(--text-muted)'} opacity={c ? 0.5 : 0.2} />
          </g>
        ))}
      </g>
      <circle cx="36" cy="390" r="14" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="1" />
      <circle cx="36" cy="390" r="4" fill="var(--emerald)" />

      {/* ── Main Content ── */}
      <rect x="92" y="18" width="200" height="10" rx="4" fill="var(--border)" />
      <rect x="92" y="34" width="140" height="7" rx="3" fill="var(--text-muted)" opacity="0.5" />

      {/* Notification icons top right */}
      <rect x="515" y="18" width="28" height="28" rx="8" fill="var(--bg-card-hover)" />
      <rect x="550" y="18" width="28" height="28" rx="8" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="1" />
      <circle cx="536" cy="22" r="4" fill="var(--danger)" />

      {/* ── Stat Cards ── */}
      {[
        [92, 56, '#10B981', '3', 'Projects'],
        [276, 56, '#F59E0B', '12', 'Active Tasks'],
        [460, 56, '#22C55E', '8', 'Completed'],
      ].map(([x, y, col, val, label], i) => (
        <g key={i}>
          <rect x={x} y={y} width="168" height="84" rx="12" fill="var(--bg-card)" filter="url(#shadow-s)" />
          <rect x={x} y={y} width="4" height="84" rx="2" fill={col} />
          <text x={x + 20} y={y + 30} fill={col} fontSize="26" fontWeight="700" fontFamily="Inter, sans-serif">{val}</text>
          <text x={x + 20} y={y + 52} fill="var(--text-muted)" fontSize="12" fontWeight="500" fontFamily="Inter, sans-serif">{label}</text>
          <rect x={x + 20} y={y + 66} width="60" height="4" rx="2" fill={col} opacity="0.15" />
        </g>
      ))}

      {/* ── Section: Recent Boards ── */}
      <text x="92" y="174" fill="var(--text-primary)" fontSize="14" fontWeight="600" fontFamily="Inter, sans-serif">Recent Boards</text>

      {[
        [92, 188, '#6366F1', 'Frontend Dev', '12 tasks', 'Jul 25'],
        [276, 188, '#10B981', 'Database', '8 tasks', 'Jul 28'],
        [460, 188, '#F59E0B', 'UI/UX', '5 tasks', 'Aug 1'],
      ].map(([x, y, col, name, count, date], i) => (
        <g key={i}>
          <rect x={x} y={y} width="168" height="96" rx="12" fill="var(--bg-card)" filter="url(#shadow-s)" />
          <rect x={x} y={y} width="168" height="32" rx="12" fill={col} opacity="0.08" />
          <rect x={x + 14} y={y + 10} width="8" height="10" rx="3" fill={col} />
          <text x={x + 28} y={y + 20} fill="var(--text-primary)" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">{name}</text>
          <rect x={x + 14} y={y + 48} width="50" height="4" rx="2" fill={col} opacity="0.15" />
          <rect x={x + 14} y={y + 56} width="80" height="4" rx="2" fill="var(--text-muted)" opacity="0.2" />
          <text x={x + 14} y={y + 78} fill="var(--text-muted)" fontSize="11" fontFamily="Inter, sans-serif">{count}</text>
          <text x={x + 130} y={y + 78} fill="var(--text-muted)" fontSize="11" fontFamily="Inter, sans-serif">{date}</text>
        </g>
      ))}
    </svg>
  );
}

/* Kanban Board Mockup */
function MockBoard() {
  return (
    <svg viewBox="0 0 600 420" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="600" height="420" rx="16" fill="var(--bg-canvas)" />

      {/* Sidebar */}
      <rect x="0" y="0" width="72" height="420" fill="var(--bg-sidebar)" />
      <rect x="16" y="18" width="40" height="40" rx="10" fill="var(--emerald)" opacity="0.12" />
      <rect x="26" y="28" width="20" height="20" rx="6" fill="var(--emerald)" />
      <g transform="translate(16, 80)">
        {[
          [0, '', 0], [42, '--emerald', 0.12], [84, '', 0],
          [126, '', 0], [168, '', 0],
        ].map(([y, c, o], i) => (
          <g key={i}>
            <rect x="0" y={y} width="40" height="40" rx="10" fill={c ? `var(${c})` : 'transparent'} fillOpacity={c ? o : 0} />
            <rect x="12" y={y + 11} width="16" height="4" rx="2" fill={c ? 'var(--emerald)' : 'var(--text-muted)'} opacity={c ? 0.7 : 0.35} />
            <rect x="10" y={y + 19} width="20" height="3" rx="1.5" fill={c ? 'var(--emerald)' : 'var(--text-muted)'} opacity={c ? 0.5 : 0.2} />
          </g>
        ))}
      </g>
      <circle cx="36" cy="390" r="14" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="1" />
      <circle cx="36" cy="390" r="4" fill="var(--emerald)" />

      {/* Breadcrumb */}
      <rect x="92" y="18" width="80" height="7" rx="3" fill="var(--text-muted)" opacity="0.4" />
      <text x="92" y="44" fill="var(--text-primary)" fontSize="15" fontWeight="700" fontFamily="Inter, sans-serif">Frontend Sprint</text>
      <rect x="555" y="20" width="25" height="25" rx="7" fill="var(--emerald)" opacity="0.12" />
      <rect x="561" y="26" width="13" height="13" rx="3" fill="var(--emerald)" opacity="0.6" />

      {/* ── Columns ── */}
      {[
        [92, 58, 'To Do', '4', 160],
        [262, 58, 'In Progress', '3', 160],
        [432, 58, 'Done', '2', 160],
      ].map(([x, y, title, count, w], ci) => (
        <g key={ci}>
          <rect x={x} y={y} width={w} height={346} rx="12" fill="var(--bg-card-hover)" opacity="0.5" />
          <rect x={x + 14} y={y + 14} width="90" height="7" rx="3" fill="var(--text-primary)" opacity="0.7" />
          <rect x={x + 110} y={y + 14} width="18" height="7" rx="3" fill="var(--text-muted)" opacity="0.3" />
          <circle cx={x + w - 18} cy={y + 17} r="3" fill={ci === 0 ? 'var(--emerald)' : ci === 1 ? 'var(--warning)' : 'var(--success)'} />

          {/* Cards in column */}
          {ci === 0 && (
            <>
              {[
                ['Design API', 'High', '--danger', 140],
                ['Setup CI/CD', 'Medium', '--warning', 120],
                ['Write tests', 'Low', '--emerald', 100],
                ['Code review', 'Medium', '--warning', 130],
              ].map(([t, pri, col, h], ii) => (
                <g key={ii}>
                  <rect x={x + 10} y={y + 34 + ii * 78} width={w - 20} height={68} rx="8" fill="var(--bg-card)" filter="url(#shadow-s)" />
                  <text x={x + 22} y={y + 52 + ii * 78} fill="var(--text-primary)" fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif">{t}</text>
                  <rect x={x + 22} y={y + 62 + ii * 78} width="30" height="14" rx="4" fill={col} opacity="0.12" />
                  <text x={x + 28} y={y + 72 + ii * 78} fill={col} fontSize="8" fontFamily="Inter, sans-serif">{pri}</text>
                  <rect x={x + 22} y={y + 84 + ii * 78} width="40" height="3" rx="1.5" fill="var(--text-muted)" opacity="0.15" />
                  <circle cx={x + w - 30} cy={y + 82 + ii * 78} r="6" fill="var(--bg-card-hover)" />
                </g>
              ))}
            </>
          )}
          {ci === 1 && (
            <>
              {[
                ['Implement auth', 'High', '--danger', 140],
                ['Create dashboard', 'Medium', '--warning', 130],
                ['API integration', 'High', '--danger', 120],
              ].map(([t, pri, col, h], ii) => (
                <g key={ii}>
                  <rect x={x + 10} y={y + 34 + ii * 78} width={w - 20} height={68} rx="8" fill="var(--bg-card)" filter="url(#shadow-s)" />
                  <text x={x + 22} y={y + 52 + ii * 78} fill="var(--text-primary)" fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif">{t}</text>
                  <rect x={x + 22} y={y + 62 + ii * 78} width="30" height="14" rx="4" fill={col} opacity="0.12" />
                  <text x={x + 28} y={y + 72 + ii * 78} fill={col} fontSize="8" fontFamily="Inter, sans-serif">{pri}</text>
                  <rect x={x + 22} y={y + 84 + ii * 78} width="50" height="3" rx="1.5" fill="var(--text-muted)" opacity="0.15" />
                  <circle cx={x + w - 30} cy={y + 82 + ii * 78} r="6" fill="var(--bg-card-hover)" />
                </g>
              ))}
            </>
          )}
          {ci === 2 && (
            <>
              {[
                ['Database schema', 'Low', '--emerald', 100],
                ['UI wireframes', 'Low', '--emerald', 100],
              ].map(([t, pri, col, h], ii) => (
                <g key={ii}>
                  <rect x={x + 10} y={y + 34 + ii * 78} width={w - 20} height={68} rx="8" fill="var(--bg-card)" filter="url(#shadow-s)" />
                  <rect x={x + 22} y={y + 46 + ii * 78} width="10" height="10" rx="3" fill="var(--emerald)" opacity="0.3" />
                  <path d={`M${x + 24} ${y + 50 + ii * 78} L${x + 27} ${y + 53 + ii * 78} L${x + 30} ${y + 48 + ii * 78}`} stroke="var(--emerald)" strokeWidth="1.5" strokeLinecap="round" />
                  <text x={x + 38} y={y + 55 + ii * 78} fill="var(--text-muted)" fontSize="11" fontWeight="500" fontFamily="Inter, sans-serif">{t}</text>
                  <rect x={x + 22} y={y + 66 + ii * 78} width="30" height="14" rx="4" fill={col} opacity="0.12" />
                  <text x={x + 28} y={y + 76 + ii * 78} fill={col} fontSize="8" fontFamily="Inter, sans-serif">{pri}</text>
                </g>
              ))}
            </>
          )}
        </g>
      ))}
    </svg>
  );
}

/* Calendar + Tasks Mockup */
function MockCalendar() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dates = [
    { col: 0, row: 0, val: '29', cur: false },
    { col: 1, row: 0, val: '30', cur: false },
    { col: 2, row: 0, val: '1',  cur: true },
    { col: 3, row: 0, val: '2',  cur: true },
    { col: 4, row: 0, val: '3',  cur: true },
    { col: 5, row: 0, val: '4',  cur: true },
    { col: 6, row: 0, val: '5',  cur: true },
    { col: 0, row: 1, val: '6',  cur: true },
    { col: 1, row: 1, val: '7',  cur: true },
    { col: 2, row: 1, val: '8',  cur: true, dot: 'var(--emerald)' },
    { col: 3, row: 1, val: '9',  cur: true },
    { col: 4, row: 1, val: '10', cur: true },
    { col: 5, row: 1, val: '11', cur: true },
    { col: 6, row: 1, val: '12', cur: true },
    { col: 0, row: 2, val: '13', cur: true },
    { col: 1, row: 2, val: '14', cur: true },
    { col: 2, row: 2, val: '15', cur: true, today: true },
    { col: 3, row: 2, val: '16', cur: true },
    { col: 4, row: 2, val: '17', cur: true },
    { col: 5, row: 2, val: '18', cur: true },
    { col: 6, row: 2, val: '19', cur: true },
    { col: 0, row: 3, val: '20', cur: true },
    { col: 1, row: 3, val: '21', cur: true, dot: 'var(--warning)' },
    { col: 2, row: 3, val: '22', cur: true },
    { col: 3, row: 3, val: '23', cur: true },
    { col: 4, row: 3, val: '24', cur: true },
    { col: 5, row: 3, val: '25', cur: true },
    { col: 6, row: 3, val: '26', cur: true },
    { col: 0, row: 4, val: '27', cur: true },
    { col: 1, row: 4, val: '28', cur: true },
    { col: 2, row: 4, val: '29', cur: true },
    { col: 3, row: 4, val: '30', cur: true },
    { col: 4, row: 4, val: '31', cur: true },
    { col: 5, row: 4, val: '1',  cur: false },
    { col: 6, row: 4, val: '2',  cur: false },
  ];

  return (
    <svg viewBox="0 0 600 420" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="600" height="420" rx="16" fill="var(--bg-canvas)" />

      {/* Sidebar */}
      <rect x="0" y="0" width="72" height="420" fill="var(--bg-sidebar)" />
      <rect x="16" y="18" width="40" height="40" rx="10" fill="var(--emerald)" opacity="0.12" />
      <rect x="26" y="28" width="20" height="20" rx="6" fill="var(--emerald)" />
      <g transform="translate(16, 80)">
        {[
          [0, '', 0], [42, '', 0], [84, '', 0],
          [126, '--emerald', 0.12], [168, '', 0],
        ].map(([y, c, o], i) => (
          <g key={i}>
            <rect x="0" y={y} width="40" height="40" rx="10" fill={c ? `var(${c})` : 'transparent'} fillOpacity={c ? o : 0} />
            <rect x="12" y={y + 11} width="16" height="4" rx="2" fill={c ? 'var(--emerald)' : 'var(--text-muted)'} opacity={c ? 0.7 : 0.35} />
            <rect x="10" y={y + 19} width="20" height="3" rx="1.5" fill={c ? 'var(--emerald)' : 'var(--text-muted)'} opacity={c ? 0.5 : 0.2} />
          </g>
        ))}
      </g>
      <circle cx="36" cy="390" r="14" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="1" />
      <circle cx="36" cy="390" r="4" fill="var(--emerald)" />

      {/* Title */}
      <text x="92" y="32" fill="var(--text-primary)" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">July 2026</text>
      <rect x="230" y="18" width="18" height="18" rx="5" fill="var(--bg-card-hover)" />
      <path d="M237 28L240 24L243 28" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="252" y="18" width="18" height="18" rx="5" fill="var(--bg-card-hover)" />
      <path d="M257 24L261 28L265 24" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Calendar Grid */}
      <g transform="translate(92, 42)">
        {days.map((d, i) => (
          <text key={i} x={i * 68 + 12} y="10" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">{d}</text>
        ))}
        {dates.map((item, i) => {
          const cx = item.col * 68 + 12;
          const cy = item.row * 20 + 20;
          return (
            <g key={i}>
              {item.today && (
                <rect x={cx - 11} y={cy - 10} width="22" height="16" rx="4" fill="var(--emerald)" />
              )}
              <text
                x={cx}
                y={cy + 2}
                textAnchor="middle"
                fill={item.today ? 'white' : item.cur ? 'var(--text-primary)' : 'var(--text-muted)'}
                opacity={item.today ? 1 : item.cur ? 0.9 : 0.35}
                fontSize="10"
                fontWeight={item.today ? '700' : '500'}
                fontFamily="Inter, sans-serif"
              >
                {item.val}
              </text>
              {item.dot && (
                <circle cx={cx} cy={cy + 6} r="1.5" fill={item.dot} opacity="0.8" />
              )}
            </g>
          );
        })}
      </g>

      {/* Today's Tasks Heading & Divider */}
      <rect x="92" y="186" width="496" height="1" fill="var(--border)" opacity="0.5" />
      <text x="92" y="206" fill="var(--text-primary)" fontSize="12" fontWeight="700" fontFamily="Inter, sans-serif">Today's Tasks</text>

      {[
        [216, true, 'Review PR', '--emerald', ''],
        [252, false, 'Update documentation', '', ''],
        [288, false, 'Team meeting', '--warning', '14:00'],
        [324, false, 'Deploy release v2.1', '--danger', '16:30'],
      ].map(([y, done, title, col, time], i) => (
        <g key={i}>
          <rect x={92} y={y} width="496" height="30" rx="7" fill={i === 0 ? 'var(--bg-card-hover)' : 'transparent'} opacity={i === 0 ? 0.4 : 0} />
          <rect x={104} y={y + 7} width="16" height="16" rx="4" fill={done ? 'var(--emerald)' : 'var(--border)'} />
          {done && <path d="M108 14L111 17L116 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform={`translate(0, ${y + 4})`} />}
          <text x={128} y={y + 19} fill={done ? 'var(--text-muted)' : 'var(--text-primary)'} fontSize="11" fontWeight="500" fontFamily="Inter, sans-serif" textDecoration={done ? 'line-through' : 'none'}>{title}</text>
          {time && <text x="560" y={y + 19} fill="var(--text-muted)" fontSize="10" fontFamily="Inter, sans-serif">{time}</text>}
          {col === '--warning' && <rect x="540" y={y + 9} width="12" height="12" rx="3" fill={col} opacity="0.15" />}
          {col === '--danger' && <rect x="540" y={y + 9} width="12" height="12" rx="3" fill={col} opacity="0.15" />}
        </g>
      ))}
    </svg>
  );
}

/* Ready / Success Mockup */
function MockReady() {
  return (
    <svg viewBox="0 0 600 420" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="600" height="420" rx="16" fill="var(--bg-canvas)" />

      {/* Sidebar */}
      <rect x="0" y="0" width="72" height="420" fill="var(--bg-sidebar)" />
      <rect x="16" y="18" width="40" height="40" rx="10" fill="var(--emerald)" opacity="0.12" />
      <rect x="26" y="28" width="20" height="20" rx="6" fill="var(--emerald)" />
      <g transform="translate(16, 80)">
        {[
          [0, '--emerald', 0.12], [42, '', 0], [84, '', 0],
          [126, '', 0], [168, '', 0],
        ].map(([y, c, o], i) => (
          <g key={i}>
            <rect x="0" y={y} width="40" height="40" rx="10" fill={c ? `var(${c})` : 'transparent'} fillOpacity={c ? o : 0} />
            <rect x="12" y={y + 11} width="16" height="4" rx="2" fill={c ? 'var(--emerald)' : 'var(--text-muted)'} opacity={c ? 0.7 : 0.35} />
            <rect x="10" y={y + 19} width="20" height="3" rx="1.5" fill={c ? 'var(--emerald)' : 'var(--text-muted)'} opacity={c ? 0.5 : 0.2} />
          </g>
        ))}
      </g>
      <circle cx="36" cy="390" r="14" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="1" />
      <circle cx="36" cy="390" r="4" fill="var(--emerald)" />

      {/* Success checkmark */}
      <circle cx="300" cy="70" r="36" fill="var(--emerald)" opacity="0.08" />
      <circle cx="300" cy="70" r="24" fill="var(--emerald)" opacity="0.12" />
      <circle cx="300" cy="70" r="14" fill="var(--emerald)" />
      <path d="M293 70L298 75L307 65" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      <text x="300" y="134" textAnchor="middle" fill="var(--text-primary)" fontSize="16" fontWeight="700" fontFamily="Inter, sans-serif">All set!</text>
      <text x="300" y="154" textAnchor="middle" fill="var(--text-muted)" fontSize="12" fontFamily="Inter, sans-serif">Your workspace is ready</text>

      {/* Stats */}
      {[
        [92, 174, '#10B981', '3', 'Projects'],
        [248, 174, '#6366F1', '5', 'Boards'],
        [404, 174, '#F59E0B', '24', 'Tasks'],
      ].map(([x, y, col, val, label], i) => (
        <g key={i}>
          <rect x={x} y={y} width="140" height="84" rx="12" fill="var(--bg-card)" filter="url(#shadow-s)" />
          <text x={x + 16} y={y + 34} fill={col} fontSize="24" fontWeight="700" fontFamily="Inter, sans-serif">{val}</text>
          <text x={x + 16} y={y + 56} fill="var(--text-muted)" fontSize="12" fontWeight="500" fontFamily="Inter, sans-serif">{label}</text>
          <rect x={x + 16} y={y + 68} width="60" height="4" rx="2" fill={col} opacity="0.12" />
        </g>
      ))}

      {/* Quick actions */}
      <text x="92" y="292" fill="var(--text-primary)" fontSize="13" fontWeight="600" fontFamily="Inter, sans-serif">Quick actions</text>
      {[
        ['Create your first task', 'Start tracking work', '--emerald'],
        ['Invite team members', 'Collaborate in real-time', '--primary'],
      ].map(([title, desc, col], i) => (
        <g key={i}>
          <rect x={92 + i * 210} y={302} width={200} height={72} rx="12" fill="var(--bg-card)" filter="url(#shadow-s)" />
          <rect x={92 + i * 210} y={302} width="200" height="72" rx="12" fill={col} opacity="0.03" />
          <rect x={104 + i * 210} y={316} width="8" height="8" rx="2" fill={col} />
          <text x={120 + i * 210} y={316} fill="var(--text-primary)" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">{title}</text>
          <text x={120 + i * 210} y={334} fill="var(--text-muted)" fontSize="11" fontFamily="Inter, sans-serif">{desc}</text>
          <rect x={104 + i * 210} y={354} width="60" height="6" rx="3" fill={col} opacity="0.08" />
        </g>
      ))}
    </svg>
  );
}

const PREVIEWS = [MockDashboard, MockBoard, MockCalendar, MockReady];

// ─── Data ────────────────────────────────────────────────

const STEPS_DATA = [
  {
    title: <>Welcome to <span style={{ color: 'var(--emerald)' }}>Rekan</span></>,
    desc: 'Manage projects, tasks, deadlines, and notes in one beautiful workspace. Everything you need to stay organized.',
    checks: ['Visual project management', 'Smart task tracking', 'Seamless collaboration'],
    btn: 'Continue',
  },
  {
    title: 'Organize with Boards',
    desc: 'Visualize your workflow with Kanban boards. Drag and drop tasks across columns, track progress, and never lose track of what matters.',
    checks: ['Drag & drop interface', 'Custom workflow columns', 'Real-time progress view'],
    btn: 'Continue',
  },
  {
    title: 'Track Everything',
    desc: 'Set deadlines, add notes, manage subtasks, and filter by priority. Rekan helps you stay on top of every detail.',
    checks: ['Deadlines & reminders', 'Subtask management', 'Priority filtering'],
    btn: 'Continue',
  },
  {
    title: 'Ready to get started?',
    desc: 'You\'re all set. Sign in to access your workspace and start managing your tasks.',
    checks: ['Workspace configured', 'Preferences saved', 'Ready for login'],
    btn: 'Go to Login',
  },
];

// ─── Component ───────────────────────────────────────────

export default function OnboardingPage({ onComplete }) {
  const [step, setStep] = useState(0);
  const data = STEPS_DATA[step];
  const Preview = PREVIEWS[step];
  const isLast = step === TOTAL - 1;

  const goNext = () => { if (step < TOTAL - 1) setStep(s => s + 1); };
  const goBack = () => { if (step > 0) setStep(s => s - 1); };

  return (
    <div className="onb-page" style={{
      minHeight: '100vh',
      width: '100%',
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="onb-inner" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '40px',
        maxWidth: '1140px',
        width: '100%',
        padding: '40px 32px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* ─── Left Content ─── */}
        <div className="onb-left" style={{
          flex: '1 1 42%',
          maxWidth: '460px',
          minWidth: 0,
        }}>
          <div style={{ marginBottom: '16px' }}>
            <motion.span
              key={`label-${step}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--emerald)',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginBottom: '10px',
                display: 'inline-block',
              }}
            >
              Step {step + 1} of {TOTAL}
            </motion.span>
          </div>

          <div style={{ marginBottom: '48px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`progress-${step}`}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Progress current={step} />
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 style={{
                fontSize: '34px',
                fontWeight: 800,
                letterSpacing: '-0.8px',
                color: 'var(--text-primary)',
                margin: '0 0 12px',
                lineHeight: 1.15,
              }}>
                {data.title}
              </h1>

              <p style={{
                fontSize: '15px',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                margin: '0 0 36px',
                maxWidth: '400px',
              }}>
                {data.desc}
              </p>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                marginBottom: '44px',
              }}>
                {data.checks.map((check, i) => (
                  <CheckItem key={i} delay={0.15 + i * 0.1}>
                    {check}
                  </CheckItem>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <motion.button
                  onClick={isLast ? onComplete : goNext}
                  whileHover={{ scale: 1.02, boxShadow: '0 6px 20px rgba(16,185,129,0.25)' }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '14px 32px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'var(--emerald)',
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'box-shadow 0.2s',
                  }}
                >
                  {data.btn}
                </motion.button>

                {step > 0 && (
                  <motion.button
                    onClick={goBack}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    whileHover={{ color: 'var(--text-primary)' }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      fontSize: '14px',
                      fontWeight: 500,
                      fontFamily: 'inherit',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      transition: 'color 0.15s',
                    }}
                  >
                    Back
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── Right Panel ─── */}
        <div className="onb-right" style={{
          flex: '1 1 54%',
          maxWidth: '580px',
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '10px 0',
        }}>
          {/* Decorative blobs behind card */}
          <div className="onb-blob" style={{
            width: '280px',
            height: '280px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
            top: '10%',
            right: '5%',
          }} />
          <div className="onb-blob" style={{
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
            bottom: '10%',
            left: '0%',
          }} />

          {/* Premium card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className="onb-right-card"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '24px',
                border: '1px solid var(--border)',
                boxShadow: '0 25px 60px -12px rgba(0,0,0,0.12), 0 0 0 1px var(--border)',
                overflow: 'hidden',
                width: '100%',
                maxWidth: '540px',
                position: 'relative',
                zIndex: 2,
                aspectRatio: '600 / 420',
              }}
            >
              <Preview />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
