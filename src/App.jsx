import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CreateBoardModal from './components/CreateBoardModal';
import CreateProjectModal from './components/CreateProjectModal';
import { LogOut } from 'lucide-react';
import BoardPage from './components/BoardPage';
import TestimonialsPage from './components/TestimonialsPage';
import AllTasksPage from './components/AllTasksPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Pet from './components/Pet';
import ConfirmDialog from './components/ConfirmDialog';
import './index.css';

// ─── Mock Data ──────────────────────────────────────────
const INITIAL_PROJECTS = [
  { id: 'proj-1', name: 'Project Kuliah', color: '#6366F1', status: 'active' },
  { id: 'proj-2', name: 'Project Kantor', color: '#10B981', status: 'active' },
  { id: 'proj-3', name: 'Personal Sandbox', color: '#F59E0B', status: 'active' }
];

const INITIAL_BOARDS = [
  {
    id: 'board-1',
    projectId: 'proj-1',
    name: 'Frontend Development',
    description: 'Tugas Akhir dan riset kelompok pengembangan web semester akhir.',
    color: '#6366F1',
    status: 'inprogress',
    isPrivate: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'board-2',
    projectId: 'proj-2',
    name: 'Database Migration',
    description: 'Migrasi database ke PostgreSQL dan implementasi CI/CD pipeline.',
    color: '#10B981',
    status: 'todo',
    isPrivate: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'board-3',
    projectId: 'proj-3',
    name: 'UI/UX Sandbox',
    description: 'Eksperimen UI baru dan uji coba framework JavaScript terbaru.',
    color: '#F59E0B',
    status: 'done',
    isPrivate: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_TASKS = [
  {
    id: 'task-1',
    projectId: 'proj-1',
    boardId: 'board-1',
    title: 'Desain Database Schema',
    description: 'Merancang relasi antar tabel profiles, boards, lists, dan tasks.',
    priority: 'High',
    status: 'In Progress',
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    labels: ['Database', 'Perancangan'],
    subtasks: [
      { id: 'st-1', text: 'Buat ERD diagram', done: true },
      { id: 'st-2', text: 'Tentukan relasi foreign key', done: true },
      { id: 'st-3', text: 'Tulis migration SQL', done: false },
    ],
  },
  {
    id: 'task-2',
    projectId: 'proj-2',
    boardId: 'board-2',
    title: 'Slicing UI Login & Register',
    description: 'Membuat formulir validasi email dan password.',
    priority: 'Medium',
    status: 'To Do',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    labels: ['UI/UX', 'Frontend'],
    subtasks: [
      { id: 'st-4', text: 'Buat komponen form input', done: false },
      { id: 'st-5', text: 'Implementasi validasi client', done: false },
    ],
  },
  {
    id: 'task-3',
    projectId: 'proj-1',
    boardId: 'board-1',
    title: 'Integrasi API Board CRUD',
    description: 'Menyambungkan frontend React ke Express API.',
    priority: 'High',
    status: 'To Do',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    labels: ['API', 'Backend'],
    subtasks: [],
  },
  {
    id: 'task-4',
    projectId: 'proj-1',
    boardId: 'board-1',
    title: 'Menyusun Bahan Presentasi',
    description: 'Slide untuk demo kemajuan mingguan.',
    priority: 'Low',
    status: 'Done',
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    labels: ['Dokumentasi'],
    subtasks: [],
  },
  {
    id: 'task-5',
    projectId: 'proj-2',
    boardId: 'board-2',
    title: 'Review Pull Request',
    description: 'Tinjau dan merge PR dari branch feature/auth.',
    priority: 'Medium',
    status: 'In Progress',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    labels: ['Review'],
    subtasks: [
      { id: 'st-6', text: 'Review kode perubahan auth', done: true },
      { id: 'st-7', text: 'Cek potential security issue', done: false },
    ],
  }
];

// ─── App Root ────────────────────────────────────────────
export default function App() {
  const [theme,             setTheme]             = useState('light');
  const [isLoggedIn,        setIsLoggedIn]        = useState(() => localStorage.getItem('rekan_logged_in') === 'true');
  const [authPage,          setAuthPage]          = useState('register');
  const [activeView,        setActiveView]        = useState('dashboard');
  const [projects,          setProjects]          = useState(INITIAL_PROJECTS);
  const [currentProjectId,  setCurrentProjectId]  = useState('all');
  const [boards,            setBoards]            = useState(INITIAL_BOARDS);
  const [tasks,             setTasks]             = useState(INITIAL_TASKS);
  const [isModalOpen,       setIsModalOpen]       = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingBoard,      setEditingBoard]      = useState(null);
  const [completionTrigger, setCompletionTrigger] = useState(0);
  const [activityLog, setActivityLog] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState(null);

  const handleLogin = (userData) => {
    localStorage.setItem('rekan_logged_in', 'true');
    if (userData?.name) localStorage.setItem('rekan_user_name', userData.name);
    if (userData?.email) localStorage.setItem('rekan_user_email', userData.email);
    setIsLoggedIn(true);
  };

  const handleLogoutClick = () => setShowLogoutConfirm(true);

  const handleLogoutConfirm = () => {
    localStorage.removeItem('rekan_logged_in');
    setShowLogoutConfirm(false);
    setIsLoggedIn(false);
  };

  const handleRegister = (userData) => {
    localStorage.setItem('rekan_logged_in', 'true');
    localStorage.setItem('rekan_user_name', userData.name);
    localStorage.setItem('rekan_user_email', userData.email);
    setIsLoggedIn(true);
  };

  const handleUpdateTasks = (updater) => {
    setTasks(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const newActivity = [];

      next.forEach(t => {
        const prevTask = prev.find(pt => pt.id === t.id);
        const isNewlyDone = t.status === 'Done' && (!prevTask || prevTask.status !== 'Done');
        if (isNewlyDone) {
          newActivity.push({ type: 'task_done', title: t.title, timestamp: new Date().toISOString() });
        } else if (prevTask && prevTask.status === 'Done' && t.status !== 'Done') {
          newActivity.push({ type: 'task_uncompleted', title: t.title, timestamp: new Date().toISOString() });
        }
      });

      prev.forEach(pt => {
        if (!next.find(nt => nt.id === pt.id)) {
          newActivity.push({ type: 'task_deleted', title: pt.title, timestamp: new Date().toISOString() });
        }
      });

      next.forEach(t => {
        if (!prev.find(pt => pt.id === t.id)) {
          newActivity.push({ type: 'task_created', title: t.title, timestamp: new Date().toISOString() });
        }
      });

      if (newActivity.length > 0) {
        setActivityLog(log => [...newActivity.map(a => ({ ...a, id: Date.now() + Math.random() })), ...log].slice(0, 50));
      }

      const prevDone = prev.filter(t => t.status === 'Done').length;
      const withCompletedAt = next.map(t => {
        const prevTask = prev.find(pt => pt.id === t.id);
        if (t.status === 'Done' && (!prevTask || prevTask.status !== 'Done')) {
          setCompletionTrigger(c => c + 1);
          return { ...t, completedAt: new Date().toISOString() };
        }
        return t;
      });
      const nextDone = withCompletedAt.filter(t => t.status === 'Done').length;
      if (nextDone > prevDone) {
        setCompletionTrigger(c => c + 1);
      }
      return withCompletedAt;
    });
  };

  // Sync HTML background colour
  useEffect(() => {
    document.documentElement.style.backgroundColor =
      theme === 'dark' ? '#000000' : '#F9FAFB';
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  // Board CRUD handlers
  const handleOpenCreate = () => { setEditingBoard(null); setIsModalOpen(true); };
  const handleOpenEdit   = (board) => { setEditingBoard(board); setIsModalOpen(true); };

  const handleSaveBoard  = (data) => {
    if (editingBoard) {
      setBoards(bs => bs.map(b => b.id === editingBoard.id
        ? { ...b, ...data.board ?? data, updatedAt: new Date().toISOString() } : b));
    } else {
      const activeProjId = currentProjectId === 'all' ? (projects[0]?.id || 'proj-1') : currentProjectId;
      const boardId = `board-${Date.now()}`;
      const boardData = data.board ?? data;
      setBoards(bs => [{
        id: boardId,
        projectId: activeProjId,
        ...boardData,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, ...bs]);

      if (data.tasks?.length > 0) {
        setTasks(prev => [
          ...data.tasks.map((t, i) => ({
            id: `task-${Date.now()}-${i}`,
            projectId: activeProjId,
            boardId,
            title: t.title,
            description: null,
            priority: 'Medium',
            status: 'To Do',
            deadline: null,
            labels: [],
            subtasks: (t.subtasks || []).filter(st => st.text.trim()).map((st, j) => ({
              id: `st-${Date.now()}-${i}-${j}`,
              text: st.text.trim(),
              done: false,
            })),
          })),
          ...prev,
        ]);
      }
    }
  };

  const handleUpdateBoards = (updater) => {
    setBoards(prev => typeof updater === 'function' ? updater(prev) : updater);
  };

  const handleDeleteBoard = (id) => {
    setBoardToDelete(id);
  };

  const confirmDeleteBoard = () => {
    if (boardToDelete) {
      setBoards(bs => bs.filter(b => b.id !== boardToDelete));
      setTasks(prev => prev.filter(t => t.boardId !== boardToDelete));
      setBoardToDelete(null);
    }
  };

  // Project creator handler
  const handleSaveProject = (data) => {
    const newProj = {
      id: `proj-${Date.now()}`,
      ...data,
      status: 'active',
    };
    setProjects(prev => [...prev, newProj]);
    setCurrentProjectId(newProj.id);
    setActiveView('boards');
  };

  const handleDeleteProject = (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setBoards(prev => prev.filter(b => b.projectId !== projectId));
    setTasks(prev => prev.filter(t => t.projectId !== projectId));
    if (currentProjectId === projectId) {
      setCurrentProjectId('all');
    }
  };

  const handleCompleteProject = (projectId) => {
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, status: 'completed' } : p
    ));
  };

  // Content area
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            boards={boards}
            tasks={tasks}
            projects={projects}
            activityLog={activityLog}
            currentProjectId={currentProjectId}
            onSelectProject={setCurrentProjectId}
            onCreateBoard={handleOpenCreate}
            onEditBoard={handleOpenEdit}
            onDeleteBoard={handleDeleteBoard}
            onAddProject={() => setIsProjectModalOpen(true)}
          />
        );
      case 'boards':
        return (
          <BoardPage
            tasks={tasks}
            onUpdateTasks={handleUpdateTasks}
            boards={boards}
            onUpdateBoards={handleUpdateBoards}
            projects={projects}
            currentProjectId={currentProjectId}
            onSelectProject={setCurrentProjectId}
            onCreateBoard={handleOpenCreate}
            onCompleteProject={handleCompleteProject}
            onAddProject={() => setIsProjectModalOpen(true)}
            onDeleteProject={handleDeleteProject}
            onDeleteBoard={handleDeleteBoard}
            onUpdateProjects={setProjects}
          />
        );
      case 'tasks':
        return (
          <AllTasksPage
            tasks={tasks}
            boards={boards}
            projects={projects}
          />
        );
      case 'search':
        return (
          <div style={styles.placeholder}>
            <h2 style={styles.placeholderTitle}>Search</h2>
            <p style={styles.placeholderSub}>Fitur pencarian akan segera tersedia.</p>
          </div>
        );
      case 'testimonials':
        return <TestimonialsPage />;
      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={`app-root ${theme}-theme`} style={{ minHeight: '100vh' }}>
        {authPage === 'login' ? (
          <LoginPage
            onLogin={handleLogin}
            theme={theme}
            onToggleTheme={toggleTheme}
            onSwitchToRegister={() => setAuthPage('register')}
          />
        ) : (
          <RegisterPage
            onRegister={handleRegister}
            theme={theme}
            onToggleTheme={toggleTheme}
            onSwitchToLogin={() => setAuthPage('login')}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`app-root ${theme}-theme`}>
      {/* Left Sidebar */}
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        theme={theme}
        onToggleTheme={toggleTheme}
        projects={projects}
        currentProjectId={currentProjectId}
        onSelectProject={setCurrentProjectId}
        onCreateProjectClick={() => setIsProjectModalOpen(true)}
        onDeleteProject={handleDeleteProject}
        onLogout={handleLogoutClick}
      />

      {/* Main scrollable content */}
      <main style={styles.main}>
        {renderContent()}
      </main>

      {/* Create / Edit Board Modal */}
      <CreateBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBoard}
        board={editingBoard}
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
      />

      {/* Pet Companion */}
      <Pet theme={theme} completionTrigger={completionTrigger} />

      {/* Logout Confirmation */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div style={styles.confirmOverlay}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              style={styles.confirmBackdrop}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
              style={styles.confirmDialog}
            >
              <div style={styles.confirmIcon}>
                <LogOut size={22} />
              </div>
              <h3 style={styles.confirmTitle}>Keluar Aplikasi</h3>
              <p style={styles.confirmMsg}>Apakah Anda yakin ingin keluar? Anda harus masuk lagi untuk mengakses aplikasi.</p>
              <div style={styles.confirmActions}>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  style={styles.confirmCancel}
                >
                  Tidak
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  style={styles.confirmYes}
                >
                  Ya, Keluar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Delete Board Confirmation */}
      <ConfirmDialog
        isOpen={!!boardToDelete}
        onClose={() => setBoardToDelete(null)}
        onConfirm={confirmDeleteBoard}
        title="Hapus Board"
        message={
          (() => {
            const targetBoard = boards.find(b => b.id === boardToDelete);
            return targetBoard 
              ? `Apakah Anda yakin ingin menghapus board "${targetBoard.name}"? Semua tugas di dalamnya juga akan ikut terhapus.`
              : 'Apakah Anda yakin ingin menghapus board ini? Tindakan ini tidak dapat diurungkan.';
          })()
        }
        confirmText="Ya, Hapus"
        cancelText="Batal"
        danger
      />
    </div>
  );
}

