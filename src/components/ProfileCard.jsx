import React, { useState, useEffect, useRef } from 'react';
import {
  X, Pencil, MapPin, Briefcase, Star, ArrowRight,
  CheckSquare, ListTodo, Activity, UserPlus, Camera, Save,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SKILL_BG = ['var(--emerald-bg)', 'var(--lavender)', 'var(--sky)', 'var(--peach)'];
const SKILL_TEXT = ['var(--emerald-dark)', '#7C3AED', '#1D4ED8', 'var(--danger)'];

function ProfileBanner({ onEditProfile }) {
  return (
    <div style={styles.banner}>
      <div style={styles.bannerGradient} />
      <motion.button
        style={styles.editBannerBtn}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={onEditProfile}
        title="Edit Profile"
      >
        <Pencil size={13} />
      </motion.button>
    </div>
  );
}

function ProfileInfo({ name, email, role, location }) {
  return (
    <div style={styles.infoSection}>
      <div style={styles.infoLeft}>
        <h2 style={styles.name}>{name}</h2>
        {role && <span style={styles.role}>{role}</span>}
        <div style={styles.locationRow}>
          <MapPin size={13} />
          <span>{location || 'Indonesia'}</span>
        </div>
      </div>
      <div style={styles.infoRight}>
        <span style={styles.roleLabel}>Current Role</span>
        <div style={styles.roleBadge}>
          <Briefcase size={12} />
          {role || 'Task Manager'}
        </div>
      </div>
    </div>
  );
}

function ProfileActions({ onEditProfile, onSettings }) {
  return (
    <div style={styles.actions}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        style={styles.btnPrimary}
        onClick={onEditProfile}
      >
        <Pencil size={14} />
        Edit Profile
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        style={styles.btnOutline}
        onClick={onSettings}
      >
        Settings
      </motion.button>
    </div>
  );
}

function ProfileSkills({ skills = [] }) {
  if (skills.length === 0) return null;
  return (
    <div style={styles.skillsSection}>
      <div style={styles.skillsHeader}>
        <Star size={14} />
        <span>Skills</span>
      </div>
      <div style={styles.skillsList}>
        {skills.map((skill, i) => (
          <span
            key={skill}
            style={{
              ...styles.skillPill,
              backgroundColor: SKILL_BG[i % SKILL_BG.length],
              color: SKILL_TEXT[i % SKILL_TEXT.length],
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function MiniCard({ icon: Icon, bg, title, desc, link, onClick }) {
  return (
    <motion.div
      style={styles.miniCard}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
    >
      <div style={{ flex: 1 }}>
        <span style={styles.miniTitle}>{title}</span>
        <span style={styles.miniDesc}>{desc}</span>
      </div>
      <div style={{ ...styles.miniIcon, backgroundColor: bg }}>
        <Icon size={16} style={{ color: 'var(--emerald-dark)' }} />
      </div>
    </motion.div>
  );
}

export default function ProfileCard({
  isOpen,
  onClose,
  onEditProfile,
  onSettings,
  onNavigate,
  tasks = [],
  boards = [],
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [avatar, setAvatar] = useState('');
  const [skills, setSkills] = useState([]);
  const isMobile = useIsMobile(600);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setName(localStorage.getItem('rekan_user_name') || 'Pengguna');
    setEmail(localStorage.getItem('rekan_user_email') || 'user@rekan.app');
    setAvatar(localStorage.getItem('rekan_user_avatar') || '');
    const savedRole = localStorage.getItem('rekan_user_role');
    setRole(savedRole || 'Task Manager');
    const savedLocation = localStorage.getItem('rekan_user_location');
    setLocation(savedLocation || 'Indonesia');
    const savedSkills = localStorage.getItem('rekan_user_skills');
    setSkills(savedSkills ? JSON.parse(savedSkills) : ['UI/UX', 'Frontend', 'React', 'Database']);
  }, [isOpen]);

  const doneTasks = tasks.filter((t) => t.status === 'Done').length;
  const totalTasks = tasks.length;
  const activeBoards = boards.filter((b) => b.status !== 'done').length;

  const openEditModal = () => {
    setEditName(name);
    setEditEmail(email);
    setEditBio(localStorage.getItem('rekan_user_bio') || '');
    setEditAvatar(avatar);
    setSaved(false);
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    const data = { name: editName, email: editEmail, bio: editBio, avatar: editAvatar };
    if (data.name) localStorage.setItem('rekan_user_name', data.name);
    if (data.email) localStorage.setItem('rekan_user_email', data.email);
    if (data.bio !== undefined) localStorage.setItem('rekan_user_bio', data.bio);
    if (data.avatar !== undefined) localStorage.setItem('rekan_user_avatar', data.avatar);
    setName(editName);
    setEmail(editEmail);
    setAvatar(editAvatar);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setShowEditModal(false);
    }, 1000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEditAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSettings = () => {
    onClose();
    onSettings();
  };

  const handleNavigate = (view) => {
    onClose();
    onNavigate(view);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div style={styles.overlay}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={styles.backdrop}
              onClick={onClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.12 }}
              style={styles.card}
            >
              <button onClick={onClose} style={styles.closeBtn}>
                <X size={16} />
              </button>

              <ProfileBanner onEditProfile={openEditModal} />
              <div style={styles.avatarOuter}>
                {avatar ? (
                  <img src={avatar} alt="" style={styles.avatarImage} />
                ) : (
                  <div style={styles.avatarPlaceholder}>
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div style={styles.cardBody}>
                <ProfileInfo name={name} email={email} role={role} location={location} />
                <ProfileActions onEditProfile={openEditModal} onSettings={handleSettings} />
                <ProfileSkills skills={skills} />

                  <div style={{ ...styles.grid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)' }}>
                  <MiniCard
                    icon={CheckSquare}
                    bg="var(--emerald-bg)"
                    title="Task Summary"
                    desc={`${doneTasks}/${totalTasks} tasks done`}
                    onClick={() => handleNavigate('tasks')}
                  />
                  <MiniCard
                    icon={Activity}
                    bg="var(--lavender)"
                    title="Recent Activity"
                    desc={`${activeBoards} active boards`}
                    onClick={() => handleNavigate('dashboard')}
                  />
                  <MiniCard
                    icon={UserPlus}
                    bg="var(--sky)"
                    title="Update Profile"
                    desc="Lengkapi data diri Anda"
                    onClick={openEditModal}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Inline Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div style={styles.overlay}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={styles.backdrop}
              onClick={() => setShowEditModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.35, bounce: 0.1 }}
              style={{ ...styles.card, maxWidth: '440px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)' }}>Edit Profile</h3>
                <button onClick={() => setShowEditModal(false)} style={styles.closeBtn}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                  {editAvatar ? (
                    <img src={editAvatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--border)' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'var(--emerald-bg)', color: 'var(--emerald-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 700, border: '3px solid var(--emerald-border)' }}>
                      {editName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{ position: 'absolute', bottom: '0', right: '0', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--emerald)', color: '#ffffff', border: '2px solid var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <Camera size={12} />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Nama Lengkap</label>
                <input style={styles.input} value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nama Anda" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Email</label>
                <input style={styles.input} type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="Email Anda" />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={styles.label}>Bio</label>
                <textarea style={{ ...styles.input, resize: 'vertical', minHeight: '60px', fontFamily: 'inherit' }} rows={2} value={editBio} onChange={(e) => setEditBio(e.target.value)} placeholder="Tentang Anda..." />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: 'var(--r-md)', backgroundColor: saved ? 'var(--success)' : 'var(--emerald)', color: '#ffffff', fontWeight: 600, fontSize: 'var(--text-base)', border: 'none', cursor: 'pointer', transition: 'var(--t-fast)' }}
                onClick={handleEditSave}
              >
                <Save size={16} />
                {saved ? 'Tersimpan!' : 'Simpan'}
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    padding: '16px',
  },
  backdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'var(--overlay)',
    backdropFilter: 'blur(6px)',
    zIndex: 1,
  },
  card: {
    position: 'relative',
    zIndex: 2,
    backgroundColor: 'var(--bg-card)',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 25px 60px -12px rgba(0,0,0,0.4)',
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    zIndex: 10,
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'var(--t-fast)',
    boxShadow: 'var(--shadow-sm)',
  },

  // ─── Banner ───
  banner: {
    height: '140px',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    overflow: 'hidden',
  },
  bannerGradient: {
    width: '100%',
    height: '100%',
    background: `
      radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.35) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(100,116,139,0.15) 0%, transparent 45%),
      radial-gradient(ellipse at 50% 80%, rgba(59,130,246,0.15) 0%, transparent 45%),
      radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.12) 0%, transparent 40%),
      linear-gradient(135deg, var(--emerald-dark) 0%, var(--emerald) 40%, var(--emerald-light) 100%)
    `,
  },
  editBannerBtn: {
    position: 'absolute',
    top: '14px',
    right: '52px',
    zIndex: 5,
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-secondary)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-md)',
    transition: 'var(--t-fast)',
  },
  avatarOuter: {
    position: 'absolute',
    top: '90px',
    left: '32px',
    zIndex: 10,
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '4px solid var(--bg-card)',
    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    backgroundColor: 'var(--bg-card)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
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
  },

  // ─── Card Body ───
  cardBody: {
    padding: '68px 28px 28px',
  },

  // ─── Info Section ───
  infoSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    flexWrap: 'wrap',
  },
  infoLeft: {
    flex: 1,
  },
  name: {
    fontSize: 'var(--text-lg)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.3px',
  },
  role: {
    display: 'block',
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  locationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  infoRight: {
    textAlign: 'right',
    flexShrink: 0,
  },
  roleLabel: {
    display: 'block',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'var(--text-muted)',
    marginBottom: '4px',
  },
  roleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '5px 12px',
    borderRadius: 'var(--r-full)',
    backgroundColor: 'var(--emerald-bg)',
    color: 'var(--emerald-dark)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
  },

  // ─── Actions ───
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 20px',
    borderRadius: 'var(--r-full)',
    backgroundColor: 'var(--emerald)',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: 'var(--text-sm)',
    border: 'none',
    cursor: 'pointer',
    transition: 'var(--t-fast)',
  },
  btnOutline: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 20px',
    borderRadius: 'var(--r-full)',
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    fontWeight: 600,
    fontSize: 'var(--text-sm)',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    transition: 'var(--t-fast)',
  },

  // ─── Skills ───
  skillsSection: {
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid var(--border)',
  },
  skillsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'var(--text-muted)',
    marginBottom: '10px',
  },
  skillsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  skillPill: {
    padding: '4px 12px',
    borderRadius: 'var(--r-full)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
  },

  // ─── Mini Grid ───
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    marginTop: '24px',
  },
  miniCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px',
    borderRadius: 'var(--r-lg)',
    backgroundColor: 'var(--bg-subtle)',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    transition: 'var(--t-fast)',
  },
  miniTitle: {
    display: 'block',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '2px',
  },
  miniDesc: {
    display: 'block',
    fontSize: '10px',
    color: 'var(--text-muted)',
  },
  miniIcon: {
    width: '34px',
    height: '34px',
    borderRadius: 'var(--r-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // ─── Edit Modal Fields ───
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

  // ─── Responsive ───
};

// Responsive: grid columns via inline logic
function useIsMobile(breakpoint = 600) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}
