📦 Sistem Persediaan ATK

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State_Management-111827)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)

*Sistem Persediaan ATK* adalah aplikasi web untuk membantu pengelolaan persediaan alat tulis kantor, mulai dari data barang, stok, permintaan karyawan, persetujuan admin, riwayat pengambilan, hingga laporan persediaan.

Project ini dikembangkan sebagai **prototype sistem inventaris ATK kantor** dengan konsep **Role-Based Access Control**, sehingga setiap pengguna hanya dapat mengakses fitur sesuai dengan perannya.

---

🚀 Live Demo

🌐 *Demo* 
https://persediaan-atk-kantor-eta.vercel.app/

💻 *Repository*  
https://github.com/khalilurrahmanmahdi12/Persediaan_ATK

---

✨ Fitur Utama

📊 Dashboard Persediaan

Menampilkan ringkasan kondisi persediaan ATK seperti:

- 📦 Total jenis barang
- 📊 Total stok tersedia
- ⚠️ Barang dengan stok menipis
- 🧾 Total permintaan
- ⏳ Permintaan menunggu
- ✅ Permintaan disetujui
- ❌ Permintaan ditolak
- 🕒 Aktivitas terbaru

Dashboard membantu administrator memantau kondisi stok dan permintaan barang secara cepat.

---

📦 Manajemen Data Barang

Administrator dapat mengelola data persediaan ATK melalui fitur:

- ➕ Tambah barang
- ✏️ Edit data barang
- 🗑️ Hapus barang
- 🔎 Pencarian barang
- 🎯 Filter kategori
- 📊 Monitoring stok
- ⚠️ Status stok minimum
- 📌 Status ketersediaan barang

Informasi barang meliputi:

- ID barang
- Nama barang
- Kategori
- Satuan
- Jumlah stok
- Stok minimum
- Status stok

---

📉 Monitoring Stok

Sistem memantau jumlah stok barang dan menampilkan status secara otomatis.

Contoh status:

- 🟢 Stok Aman
- 🟡 Stok Menipis
- 🔴 Stok Habis

Fitur ini membantu administrator mengetahui barang yang perlu segera ditambah sebelum stok benar-benar habis. Sebuah konsep revolusioner bernama “jangan menunggu pulpen lenyap dulu”.

---

📝 Permintaan ATK Karyawan

Karyawan dapat mengajukan permintaan pengambilan ATK melalui form.

Informasi permintaan meliputi:

- Nama karyawan
- Divisi
- Barang yang dipilih
- Jumlah barang
- Tanggal pengambilan
- Keperluan
- Status permintaan

Data nama dan divisi dapat terisi otomatis berdasarkan akun karyawan yang sedang login.

---

🔄 Alur Permintaan Barang

