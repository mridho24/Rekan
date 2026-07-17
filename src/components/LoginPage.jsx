import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Sun, Moon } from 'lucide-react';

function RekanLogo({ size = 28 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="9" height="9" rx="2.5"
          fill="var(--emerald)" fillOpacity="0.2" stroke="var(--emerald)" strokeWidth="1.5" />
        <rect x="13" y="2" width="9" height="9" rx="2.5"
          fill="var(--emerald)" fillOpacity="0.6" />
        <rect x="2" y="13" width="9" height="9" rx="2.5"
          fill="var(--emerald)" fillOpacity="1" />
        <rect x="13" y="13" width="9" height="9" rx="2.5"
          fill="var(--emerald)" fillOpacity="0.2" stroke="var(--emerald)" strokeWidth="1.5" />
      </svg>
      <span style={{
        fontSize: '20px',
        fontWeight: 800,
        letterSpacing: '-0.5px',
        color: 'var(--text-primary)',
      }}>
        Rekan
      </span>
    </div>
  );
}

function MiniKanbanPreview() {
  const columns = [
    { title: 'To Do', color: '#F59E0B', cards: ['Desain UI', 'Setup API', 'Tulis docs'] },
    { title: 'In Progress', color: '#3B82F6', cards: ['Integrasi DB', 'Auth logic'] },
    { title: 'Done', color: '#10B981', cards: ['Wireframe', 'Research'] },
  ];
  return (
    <div style={{
      background: 'rgba(255,255,255,0.07)',
      backdropFilter: 'blur(24px)',
      borderRadius: '20px',
      border: '1px solid rgba(255,255,255,0.15)',
      padding: '24px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="9" height="9" rx="2" fill="white" fillOpacity="0.8" />
            <rect x="13" y="2" width="9" height="9" rx="2" fill="white" fillOpacity="0.4" stroke="white" strokeWidth="1" />
            <rect x="2" y="13" width="9" height="9" rx="2" fill="white" fillOpacity="0.4" stroke="white" strokeWidth="1" />
            <rect x="13" y="13" width="9" height="9" rx="2" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1" />
          </svg>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '13px' }}>Frontend Sprint</span>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px' }}>v1.0</span>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        {columns.map(col => (
          <div key={col.title} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px', minHeight: '80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: col.color }} />
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{col.title}</span>
            </div>
            {col.cards.map((card, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '6px',
                padding: '6px 8px',
                marginBottom: '5px',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {card}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoginPage({ onLogin, theme, onToggleTheme, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Email wajib diisi.'); return; }
    if (!password.trim()) { setError('Password wajib diisi.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ name: 'Pengguna', email: email.trim() });
    }, 800);
  };

  return (
    <div style={styles.wrapper}>
      {/* ─── Form Panel ─── */}
      <div style={styles.formPanel}>
        <div style={styles.formInner}>
          <button
            onClick={onToggleTheme}
            style={styles.themeBtn}
            title={theme === 'dark' ? 'Mode Terang' : 'Mode Malam'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <div style={{ marginBottom: '32px' }}>
            <RekanLogo size={28} />
          </div>

          <h1 style={styles.heading}>Masuk</h1>
          <p style={styles.subtitle}>Selamat datang kembali! Silakan masuk ke akun Anda.</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <div style={styles.inputWrapper}>
                <Mail size={16} style={styles.inputIcon} />
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={styles.input}
                  autoFocus
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={16} style={styles.inputIcon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={styles.spinner} />
                  Memproses...
                </span>
              ) : 'Masuk'}
            </button>
          </form>

          <button style={styles.linkBtn}>Lupa password?</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>atau</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
          </div>

          <button style={styles.googleBtn} type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Lanjutkan dengan Google
          </button>

          <p style={styles.footerText}>
            Belum punya akun?{' '}
            <button type="button" onClick={onSwitchToRegister} style={styles.linkBtnInline}>Daftar</button>
          </p>
        </div>
      </div>

      {/* ─── Visual Panel ─── */}
      <div style={styles.visualPanel}>
        <div style={styles.patternOverlay} />
        <motion.div
          animate={{ y: [0, -16, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          style={{ ...styles.shape, ...styles.shape1 }}
        />
        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, -2, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{ ...styles.shape, ...styles.shape2 }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ ...styles.shape, ...styles.shape3 }}
        />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ ...styles.shape, ...styles.shape4 }}
        />

        <div style={styles.visualContent}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={styles.visualTitle}>Kelola Tugas.<br />Raih Hasil.</h2>
              <p style={styles.visualDesc}>
                Rekan membantu Anda tetap terorganisir, produktif, dan selaras — dari awal hingga akhir.
              </p>
            </div>

            <MiniKanbanPreview />
          </motion.div>
        </div>

        <div style={styles.visualFooter}>
          <span style={styles.footerBadge}>#RekanAja</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    width: '100%',
    minHeight: '100vh',
  },

  // ─── Form Panel ───
  formPanel: {
    flex: '0 0 45%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-card)',
    padding: '40px',
    position: 'relative',
  },
  formInner: {
    width: '100%',
    maxWidth: '400px',
    position: 'relative',
  },
  themeBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    background: 'var(--bg-card-hover)',
    border: '1px solid var(--border)',
    color: 'var(--text-secondary)',
    width: '36px',
    height: '36px',
    borderRadius: 'var(--r-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'var(--t-fast)',
  },
  heading: {
    fontSize: 'var(--text-2xl)',
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: '-0.8px',
    lineHeight: 1.1,
    marginBottom: '6px',
  },
  subtitle: {
    fontSize: 'var(--text-base)',
    color: 'var(--text-muted)',
    marginBottom: '28px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
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
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0 14px',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-input)',
    transition: 'var(--t-fast)',
  },
  inputIcon: {
    color: 'var(--text-muted)',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    padding: '11px 0',
    border: 'none',
    background: 'none',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
  },
  eyeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  submitBtn: {
    width: '100%',
    padding: '12px 24px',
    borderRadius: 'var(--r-md)',
    border: 'none',
    backgroundColor: 'var(--btn-primary-bg)',
    color: 'var(--btn-primary-text)',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'var(--t-fast)',
    marginTop: '4px',
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid var(--btn-primary-text)',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
  },
  linkBtn: {
    display: 'block',
    margin: '16px auto 0',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: 'var(--text-sm)',
    cursor: 'pointer',
    transition: 'var(--t-fast)',
  },
  googleBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '11px 24px',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'var(--t-fast)',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    marginTop: '20px',
  },
  linkBtnInline: {
    background: 'none',
    border: 'none',
    color: 'var(--emerald)',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: 'inherit',
  },

  // ─── Visual Panel ───
  visualPanel: {
    flex: '1',
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #047857 0%, #059669 25%, #10B981 55%, #34D399 85%, #6EE7B7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
    backgroundSize: '28px 28px',
  },
  shape: {
    position: 'absolute',
    borderRadius: '50%',
  },
  shape1: {
    width: '450px',
    height: '450px',
    background: 'radial-gradient(circle, rgba(167,243,208,0.2) 0%, transparent 70%)',
    top: '-15%',
    right: '-10%',
  },
  shape2: {
    width: '350px',
    height: '350px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
    bottom: '-10%',
    left: '-8%',
  },
  shape3: {
    width: '180px',
    height: '180px',
    background: 'radial-gradient(circle, rgba(167,243,208,0.3) 0%, transparent 70%)',
    bottom: '30%',
    right: '8%',
    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
  },
  shape4: {
    width: '120px',
    height: '120px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    top: '25%',
    left: '10%',
    borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
  },
  visualContent: {
    position: 'relative',
    zIndex: 1,
    padding: '40px',
    width: '100%',
    maxWidth: '500px',
  },
  visualTitle: {
    fontSize: '34px',
    fontWeight: 800,
    letterSpacing: '-1px',
    lineHeight: 1.15,
    color: '#ffffff',
    marginBottom: '10px',
  },
  visualDesc: {
    fontSize: '14px',
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.8)',
  },
  visualFooter: {
    position: 'absolute',
    bottom: '28px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1,
  },
  footerBadge: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
  },
};
