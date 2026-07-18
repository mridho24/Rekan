import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

const PX = 5;
const N = 12;
const VB = N * PX;

const RAW = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,3,0,0,3,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,4,0,4,1,1,1,0,0],
  [0,0,1,1,1,5,1,1,1,1,0,0],
  [0,0,0,1,2,2,1,1,1,0,0,0],
  [0,0,0,1,2,2,1,1,0,0,0,0],
  [0,0,0,0,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
];

const C = {
  t: 'transparent',
  1: '#8B9DC3',
  2: 'var(--border-strong)',
  3: '#F9A8D4',
  4: '#1F2937',
  5: '#F9A8D4',
};

function SmokePuff({ id, x, y, onEnd }) {
  const drift = (Math.random() - 0.5) * 20;
  const size = 3 + Math.random() * 4;

  return (
    <motion.circle
      key={id}
      fill="var(--border-strong)"
      initial={{
        opacity: 0.6,
        r: size * 0.5,
        cx: x,
        cy: y
      }}
      animate={{
        opacity: 0,
        r: size * 2,
        cx: x + drift,
        cy: y - 15 - Math.random() * 10,
      }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      onAnimationComplete={onEnd}
    />
  );
}

export default function SidebarCharacter({ collapsed = false, theme = 'light' }) {
  const [puffs, setPuffs] = useState([]);
  const puffId = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      puffId.current += 1;
      const id = puffId.current;
      setPuffs(prev => [...prev, {
        id,
        x: 55 + Math.random() * 4,
        y: 24 + Math.random() * 2,
      }]);
    }, 600 + Math.random() * 400);

    return () => clearInterval(interval);
  }, []);

  const removePuff = useCallback((id) => {
    setPuffs(prev => prev.filter(p => p.id !== id));
  }, []);

  const cells = useMemo(() => {
    const out = [];
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const v = RAW[y][x];
        if (v === 0) continue;
        out.push(
          <rect
            key={`${x}-${y}`}
            x={x * PX}
            y={y * PX}
            width={PX}
            height={PX}
            fill={C[v] || C.t}
            shapeRendering="crispEdges"
          />
        );
      }
    }
    return out;
  }, []);

  if (collapsed) {
    return (
      <div style={{ padding: '6px 4px', display: 'flex', justifyContent: 'center' }}>
        <motion.svg
          width="22" height="22"
          viewBox={`0 0 ${VB} ${VB}`}
          animate={{ y: [0, -1, 0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        >
          {RAW.map((row, y) => row.map((v, x) =>
            v === 0 ? null : (
              <rect key={`${x}-${y}`} x={x * PX} y={y * PX} width={PX} height={PX} fill={C[v] || C.t} shapeRendering="crispEdges" />
            )
          ))}
        </motion.svg>
      </div>
    );
  }

  return (
    <div style={{
      padding: '4px 16px 12px',
      display: 'flex',
      alignItems: 'center',
      overflow: 'visible',
      position: 'relative',
    }}>
      <motion.div
        animate={{ y: [0, -1, 0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        style={{ position: 'relative' }}
      >
        <svg
          width="36"
          height="36"
          viewBox={`0 0 ${VB + 20} ${VB}`}
          style={{ display: 'block', overflow: 'visible' }}
        >
          {/* Tail */}
          <motion.path
            d="M 25 45 Q 32 52 40 46 Q 48 38 46 28"
            fill="none"
            stroke="#8B9DC3"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{ pathLength: [1, 0.85, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          />

          {/* Mouse body */}
          <g>{cells}</g>

          {/* Whiskers */}
          <line x1="32" y1="28" x2="42" y2="26" stroke="var(--border-strong)" strokeWidth="0.8" opacity="0.6" />
          <line x1="32" y1="28" x2="42" y2="30" stroke="var(--border-strong)" strokeWidth="0.8" opacity="0.6" />
          <line x1="31" y1="30" x2="42" y2="32" stroke="var(--border-strong)" strokeWidth="0.8" opacity="0.6" />
          <line x1="32" y1="28" x2="15" y2="26" stroke="var(--border-strong)" strokeWidth="0.8" opacity="0.6" />
          <line x1="32" y1="28" x2="15" y2="30" stroke="var(--border-strong)" strokeWidth="0.8" opacity="0.6" />
          <line x1="31" y1="30" x2="15" y2="32" stroke="var(--border-strong)" strokeWidth="0.8" opacity="0.6" />

          {/* Cigarette */}
          <motion.g
            animate={{ rotate: [-2, 1, -2] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            style={{ transformOrigin: '42px 29px' }}
          >
            <line x1="42" y1="29" x2="58" y2="28" stroke="var(--bg-card)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="58" y1="28" x2="64" y2="27" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
            <motion.circle
              cx="64" cy="27" fill="#F97316"
              initial={{ r: 1.5 }}
              animate={{ r: [1.5, 2.5, 1.5] }}
              transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }}
            />
            <motion.circle
              cx="64" cy="27" r="0.8" fill="#FEF08A"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }}
            />
          </motion.g>

          {/* Smoke puffs */}
          {puffs.map(p => (
            <SmokePuff key={p.id} id={p.id} x={p.x} y={p.y} onEnd={() => removePuff(p.id)} />
          ))}
        </svg>
      </motion.div>
    </div>
  );
}
