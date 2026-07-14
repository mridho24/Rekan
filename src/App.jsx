import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CreateBoardModal from './components/CreateBoardModal';
import CreateProjectModal from './components/CreateProjectModal';
import './index.css';

// ─── Mock Data ──────────────────────────────────────────
const INITIAL_PROJECTS = [
  { id: 'proj-1', name: 'Project Kuliah', color: '#6366F1' },
  { id: 'proj-2', name: 'Project Kantor', color: '#10B981' },
  { id: 'proj-3', name: 'Personal Sandbox', color: '#F59E0B' }
];

const INITIAL_BOARDS = [
  {
    id: 'board-1',
    projectId: 'proj-1',
    name: 'Frontend Development',
    description: 'Tugas Akhir dan riset kelompok pengembangan web semester akhir.',
    color: '#6366F1',
    isPrivate: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'board-2',
    projectId: 'proj-2',
    name: 'Database Migration',
    description: 'Migrasi database ke PostgreSQL dan implementasi CI/CD pipeline.',
    color: '#10B981',
    isPrivate: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'board-3',
    projectId: 'proj-3',
    name: 'UI/UX Sandbox',
    description: 'Eksperimen UI baru dan uji coba framework JavaScript terbaru.',
    color: '#F59E0B',
    isPrivate: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Desain Database Schema',
    description: 'Merancang relasi antar tabel profiles, boards, lists, dan tasks.',
    priority: 'High',
    status: 'In Progress',
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    labels: ['Database', 'Perancangan']
  },
  {
    id: 'task-2',
    title: 'Slicing UI Login & Register',
    description: 'Membuat formulir validasi email dan password.',
    priority: 'Medium',
    status: 'To Do',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    labels: ['UI/UX', 'Frontend']
  },
  {
    id: 'task-3',
    title: 'Integrasi API Board CRUD',
    description: 'Menyambungkan frontend React ke Express API.',
    priority: 'High',
    status: 'To Do',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    labels: ['API', 'Frontend']
  },
  {
    id: 'task-4',
    title: 'Menyusun Bahan Presentasi',
    description: 'Slide untuk demo kemajuan mingguan.',
    priority: 'Low',
    status: 'Done',
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    labels: ['Dokumentasi']
  },
  {
    id: 'task-5',
    title: 'Review Pull Request',
    description: 'Tinjau dan merge PR dari branch feature/auth.',
    priority: 'Medium',
    status: 'In Progress',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    labels: ['Review']
  }
];

// ─── App Root ────────────────────────────────────────────
export default function App() {
  const [theme,             setTheme]             = useState('light');
  const [activeView,        setActiveView]        = useState('dashboard');
  const [projects,          setProjects]          = useState(INITIAL_PROJECTS);
  const [currentProjectId,  setCurrentProjectId]  = useState('all');
  const [boards,            setBoards]            = useState(INITIAL_BOARDS);
  const [tasks,             setTasks]             = useState(INITIAL_TASKS);
  const [isModalOpen,       setIsModalOpen]       = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingBoard,      setEditingBoard]      = useState(null);

  // Sync HTML background colour
  useEffect(() => {
    document.documentElement.style.backgroundColor =
      theme === 'dark' ? '#111827' : '#F9FAFB';
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  // Board CRUD handlers
  const handleOpenCreate = () => { setEditingBoard(null); setIsModalOpen(true); };
  const handleOpenEdit   = (board) => { setEditingBoard(board); setIsModalOpen(true); };

  const handleSaveBoard  = (data) => {
    if (editingBoard) {
      setBoards(bs => bs.map(b => b.id === editingBoard.id
        ? { ...b, ...data, updatedAt: new Date().toISOString() } : b));
    } else {
      // Map board to active project. If 'all', default to the first project or the one created.
      const activeProjId = currentProjectId === 'all' ? (projects[0]?.id || 'proj-1') : currentProjectId;
      setBoards(bs => [{
        id: `board-${Date.now()}`,
        projectId: activeProjId,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, ...bs]);
    }
  };

  const handleDeleteBoard = (id) => {
    if (window.confirm('Hapus board ini? Tindakan ini tidak dapat diurungkan.')) {
      setBoards(bs => bs.filter(b => b.id !== id));
    }
  };

  // Project creator handler
  const handleSaveProject = (data) => {
    const newProj = {
      id: `proj-${Date.now()}`,
      ...data
    };
    setProjects(prev => [...prev, newProj]);
    setCurrentProjectId(newProj.id);
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
            currentProjectId={currentProjectId}
            onSelectProject={setCurrentProjectId}
            onCreateBoard={handleOpenCreate}
            onEditBoard={handleOpenEdit}
            onDeleteBoard={handleDeleteBoard}
          />
        );
      case 'boards':
        return (
          <div style={styles.placeholder}>
            <h2 style={styles.placeholderTitle}>Boards</h2>
            <p style={styles.placeholderSub}>Halaman ini akan segera tersedia.</p>
          </div>
        );
      case 'tasks':
        return (
          <div style={styles.placeholder}>
            <h2 style={styles.placeholderTitle}>All Tasks</h2>
            <p style={styles.placeholderSub}>Halaman ini akan segera tersedia.</p>
          </div>
        );
      case 'search':
        return (
          <div style={styles.placeholder}>
            <h2 style={styles.placeholderTitle}>Search</h2>
            <p style={styles.placeholderSub}>Fitur pencarian akan segera tersedia.</p>
          </div>
        );
      default:
        return null;
    }
  };

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
};
