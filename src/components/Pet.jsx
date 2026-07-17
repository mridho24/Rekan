import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PX = 5;
const N = 12;
const VB = N * PX;

const RAW = [
  [0,0,0,0,0,1,1,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,2,2,1,1,1,0,0],
  [0,0,1,1,2,3,3,2,1,1,0,0],
  [0,0,1,1,2,3,3,2,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,1,1,4,4,1,1,0,0,0],
  [0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,1,1,1,1,0,0,0,0],
  [0,0,0,1,5,0,0,5,1,0,0,0],
  [0,0,1,5,5,0,0,5,5,1,0,0],
];

const BODY = '#10B981';
const FOOT = '#059669';
const CHEEK = '#D1FAE5';
const WHITE = '#FFFFFF';
const PUPIL = (dark) => dark ? '#111827' : '#1F2937';

export default function Pet({ theme = 'light', completionTrigger = 0 }) {
  const [visible, setVisible] = useState(true);
  const [state, setState] = useState('idle');
  const [blink, setBlink] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(0);

  useEffect(() => {
    let timer;
    const sched = () => {
      timer = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 120);
        sched();
      }, 2500 + Math.random() * 3500);
    };
    sched();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (completionTrigger > 0) {
      setState('happy');
      const t = setTimeout(() => setState('idle'), 1800);
      return () => clearTimeout(t);
    }
  }, [completionTrigger]);

  const handleClick = useCallback(() => {
    setClicked(c => Math.min(c + 1, 99));
    setState('happy');
    setTimeout(() => setState('idle'), 1200);
  }, []);

  const cells = useMemo(() => {
    const data = blink ? RAW.map(r => r.map(v => (v === 2 || v === 3) ? 1 : v)) : RAW;
    const out = [];
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const v = data[y][x];
        if (v === 0) continue;
        let fill;
        if (v === 1) fill = BODY;
        else if (v === 2) fill = WHITE;
        else if (v === 3) fill = PUPIL(theme === 'dark');
        else if (v === 4) fill = CHEEK;
        else fill = FOOT;
        out.push(<rect key={`${x}-${y}`} x={x * PX} y={y * PX} width={PX} height={PX} fill={fill} shapeRendering="crispEdges" />);
      }
    }
    return out;
  }, [blink, theme]);

  // minimized state
  if (!visible) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 0.55, scale: 1 }}
        whileHover={{ opacity: 1, scale: 1.15 }}
        whileTap={{ scale: 0.85 }}
        onClick={() => setVisible(true)}
        style={{
          position: 'fixed', bottom: '16px', right: '16px', zIndex: 999,
          width: '28px', height: '28px', borderRadius: '50%',
          border: '1.5px solid var(--border)', background: 'var(--bg-card)',
          cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <svg width="14" height="14" viewBox={`0 0 ${VB} ${VB}`} style={{ display: 'block' }}>
          {RAW.map((row, y) => row.map((v, x) =>
            v === 0 ? null : <rect key={`${x}-${y}`} x={x * PX} y={y * PX} width={PX} height={PX} fill={BODY} shapeRendering="crispEdges" />
          ))}
        </svg>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.5 }}
      animate={{
        opacity: hovered || state === 'happy' ? 1 : 0.5,
        y: 0,
        scale: 1,
      }}
      exit={{ opacity: 0, y: 10, scale: 0.3 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed', bottom: '16px', right: '16px', zIndex: 999,
        cursor: 'pointer', lineHeight: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <AnimatePresence>
        {hovered && clicked < 3 && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.8 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute', bottom: '100%', left: '50%',
              transform: 'translateX(-50%)', marginBottom: '8px',
              backgroundColor: 'rgba(0,0,0,0.75)', color: '#fff',
              padding: '3px 10px', borderRadius: '6px',
              fontSize: '11px', fontWeight: 600,
              whiteSpace: 'nowrap', pointerEvents: 'none',
              backdropFilter: 'blur(4px)',
            }}
          >
            Klik aku! ✦
          </motion.div>
        )}
      </AnimatePresence>

      <motion.svg
        width="56" height="56"
        viewBox={`0 0 ${VB} ${VB}`}
        style={{ display: 'block', filter: theme === 'dark' ? 'drop-shadow(0 0 8px rgba(16,185,129,0.2))' : 'none' }}
        animate={
          state === 'happy'
            ? { y: [0, -12, 0, -7, 0, -3, 0], rotate: [0, -4, 4, -2, 2, -1, 0], scale: [1, 1.07, 1, 1.04, 1, 1.01, 1] }
            : { y: [0, -1, 0, 1, 0] }
        }
        transition={
          state === 'happy'
            ? { duration: 0.55, ease: 'easeInOut' }
            : { repeat: Infinity, duration: 3, ease: 'easeInOut' }
        }
      >
        {cells}
      </motion.svg>

      {hovered && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={e => { e.stopPropagation(); setVisible(false); }}
          style={{
            position: 'absolute', top: '-5px', right: '-5px',
            width: '16px', height: '16px', borderRadius: '50%',
            border: 'none', background: 'rgba(0,0,0,0.4)',
            color: '#fff', fontSize: '8px', cursor: 'pointer',
            padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(2px)',
          }}
        >
          ✕
        </motion.button>
      )}
    </motion.div>
  );
}
