# DokTerKu - Aplikasi Layanan Kesehatan

![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?logo=tailwind-css)

## 📋 Deskripsi Aplikasi

**DokTerKu** adalah aplikasi layanan kesehatan berbasis web (Progressive Web App) yang dirancang khusus untuk membantu masyarakat di daerah **3T (Tertinggal, Terdepan, dan Terluar)** dalam mengakses layanan kesehatan dengan mudah.

### Fitur Utama:

- 🏥 **Dashboard Pasien** - Kelola data kesehatan pribadi
- 👨‍⚕️ **Informasi Dokter** - Lihat profil dan jadwal dokter
- 📅 **Jadwal Puskesmas** - Informasi jadwal layanan puskesmas
- 📝 **Pendaftaran Periksa** - Daftar antrian pemeriksaan online
- 📊 **Riwayat Kesehatan** - Lihat riwayat pemeriksaan
- 📰 **Artikel Kesehatan** - Baca informasi kesehatan terkini
- 📄 **Surat Rujukan** - Generate surat rujukan dalam format PDF
- 🔐 **Autentikasi** - Login untuk pasien, dokter, dan admin
- 📱 **PWA Support** - Dapat diinstall sebagai aplikasi mobile

---

## 🛠️ Tech Stack

| Kategori             | Teknologi                    |
| -------------------- | ---------------------------- |
| **Framework**        | Next.js 16.0.10 (App Router) |
| **Frontend**         | React 19.2.1, TypeScript 5   |
| **Styling**          | Tailwind CSS 4               |
| **Database**         | Supabase (PostgreSQL)        |
| **Authentication**   | Supabase Auth                |
| **Icons**            | Lucide React                 |
| **PDF Generation**   | jsPDF + jspdf-autotable      |
| **PWA**              | next-pwa                     |
| **Password Hashing** | bcryptjs                     |

---

## ⚙️ Cara Instalasi dan Setup

### Prasyarat

Pastikan Anda sudah menginstall:

- **Node.js** versi 18.x atau lebih baru
- **npm** atau **yarn** atau **pnpm**
- Akun **Supabase** (untuk database)

### Langkah Instalasi

1. **Clone Repository**

   ```bash
   git clone <repository-url>
   cd periksakesehatan_rpl
   ```

2. **Install Dependencies**

   ```bash
   npm install
   # atau
   yarn install
   # atau
   pnpm install
   ```

3. **Setup Environment Variables**

   Buat file `.env.local` di root project dan tambahkan konfigurasi berikut:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   ```

4. **Setup Database Supabase**

   Buat tabel-tabel yang diperlukan di Supabase Dashboard sesuai dengan struktur aplikasi (users, doctors, appointments, medical_records, articles, dll).

---

## 🚀 Cara Menjalankan Aplikasi

### Mode Development

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat aplikasi.

### Mode Production

1. **Build aplikasi**

   ```bash
   npm run build
   ```

2. **Jalankan server production**
   ```bash
   npm run start
   ```

### Linting

```bash
npm run lint
```

---

## 📁 Struktur Folder

```
periksakesehatan_rpl/
├── app/                    # App Router (Next.js 13+)
│   ├── admin/              # Halaman admin
│   ├── auth/               # Callback autentikasi
│   ├── dashboard/          # Dashboard pasien
│   ├── dokter/             # Dashboard dokter
│   ├── jadwal-dokter/      # Jadwal dokter
│   ├── jadwal-puskesmas/   # Jadwal puskesmas
│   ├── login/              # Halaman login
│   ├── offline/            # Halaman offline (PWA)
│   ├── periksa/            # Pendaftaran pemeriksaan
│   ├── register/           # Halaman registrasi
│   ├── riwayat/            # Riwayat kesehatan
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Halaman utama
├── components/             # Komponen React
│   ├── ContactSection.tsx
│   ├── DoctorCard.tsx
│   ├── FAQSection.tsx
│   ├── FeaturesGrid.tsx
│   ├── Footer.tsx
│   ├── HealthArticles.tsx
│   ├── Hero.tsx
│   ├── MedicalStaff.tsx
│   ├── Navbar.tsx
│   ├── NotificationModal.tsx
│   ├── ReferralLetterModal.tsx
│   └── ...
├── lib/                    # Library dan utilities
│   └── supabase.ts         # Konfigurasi Supabase client
├── public/                 # Asset statis
│   └── manifest.json       # PWA manifest
└── package.json
```

---

## 📡 Dokumentasi API

Aplikasi ini menggunakan **Supabase** sebagai backend dan tidak memiliki custom API endpoints. Semua operasi data dilakukan langsung melalui Supabase Client SDK.

### Supabase Client Usage

```typescript
import { supabase } from "@/lib/supabase";

// Contoh: Mengambil data
const { data, error } = await supabase.from("table_name").select("*");

// Contoh: Insert data
const { data, error } = await supabase
  .from("table_name")
  .insert({ column: "value" });

// Contoh: Update data
const { data, error } = await supabase
  .from("table_name")
  .update({ column: "new_value" })
  .eq("id", 1);

// Contoh: Delete data
const { error } = await supabase.from("table_name").delete().eq("id", 1);
```

### Tabel Database (Estimasi)

| Tabel                | Deskripsi                   |
| -------------------- | --------------------------- |
| `users`              | Data pengguna (pasien)      |
| `doctors`            | Data dokter                 |
| `appointments`       | Data janji temu/pemeriksaan |
| `medical_records`    | Rekam medis pasien          |
| `articles`           | Artikel kesehatan           |
| `puskesmas_schedule` | Jadwal puskesmas            |

---

## 🌐 Deployment

Aplikasi ini dapat di-deploy menggunakan **Vercel**:

1. Push code ke GitHub repository
2. Hubungkan repository dengan [Vercel](https://vercel.com)
3. Tambahkan environment variables di Vercel Dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan tugas mata kuliah **Rekayasa Perangkat Lunak (RPL)**.

---

## 👥 Tim Pengembang

Dikembangkan sebagai bagian dari UAS RPL.
