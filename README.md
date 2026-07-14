# 1ai-ypmsa-website

Landing page resmi YPSM — Yayasan Pendidikan dan Sosial Ma'arif.

## Stack
- HTML5 + CSS murni
- Build statis ke folder `dist/`
- Ditujukan untuk Cloudflare Pages

## Konten utama
- Sejarah dan identitas yayasan
- Unit pendidikan: RA Fajrul Islam, MI Sulamuddiniyah, SMP YPM Mojowarno, PPTQ Darussalam
- Program dan dampak
- Call-to-action donasi
- Interlink ke jaringan Berkoh Karya

## Deploy ke Cloudflare Pages
1. Buat repo GitHub `1ai-ypmsa-website`
2. Push kode dari repo ini
3. Buka Cloudflare Dashboard → Pages → Create project
4. Pilih repo `1ai-ypmsa-website`
5. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm ci`
6. Add custom domain: `ypsma.org` dan `www.ypsma.org`

## Kontak
- Alamat: Jl. Diponegoro No. 34, Gondek, Mojowarno, Jombang 61475
- Telepon: 0321-493147
- Email: cs@ypsma.org
