import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Plus, Quote } from 'lucide-react';
import AddTestimonialModal from './AddTestimonialModal';

const AVATARS = ['😊', '😎', '🚀', '🌟', '💡', '🎨', '🔥', '💪', '👩‍💻', '🧠'];

const INITIAL_TESTIMONIALS = [
  {
    id: 't-1',
    name: 'Ahmad Fauzi',
    role: 'Frontend Developer',
    avatar: '🚀',
    content: 'Aplikasi ini sangat membantu tim kami dalam mengelola tugas sehari-hari. Fitur board dan tracking progress-nya intuitif dan mudah digunakan. Sangat merekomendasikan!',
    rating: 5,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    color: '#6366F1',
  },
  {
    id: 't-2',
    name: 'Siti Nurhaliza',
    role: 'Product Manager',
    avatar: '🌟',
    content: 'Rekan benar-benar mengubah cara kami bekerja. Kolaborasi tim jadi lebih terstruktur dan transparan. Fitur assignment dan deadline sangat membantu.',
    rating: 5,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    color: '#10B981',
  },
  {
    id: 't-3',
    name: 'Budi Santoso',
    role: 'UI/UX Designer',
    avatar: '🎨',
    content: 'Desainnya clean dan modern. Navigasinya smooth banget!',
    rating: 4,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    color: '#F59E0B',
  },
  {
    id: 't-4',
    name: 'Rina Wijaya',
    role: 'Full Stack Developer',
    avatar: '💡',
    content: 'Sudah coba banyak task management tools, tapi Rekan yang paling cocok dengan workflow saya. Ringan, cepat, dan tidak membingungkan.',
    rating: 5,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    color: '#EF4444',
  },
  {
    id: 't-5',
    name: 'Doni Prasetyo',
    role: 'Team Lead',
    avatar: '🔥',
    content: 'Fitur filter dan search-nya powerful banget. Tim saya jadi jauh lebih produktif sejak pindah ke Rekan.',
    rating: 4,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    color: '#8B5CF6',
  },
  {
    id: 't-6',
    name: 'Maya Anggraini',
    role: 'Project Coordinator',
    avatar: '💪',
    content: 'Yang saya suka adalah kemudahan dalam membuat dan mengatur project. Setiap anggota tim bisa langsung melihat tugas masing-masing tanpa kebingungan. Fitur drag-and-drop di board view juga sangat membantu dalam mengatur prioritas pekerjaan sehari-hari.',
    rating: 5,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    color: '#EC4899',
  },
  {
    id: 't-7',
    name: 'Hendra Gunawan',
    role: 'Freelancer',
    avatar: '😎',
    content: 'Sebagai freelancer, saya butuh tool yang simpel tapi powerful. Rekan jawabannya! Coba aja, gratis.',
    rating: 5,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    color: '#06B6D4',
  },
  {
    id: 't-8',
    name: 'Dewi Lestari',
    role: 'Scrum Master',
    avatar: '🧠',
    content: 'Sprint planning jadi jauh lebih efisien. Visualisasi progress dengan board dan fitur drag & drop memudahkan kami dalam memindahkan task antar status. Sangat membantu untuk daily standup dan retrospective.',
    rating: 5,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    color: '#F97316',
  },
];

function StarRating({ rating, size = 14, interactive = false, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(i)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: interactive ? 'pointer' : 'default',
            color: i <= rating ? '#F59E0B' : 'var(--border)',
            transition: 'var(--t-fast)',
            transform: interactive && i <= rating ? 'none' : 'none',
          }}
        >
          <Star
            size={size}
            fill={i <= rating ? '#F59E0B' : 'none'}
            strokeWidth={i <= rating ? 0 : 1.5}
          />
        </button>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, index }) {
  const { name, role, avatar, content, rating, createdAt, color } = testimonial;
  const dateStr = new Date(createdAt).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      style={{
        ...styles.card,
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
        marginBottom: '16px',
      }}
    >
      <div style={styles.cardTop}>
        <div style={{ ...styles.avatarCircle, backgroundColor: `${color}18`, color }}>
          {avatar}
        </div>
        <div style={styles.cardInfo}>
          <div style={styles.cardName}>{name}</div>
          <div style={styles.cardRole}>{role}</div>
        </div>
      </div>

      <StarRating rating={rating} />

      <div style={styles.contentWrapper}>
        <Quote size={14} color="var(--text-muted)" style={{ opacity: 0.4, flexShrink: 0, marginTop: 2 }} />
        <p style={styles.content}>{content}</p>
      </div>

      <div style={styles.date}>{dateStr}</div>
    </motion.div>
  );
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState(INITIAL_TESTIMONIALS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTestimonial = (data) => {
    const newTestimonial = {
      id: `t-${Date.now()}`,
      ...data,
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      createdAt: new Date().toISOString(),
    };
    setTestimonials(prev => [newTestimonial, ...prev]);
  };

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.h1}>Testimonials</h1>
          <p style={styles.subtitle}>
            Apa kata mereka tentang Rekan?
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <MessageSquare size={16} />
          Buat Testimoni
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div style={styles.empty}>
          <MessageSquare size={40} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
          <p style={styles.emptyText}>Belum ada testimoni. Jadilah yang pertama!</p>
          <button className="btn btn-emerald" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />
            Tulis Testimoni
          </button>
        </div>
      ) : (
        <div style={styles.masonry}>
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} index={i} />
          ))}
        </div>
      )}

      <AddTestimonialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTestimonial}
      />
    </div>
  );
}

const styles = {
  page: {
    padding: '32px 36px',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    maxWidth: '1280px',
    margin: '0 auto',
    width: '100%',
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
  },
  h1: {
    fontSize: 'var(--text-2xl)',
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: '-0.8px',
    lineHeight: 1.1,
  },
  subtitle: {
    marginTop: '4px',
    fontSize: 'var(--text-base)',
    color: 'var(--text-muted)',
  },

  // Masonry Grid
  masonry: {
    columns: '3 300px',
    columnGap: '16px',
  },

  // Card
  card: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-lg)',
    padding: '20px',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'var(--t-base)',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatarCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    flexShrink: 0,
  },
  cardInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  cardName: {
    fontSize: 'var(--text-base)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.2px',
  },
  cardRole: {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  contentWrapper: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
  },
  content: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    margin: 0,
  },
  date: {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },

  // Empty state
  empty: {
    padding: '60px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    border: '1px dashed var(--border)',
    borderRadius: 'var(--r-lg)',
  },
  emptyText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    maxWidth: '240px',
  },
};
