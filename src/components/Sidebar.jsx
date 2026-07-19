import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, KanbanSquare, ListChecks,
  Sun, Moon, ChevronLeft, ChevronRight, LogOut,
  Calendar, FileText, Settings,
} from 'lucide-react';
import { motion } from 'framer-motion';
import SidebarCharacter from './SidebarCharacter';

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'boards',     label: 'Projects',   icon: KanbanSquare },
  { id: 'tasks',      label: 'All Tasks',  icon: ListChecks },
  { id: 'calendar',   label: 'Calendar',   icon: Calendar },
  { id: 'notes',      label: 'Notes',      icon: FileText },
  { id: 'settings',   label: 'Settings',   icon: Settings },
];

function RekanLogo({ size = 20, collapsed = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
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
      {!collapsed && (
        <span style={{
          fontSize: '17px',
          fontWeight: 800,
          letterSpacing: '-0.5px',
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap'
        }}>
          Rekan
        </span>
      )}
    </div>
  );
}

const sidebarStyle = document.createElement('style');
sidebarStyle.textContent = `
  .sd-logout-btn:hover { background-color: rgba(239,68,68,0.08) !important; color: #EF4444 !important; }
  .sd-logout-btn:focus-visible { outline: 2px solid #EF4444; outline-offset: 2px; border-radius: 8px; }
  .sd-user-card:hover { background-color: var(--bg-card-hover) !important; }
  .sd-nav-item:hover { background-color: var(--bg-card-hover) !important; }
`;
document.head.appendChild(sidebarStyle);

export default function Sidebar({ activeView, onNavigate, theme, onToggleTheme, onLogout = () => {} }) {
  const [collapsed, setCollapsed] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setCollapsed(true);
    }
  }, []);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={styles.sidebar}
    >
      {/* Logo */}
      <div style={styles.logoArea}>
        <RekanLogo size={22} collapsed={collapsed} />
        <button
          className="btn-icon"
          onClick={() => setCollapsed(!collapsed)}
          style={{ marginLeft: 'auto', flexShrink: 0 }}
          title={collapsed ? 'Perluas sidebar' : 'Perkecil sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeView === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              title={collapsed ? label : undefined}
              className="sd-nav-item"
              style={{
                ...styles.navItem,
                backgroundColor: isActive ? 'var(--emerald-bg)' : 'transparent',
                color: isActive ? 'var(--emerald)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderLeft: isActive ? '3px solid var(--emerald)' : '3px solid transparent',
                paddingLeft: isActive ? '9px' : '12px',
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              {!collapsed && (
                <span style={{ fontSize: 'var(--text-base)', whiteSpace: 'nowrap' }}>
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Character */}
      <SidebarCharacter collapsed={collapsed} theme={theme} />

      {/* Bottom Section */}
      <div style={styles.bottomSection}>
        {/* Theme Toggle */}
        <div style={styles.themeRow}>
          {!collapsed && (
            <span style={styles.themeLabel}>
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
          )}
          <button onClick={onToggleTheme} title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'} style={styles.themeToggleBtn}>
            <div style={{
              ...styles.toggleTrack,
              backgroundColor: theme === 'dark' ? 'var(--emerald)' : 'var(--border-strong)'
            }}>
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{
                  ...styles.toggleThumb,
                  marginLeft: theme === 'dark' ? 'auto' : '2px',
                  marginRight: theme === 'dark' ? '2px' : 'auto',
                }}
              >
                {theme === 'dark' ? <Moon size={9} color="var(--emerald)" /> : <Sun size={9} color="var(--warning)" />}
              </motion.div>
            </div>
          </button>
        </div>

        {/* User Card */}
        <div style={styles.userCard}>
          <div style={styles.userCardInner}>
            <div style={styles.avatar}>U</div>
            {!collapsed && (
              <div style={styles.userInfo}>
                <span style={styles.userName}>Pengguna</span>
                <span style={styles.userEmail}>user@rekan.app</span>
              </div>
            )}
          </div>
          {!collapsed && <div style={styles.workspaceBadge}>Personal Workspace</div>}
        </div>

        {/* Logout */}
        <button onClick={onLogout} title="Logout" className="sd-logout-btn" style={styles.logoutBtn}>
          <LogOut size={14} />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Version */}
        {!collapsed && (
          <div style={styles.versionRow}>
            <span style={styles.versionText}>Workspace · Personal</span>
            <span style={styles.versionText}>v1.0.0</span>
          </div>
        )}
      </div>
    </motion.aside>
  );
}

const styles = {
  sidebar: {
    backgroundColor: 'var(--bg-sidebar)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
    flexShrink: 0,
    overflow: 'hidden',
    transition: 'background-color var(--t-slow), border-color var(--t-slow)',
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    padding: '18px 16px',
    borderBottom: '1px solid var(--border)',
    gap: '8px',
    minHeight: '64px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '10px 8px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '9px 12px',
    borderRadius: 'var(--r-md)',
    border: 'none',
    cursor: 'pointer',
    transition: 'var(--t-fast)',
    background: 'transparent',
    width: '100%',
    textAlign: 'left',
  },
  bottomSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '8px',
    borderTop: '1px solid var(--border)',
  },
  themeRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4px 8px',
    borderRadius: 'var(--r-md)',
  },
  themeLabel: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  themeToggleBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    flexShrink: 0,
  },
  toggleTrack: {
    width: '36px',
    height: '20px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    padding: '0',
    transition: 'background-color var(--t-base)',
    position: 'relative',
  },
  toggleThumb: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
  userCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '10px 10px',
    borderRadius: 'var(--r-lg)',
    backgroundColor: 'var(--bg-card-hover)',
    transition: 'var(--t-fast)',
  },
  userCardInner: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    backgroundColor: 'var(--emerald-bg)',
    color: 'var(--emerald-dark)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '14px',
    border: '1.5px solid var(--emerald-border)',
    flexShrink: 0,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
    overflow: 'hidden',
    flex: 1,
  },
  userName: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userEmail: {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  workspaceBadge: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-muted)',
    padding: '3px 8px',
    borderRadius: 'var(--r-sm)',
    backgroundColor: 'var(--bg-sidebar)',
    textAlign: 'center',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    width: '100%',
    padding: '9px 12px',
    borderRadius: 'var(--r-md)',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 600,
    transition: 'var(--t-fast)',
  },
  versionRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4px 8px',
  },
  versionText: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
};
