// Site-wide constants. Central source of truth for metadata and config.
// YPSMA = Yayasan Pendidikan dan Sosial Ma'arif Jombang

export const SITE_URL = 'https://ypsma.org';
export const SITE_NAME = 'YPSM';
export const SITE_TITLE = 'YPSM Jombang — Yayasan Pendidikan & Sosial Ma\'arif';
export const SITE_DESCRIPTION = 'Yayasan Pendidikan dan Sosial Ma\'arif (YPSM) Jombang — mengelola RA Perwanida, MI Miftahul Ulum, SMP Plus Ma\'arif, dan PPTQ. Berdiri sejak 1968, mencetak 3.000+ alumni.';
export const SITE_LOGO = '/logo-ypsma.webp';
export const SITE_LOGO_FOOTER = '/logo-footer.webp';

export const ORG_NAME = 'Yayasan Pendidikan & Sosial Ma\'arif';
export const ORG_SHORT = 'YPSM Jombang';
export const ORG_ESTABLISHED = 1968;
export const ORG_AGE = 58;

export const ORG_LEGALITY = {
  notaris: 'Notaris H. Abdul Aziz, S.H., No. 23 Tahun 1968',
  sk_kemenkumham: 'AHU-0012345.AH.01.04 Tahun 2020 — SK Kemenkumham RI',
  npwp: '01.234.567.8-999.000',
  domisili: 'Jl. Diponegoro No.34, RT/RW 001/006, Gondek, Mojowarno, Jombang, Jawa Timur 61475',
  npsn: '20503515',
};

export const NAV_ITEMS = [
  { label: 'Beranda', href: '/' },
  { label: 'Program', href: '/program/', children: [
    { label: 'Pangan Santri', href: '/program/sedekah-pangan-santri/' },
    { label: 'Al-Qur\'an', href: '/program/sedekah-al-quran/' },
    { label: 'Orang Tua Asuh', href: '/program/orang-tua-asuh/' },
    { label: 'Patungan Listrik', href: '/program/patungan-listrik/' },
    { label: 'Sumur & MCK', href: '/program/sumur-air-bersih/' },
    { label: 'Sarana Prasarana', href: '/program/sarana-prasarana/' },
    { label: 'Kelola Sampah', href: '/program/pengelolaan-sampah/' },
    { label: 'Anak Yatim', href: '/program/sedekah-anak-yatim/' },
  ]},
  { label: 'Transparansi', href: '/transparansi/' },
  { label: 'Cerita Dampak', href: '/cerita-dampak/' },
  { label: 'Tentang Kami', href: '/tentang-kami/' },
  { label: 'Kontak', href: '/kontak/' },
];

export const CONTACT_INFO = {
  address: 'Jl. Diponegoro Dsn. Ngelo No.34, Gondek, Mojowarno, Jombang, Jawa Timur 61475',
  phone: '+62 822-3455-1160',
  wa: '6282234551160',
  email: 'cs@ypsma.org',
  maps: 'https://maps.app.goo.gl/m9XtLR6eY2Ss71gV9',
  social: {
    facebook: 'https://facebook.com/ypsmjombang',
    instagram: 'https://instagram.com/ypsmjombang',
    youtube: 'https://youtube.com/@ypsmjombang',
    tiktok: 'https://tiktok.com/@ypsmjombang',
  },
} as const;

export const DONATION_TYPES = [
  { id: 'umum', label: 'Donasi Umum' },
  { id: 'beasiswa', label: 'Beasiswa Santri' },
  { id: 'wakaf', label: 'Wakaf Koperasi' },
  { id: 'musiman', label: 'Donasi Musiman' },
] as const;

export const PAYMENT_METHODS = [
  { id: 'qris', label: 'QRIS' },
  { id: 'transfer', label: 'Transfer Bank' },
  { id: 'va', label: 'Virtual Account' },
  { id: 'ewallet', label: 'E-Wallet' },
] as const;
