export interface Stat {
  label: string;
  value: string;
  icon?: string;
}

export const heroStats: Stat[] = [
  { label: 'Tahun Melayani', value: '26+', icon: 'calendar' },
  { label: 'Program Aktif', value: '15+', icon: 'programs' },
  { label: 'Penerima Manfaat', value: '2.500+', icon: 'people' },
  { label: 'Donasi Terkumpul', value: 'Rp 850 Jt', icon: 'donation' },
];

export const impactStats: Stat[] = [
  { label: 'Santri TPA', value: '150+' },
  { label: 'Keluarga Terbantu', value: '500+' },
  { label: 'Beasiswa Aktif', value: '200+' },
  { label: 'Bencana Ditangani', value: '30+' },
  { label: 'Relawan Aktif', value: '75' },
  { label: 'Kajian/Bulan', value: '4' },
];
