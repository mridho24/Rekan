import React, { useState, useEffect, useRef } from 'react';
import {
  User, Lock, Mail, Trash2, Camera, Save,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MENU_ITEMS = [
  { id: 'profile',  label: 'Edit Profile',     icon: User },
  { id: 'password', label: 'Ganti Password',    icon: Lock },
  { id: 'email',    label: 'Verifikasi Email',  icon: Mail },
  { id: 'delete',   label: 'Hapus Akun',        icon: Trash2 },
];

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
    <div>
      <h2 style={styles.sectionTitle}>Edit Profile</h2>

      <div style={styles.avatarSection}>
        <div style={styles.avatarWrapper}>
          {avatar ? (
            <img src={avatar} alt="Avatar" style={styles.avatarImage} />
          ) : (
            <div style={styles.avatarPlaceholder}>
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            style={styles.cameraBtn}
            onClick={() => fileInputRef.current?.click()}
            title="Ubah foto profile"
          >
            <Camera size={14} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
        </div>
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
    </div>
  );
}

function PasswordForm() {
  return (
    <div>
      <h2 style={styles.sectionTitle}>Ganti Password</h2>
      <p style={styles.placeholderText}>Fitur akan segera tersedia.</p>
    </div>
  );
}

function EmailVerification() {
  return (
    <div>
      <h2 style={styles.sectionTitle}>Verifikasi Email</h2>
      <p style={styles.placeholderText}>Fitur akan segera tersedia.</p>
    </div>
  );
}

function DeleteAccount() {
  return (
    <div>
      <h2 style={styles.sectionTitle}>Hapus Akun</h2>
      <p style={styles.placeholderText}>Fitur akan segera tersedia.</p>
    </div>
  );
}

export default function SettingsPage({ onUpdateUser }) {
  const [activeMenu, setActiveMenu] = useState('profile');

  const renderContent = () => {
    switch (activeMenu) {
      case 'profile':  return <ProfileForm onUpdateUser={onUpdateUser} />;
      case 'password': return <PasswordForm />;
      case 'email':    return <EmailVerification />;
      case 'delete':   return <DeleteAccount />;
      default:         return null;
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
        <nav style={styles.menu}>
          {MENU_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeMenu === id;
            return (
              <button
                key={id}
                onClick={() => setActiveMenu(id)}
                style={{
                  ...styles.menuItem,
                  backgroundColor: isActive ? 'var(--emerald-bg)' : 'transparent',
                  color: isActive ? 'var(--emerald)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                <span style={{ fontSize: 'var(--text-base)' }}>{label}</span>
              </button>
            );
          })}
        </nav>

        <div style={styles.content}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
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
  menu: {
    width: '220px',
    flexShrink: 0,
    backgroundColor: 'var(--bg-card)',
    borderRadius: 'var(--r-xl)',
    border: '1px solid var(--border)',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    borderRadius: 'var(--r-md)',
    border: 'none',
    cursor: 'pointer',
    background: 'transparent',
    width: '100%',
    textAlign: 'left',
    transition: 'var(--t-fast)',
  },
  content: {
    flex: 1,
    backgroundColor: 'var(--bg-card)',
    borderRadius: 'var(--r-xl)',
    border: '1px solid var(--border)',
    padding: '28px',
    minHeight: '400px',
  },
  sectionTitle: {
    fontSize: 'var(--text-md)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '24px',
  },
  avatarSection: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  avatarWrapper: {
    position: 'relative',
    width: '88px',
    height: '88px',
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
    fontSize: '32px',
    fontWeight: 700,
    border: '3px solid var(--emerald-border)',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: 'var(--emerald)',
    color: '#ffffff',
    border: '2px solid var(--bg-card)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'var(--t-fast)',
  },
  field: {
    marginBottom: '18px',
  },
  label: {
    display: 'block',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
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
    padding: '10px 14px',
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
  saveBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 24px',
    borderRadius: 'var(--r-md)',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: 'var(--text-base)',
    border: 'none',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'var(--t-fast)',
  },
  placeholderText: {
    color: 'var(--text-muted)',
    fontSize: 'var(--text-base)',
  },
};
