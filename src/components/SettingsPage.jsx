import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  User, Shield, Lock, Bell, Palette, Camera, Save,
  Eye, EyeOff, Trash2, TabletSmartphone, Mail, MessageSquare,
  Sun, Moon, ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MENU_ITEMS = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'account',       label: 'Account',       icon: Shield },
  { id: 'password',      label: 'Password',      icon: Lock },
  { id: 'notifications', label: 'Notifications',  icon: Bell },
  { id: 'appearance',    label: 'Appearance',    icon: Palette },
];

const ACCENT_COLORS = [
  { id: 'emerald',  label: 'Emerald',  bg: 'var(--emerald-bg)' },
  { id: 'lavender', label: 'Lavender', bg: 'var(--lavender)' },
  { id: 'peach',    label: 'Peach',    bg: 'var(--peach)' },
  { id: 'sky',      label: 'Sky',      bg: 'var(--sky)' },
];

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 3);
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}

function SettingsSidebar({ activeMenu, onMenuChange, isMobile }) {
  if (isMobile) {
    return (
      <nav style={styles.mobileMenuWrapper}>
        <div style={styles.mobileMenu}>
          {MENU_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeMenu === id;
            return (
              <button
                key={id}
                onClick={() => onMenuChange(id)}
                style={{
                  ...styles.mobileMenuItem,
                  backgroundColor: isActive ? 'var(--emerald)' : 'transparent',
                  color: isActive ? 'var(--text-invert)' : 'var(--text-secondary)',
                }}
              >
                <Icon size={16} />
                <span style={{ whiteSpace: 'nowrap', fontSize: 'var(--text-sm)' }}>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <nav style={styles.sidebar}>
      {MENU_ITEMS.map(({ id, label, icon: Icon }) => {
        const isActive = activeMenu === id;
        return (
          <button
            key={id}
            onClick={() => onMenuChange(id)}
            style={{
              ...styles.sidebarItem,
              backgroundColor: isActive ? 'var(--emerald)' : 'transparent',
              color: isActive ? 'var(--text-invert)' : 'var(--text-secondary)',
              fontWeight: isActive ? 600 : 500,
            }}
          >
            <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
            <span>{label}</span>
            {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
          </button>
        );
      })}
    </nav>
  );
}

function ProfileForm({ onUpdateUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setName(localStorage.getItem('rekan_user_name') || 'Pengguna');
    setEmail(localStorage.getItem('rekan_user_email') || 'user@rekan.app');
    setBio(localStorage.getItem('rekan_user_bio') || '');
    setAvatar(localStorage.getItem('rekan_user_avatar') || '');
  }, []);

  const handleSave = () => {
    onUpdateUser({ name, email, bio, avatar });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <h2 style={styles.formTitle}>Profile</h2>
      <p style={styles.formSubtitle}>Kelola informasi profil Anda</p>

      <div style={styles.avatarSection}>
        <motion.div
          style={styles.avatarWrapper}
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          {avatar ? (
            <img src={avatar} alt="Avatar" style={styles.avatarImage} />
          ) : (
            <div style={styles.avatarPlaceholder}>
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <motion.button
            style={styles.cameraBtn}
            onClick={() => fileInputRef.current?.click()}
            title="Ubah foto profile"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Camera size={14} />
          </motion.button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
        </motion.div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Nama Lengkap</label>
        <input
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Masukkan nama Anda"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Masukkan email Anda"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Bio</label>
        <textarea
          style={styles.textarea}
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Ceritakan tentang diri Anda..."
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        style={{
          ...styles.saveBtn,
          backgroundColor: saved ? 'var(--success)' : 'var(--emerald)',
        }}
        onClick={handleSave}
      >
        <Save size={16} />
        {saved ? 'Tersimpan!' : 'Simpan Perubahan'}
      </motion.button>
    </motion.div>
  );
}

function AccountForm() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <h2 style={styles.formTitle}>Account</h2>
      <p style={styles.formSubtitle}>Informasi dan pengaturan akun Anda</p>

      <div style={styles.infoCard}>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Plan</span>
          <span style={styles.infoValue}>
            <span style={{ ...styles.badgePill, backgroundColor: 'var(--emerald-bg)', color: 'var(--emerald-dark)' }}>Free</span>
          </span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Member since</span>
          <span style={styles.infoValue}>Januari 2025</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Storage</span>
          <span style={styles.infoValue}>Local storage (client-side)</span>
        </div>
      </div>

      <div style={{ ...styles.dangerZone, marginTop: '32px' }}>
        <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--danger)', marginBottom: '8px' }}>
          Danger Zone
        </h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Setelah menghapus akun, semua data akan hilang permanen.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={styles.dangerBtn}
        >
          <Trash2 size={15} />
          Hapus Akun
        </motion.button>
      </div>
    </motion.div>
  );
}

function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = getPasswordStrength(newPassword);
  const strengthLabel = ['', 'Lemah', 'Sedang', 'Kuat'][strength];
  const strengthColor = ['', 'var(--danger)', 'var(--warning)', 'var(--success)'][strength];
  const strengthWidth = ['0%', '33%', '66%', '100%'][strength];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <h2 style={styles.formTitle}>Password</h2>
      <p style={styles.formSubtitle}>Ubah password akun Anda</p>

      <div style={styles.field}>
        <label style={styles.label}>Password Saat Ini</label>
        <div style={styles.inputWrapper}>
          <Lock size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            style={styles.inputInner}
            type={showCurrent ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Masukkan password saat ini"
          />
          <button
            onClick={() => setShowCurrent(!showCurrent)}
            style={styles.eyeBtn}
            type="button"
          >
            {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Password Baru</label>
        <div style={styles.inputWrapper}>
          <Lock size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            style={styles.inputInner}
            type={showNew ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
          />
          <button
            onClick={() => setShowNew(!showNew)}
            style={styles.eyeBtn}
            type="button"
          >
            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {newPassword.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            <div style={styles.strengthTrack}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: strengthWidth }}
                transition={{ duration: 0.3 }}
                style={{ ...styles.strengthFill, backgroundColor: strengthColor, width: strengthWidth }}
              />
            </div>
            <span style={{ fontSize: 'var(--text-xs)', color: strengthColor, fontWeight: 600, marginTop: '4px', display: 'block' }}>
              Kekuatan password: {strengthLabel}
            </span>
          </div>
        )}
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Konfirmasi Password Baru</label>
        <div style={styles.inputWrapper}>
          <Lock size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            style={styles.inputInner}
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi password baru"
          />
          <button
            onClick={() => setShowConfirm(!showConfirm)}
            style={styles.eyeBtn}
            type="button"
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        style={styles.saveBtn}
      >
        <Save size={16} />
        Perbarui Password
      </motion.button>
    </motion.div>
  );
}

