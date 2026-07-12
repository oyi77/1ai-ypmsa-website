export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'pendidikan' | 'sosial' | 'kemanusiaan' | 'dakwah';
  icon: string;
  color: string;
  stats?: { label: string; value: string }[];
}

export const programs: Program[] = [
  {
    id: 'tpa-quran',
    title: 'TPA & Mengaji Gratis',
    slug: 'tpa-quran',
    description: 'Taman Pendidikan Al-Quran gratis untuk anak-anak usia dini hingga remaja. Belajar membaca Al-Quran, doa harian, dan dasar-dasar Islam.',
    category: 'pendidikan',
    icon: 'book-quran',
    color: 'green',
    stats: [
      { label: 'Santri Aktif', value: '150+' },
      { label: 'Tahun Berjalan', value: '20+' },
    ],
  },
  {
    id: 'kajian-umum',
    title: 'Kajian Umum',
    slug: 'kajian-umum',
    description: 'Kajian Islam terbuka untuk masyarakat umum setiap minggu. Tema-tema relevan dengan kehidupan sehari-hari bersama ustadz dan ustadzah berpengalaman.',
    category: 'dakwah',
    icon: 'lecture',
    color: 'blue',
    stats: [
      { label: 'Peserta/Minggu', value: '50+' },
      { label: 'Topik/Tahun', value: '48' },
    ],
  },
  {
    id: 'bantuan-sosial',
    title: 'Bantuan Sosial',
    slug: 'bantuan-sosial',
    description: 'Penyaluran bantuan sosial kepada masyarakat kurang mampu melalui program sembako, sandang, dan bantuan biaya pendidikan.',
    category: 'sosial',
    icon: 'charity',
    color: 'orange',
    stats: [
      { label: 'Keluarga Terbantu', value: '500+' },
      { label: 'Paket Sembako/Bulan', value: '100+' },
    ],
  },
  {
    id: 'bencana-alam',
    title: 'Peduli Bencana',
    slug: 'bencana-alam',
    description: 'Respons cepat terhadap bencana alam di wilayah Jawa Tengah dan sekitarnya. Penggalangan dana, relawan, dan distribusi bantuan.',
    category: 'kemanusiaan',
    icon: 'disaster',
    color: 'red',
    stats: [
      { label: 'Bencana Ditangani', value: '30+' },
      { label: 'Relawan Aktif', value: '75' },
    ],
  },
  {
    id: 'beasiswa',
    title: 'Beasiswa Pendidikan',
    slug: 'beasiswa',
    description: 'Program beasiswa untuk siswa berprestasi dari keluarga kurang mampu. Menjangkau jenjang SD hingga Perguruan Tinggi.',
    category: 'pendidikan',
    icon: 'graduation',
    color: 'purple',
    stats: [
      { label: 'Penerima Beasiswa', value: '200+' },
      { label: 'Lulusan Kuliah', value: '45' },
    ],
  },
  {
    id: 'yasinan',
    title: 'Yasinan Rutin',
    slug: 'yasinan',
    description: 'Peringatan 40 hari, 100 hari, dan 1000 hari wafat rutin dilaksanakan. Mendoakan almarhum/almarhuhah dan mempererat tali silaturahmi.',
    category: 'dakwah',
    icon: 'prayer',
    color: 'teal',
  },
];
