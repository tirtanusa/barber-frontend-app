# 💈 Barber App — Frontend

Aplikasi frontend untuk sistem manajemen barbershop berbasis **React + Vite**, mencakup fitur booking layanan, manajemen transaksi POS, dan dashboard admin.

---

## 🛠 Tech Stack

| Teknologi | Versi | Keterangan |
|---|---|---|
| React | ^19.2.6 | Library UI utama |
| Vite | ^8.0.12 | Build tool & dev server |
| React Router DOM | ^7.15.1 | Client-side routing |
| Tailwind CSS | ^4.3.0 | Utility-first CSS framework |
| Axios | ^1.16.1 | HTTP client untuk API calls |
| Lucide React | ^1.16.0 | Icon library |

---

## 📁 Struktur Direktori

```
barber-app/
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Gambar & asset statis
│   ├── components/             # Komponen UI yang dapat digunakan ulang
│   │   ├── Layout.jsx          # Wrapper layout utama (Navbar + Footer)
│   │   ├── Navbar.jsx          # Navigasi atas dengan auth state
│   │   ├── Footer.jsx          # Footer aplikasi
│   │   └── ProtectedRoute.jsx  # Guard route berdasarkan role
│   ├── context/
│   │   ├── AuthContext.jsx     # Context definition untuk autentikasi
│   │   └── AuthProvider.jsx    # Provider state autentikasi global
│   ├── pages/
│   │   ├── dashboard/          # Halaman landing publik
│   │   ├── login/              # Halaman login
│   │   ├── register/           # Halaman registrasi
│   │   ├── booking/            # Halaman booking layanan untuk pelanggan
│   │   ├── userDashboard/      # Dashboard pelanggan (booking aktif & riwayat)
│   │   ├── adminDashboard/     # Dashboard admin (statistik & laporan)
│   │   ├── bookingManagement/  # Manajemen booking oleh admin
│   │   └── transactionProcess/ # Proses transaksi POS di kasir
│   ├── App.jsx                 # Root komponen & konfigurasi routing
│   ├── main.jsx                # Entry point aplikasi
│   ├── App.css                 # Global styles
│   └── index.css               # CSS reset & base styles
├── index.html
├── vite.config.js
└── package.json
```

---

## 🗺️ Routing & Halaman

### Public Routes
| Path | Halaman | Keterangan |
|---|---|---|
| `/` | Dashboard | Landing page dengan info barbershop |
| `/login` | Login | Form autentikasi pengguna |
| `/register` | Register | Form pendaftaran pengguna baru |

### Customer Routes *(role: user, admin)*
| Path | Halaman | Keterangan |
|---|---|---|
| `/booking` | Booking | Pilih barber, layanan, tanggal & waktu |
| `/user/dashboard` | User Dashboard | Lihat booking aktif & riwayat booking |

### Admin Routes *(role: admin only)*
| Path | Halaman | Keterangan |
|---|---|---|
| `/admin/dashboard` | Admin Dashboard | Statistik revenue, laporan, top barber/service/produk |
| `/admin/booking-management` | Booking Management | Kelola & update status semua booking |
| `/admin/transaction-process` | Transaction Process | Proses POS transaksi untuk pelanggan |

---

## 🔑 Fitur Utama

### 1. Autentikasi & Otorisasi
- Login / Register dengan JWT (Sanctum Token)
- `AuthContext` menyimpan state user secara global
- `ProtectedRoute` memblokir akses berdasarkan **role** (`user` / `admin`)

### 2. Booking Layanan (Customer)
- Pilih barber, layanan, tanggal, dan slot waktu yang tersedia
- Konfirmasi dan simpan booking
- Tampilkan booking aktif & riwayat di User Dashboard
- Fitur pembatalan booking

### 3. Booking Management (Admin)
- Tampilkan semua booking dalam tabel paginasi
- Filter berdasarkan **status** dan **tanggal**
- Update status booking melalui alur state machine:
  `pending` → `confirmed` → `in_progress` → `completed` / `cancelled`
- Modal detail booking dengan informasi lengkap pelanggan & barber

