# Automation Engine Documentation

**Dokumen:** TECH-001
**Versi:** 1.0
**Tanggal:** 2 Januari 2026

---

## 1. Ringkasan

Automation Engine adalah sistem yang menggantikan proses verifikasi manual dengan mencocokkan data dari dua sumber:

1. **Webreport** - Data yang dilaporkan customer
2. **Bank Statement** - Data dari rekening koran bank

---

## 2. Arsitektur Sistem

### 2.1 Komponen Utama

| Komponen | Fungsi | Lokasi |
|----------|--------|--------|
| Matching Engine | Algoritma pencocokan VA + Nominal | `/src/lib/engine/matching-engine.ts` |
| File Parser | Parser CSV rekening koran | `/src/lib/engine/file-parser.ts` |
| REST API | Endpoint untuk semua operasi | `/src/app/api/*` |
| Zustand Store | State management | `/src/store/useStore.ts` |

### 2.2 Alur Data

| Step | Dari | Ke | Data |
|------|------|-----|------|
| 1 | Customer | Webreport | VA, Nominal, Tanggal, Bank |
| 2a | Bank API | IMPAZZ | VA, Nominal, Tanggal (real-time) |
| 2b | File CSV | IMPAZZ | VA, Nominal, Tanggal (batch) |
| 3 | Matching Engine | Database | Match Result |
| 4 | Admin | System | Verify/Reject |
| 5 | System | Customer | Balance Updated |

---

## 3. Sumber Data Bank Statement

### 3.1 Opsi A: Bank API Integration

**Kelebihan:**
- Real-time notification
- Otomatis tanpa intervensi manual

**Kekurangan:**
- Perlu partnership dengan bank
- Setup lebih kompleks

**Simulasi di Prototype:**
- Halaman `/admin/bank-api`
- Simulasi callback API dengan form input

### 3.2 Opsi B: File Import (CSV)

**Kelebihan:**
- Tidak perlu integrasi API bank
- Bisa menggunakan export dari internet banking

**Kekurangan:**
- Semi-manual (perlu admin upload)
- Ada delay antara transaksi dan import

**Format CSV:**

| Kolom | Wajib | Keterangan |
|-------|-------|------------|
| virtual_account | Ya | Nomor VA |
| amount | Ya | Nominal transfer |
| date | Ya | Tanggal (YYYY-MM-DD) |
| sender_name | Tidak | Nama pengirim |
| reference | Tidak | Nomor referensi |

**Contoh:**
```csv
virtual_account,amount,date,sender_name,reference
8810012345678901,10000000,2026-01-02,PT ABC Indonesia,TRF-001
```

---

## 4. Algoritma Matching

### 4.1 Kriteria Pencocokan

| Kriteria | Bobot | Keterangan |
|----------|-------|------------|
| VA Match | 50% | VA harus sama persis |
| Amount Match | 40% | Nominal harus sama persis |
| Date Proximity | 10% | Semakin dekat tanggalnya, semakin tinggi skor |

### 4.2 Threshold Status

| Score | Status | Tindakan |
|-------|--------|----------|
| 90-100 | Auto Match | Otomatis masuk queue verifikasi |
| 50-89 | Manual Review | Perlu review manual |
| 0-49 | No Match | Tidak dicocokkan |

### 4.3 Contoh Perhitungan

**Webreport:**
- VA: 8810012345678901
- Amount: Rp 10.000.000
- Date: 2026-01-02 09:00

**Bank Statement:**
- VA: 8810012345678901
- Amount: Rp 10.000.000
- Date: 2026-01-02 09:15

**Hasil:**
- VA Match: Ya (50 poin)
- Amount Match: Ya (40 poin)
- Date Proximity: 0.25 jam (9.75 poin)
- **Total: 99.75 poin → Auto Match**

---

## 5. REST API Endpoints

### 5.1 Webreport API

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/webreport` | List semua submission |
| POST | `/api/webreport` | Buat submission baru |
| DELETE | `/api/webreport` | Clear all (testing) |

**POST Request Body:**
```json
{
  "customerId": "CUST-001",
  "virtualAccountNumber": "8810012345678901",
  "amount": 10000000,
  "transferDate": "2026-01-02T09:00:00.000Z",
  "bankSender": "BCA",
  "notes": "Top-up Januari"
}
```

### 5.2 Bank Statement API

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/bank-statement` | List semua statement |
| POST | `/api/bank-statement?mode=api` | Input dari Bank API |
| POST | `/api/bank-statement?mode=file_import` | Import dari file |
| DELETE | `/api/bank-statement` | Clear all (testing) |

**POST (API Mode) Request Body:**
```json
{
  "bankCode": "BCA",
  "accountNumber": "1234567890",
  "virtualAccountNumber": "8810012345678901",
  "amount": 10000000,
  "transactionDate": "2026-01-02T09:00:00.000Z",
  "senderName": "PT ABC Indonesia"
}
```

**POST (File Import Mode) Request Body:**
```json
{
  "bankCode": "BCA",
  "accountNumber": "1234567890",
  "statements": [
    {
      "virtualAccountNumber": "8810012345678901",
      "amount": 10000000,
      "transactionDate": "2026-01-02T09:00:00.000Z",
      "senderName": "PT ABC Indonesia"
    }
  ]
}
```

### 5.3 Matching API

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/matching` | List matching results |
| POST | `/api/matching` | Create match result |
| PATCH | `/api/matching` | Verify/Reject match |
| DELETE | `/api/matching` | Clear all (testing) |

**PATCH Request Body:**
```json
{
  "matchingResultId": "MR-ABC123",
  "action": "approve",
  "verifiedBy": "Admin",
  "notes": "Verified manually"
}
```

---

## 6. Cara Demo

### 6.1 Flow Lengkap

| Step | Halaman | Aksi |
|------|---------|------|
| 1 | `/customer/topup` | Customer submit laporan top-up |
| 2a | `/admin/bank-api` | Admin simulasi callback bank API |
| 2b | `/admin/file-import` | Atau admin upload CSV rekening koran |
| 3 | `/admin/matching` | Admin klik "Jalankan Matching" |
| 4 | `/admin/matching` | Admin verifikasi match yang ditemukan |
| 5 | `/customer` | Saldo customer bertambah |

### 6.2 Quick Demo

1. Buka `/customer/topup`
2. Isi: VA = `8810012345678901`, Nominal = `10000000`
3. Submit

4. Buka tab baru `/admin/bank-api`
5. Hubungkan ke bank
6. Isi VA dan nominal yang sama, klik "Kirim Callback"

7. Buka `/admin/matching`
8. Klik "Jalankan Matching"
9. Verifikasi match yang ditemukan

10. Kembali ke `/customer`, saldo sudah bertambah

---

## 7. Konfigurasi

### 7.1 Matching Config

Konfigurasi dapat diubah di `/src/lib/engine/matching-engine.ts`:

| Parameter | Default | Keterangan |
|-----------|---------|------------|
| dateToleranceHours | 24 | Toleransi waktu dalam jam |
| autoMatchThreshold | 90 | Skor minimum untuk auto match |
| manualReviewThreshold | 50 | Skor minimum untuk manual review |

---

## 8. Limitasi Prototype

| Fitur | Status | Keterangan |
|-------|--------|------------|
| Database | In-memory | Data hilang saat refresh |
| Authentication | Tidak ada | Tidak ada login |
| Bank API | Simulasi | Bukan API bank asli |
| File Upload | Client-side | Tidak ada server storage |

---

**Dokumen ini adalah bagian dari deliverables proyek RFID Top-Up Enhancement.**
