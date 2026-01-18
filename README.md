# RFID Top-Up Prototype

Prototype aplikasi untuk demonstrasi Automation Engine verifikasi top-up saldo RFID Pertamina Retail.

## Tentang Proyek

Aplikasi ini mendemonstrasikan alur baru top-up saldo RFID menggunakan Automation Engine yang mencocokkan data Webreport (customer) dengan Rekening Koran (bank), menggantikan proses verifikasi manual di IMPAZZ.

### Fitur Demo

- **Customer Portal**: Dashboard, submit laporan top-up, riwayat
- **Admin Portal**: Bank API simulator, File Import CSV, Matching Engine
- **Automation Engine**: Matching VA + Nominal dari 2 sumber data

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Halaman yang Tersedia

| URL | Deskripsi |
|-----|-----------|
| `/customer` | Dashboard pelanggan |
| `/customer/topup` | Submit laporan top-up |
| `/customer/history` | Riwayat transaksi |
| `/customer/cards` | Daftar kartu RFID |
| `/admin` | Dashboard admin |
| `/admin/integration-demo` | Demo integrasi bank (Webhook & File Import) |
| `/admin/matching` | Matching Engine |
| `/admin/transactions` | Semua transaksi |
| `/admin/customers` | Daftar pelanggan |

## Cara Demo

### Skenario A: Webhook (Real-time)
1. Buka `/customer/topup`, submit laporan (VA: `8810012345678901`, Nominal: `10000000`)
2. Buka `/admin/integration-demo`, pilih tab "Webhook"
3. Di panel "Sisi Bank", isi VA dan Nominal yang sama, klik "Push ke IMPAZZ"
4. Lihat activity feed di panel "Sisi IMPAZZ"
5. Buka `/admin/matching`, klik "Jalankan Matching"
6. Verifikasi match yang ditemukan
7. Kembali ke `/customer`, saldo sudah bertambah

### Skenario B: File Import (Batch)
1. Buka `/customer/topup`, submit laporan top-up
2. Buka `/admin/integration-demo`, pilih tab "File Import"
3. Download template CSV, isi data, upload kembali
4. Buka `/admin/matching`, jalankan matching
5. Verifikasi dan saldo customer bertambah

## Dokumentasi

Lihat folder `/docs` untuk dokumen proyek:

- [Problem Statement](./docs/01-problem-statement.md) - Ringkasan masalah dan solusi
- [Flow Comparison](./docs/02-flow-comparison.md) - Perbandingan alur lama vs baru
- [Automation Engine](./docs/03-automation-engine.md) - Dokumentasi teknis engine

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Zustand (state management)
- Lucide React (icons)

## Catatan

Ini adalah **prototype untuk demonstrasi** dan bukan production-ready application. Untuk implementasi production, diperlukan:

- Integrasi API Bank untuk webhook real-time
- Backend server untuk handle webhook
- Database untuk persistence
- Authentication & authorization

## Branding

Menggunakan warna Pertamina:
- Primary (Red): #E21A22
- Secondary (Blue): #0D47A1
