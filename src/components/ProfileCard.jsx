import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, Pencil, MapPin, Briefcase, Star, ArrowRight,
  CheckSquare, ListTodo, Activity, UserPlus, Camera, Save,
  Phone, Search, ChevronDown,
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

const LOCATION_DATA = {
  Indonesia: {
    Aceh: ['Banda Aceh', 'Lhokseumawe', 'Langsa', 'Sabang', 'Meulaboh'],
  },
};

function LocationSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('Indonesia');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    if (value) {
      const parts = value.split(', ');
      if (parts[0]) setCity(parts[0]);
      if (parts[1]) setProvince(parts[1]);
    }
  }, [value]);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const provinces = LOCATION_DATA[country] ? Object.keys(LOCATION_DATA[country]) : [];
  const cities = province && LOCATION_DATA[country]?.[province] ? LOCATION_DATA[country][province] : [];

  const filteredCities = query
    ? cities.filter(c => c.toLowerCase().includes(query.toLowerCase()))
    : cities;

  const selectCity = (c) => {
    setCity(c);
    const label = province ? `${c}, ${province}` : c;
    onChange(label);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen(!open)}
        style={styles.selectTrigger}
      >
        <MapPin size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <span style={{ flex: 1, color: value ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: 'var(--text-base)' }}>
          {value || 'Pilih lokasi...'}
        </span>
        <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
      </div>

      {open && (
        <div style={styles.selectDropdown}>
          <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border)' }}>
            <div style={styles.searchInputWrapper}>
              <Search size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input
                style={styles.searchInput}
                placeholder="Cari kota..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoFocus
              />
              {query && (
                <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}>
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          <div style={{ padding: '6px 0 2px', borderBottom: '1px solid var(--border)' }}>
            <span style={styles.selectSectionLabel}>Provinsi</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '0 8px 6px' }}>
              {provinces.map(p => (
                <button
                  key={p}
                  onClick={() => { setProvince(p); setQuery(''); }}
                  style={{
                    ...styles.optionPill,
                    backgroundColor: province === p ? 'var(--emerald-bg)' : 'transparent',
                    color: province === p ? 'var(--emerald)' : 'var(--text-secondary)',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
            <span style={styles.selectSectionLabel}>Kota</span>
            {filteredCities.length === 0 ? (
              <div style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                {province ? 'Kota tidak ditemukan' : 'Pilih provinsi terlebih dahulu'}
              </div>
            ) : (
              filteredCities.map(c => (
                <button
                  key={c}
                  onClick={() => selectCity(c)}
                  style={{
                    ...styles.optionItem,
                    backgroundColor: city === c ? 'var(--emerald-bg)' : 'transparent',
                    color: city === c ? 'var(--emerald)' : 'var(--text-primary)',
                    fontWeight: city === c ? 600 : 400,
                  }}
                >
                  <MapPin size={13} style={{ color: city === c ? 'var(--emerald)' : 'var(--text-muted)' }} />
                  {c}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function EditProfileModal({
  editName, setEditName,
  editEmail, setEditEmail,
  editBio, setEditBio,
  editAvatar, setEditAvatar,
  editPhone, setEditPhone,
  editLocation, setEditLocation,
  saved, onSave, onClose,
  fileInputRef, onAvatarChange,
}) {
  const [editPhoneLocal, setEditPhoneLocal] = useState(editPhone);
  const modalRef = useRef(null);
  const firstFocusableRef = useRef(null);

  useEffect(() => {
    setEditPhoneLocal(editPhone);
  }, [editPhone]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    if (firstFocusableRef.current) firstFocusableRef.current.focus();
  }, []);

  const handleSave = () => {
    setEditPhone(editPhoneLocal);
    onSave();
  };

  const isMobile = window.innerWidth < 640;

  return (
    <div className="em-edit-overlay" style={styles.editOverlay}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        style={styles.editBackdrop}
        onClick={onClose}
      />
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ type: 'spring', duration: 0.35, bounce: 0.08 }}
        style={{
          ...styles.editCard,
          maxWidth: isMobile ? 'calc(100vw - 32px)' : '680px',
          maxHeight: isMobile ? '95vh' : '90vh',
        }}
      >
        {/* Header */}
        <div style={styles.editHeader}>
          <div>
            <h2 style={styles.editTitle}>Edit Profile</h2>
            <p style={styles.editDesc}>Perbarui informasi profil Anda</p>
          </div>
          <button onClick={onClose} style={styles.editCloseBtn}>
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={styles.editBody}>
          {/* Avatar */}
          <div style={styles.editAvatarSection}>
            <div style={styles.editAvatarWrapper}>
              {editAvatar ? (
                <img src={editAvatar} alt="" style={styles.editAvatarImg} />
              ) : (
                <div style={styles.editAvatarPlaceholder}>
                  {editName.charAt(0).toUpperCase()}
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                style={styles.editCameraBtn}
              >
                <Camera size={13} />
              </motion.button>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onAvatarChange} />
            </div>
          </div>

          {/* Fields */}
          <div className="em-fields-grid" style={styles.editFieldsGrid}>
            <div style={styles.editField}>
              <label style={styles.editLabel}>Nama Lengkap</label>
              <input
                ref={firstFocusableRef}
                style={styles.editInput}
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Masukkan nama Anda"
              />
            </div>

            <div style={styles.editField}>
              <label style={styles.editLabel}>Email</label>
              <input
                style={styles.editInput}
                type="email"
                value={editEmail}
                onChange={e => setEditEmail(e.target.value)}
                placeholder="nama@email.com"
              />
            </div>

            <div style={styles.editField}>
              <label style={styles.editLabel}>No. Telepon</label>
              <div style={styles.editInputWrapper}>
                <Phone size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <input
                  style={styles.editInputInner}
                  type="tel"
                  value={editPhoneLocal}
                  onChange={e => setEditPhoneLocal(e.target.value)}
                  placeholder="+62 812 3456 7890"
                />
              </div>
            </div>

            <div style={styles.editField}>
              <label style={styles.editLabel}>Lokasi</label>
              <LocationSelect value={editLocation} onChange={setEditLocation} />
            </div>

            <div style={{ ...styles.editField, gridColumn: '1 / -1' }}>
              <label style={styles.editLabel}>Bio</label>
              <textarea
                style={styles.editTextarea}
                rows={3}
                value={editBio}
                onChange={e => setEditBio(e.target.value)}
                placeholder="Ceritakan tentang diri Anda..."
              />
              <span style={styles.editHelper}>{editBio.length} karakter</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.editFooter}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={styles.editCancelBtn}
            onClick={onClose}
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{
              ...styles.editSaveBtn,
              backgroundColor: saved ? 'var(--success)' : 'var(--emerald)',
            }}
            onClick={handleSave}
          >
            <Save size={15} />
            {saved ? 'Tersimpan!' : 'Save Changes'}
          </motion.button>
        </div>
      </motion.div>
    </div>
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
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState([]);
  const isMobile = useIsMobile(600);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setName(localStorage.getItem('rekan_user_name') || 'Pengguna');
    setEmail(localStorage.getItem('rekan_user_email') || 'user@rekan.app');
    setAvatar(localStorage.getItem('rekan_user_avatar') || '');
    setBio(localStorage.getItem('rekan_user_bio') || '');
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
    setEditPhone(localStorage.getItem('rekan_user_phone') || '');
    setEditLocation(localStorage.getItem('rekan_user_location') || '');
    setSaved(false);
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    const data = { name: editName, email: editEmail, bio: editBio, avatar: editAvatar };
    if (data.name) localStorage.setItem('rekan_user_name', data.name);
    if (data.email) localStorage.setItem('rekan_user_email', data.email);
    if (data.bio !== undefined) localStorage.setItem('rekan_user_bio', data.bio);
    if (data.avatar !== undefined) localStorage.setItem('rekan_user_avatar', data.avatar);
    localStorage.setItem('rekan_user_phone', editPhone);
    localStorage.setItem('rekan_user_location', editLocation);
    setName(editName);
    setEmail(editEmail);
    setAvatar(editAvatar);
    setBio(editBio);
    setLocation(editLocation);
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

              {bio && (
                <div style={styles.speechBubble}>
                  <div style={styles.speechBubbleArrow} />
                  <span style={styles.speechBubbleText}>{bio}</span>
                </div>
              )}

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

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <EditProfileModal
            editName={editName} setEditName={setEditName}
            editEmail={editEmail} setEditEmail={setEditEmail}
            editBio={editBio} setEditBio={setEditBio}
            editAvatar={editAvatar} setEditAvatar={setEditAvatar}
            editPhone={editPhone} setEditPhone={setEditPhone}
            editLocation={editLocation} setEditLocation={setEditLocation}
            saved={saved}
            onSave={handleEditSave}
            onClose={() => setShowEditModal(false)}
            fileInputRef={fileInputRef}
            onAvatarChange={handleAvatarChange}
          />
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

  // ─── Speech Bubble ───
  speechBubble: {
    position: 'absolute',
    top: '115px',
    left: '148px',
    zIndex: 10,
    backgroundColor: 'var(--bg-subtle)',
    borderRadius: '12px',
    padding: '8px 14px',
    maxWidth: '260px',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-sm)',
  },
  speechBubbleArrow: {
    position: 'absolute',
    left: '-8px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderTop: '8px solid transparent',
    borderBottom: '8px solid transparent',
    borderRight: '8px solid var(--bg-subtle)',
    zIndex: 2,
    filter: 'drop-shadow(-1px 0 1px var(--border))',
  },
  speechBubbleText: {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    wordBreak: 'break-word',
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

  // ─── Edit Modal Overlay ───
  editOverlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
    padding: '32px',
  },
  editBackdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'var(--overlay)',
    backdropFilter: 'blur(6px)',
    zIndex: 1,
  },
  editCard: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    backgroundColor: 'var(--bg-card)',
    borderRadius: '16px',
    boxShadow: '0 25px 60px -12px rgba(0,0,0,0.4)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  editHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '24px 28px 0',
    flexShrink: 0,
  },
  editTitle: {
    fontSize: 'var(--text-lg)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.3px',
  },
  editDesc: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  editCloseBtn: {
    width: '32px',
    height: '32px',
    borderRadius: 'var(--r-md)',
    backgroundColor: 'transparent',
    color: 'var(--text-muted)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'var(--t-fast)',
  },

  // ─── Edit Modal Body ───
  editBody: {
    padding: '24px 28px',
    overflowY: 'auto',
    flex: 1,
  },
  editAvatarSection: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '28px',
  },
  editAvatarWrapper: {
    position: 'relative',
    width: '88px',
    height: '88px',
  },
  editAvatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid var(--border)',
  },
  editAvatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: 'var(--emerald-bg)',
    color: 'var(--emerald-dark)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '30px',
    fontWeight: 700,
    border: '3px solid var(--emerald-border)',
  },
  editCameraBtn: {
    position: 'absolute',
    bottom: '0',
    right: '-2px',
    width: '30px',
    height: '30px',
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

  // ─── Edit Fields ───
  editFieldsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '18px',
  },
  editField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  editLabel: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  editInput: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontSize: 'var(--text-base)',
    outline: 'none',
    transition: 'var(--t-fast)',
    height: '40px',
  },
  editInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0 14px',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-input)',
    transition: 'var(--t-fast)',
    height: '40px',
  },
  editInputInner: {
    flex: 1,
    border: 'none',
    background: 'none',
    color: 'var(--text-primary)',
    fontSize: 'var(--text-base)',
    outline: 'none',
    padding: '0',
    height: '100%',
  },
  editTextarea: {
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
  editHelper: {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
    textAlign: 'right',
  },

  // ─── Edit Footer ───
  editFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    padding: '16px 28px 24px',
    borderTop: '1px solid var(--border)',
    flexShrink: 0,
  },
  editCancelBtn: {
    padding: '9px 20px',
    borderRadius: 'var(--r-md)',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    fontWeight: 600,
    fontSize: 'var(--text-base)',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    transition: 'var(--t-fast)',
  },
  editSaveBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 22px',
    borderRadius: 'var(--r-md)',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: 'var(--text-base)',
    border: 'none',
    cursor: 'pointer',
    transition: 'var(--t-fast)',
  },

  // ─── Select Component ───
  selectTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0 14px',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-input)',
    cursor: 'pointer',
    height: '40px',
    transition: 'var(--t-fast)',
  },
  selectDropdown: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    backgroundColor: 'var(--bg-card)',
    borderRadius: 'var(--r-lg)',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 100,
  },
  searchInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 10px',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-input)',
  },
  searchInput: {
    flex: 1,
    padding: '7px 0',
    border: 'none',
    background: 'none',
    color: 'var(--text-primary)',
    fontSize: 'var(--text-sm)',
    outline: 'none',
  },
  selectSectionLabel: {
    display: 'block',
    padding: '6px 14px 4px',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'var(--text-muted)',
  },
  optionPill: {
    padding: '4px 10px',
    borderRadius: 'var(--r-full)',
    border: 'none',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'var(--t-fast)',
  },
  optionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '8px 14px',
    border: 'none',
    background: 'none',
    fontSize: 'var(--text-sm)',
    cursor: 'pointer',
    textAlign: 'left',
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

// Responsive style injection for edit modal
const r = document.createElement('style');
r.textContent = `
  @media (max-width: 720px) {
    .em-edit-overlay { padding: 16px !important; }
    .em-fields-grid { grid-template-columns: 1fr !important; }
  }
`;
document.head.appendChild(r);
