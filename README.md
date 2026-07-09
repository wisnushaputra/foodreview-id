# FoodReview ID

FoodReview ID adalah platform komunitas web untuk berbagi ulasan dan pengalaman kuliner. Project ini dibuat untuk memenuhi tugas **UAS Pemrograman Web 2**.

Aplikasi ini menggunakan Next.js (App Router) untuk frontend/backend, PostgreSQL sebagai database, Prisma sebagai ORM, serta Tailwind CSS & DaisyUI untuk tampilan UI/UX yang modern dan minimalis.

---

## 📸 Demo Tampilan (Beranda)

![FoodReview ID Demo](./public/demo-homepage.png)

---

## ✨ Fitur Utama

- **CRUD Restoran**:
  - Tambah restoran baru (Nama, Lokasi, Deskripsi).
  - Unggah foto restoran dari file lokal (maksimal **5MB**) atau menempelkan URL gambar dari internet.
  - **Validasi Sisi Klien & Preview Instan**: Memeriksa ukuran file secara otomatis sebelum diunggah (harus di bawah 5MB) dan menampilkan pratinjau gambar (*preview thumbnail*) secara instan demi UX yang optimal.
  - Edit detail informasi restoran.
  - Hapus restoran beserta seluruh ulasannya sekaligus (Cascade Delete).
- **Fitur Pencarian & Filter Instan (Client-Side)**:
  - Kotak pencarian real-time untuk mencari restoran berdasarkan nama, menu, deskripsi, atau kota.
  - Dropdown filter lokasi dinamis yang mengekstrak daftar kota unik langsung dari database.
  - Halaman kosong (*empty state*) interaktif lengkap dengan tombol reset jika pencarian tidak membuahkan hasil.
- **Pemberitahuan Visual (Toast Notification)**:
  - Notifikasi melayang (*toast popup*) yang elegan di pojok kanan bawah dengan transisi *slide-in* halus.
  - Secara otomatis menampilkan konfirmasi sukses/gagal setelah operasi CRUD (Tambah/Edit/Hapus Restoran atau Ulasan).
  - Dilengkapi ikon status berbasis konteks, tombol tutup instan, serta sistem pembersihan parameter URL agar notifikasi tidak terulang ketika halaman di-refresh.
- **Halaman Statistik & Dashboard**:
  - Halaman kustom di `/dashboard` yang menyajikan ringkasan metrik utama (Total Restoran terdaftar, Total Ulasan diterbitkan, Rata-rata Rating bintang, dan Kota Teraktif).
  - Visualisasi grafik progress bar dinamis untuk sebaran jumlah restoran di setiap wilayah.
  - Daftar ulasan terbaru lengkap dengan tautan dinamis langsung ke halaman detail restoran bersangkutan.
  - Mendukung fallback otomatis berbasis memori agar dashboard tetap terisi saat database kosong.
- **CRUD Ulasan & Rating**:
  - Tulis ulasan baru lengkap dengan nama pengulas, ulasan teks, dan pilihan rating bintang (1-5) menggunakan selector bintang interaktif.
  - Edit ulasan yang sudah ditulis sebelumnya.
  - Hapus ulasan individual.
- **Auto-Seeding Database**:
  - Jika database dalam keadaan kosong saat pertama kali dijalankan, sistem akan otomatis melakukan *seeding* (memasukkan) 6 data dummy kuliner legendaris dan pedagang kaki lima (PKL) beserta ulasannya ke database PostgreSQL agar aplikasi langsung siap dicoba.
- **UI/UX Minimalis & Glassmorphism**:
  - Header navigasi *sticky* dengan efek blur kaca.
  - Desain grid kartu yang responsif dengan efek zoom gambar saat di-hover.
  - Bebas dari error *hydration mismatch* akibat ekstensi pihak ketiga.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (TypeScript, App Router)
- **Database**: PostgreSQL (berjalan secara lokal / Docker)
- **ORM**: Prisma
- **Styling**: Tailwind CSS v4 & DaisyUI v5

---

## 🚀 Cara Menjalankan Project

### 1. Prasyarat
Pastikan Anda sudah menginstal:
- Node.js (versi 20 atau lebih baru)
- PostgreSQL

### 2. Instalasi Dependensi
Jalankan perintah berikut di folder root project:
```bash
npm install
```

### 3. Konfigurasi Database (.env)
Buat file bernama `.env` di dalam folder root `foodreview-id/` dan isi koneksi database PostgreSQL Anda:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/foodreview_db?schema=public"
```
*Ganti `postgres`, `password`, dan `foodreview_db` sesuai dengan kredensial PostgreSQL lokal Anda.*

### 4. Push Schema & Auto-Seed
Jalankan perintah berikut untuk mensinkronisasi skema tabel database dan mengisi data dummy awal:
```bash
npx prisma db push
```

### 5. Jalankan Server Development
Jalankan aplikasi di komputer lokal:
```bash
npm run dev
```
Buka **`http://localhost:3000`** di browser Chrome Anda.

---

## 📁 Struktur Folder Project

- `app/` - Halaman frontend utama (layout global, homepage, dan CRUD rute restoran/ulasan).
- `app/api/` - Endpoint API untuk backend.
- `app/components/` - Komponen React interaktif (seperti tombol hapus dengan konfirmasi dialog).
- `lib/prisma.ts` - Singleton instance Prisma Client.
- `prisma/` - Skema basis data Prisma (`schema.prisma`).
- `public/` - Aset gambar statis dan folder penyimpanan file unggahan lokal (`public/uploads`).