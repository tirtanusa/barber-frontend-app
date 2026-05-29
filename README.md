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
