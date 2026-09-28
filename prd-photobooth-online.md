# PRD — Website Photobooth Online "Snapie" 📸💕

> Nama produk bersifat sementara (working title). Ganti sesuai brand.

| Item | Detail |
|---|---|
| Versi | 1.0 (Draft) |
| Tanggal | 28 September 2026 |
| Tipe Produk | Web app (mobile-first, responsif) |
| Platform | Browser modern (Chrome, Safari, Edge, Firefox) di HP & desktop |
| Status | Draft untuk review |

---

## 1. Ringkasan Produk

Snapie adalah website photobooth online: pengguna membuka website, mengizinkan kamera, mengambil beberapa foto berurutan (dengan hitung mundur), memilih **layout kolase**, memilih **desain bingkai** bertema lucu, romantis, dan keren, lalu **mengekspor hasilnya** sebagai gambar rapi (PNG/JPG) siap dibagikan atau dicetak.

Tanpa instalasi, tanpa akun, dan **foto diproses di browser** (tidak diunggah ke server) sehingga cepat dan privasi terjaga.

## 2. Latar Belakang & Masalah

- Photobooth fisik terbatas lokasi, antre, dan berbayar.
- Aplikasi kolase biasa terasa rumit: harus edit manual, atur posisi, dan hasil sering tidak simetris.
- Pengguna (terutama Gen Z, pasangan, dan komunitas) ingin pengalaman photobooth ala foto strip yang **instan, estetik, dan mudah dibagikan**.

## 3. Tujuan & Metrik Keberhasilan

### Tujuan
1. Alur end-to-end dari buka website sampai unduh hasil selesai **< 2 menit**.
2. Hasil ekspor **rapi, simetris, dan berkualitas tinggi** tanpa perlu edit manual.
3. Visual yang lucu, romantis, dan keren sehingga orang ingin membagikannya.

### Metrik (KPI)
| Metrik | Target |
|---|---|
| Completion rate (buka kamera → unduh) | ≥ 60% |
| Waktu rata-rata sesi | 1–3 menit |
| Rasio izin kamera diberikan | ≥ 85% |
| Rata-rata sesi ulang per pengguna | ≥ 1,5 |
| Lighthouse Performance (mobile) | ≥ 85 |
| Error ekspor | < 1% |

## 4. Target Pengguna

| Persona | Kebutuhan |
|---|---|
| **Remaja & mahasiswa** | Foto lucu bareng teman, mudah dibagikan ke IG/TikTok story |
| **Pasangan** | Tema romantis, kenangan anniversary/date |
| **Panitia acara & komunitas** | Foto strip untuk pernikahan, ulang tahun, wisuda (fase lanjut: tema custom) |
| **Kreator konten** | Tampilan estetik, resolusi tinggi |

## 5. Ruang Lingkup

### In Scope (MVP)
- Pengambilan foto via kamera perangkat + hitung mundur.
- Unggah foto dari galeri sebagai alternatif.
- 6–8 layout kolase.
- 12–20 desain bingkai dalam 3 kategori tema.
- Pratinjau real-time dan ekspor PNG/JPG beresolusi tinggi.
- Filter dasar dan stiker sederhana.

### Out of Scope (MVP)
- Akun/login, penyimpanan cloud, galeri publik.
- Video/GIF/boomerang.
- Pembayaran dan cetak fisik.
- Editor bingkai buatan pengguna.

## 6. Alur Pengguna (User Flow)

```
Landing Page
   ↓ [Mulai Foto]
Izin Kamera (atau Unggah Foto)
   ↓
Pilih Layout Kolase  ← (menentukan jumlah foto)
   ↓
Sesi Pengambilan Foto (countdown → jepret × N)
   ↓
Review & Retake (per foto atau semua)
   ↓
Pilih Desain Bingkai (tema: Lucu / Romantis / Keren)
   ↓
Kustomisasi Ringan (filter, stiker, teks/tanggal)
   ↓
Pratinjau Final
   ↓
Ekspor (Unduh PNG/JPG, Bagikan)
   ↓
[Foto Lagi] / [Selesai]
```

> Catatan: layout dipilih **sebelum** memotret agar sistem tahu jumlah foto yang dibutuhkan; bingkai dipilih **setelah** foto agar pengguna bisa langsung melihat hasil nyata di dalam bingkai.

## 7. Kebutuhan Fungsional

Prioritas: **P0** = wajib MVP, **P1** = penting, **P2** = nanti.

### 7.1 Landing Page
| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-01 | Hero dengan tombol CTA "Mulai Foto" yang jelas | P0 |
| FR-02 | Contoh hasil foto strip (preview slider) | P1 |
| FR-03 | Penjelasan singkat 3 langkah dan info privasi ("Fotomu tidak diunggah") | P0 |

