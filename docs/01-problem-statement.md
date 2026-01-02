# RFID Top-Up System Enhancement
## Problem Statement & Solution Overview

**Dokumen:** PRD-001
**Versi:** 1.0
**Tanggal:** 2 Januari 2026
**Status:** Draft untuk Review Client

---

## 1. Executive Summary

Dokumen ini merangkum permasalahan pada sistem top-up saldo RFID untuk pembelian BBK (BBM Non-Subsidi) di Pertamina Retail, serta solusi yang diusulkan menggunakan Payment Gateway Xendit.

---

## 2. Latar Belakang

### 2.1 Sistem Saat Ini

Pertamina Retail menggunakan kartu RFID untuk transaksi pembelian BBK oleh pelanggan korporat. Sistem terdiri dari:

| Komponen | Fungsi |
|----------|--------|
| **Kartu RFID** | Alat pembayaran di SPBU |
| **Webreport** | Portal pelanggan untuk upload bukti transfer |
| **IMPAZZ** | Portal admin untuk verifikasi manual |

### 2.2 Alur Proses Saat Ini

```
Pelanggan Transfer --> Upload Bukti di Webreport --> Admin Verifikasi di IMPAZZ --> Saldo Bertambah
```

**Estimasi waktu:** 1-24 jam (tergantung antrian verifikasi)

---

## 3. Permasalahan yang Diidentifikasi

### 3.1 Masalah Utama

| No | Masalah | Dampak |
|----|---------|--------|
| 1 | **Verifikasi Manual** | Admin harus cek satu per satu bukti transfer |
| 2 | **Time Lag** | Saldo tidak langsung bertambah setelah transfer |
| 3 | **Human Error** | Risiko double approval atau terlewat |
| 4 | **Tidak Scalable** | Beban kerja admin bertambah seiring pertumbuhan pelanggan |

### 3.2 Pain Points dari Perspektif User

**Pelanggan:**
- Harus menunggu verifikasi manual
- Tidak ada kepastian kapan saldo bertambah
- Proses tidak transparan

**Admin:**
- Beban kerja tinggi untuk verifikasi
- Risiko kesalahan manusia
- Tidak ada audit trail otomatis

---

## 4. Solusi yang Diusulkan

### 4.1 Integrasi Payment Gateway (Xendit)

Mengimplementasikan Virtual Account melalui Xendit untuk menggantikan proses verifikasi manual.

### 4.2 Keunggulan Solusi

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| **Waktu Proses** | 1-24 jam | Real-time (< 1 menit) |
| **Verifikasi** | Manual oleh admin | Otomatis oleh sistem |
| **Akurasi** | Rentan human error | 100% akurat |
| **Audit Trail** | Manual | Otomatis tercatat |

### 4.3 Komponen yang Berubah

| Komponen | Status | Keterangan |
|----------|--------|------------|
| Kartu RFID | Tetap | Tidak ada perubahan |
| Webreport | Tetap | Fungsi lain tetap berjalan, hanya flow top-up berubah |
| IMPAZZ | Modifikasi | Menerima webhook dari Xendit, verifikasi otomatis |
| Xendit | Baru | Payment gateway untuk Virtual Account |

---

## 5. Jenis Virtual Account

### 5.1 Rekomendasi: Fixed Virtual Account

Setiap pelanggan mendapat nomor VA tetap yang bisa digunakan berulang kali.

**Contoh:**
```
PT ABC Indonesia --> VA: 1234567890123456
PT XYZ Logistics --> VA: 1234567890123457
```

**Keuntungan:**
- Pelanggan cukup simpan 1 nomor VA
- Proses top-up lebih cepat (tidak perlu generate VA baru)
- Mudah diintegrasikan dengan sistem ERP pelanggan

### 5.2 Alternatif: Single-Use Virtual Account

VA baru di-generate setiap kali ada permintaan top-up.

**Kapan digunakan:**
- Jika ada kebutuhan 1 VA = 1 transaksi
- Untuk nominal yang harus exact match

---

## 6. Scope Pengerjaan

### 6.1 Dalam Scope

- Prototype demonstrasi flow baru
- Dokumentasi teknis integrasi
- Spesifikasi API untuk IMPAZZ

### 6.2 Di Luar Scope (Perlu Akses Lebih Lanjut)

- Modifikasi langsung ke IMPAZZ
- Modifikasi langsung ke Webreport
- Setup akun production Xendit

---

## 7. Asumsi & Dependensi

### 7.1 Asumsi

1. IMPAZZ memiliki atau dapat dikembangkan endpoint untuk menerima webhook
2. Pelanggan akan diberikan edukasi mengenai flow baru
3. Xendit dipilih sebagai payment gateway

### 7.2 Dependensi

1. Akses ke dokumentasi API IMPAZZ
2. Kredensial Xendit (sandbox untuk testing, production untuk live)
3. Keputusan management terkait Fixed VA vs Single-Use VA

---

## 8. Keputusan yang Sudah Disepakati

| No | Keputusan | Tanggal |
|----|-----------|---------|
| 1 | Menggunakan Fixed Virtual Account | 2 Jan 2026 |
| 2 | Webreport tetap digunakan (fungsi lain tetap berjalan) | 2 Jan 2026 |
| 3 | Fokus prototype pada flow Xendit --> IMPAZZ | 2 Jan 2026 |

---

## 9. Lampiran

- Dokumen Flow Comparison (02-flow-comparison.md)
- Prototype Application (README.md)

---

**Disiapkan oleh:** Tim Development
**Review oleh:** [Nama Client]
**Approval:** [Pending]
