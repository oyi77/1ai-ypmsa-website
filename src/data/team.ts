export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
}

export const teamMembers: TeamMember[] = [
  { name: 'H. Ahmad Fauzi, S.Pd.I', role: 'Ketua Yayasan', bio: 'Pendidik dan penggerak sosial di Kota Semarang sejak 1999.' },
  { name: 'Hj. Siti Nurhaliza, S.Ag', role: 'Sekretaris', bio: 'Aktif dalam program dakwah dan pemberdayaan perempuan.' },
  { name: 'Bambang Setiawan, S.E', role: 'Bendahara', bio: 'Ahli keuangan yang mengelola transparansi dana yayasan.' },
  { name: 'Ustadz Muhammad Rizqi', role: 'Kepala TPA', bio: 'Ustadz muda bersemangat mengajar Al-Quran sejak 2005.' },
  { name: 'Dra. Hj. Aminah', role: 'Koordinator Sosial', bio: 'Mengkoordinasikan seluruh program bantuan sosial.' },
  { name: 'Ustadz Abdullah, M.Pd.I', role: 'Koordinator Dakwah', bio: 'Mengelola kajian rutin dan pengajian mingguan.' },
];

export interface Leadership {
  name: string;
  title: string;
  image?: string;
}

export const leadership: Leadership[] = [
  { name: 'H. Ahmad Fauzi, S.Pd.I', title: 'Ketua Yayasan' },
  { name: 'Hj. Siti Nurhaliza, S.Ag', title: 'Sekretaris' },
  { name: 'Bambang Setiawan, S.E', title: 'Bendahara' },
  { name: 'Dr. KH. Muhammad Idris', title: 'Pembina' },
  { name: 'H. Abdul Rahman, Lc', title: 'Penasehat' },
];