### 7.2 Akses Kamera
| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-04 | Meminta izin kamera lewat `getUserMedia`, dengan pesan penjelasan sebelum popup izin | P0 |
| FR-05 | Pilih kamera depan/belakang; preview cermin (mirror) untuk kamera depan | P0 |
| FR-06 | Penanganan izin ditolak: instruksi mengaktifkan kembali + opsi unggah foto | P0 |
| FR-07 | Unggah foto dari galeri (multi-file) sebagai fallback | P0 |

### 7.3 Pemilihan Layout Kolase
| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-08 | Menampilkan kartu layout dengan ikon/thumbnail | P0 |
| FR-09 | Layout MVP (lihat tabel di bawah) | P0 |
| FR-10 | Setiap layout menentukan jumlah foto, rasio slot, dan ukuran kanvas | P0 |

**Daftar layout MVP**

| Layout | Jumlah Foto | Orientasi | Kanvas (px) |
|---|---|---|---|
| Strip Klasik 4 (foto strip ala photobooth) | 4 | Vertikal | 600 × 1800 |
| Strip 3 | 3 | Vertikal | 600 × 1500 |
| Strip 2 (couple) | 2 | Vertikal | 600 × 1200 |
| Grid 2×2 | 4 | Persegi | 1200 × 1200 |
| Grid 2×3 | 6 | Vertikal | 1200 × 1800 |
| Polaroid Tunggal | 1 | Vertikal | 1080 × 1350 |
| Hero + 2 Kecil | 3 | Vertikal | 1200 × 1800 |
| Landscape 2 (berdampingan) | 2 | Horizontal | 1800 × 1200 |

> Ekspor pada resolusi 2× (retina) untuk kualitas cetak, dengan opsi rasio 4:6 (cetak 4R) dan 9:16 (story).

### 7.4 Pengambilan Foto
| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-11 | Hitung mundur 3 detik (opsi: 3/5/10 detik) dengan animasi besar dan lucu | P0 |
| FR-12 | Pengambilan otomatis berurutan sesuai jumlah slot layout | P0 |
| FR-13 | Efek flash layar dan suara shutter (bisa dimatikan) | P1 |
| FR-14 | Indikator progres "Foto 2 dari 4" | P0 |
| FR-15 | Foto otomatis di-crop sesuai rasio slot (center-crop cerdas) | P0 |
| FR-16 | Mode manual: tombol jepret sendiri | P1 |

### 7.5 Review & Retake
| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-17 | Tampilkan semua hasil jepretan dalam grid | P0 |
| FR-18 | Ulangi satu foto atau semua foto | P0 |
| FR-19 | Tukar urutan foto (drag & drop) | P1 |
| FR-20 | Geser/zoom foto di dalam slot untuk mengatur posisi wajah | P1 |

### 7.6 Pemilihan Bingkai
| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-21 | Katalog bingkai per kategori dengan tab tema | P0 |
| FR-22 | Pratinjau langsung foto pengguna di dalam bingkai saat memilih | P0 |
| FR-23 | Bingkai kompatibel otomatis mengikuti layout yang dipilih | P0 |
| FR-24 | Warna latar bingkai bisa diganti (palet preset) | P1 |

### 7.7 Kustomisasi Ringan
| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-25 | Filter: Normal, B&W, Sepia, Pastel, Vintage Film, Glow | P1 |
| FR-26 | Stiker (hati, bintang, pita, kilau, dll.) yang bisa digeser dan diubah ukuran | P1 |
| FR-27 | Teks/caption dan tanggal otomatis di bagian bawah bingkai | P1 |
| FR-28 | Tombol Undo/Reset | P1 |

### 7.8 Ekspor
| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-29 | Render final di canvas dengan margin, jarak antar-foto, dan sudut yang presisi | P0 |
| FR-30 | Unduh PNG (default) dan JPG (kualitas 92%) | P0 |
| FR-31 | Nama file otomatis, contoh: `snapie-2026-09-28-1430.png` | P0 |
| FR-32 | Web Share API di mobile (kirim ke IG/WhatsApp) | P1 |
| FR-33 | Opsi ekspor: 1× (ringan), 2× (HD), lembar cetak 4R berisi 2 strip | P1 |
| FR-34 | Watermark kecil opsional (dapat dimatikan) | P2 |

## 8. Desain Bingkai & Arah Visual

### 8.1 Tema Bingkai

