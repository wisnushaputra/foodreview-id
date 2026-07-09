# FoodReview ID

**FoodReview ID** adalah platform komunitas berbasis web untuk berbagi pengalaman kuliner. 
Platform ini memungkinkan pengguna untuk:

- Menambah, melihat, mengedit, dan menghapus **Restoran**.
- Menambah, melihat, mengedit, dan menghapus **Ulasan** yang berelasi dengan restoran.

Platform ini dibangun dengan **Next.js** (App Router), **PostgreSQL**, **Prisma**, dan **Tailwind CSS + DaisyUI** untuk antarmuka yang menarik.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **UI & Styling:** Tailwind CSS + DaisyUI
- **Deployment:** Lokal (Docker tidak diminta, tapi bisa dimasukkan)

---

## 🚀 Cara Menjalankan Secara Lokal

Ikuti langkah-langkah berikut:

### 1️⃣ Persiapan Database
1. Pastikan PostgreSQL terinstal di komputer.
   - Windows: [PostgreSQL Installer](https://www.enterprisedatabase.com/downloads)
   - macOS: `brew install postgresql`
   - Linux: `sudo apt install postgresql`
2. Buat database baru, misalnya `foodreview_db`.
3. Buat user PostgreSQL dan beri hak hak akses penuh ke database tersebut.
   ```sql
   CREATE USER foodreview_user WITH PASSWORD 'your_strong_password';
   CREATE DATABASE foodreview_db OWNER foodreview_user;
   GRANT ALL PRIVILEGES ON DATABASE foodreview_db TO foodreview_user;
   ```

### 2️⃣ Konfigurasi Environment
1. Salin file `.env.example` menjadi `.env` di root project.
   ```bash
   cp .env.example .env
   ```
2. Edit file `.env` dan isi nilai **DATABASE_URL** dengan format berikut:
   ```
   DATABASE_URL="postgresql://foodreview_user:your_strong_password@localhost:5432/foodreview_db?schema=public"
   ```

### 3️⃣ Instalasi & Migrasi Database
```bash
# Instal semua dependensi
npm install

# Generate Prisma client (jika belum)
npm run prisma:generate

# Push skema Prisma ke database (membuat tabel)
npm run prisma:db:push
```

> **Catatan:** Jika ingin membuat migrasi SQL berupa file, jalankan `npm run prisma:db:migrate`. Namun untuk tugas ini `prisma:db:push` sudah cukup.

### 4️⃣ Jalankan Aplikasi
```bash
npm run dev
```
Aplikasi akan berjalan di `http://localhost:3000`.

---

## 📌 Catatan Tambahan

- Semua data disimpan di PostgreSQL. Pastikan service PostgreSQL berjalan sebelum menjalankan `prisma:db:push`.
- Untuk development, Anda dapat mengakses database melalui tools seperti **pgAdmin** atau **DBeaver**.
- Jika ingin menambahkan authentikasi atau fitur lain, gunakan middleware Next.js atau library seperti `next-auth`.

---