```text
Karyawan Mengajukan Permintaan
        ↓
      Menunggu
        ↓
 Administrator Review
        ↓
  Disetujui / Ditolak
        ↓
Jika Disetujui
        ↓
     Stok Berkurang
        ↓
Masuk Riwayat Pengambilan
````

---

✅ Persetujuan Permintaan

Administrator dapat memeriksa seluruh permintaan barang yang masuk.

Fitur persetujuan meliputi:

* Melihat detail permintaan
* Menyetujui permintaan
* Menolak permintaan
* Memberikan catatan admin
* Memperbarui status
* Mengurangi stok otomatis saat permintaan disetujui

Status permintaan:

* ⏳ Menunggu
* ✅ Disetujui
* ❌ Ditolak

---

📋 Riwayat Permintaan

Sistem menyediakan riwayat seluruh aktivitas permintaan ATK.

Informasi riwayat meliputi:

* ID permintaan
* Nama karyawan
* Divisi
* Barang
* Jumlah
* Tanggal pengambilan
* Status
* Catatan admin

Tersedia filter berdasarkan:

* Status
* Tanggal
* Divisi

---

👥 Manajemen Karyawan

Administrator dapat mengelola data karyawan seperti:

* ➕ Tambah karyawan
* ✏️ Edit karyawan
* 🗑️ Hapus data
* 🔎 Pencarian
* 🏢 Filter divisi
* 🟢 Status aktif/nonaktif

Data karyawan dapat mencakup:

* Nama
* Email
* Nomor WhatsApp
* Divisi
* Jabatan
* Role
* Status akun

---

🔔 Sistem Notifikasi

Sistem memiliki notifikasi untuk membantu pengguna mengetahui aktivitas penting.

Contoh notifikasi:

* Permintaan baru
* Permintaan disetujui
* Permintaan ditolak
* Stok barang menipis
* Informasi sistem

Fitur notifikasi dapat mencakup:

* Badge jumlah notifikasi
* Status sudah/belum dibaca
* Navigasi ke halaman terkait

---

👤 Profil Pengguna

Setiap pengguna dapat melihat informasi akun seperti:

* Nama
* Email
* Nomor WhatsApp
* Divisi
* Jabatan
* Role
* Status akun

---

🔐 Role-Based Access Control

Sistem memiliki dua role utama:

👑 Administrator

Administrator memiliki akses ke:

* Dashboard
* Data Barang
* Data Karyawan
* Permintaan
* Riwayat
* Laporan
* Profil
* Pengaturan

Administrator bertanggung jawab terhadap pengelolaan stok dan proses persetujuan permintaan.

---

👨‍💼 Karyawan

Karyawan memiliki akses untuk:

* Dashboard
* Mengajukan permintaan ATK
* Melihat status permintaan
* Melihat riwayat permintaan
* Melihat notifikasi
* Mengelola profil

---

📲 Login & OTP

Sistem menggunakan proses login berbasis:

```text
Email / Nomor WhatsApp
        ↓
Kirim OTP
        ↓
Verifikasi OTP
        ↓
Role Ditentukan
        ↓
Masuk Dashboard
```

Pada versi prototype, OTP digunakan sebagai simulasi autentikasi frontend.

---

📑 Laporan Persediaan

Administrator dapat melihat laporan terkait penggunaan dan permintaan ATK.

Laporan dapat difilter berdasarkan:

* 📅 Periode
* 📌 Status
* 🏢 Divisi

Informasi laporan dapat mencakup:

* Total permintaan
* Permintaan disetujui
* Permintaan ditolak
* Barang yang paling sering diminta
* Riwayat pengambilan
* Data penggunaan ATK

---

📗 Export Excel

Laporan dapat diekspor ke format:

```text
.xlsx
```

Export dapat digunakan untuk:

* 📊 Rekapitulasi
* 🗂️ Dokumentasi
* 📈 Analisis penggunaan
* 🧾 Pelaporan
* 📁 Arsip operasional

---

📄 Export PDF

Laporan juga dapat dikembangkan atau digunakan dalam format PDF untuk kebutuhan:

* Dokumentasi
* Pelaporan
* Arsip
* Cetak laporan

---

💾 LocalStorage

Project menggunakan `localStorage` dan state management untuk menyimpan data simulasi seperti:

* Session login
* Data barang
* Data karyawan
* Permintaan ATK
* Status permintaan
* Riwayat
* Preferensi pengguna

Dengan demikian, sebagian data demo tetap tersedia setelah halaman direfresh.

---

🔒 Keamanan Akses

Sistem dilengkapi dengan:

* 🔐 Login
* 📲 OTP Verification
* 🛡️ Protected Route
* 👥 Role-Based Access Control
* 🚫 Pembatasan akses berdasarkan role
* 🔍 Halaman 404
* 🚪 Logout
* 💾 Session berbasis LocalStorage

---

📱 Responsive Design

Sistem Persediaan ATK dirancang agar nyaman digunakan pada:

* 🖥️ Desktop
* 💻 Laptop
* 📱 Tablet
* 📲 Smartphone

Fitur responsive meliputi:

* ☰ Mobile Sidebar
* 📋 Responsive Table
* 🧾 Responsive Form
* 📊 Responsive Dashboard
* 🔔 Responsive Notification
* 👤 Responsive Profile
* 📱 Mobile-Friendly Navigation

---

🛠️ Teknologi yang Digunakan

* ⚛️ React
* 🔷 TypeScript
* ⚡ Vite
* 🎨 Tailwind CSS
* 🧭 React Router
* 🐻 Zustand
* 🎯 Lucide React
* 📗 SheetJS / XLSX
* 📄 PDF Export Library
* 💾 LocalStorage
* 🐙 GitHub
* ▲ Vercel

---

🚀 Menjalankan Project

Clone repository:

```bash
git clone https://github.com/khalilurrahmanmahdi12/Persediaan_ATK.git
```

Masuk ke folder project:

```bash
cd Persediaan_ATK
```

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

---

🌐 Deployment

Project dideploy menggunakan **Vercel**.

Live application:

```text
https://persediaan-atk-kantor-eta.vercel.app/
```

Untuk React Router SPA, project dapat menggunakan konfigurasi `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Konfigurasi ini memastikan route aplikasi tetap dapat dibuka langsung dan tidak mengalami error 404 ketika halaman direfresh.