const styles = {
  main: {
    flexGrow: 1,
    overflowY: 'auto',
    minWidth: 0,
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '60vh',
    gap: '8px',
    padding: '40px',
  },
  placeholderTitle: {
    fontSize: 'var(--text-xl)',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  placeholderSub: {
    fontSize: 'var(--text-base)',
    color: 'var(--text-muted)',
  },

  // Logout Confirm Modal
  confirmOverlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '16px',
  },
  confirmBackdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
    zIndex: 1,
  },
  confirmDialog: {
    position: 'relative',
    zIndex: 2,
    backgroundColor: 'var(--bg-card)',
    borderRadius: 'var(--r-xl)',
    width: '100%',
    maxWidth: '380px',
    padding: '28px 24px 20px',
    textAlign: 'center',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
    border: '1px solid var(--border)',
  },
  confirmIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'var(--peach)',
    color: 'var(--danger)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 14px',
  },
  confirmTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '6px',
    letterSpacing: '-0.3px',
  },
  confirmMsg: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
    marginBottom: '20px',
  },
  confirmActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  confirmCancel: {
    padding: '9px 20px',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px',
    transition: 'var(--t-fast)',
  },
  confirmYes: {
    padding: '9px 20px',
    borderRadius: 'var(--r-md)',
    border: 'none',
    backgroundColor: 'var(--danger)',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '14px',
    transition: 'var(--t-fast)',
  },
};
