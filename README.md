# Sistem Persediaan ATK

Sistem Persediaan ATK adalah aplikasi web untuk membantu pengelolaan persediaan alat tulis kantor dan proses permintaan barang oleh karyawan.

Project ini dibuat sebagai aplikasi portfolio dengan fokus pada alur kerja internal perusahaan, manajemen stok, approval permintaan, laporan, serta tampilan responsive untuk desktop dan mobile.

---

## Fitur Utama

### Administrator

Administrator memiliki akses untuk:

- Melihat dashboard persediaan
- Mengelola data barang ATK
- Menambah, mengedit, dan menghapus barang
- Mengatur stok barang
- Mengatur stok minimum
- Mengelola data karyawan
- Melihat permintaan ATK dari karyawan
- Menerima permintaan
- Menolak permintaan
- Memberikan alasan penolakan
- Mengurangi stok otomatis ketika permintaan diterima
- Melihat riwayat permintaan
- Melakukan filter riwayat
- Melihat notifikasi permintaan baru
- Melihat notifikasi stok hampir habis
- Melihat notifikasi stok habis
- Membuat laporan
- Export laporan ke Excel
- Export laporan ke PDF
- Melihat informasi profil administrator

---

### Karyawan

Karyawan dapat:

- Login menggunakan akun yang terdaftar
- Mengajukan permintaan barang ATK
- Melihat nama dan divisi secara otomatis
- Memilih barang yang tersedia
- Melihat stok barang
- Menentukan jumlah permintaan
- Menentukan tanggal pengambilan
- Menambahkan keterangan
- Melihat riwayat permintaan
- Melihat status permintaan
- Melihat catatan dari administrator

---

## Alur Sistem

Alur utama aplikasi:

```text
Karyawan
   ↓
Mengajukan Permintaan ATK
   ↓
Status: Menunggu
   ↓
Administrator Memproses
   ↓
┌─────────────────┐
│ Terima / Tolak  │
└─────────────────┘
   ↓
Jika Diterima
   ↓
Stok Barang Berkurang
   ↓
Riwayat & Laporan
