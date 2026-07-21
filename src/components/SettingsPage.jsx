import React, { useState, useEffect, useRef } from 'react';
import { Camera, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
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
    localStorage.setItem('rekan_user_name', name);
    localStorage.setItem('rekan_user_email', email);
    localStorage.setItem('rekan_user_bio', bio);
    localStorage.setItem('rekan_user_avatar', avatar);
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={styles.page}
    >
      <div style={styles.header}>
        <h1 style={styles.title}>Settings</h1>
        <p style={styles.subtitle}>Kelola pengaturan akun Anda</p>
      </div>

      <div style={styles.section}>
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
    </motion.div>
  );
}

const styles = {
  page: {
    padding: '32px 40px',
    maxWidth: '680px',
  },
  header: {
    marginBottom: '32px',
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
  section: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: 'var(--r-xl)',
    border: '1px solid var(--border)',
    padding: '28px',
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
};
