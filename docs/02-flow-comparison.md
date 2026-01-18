# Flow Comparison Document

**Perbandingan Alur Sistem Lama vs Sistem Baru**

| | |
|---|---|
| **Dokumen** | FLOW-001 |
| **Versi** | 2.0 |
| **Tanggal** | 2 Januari 2026 |

---

## 1. Ringkasan Perubahan

| Aspek | Sistem Lama | Sistem Baru |
|-------|-------------|-------------|
| Metode Pembayaran | Transfer Bank + Upload Bukti | Transfer ke VA + Laporan di Webreport |
| Verifikasi | Manual oleh Admin | Semi-otomatis dengan Automation Engine |
| Waktu Proses | 1-24 jam | < 5 menit (setelah matching) |
| Input Data Bank | Cek mutasi manual | Webhook API atau File Import |

---

## 2. Alur Sistem Lama (Current State)

### 2.1 Langkah-Langkah Proses

| Step | Aktor | Aksi | Estimasi Waktu |
|------|-------|------|----------------|
| 1 | Pelanggan | Transfer ke rekening Pertamina via mobile/internet banking | 5 menit |
| 2 | Pelanggan | Screenshot bukti transfer | 1 menit |
| 3 | Pelanggan | Login ke Webreport, upload bukti transfer | 5 menit |
| 4 | Sistem | Mengirim notifikasi ke admin bahwa ada upload baru | Instant |
| 5 | Admin | Membuka IMPAZZ, cek bukti transfer di mutasi bank | 5-60 menit |
| 6 | Admin | Approve atau reject permintaan top-up di IMPAZZ | 2 menit |
| 7 | Sistem | Update saldo kartu RFID | Instant |
| 8 | Pelanggan | Saldo bertambah, kartu RFID bisa digunakan | - |

### 2.2 Waktu Total Proses

| Skenario | Waktu |
|----------|-------|
| Minimum | 20 menit |
| Rata-rata | 1-4 jam |
| Maksimum | 24 jam (jika ada antrian atau di luar jam kerja) |

### 2.3 Titik Masalah yang Diidentifikasi

| No | Langkah | Masalah |
|----|---------|---------|
| 1 | Step 5 | **Bottleneck utama** - verifikasi manual memakan waktu |
| 2 | Step 5 | **Risiko human error** - potensi double approval atau terlewat |
| 3 | Step 2-3 | **Beban pelanggan** - harus screenshot dan upload manual |

---

## 3. Alur Sistem Baru (Future State)

### 3.1 Skenario A: Bank Webhook (Real-time)

| Step | Aktor | Aksi | Estimasi Waktu |
|------|-------|------|----------------|
| 1 | Pelanggan | Transfer ke VA via mobile/internet banking | 5 menit |
| 2 | Pelanggan | Submit laporan di Webreport (VA + Nominal) | 2 menit |
| 3 | Bank | Kirim webhook ke IMPAZZ (otomatis) | < 1 menit |
| 4 | IMPAZZ | Matching Engine mencocokkan data | < 10 detik |
| 5 | Admin | Verifikasi match (1 klik) | 1 menit |
| 6 | Sistem | Update saldo kartu RFID | Instant |

**Total waktu:** < 10 menit

### 3.2 Skenario B: File Import (Batch)

| Step | Aktor | Aksi | Estimasi Waktu |
|------|-------|------|----------------|
| 1 | Pelanggan | Transfer ke VA via mobile/internet banking | 5 menit |
| 2 | Pelanggan | Submit laporan di Webreport (VA + Nominal) | 2 menit |
| 3 | Admin | Export rekening koran dari internet banking | 2 menit |
| 4 | Admin | Upload CSV ke IMPAZZ | 1 menit |
| 5 | IMPAZZ | Matching Engine mencocokkan data | < 10 detik |
| 6 | Admin | Verifikasi match (1 klik) | 1 menit |
| 7 | Sistem | Update saldo kartu RFID | Instant |

**Total waktu:** < 15 menit (tergantung jadwal import)

### 3.3 Keunggulan Sistem Baru

| No | Keunggulan |
|----|------------|
| 1 | Tidak perlu upload bukti transfer (gambar) |
| 2 | Matching otomatis berdasarkan VA + Nominal |
| 3 | Admin hanya perlu verifikasi 1 klik |
| 4 | Audit trail otomatis tersimpan |
| 5 | Scoring system untuk deteksi anomali |

---

## 4. Perbandingan Sumber Data Bank

### 4.1 Opsi A: Bank Webhook (Partnership)

**Alur:**
```
Pelanggan → Bank → Webhook → IMPAZZ → Matching
```

