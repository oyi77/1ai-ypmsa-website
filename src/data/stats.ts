export interface Stat {
  value: string;
  label: string;
  icon: string;
  key?: string;
}

export const stats: Stat[] = [
  { value: '3000+', label: 'Alumni', icon: 'graduation' },
  { value: '640+', label: 'Santri Aktif', icon: 'students' },
  { value: '58', label: 'Tahun Berdiri', icon: 'calendar' },
  { value: '25+', label: 'Hafidz/Hafidzah', icon: 'quran' },
];

export const impactStats: Stat[] = [
  { value: '85%', label: 'Dana Tersalurkan ke Program', icon: 'chart', key: 'stats.impactDistributed' },
  { value: '300+', label: 'Santri Dapat Beasiswa', icon: 'scholarship', key: 'stats.impactScholarship' },
  { value: '50+', label: 'Tenaga Pendidik', icon: 'teachers', key: 'stats.impactEducators' },
  { value: '100%', label: 'Transparan & Terpercaya', icon: 'shield', key: 'stats.impactTrust' },
];