| Tema | Suasana | Contoh Desain | Palet |
|---|---|---|---|
| 🧸 **Lucu** | Ceria, playful | Bear & Bunny, Cloud Candy, Pixel Cute, Strawberry Milk, Retro Cartoon | Pink permen, biru langit, kuning butter |
| 💕 **Romantis** | Lembut, dreamy | Rose Garden, Love Letter, Sweet Heart, Lace & Pearl, Sunset Date | Blush pink, merah anggur, krem, emas lembut |
| 😎 **Keren** | Edgy, modern | Neon Night, Film Noir, Y2K Chrome, Street Sticker, Vintage Cam | Hitam, putih, neon, biru elektrik, silver |

### 8.2 Prinsip Desain UI
- **Mobile-first**, tombol besar dan mudah dijangkau ibu jari.
- Sudut membulat, bayangan lembut, ilustrasi tangan (doodle), dan mikro-animasi (bounce, confetti, kilau).
- Tipografi: display bulat/playful untuk judul (misal *Fredoka* atau *Baloo 2*), sans-serif bersih untuk teks UI (misal *Poppins*), dan script elegan untuk aksen romantis.
- Palet UI utama: pink blush `#FFB6C8`, lilac `#C9B6FF`, krem `#FFF6EC`, aksen merah hati `#FF5C7A`, teks `#3B2A3F`.
- Mode gelap opsional untuk tema "Keren".
- Semua bingkai dibuat sebagai **PNG transparan** (atau SVG) dengan lubang slot foto yang presisi.

### 8.3 Spesifikasi Aset Bingkai
- Format: PNG transparan 2× resolusi kanvas (atau SVG untuk elemen vektor).
- Setiap bingkai punya berkas metadata JSON: koordinat slot foto, ukuran kanvas, dan layout yang didukung.
- Ukuran berkas ≤ 300 KB per bingkai (dioptimasi WebP/PNG-8 jika perlu).

Contoh metadata:

```json
{
  "id": "love-letter-strip4",
  "name": "Love Letter",
  "theme": "romantic",
  "layout": "strip-4",
  "canvas": { "width": 600, "height": 1800 },
  "slots": [
    { "x": 40, "y": 40,   "w": 520, "h": 360, "radius": 16 },
    { "x": 40, "y": 430,  "w": 520, "h": 360, "radius": 16 },
    { "x": 40, "y": 820,  "w": 520, "h": 360, "radius": 16 },
    { "x": 40, "y": 1210, "w": 520, "h": 360, "radius": 16 }
  ],
  "overlay": "/frames/love-letter-strip4.png",
  "captionArea": { "x": 40, "y": 1610, "w": 520, "h": 150 }
}
```

## 9. Kebutuhan Non-Fungsional

| Kategori | Kebutuhan |
|---|---|
| **Performa** | LCP < 2,5 dtk di 4G; render kolase final < 2 dtk; aset bingkai di-lazy-load |
| **Privasi** | Foto diproses 100% di sisi klien; tidak ada unggahan ke server; stream kamera dihentikan setelah sesi selesai; kebijakan privasi jelas |
| **Kompatibilitas** | iOS Safari 15+, Chrome/Edge/Firefox 2 versi terakhir, Android Chrome; wajib HTTPS |
| **Aksesibilitas** | Kontras WCAG AA, label tombol, dukungan keyboard di desktop, opsi kurangi animasi |
| **Responsif** | 360 px sampai layar desktop; orientasi portrait diprioritaskan |
| **Keandalan** | Fallback bila kamera gagal; pesan error ramah dan bahasa Indonesia |
| **Lokalisasi** | Bahasa Indonesia (default), Inggris (P1) |
| **SEO** | Landing page SSR/statik, meta tag, Open Graph, sitemap |

## 10. Arsitektur & Teknologi (Rekomendasi)

Karena inti produk berjalan di browser, arsitektur dibuat ringan.

| Lapisan | Rekomendasi |
|---|---|
| Frontend | React + TypeScript (Vite), atau Next.js jika butuh SSR untuk SEO |
| Styling | Tailwind CSS + Framer Motion untuk animasi |
| Kamera | Web API `MediaDevices.getUserMedia` |
| Render kolase | HTML5 Canvas 2D (atau Konva.js/Fabric.js untuk stiker yang bisa digeser) |
| Filter | Canvas filter / CSS filter / WebGL untuk efek lanjutan |
| State | Zustand |
| Ekspor | `canvas.toBlob()` (PNG/JPG), Web Share API |
| Aset bingkai | CDN statis (Cloudflare/Google Cloud Storage) |
| Hosting | Vercel / Netlify / Cloud Run (container Docker) |
| Analitik | Plausible atau GA4 (tanpa menyimpan foto) |

