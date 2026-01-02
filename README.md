# RFID Top-Up Prototype

Prototype aplikasi untuk demonstrasi integrasi Xendit Payment Gateway dengan sistem top-up saldo RFID Pertamina Retail.

## Tentang Proyek

Aplikasi ini mendemonstrasikan alur baru top-up saldo RFID menggunakan Virtual Account Xendit, menggantikan proses verifikasi manual yang sebelumnya dilakukan via IMPAZZ.

### Fitur Demo

- **Customer Portal**: Dashboard pelanggan, top-up via VA, riwayat transaksi
- **Admin Portal**: Dashboard admin, monitoring transaksi real-time
- **Simulasi Xendit**: Simulasi pembayaran yang langsung update saldo

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
| `/customer/topup` | Top-up saldo (demo simulasi) |
| `/customer/history` | Riwayat transaksi |
| `/customer/cards` | Daftar kartu RFID |
| `/admin` | Dashboard admin |
| `/admin/transactions` | Semua transaksi |
| `/admin/customers` | Daftar pelanggan |

## Cara Demo

1. Buka `/customer/topup`
2. Masukkan nominal top-up
3. Klik "Lanjutkan"
4. Klik "Simulasi Pembayaran Berhasil"
5. Tunggu 3 detik (simulasi webhook Xendit)
6. Saldo bertambah otomatis
7. Buka `/admin` di tab baru untuk lihat transaksi masuk

## Dokumentasi

Lihat folder `/docs` untuk dokumen proyek:

- [Problem Statement](./docs/01-problem-statement.md) - Ringkasan masalah dan solusi
- [Flow Comparison](./docs/02-flow-comparison.md) - Perbandingan alur lama vs baru

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
