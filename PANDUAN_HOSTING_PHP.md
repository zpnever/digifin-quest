# Panduan Deployment DigiFin Quest ke Hosting PHP (cPanel / Shared Hosting)

Panduan ini menjelaskan langkah demi langkah untuk men-deploy aplikasi **DigiFin Quest** ke layanan hosting berbasis PHP dan MySQL (seperti cPanel, Plesk, LiteSpeed, atau Apache shared hosting pada Niagahoster, DomaiNesia, IDCloudHost, Rumahweb, dll).

---

## 1. Persyaratan Server Hosting

Pastikan paket hosting Anda memenuhi spesifikasi berikut (hampir semua shared hosting modern sudah memenuhi):
- **Web Server**: Apache atau LiteSpeed dengan modul `mod_rewrite` aktif (default aktif di semua cPanel).
- **Versi PHP**: PHP 7.4, 8.0, 8.1, 8.2, atau 8.3 (disarankan **PHP 8.1 / 8.2**).
- **Ekstensi PHP**: `pdo_mysql`, `json`, `mbstring`, `openssl` (seluruhnya merupakan ekstensi standar PHP).
- **Database**: MySQL 5.7+ atau MariaDB 10.2+.

---

## 2. Membuat File Deployment (Build)

Di komputer lokal Anda, jalankan perintah berikut di dalam direktori proyek `digifin-quest`:

```bash
npm run build:php
```

Proses ini secara otomatis akan:
1. Mem-build frontend React menjadi file statis HTML, CSS, dan JavaScript yang teroptimasi.
2. Menggabungkan frontend dengan backend native PHP di folder `dist-php/`.
3. Menyertakan konfigurasi `.htaccess` untuk perutean URL.
4. Menghasilkan file arsip siap upload: **`digifinquest-php.zip`**.

---

## 3. Menyiapkan Database di cPanel

1. Masuk ke dashboard **cPanel** hosting Anda.
2. Cari dan klik menu **MySQL Databases** (atau **MySQL Database Wizard**).
3. **Buat Database Baru**:
   - Contoh nama: `u123456_digifin`
4. **Buat Pengguna MySQL Baru (User)**:
   - Contoh username: `u123456_dfquser`
   - Buat password yang kuat dan catat password tersebut.
5. **Tambahkan User ke Database**:
   - Pilih user dan database yang baru saja dibuat, klik **Add**.
   - Centang opsi **ALL PRIVILEGES**, lalu klik **Make Changes**.

---

## 4. Konfigurasi Kredensial Database (`api/config.php`)

Sebelum atau sesudah mengunggah file ke hosting, sesuaikan pengaturan database:

Buka file `api/config.php` (bisa diedit langsung lewat File Manager cPanel):

```php
// Konfigurasi Database MySQL
define('DB_HOST', 'localhost');             // Biasanya tetap 'localhost' di cPanel
define('DB_PORT', '3306');
define('DB_NAME', 'u123456_digifin');       // Ganti dengan nama database cPanel Anda
define('DB_USER', 'u123456_dfquser');       // Ganti dengan username MySQL cPanel Anda
define('DB_PASS', 'PasswordDatabaseAnda');   // Ganti dengan password MySQL cPanel Anda

// JWT Secret Key (Ubah dengan teks acak panjang untuk keamanan)
define('JWT_SECRET', 'kunci_rahasia_acak_unik_anda_2026');

// Kode Pendaftaran Dosen/Admin Baru
define('ADMIN_REGISTER_CODE', 'DOSEN2025');
```

---

## 5. Mengunggah File ke Hosting

1. Di cPanel, buka menu **File Manager**.
2. Masuk ke direktori:
   - **`public_html`** (jika ingin diakses langsung pada domain utama, misal: `https://kampus-anda.ac.id`).
   - Atau direktori subdomain / addon domain Anda.
3. Klik tombol **Upload** di bagian atas, lalu pilih file **`digifinquest-php.zip`**.
4. Setelah proses upload selesai (progress bar 100% hijau), kembali ke File Manager.
5. Klik kanan file `digifinquest-php.zip` lalu pilih **Extract** -> **Extract Files**.
6. **Penting**: Pastikan file tersembunyi (*dotfiles*) terlihat:
   - Klik **Settings** di pojok kanan atas File Manager.
   - Centang **Show Hidden Files (dotfiles)** lalu klik **Save**.
   - Pastikan file `.htaccess` berada di dalam root `public_html`.