**Alur render (ringkas):**
1. Setiap foto di-crop ke rasio slot lalu digambar ke kanvas offscreen.
2. Latar/warna bingkai digambar, lalu foto pada koordinat slot (dengan sudut membulat/clipping).
3. Overlay bingkai PNG ditumpuk di atas, lalu stiker dan teks.
4. Kanvas diekspor sebagai Blob dan diunduh.

**Fase 2 (opsional):** backend (mis. PHP/Python + MySQL) untuk akun, galeri pribadi, tema kustom event, dan penyimpanan cloud, serta admin panel untuk mengunggah bingkai baru.

## 11. Edge Case & Penanganan Error

| Kasus | Penanganan |
|---|---|
| Izin kamera ditolak | Tampilkan panduan per-browser + opsi unggah foto |
| Tidak ada kamera | Otomatis beralih ke mode unggah |
| Kamera dipakai aplikasi lain | Pesan error + tombol coba lagi |
| Browser in-app (IG/TikTok) membatasi kamera | Deteksi dan sarankan "Buka di Chrome/Safari" |
| Foto berbeda rasio dari slot | Auto-crop tengah + opsi geser manual |
| Memori rendah di HP lama | Turunkan resolusi ekspor otomatis |
| Pengguna menutup tab di tengah sesi | Peringatan sebelum keluar |
| Ekspor gagal | Coba ulang dengan resolusi lebih rendah |
| iOS tidak mendukung unduh langsung | Tampilkan gambar untuk "tekan lama → Simpan" atau Web Share |

## 12. Analitik (Tanpa Data Pribadi)

Event yang dilacak: `start_click`, `camera_granted/denied`, `layout_selected`, `capture_completed`, `frame_selected` (tema & ID), `filter_used`, `export_success` (format), `share_click`, `retake_count`.
Tidak ada gambar atau data biometrik yang dikirim.

## 13. Rencana Rilis

| Fase | Cakupan | Estimasi |
|---|---|---|
| **Fase 0 — Desain** | Riset referensi, UI kit, aset 12 bingkai awal, prototipe Figma | 2 minggu |
| **Fase 1 — MVP** | Kamera, 6 layout, 12 bingkai, ekspor PNG/JPG, landing page | 4–5 minggu |
| **Fase 2 — Polish** | Filter, stiker, teks/tanggal, share, animasi & suara, analitik | 2–3 minggu |
| **Fase 3 — Growth** | Tema musiman (Valentine, Lebaran, dll.), tema event, bilingual | Berkelanjutan |
| **Fase 4 — Platform** | Akun, galeri, admin panel, tema kustom, cetak/pembayaran | TBD |

## 14. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Kompatibilitas kamera antar-browser (terutama iOS) | Tinggi | Uji di perangkat nyata; fallback unggah |
| Aset bingkai berat memperlambat aplikasi | Sedang | Optimasi, lazy-load, CDN |
| Hasil ekspor tidak presisi | Tinggi | Sistem koordinat metadata JSON + uji visual otomatis |
| Isu hak cipta pada aset/font | Sedang | Gunakan aset orisinal atau berlisensi bebas |
| Kekhawatiran privasi | Sedang | Komunikasikan "diproses di perangkatmu" secara jelas |
| Menyerupai produk kompetitor | Sedang | Bangun identitas visual dan katalog bingkai sendiri |

## 15. Kriteria Penerimaan (MVP)

- [ ] Pengguna dapat memotret sesuai jumlah slot layout dengan hitung mundur otomatis.
- [ ] Minimal 6 layout dan 12 bingkai (4 per tema) tersedia dan kompatibel.
- [ ] Pratinjau bingkai menampilkan foto asli pengguna secara real-time.
- [ ] Ekspor PNG/JPG menghasilkan gambar tajam tanpa celah, tumpang tindih, atau foto terpotong tak wajar.
- [ ] Berjalan baik di Chrome Android, Safari iOS, dan Chrome desktop.
- [ ] Tidak ada foto yang dikirim ke server.
- [ ] Alur lengkap dapat diselesaikan < 2 menit.

## 16. Pertanyaan Terbuka

1. Apakah perlu watermark/branding pada hasil gratis?
2. Apakah monetisasi direncanakan (bingkai premium, iklan, tema event berbayar)?
3. Apakah butuh mode "event/kiosk" (layar penuh, tanpa navigasi) untuk acara offline?
4. Bahasa: Indonesia saja atau langsung bilingual?
5. Nama produk dan domain final.

---
*Dokumen ini adalah draf awal dan akan disempurnakan bersama tim desain dan engineering.*
