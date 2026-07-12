export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'pendidikan' | 'sosial' | 'dakwah';
  icon: string;
  color: string;
  stats?: { label: string; value: string }[];
  image?: string;
}

export interface DonationTier {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  amount: string;
  monthly?: string;
  icon: string;
  color: string;
  features: string[];
  cta: string;
}

export const programs: Program[] = [
  {
    id: 'ra-perwanida',
    title: 'RA Perwanida',
    slug: 'ra-perwanida',
    description: 'Raudhatul Athfal (RA) Perwanida — pendidikan usia dini Islami yang membangun fondasi iman, akhlak, dan kecintaan belajar sejak 3 tahun.',
    category: 'pendidikan',
    icon: 'school',
    color: 'green',
    stats: [
      { label: 'Santri Aktif', value: '120+' },
      { label: 'Tenaga Pendidik', value: '12' },
    ],
  },
  {
    id: 'mi-miftahul-ulum',
    title: 'MI Miftahul Ulum',
    slug: 'mi-miftahul-ulum',
    description: 'Madrasah Ibtidaiyah (MI) Miftahul Ulum — pendidikan dasar Islam dengan kurikulum integratif yang memadukan ilmu umum dan agama.',
    category: 'pendidikan',
    icon: 'book',
    color: 'blue',
    stats: [
      { label: 'Santri Aktif', value: '240+' },
      { label: 'Total Guru', value: '18' },
    ],
  },
  {
    id: 'smp-plus',
    title: 'SMP Plus Ma\'arif',
    slug: 'smp-plus',
    description: 'SMP Plus Ma\'arif — pendidikan menengah pertama dengan program unggulan tahfidz, bahasa, dan keterampilan hidup.',
    category: 'pendidikan',
    icon: 'users',
    color: 'orange',
    stats: [
      { label: 'Santri Aktif', value: '180+' },
      { label: 'Program Unggulan', value: '5' },
    ],
  },
  {
    id: 'pptq',
    title: 'PPTQ (Pondok Tahfidz)',
    slug: 'pptq',
    description: 'Pondok Pesantren Tahfidz al-Quran — program hafalan Quran intensif dengan bimbingan asrama dan pembinaan karakter Islami.',
    category: 'pendidikan',
    icon: 'quran',
    color: 'purple',
    stats: [
      { label: 'Santri Aktif', value: '100+' },
      { label: 'Hafidz/Hafidzah', value: '25+' },
    ],
  },
];

export const donationTiers: DonationTier[] = [
  {
    id: 'santunan-ikhlas',
    title: 'Santunan Ikhlasku',
    subtitle: 'Donasi Fleksibel',
    description: 'Donasi dengan nominal berapapun untuk mendukung operasional yayasan dan program pendidikan santri.',
    amount: 'Rp25.000',
    monthly: 'Rp25.000/bln',
    icon: 'heart',
    color: 'coral',
    features: [
      'Dana digunakan sesuai kebutuhan prioritas',
      'Laporan penggunaan dana rutin',
      'Doa dari santri',
    ],
    cta: 'Santun Sekarang',
  },
  {
    id: 'orang-tua-asuh',
    title: 'Adopsi Orang Tua Asuh',
    subtitle: 'Kemitraan Pendidikan',
    description: 'Menjadi orang tua asuh bagi santri kurang mampu — biaya pendidikan, makan, dan perlengkapan sebesar Rp300.000 per bulan.',
    amount: 'Rp300.000',
    monthly: 'Rp300.000/bln',
    icon: 'family',
    color: 'teal',
    features: [
      'Santri binaan spesifik dengan profil',
      'Laporan perkembangan per semester',
      'Kunjungan & silaturahmi',
      'Sertifikat orang tua asuh',
    ],
    cta: 'Jadi Orang Tua Asuh',
  },
  {
    id: 'wakaf-koperasi',
    title: 'Wakaf Abadi Koperasi',
    subtitle: 'Investasi Akhirat',
    description: 'Wakaf untuk pengembangan koperasi yayasan yang hasilnya digunakan mendanai operasional pendidikan secara berkelanjutan.',
    amount: 'Rp1.000.000',
    icon: 'building',
    color: 'gold',
    features: [
      'Wakaf produktif berkelanjutan',
      'Sertifikat wakaf resmi',
      'Laporan perkembangan tahunan',
      'Amal jariyah terus mengalir',
    ],
    cta: 'Wakaf Sekarang',
  },
];
