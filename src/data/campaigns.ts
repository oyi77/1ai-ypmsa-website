export interface CampaignBudgetItem {
  label: string;
  amount: string;
}

export interface Campaign {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  heroImage: string;
  badge: string;
  stats: { value: string; label: string }[];
  stories: { icon: string; title: string; body: string }[];
  budgetLabel: string;
  budgetItems: CampaignBudgetItem[];
  budgetTotal: string;
  galleryImages: string[];
  tiers: { amount: number; label: string; impact: string; featured?: boolean }[];
  faqs: { question: string; answer: string }[];
  accent: string; // Tailwind-style hue name
}

export const CAMPAIGNS: Campaign[] = [
  {
    slug: 'sedekah-pangan',
    title: 'Sedekah Pangan',
    subtitle: 'Penuhi Gizi 250 Santri Penghafal Al-Qur\'an',
    description: 'Bantu penuhi kebutuhan makan 3x sehari untuk 250 santri penghafal Al-Qur\'an di PPTQ Darussalam Jombang. Rp 150jt/target bulanan untuk gizi santri dhuafa.',
    ogTitle: 'Sedekah Pangan YPSMA — Penuhi Gizi 250 Santri Penghafal Al-Qur\'an',
    ogDescription: 'Bantu penuhi kebutuhan makan 3x sehari untuk 250 santri penghafal Al-Qur\'an di PPTQ Darussalam Jombang.',
    heroImage: '/images/campaigns/IMG_1860.webp',
    badge: 'Program Pangan Santri 2025',
    stats: [
      { value: '250', label: 'Santri Tercukupi' },
      { value: 'Rp 150jt', label: 'Target Bulanan' },
      { value: '3×/hari', label: 'Makan Bergizi' },
    ],
    stories: [
      {
        icon: '🍚',
        title: 'Lapar Bukan Alasan untuk Berhenti Hafal',
        body: 'Sejak subuh hingga malam, 250 santri PPTQ Darussalam menghafal Al-Qur\'an. Tanpa asupan gizi yang cukup, konsentrasi mereka buyar. Setiap Rp 50.000 donasi Anda hari ini mengubah perut kosong 2 santri menjadi kenyang.',
      },
      {
        icon: '📊',
        title: 'Transparansi Penuh',
        body: 'Seluruh donasi tercatat dan dilaporkan. Mulai dari pembelian beras 2.500 kg/bulan, lauk-pauk, sayur, hingga gas dapur — semuanya teraudit dan bisa Anda akses kapan saja.',
      },
      {
        icon: '🤲',
        title: 'Pahala Berkelanjutan',
        body: 'Setiap suapan yang sampai ke santri adalah amal jariyah yang terus mengalir. Satu porsi makanan yang Anda sedekahkan hari ini akan menjadi energi bagi mereka dalam menghafal ayat-ayat Allah.',
      },
    ],
    budgetLabel: 'Transparansi Biaya Pangan Bulanan',
    budgetItems: [
      { label: 'Beras (2.500 kg)', amount: 'Rp 27.500.000' },
      { label: 'Lauk Hewani (ayam, ikan, telur)', amount: 'Rp 38.500.000' },
      { label: 'Tempe, Tahu & Sayur', amount: 'Rp 8.500.000' },
      { label: 'Bumbu Dapur & Minyak Goreng', amount: 'Rp 5.250.000' },
      { label: 'Gas & Bahan Bakar', amount: 'Rp 2.500.000' },
      { label: 'Operasional Dapur', amount: 'Rp 2.750.000' },
    ],
    budgetTotal: 'Rp 85.000.000',
    galleryImages: [
      '/images/campaigns/IMG_1860.webp',
      '/images/campaigns/IMG_1862.webp',
      '/images/campaigns/IMG_1865.webp',
      '/images/campaigns/IMG_1868.webp',
      '/images/campaigns/IMG_1869.webp',
      '/images/IMG_7479.webp',
      '/images/IMG_7558.webp',
      '/images/IMG_7629.webp',
    ],
    tiers: [
      { amount: 50000, label: 'Rp 50.000', impact: 'Cukup untuk 2 santri makan 1 hari', featured: false },
      { amount: 100000, label: 'Rp 100.000', impact: 'Cukup untuk 4 santri makan 1 hari', featured: false },
      { amount: 300000, label: 'Rp 300.000', impact: 'Stok pangan dapur 3 hari', featured: true },
      { amount: 500000, label: 'Rp 500.000', impact: 'Stok pangan dapur 1 minggu', featured: false },
      { amount: 1000000, label: 'Rp 1.000.000', impact: 'Stok pangan dapur 2 minggu', featured: false },
      { amount: 2500000, label: 'Rp 2.500.000', impact: 'Stok pangan dapur 1 bulan penuh', featured: false },
    ],
    faqs: [
      {
        question: 'Apa saja kebutuhan pangan yang didanai?',
        answer: 'Program ini mencakup kebutuhan pokok dapur pondok: beras 2.500 kg/bulan, lauk pauk & protein hewani (ayam, ikan, telur, tempe, tahu), serta sayur mayur, bumbu dapur, dan gas untuk memasak 3 kali makan sehari bagi 250 santri.',
      },
      {
        question: 'Berapa donasi minimum untuk program ini?',
        answer: 'Donasi minimum Rp 50.000. Anda juga dapat memilih nominal Rp 100.000, Rp 500.000, Rp 1.000.000, atau nominal kustom sesuai kemampuan. Setiap rupiah akan dikonversikan langsung menjadi bahan pangan untuk santri.',
      },
      {
        question: 'Bagaimana YPSMA memastikan donasi tepat sasaran?',
        answer: 'YPSMA memiliki tim operasional yang mencatat setiap pemasukan dan pengeluaran secara detail. Donatur bisa meminta laporan penggunaan dana kapan saja melalui WhatsApp. Kami juga menerbitkan laporan keuangan program secara berkala.',
      },
      {
        question: 'Apakah donasi bisa dilakukan rutin setiap bulan?',
        answer: 'Tentu! Donasi rutin sangat dianjurkan karena kebutuhan pangan santri bersifat bulanan. Anda bisa berkomitmen untuk donasi rutin Rp 50.000 s.d. Rp 1.000.000 per bulan. Tim kami akan mengirimkan reminder otomatis dan laporan dampak setiap bulannya.',
      },
    ],
    accent: 'emerald',
  },
  {
    slug: 'beasiswa-santri',
    title: 'Beasiswa Santri',
    subtitle: 'Jadi Orang Tua Asuh untuk 1 Santri Dhuafa',
    description: 'Rp 10jt/anak/tahun untuk 1 santri dhuafa. Jadi Orang Tua Asuh dan ubah masa depan mereka.',
    ogTitle: 'Beasiswa Santri YPSMA — Jadi Orang Tua Asuh untuk 1 Santri Dhuafa',
    ogDescription: 'Rp 10jt/anak/tahun untuk beasiswa 1 santri dhuafa. Biaya SPP, asrama, makan, kitab, dan kesehatan.',
    heroImage: '/images/campaigns/Berdoa.webp',
    badge: 'Program Beasiswa Santri Dhuafa 2025',
    stats: [
      { value: '237', label: 'Santri Aktif' },
      { value: 'Rp 10jt', label: 'Target per Tahun' },
      { value: '100%', label: 'Laporan Transparan' },
    ],
    stories: [
      {
        icon: '🎓',
        title: 'Anak-anak ini hanya butuh kesempatan',
        body: 'Mereka datang dari keluarga dhuafa — buruh tani, pemulung, penjual jamu — dengan mimpi yang sama besarnya dengan anak siapa pun. Tanpa uluran tangan kita, banyak dari mereka yang harus putus sekolah dan kembali ke lingkaran kemiskinan.',
      },
      {
        icon: '🤝',
        title: 'Apa itu "Orang Tua Asuh"?',
        body: 'Anda berkomitmen untuk membiayai kebutuhan pendidikan satu santri dhuafa selama satu tahun penuh. Bukan hanya SPP, tetapi juga biaya asrama, 3x makan sehari, kitab/buku, dan jaminan kesehatan dasar. Seperti orang tua — memastikan anak bisa fokus belajar tanpa khawatir.',
      },
      {
        icon: '📈',
        title: 'Dampak Nyata yang Bisa Anda Pantau',
        body: 'Setiap 3 bulan Anda mendapat laporan rapor, foto, dan surat dari santri asuh. Anda bisa melihat langsung bagaimana donasi Anda mengubah masa depan mereka. Beberapa alumni sekarang sudah bekerja dan menghidupi keluarganya.',
      },
    ],
    budgetLabel: 'Rincian Biaya Seorang Santri per Tahun',
    budgetItems: [
      { label: 'SPP & Pendidikan', amount: 'Rp 3.000.000' },
      { label: 'Biaya Asrama', amount: 'Rp 2.400.000' },
      { label: 'Makan 3x Sehari', amount: 'Rp 2.500.000' },
      { label: 'Kitab, Buku & Alat Tulis', amount: 'Rp 800.000' },
      { label: 'Kesehatan Dasar', amount: 'Rp 600.000' },
      { label: 'Kegiatan Ekstrakurikuler', amount: 'Rp 700.000' },
    ],
    budgetTotal: 'Rp 10.000.000',
    galleryImages: [
      '/images/campaigns/Berdoa.webp',
      '/images/campaigns/IMG_1829.webp',
      '/images/campaigns/IMG_1834.webp',
      '/images/campaigns/IMG_1883.webp',
      '/images/campaigns/IMG_1885.webp',
      '/images/IMG_7540.webp',
      '/images/IMG_7593.webp',
      '/images/IMG_7663.webp',
    ],
    tiers: [
      { amount: 50000, label: 'Rp 50.000', impact: 'Membantu biaya makan 3 hari', featured: false },
      { amount: 100000, label: 'Rp 100.000', impact: 'Membantu 1 kitab/buku santri', featured: false },
      { amount: 500000, label: 'Rp 500.000', impact: 'Biaya SPP 1 bulan 1 santri', featured: false },
      { amount: 1000000, label: 'Rp 1.000.000', impact: 'Biaya asrama 1 santri 1 bulan', featured: true },
      { amount: 5000000, label: 'Rp 5.000.000', impact: 'Beasiswa 6 bulan 1 santri', featured: false },
      { amount: 10000000, label: 'Rp 10.000.000', impact: 'Beasiswa FULL 1 tahun 1 santri', featured: false },
    ],
    faqs: [
      {
        question: 'Bagaimana saya bisa memantau perkembangan santri asuh?',
        answer: 'Anda akan mendapatkan laporan berkala setiap 3 bulan yang mencakup nilai rapor, foto kegiatan, dan surat dari santri asuh. Anda juga bisa mengunjungi pondok langsung dengan koordinasi tim YPSMA.',
      },
      {
        question: 'Apakah saya bisa memilih santri yang akan dibiayai?',
        answer: 'Tim YPSMA akan memilihkan santri yang paling membutuhkan dengan kriteria yang transparan. Namun jika Anda memiliki preferensi tertentu (misal: santri dari daerah tertentu), kami bisa mengakomodasi.',
      },
      {
        question: 'Apakah donasi bisa dicicil per bulan?',
        answer: 'Ya, Anda bisa berdonasi rutin bulanan. Dengan Rp 850.000/bulan, Anda sudah menjadi Orang Tua Asuh untuk 1 santri penuh. Atau nominal berapa pun yang Anda sanggupi — tetap sangat berarti.',
      },
      {
        question: 'Apa kriteria penerima beasiswa?',
        answer: 'Santri berasal dari keluarga dhuafa (penghasilan < Rp 1jt/bulan), memiliki hafalan minimal 3 juz, dan berprestasi secara akademik maupun non-akademik. Seleksi dilakukan transparan oleh tim YPSMA.',
      },
    ],
    accent: 'blue',
  },
  {
    slug: 'patungan-listrik',
    title: 'Patungan Listrik Pondok',
    subtitle: 'Terangi Malam Mereka, Bersama Kita Bisa',
    description: '600 siswa siang hari + 250 santri malam hari butuh penerangan. Subsidi listrik Rp 50jt untuk 6 bulan.',
    ogTitle: 'Patungan Listrik Pondok — Terangi Malam Mereka',
    ogDescription: '600 siswa siang hari + 250 santri malam hari butuh penerangan. Subsidi listrik Rp 50jt untuk 6 bulan.',
    heroImage: '/images/campaigns/IMG_1887.webp',
    badge: '⚡ Kampanye Subsidi Listrik 2025',
    stats: [
      { value: '850+', label: 'Santri/Siswa' },
      { value: 'Rp 50jt', label: 'Target 6 Bulan' },
      { value: 'Siang+Malam', label: 'Operasional' },
    ],
    stories: [
      {
        icon: '💡',
        title: 'Listrik Adalah Jendela Ilmu',
        body: 'Bayangkan belajar di malam hari tanpa penerangan yang cukup — mata perih, konsentrasi hilang. Ini realitas 600 siswa dan 250 santri YPSMA jika donasi listrik tidak terpenuhi. Lampu belajar mereka padam, mimpi mereka ikut meredup.',
      },
      {
        icon: '📊',
        title: 'Biaya Operasional Terbesar',
        body: 'Listrik adalah salah satu pos pengeluaran terbesar pondok. Mulai dari penerangan kelas, kipas angin di asrama, pompa air, hingga komputer administrasi — semuanya bergantung pada listrik. Rp 50jt adalah subsidi untuk 6 bulan.',
      },
      {
        icon: '🤲',
        title: 'Sekecil Apapun, Sangat Berarti',
        body: 'Donasi Rp 25.000 dari Anda membantu penerangan 1 kelas malam ini. Rp 100.000 membantu 1 bulan listrik 1 kamar asrama. Setiap kontribusi menerangi langkah mereka dalam menuntut ilmu.',
      },
    ],
    budgetLabel: 'Rincian Kebutuhan Listrik 6 Bulan',
    budgetItems: [
      { label: 'Listrik Kelas & Kantor (siang)', amount: 'Rp 18.000.000' },
      { label: 'Listrik Asrama & Pondok (malam)', amount: 'Rp 15.000.000' },
      { label: 'Pompa Air & Sanitasi', amount: 'Rp 7.000.000' },
      { label: 'Penerangan Luar & Keamanan', amount: 'Rp 5.000.000' },
      { label: 'Cadangan & Perawatan', amount: 'Rp 5.000.000' },
    ],
    budgetTotal: 'Rp 50.000.000',
    galleryImages: [
      '/images/campaigns/IMG_1887.webp',
      '/images/campaigns/IMG_1888.webp',
      '/images/campaigns/IMG_1889.webp',
      '/images/campaigns/IMG_1891.webp',
      '/images/campaigns/IMG_1885.webp',
      '/images/IMG_7697.webp',
      '/images/IMG_7731.webp',
      '/images/IMG_7768.webp',
    ],
    tiers: [
      { amount: 25000, label: 'Rp 25.000', impact: 'Penerangan 1 kelas malam ini', featured: false },
      { amount: 50000, label: 'Rp 50.000', impact: 'Listrik 1 kamar asrama 1 minggu', featured: false },
      { amount: 100000, label: 'Rp 100.000', impact: 'Listrik 1 kamar asrama 1 bulan', featured: false },
      { amount: 300000, label: 'Rp 300.000', impact: 'Biaya pompa air 1 bulan', featured: true },
      { amount: 500000, label: 'Rp 500.000', impact: 'Listrik 3 kamar asrama 1 bulan', featured: false },
      { amount: 1000000, label: 'Rp 1.000.000', impact: 'Listrik 1 gedung 1 bulan', featured: false },
    ],
    faqs: [
      {
        question: 'Kenapa biaya listrik pondok begitu besar?',
        answer: 'YPSMA mengelola gedung bertingkat untuk RA, MI, SMP, dan PPTQ — dengan total 850+ santri dan siswa. Aktivitas dari subuh hingga malam membutuhkan penerangan, kipas angin, pompa air, serta perangkat elektronik administrasi dan pembelajaran.',
      },
      {
        question: 'Apakah donasi langsung ke PLN?',
        answer: 'Donasi dikelola YPSMA untuk membayar tagihan listrik bulanan yang datang ke masing-masing unit (madrasah, pondok, asrama). Tim keuangan mencatat dan melaporkan setiap pembayaran secara transparan.',
      },
      {
        question: 'Apakah ada donasi minimum?',
        answer: 'Tidak ada nominal minimum. Berapa pun yang Anda berikan — Rp 10.000, Rp 25.000, Rp 50.000 — langsung dipergunakan untuk kebutuhan listrik pondok dan madrasah.',
      },
      {
        question: 'Berapa tagihan listrik rata-rata per bulan?',
        answer: 'Rata-rata tagihan listrik seluruh unit YPSMA berkisar Rp 8-9 juta per bulan, termasuk untuk pompa air, penerangan luar, dan peralatan elektronik pendukung pembelajaran.',
      },
    ],
    accent: 'amber',
  },
  {
    slug: 'bangun-masjid',
    title: 'Bangun Masjid',
    subtitle: 'Wakaf Pembangunan Masjid YPSMA',
    description: 'Bantu pembangunan masjid di lingkungan YPSMA sebagai pusat ibadah dan kegiatan keagamaan untuk siswa & santri.',
    ogTitle: 'Bangun Masjid YPSMA — Wakaf Pembangunan Masjid',
    ogDescription: 'Bantu pembangunan masjid di lingkungan YPSMA. Tempat ibadah, pusat kegiatan keagamaan, dan penguatan iman untuk 850+ siswa & santri.',
    heroImage: '/images/campaigns/IMG_1912.webp',
    badge: 'Wakaf Masjid YPSMA 2025',
    stats: [
      { value: '850+', label: 'Jamaah Masjid' },
      { value: 'Rp 500jt', label: 'Target Pembangunan' },
      { value: 'Masjid', label: 'Pusat Ibadah & Dakwah' },
    ],
    stories: [
      {
        icon: '🕌',
        title: 'Masjid — Jantung Pendidikan Islam',
        body: 'Di YPSMA, masjid bukan hanya tempat shalat. Ini adalah ruang belajar, pusat dakwah, tempat musyawarah, dan penguat ukhuwah. Kini masjid yang ada sudah tidak mampu menampung 850+ siswa dan santri.',
      },
      {
        icon: '📿',
        title: 'Setiap Shalat Berjamaah, Ada Pahala untuk Anda',
        body: 'Masjid ini akan menjadi pusat kegiatan keagamaan untuk RA, MI, SMP, dan PPTQ. Setiap shalat berjamaah, setiap ayat Al-Qur\'an yang dibacakan di sini, pahalanya akan terus mengalir kepada para wakif.',
      },
      {
        icon: '🏗️',
        title: 'Bangun Fisik, Teguhkan Iman',
        body: 'Masjid baru akan dilengkapi area shalat yang lebih luas, tempat wudhu yang representatif, perpustakaan, dan ruang serbaguna. Investasi akhirat yang akan dinikmati generasi demi generasi.',
      },
    ],
    budgetLabel: 'Rencana Pembangunan Masjid',
    budgetItems: [
      { label: 'Pembangunan Bangunan Utama', amount: 'Rp 350.000.000' },
      { label: 'Interior & Perlengkapan', amount: 'Rp 75.000.000' },
      { label: 'Tempat Wudhu & Sanitasi', amount: 'Rp 40.000.000' },
      { label: 'Perpustakaan & Ruang Belajar', amount: 'Rp 20.000.000' },
      { label: 'Cadangan & Pengembangan', amount: 'Rp 15.000.000' },
    ],
    budgetTotal: 'Rp 500.000.000',
    galleryImages: [
      '/images/campaigns/IMG_1912.webp',
      '/images/campaigns/IMG_1919.webp',
      '/images/campaigns/IMG_1921.webp',
      '/images/campaigns/IMG_1875.webp',
      '/images/campaigns/IMG_1878.webp',
      '/images/IMG_8876.webp',
      '/images/IMG_8915.webp',
      '/images/IMG_8966.webp',
    ],
    tiers: [
      { amount: 100000, label: 'Rp 100.000', impact: 'Donasi 1 meter persegi lantai masjid', featured: false },
      { amount: 500000, label: 'Rp 500.000', impact: 'Donasi 5 meter persegi', featured: false },
      { amount: 1000000, label: 'Rp 1.000.000', impact: 'Donasi 10 meter persegi + nama di prasasti', featured: true },
      { amount: 5000000, label: 'Rp 5.000.000', impact: 'Wakaf 1 tiang masjid', featured: false },
      { amount: 10000000, label: 'Rp 10.000.000', impact: 'Wakaf 1 ruang kelas TPQ', featured: false },
      { amount: 25000000, label: 'Rp 25.000.000', impact: 'Wakaf 1 kubah / karpet masjid', featured: false },
    ],
    faqs: [
      {
        question: 'Apakah wakaf ini bersifat abadi?',
        answer: 'Ya, wakaf masjid termasuk amal jariyah yang pahalanya terus mengalir selama masjid ini digunakan untuk ibadah dan kegiatan keagamaan. Nama Anda akan tercatat sebagai wakif.',
      },
      {
        question: 'Apakah saya bisa wakaf per meter persegi?',
        answer: 'Tentu! Mulai dari Rp 100.000 per meter persegi. Setiap kontribusi akan dicatat dan dilaporkan perkembangannya. Anda juga bisa bergabung dengan grup WA wakif untuk memantau progres pembangunan.',
      },
      {
        question: 'Apakah ada sertifikat wakaf?',
        answer: 'Ya, setiap wakif akan mendapatkan sertifikat wakaf digital sebagai bukti partisipasi. Untuk nominal tertentu, nama wakif akan diabadikan di prasasti masjid.',
      },
      {
        question: 'Kapan target pembangunan selesai?',
        answer: 'Kami menargetkan pembangunan selesai dalam 12 bulan sejak dana terkumpul 70%. Progress pembangunan akan di-update secara berkala di website dan grup WA wakif.',
      },
    ],
    accent: 'sky',
  },
];