| Kelebihan | Kekurangan |
|-----------|------------|
| Real-time | Perlu partnership dengan bank |
| Fully automated | Setup lebih kompleks |
| Minimal intervensi admin | Biaya integrasi |

### 4.2 Opsi B: File Import CSV

**Alur:**
```
Pelanggan → Bank → Export CSV → Admin Upload → IMPAZZ → Matching
```

| Kelebihan | Kekurangan |
|-----------|------------|
| Tidak perlu integrasi bank | Semi-manual |
| Bisa langsung digunakan | Ada delay |
| Biaya rendah | Perlu jadwal import rutin |

### 4.3 Rekomendasi Implementasi

| Fase | Pendekatan | Alasan |
|------|------------|--------|
| Fase 1 | File Import | Quick win, bisa langsung digunakan |
| Fase 2 | Bank Webhook | Upgrade jika ada partnership bank |

---

## 5. Contoh Skenario

### 5.1 PT ABC Indonesia Top-Up Rp 10.000.000

**Dengan Sistem Lama:**

| Waktu | Aktivitas |
|-------|-----------|
| 09:00 | PT ABC transfer Rp 10.000.000 ke rekening Pertamina |
| 09:05 | Staff PT ABC screenshot bukti transfer |
| 09:10 | Staff login Webreport dan upload bukti |
| 09:15 | Admin menerima notifikasi |
| 10:30 | Admin selesai cek mutasi bank (ada antrian) |
| 10:35 | Admin approve di IMPAZZ |
| 10:35 | Saldo RFID bertambah |
| **Total** | **1 jam 35 menit** |

**Dengan Sistem Baru (Skenario Webhook):**

| Waktu | Aktivitas |
|-------|-----------|
| 09:00 | PT ABC transfer Rp 10.000.000 ke VA |
| 09:02 | Staff submit laporan di Webreport |
| 09:02 | Bank mengirim webhook ke IMPAZZ |
| 09:02 | Matching Engine menemukan match (Score: 99.75) |
| 09:05 | Admin verifikasi dengan 1 klik |
| 09:05 | Saldo RFID bertambah |
| **Total** | **5 menit** |

---

## 6. Automation Engine: Cara Kerja

### 6.1 Input Data

| Sumber | Data yang Dikirim |
|--------|-------------------|
| Webreport (Customer) | VA, Nominal, Tanggal, Bank |
| Rekening Koran (Bank) | VA, Nominal, Tanggal, Pengirim |

### 6.2 Algoritma Matching

| Kriteria | Bobot | Keterangan |
|----------|-------|------------|
| VA Match | 50% | Virtual Account harus sama |
| Amount Match | 40% | Nominal harus sama |
| Date Proximity | 10% | Semakin dekat tanggal, skor lebih tinggi |

### 6.3 Hasil Matching

| Score | Status | Tindakan |
|-------|--------|----------|
| 90-100 | Auto Match | Langsung masuk queue verifikasi |
| 50-89 | Manual Review | Admin perlu review detail |
| 0-49 | No Match | Tidak dicocokkan |

---

## 7. Posisi Webreport dalam Sistem Baru

### 7.1 Fungsi Webreport

| Fungsi | Status di Sistem Baru |
|--------|----------------------|
| Monitoring saldo RFID | **Tetap aktif** |
| Riwayat transaksi | **Tetap aktif** |
| Manajemen kartu RFID | **Tetap aktif** |
| Laporan penggunaan | **Tetap aktif** |
| Submit laporan top-up | **Tetap aktif** (tanpa upload gambar) |

---

## 8. Diagram Visual

### 8.1 Alur Sistem Baru

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  CUSTOMER   │     │    BANK     │     │   IMPAZZ    │     │   OUTPUT    │
├─────────────┤     ├─────────────┤     ├─────────────┤     ├─────────────┤
│ 1. Transfer │────►│ 2. Process  │────►│ 3. Receive  │     │             │
│    ke VA    │     │    Payment  │     │    Data     │     │             │
│             │     │             │     │             │     │             │
│ 4. Submit   │────────────────────────►│ 5. Matching │────►│ 6. Saldo    │
│    Laporan  │     │             │     │    Engine   │     │    Update   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

---

## 9. Lampiran

### 9.1 Dokumen Terkait

| Dokumen | Keterangan |
|---------|------------|
| 01-problem-statement.md | Problem Statement dan Solution Overview |
| 03-automation-engine.md | Dokumentasi Teknis Automation Engine |
| README.md | Dokumentasi Prototype Application |

---

**Dokumen ini adalah bagian dari deliverables proyek RFID Top-Up Enhancement.**

*Disiapkan oleh: Tim Development*
