# Flow Comparison Document

**Perbandingan Alur Sistem Lama vs Sistem Baru**

| | |
|---|---|
| **Dokumen** | FLOW-001 |
| **Versi** | 1.0 |
| **Tanggal** | 2 Januari 2026 |

---

## 1. Ringkasan Perubahan

| Aspek | Sistem Lama | Sistem Baru |
|-------|-------------|-------------|
| Metode Pembayaran | Transfer Bank + Upload Bukti | Transfer ke Virtual Account |
| Verifikasi | Manual oleh Admin | Otomatis via Webhook |
| Waktu Proses | 1-24 jam | Real-time (< 1 menit) |
| Portal yang Digunakan | Webreport + IMPAZZ | IMPAZZ (webhook receiver) |

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

### 3.1 Langkah-Langkah Proses

| Step | Aktor | Aksi | Estimasi Waktu |
|------|-------|------|----------------|
| 1 | Pelanggan | Transfer ke Virtual Account via mobile/internet banking | 5 menit |
| 2 | Xendit | Mendeteksi pembayaran masuk secara otomatis | Instant |
| 3 | Xendit | Mengirim webhook notification ke IMPAZZ | < 10 detik |
| 4 | IMPAZZ | Memproses webhook, validasi data pembayaran | < 5 detik |
| 5 | IMPAZZ | Update saldo kartu RFID secara otomatis | Instant |
| 6 | Pelanggan | Saldo bertambah, kartu RFID bisa digunakan | - |

### 3.2 Waktu Total Proses

| Skenario | Waktu |
|----------|-------|
| Total | Kurang dari 1 menit |

### 3.3 Keunggulan Sistem Baru

| No | Keunggulan |
|----|------------|
| 1 | Tidak perlu upload bukti transfer |
| 2 | Tidak perlu verifikasi manual oleh admin |
| 3 | Real-time processing |
| 4 | Audit trail otomatis tersimpan di sistem |
| 5 | Tidak ada risiko human error |

---

## 4. Perbandingan Virtual Account

### 4.1 Opsi A: VA Langsung dari Bank

**Alur:**
Pelanggan → Bank → ??? → IMPAZZ

**Masalah:**

| No | Masalah |
|----|---------|
| 1 | Setiap bank memiliki sistem notifikasi yang berbeda |
| 2 | Perlu integrasi terpisah ke masing-masing bank |
| 3 | Maintenance menjadi kompleks |
| 4 | Tidak ada standarisasi format data |

### 4.2 Opsi B: VA Melalui Xendit (Rekomendasi)

**Alur:**
Pelanggan → Bank → Xendit → IMPAZZ

**Keuntungan:**

| No | Keuntungan |
|----|------------|
| 1 | Xendit menangani semua bank |
| 2 | Cukup 1 integrasi untuk semua bank |
| 3 | Format webhook standar dan konsisten |
| 4 | Dashboard monitoring tersedia |
| 5 | Support dan dokumentasi lengkap |

### 4.3 Bank yang Didukung Xendit

| Bank | Kode Bank | Format VA |
|------|-----------|-----------|
| BCA | BCA | 10 digit + prefix |
| Mandiri | MANDIRI | 13 digit |
| BNI | BNI | 12 digit |
| BRI | BRI | 15 digit |
| Permata | PERMATA | 16 digit |
| CIMB Niaga | CIMB | 14 digit |

---

## 5. Contoh Skenario

### 5.1 Skenario: PT ABC Indonesia Top-Up Rp 10.000.000

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

**Dengan Sistem Baru:**

| Waktu | Aktivitas |
|-------|-----------|
| 09:00 | PT ABC transfer Rp 10.000.000 ke VA 1234567890123456 |
| 09:00 | Xendit mendeteksi pembayaran |
| 09:00 | Xendit mengirim webhook ke IMPAZZ |
| 09:00 | IMPAZZ memproses dan update saldo otomatis |
| 09:00 | Saldo RFID bertambah |
| **Total** | **Kurang dari 1 menit** |

---

## 6. Spesifikasi Teknis Webhook

### 6.1 Request dari Xendit ke IMPAZZ

Xendit akan mengirimkan HTTP POST request ke endpoint IMPAZZ dengan payload berikut:

