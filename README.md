# Rekan - Task Management Application

**Rekan** adalah aplikasi manajemen tugas (Trello Clone) modern, premium, dan responsif yang dirancang untuk membantu Anda memantau dan mengelola berbagai proyek secara visual. Aplikasi ini menyediakan fitur dashboard statistik, kalender aktivitas penyelesaian tugas, serta pengorganisasian papan tugas (boards) berbasis proyek.

---

## 🚀 Fitur Utama

1. **Manajemen Berbasis Proyek (Projects)**
   - Buat proyek baru dengan nama dan palet warna kustom secara dinamis dari bilah samping (sidebar).
   - Isolasi board dan kalender aktivitas secara otomatis untuk setiap proyek baru agar pengerjaan dimulai dengan halaman kosong.
   - Filter semua statistik dan aktivitas tugas berdasarkan proyek tertentu atau gabungan seluruh proyek.

2. **Papan Tugas Interaktif (Boards)**
   - Tambahkan, edit, dan hapus board di bawah proyek aktif.
   - Pilihan visibilitas board (Privat / Publik) serta indikator progres penyelesaian tugas yang divisualisasikan dengan progress bar interaktif.
   - Efek visual hover bayangan dan warna border kartu yang adaptif terhadap warna tema board.

3. **Kalender Aktivitas Penyelesaian Tugas (Activity Calendar)**
   - Kalender kontribusi bergaya GitHub (berdurasi 26 minggu) yang melebar secara penuh di layar.
   - Data aktivitas terikat langsung dengan riwayat penyelesaian tugas riil dari board proyek yang dipilih.
   - Tooltip halus yang dianimasikan dengan `framer-motion` saat mouse diarahkan ke sel aktivitas, menampilkan rincian tugas dan perkiraan tanggal penyelesaian.

4. **Desain Visual Premium**
   - Mendukung **Mode Terang (Light Mode)** dan **Mode Malam (Dark Mode)** dengan transisi warna yang sangat halus.
   - Palet warna kustom berkelas (Emerald, Indigo, Rose, Violet, Amber, Sky Blue, Pink).
   - Layout dashboard yang sepenuhnya responsif di semua resolusi layar desktop hingga mobile.

---

## 🛠️ Tech Stack

* **Frontend**: React (Vite), Framer Motion, Lucide Icons, Vanilla CSS.
* **Backend**: Node.js, Express.js.
* **Database & Auth**: Supabase (PostgreSQL) *(sesuai dengan cetak biru perancangan)*.

---

## 📦 Cara Menjalankan Aplikasi

### 1. Prasyarat
Pastikan Anda telah menginstal **Node.js** (versi 16 atau lebih baru) di perangkat Anda.

### 2. Menjalankan Frontend
Masuk ke direktori `frontend`, instal dependensi, lalu jalankan server pengembangan:
```bash
cd frontend
npm install
npm run dev
```
Aplikasi frontend akan berjalan di [http://localhost:5173/](http://localhost:5173/) (atau port alternatif seperti `5174`).

### 3. Menjalankan Backend
Masuk ke direktori `backend`, instal dependensi, dan konfigurasikan file lingkungan `.env`:
```bash
cd backend
npm install
# Konfigurasi kunci Supabase dan port sesuai .env.example
npm run start
```
*Catatan: Backend dirancang terintegrasi dengan REST API Node.js dan schema database Supabase.*

---

## 📁 Struktur Proyek

```text
task_management/
├── frontend/             # Antarmuka Pengguna (React/Vite)
│   ├── src/
│   │   ├── components/   # Komponen UI (Sidebar, Dashboard, Modals)
│   │   ├── App.jsx       # Root component aplikasi
│   │   ├── index.css     # Sistem desain global & variabel CSS
│   │   └── main.jsx
│   └── public/           # Aset statis & favicon
├── backend/              # Server API (Node.js/Express)
│   ├── server.js
│   └── .env.example
├── supabase_schema.sql   # Rancangan skema database PostgreSQL Supabase
└── README.md             # Dokumentasi proyek ini
```
