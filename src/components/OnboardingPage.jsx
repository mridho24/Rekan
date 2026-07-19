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
    }
    .onb-page::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 60% 45% at 75% 55%, rgba(16,185,129,0.07) 0%, transparent 70%),
        radial-gradient(ellipse 40% 35% at 25% 40%, rgba(16,185,129,0.04) 0%, transparent 60%);
      pointer-events: none;
    }
    @media (max-width: 768px) {
      .onb-inner { flex-direction: column !important; gap: 32px !important; }
      .onb-left { max-width: 100% !important; padding: 36px 24px 16px !important; }
      .onb-right { display: none !important; }
    }
  `;
  document.head.appendChild(s);
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

// ─── SVG illustrations ───────────────────────────

function PreviewWelcome() {
  return (
    <svg viewBox="0 0 460 380" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect x="0" y="0" width="460" height="380" rx="20" fill="var(--bg-card)" />
      <rect x="0" y="0" width="76" height="380" rx="20" fill="var(--bg-sidebar)" />
      <rect x="14" y="14" width="48" height="10" rx="4" fill="var(--emerald)" opacity="0.25" />
      <rect x="14" y="36" width="48" height="10" rx="4" fill="var(--border)" />
      <rect x="14" y="58" width="48" height="10" rx="4" fill="var(--border)" />
      <circle cx="38" cy="340" r="14" fill="var(--emerald)" opacity="0.15" />
      <circle cx="38" cy="340" r="6" fill="var(--emerald)" opacity="0.4" />

      <rect x="96" y="14" width="350" height="12" rx="4" fill="var(--border)" />
      <rect x="96" y="40" width="100" height="96" rx="12" fill="var(--bg-card-hover)" />
      <rect x="106" y="52" width="80" height="6" rx="3" fill="var(--border)" />
      <rect x="106" y="64" width="50" height="6" rx="3" fill="var(--text-muted)" />
      <rect x="106" y="88" width="80" height="4" rx="2" fill="var(--emerald)" opacity="0.25" />
      <rect x="106" y="100" width="60" height="4" rx="2" fill="var(--emerald)" opacity="0.15" />
      <rect x="106" y="112" width="70" height="4" rx="2" fill="var(--emerald)" opacity="0.25" />

      <rect x="206" y="40" width="100" height="96" rx="12" fill="var(--bg-card-hover)" />
      <rect x="216" y="52" width="80" height="6" rx="3" fill="var(--border)" />
      <rect x="216" y="64" width="50" height="6" rx="3" fill="var(--text-muted)" />
      <rect x="216" y="88" width="80" height="4" rx="2" fill="var(--emerald)" opacity="0.25" />
      <rect x="216" y="100" width="60" height="4" rx="2" fill="var(--emerald)" opacity="0.15" />
      <rect x="216" y="112" width="70" height="4" rx="2" fill="var(--emerald)" opacity="0.25" />

      <rect x="316" y="40" width="100" height="96" rx="12" fill="var(--bg-card-hover)" />
      <rect x="326" y="52" width="80" height="6" rx="3" fill="var(--emerald)" opacity="0.3" />
      <rect x="326" y="64" width="50" height="6" rx="3" fill="var(--text-muted)" />
      <rect x="326" y="88" width="80" height="4" rx="2" fill="var(--emerald)" opacity="0.25" />
      <rect x="326" y="100" width="60" height="4" rx="2" fill="var(--emerald)" opacity="0.15" />
      <rect x="326" y="112" width="70" height="4" rx="2" fill="var(--emerald)" opacity="0.25" />

      <rect x="96" y="150" width="350" height="96" rx="12" fill="var(--bg-card-hover)" />
      <rect x="112" y="166" width="180" height="7" rx="3" fill="var(--border)" />
      <rect x="112" y="182" width="140" height="6" rx="3" fill="var(--text-muted)" />
      <rect x="112" y="198" width="100" height="6" rx="3" fill="var(--text-muted)" />
      <rect x="112" y="222" width="90" height="6" rx="3" fill="var(--emerald)" opacity="0.25" />
      <rect x="220" y="222" width="90" height="6" rx="3" fill="var(--border)" />

      <rect x="96" y="260" width="350" height="96" rx="12" fill="var(--bg-card-hover)" />
      <rect x="112" y="276" width="200" height="7" rx="3" fill="var(--border)" />
      <rect x="112" y="292" width="160" height="6" rx="3" fill="var(--text-muted)" />
      <rect x="112" y="308" width="120" height="6" rx="3" fill="var(--text-muted)" />
      <rect x="112" y="332" width="160" height="6" rx="3" fill="var(--emerald)" opacity="0.15" />
    </svg>
  );
}

function PreviewBoards() {
  return (
    <svg viewBox="0 0 460 380" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect x="0" y="0" width="460" height="380" rx="20" fill="var(--bg-card)" />
      <rect x="20" y="20" width="120" height="10" rx="4" fill="var(--border)" />

      <rect x="20" y="48" width="130" height="300" rx="14" fill="var(--bg-card-hover)" />
      <rect x="36" y="64" width="98" height="28" rx="8" fill="var(--emerald)" opacity="0.12" />
      <rect x="48" y="70" width="60" height="6" rx="3" fill="var(--emerald)" opacity="0.6" />
      <rect x="36" y="104" width="98" height="80" rx="8" fill="var(--bg-card)" />
      <rect x="48" y="116" width="60" height="6" rx="3" fill="var(--text-muted)" />
      <rect x="48" y="128" width="74" height="6" rx="3" fill="var(--border)" />
      <rect x="48" y="148" width="50" height="4" rx="2" fill="var(--emerald)" opacity="0.25" />
      <rect x="48" y="158" width="70" height="4" rx="2" fill="var(--warning)" opacity="0.25" />
      <rect x="36" y="194" width="98" height="80" rx="8" fill="var(--bg-card)" />
      <rect x="48" y="206" width="50" height="6" rx="3" fill="var(--text-muted)" />
      <rect x="48" y="218" width="74" height="6" rx="3" fill="var(--border)" />
      <rect x="48" y="238" width="70" height="4" rx="2" fill="var(--emerald)" opacity="0.25" />
      <rect x="48" y="248" width="50" height="4" rx="2" fill="var(--emerald)" opacity="0.15" />
      <rect x="36" y="284" width="98" height="40" rx="8" fill="var(--bg-card)" />
      <rect x="48" y="296" width="74" height="6" rx="3" fill="var(--text-muted)" />
      <rect x="48" y="308" width="40" height="4" rx="2" fill="var(--emerald)" opacity="0.15" />

      <rect x="165" y="48" width="130" height="300" rx="14" fill="var(--bg-card-hover)" />
      <rect x="181" y="64" width="98" height="28" rx="8" fill="var(--warning)" opacity="0.12" />
      <rect x="193" y="70" width="60" height="6" rx="3" fill="var(--warning)" opacity="0.6" />
      <rect x="181" y="104" width="98" height="80" rx="8" fill="var(--bg-card)" />
      <rect x="193" y="116" width="60" height="6" rx="3" fill="var(--text-muted)" />
      <rect x="193" y="128" width="74" height="6" rx="3" fill="var(--border)" />
      <rect x="193" y="148" width="70" height="4" rx="2" fill="var(--warning)" opacity="0.25" />
      <rect x="181" y="194" width="98" height="80" rx="8" fill="var(--bg-card)" />
      <rect x="193" y="206" width="50" height="6" rx="3" fill="var(--text-muted)" />
      <rect x="193" y="218" width="74" height="6" rx="3" fill="var(--border)" />
      <rect x="193" y="238" width="70" height="4" rx="2" fill="var(--warning)" opacity="0.25" />

      <rect x="310" y="48" width="130" height="300" rx="14" fill="var(--bg-card-hover)" />
      <rect x="326" y="64" width="98" height="28" rx="8" fill="var(--emerald)" opacity="0.12" />
      <rect x="338" y="70" width="60" height="6" rx="3" fill="var(--emerald)" opacity="0.6" />
      <rect x="326" y="104" width="98" height="80" rx="8" fill="var(--bg-card)" />
      <rect x="338" y="116" width="60" height="6" rx="3" fill="var(--text-muted)" />
      <rect x="338" y="128" width="74" height="6" rx="3" fill="var(--border)" />
      <rect x="338" y="148" width="70" height="4" rx="2" fill="var(--emerald)" opacity="0.25" />
      <rect x="326" y="194" width="98" height="80" rx="8" fill="var(--bg-card)" />
      <rect x="338" y="206" width="50" height="6" rx="3" fill="var(--text-muted)" />
      <rect x="338" y="218" width="74" height="6" rx="3" fill="var(--border)" />
      <rect x="338" y="238" width="70" height="4" rx="2" fill="var(--emerald)" opacity="0.25" />
    </svg>
  );
}

function PreviewTasks() {
  return (
    <svg viewBox="0 0 460 380" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect x="0" y="0" width="460" height="380" rx="20" fill="var(--bg-card)" />
      <rect x="20" y="20" width="100" height="10" rx="4" fill="var(--border)" />

      <rect x="20" y="48" width="420" height="56" rx="12" fill="var(--bg-card-hover)" />
      <rect x="40" y="64" width="18" height="18" rx="5" fill="var(--emerald)" />
      <rect x="68" y="66" width="140" height="6" rx="3" fill="var(--border)" />
      <rect x="68" y="78" width="100" height="6" rx="3" fill="var(--text-muted)" />
      <rect x="380" y="66" width="40" height="14" rx="4" fill="var(--warning)" opacity="0.15" />

      <rect x="20" y="116" width="420" height="56" rx="12" fill="var(--bg-card-hover)" />
      <rect x="40" y="132" width="18" height="18" rx="5" fill="var(--emerald)" />
      <rect x="68" y="134" width="160" height="6" rx="3" fill="var(--border)" />
      <rect x="68" y="146" width="120" height="6" rx="3" fill="var(--text-muted)" />
      <rect x="380" y="134" width="40" height="14" rx="4" fill="var(--danger)" opacity="0.15" />

      <rect x="20" y="184" width="420" height="56" rx="12" fill="var(--bg-card-hover)" />
      <rect x="40" y="200" width="18" height="18" rx="5" fill="var(--border)" />
      <rect x="68" y="202" width="120" height="6" rx="3" fill="var(--border)" />
      <rect x="68" y="214" width="80" height="6" rx="3" fill="var(--text-muted)" />
      <rect x="380" y="202" width="40" height="14" rx="4" fill="var(--border)" />

      <rect x="20" y="252" width="420" height="56" rx="12" fill="var(--bg-card-hover)" />
      <rect x="40" y="268" width="18" height="18" rx="5" fill="var(--emerald)" />
      <rect x="68" y="270" width="180" height="6" rx="3" fill="var(--border)" />
      <rect x="68" y="282" width="140" height="6" rx="3" fill="var(--text-muted)" />
      <rect x="380" y="270" width="40" height="14" rx="4" fill="var(--emerald)" opacity="0.15" />

      <rect x="20" y="320" width="420" height="40" rx="10" fill="var(--bg-card-hover)" />
      <rect x="40" y="332" width="18" height="18" rx="5" fill="var(--border)" opacity="0.5" />
      <rect x="68" y="335" width="100" height="6" rx="3" fill="var(--text-muted)" opacity="0.5" />
      <rect x="380" y="333" width="40" height="14" rx="4" fill="var(--border)" opacity="0.5" />
    </svg>
  );
}

function PreviewReady() {
  return (
    <svg viewBox="0 0 460 380" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect x="0" y="0" width="460" height="380" rx="20" fill="var(--bg-card)" />
      <circle cx="230" cy="165" r="72" fill="var(--emerald)" fillOpacity="0.08" />
      <circle cx="230" cy="165" r="54" fill="var(--emerald)" fillOpacity="0.12" />
      <circle cx="230" cy="165" r="36" fill="var(--emerald)" fillOpacity="0.16" />
      <path d="M210 165L225 180L250 150" stroke="var(--emerald)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

      <rect x="170" y="254" width="120" height="8" rx="4" fill="var(--border)" />
      <rect x="190" y="272" width="80" height="6" rx="3" fill="var(--text-muted)" />

      <rect x="130" y="306" width="200" height="6" rx="3" fill="var(--emerald)" opacity="0.12" />
      <rect x="135" y="322" width="190" height="6" rx="3" fill="var(--emerald)" opacity="0.08" />
    </svg>
  );
}

const PREVIEWS = [PreviewWelcome, PreviewBoards, PreviewTasks, PreviewReady];

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
    desc: 'You\'re all set. Your workspace is ready.',
    checks: ['Account created', 'Workspace configured', 'Preferences saved'],
    btn: 'Go to Dashboard',
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="onb-inner" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '80px',
        maxWidth: '1200px',
        width: '100%',
        padding: '60px 48px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* ─── Left Content ─── */}
        <div className="onb-left" style={{
          flex: '0 0 45%',
          maxWidth: '45%',
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

        {/* ─── Right Illustration ─── */}
        <div className="onb-right" style={{
          flex: '0 0 55%',
          maxWidth: '55%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -8 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '24px',
                border: '1px solid var(--border)',
                boxShadow: '0 20px 60px -12px rgba(0,0,0,0.12)',
                padding: '36px',
                width: '100%',
                maxWidth: '500px',
                aspectRatio: '4 / 3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: '100%', height: '100%' }}
              >
                <Preview />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