function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      onClick={onChange}
      style={{
        ...styles.toggleTrack,
        backgroundColor: checked ? 'var(--emerald)' : 'var(--border-strong)',
      }}
      type="button"
      aria-label={label}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          ...styles.toggleThumb,
          marginLeft: checked ? 'auto' : '2px',
          marginRight: checked ? '2px' : 'auto',
        }}
      />
    </button>
  );
}

function NotificationsForm() {
  const [emailNotif, setEmailNotif] = useState(() => localStorage.getItem('rekan_notif_email') === 'true');
  const [pushNotif, setPushNotif] = useState(() => localStorage.getItem('rekan_notif_push') === 'true');
  const [digest, setDigest] = useState(() => localStorage.getItem('rekan_notif_digest') === 'true');

  const toggle = (key, value, setter) => {
    localStorage.setItem(key, value ? 'true' : 'false');
    setter(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <h2 style={styles.formTitle}>Notifications</h2>
      <p style={styles.formSubtitle}>Atur preferensi notifikasi Anda</p>

      <div style={styles.notifItem}>
        <div style={styles.notifIcon}>
          <Mail size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <span style={styles.notifLabel}>Email Notifications</span>
          <span style={styles.notifDesc}>Terima notifikasi via email</span>
        </div>
        <ToggleSwitch checked={emailNotif} onChange={() => toggle('rekan_notif_email', !emailNotif, setEmailNotif)} label="Email notifications" />
      </div>

      <div style={styles.notifItem}>
        <div style={{ ...styles.notifIcon, backgroundColor: 'var(--sky)' }}>
          <TabletSmartphone size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <span style={styles.notifLabel}>Push Notifications</span>
          <span style={styles.notifDesc}>Notifikasi langsung di perangkat</span>
        </div>
        <ToggleSwitch checked={pushNotif} onChange={() => toggle('rekan_notif_push', !pushNotif, setPushNotif)} label="Push notifications" />
      </div>

      <div style={styles.notifItem}>
        <div style={{ ...styles.notifIcon, backgroundColor: 'var(--lavender)' }}>
          <MessageSquare size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <span style={styles.notifLabel}>Weekly Digest</span>
          <span style={styles.notifDesc}>Rangkuman progres mingguan</span>
        </div>
        <ToggleSwitch checked={digest} onChange={() => toggle('rekan_notif_digest', !digest, setDigest)} label="Weekly digest" />
      </div>
    </motion.div>
  );
}

function PreferencesForm({ theme, onToggleTheme }) {
  const [accent, setAccent] = useState(() => localStorage.getItem('rekan_accent_color') || 'emerald');

  const handleAccentChange = (id) => {
    localStorage.setItem('rekan_accent_color', id);
    setAccent(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <h2 style={styles.formTitle}>Appearance</h2>
      <p style={styles.formSubtitle}>Sesuaikan tampilan aplikasi</p>

      <div style={styles.notifItem}>
        <div style={{ ...styles.notifIcon, backgroundColor: 'var(--emerald-bg)' }}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </div>
        <div style={{ flex: 1 }}>
          <span style={styles.notifLabel}>Dark Mode</span>
          <span style={styles.notifDesc}>{theme === 'dark' ? 'Mode gelap aktif' : 'Mode terang aktif'}</span>
        </div>
        <ToggleSwitch checked={theme === 'dark'} onChange={onToggleTheme} label="Dark mode" />
      </div>

      <div style={{ marginTop: '28px' }}>
        <span style={{ ...styles.label, marginBottom: '12px', display: 'block' }}>Accent Color</span>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {ACCENT_COLORS.map(({ id, label, bg }) => (
            <motion.button
              key={id}
              onClick={() => handleAccentChange(id)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              style={{
                ...styles.accentPill,
                backgroundColor: bg,
                borderColor: accent === id ? 'var(--text-primary)' : 'transparent',
                color: accent === id ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: id === 'emerald' ? 'var(--emerald)' : id === 'lavender' ? '#7C3AED' : id === 'peach' ? '#EF4444' : '#3B82F6',
                flexShrink: 0,
              }} />
              {label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function SettingsPage({ onUpdateUser, theme, onToggleTheme }) {
  const [activeMenu, setActiveMenu] = useState('profile');
  const isMobile = useIsMobile(768);

  const renderContent = () => {
    switch (activeMenu) {
      case 'profile':       return <ProfileForm onUpdateUser={onUpdateUser} />;
      case 'account':       return <AccountForm />;
      case 'password':      return <PasswordForm />;
      case 'notifications': return <NotificationsForm />;
      case 'appearance':    return <PreferencesForm theme={theme} onToggleTheme={onToggleTheme} />;
      default:              return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={styles.page}
    >
      <div style={styles.header}>
        <h1 style={styles.title}>Settings</h1>
        <p style={styles.subtitle}>Kelola pengaturan akun Anda</p>
      </div>

      <div style={styles.layout}>
        <SettingsSidebar
          activeMenu={activeMenu}
          onMenuChange={setActiveMenu}
          isMobile={isMobile}
        />

        <motion.div
          style={styles.content}
          whileHover={{ boxShadow: 'var(--shadow-lg)' }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

const styles = {
  page: {
    padding: '32px 40px',
  },
  header: {
    marginBottom: '28px',
  },
  title: {
    fontSize: 'var(--text-xl)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: 'var(--text-base)',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  layout: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start',
  },

  // ─── Sidebar ───
  sidebar: {
    width: '220px',
    flexShrink: 0,
    backgroundColor: 'var(--bg-card)',
    borderRadius: 'var(--r-xl)',
    boxShadow: 'var(--shadow-md)',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  sidebarItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '11px 14px',
    borderRadius: 'var(--r-md)',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    fontSize: 'var(--text-base)',
    transition: 'var(--t-fast)',
  },

  // ─── Mobile Menu ───
  mobileMenuWrapper: {
    width: '100%',
    marginBottom: '16px',
    overflowX: 'auto',
  },
  mobileMenu: {
    display: 'flex',
    gap: '6px',
    padding: '4px',
    backgroundColor: 'var(--bg-card)',
    borderRadius: 'var(--r-xl)',
    boxShadow: 'var(--shadow-md)',
    minWidth: 'fit-content',
  },
  mobileMenuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: 'var(--r-md)',
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'var(--t-fast)',
  },

  // ─── Content Card ───
  content: {
    flex: 1,
    backgroundColor: 'var(--bg-card)',
    borderRadius: 'var(--r-xl)',
    boxShadow: 'var(--shadow-md)',
    padding: '32px',
    minHeight: '400px',
    transition: 'box-shadow 0.2s ease',
  },
  formTitle: {
    fontSize: 'var(--text-lg)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.3px',
  },
  formSubtitle: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    marginTop: '4px',
    marginBottom: '28px',
  },

  // ─── Profile Avatar ───
  avatarSection: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '28px',
  },
  avatarWrapper: {
    position: 'relative',
    width: '92px',
    height: '92px',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid var(--border)',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: 'var(--emerald-bg)',
    color: 'var(--emerald-dark)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '34px',
    fontWeight: 700,
    border: '3px solid var(--emerald-border)',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--emerald)',
    color: '#ffffff',
    border: '2.5px solid var(--bg-card)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'var(--t-fast)',
  },

  // ─── Form Fields ───
  field: {
    marginBottom: '20px',
  },
  label: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontSize: 'var(--text-base)',
    outline: 'none',
    transition: 'var(--t-fast)',
  },
  textarea: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontSize: 'var(--text-base)',
    outline: 'none',
    resize: 'vertical',
    transition: 'var(--t-fast)',
    fontFamily: 'inherit',
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
  inputInner: {
    flex: 1,
    padding: '11px 0',
    border: 'none',
    background: 'none',
    color: 'var(--text-primary)',
    fontSize: 'var(--text-base)',
    outline: 'none',
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
  saveBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 24px',
    borderRadius: 'var(--r-md)',
    backgroundColor: 'var(--emerald)',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: 'var(--text-base)',
    border: 'none',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'var(--t-fast)',
  },

  // ─── Password Strength ───
  strengthTrack: {
    height: '4px',
    backgroundColor: 'var(--border)',
    borderRadius: 'var(--r-full)',
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 'var(--r-full)',
    transition: 'width 0.3s ease',
  },

  // ─── Account Info ───
  infoCard: {
    backgroundColor: 'var(--bg-subtle)',
    borderRadius: 'var(--r-lg)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  infoValue: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-primary)',
    fontWeight: 600,
  },
  badgePill: {
    padding: '2px 10px',
    borderRadius: 'var(--r-full)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
  },
  dangerZone: {
    backgroundColor: 'var(--danger-bg)',
    borderRadius: 'var(--r-lg)',
    padding: '20px',
    border: '1px solid rgba(239,68,68,0.15)',
  },
  dangerBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 18px',
    borderRadius: 'var(--r-md)',
    backgroundColor: 'var(--danger)',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: 'var(--text-sm)',
    border: 'none',
    cursor: 'pointer',
    transition: 'var(--t-fast)',
  },

  // ─── Notifications ───
  notifItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px 0',
    borderBottom: '1px solid var(--border)',
  },
  notifIcon: {
    width: '38px',
    height: '38px',
    borderRadius: 'var(--r-lg)',
    backgroundColor: 'var(--emerald-bg)',
    color: 'var(--emerald)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notifLabel: {
    display: 'block',
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  notifDesc: {
    display: 'block',
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },

  // ─── Toggle ───
  toggleTrack: {
    width: '40px',
    height: '22px',
    borderRadius: '11px',
    display: 'flex',
    alignItems: 'center',
    padding: '0',
    transition: 'background-color var(--t-base)',
    position: 'relative',
    cursor: 'pointer',
    border: 'none',
    flexShrink: 0,
  },
  toggleThumb: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },

  // ─── Accent Colors ───
  accentPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: 'var(--r-full)',
    border: '1.5px solid transparent',
    cursor: 'pointer',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    transition: 'var(--t-fast)',
  },
};
