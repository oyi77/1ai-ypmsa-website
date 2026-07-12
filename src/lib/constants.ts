// Site-wide constants. Central source of truth for metadata and config.

export const SITE_URL = 'https://ypsma.semarangkota.go.id';
export const SITE_NAME = 'YPSMA';
export const SITE_TITLE = 'Yayasan Pendidikan Sosial Masyarakat Semarang';
export const SITE_DESCRIPTION = 'Yayasan yang bergerak di bidang pendidikan, sosial, dan kemanusiaan di Kota Semarang sejak 1999';

export const NAV_ITEMS = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang', href: '/tentang/', children: [
    { label: 'Profil', href: '/tentang/profil/' },
    { label: 'Visi & Misi', href: '/tentang/visi-misi/' },
    { label: 'Sejarah', href: '/tentang/sejarah/' },
    { label: 'Struktur', href: '/tentang/struktur/' },
    { label: 'Pengurus', href: '/tentang/pengurus/' },
  ]},
  { label: 'Program', href: '/program/', children: [
    { label: 'Pendidikan', href: '/program/pendidikan/' },
    { label: 'Sosial', href: '/program/sosial/' },
    { label: 'Kemanusiaan', href: '/program/kemanusiaan/' },
    { label: 'Dakwah', href: '/program/dakwah/' },
  ]},
  { label: 'Donasi', href: '/donasi/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Kontak', href: '/kontak/' },
] as const;

export const CONTACT_INFO = {
  address: 'Jl. Simpang Lima No. 1, Semarang, Jawa Tengah 50241',
  phone: '+62 812-3456-7890',
  email: 'info@ypsma.semarangkota.go.id',
  maps: 'https://maps.google.com/?q=-6.9932,110.4203',
  social: {
    facebook: 'https://facebook.com/ypsma.semarang',
    instagram: 'https://instagram.com/ypsma.semarang',
    youtube: 'https://youtube.com/@ypsma.semarang',
    tiktok: 'https://tiktok.com/@ypsma.semarang',
    whatsapp: '6281234567890',
  },
} as const;
