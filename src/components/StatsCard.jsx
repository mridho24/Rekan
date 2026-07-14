import React from 'react';
import { motion } from 'framer-motion';

export default function StatsCard({ label, value, percentage, icon: Icon, color = 'emerald', trend }) {
  const colorMap = {
    emerald: { text: 'var(--emerald)', bg: 'var(--emerald-bg)', bar: 'var(--emerald)' },
    warning: { text: 'var(--warning)', bg: 'var(--warning-bg)', bar: 'var(--warning)' },
    danger:  { text: 'var(--danger)',  bg: 'var(--danger-bg)',  bar: 'var(--danger)' },
    sky:     { text: '#2563EB', bg: 'var(--sky)', bar: '#3B82F6' },
  };

  const c = colorMap[color] || colorMap.emerald;

  const formattedValue = typeof value === 'number'
    ? value.toLocaleString('id-ID')
    : value;

  return (
    <div style={styles.card}>
      <div style={styles.topRow}>
        <span style={styles.label}>{label}</span>
        <div style={{ ...styles.iconWrap, backgroundColor: c.bg, color: c.text }}>
          {Icon && <Icon size={16} strokeWidth={2} />}
        </div>
      </div>

      <div style={styles.valueRow}>
        <span style={styles.value}>{formattedValue}</span>
        {trend !== undefined && (
          <span style={{
            ...styles.trend,
            color: trend >= 0 ? 'var(--emerald)' : 'var(--danger)',
          }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>

      {percentage !== undefined && (
        <div style={styles.progressSection}>
          <div className="progress-track">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              style={{ background: c.bar }}
            />
          </div>
          <span style={styles.pctLabel}>{percentage}%</span>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-lg)',
    padding: '20px',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'box-shadow var(--t-base)',
    cursor: 'default',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },
  iconWrap: {
    width: '32px',
    height: '32px',
    borderRadius: 'var(--r-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  value: {
    fontSize: 'var(--text-2xl)',
    fontWeight: 800,
    color: 'var(--text-primary)',
    lineHeight: 1,
    letterSpacing: '-1px',
  },
  trend: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
  },
  progressSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  pctLabel: {
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--text-muted)',
    minWidth: '30px',
    textAlign: 'right',
  },
};
