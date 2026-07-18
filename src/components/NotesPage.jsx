import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Trash2, Search as SearchIcon } from 'lucide-react';

const STORAGE_KEY = 'rekan_notes';

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function formatDate(iso) {
  const d = new Date(iso);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]}, ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function NotesPage() {
  const [notes, setNotes] = useState(loadNotes);
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeId) || null;

  const filteredNotes = search
    ? notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()))
    : notes;

  const createNote = () => {
    const note = {
      id: `note-${Date.now()}`,
      title: 'Catatan Baru',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [note, ...prev]);
    setActiveId(note.id);
  };

  const updateNote = (id, field, value) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, [field]: value, updatedAt: new Date().toISOString() } : n
    ));
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeId === id) setActiveId(null);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.h1}>
          <FileText size={20} /> Catatan
        </h1>
        <p style={styles.subtitle}>{notes.length} catatan</p>
      </div>

      <div style={styles.twoCol}>
        {/* Sidebar notes list */}
        <div style={styles.listCol}>
          <div style={styles.listToolbar}>
            <div style={styles.searchWrap}>
              <SearchIcon size={13} color="var(--text-muted)" />
              <input
                style={styles.searchInput}
                placeholder="Cari catatan..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button style={styles.addBtn} onClick={createNote} title="Catatan Baru">
              <Plus size={15} />
            </button>
          </div>

          <div style={styles.noteList}>
            {filteredNotes.length === 0 ? (
              <div style={styles.emptyList}>
                <FileText size={24} color="var(--text-muted)" />
                <p style={styles.emptyText}>
                  {search ? 'Tidak ada catatan yang cocok' : 'Belum ada catatan'}
                </p>
              </div>
            ) : (
              filteredNotes.map(note => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    ...styles.noteItem,
                    backgroundColor: activeId === note.id ? 'var(--emerald-bg)' : 'transparent',
                    borderColor: activeId === note.id ? 'var(--emerald)' : 'transparent',
                  }}
                  onClick={() => setActiveId(note.id)}
                >
                  <div style={styles.noteItemContent}>
                    <span style={styles.noteItemTitle}>{note.title}</span>
                    <span style={styles.noteItemDate}>{formatDate(note.updatedAt || note.createdAt)}</span>
                  </div>
                  <button
                    style={styles.noteItemDelete}
                    onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                    title="Hapus"
                  >
                    <Trash2 size={12} />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Editor */}
        <div style={styles.editorCol}>
          {activeNote ? (
            <div style={styles.editor}>
              <input
                style={styles.titleInput}
                value={activeNote.title}
                onChange={e => updateNote(activeNote.id, 'title', e.target.value)}
                placeholder="Judul catatan..."
              />
              <textarea
                style={styles.contentInput}
                value={activeNote.content}
                onChange={e => updateNote(activeNote.id, 'content', e.target.value)}
                placeholder="Mulai menulis..."
              />
              <div style={styles.editorFooter}>
                <span style={styles.editorDate}>
                  Dibuat: {formatDate(activeNote.createdAt)}
                  {activeNote.updatedAt !== activeNote.createdAt && ` · Diubah: ${formatDate(activeNote.updatedAt)}`}
                </span>
              </div>
            </div>
          ) : (
            <div style={styles.emptyEditor}>
              <FileText size={40} color="var(--text-muted)" />
              <p style={styles.emptyEditorText}>Pilih catatan atau buat baru</p>
              <button style={styles.emptyEditorBtn} onClick={createNote}>
                <Plus size={14} /> Catatan Baru
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: '32px 36px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '1100px',
    margin: '0 auto',
    width: '100%',
    height: 'calc(100vh - 64px)',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  h1: {
    fontSize: 'var(--text-2xl)',
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: '-0.8px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  subtitle: {
    fontSize: 'var(--text-base)',
    color: 'var(--text-muted)',
  },
  twoCol: {
    display: 'flex',
    gap: '20px',
    flex: 1,
    overflow: 'hidden',
    alignItems: 'stretch',
  },
  listCol: {
    flex: '0 0 280px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  listToolbar: {
    display: 'flex',
    gap: '8px',
  },
  searchWrap: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 10px',
    backgroundColor: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-md)',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'none',
    outline: 'none',
    fontSize: 'var(--text-sm)',
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
  },
  addBtn: {
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    background: 'var(--bg-card)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'var(--t-fast)',
  },
  noteList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
    overflowY: 'auto',
  },
  noteItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    borderRadius: 'var(--r-md)',
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: 'background-color 0.12s',
  },
  noteItemContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    overflow: 'hidden',
  },
  noteItemTitle: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  noteItemDate: {
    fontSize: '10px',
    color: 'var(--text-muted)',
  },
  noteItemDelete: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--r-sm)',
    border: 'none',
    background: 'transparent',
    color: '#EF4444',
    cursor: 'pointer',
    opacity: 0.5,
    flexShrink: 0,
    transition: 'opacity 0.12s',
  },
  emptyList: {
    padding: '32px 16px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  emptyText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
  },
  editorCol: {
    flex: 1,
    display: 'flex',
  },
  editor: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-lg)',
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden',
  },
  titleInput: {
    padding: '16px 20px 8px',
    border: 'none',
    background: 'none',
    outline: 'none',
    fontSize: 'var(--text-lg)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
  },
  contentInput: {
    flex: 1,
    padding: '8px 20px 16px',
    border: 'none',
    background: 'none',
    outline: 'none',
    fontSize: 'var(--text-base)',
    color: 'var(--text-secondary)',
    fontFamily: 'inherit',
    lineHeight: 1.7,
    resize: 'none',
  },
  editorFooter: {
    padding: '10px 20px',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  editorDate: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  emptyEditor: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    backgroundColor: 'var(--bg-card)',
    border: '1px dashed var(--border)',
    borderRadius: 'var(--r-lg)',
  },
  emptyEditorText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
  },
  emptyEditorBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--border)',
    background: 'var(--bg-card)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    transition: 'var(--t-fast)',
  },
};
