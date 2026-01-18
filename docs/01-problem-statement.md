# RFID Top-Up System Enhancement
## Problem Statement & Solution Overview

**Dokumen:** PRD-001
**Versi:** 2.0
**Tanggal:** 2 Januari 2026
**Status:** Draft untuk Review Client

---

## 1. Executive Summary

Dokumen ini merangkum permasalahan pada sistem top-up saldo RFID untuk pembelian BBK (BBM Non-Subsidi) di Pertamina Retail, serta solusi yang diusulkan menggunakan **Automation Engine** untuk verifikasi otomatis.

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

### 4.1 Automation Engine

Mengimplementasikan **Automation Engine** yang mencocokkan data dari dua sumber:
1. **Webreport** - Laporan top-up dari customer (VA + Nominal)
2. **Rekening Koran Bank** - Data transaksi dari bank (VA + Nominal)

Engine akan otomatis mencocokkan kedua data berdasarkan:
- Virtual Account Number
- Nominal Transfer
- Kedekatan Waktu Transaksi

### 4.2 Keunggulan Solusi

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| **Waktu Proses** | 1-24 jam | < 5 menit (setelah data bank masuk) |
| **Verifikasi** | Manual oleh admin | Semi-otomatis dengan matching engine |
| **Akurasi** | Rentan human error | Scoring algorithm 90%+ akurat |
| **Audit Trail** | Manual | Otomatis tercatat |

### 4.3 Komponen yang Berubah

| Komponen | Status | Keterangan |
|----------|--------|------------|
| Kartu RFID | Tetap | Tidak ada perubahan |
| Webreport | Tetap | Fungsi lain tetap berjalan |
| IMPAZZ | Modifikasi | Ditambah Automation Engine |
| Bank Integration | Baru | Webhook API atau File Import |

---

## 5. Sumber Data Rekening Koran

### 5.1 Opsi A: Bank Webhook (Real-time)

Bank mengirim notifikasi otomatis ke IMPAZZ setiap ada transaksi masuk.

| Kelebihan | Kekurangan |
|-----------|------------|
| Real-time | Perlu partnership dengan bank |
| Fully automated | Setup lebih kompleks |

### 5.2 Opsi B: File Import (Batch)

Admin mengexport rekening koran dari internet banking dan upload ke IMPAZZ.

| Kelebihan | Kekurangan |
|-----------|------------|
| Tidak perlu integrasi bank | Semi-manual |
| Bisa langsung digunakan | Ada delay |

**Rekomendasi:** Mulai dengan **File Import**, kemudian upgrade ke **Webhook** jika ada partnership bank.

---

## 6. Scope Pengerjaan

### 6.1 Dalam Scope

- Prototype demonstrasi flow baru
- Dokumentasi teknis Automation Engine
- Spesifikasi API untuk IMPAZZ

### 6.2 Di Luar Scope (Perlu Akses Lebih Lanjut)

- Modifikasi langsung ke IMPAZZ
- Modifikasi langsung ke Webreport
- Integrasi API bank production

---

## 7. Asumsi & Dependensi

### 7.1 Asumsi

1. IMPAZZ memiliki atau dapat dikembangkan endpoint untuk menerima data
2. Pelanggan akan diberikan edukasi mengenai flow baru
3. Bank statement tersedia dalam format yang dapat diproses (CSV)

### 7.2 Dependensi

1. Akses ke dokumentasi API IMPAZZ
2. Format export rekening koran dari bank
3. Keputusan management terkait integrasi bank

---

## 8. Keputusan yang Sudah Disepakati

| No | Keputusan | Tanggal |
|----|-----------|---------|
| 1 | Menggunakan Automation Engine (bukan Xendit) | 2 Jan 2026 |
| 2 | Support 2 mode: Webhook + File Import | 2 Jan 2026 |
| 3 | Webreport tetap digunakan | 2 Jan 2026 |

---

## 9. Lampiran

- Dokumen Flow Comparison (02-flow-comparison.md)
- Dokumentasi Automation Engine (03-automation-engine.md)
- Prototype Application (README.md)

---

**Disiapkan oleh:** Tim Development
**Review oleh:** [Nama Client]
**Approval:** [Pending]
