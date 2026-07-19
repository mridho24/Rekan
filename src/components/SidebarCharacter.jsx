import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

const PX = 6;
const N = 16;
const VB = N * PX;

const RAW = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,2,2,1,1,0,0,0,0,0],
  [0,0,0,0,0,1,5,2,2,5,1,0,0,0,0,0],
  [0,0,0,0,0,1,2,2,2,2,1,0,0,0,0,0],
  [0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0],
  [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0],
  [0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0],
  [0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0],
  [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,0,0,0,4,4,4,4,0,0,0,0,0,0],
  [0,0,0,0,0,0,4,0,0,4,0,0,0,0,0,0],
  [0,0,0,0,0,0,4,0,0,4,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

const C = {
  t: 'transparent',
  1: '#2D1B0E',
  2: '#F5D6B8',
  3: '#4F7EB3',
  4: '#374151',
  5: '#1F2937',
};

function SmokePuff({ id, x, y, onEnd }) {
  const drift = (Math.random() - 0.5) * 20;
  const size = 3 + Math.random() * 5;

  return (
    <motion.circle
      key={id}
      fill="rgba(180,180,190,0.5)"
      initial={{
        opacity: 0.5,
        r: size * 0.5,
        cx: x,
        cy: y
      }}
      animate={{
        opacity: 0,
        r: size * 2,
        cx: x + drift,
        cy: y - 20 - Math.random() * 12,
      }}
      transition={{ duration: 1.4, ease: 'easeOut' }}
      onAnimationComplete={onEnd}
    />
  );
}

export default function SidebarCharacter({ collapsed = false, theme = 'light' }) {
  const [puffs, setPuffs] = useState([]);
  const [excited, setExcited] = useState(false);
  const puffId = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      puffId.current += 1;
      const id = puffId.current;
      setPuffs(prev => [...prev, {
        id,
        x: 76 + Math.random() * 4,
        y: 20 + Math.random() * 2,
      }]);
    }, 700 + Math.random() * 500);

    return () => clearInterval(interval);
  }, []);

  const removePuff = useCallback((id) => {
    setPuffs(prev => prev.filter(p => p.id !== id));
  }, []);

  const handleInteract = useCallback(() => {
    setExcited(true);
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        puffId.current += 1;
        setPuffs(prev => [...prev, {
          id: puffId.current,
          x: 70 + Math.random() * 16,
          y: 16 + Math.random() * 10,
        }]);
      }, i * 70);
    }
    setTimeout(() => setExcited(false), 600);
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
      <div style={{ padding: '6px 4px', display: 'flex', justifyContent: 'center', cursor: 'pointer' }} onClick={handleInteract}>
        <motion.svg
          width="24" height="24"
          viewBox={`0 0 ${VB} ${VB}`}
          animate={{ y: excited ? [0, -4, -7, -4, 0, -1, 0] : [0, -1, 0, 1, 0] }}
          transition={{ repeat: excited ? 0 : Infinity, duration: excited ? 0.5 : 2.5, ease: 'easeInOut' }}
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
      padding: '8px 16px 12px',
      display: 'flex',
      alignItems: 'center',
      overflow: 'visible',
      position: 'relative',
      cursor: 'pointer',
    }} onClick={handleInteract}>
      <motion.div
        animate={{ y: excited ? [0, -6, -12, -6, 0, -3, 0] : [0, -1, 0, 1, 0] }}
        transition={{ repeat: excited ? 0 : Infinity, duration: excited ? 0.6 : 2.5, ease: 'easeInOut' }}
        style={{ position: 'relative' }}
      >
        <svg
          width="52"
          height="52"
          viewBox={`0 0 ${VB + 24} ${VB}`}
          style={{ display: 'block', overflow: 'visible' }}
        >
          {/* Cigarette */}
          <motion.g
            animate={{ rotate: [-2, 1, -2] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            style={{ transformOrigin: '86px 14px' }}
          >
            <line x1="76" y1="16" x2="90" y2="14" stroke="var(--bg-card)" strokeWidth="3" strokeLinecap="round" />
            <line x1="90" y1="14" x2="98" y2="13" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
            <motion.circle
              cx="98" cy="13" fill="#F97316"
              initial={{ r: 2 }}
              animate={{ r: [2, 3, 2] }}
              transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }}
            />
            <motion.circle
              cx="98" cy="13" r="1" fill="#FEF08A"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }}
            />
          </motion.g>

          {/* Body */}
          <g>{cells}</g>

          {/* Smoke puffs */}
          {puffs.map(p => (
            <SmokePuff key={p.id} id={p.id} x={p.x} y={p.y} onEnd={() => removePuff(p.id)} />
          ))}
        </svg>
      </motion.div>
    </div>
  );
}
