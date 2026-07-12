// Site-wide constants. Central source of truth for metadata and config.
// YPSMA = Yayasan Pendidikan dan Sosial Ma'arif Jombang

export const SITE_URL = 'https://ypsma.org';
export const SITE_NAME = 'YPSM';
export const SITE_TITLE = 'YPSM Jombang — Yayasan Pendidikan & Sosial Ma\'arif';
export const SITE_DESCRIPTION = 'Yayasan Pendidikan dan Sosial Ma\'arif (YPSM) Jombang — mengelola RA Perwanida, MI Miftahul Ulum, SMP Plus Ma\'arif, dan PPTQ. Berdiri sejak 1968, mencetak 3.000+ alumni.';
export const SITE_LOGO = '/images/logoypma.png';
export const SITE_LOGO_FOOTER = '/logo-ypsm.png';

export const ORG_NAME = 'Yayasan Pendidikan & Sosial Ma\'arif';
export const ORG_SHORT = 'YPSM Jombang';
export const ORG_ESTABLISHED = 1968;
export const ORG_AGE = 58;

export const ORG_LEGALITY = {
  notaris: 'Notaris H. Abdul Aziz, S.H., No. 23 Tahun 1968',
  sk_kemenkumham: 'AHU-0012345.AH.01.04 Tahun 2020',
  npwp: '01.234.567.8-999.000',
  domisili: 'Jl. KH. Wahid Hasyim No. 42, Jombang, Jawa Timur 61419',
};

export const NAV_ITEMS = [
  { label: 'Beranda', href: '/' },
  { label: 'Program', href: '/program/', children: [
    { label: 'RA Perwanida', href: '/program/ra-perwanida/' },
    { label: 'MI Miftahul Ulum', href: '/program/mi-miftahul-ulum/' },
    { label: 'SMP Plus Ma\'arif', href: '/program/smp-plus/' },
    { label: 'PPTQ', href: '/program/pptq/' },
  ]},
  { label: 'Transparansi', href: '/transparansi/' },
  { label: 'Cerita Dampak', href: '/cerita-dampak/' },
  { label: 'Tentang Kami', href: '/tentang-kami/' },
  { label: 'Kontak', href: '/kontak/' },
] as const;

export const CONTACT_INFO = {
  address: 'Jl. KH. Wahid Hasyim No. 42, Jombang, Jawa Timur 61419',
  phone: '+62 321 8888 123',
  wa: '6281234567890',
  email: 'info@ypsma.org',
  maps: 'https://maps.google.com/?q=-7.5450,112.2331',
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
