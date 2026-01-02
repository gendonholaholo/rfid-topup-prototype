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
| `/admin/bank-api` | Simulasi Bank API |
| `/admin/file-import` | Import CSV rekening koran |
| `/admin/matching` | Matching Engine |
| `/admin/transactions` | Semua transaksi |
| `/admin/customers` | Daftar pelanggan |

## Cara Demo

1. Buka `/customer/topup`, submit laporan (VA: `8810012345678901`, Nominal: `10000000`)
2. Buka `/admin/bank-api`, hubungkan ke bank, simulasikan callback dengan VA dan nominal yang sama
3. Buka `/admin/matching`, klik "Jalankan Matching"
4. Verifikasi match yang ditemukan
5. Kembali ke `/customer`, saldo sudah bertambah

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

- Integrasi API Xendit yang sebenarnya
- Backend server untuk handle webhook
- Database untuk persistence
- Authentication & authorization
- Dan lain-lain

## Branding

Menggunakan warna Pertamina:
- Primary (Red): #E21A22
- Secondary (Blue): #0D47A1