---

📂 Struktur Utama Project

```text
src/
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── navigation/
│   └── ui/
│
├── data/
├── layouts/
│
├── pages/
│   ├── admin/
│   └── karyawan/
│
├── store/
├── types/
├── utils/
├── App.tsx
├── index.css
└── main.tsx
```

---

📌 Status Project

✅ Login Email / WhatsApp
✅ OTP Demo
✅ Role-Based Access Control
✅ Dashboard Admin
✅ Dashboard Karyawan
✅ Manajemen Data Barang
✅ Monitoring Stok
✅ Stok Minimum Otomatis
✅ Manajemen Karyawan
✅ Pengajuan Permintaan ATK
✅ Persetujuan Admin
✅ Penolakan Permintaan
✅ Pengurangan Stok Otomatis
✅ Riwayat Permintaan
✅ Sistem Notifikasi
✅ Laporan Persediaan
✅ Export Excel
✅ Export PDF
✅ Protected Route
✅ Responsive Design
✅ LocalStorage
✅ Deployment Vercel

---

🔮 Pengembangan Selanjutnya

Sistem masih dapat dikembangkan dengan:

* 🗄️ Backend REST API
* 🐬 MySQL / PostgreSQL
* 🔐 Server-side Authentication
* 📲 OTP WhatsApp asli
* 📦 Stock Opname
* 🚚 Supplier Management
* 🛒 Purchase Order
* 📥 Barang Masuk
* 📤 Barang Keluar
* 🏷️ Barcode / QR Code
* 📷 Scanner Barcode
* 🔔 Real-Time Notification
* 💬 WhatsApp Notification
* 📧 Email Notification
* 📊 Advanced Inventory Analytics
* 📄 Laporan PDF lengkap
* 🔐 SSO / Active Directory

---

🎯 Tujuan Project

Project ini dibuat untuk menunjukkan kemampuan dalam membangun aplikasi inventory dan workflow operasional dengan:

* Modern UI/UX
* Responsive Web Design
* State Management
* Client-Side Routing
* Role-Based Access Control
* CRUD Data
* Inventory Management
* Stock Monitoring
* Approval Workflow
* Reporting
* Export Data
* LocalStorage
* Deployment Production

---

⚠️ Catatan

*Sistem Persediaan ATK merupakan prototype/demo portfolio.*

Data yang digunakan merupakan **data simulasi**, bukan data persediaan perusahaan asli.

Fitur login, OTP, data barang, permintaan, persetujuan, dan laporan pada versi saat ini masih menggunakan simulasi frontend dan LocalStorage.

Project ini masih dapat dikembangkan menjadi sistem inventory production dengan backend, database, autentikasi server, supplier management, purchase order, barcode, serta integrasi sistem perusahaan.

---

## 👨‍💻 Developer

*Khalilurrahman Mahdi*

Software Engineer / Full-Stack Developer

🔗 GitHub
[https://github.com/khalilurrahmanmahdi12](https://github.com/khalilurrahmanmahdi12)

---

⭐ Repository

Jika project ini menarik, jangan lupa kasih ⭐ pada repository.

🔗 **Sistem Persediaan ATK**
[https://github.com/khalilurrahmanmahdi12/Persediaan_ATK](https://github.com/khalilurrahmanmahdi12/Persediaan_ATK)