| Field | Tipe | Contoh | Keterangan |
|-------|------|--------|------------|
| id | string | "579c8d61f23fa4ca35e52da4" | ID unik dari Xendit |
| external_id | string | "VA-001-PTABC" | ID referensi dari merchant |
| bank_code | string | "BCA" | Kode bank yang digunakan |
| name | string | "PT ABC Indonesia" | Nama pemilik VA |
| account_number | string | "1234567890123456" | Nomor Virtual Account |
| balance | number | 10000000 | Nominal yang dibayarkan |
| payment_id | string | "1502450097080" | ID pembayaran |
| transaction_timestamp | string | "2026-01-02T09:00:00.000Z" | Waktu transaksi (ISO 8601) |

### 6.2 Expected Response dari IMPAZZ

| Field | Tipe | Contoh |
|-------|------|--------|
| status | string | "success" |
| message | string | "Payment processed" |

---

## 7. Posisi Webreport dalam Sistem Baru

### 7.1 Fungsi Webreport

| Fungsi | Status di Sistem Baru |
|--------|----------------------|
| Monitoring saldo RFID | **Tetap aktif** |
| Riwayat transaksi | **Tetap aktif** |
| Manajemen kartu RFID | **Tetap aktif** |
| Laporan penggunaan | **Tetap aktif** |
| Upload bukti transfer | **Tidak diperlukan lagi** |

### 7.2 Alur Top-Up Baru untuk Pelanggan

| Step | Aktivitas |
|------|-----------|
| 1 | Pelanggan login ke Webreport |
| 2 | Pelanggan melihat nomor Virtual Account (Fixed VA) |
| 3 | Pelanggan transfer ke VA tersebut dari bank manapun |
| 4 | Saldo otomatis bertambah (refresh halaman untuk melihat update) |

---

## 8. Diagram Arsitektur

### 8.1 Komponen Sistem

| Komponen | Fungsi | Catatan |
|----------|--------|---------|
| **Webreport** | Portal pelanggan untuk view VA dan saldo | Tetap digunakan |
| **Mobile Banking** | Aplikasi bank untuk transfer ke VA | Milik pelanggan |
| **Xendit** | Payment gateway, menerima pembayaran dan kirim webhook | Baru |
| **IMPAZZ** | Backend system, terima webhook dan update saldo | Perlu modifikasi |
| **Database RFID** | Penyimpanan data saldo kartu | Existing |

### 8.2 Alur Data

| Dari | Ke | Data yang Dikirim |
|------|-----|-------------------|
| Pelanggan | Mobile Banking | Instruksi transfer ke VA |
| Mobile Banking | Bank | Request transfer |
| Bank | Xendit | Notifikasi pembayaran masuk |
| Xendit | IMPAZZ | Webhook dengan detail pembayaran |
| IMPAZZ | Database RFID | Update saldo kartu |
| Webreport | Database RFID | Query saldo terbaru |

---

## 9. Timeline Implementasi (High-Level)

| Fase | Aktivitas | Dependensi |
|------|-----------|------------|
| 1 | Setup akun Xendit Sandbox | - |
| 2 | Develop webhook receiver di IMPAZZ | Akses ke source code IMPAZZ |
| 3 | Testing end-to-end di Sandbox | Fase 1 dan 2 selesai |
| 4 | Setup akun Xendit Production | Approval dari management |
| 5 | UAT dengan pilot customer | Fase 3 dan 4 selesai |
| 6 | Rollout ke semua customer | Fase 5 selesai |

---

## 10. Lampiran

### 10.1 Dokumen Terkait

| Dokumen | Keterangan |
|---------|------------|
| 01-problem-statement.md | Problem Statement dan Solution Overview |
| README.md | Dokumentasi Prototype Application |

### 10.2 Referensi

| Referensi | Link |
|-----------|------|
| Dokumentasi Xendit VA | https://developers.xendit.co/api-reference/#virtual-accounts |
| Xendit Dashboard | https://dashboard.xendit.co |

---

**Dokumen ini adalah bagian dari deliverables proyek RFID Top-Up Enhancement.**

*Disiapkan oleh: Tim Development*