Struktur folder di `public_html` seharusnya seperti ini:
```
public_html/
├── .htaccess                 <-- Konfigurasi rewrite SPA React & API
├── index.html                <-- File utama frontend
├── favicon.svg
├── icons.svg
├── assets/                   <-- File JavaScript & CSS hasil compile
└── api/                      <-- Backend REST API PHP
    ├── .htaccess
    ├── config.php            <-- File konfigurasi database
    ├── index.php             <-- Router API
    ├── helpers/
    ├── routes/
    └── install/
        ├── schema.sql
        ├── seed.sql
        └── setup.php         <-- Web installer 1-klik
```

---

## 6. Inisialisasi Database (Membuat Tabel & Data Awal)

Tersedia 2 cara mudah untuk menginisialisasi database:

### Cara 1: Menggunakan Web Installer 1-Klik (Paling Praktis)
1. Buka browser dan akses alamat installer:
   ```
   https://domain-anda.com/api/install/setup.php
   ```
2. Halaman web installer akan memverifikasi koneksi database ke server MySQL Anda.
3. Jika status koneksi bertuliskan **✓ Terhubung**, klik tombol:
   **"🚀 Mulai Inisialisasi Database (Schema & Seed)"**.
4. Tunggu beberapa detik hingga muncul pesan sukses berwarna hijau.
5. Selesai! Database Anda sekarang sudah memiliki tabel lengkap dan 6 modul pembelajaran siap pakai.

> [!CAUTION]
> **Penting untuk Keamanan**: Setelah database berhasil terpasang, hapus file `api/install/setup.php` atau ubah namanya melalui File Manager cPanel agar tidak diakses orang lain.

---

### Cara 2: Manual Menggunakan phpMyAdmin
Jika Anda lebih suka mengimpor SQL manual:
1. Di cPanel, buka menu **phpMyAdmin**.
2. Pilih database Anda di panel sebelah kiri.
3. Klik tab **Import** di bagian atas.
4. Pilih file `api/install/schema.sql`, lalu klik **Import** (Go).
5. Setelah berhasil, klik tab **Import** kembali.
6. Pilih file `api/install/seed.sql`, lalu klik **Import** (Go).

---

## 7. Akun Default & Pengujian Login

Setelah database terpasang, Anda dapat langsung menguji login di aplikasi web Anda (`https://domain-anda.com`):

### A. Akun Dosen / Administrator
- **Email**: `admin@digifinquest.ac.id`
- **Password**: `admin123`
- *Hak Akses*: Manajemen Modul, Manajemen Kuis, Manajemen Skenario Kasus, Daftar Mahasiswa, Analitik Kelas, dan Ekspor Laporan CSV.

### B. Akun Mahasiswa Percobaan
- **Email**: `ayu@student.ac.id`
- **Password**: `student123`
- Mahasiswa baru juga dapat mendaftar sendiri melalui halaman `/register`.

### C. Mendaftarkan Akun Admin/Dosen Baru
- Buka rute `/register/admin`.
- Masukkan nama, email, password, dan Kode Admin rahasia (default: `DOSEN2025`, atau sesuai yang diatur di `api/config.php`).

---

## 8. Troubleshooting (Solusi Masalah Umum)

### 1. Halaman Rute Me-Refresh Muncul 404 (Not Found)
- **Penyebab**: File `.htaccess` di root `public_html` belum terunggah atau terhapus.
- **Solusi**: Pastikan opsi *Show Hidden Files* di File Manager aktif dan file `.htaccess` berada di direktori utama `public_html`.

### 2. Login Gagal dengan Pesan "Token diperlukan" atau Error 401
- **Penyebab**: Server Apache/LiteSpeed memblokir header HTTP `Authorization`.
- **Solusi**: File `api/.htaccess` bawaan sudah menyertakan `SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1`. Pastikan file `api/.htaccess` ada di dalam folder `api/`.

### 3. Error "Koneksi database gagal" saat Membuka Aplikasi
- **Penyebab**: Kredensial MySQL di `api/config.php` belum sesuai.
- **Solusi**: Buka `api/config.php` via cPanel File Manager, periksa kembali `DB_NAME`, `DB_USER`, dan `DB_PASS`. Pastikan nama database menyertakan prefix akun cPanel (contoh: `u123456_digifin`).

### 4. Menempatkan Aplikasi di Sub-Folder (Bukan Domain Utama)
Jika Anda men-deploy ke sub-folder (contoh: `https://kampus.ac.id/digifin/`):
- Buka file `.htaccess` di dalam folder tersebut.
- Ubah baris `RewriteBase /` menjadi `RewriteBase /digifin/`.
- Buka file `api/.htaccess`.
- Ubah baris `RewriteBase /api/` menjadi `RewriteBase /digifin/api/`.
