import React, { useState } from 'react';
import {
  Plus, LayoutDashboard, KanbanSquare, ListChecks, Search, Settings,
  Sun, Moon, ChevronLeft, ChevronRight, Trash2, MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import SidebarCharacter from './SidebarCharacter';

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'boards',       label: 'Boards',       icon: KanbanSquare },
  { id: 'tasks',        label: 'All Tasks',    icon: ListChecks },
  { id: 'search',       label: 'Search',       icon: Search },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
];

// Rekan SVG Logo
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

export default function Sidebar({ activeView, onNavigate, theme, onToggleTheme, projects = [], currentProjectId = 'all', onSelectProject = () => {}, onCreateProjectClick = () => {}, onDeleteProject = () => {} }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);

  const sidebarWidth = collapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)';

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
          {collapsed
            ? <ChevronRight size={16} />
            : <ChevronLeft size={16} />
          }
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
              style={{
                ...styles.navItem,
                backgroundColor: isActive ? 'var(--emerald-bg)' : 'transparent',
                color: isActive ? 'var(--emerald-dark)' : 'var(--text-secondary)',
                borderLeft: isActive ? '3px solid var(--emerald)' : '3px solid transparent',
                paddingLeft: isActive ? '13px' : '13px',
                fontWeight: isActive ? 600 : 500,
                justifyContent: collapsed ? 'center' : 'flex-start',
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

      {/* Projects Section Divider */}
      <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '8px 16px' }} />

      {/* Projects Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: collapsed ? '8px 4px' : '8px 16px',
        color: 'var(--text-muted)',
        fontSize: '11px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {!collapsed && <span>Projects</span>}
        <button
          onClick={onCreateProjectClick}
          className="btn-icon"
          style={{ padding: '2px', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}
          title="Buat Project Baru"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Projects List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '4px 8px', overflowY: 'auto', maxHeight: '180px' }}>
        {/* All Projects Option */}
        <button
          onClick={() => { onSelectProject('all'); onNavigate('dashboard'); }}
          title={collapsed ? "Semua Project" : undefined}
          style={{
            ...styles.navItem,
            backgroundColor: currentProjectId === 'all' ? 'var(--emerald-bg)' : 'transparent',
            color: currentProjectId === 'all' ? 'var(--emerald-dark)' : 'var(--text-secondary)',
            borderLeft: currentProjectId === 'all' ? '3px solid var(--emerald)' : '3px solid transparent',
            paddingLeft: currentProjectId === 'all' ? '13px' : '13px',
            fontWeight: currentProjectId === 'all' ? 600 : 500,
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        >
          <LayoutDashboard size={16} />
          {!collapsed && <span style={{ fontSize: 'var(--text-sm)' }}>Semua Project</span>}
        </button>

        {/* Individual Projects */}
        {projects.map(proj => {
          const isActive = currentProjectId === proj.id;
          const isHovered = hoveredProject === proj.id;
          return (
            <div
              key={proj.id}
              onMouseEnter={() => setHoveredProject(proj.id)}
              onMouseLeave={() => setHoveredProject(null)}
              style={{ position: 'relative' }}
            >
              <button
                onClick={() => { onSelectProject(proj.id); onNavigate('dashboard'); }}
                title={collapsed ? proj.name : undefined}
                style={{
                  ...styles.navItem,
                  backgroundColor: isActive ? 'var(--emerald-bg)' : 'transparent',
                  color: isActive ? 'var(--emerald-dark)' : 'var(--text-secondary)',
                  borderLeft: isActive ? '3px solid var(--emerald)' : '3px solid transparent',
                  paddingLeft: isActive ? '13px' : '13px',
                  fontWeight: isActive ? 600 : 500,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: proj.color,
                  marginRight: collapsed ? 0 : '8px',
                  flexShrink: 0
                }} />
                {!collapsed && (
                  <span style={{ fontSize: 'var(--text-sm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {proj.name}
                  </span>
                )}
              </button>
              {!collapsed && isHovered && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Hapus project "${proj.name}"? Semua board dan tugas di dalamnya juga akan dihapus.`)) {
                      onDeleteProject(proj.id);
                    }
                  }}
                  title="Hapus project"
                  style={styles.deleteBtn}
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom: Settings + Theme toggle + User */}
      <div style={styles.bottomArea}>
        {/* Settings */}
        <button
          className="btn-icon"
          title="Settings"
          style={{ ...styles.navItem, justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          <Settings size={17} />
          {!collapsed && <span style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', fontWeight: 500 }}>Settings</span>}
        </button>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Theme toggle */}
        <div style={{
          ...styles.themeRow,
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '8px 4px' : '8px 16px',
        }}>
          {!collapsed && (
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontWeight: 500 }}>
              {theme === 'dark' ? 'Mode Malam' : 'Mode Terang'}
            </span>
          )}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Malam'}
            style={styles.themeToggleBtn}
          >
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
                {theme === 'dark'
                  ? <Moon size={9} color="var(--emerald)" />
                  : <Sun size={9} color="var(--warning)" />
                }
              </motion.div>
            </div>
          </button>
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* User Profile */}
        <div style={{
          ...styles.userRow,
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '10px 4px' : '10px 16px',
        }}>
          <div style={styles.avatar}>U</div>
          {!collapsed && (
            <div style={styles.userInfo}>
              <span style={styles.userName}>Pengguna</span>
              <span style={styles.userEmail}>user@rekan.app</span>
            </div>
          )}
        </div>

      </div>

      {/* ════════════════════════════════════ */}
      {/* Sidebar bottom character */}
      <div style={{ flexShrink: 0 }}>
        <SidebarCharacter collapsed={collapsed} theme={theme} />
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
    padding: '12px 8px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '9px 13px',
    borderRadius: 'var(--r-md)',
    border: 'none',
    cursor: 'pointer',
    transition: 'var(--t-fast)',
    background: 'transparent',
    width: '100%',
    textAlign: 'left',
  },
  spacer: { flexGrow: 1 },
  bottomArea: {
    borderTop: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '8px',
    gap: '2px',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border)',
    margin: '4px 8px',
  },
  themeRow: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 'var(--r-md)',
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
  userRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderRadius: 'var(--r-md)',
    cursor: 'default',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--emerald-bg)',
    color: 'var(--emerald-dark)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '13px',
    border: '1.5px solid var(--emerald-border)',
    flexShrink: 0,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
    overflow: 'hidden',
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
  deleteBtn: {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '22px',
    height: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--r-sm)',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'var(--t-fast)',
    zIndex: 2,
  },
};
