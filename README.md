# Web Portal Berita Scraping dengan Next.js & OAuth2

**Tugas Evaluasi 3 – Pemrograman Web Lanjut**

Proyek ini membangun sebuah portal berita menggunakan Next.js yang melakukan scraping data dari tiga sumber berbeda (Kompas, Detik, dan Tribunnews), menampilkan daftar berita utama, serta halaman detail setiap berita. Sistem dilengkapi autentikasi OAuth2 via Google (NextAuth.js) untuk memastikan hanya pengguna terdaftar yang dapat mengakses konten.

---

## Fitur Utama

* **Web Scraping**: Mengambil data `title`, `url`, `imageUrl`, dan `publishedAt` dari Kompas.com, Detik.com, dan Tribunnews.com.
* **Normalisasi Data**: Tanggal diubah ke format ISO 8601, thumbnail diseragamkan, dan judul dipotong pada daftar berita.
* **OAuth2 (Google)**: Autentikasi pengguna menggunakan NextAuth.js.
* **SSR (Server-Side Rendering)**: Halaman daftar dan detail berita dirender di server.
* **Proteksi Halaman**: Hanya pengguna terautentikasi yang dapat mengakses halaman utama dan detail.
* **Responsive UI**: Tampilan adaptif di desktop, tablet, dan mobile menggunakan Tailwind CSS.

---

## Teknologi yang Digunakan

* [Next.js](https://nextjs.org/) (App Router)
* [React](https://reactjs.org/)
* [NextAuth.js](https://next-auth.js.org/) (OAuth2)
* [Axios](https://axios-http.com/) & [Cheerio](https://cheerio.js.org/) (Web Scraping)
* [Tailwind CSS](https://tailwindcss.com/) (Utility-First CSS)
* [TypeScript](https://www.typescriptlang.org/)

---

## Persiapan & Instalasi

1. **Clone Repository**

   ```bash
   git clone <URL_REPO_ANDA>
   cd <nama-folder>
   ```
2. **Install dependensi**

   ```bash
   npm install
   # atau
   yarn install
   ```
3. **Inisialisasi Tailwind CSS** (jika belum)

   ```bash
   npx tailwindcss init -p
   ```
4. **Konfigurasi Variabel Lingkungan**
   Buat file `.env.local` di root:

   ```env
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   ```
5. **Jalankan Development Server**

   ```bash
   npm run dev
   # atau
   yarn dev
   ```

Akses aplikasi di `http://localhost:3000`.

---

## Struktur Proyek

```
project-root/
├── .gitignore
├── package.json
├── tsconfig.json
├── .env.local
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx          # Halaman daftar berita
    │   ├── (auth)/           # Konfigurasi OAuth2
    │   │   └── [...nextauth]
    │   ├── api/
    │   │   ├── auth/
    │   │   └── news/         # Endpoint scraping
    │   └── news/
    │       ├── page.tsx      # Daftar berita
    │       └── [source]/     # Halaman detail berita
    ├── components/           # Komponen UI (Navbar, dll.)
    ├── lib/
    │   ├── auth/             # auth.config.ts
    │   └── scrapers/         # scraper functions
    ├── middleware.ts         # Proteksi route
    └── types/                # Definisi TypeScript
```

---

## Skrip NPM

* `dev`  : Jalankan development server
* `build`: Build aplikasi untuk produksi
* `start`: Jalankan server hasil build
* `lint` : Cek linting (ESLint)

---

## Catatan

* Struktur HTML masing-masing portal dapat berubah—perlu update scraper jika selector tidak cocok.
* Disarankan menambahkan sanitasi HTML (mis. `dompurify`) dan caching (Redis) pada skala produksi.

---

## Kontribusi

Pull request dan issue sangat dipersilakan. Pastikan mengikuti konvensi kode (ESLint + Prettier) sebelum mengirim PR.

---

**Autor**: Alfonso Pangaribuan (NIM 122140206)

**Program Studi**: Teknik Informatika, Institut Teknologi Sumatera

**2025**