### 4. Transaksi POS (Admin / Kasir)
- Cari dan pilih produk untuk ditambahkan ke keranjang
- Lihat info booking terkait
- Tampilkan ringkasan pembayaran (subtotal, diskon, total)
- Proses pembayaran dan cetak/tampilkan struk transaksi

### 5. Admin Dashboard
- Statistik ringkasan: total revenue, booking, transaksi
- Grafik pendapatan
- Daftar top barber, layanan terlaris, dan produk terlaris

---

## ✅ Fitur yang Sudah Dibuat

### 🔴 Core Features (9/9 - 100%)

| # | Fitur | Target User | Keterangan |
|---|-------|-------------|------------|
| 1 | Login | Both | Form email & password, redirect, error handling |
| 2 | Register | User | Form name, email, password, phone, auto-login |
| 3 | Select Barber | User | List barber aktif + rating |
| 4 | Select Service | User | List service + harga & durasi |
| 5 | Select Slot | User | Date picker + slot grid |
| 6 | Booking Confirmation | User | Review summary + confirm button |
| 7 | Admin Dashboard | Admin | Stats revenue, booking, top barbers, latest bookings |
| 8 | Manage Bookings | Admin | List, filter, detail, status update |
| 9 | Transaction Process / POS | Admin | Booking info, product, cart, payment, receipt |

### 🟡 Important Features (6/7)

| # | Fitur | Target User | Keterangan |
|---|-------|-------------|------------|
| 10 | User Dashboard | User | Active booking + shortcut Book Now |
| 11 | Booking History | User | List + status filter + cancel |
| 22 | Landing Page | User | Hero, barber list, service table, Our Works gallery |
| 13 | Manage Barbers | Admin | High | CRUD barber + toggle active/inactive |
| 14 | Manage Barber Schedules | Admin | High | Kelola jadwal & generate slot otomatis |
| 15 | Manage Services | Admin | High | CRUD layanan (nama, harga, durasi) |
| 16 | Manage Products | Admin | High | CRUD produk + update stok |

### ⚪ Nice to Have Features (1/2)

| # | Fitur | Target User | Keterangan |
|---|-------|-------------|------------|
| 21 | Landing Page | User | Sudah terintegrasi dengan API barber & service |

---

## 📋 Fitur yang Akan Dibuat

### 🟡 Important Features (1 fitur tersisa)

| # | Fitur | Target User | Prioritas | Keterangan |
|---|-------|-------------|-----------|------------|
| 12 | Booking Details | User | High | Halaman detail booking terpisah untuk user |

### 🔵 Complementary Features (4 fitur)

| # | Fitur | Target User | Prioritas | Keterangan |
|---|-------|-------------|-----------|------------|
| 17 | Transaction History | User | Medium | Riwayat transaksi pelanggan |
| 18 | Manage Transactions | Admin | Medium | List & filter semua transaksi |
| 19 | Manage Users | Admin | Medium | CRUD user + filter berdasarkan role |
| 20 | Profile | Both | Medium | Edit profil & change password |

### ⚪ Nice to Have Features (1 fitur tersisa)

| # | Fitur | Target User | Prioritas | Keterangan |
|---|-------|-------------|-----------|------------|
| 21 | Reports & Analytics | Admin | Low | Chart revenue, top barber/service/produk (API sudah siap) |

---

## ⚙️ Cara Menjalankan

### Prasyarat
- Node.js >= 18
- Backend API (`pos-barber-app`) sudah berjalan

### Langkah Instalasi

```bash
# 1. Clone repository
git clone <repo-url>
cd barber-app

# 2. Install dependencies
npm install

# 3. Konfigurasi environment
# Salin .env dan sesuaikan URL backend
cp .env.example .env
# Edit VITE_API_URL=http://localhost:8000/api

# 4. Jalankan development server
npm run dev
```

Aplikasi akan berjalan di: **http://localhost:5173**

### Build untuk Production

```bash
npm run build
npm run preview
```

---

## 🌐 Environment Variables

| Variable | Default | Keterangan |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000/api` | Base URL API backend |

---

## 🔗 Terkait

- **Backend API**: [pos-barber-app](../pos-barber-app) — Laravel REST API
