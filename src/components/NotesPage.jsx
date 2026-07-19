import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import {
  FileText, Plus, Trash2, Search as SearchIcon,
  Pin, Tag, Clock, BookOpen,
  Bold, Italic, Heading, List, ListOrdered, Quote, Code, Image, Link, Table as TableIcon,
  Undo, Redo, CheckSquare, Minus, Strikethrough, Underline as UnderlineIcon,
} from 'lucide-react';

const STORAGE_KEY = 'rekan_notes';

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Baru saja';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m lalu`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}j lalu`;
  return `${d.getDate()} ${months[d.getMonth()]}, ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function wordCount(text) {
  const t = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return t ? t.split(/\s+/).length : 0;
}

function readingTime(text) {
  return Math.max(1, Math.ceil(wordCount(text) / 200));
}

function stripHtml(html) {
  const d = document.createElement('div');
  d.innerHTML = html;
  return d.textContent || d.innerText || '';
}

const hoverStyle = document.createElement('style');
hoverStyle.textContent = `
  .ns-btn:hover { background-color: var(--bg-card-hover) !important; }
  .ns-btn:focus-visible { outline: 2px solid var(--text-primary); outline-offset: 2px; border-radius: 8px; }
  .ns-note-card { transition: transform 0.12s ease, background-color 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease; }
  .ns-note-card:hover { transform: translateY(-1px); background-color: var(--bg-subtle) !important; border-color: var(--border-strong) !important; box-shadow: 0 1px 4px rgba(0,0,0,0.06) !important; }
  .ns-note-card:focus-visible { outline: 2px solid var(--text-primary); outline-offset: 2px; border-radius: 10px; }
  .ns-new-btn:hover { background-color: #1F2937 !important; }
  .ns-delete-btn:hover { opacity: 1 !important; background-color: var(--peach) !important; }
  .ns-editor h1 { font-size: 1.8em; font-weight: 700; margin: 0.5em 0 0.3em; line-height: 1.3; }
  .ns-editor h2 { font-size: 1.5em; font-weight: 700; margin: 0.5em 0 0.3em; line-height: 1.3; }
  .ns-editor h3 { font-size: 1.25em; font-weight: 600; margin: 0.4em 0 0.2em; line-height: 1.3; }
  .ns-editor p { margin: 0.3em 0; line-height: 1.8; }
  .ns-editor ul, .ns-editor ol { padding-left: 1.5em; margin: 0.3em 0; }
  .ns-editor li { margin: 0.15em 0; line-height: 1.7; }
  .ns-editor blockquote { border-left: 3px solid var(--border-strong); margin: 0.5em 0; padding: 0.3em 1em; color: var(--text-muted); font-style: italic; }
  .ns-editor pre { background: var(--bg-card-hover); border-radius: 8px; padding: 12px 16px; font-family: 'JetBrains Mono', monospace; font-size: 13px; overflow-x: auto; margin: 0.5em 0; }
  .ns-editor code { background: var(--bg-card-hover); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; font-family: 'JetBrains Mono', monospace; }
  .ns-editor hr { border: none; border-top: 1px solid var(--border); margin: 1em 0; }
  .ns-editor a { color: #2563EB; text-decoration: underline; cursor: pointer; }
  .ns-editor a:hover { color: #1D4ED8; }
  .ns-editor img { max-width: 100%; border-radius: 8px; margin: 0.5em 0; }
  .ns-editor table { width: 100%; border-collapse: collapse; margin: 0.5em 0; }
  .ns-editor th, .ns-editor td { border: 1px solid var(--border); padding: 8px 12px; text-align: left; min-width: 80px; }
  .ns-editor th { background: var(--bg-subtle); font-weight: 600; }
  .ns-editor ul[data-type="taskList"] { list-style: none; padding-left: 0; }
  .ns-editor ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 8px; }
  .ns-editor ul[data-type="taskList"] li label { flex-shrink: 0; margin-top: 4px; }
  .ns-editor ul[data-type="taskList"] li label input[type="checkbox"] { width: 16px; height: 16px; cursor: pointer; accent-color: var(--text-primary); }
  .ns-editor ul[data-type="taskList"] li div { flex: 1; }
  .ns-editor p.is-editor-empty:first-child::before { color: var(--text-muted); content: attr(data-placeholder); float: left; height: 0; pointer-events: none; }
  .ns-toolbar-btn.is-active { background-color: var(--border) !important; color: var(--text-primary) !important; }
`;
document.head.appendChild(hoverStyle);

function ToolbarBtn({ icon: Icon, action, isActive, title }) {
  return (
    <button
      type="button"
      className={`ns-toolbar-btn${isActive ? ' is-active' : ''}`}
      onClick={action}
      title={title}
      style={{
        width: '28px', height: '28px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', borderRadius: '6px', border: 'none',
        background: 'transparent', color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'background-color 0.12s, color 0.12s',
      }}
    >
      <Icon size={14} />
    </button>
  );
}

function Divider() {
  return <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border)', margin: '0 4px', flexShrink: 0 }} />;
}

export default function NotesPage() {
  const [notes, setNotes] = useState(loadNotes);
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);

  useEffect(() => { saveNotes(notes); }, [notes]);

  const activeNote = notes.find(n => n.id === activeId) || null;

  const filteredNotes = notes.filter(n => {
    return !search || n.title.toLowerCase().includes(search.toLowerCase()) || stripHtml(n.content).toLowerCase().includes(search.toLowerCase());
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: { depth: 50 },
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      LinkExtension.configure({ openOnClick: true }),
      ImageExtension,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder: 'Mulai menulis...' }),
      HorizontalRule,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      if (activeId) {
        const html = editor.getHTML();
        setNotes(prev => prev.map(n =>
          n.id === activeId ? { ...n, content: html, updatedAt: new Date().toISOString() } : n
        ));
      }
    },
  });

  useEffect(() => {
    if (editor && activeNote) {
      const currentHtml = editor.getHTML();
      if (currentHtml !== activeNote.content) {
        editor.commands.setContent(activeNote.content || '');
      }
    }
  }, [activeId]);

  useEffect(() => {
    if (!editor) return;
    const handler = (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        createNote();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [editor]);

  const createNote = useCallback(() => {
    const note = {
      id: `note-${Date.now()}`,
      title: '',
      content: '',
      pinned: false,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [note, ...prev]);
    setActiveId(note.id);
  }, []);

  const updateNoteField = useCallback((id, field, value) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, [field]: value, updatedAt: new Date().toISOString() } : n
    ));
  }, []);

  const deleteNote = useCallback((id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeId === id) setActiveId(null);
  }, [activeId]);

  const togglePin = useCallback((id) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, pinned: !n.pinned, updatedAt: new Date().toISOString() } : n
    ));
  }, []);

  const addTag = useCallback((id, tag) => {
    const note = notes.find(n => n.id === id);
    if (note && !(note.tags || []).includes(tag)) {
      updateNoteField(id, 'tags', [...(note.tags || []), tag]);
    }
  }, [notes, updateNoteField]);

  const removeTag = useCallback((id, tag) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      updateNoteField(id, 'tags', (note.tags || []).filter(t => t !== tag));
    }
  }, [notes, updateNoteField]);

  const addLink = useCallback(() => {
    if (!editor || !linkUrl) return;
    const selected = editor.state.selection;
    if (selected.empty) {
      editor.chain().focus().setLink({ href: linkUrl }).insertContent(linkUrl).run();
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
    setLinkUrl('');
    setShowLinkDialog(false);
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Masukkan URL gambar:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const wc = activeNote ? wordCount(activeNote.content || '') : 0;
  const rt = activeNote ? readingTime(activeNote.content || '') : 0;

  return (
    <div style={s.page}>
      <div style={s.twoCol}>
        {/* ═══════════ SIDEBAR: SEARCH + NEW NOTE + NOTE LIST ═══════════ */}
        <div style={s.sidebar}>
          <div style={s.sidebarSticky}>
            <div style={s.searchWrap}>
              <SearchIcon size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              <input
                style={s.searchInput}
                placeholder="Cari catatan..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <button type="button" className="ns-new-btn" onClick={createNote} style={s.newBtn}>
              <Plus size={15} /> New Note
            </button>
          </div>

          <div style={s.noteList}>
            {filteredNotes.length === 0 ? (
              <div style={s.emptyList}>
                <span style={s.emptyIcon}>📝</span>
                <p style={s.emptyTitle}>No notes yet</p>
                <p style={s.emptySub}>Create your first note.</p>
              </div>
            ) : (
              sortedNotes.map(note => {
                const isActive = activeId === note.id;
                return (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ns-note-card"
                    onClick={() => setActiveId(note.id)}
                    style={{
                      ...s.noteCard,
                      borderColor: isActive ? 'var(--text-primary)' : 'var(--bg-card-hover)',
                      backgroundColor: isActive ? 'var(--bg-subtle)' : 'var(--bg-card)',
                      boxShadow: isActive ? '0 1px 4px var(--border)' : 'none',
                    }}
                  >
                    <div style={{ ...s.noteCardTitle, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {note.pinned && <Pin size={10} style={{ flexShrink: 0 }} />}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note.title || 'Untitled'}</span>
                    </div>
                    <div style={s.noteCardPreview}>
                      {stripHtml(note.content || '') || 'No content'}
                    </div>
                    <div style={s.noteCardTime}>
                      Edited {formatDate(note.updatedAt || note.createdAt)}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* ═══════════ EDITOR ═══════════ */}
        <div style={s.editorCol}>
          {activeNote ? (
            <div style={s.editorWrap}>
              {/* Title */}
              <input
                style={s.titleInput}
                value={activeNote.title}
                onChange={e => updateNoteField(activeNote.id, 'title', e.target.value)}
                placeholder="Judul catatan..."
              />

              {/* Metadata */}
              <div style={s.metaRow}>
                <span style={s.metaItem}><Clock size={11} /> {formatDate(activeNote.updatedAt)}</span>
                <span style={s.metaItem}><BookOpen size={11} /> {wc} kata</span>
                <span style={s.metaItem}>{rt} mnt baca</span>
                <div style={{ flex: 1 }} />
                <button
                  type="button"
                  className="ns-btn"
                  onClick={() => togglePin(activeNote.id)}
                  style={{ ...s.metaAction, color: activeNote.pinned ? 'var(--text-primary)' : 'var(--text-muted)' }}
                >
                  <Pin size={11} /> {activeNote.pinned ? 'Disematkan' : 'Sematan'}
                </button>
                <button
                  type="button"
                  className="ns-delete-btn"
                  onClick={() => deleteNote(activeNote.id)}
                  style={s.metaDelete}
                >
                  <Trash2 size={11} /> Hapus
                </button>
              </div>

              {/* Toolbar */}
              <div style={s.toolbar}>
                <ToolbarBtn icon={Bold} action={() => editor?.chain().focus().toggleBold().run()} isActive={editor?.isActive('bold')} title="Tebal (Ctrl+B)" />
                <ToolbarBtn icon={Italic} action={() => editor?.chain().focus().toggleItalic().run()} isActive={editor?.isActive('italic')} title="Miring (Ctrl+I)" />
                <ToolbarBtn icon={UnderlineIcon} action={() => editor?.chain().focus().toggleUnderline().run()} isActive={editor?.isActive('underline')} title="Garis bawah" />
                <ToolbarBtn icon={Strikethrough} action={() => editor?.chain().focus().toggleStrike().run()} isActive={editor?.isActive('strike')} title="Coret" />
                <Divider />
                <ToolbarBtn icon={Heading} action={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor?.isActive('heading', { level: 2 })} title="Heading" />
                <Divider />
                <ToolbarBtn icon={List} action={() => editor?.chain().focus().toggleBulletList().run()} isActive={editor?.isActive('bulletList')} title="Daftar" />
                <ToolbarBtn icon={ListOrdered} action={() => editor?.chain().focus().toggleOrderedList().run()} isActive={editor?.isActive('orderedList')} title="Daftar nomor" />
                <ToolbarBtn icon={CheckSquare} action={() => editor?.chain().focus().toggleTaskList().run()} isActive={editor?.isActive('taskList')} title="Checklist" />
                <Divider />
                <ToolbarBtn icon={Quote} action={() => editor?.chain().focus().toggleBlockquote().run()} isActive={editor?.isActive('blockquote')} title="Kutipan" />
                <ToolbarBtn icon={Code} action={() => editor?.chain().focus().toggleCodeBlock().run()} isActive={editor?.isActive('codeBlock')} title="Kode" />
                <Divider />
                <ToolbarBtn icon={Minus} action={() => editor?.chain().focus().setHorizontalRule().run()} isActive={false} title="Garis horizontal" />
                <ToolbarBtn icon={Link} action={() => setShowLinkDialog(true)} isActive={editor?.isActive('link')} title="Tautan (Ctrl+K)" />
                <ToolbarBtn icon={Image} action={addImage} isActive={false} title="Gambar" />
                <ToolbarBtn icon={TableIcon} action={addTable} isActive={false} title="Tabel" />
                <div style={{ flex: 1 }} />
                <ToolbarBtn icon={Undo} action={() => editor?.chain().focus().undo().run()} isActive={false} title="Undo (Ctrl+Z)" />
                <ToolbarBtn icon={Redo} action={() => editor?.chain().focus().redo().run()} isActive={false} title="Redo (Ctrl+Shift+Z)" />
              </div>

              {/* Link Dialog */}
              {showLinkDialog && (
                <div style={s.linkDialog}>
                  <input
                    style={s.linkInput}
                    placeholder="https://..."
                    value={linkUrl}
                    onChange={e => setLinkUrl(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') addLink(); if (e.key === 'Escape') setShowLinkDialog(false); }}
                    autoFocus
                  />
                  <button type="button" className="ns-btn" onClick={addLink} style={s.linkBtn}>Tambahkan</button>
                  <button type="button" className="ns-btn" onClick={() => setShowLinkDialog(false)} style={s.linkCancel}>Batal</button>
                </div>
              )}

              {/* Editor */}
              <div className="ns-editor" style={s.editorContent}>
                <EditorContent editor={editor} />
              </div>

              {/* Tags */}
              <div style={s.tagsRow}>
                <Tag size={11} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                {(activeNote.tags || []).map(tag => (
                  <span key={tag} style={s.editorTag}>
                    {tag}
                    <button type="button" onClick={() => removeTag(activeNote.id, tag)} style={s.editorTagRemove}>×</button>
                  </span>
                ))}
                <input
                  style={s.tagInputField}
                  placeholder="Tambah tag..."
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && tagInput.trim()) {
                      addTag(activeNote.id, tagInput.trim());
                      setTagInput('');
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <div style={s.emptyEditor}>
              <div style={s.emptyIconBox}><FileText size={28} color="var(--border-strong)" /></div>
              <p style={s.emptyTitle}>Pilih catatan</p>
              <p style={s.emptyText}>Pilih catatan dari daftar atau buat catatan baru untuk mulai menulis.</p>
              <button type="button" className="ns-new-btn" onClick={createNote} style={{ ...s.newBtn, marginTop: '12px', maxWidth: '200px' }}>
                <Plus size={14} /> Catatan Baru
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    padding: '24px 32px', height: 'calc(100vh - 64px)',
    display: 'flex', flexDirection: 'column',
  },
  twoCol: {
    display: 'flex', gap: '20px', flex: 1, overflow: 'hidden', alignItems: 'stretch',
  },

  // ─── SIDEBAR: SEARCH + NEW NOTE + NOTE LIST ───
  sidebar: {
    flex: '0 0 300px', display: 'flex', flexDirection: 'column',
    minWidth: 0, gap: '0',
  },
  sidebarSticky: {
    display: 'flex', flexDirection: 'column', gap: '8px',
    paddingBottom: '10px', flexShrink: 0,
  },
  searchWrap: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '8px 12px', borderRadius: '999px',
    border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)',
  },
  searchInput: {
    flex: 1, border: 'none', background: 'none', outline: 'none',
    fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'inherit',
  },
  newBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    padding: '9px', borderRadius: '999px', border: 'none',
    backgroundColor: 'var(--text-primary)', color: 'var(--bg-card)',
    cursor: 'pointer', fontSize: '13px', fontWeight: 600,
    fontFamily: 'inherit', transition: 'background-color 0.12s',
  },
  noteList: {
    flex: 1, overflowY: 'auto',
    display: 'flex', flexDirection: 'column', gap: '4px',
  },
  noteCard: {
    padding: '10px 12px', borderRadius: '10px',
    border: '1.5px solid var(--bg-card-hover)',
    cursor: 'pointer',
    display: 'flex', flexDirection: 'column', gap: '3px',
  },
  noteCardTitle: {
    fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  noteCardPreview: {
    fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0,
    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  noteCardTime: {
    fontSize: '10px', color: 'var(--text-muted)', fontWeight: 500, marginTop: '1px',
  },
  emptyList: {
    padding: '40px 16px', textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
  },
  emptyIcon: { fontSize: '32px', lineHeight: 1 },
  emptyTitle: { fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 },
  emptySub: { fontSize: '12px', color: 'var(--text-muted)', margin: 0 },

  // ─── EDITOR ───
  editorCol: { flex: '2 1 400px', minWidth: 0, display: 'flex' },
  editorWrap: {
    flex: 1, display: 'flex', flexDirection: 'column',
    backgroundColor: 'var(--bg-card)', borderRadius: '16px',
    border: '1px solid var(--border)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden',
  },
  titleInput: {
    padding: '24px 28px 4px', border: 'none', background: 'none',
    outline: 'none', fontSize: '22px', fontWeight: 700,
    color: 'var(--text-primary)', fontFamily: 'inherit',
  },
  metaRow: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '8px 28px 12px', flexWrap: 'wrap',
    borderBottom: '1px solid var(--border)',
  },
  metaItem: {
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500,
  },
  metaAction: {
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    padding: '3px 8px', borderRadius: '6px', border: 'none',
    background: 'transparent', cursor: 'pointer', fontSize: '11px', fontWeight: 600,
    fontFamily: 'inherit', transition: 'background-color 0.12s',
  },
  metaDelete: {
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    padding: '3px 8px', borderRadius: '6px', border: 'none',
    background: 'transparent', color: 'var(--danger)', cursor: 'pointer',
    fontSize: '11px', fontWeight: 600, fontFamily: 'inherit',
    opacity: 0.5, transition: 'opacity 0.12s, background-color 0.12s',
  },
  toolbar: {
    display: 'flex', alignItems: 'center', gap: '2px',
    padding: '6px 16px', borderBottom: '1px solid var(--border)',
    backgroundColor: 'var(--bg-subtle)', flexWrap: 'wrap',
    position: 'sticky', top: 0, zIndex: 10,
  },
  editorContent: {
    flex: 1, padding: '8px 28px 24px', overflowY: 'auto',
    fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.8,
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
    outline: 'none',
  },
  tagsRow: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '10px 28px 16px', flexWrap: 'wrap',
    borderTop: '1px solid var(--border)',
  },
  editorTag: {
    display: 'inline-flex', alignItems: 'center', gap: '3px',
    padding: '2px 8px', borderRadius: '999px',
    backgroundColor: 'var(--bg-card-hover)', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600,
  },
  editorTagRemove: {
    background: 'none', border: 'none', color: 'var(--text-muted)',
    cursor: 'pointer', padding: 0, fontSize: '13px', lineHeight: 1,
  },
  tagInputField: {
    border: 'none', background: 'none', outline: 'none',
    fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'inherit',
    flex: 1, minWidth: '80px',
  },

  // Link Dialog
  linkDialog: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 28px', backgroundColor: 'var(--bg-subtle)',
    borderBottom: '1px solid var(--border)',
  },
  linkInput: {
    flex: 1, padding: '6px 10px', borderRadius: '6px',
    border: '1px solid var(--border)', outline: 'none',
    fontSize: '12px', fontFamily: 'inherit', color: 'var(--text-primary)',
  },
  linkBtn: {
    padding: '6px 12px', borderRadius: '6px', border: 'none',
    backgroundColor: 'var(--text-primary)', color: 'var(--bg-card)', cursor: 'pointer',
    fontSize: '11px', fontWeight: 600, fontFamily: 'inherit',
  },
  linkCancel: {
    padding: '6px 10px', borderRadius: '6px', border: 'none',
    background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
    fontSize: '11px', fontWeight: 600, fontFamily: 'inherit',
  },

  // ─── EMPTY STATE ───
  emptyEditor: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: '10px',
    backgroundColor: 'var(--bg-card)', borderRadius: '16px',
    border: '1px solid var(--border)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '40px',
  },
  emptyIconBox: {
    width: '56px', height: '56px', borderRadius: '14px',
    backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 },
  emptyText: { fontSize: '13px', color: 'var(--text-muted)', margin: 0, textAlign: 'center', maxWidth: '240px', lineHeight: 1.4 },
};
