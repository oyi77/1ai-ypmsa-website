export interface CampaignBudgetItem {
  label: string;
  amount: string;
}

export interface CampaignTokoh {
  name: string;
  age: string;
  asal: string;
  role?: string;
  story: string;
  quote: string;
  photo: string;
}

export interface CampaignTestimoni {
  name: string;
  role: string;
  quote: string;
  photo?: string;
}

export interface CampaignUpdate {
  status: string;
  progress: number;
  note: string;
  date: string;
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
  accent: string;
  /** Documentary storytelling fields */
  hook?: string;
  masalah?: { icon: string; title: string; body: string }[];
  tokoh?: CampaignTokoh;
  testimoni?: CampaignTestimoni[];
  campaignUpdate?: CampaignUpdate;
  videoUrl?: string;
  videoThumbnail?: string;
}


export const CAMPAIGNS: Campaign[] = [
  // ═══════════════════════════════════════════════════════════
  // 1. SEDEKAH PANGAN SANTRI — ⭐⭐⭐⭐⭐
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'sedekah-pangan-santri',
    title: 'Sedekah Pangan Santri',
    subtitle: 'Penuhi Gizi 250 Santri Penghafal Al-Qur\'an',
    description: 'Bantu penuhi kebutuhan makan 3x sehari untuk 250 santri penghafal Al-Qur\'an di PPTQ Darussalam Jombang. Rp 58,8 juta/target bulanan untuk gizi santri dhuafa.',
    ogTitle: 'Sedekah Pangan Santri — Penuhi Gizi 250 Santri Penghafal Al-Qur\'an',
    ogDescription: 'Bantu penuhi kebutuhan makan 3x sehari untuk 250 santri penghafal Al-Qur\'an di PPTQ Darussalam Jombang.',
    heroImage: '/images/drive-new/makan/bagi-makan-1.webp',
    badge: 'Program Pangan Santri — Rutin Bulanan',
    stats: [
      { value: '250', label: 'Santri Mukim' },
      { value: 'Rp 58,8jt', label: 'Target Bulanan' },
      { value: '3x Sehari', label: 'Makan Bergizi' },
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
        body: 'Seluruh donasi tercatat dan dilaporkan. Mulai dari pembelian beras, lauk-pauk, sayur, hingga gas dapur — semuanya teraudit dan bisa Anda akses kapan saja.',
      },
      {
        icon: '🤲',
        title: 'Pahala Berkelanjutan',
        body: 'Setiap suapan yang sampai ke santri adalah amal jariyah yang terus mengalir. Satu porsi makanan yang Anda sedekahkan hari ini akan menjadi energi bagi mereka dalam menghafal ayat-ayat Allah.',
      },
    ],
    budgetLabel: 'Rincian Biaya Pangan Bulanan (250 Santri)',
    budgetItems: [
      { label: 'Beras 2.500 kg (karung 25kg × 100)', amount: 'Rp 17.500.000' },
      { label: 'Lauk-pauk (ayam, ikan, telur, tempe,tahu)', amount: 'Rp 15.000.000' },
      { label: 'Sayur & buah segar', amount: 'Rp 7.000.000' },
      { label: 'Bumbu dapur, minyak, gas elpiji', amount: 'Rp 5.500.000' },
      { label: 'Susu & vitamin santri', amount: 'Rp 5.000.000' },
    ],
    budgetTotal: 'Rp 50.000.000',
    galleryImages: [
      '/images/drive-new/makan/bagi-makan-1.webp',
      '/images/drive-new/makan/bagi-makan-2.webp',
      '/images/drive-new/makan/bagi-makan-3.webp',
      '/images/drive-new/makan/bagi-makan-4.webp',
    ],
    tiers: [
      { amount: 50000, label: 'Rp 50.000', impact: 'Makan 1 santri 3 hari' },
      { amount: 100000, label: 'Rp 100.000', impact: 'Makan 2 santri 3 hari' },
      { amount: 250000, label: 'Rp 250.000', impact: 'Makan 5 santri 3 hari', featured: true },
      { amount: 500000, label: 'Rp 500.000', impact: 'Makan 10 santri 3 hari' },
    ],
    faqs: [
      { question: 'Apakah donasi saya tersalurkan 100%?', answer: 'Ya, kami transparan. Setiap donasi tercatat dan dilaporkan penggunaannya. Biaya operasional yayasan dipisahkan dan sudah termasuk dalam target donasi (maks 15%).' },
      { question: 'Bisa donasi rutin setiap bulan?', answer: 'Bisa! Anda bisa menjadi donatur tetap dengan nominal berapa pun. Kami kirimkan laporan dampak setiap bulan.' },
      { question: 'Bagaimana cara konfirmasi transfer?', answer: 'Kirim bukti transfer ke WhatsApp 0822-3455-1160. Kami akan konfirmasi dan doakan.' },
    ],
    hook: 'Tiap Hari 600 Piring — Tapi Bahan Makanan Makin Mahal, Dapur Mulai Terbebani',
    masalah: [
      { icon: '🍚', title: 'Dalam Angka 600 Piring', body: 'Setiap hari, yayasan menyediakan 860 piring makanan: sarapan, makan siang dan malam. Sebulan ≈ 25.800 piring. Harga beras naik 15-20% sejak awal 2026. Lauk tambah mahal. Dapur harus pintar-pintar mengatur menu.' },
      { icon: '🧮', title: 'Biaya Dapur Bulanan', body: 'Kebutuhan dapur bulanan rata-rata Rp 16-18 juta untuk 600 santri dan pengurus. Bukan hanya beras (2,7 ton/bulan), tapi juga lauk, sayur, minyak, gula, teh, gas. Belum lagi jika harga mendadak naik.' },
      { icon: '🤲', title: 'Amal Jariyah Paling Mudah', body: 'Memberi makan orang yang belajar Al-Qur\'an — pahalanya berlipat. Rasulullah bersabda: sebaik-baik kalian adalah yang belajar Al-Qur\'an dan mengajarkannya. Anda bisa menjadi bagian dari kebaikan ini, mulai dari Rp 50.000 untuk 1 santri/bulan.' },
    ],
    tokoh: {
      name: 'Fatonah',
      age: '14 tahun',
      asal: 'Kelas 8 PPTQ',
      story: 'Fatonah adalah santri yatim piatu yang 2 tahun tinggal di pondok. Ia paling rajin membantu di dapur. "Saya ingin masak untuk adik-adik nanti. Kakek saya dulu koki di pesantren. Saya belajar masak dari beliau." Fatonah hafal 15 juz dan bercita-cita punya restoran sendiri.',
      quote: 'Saya senang di dapur. Tapi kadang sedih kalau lihat stok beras mau habis. Saya doakan semoga Allah kirim banyak donatur untuk kami.',
      photo: '/images/drive-new/wisuda/wisuda-1.webp',
    },
    testimoni: [
      { name: 'Nyai Hj. Romlah', role: 'Pengasuh Pondok', quote: 'Jujur, setiap akhir bulan saya deg-degan menghitung sisa anggaran dapur. Tapi Allah selalu kirim rezeki lewat donatur. Program pangan ini sangat membantu.' },
      { name: 'Mbah Waginah', role: 'Juru Masak', quote: 'Saya masak untuk anak-anak ini sudah 10 tahun. Rasanya seperti masak untuk anak cucu sendiri. Saya rela bangun jam 3 subuh biar nasi hangat siap untuk mereka.' },
    ],
    campaignUpdate: {
      status: 'berjalan',
      progress: 55,
      note: 'Harga beras rata-rata Rp 13.500/kg. Satu karung 50kg bertahan 2 hari untuk 600 orang. Kami butuh dana rutin setiap bulan untuk menjaga stok dapur tetap aman.',
      date: 'Juli 2026',
    },
    accent: 'emerald',
  },

  // ═══════════════════════════════════════════════════════════
  // 2. SEDEKAH AL-QUR'AN — ⭐⭐⭐⭐⭐
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'sedekah-al-quran',
    title: 'Sedekah Al-Qur\'an',
    subtitle: '600 Mushaf untuk 600 Penghafal Al-Qur\'an',
    description: 'Harga kertas melonjak imbas kurs Dolar. Bantu sedekahkan 1 mushaf Al-Qur\'an hafalan untuk santri dan siswa YPSMA. Rp 100.000/mushaf.',
    ogTitle: 'Sedekah Al-Qur\'an YPSMA — 600 Mushaf untuk Penghafal Al-Qur\'an',
    ogDescription: 'Harga kertas naik imbas Dolar. Bantu sedekahkan Al-Qur\'an hafalan untuk 600 santri dan siswa YPSMA.',
    heroImage: '/images/drive-new/wisuda/wisuda-1.webp',
    badge: 'Program Sedekah Al-Qur\'an — Satu Kali',
    stats: [
      { value: '600', label: 'Mushaf Dibutuhkan' },
      { value: 'Rp 100rb', label: 'Per Mushaf' },
      { value: 'Rp 70,6jt', label: 'Total Target' },
    ],
    stories: [
      {
        icon: '📖',
        title: 'Al-Qur\'an yang Usang',
        body: 'Banyak santri menghafal dari mushaf yang sudah robek dan buram karena penggunaan bertahun-tahun. Satu mushaf dipakai bergantian 3-4 santri. Kertas tipis dan mudah sobek.',
      },
      {
        icon: '📈',
        title: 'Harga Melonjak Drastis',
        body: 'Kenaikan harga pulp impor membuat harga Al-Qur\'an naik hingga 40%. Dari yang biasa Rp 70.000, kini Rp 100.000 per mushaf. Namun kebutuhan tidak bisa ditunda.',
      },
      {
        icon: '🤲',
        title: 'Pahala Mengalir Setiap Ayat',
        body: 'Setiap ayat yang dibaca dari mushaf hasil donasi Anda, pahalanya terus mengalir meski Anda sudah tiada. Sedekah jariyah yang tak pernah putus.',
      },
    ],
    budgetLabel: 'Rincian Pengadaan Al-Qur\'an',
    budgetItems: [
      { label: 'Pembelian 600 mushaf Al-Qur\'an hafalan × Rp 100.000', amount: 'Rp 60.000.000' },
      { label: 'Biaya operasional & distribusi (15%)', amount: 'Rp 10.588.235' },
    ],
    budgetTotal: 'Rp 70.588.235',
    galleryImages: [
      '/images/drive-new/wisuda/wisuda-1.webp',
      '/images/drive-new/wisuda/wisuda-2.webp',
      '/images/drive-new/wisuda/wisuda-3.webp',
      '/images/drive-new/wisuda/wisuda-4.webp',
    ],
    tiers: [
      { amount: 50000, label: '½ Mushaf', impact: '½ Al-Qur\'an untuk 1 santri' },
      { amount: 100000, label: '1 Mushaf', impact: '1 Al-Qur\'an untuk 1 santri', featured: true },
      { amount: 250000, label: '2,5 Mushaf', impact: '2-3 Al-Qur\'an' },
      { amount: 500000, label: '5 Mushaf', impact: '5 Al-Qur\'an — untuk 1 kamar' },
    ],
    faqs: [
      { question: 'Al-Qur\'an jenis apa yang dibeli?', answer: 'Al-Qur\'an hafalan ukuran A5 dengan kertas kualitas terbaik, warna blok tajwid, dan terjemahan. Cocok untuk santri yang sedang menghafal.' },
      { question: 'Apada Al-Qur\'an dikirim ke santri langsung?', answer: 'Ya, setiap mushaf didistribusikan langsung ke santri/siswa YPSMA. Kami juga akan memberi stiker doa dari donatur.' },
      { question: 'Bisa titip nama di mushaf?', answer: 'Bisa! Untuk donasi 1 mushaf atau lebih, kami tempel nama/hafalan doa dari donatur di sampul mushaf.' },
    ],
    hook: '600 Al-Qur\'an Robek dan Buram — Mereka Tetap Mengaji, Tapi Hati Kami Teriris',
    masalah: [
      { icon: '📖', title: 'Mushaf Usang yang Tak Layak', body: 'Bayangkan menghafal dari mushaf yang buram, sobek di pinggirnya, dan halamannya lepas. Itulah kenyataan 600 santri YPSMA. Satu mushaf dipakai bergantian oleh 3-4 santri. Kertasnya tipis, mudah robek.' },
      { icon: '💰', title: 'Harga Melonjak Akibat Dolar', body: 'Harga pulp dan kertas impor naik 40% imbas kurs Dolar. Harga Al-Qur\'an hafalan naik dari Rp 70.000 menjadi Rp 100.000 per mushaf. Kebutuhan mendesak, tapi ongkos semakin besar.' },
      { icon: '📿', title: 'Setiap Ayat adalah Pahala', body: 'Sedekah Al-Qur\'an adalah amal jariyah yang tak terputus. Setiap huruf yang dibaca santri dari mushaf hasil donasi Anda, pahalanya mengalir terus — bahkan saat Anda sudah tiada.' },
    ],
    tokoh: {
      name: 'Hafidz',
      age: '14 tahun',
      asal: 'Kelas 8 PPTQ',
      story: 'Hafidz menghafal 5 juz pertama dari mushaf yang hampir robek seluruhnya. Ia harus merekatkan halaman dengan selotip setiap kali sobek. "Saya tahu setiap huruf Al-Qur\'an berpahala, Kak. Saya tidak mau berhenti hanya karena mushaf saya robek." Ia kini hafal 12 juz.',
      quote: 'Saya hanya ingin satu mushaf baru. Satu saja. Biar tidak ada lagi halaman yang lepas waktu saya hafalkan.',
      photo: '/images/drive-new/wisuda/wisuda-3.webp',
    },
    testimoni: [
      { name: 'Ustadz Zainal', role: 'Koordinator Tahfidz', quote: 'Kami kadang harus menghentikan setoran karena mushaf santri tidak terbaca. Ini sangat menghambat target hafalan mereka. Al-Qur\'an baru bukan kemewahan, tapi kebutuhan pokok.' },
      { name: 'Nyai Hj. Romlah', role: 'Pengasuh Pondok', quote: 'Anak-anak tidak pernah mengeluh. Mereka tetap semangat meski mushafnya robek. Sayang sekali kalau semangat mereka tidak kita dukung dengan Al-Qur\'an yang layak.' },
    ],
    campaignUpdate: {
      status: 'berjalan',
      progress: 30,
      note: 'Dari target 600 mushaf, 180 sudah terbeli dan didistribusikan. Sisa 420 mushaf masih menunggu donasi. Target distribusi semua mushaf: Oktober 2026.',
      date: 'Juli 2026',
    },
    accent: 'amber',
  },

  // ═══════════════════════════════════════════════════════════
  // 3. ORANG TUA ASUH SANTRI — ⭐⭐⭐⭐⭐
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'orang-tua-asuh',
    title: 'Orang Tua Asuh Santri',
    subtitle: 'Jadi Orang Tua Asuh untuk 1 Santri Dhuafa',
    description: 'Rp 10jt/anak/tahun untuk 1 santri dhuafa. Jadi Orang Tua Asuh dan ubah masa depan mereka — SPP, asrama, makan, kitab, kesehatan.',
    ogTitle: 'Orang Tua Asuh Santri YPSMA — Ubah Masa Depan Santri Dhuafa',
    ogDescription: 'Jadi orang tua asuh untuk santri dhuafa. Rp 10jt/anak/tahun mencakup SPP, asrama, makan, kitab, dan kesehatan.',
    heroImage: '/images/campaigns/Berdoa.webp',
    badge: 'Program Orang Tua Asuh — Tahunan',
    stats: [
      { value: '237', label: 'Santri Aktif' },
      { value: 'Rp 10jt', label: 'Per Anak/Tahun' },
      { value: '100%', label: 'Laporan Transparan' },
    ],
    stories: [
      {
        icon: '🎓',
        title: 'Mereka Hanya Butuh Kesempatan',
        body: 'Mereka datang dari keluarga dhuafa — buruh tani, pemulung, penjual jamu — dengan mimpi yang sama besarnya dengan anak siapa pun. Tanpa uluran tangan kita, banyak yang harus putus sekolah.',
      },
      {
        icon: '🤝',
        title: 'Apa itu "Orang Tua Asuh"?',
        body: 'Anda berkomitmen membiayai kebutuhan pendidikan satu santri dhuafa selama satu tahun penuh. Bukan hanya SPP, tetapi juga asrama, 3x makan sehari, kitab/buku, dan jaminan kesehatan.',
      },
      {
        icon: '📈',
        title: 'Dampak yang Bisa Anda Pantau',
        body: 'Setiap 3 bulan Anda mendapat laporan rapor, foto, dan surat dari santri asuh. Anda bisa melihat langsung bagaimana donasi Anda mengubah masa depan mereka.',
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
    ],
    tiers: [
      { amount: 50000, label: 'Rp 50.000/bln', impact: '1/17 biaya santri per bulan' },
      { amount: 100000, label: 'Rp 100.000/bln', impact: '1/8 biaya santri per bulan' },
      { amount: 250000, label: 'Rp 250.000/bln', impact: '1/3 biaya santri per bulan', featured: true },
      { amount: 833000, label: 'Rp 833.000/bln', impact: '💎 1 FULL santri asuh!' },
    ],
    faqs: [
      { question: 'Apa bedanya dengan donasi biasa?', answer: 'Donasi biasa bersifat umum. Orang Tua Asuh adalah komitmen spesifik untuk 1 santri — Anda mendapat laporan perkembangan santri tersebut secara berkala.' },
      { question: 'Bisa pilih santri tertentu?', answer: 'Bisa. Kami akan kirimkan profil beberapa santri yang membutuhkan orang tua asuh. Anda bisa memilih.' },
      { question: 'Komitmen minimal berapa lama?', answer: 'Komitmen ideal 1 tahun ajaran. Namun jika berhalangan, donasi bisa dialihkan ke program lain.' },
    ],
    hook: 'Rp 833.000/Bulan Bisa Mengubah Hidup Seorang Santri — Mau Jadi Orang Tua Asuh?',
    masalah: [
      { icon: '🎓', title: 'Mimpi yang Terancam Putus', body: 'Ratusan santri datang dari keluarga dhuafa — anak buruh tani, pemulung, penjual jamu, pembantu rumah tangga. Beasiswa yang ada tidak cukup. Setiap tahun, beberapa anak harus pulang karena orang tua tidak mampu membayar SPP.' },
      { icon: '👨👩👧👧', title: 'Mereka Juga Ingin Sekolah', body: 'Di balik sorotan mata mereka yang ceria saat mengaji, tersimpan kekhawatiran: "Apakah bulan depan saya masih bisa sekolah?" Mereka anak-anak yang sama seperti anak kita, hanya kurang beruntung secara ekonomi.' },
      { icon: '🤝', title: 'Perubahan Sejati', body: 'Menjadi orang tua asuh bukan sekadar donasi. Anda menjadi bagian dari perjalanan hidup mereka. Setiap 3 bulan Anda mendapat laporan rapor, foto, dan surat dari anak asuh. Hubungan yang tidak ternilai.' },
    ],
    tokoh: {
      name: 'Dewi Sartika',
      age: '12 tahun',
      asal: 'Kelas 7 PPTQ — Nganjuk',
      story: 'Dewi adalah anak dari buruh tani yang penghasilannya tidak menentu. Ketika panen raya, mereka bisa makan tiga kali sehari. Tapi di musim paceklik, Dewi sering hanya makan ngetan — nasi saja. Ia hampir putus sekolah saat kelas 6 karena ibunya sakit. Yayasan memberinya beasiswa penuh untuk mondok.',
      quote: 'Saya ingin hafal Al-Qur\'an 30 juz, Ustadzah. Biar ibu saya bangga. Saya akan doakan kakak-kakak donatur setiap malam.',
      photo: '/images/drive-new/wisuda/wisuda-2.webp',
    },
    testimoni: [
      { name: 'Bapak H. Ahmad', role: 'Donatur Orang Tua Asuh', quote: 'Saya jadi orang tua asuh untuk 2 santri. Setiap dapat surat dari mereka, hati saya terharu. Ini bukan donasi biasa, ini jadi orang tua buat mereka.' },
      { name: 'Nyai Hj. Romlah', role: 'Pengasuh Pondok', quote: 'Banyak calon santri harus kami tolak setiap tahun karena keterbatasan dana. Setiap orang tua asuh baru berarti satu anak lagi yang bisa merasakan pendidikan pesantren.' },
    ],
    campaignUpdate: {
      status: 'berjalan',
      progress: 40,
      note: '237 santri aktif saat ini. 65 di antaranya adalah anak dhuafa dengan SPP gratis sepenuhnya dari donor. Kami masih memiliki 30 calon santri dhuafa di waiting list yang menunggu orang tua asuh.',
      date: 'Juli 2026',
    },
    accent: 'blue',
  },

  // ═══════════════════════════════════════════════════════════
  // 4. PATUNGAN LISTRIK — ⭐⭐⭐⭐
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'patungan-listrik',
    title: 'Patungan Listrik',
    subtitle: 'Terangi 600 Santri & Siswi dalam Belajar',
    description: 'Bantu biaya listrik operasional yayasan untuk 600 santri, siswa, dan aktivitas belajar mengajar. Rp 5,9 juta/target bulanan.',
    ogTitle: 'Patungan Listrik YPSMA — Terangi 600 Santri Belajar',
    ogDescription: 'Bantu biaya listrik operasional yayasan untuk 600 santri dan siswa.',
    heroImage: '/images/campaigns/IMG_1860.webp',
    badge: 'Program Listrik — Rutin Bulanan',
    stats: [
      { value: '600+', label: 'Santri & Siswa' },
      { value: 'Rp 5,9jt', label: 'Target Bulanan' },
      { value: '24 Jam', label: 'Listrik Nyala' },
    ],
    stories: [
      {
        icon: '💡',
        title: 'Belajar di Bawah Lampu Temaram',
        body: 'Kelas dan asrama membutuhkan listrik 24 jam — untuk belajar malam, penerangan asrama, pompa air, dan komputer administrasi. Ketika listrik padam, aktivitas belajar terhenti.',
      },
      {
        icon: '📊',
        title: 'Rincian Pemakaian Listrik',
        body: 'Listrik kelas & kantor (siang), asrama & pondok (malam), pompa air, dan dapur. Total pemakaian mencapai Rp 5 juta per bulan. Dana ini belum termasuk perawatan instalasi.',
      },
      {
        icon: '🤲',
        title: 'Donasi Kecil, Dampak Besar',
        body: 'Rp 50.000 Anda sudah bisa menerangi asrama selama 2 malam. Cukup Rp 10.000/hari, Anda jadi donatur tetap listrik yayasan.',
      },
    ],
    budgetLabel: 'Rincian Kebutuhan Listrik Bulanan',
    budgetItems: [
      { label: 'Listrik kelas & kantor (siang)', amount: 'Rp 1.800.000' },
      { label: 'Listrik asrama & pondok (malam)', amount: 'Rp 1.500.000' },
      { label: 'Listrik pompa air', amount: 'Rp 600.000' },
      { label: 'Listrik dapur & penerangan umum', amount: 'Rp 800.000' },
      { label: 'Biaya operasional (15%)', amount: 'Rp 882.353' },
    ],
    budgetTotal: 'Rp 5.882.353',
    galleryImages: [
      '/images/campaigns/IMG_1860.webp',
      '/images/campaigns/IMG_1829.webp',
    ],
    tiers: [
      { amount: 50000, label: 'Rp 50.000', impact: 'Terangi asrama 2 malam' },
      { amount: 100000, label: 'Rp 100.000', impact: 'Terangi 1 kelas 1 minggu' },
      { amount: 250000, label: 'Rp 250.000', impact: 'Listrik dapur 1 bulan', featured: true },
      { amount: 500000, label: 'Rp 500.000', impact: 'Listrik pompa air 1 bulan' },
    ],
    faqs: [
      { question: 'Apakah listrik benar-benar diperlukan 24 jam?', answer: 'Ya. Asrama santri dihuni 24 jam. Kegiatan hafalan dimulai jam 4 pagi (subuh) hingga malam. Kelas reguler siang hari. Pompa air untuk sumur juga butuh listrik.' },
      { question: 'Kenapa tidak pakai panel surya?', answer: 'Investasi awal panel surya untuk kapasitas 600 orang sangat besar (Rp 200jt+). Saat ini kami fokus pada kebutuhan operasional dasar dulu.' },
    ],
    hook: 'Kegelapan Bukan Penghalang — Tapi Lampu Akan Membuat Mereka Lebih Bersinar',
    masalah: [
      { icon: '💡', title: 'Belajar Malam di Bawah Lilin', body: 'Listrik padam di musim hujan sering terjadi. Santri yang harusnya murojaah malam terpaksa berhenti. Ujian kenaikan kelas jadi terhambat. Generator sewa mahal, tidak terjangkau untuk rutin.' },
      { icon: '📊', title: 'Biaya Bulanan Membengkak', body: 'Dengan 4 kelas, 6 ruang asrama, kantor, dapur, pompa air, dan mushala — pemakaian listrik mencapai Rp 5,9 juta per bulan. Belum lagi kenaikan tarif listrik per April 2026.' },
      { icon: '🔋', title: 'Bukan Sekadar Lampu', body: 'Listrik bukan hanya untuk penerangan. Pompa air untuk wudhu dan MCK butuh listrik. Dapur masak untuk 600 orang butuh listrik. Komputer administrasi butuh listrik. Semua berhenti tanpa listrik.' },
    ],
    tokoh: {
      name: 'Muhammad Rizky',
      age: '17 tahun',
      asal: 'Kelas 12 PPTQ',
      story: 'Rizky adalah santri senior yang hafal 30 juz tahun ini. Ia sering mengajar adik-adik kelasnya malam hari. "Saat listrik padam, saya ajak mereka ngaji di teras masjid yang ada lampu emergency. Yang penting tidak berhenti belajar." Rizky bercita-cita jadi hafiz internasional.',
      quote: 'Saya tidak menyerah walau gelap. Tapi kalau listrik nyala 24 jam, saya bisa ngajar lebih banyak adik-adik.',
      photo: '/images/drive-new/wisuda/wisuda-4.webp',
    },
    testimoni: [
      { name: 'Ustadz Ghufron', role: 'Kepala Sekolah', quote: 'Listrik adalah nadi operasional yayasan. Setiap minggu kami harus memilih: bayar listrik atau bayar honor guru? Ini dilema yang terus berulang.' },
      { name: 'Nyai Hj. Romlah', role: 'Pengasuh Pondok', quote: 'Saya tidak ingin santri-santri saya belajar dalam gelap. Mereka datang dengan semangat mencari ilmu, kita wajib fasilitasi.' },
    ],
    campaignUpdate: {
      status: 'berjalan',
      progress: 45,
      note: 'Setiap bulan rata-rata tercapai 45% dari target listrik Rp 5,9 juta. Sisanya ditutup dari dana internal yayasan.',
      date: 'Juli 2026',
    },
    accent: 'yellow',
  },

  // ═══════════════════════════════════════════════════════════
  // 5. SUMUR AIR BERSIH — ⭐⭐⭐⭐
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'sumur-air-bersih',
    title: 'Sumur Air Bersih & MCK',
    subtitle: 'Selamatkan 600 Santri dari Krisis Kamar Mandi',
    description: 'Pembangunan sumur bor dalam dan 8 pintu kamar mandi/WC baru. Saat ini 2 kamar mandi dipakai bergantian oleh 600 orang — darurat!',
    ogTitle: 'Sumur Air Bersih & MCK YPSMA — Akhiri Krisis Kamar Mandi 600 Santri',
    ogDescription: 'Bangun sumur bor dalam dan 8 kamar mandi baru. Saat ini 2 kamar mandi untuk 600 orang — situasi darurat!',
    heroImage: '/images/drive-new/sarpras/11.webp',
    badge: 'Program Infrastruktur — Satu Kali',
    stats: [
      { value: '600', label: 'Santri & Siswa' },
      { value: '2→8', label: 'Kamar Mandi' },
      { value: 'Rp 176jt', label: 'Total Target' },
    ],
    stories: [
      {
        icon: '🚰',
        title: 'Antre Panjang Setiap Pagi',
        body: '2 kamar mandi untuk 600 orang. Bayangkan antrean setiap pagi sebelum subuh dan sekolah. Santri harus bangun jauh lebih awal hanya untuk mandi. Situasi ini sudah berlangsung bertahun-tahun.',
      },
      {
        icon: '💧',
        title: 'Sumur Eksisting Mulai Kering',
        body: 'Sumur lama sudah tidak mencukupi. Debit air menurun drastis di musim kemarau. Kami perlu sumur bor dalam (50-60 meter) dengan pompa besar untuk mencukupi kebutuhan 600 orang.',
      },
      {
        icon: '🛠️',
        title: 'Solusi Permanen',
        body: 'Pembangunan 8 pintu kamar mandi/WC baru tipe komunal, lengkap dengan septic tank bio-filter, toren air 5.000 liter, dan instalasi pipa terintegrasi. Solusi jangka panjang untuk 600 orang.',
      },
    ],
    budgetLabel: 'Rincian Pembangunan Sumur & MCK',
    budgetItems: [
      { label: 'Pengeboran sumur artesis 50-60m', amount: 'Rp 18.000.000' },
      { label: 'Pompa submersible 2HP + panel otomatis', amount: 'Rp 8.500.000' },
      { label: 'Toren 5.000 liter + tower besi', amount: 'Rp 16.500.000' },
      { label: 'Pembangunan gedung MCK 8 pintu (fondasi, bata, keramik, kloset, pintu, atap)', amount: 'Rp 88.000.000' },
      { label: 'Instalasi pipa PVC + septic tank bio-filter', amount: 'Rp 19.000.000' },
    ],
    budgetTotal: 'Rp 176.470.588',
    galleryImages: [
      '/images/drive-new/sarpras/11.webp',
      '/images/drive-new/sarpras/12.webp',
      '/images/drive-new/sarpras/5.webp',
      '/images/drive-new/sarpras/10.webp',
      '/images/drive-new/sarpras/6.webp',
    ],
    tiers: [
      { amount: 50000, label: '50rb', impact: '1 meter pipa instalasi' },
      { amount: 100000, label: '100rb', impact: '1/12 kloset + pintu PVC' },
      { amount: 500000, label: '500rb', impact: '1/6 biaya 1 pintu kamar mandi' },
      { amount: 2000000, label: 'Wakaf 1 Pintu MCK', impact: '💎 Bangun 1 kamar mandi penuh', featured: true },
    ],
    faqs: [
      { question: 'Apakah sudah ada survey lokasi?', answer: 'Sudah. Tim teknis sudah survey dan memastikan titik pengeboran. Kontraktor borongan sudah siap eksekusi begitu dana terkumpul 50%.' },
      { question: 'Berapa lama pembangunan?', answer: 'Estimasi 2-3 minggu untuk pengeboran sumur, 3-4 minggu pembangunan gedung MCK. Total maksimal 2 bulan.' },
      { question: 'Bisa wakaf 1 kamar mandi penuh?', answer: 'Bisa! Biaya 1 pintu kamar mandi lengkap ± Rp 12-15jt. Anda bisa wakaf dan nama Anda diabadikan di gedung MCK.' },
    ],
    hook: '2 Kamar Mandi untuk 600 Orang — Berapa Lama Lagi Mereka Harus Antre?',
    masalah: [
      { icon: '🚰', title: 'Antrean Setiap Pagi dan Malam', body: 'Bayangkan 600 orang berebut 2 kamar mandi. Santri putri harus bangun jam 3 pagi hanya untuk antre mandi sebelum subuh. Sering telat jamaah karena kehabisan waktu.' },
      { icon: '💧', title: 'Sumur Mulai Mengering', body: 'Sumur lama kedalaman 20 meter mulai tidak mencukupi. Debit air menurun drastis di musim kemarau. Pompa sering rusak karena bekerja ekstra keras.' },
      { icon: '😷', title: 'Dampak pada Kesehatan dan Ibadah', body: 'Kurangnya air bersih mempengaruhi kebersihan dan kesehatan santri. Beberapa santri terkena gatal-gatal dan infeksi kulit. Wudhu pun harus antre.' },
    ],
    tokoh: {
      name: 'Siti Khodijah',
      age: '16 tahun',
      asal: 'Kelas 10 PPTQ',
      story: 'Siti adalah santri favorit di pondok. Ia hafal 15 juz dalam 2 tahun. Tapi setiap pagi ia harus bangun jam 3 subuh untuk antre kamar mandi. "Saya hafal Al-Qur\'an karena saya antre mandi jam 3 pagi, jadi saya bisa murojaah sambil nunggu," katanya dengan mata berkaca-kaca.',
      quote: 'Saya tidak masalah antre, kok. Tapi kadang saya sedih kalau lihat adik-adik kelas yang kedinginan nunggu giliran mandi subuh.',
      photo: '/images/drive-new/wisuda/wisuda-2.webp',
    },
    testimoni: [
      { name: 'Ustadzah Halimah', role: 'Pembina Asrama Putri', quote: 'Setiap pagi saya saksikan perjuangan santri putri untuk mandi. Kadang mereka hanya sempat bersihkan kaki dan wajah saja. Ini bukan kehidupan yang layak untuk anak-anak yang sedang menghafal Al-Qur\'an.' },
      { name: 'Bapak Kepala Desa', role: 'Kepala Desa Gondek', quote: 'Yayasan ini sudah memberikan kontribusi besar bagi desa kami. Wajar jika desa mendukung penuh pembangunan MCK ini.' },
    ],
    campaignUpdate: {
      status: 'berjalan',
      progress: 22,
      note: 'Tim teknis sudah survey titik pengeboran. Kontraktor siap eksekusi begitu dana terkumpul 50%. Estimasi pembangunan 2 bulan.',
      date: 'Juli 2026',
    },
    accent: 'cyan',
  },

  // ═══════════════════════════════════════════════════════════
  // 6. SARANA PRASARANA — ⭐⭐⭐
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'sarana-prasarana',
    title: 'Sarana Prasarana',
    subtitle: 'Perbaiki Kelas & Asrama untuk 600 Siswa',
    description: 'Perbaikan atap bocor, meja-kursi rusak, pengecatan, dan kasur asrama. Seluruhnya terdampak kenaikan harga material bangunan.',
    ogTitle: 'Sarana Prasarana YPSMA — Perbaiki Fasilitas 600 Siswa',
    ogDescription: 'Perbaikan atap bocor, meja-kursi, pengecatan, dan kasur asrama yang terdampak kenaikan harga material.',
    heroImage: '/images/drive-new/sarpras/1.webp',
    badge: 'Program Sarpras — Satu Kali',
    stats: [
      { value: '600', label: 'Siswa Terdampak' },
      { value: 'Rp 76,5jt', label: 'Total Target' },
      { value: '4 Item', label: 'Perbaikan' },
    ],
    stories: [
      {
        icon: '🏚️',
        title: 'Belajar di Bawah Atap Bocor',
        body: 'Musim hujan membuat beberapa ruang kelas tidak bisa dipakai karena atap bocor. Plafon gypsum rusak dan rembesan air merusak dinding. Siswa terpaksa belajar di lorong atau asrama.',
      },
      {
        icon: '🪑',
        title: 'Meja-Kursi Rusak',
        body: 'Puluhan meja dan kursi belajar sudah tidak layak pakai — patah, goyang, dan membahayakan. Semakin banyak santri baru, semakin bertambah kebutuhan fasilitas dasar.',
      },
      {
        icon: '🛏️',
        title: 'Kasur Bertingkat Menipis',
        body: 'Kasur busa asrama sudah kempis dan tidak nyaman. Banyak santri tidur di lantai beralas kardus. Kenyamanan istirahat sangat mempengaruhi semangat hafalan mereka.',
      },
    ],
    budgetLabel: 'Rincian Perbaikan Sarpras',
    budgetItems: [
      { label: 'Perbaikan atap bocor & ganti plafon gypsum', amount: 'Rp 15.000.000' },
      { label: 'Pengadaan meja-kursi baru', amount: 'Rp 18.000.000' },
      { label: 'Pengecatan ulang dinding', amount: 'Rp 12.000.000' },
      { label: 'Kasur busa bertingkat + lemari', amount: 'Rp 20.000.000' },
    ],
    budgetTotal: 'Rp 76.470.588',
    galleryImages: [
      '/images/drive-new/sarpras/1.webp',
      '/images/drive-new/sarpras/3.webp',
      '/images/drive-new/sarpras/4.webp',
      '/images/drive-new/sarpras/5.webp',
      '/images/drive-new/sarpras/6.webp',
      '/images/drive-new/sarpras/7.webp',
      '/images/drive-new/sarpras/8.webp',
      '/images/drive-new/sarpras/9.webp',
      '/images/drive-new/sarpras/10.webp',
      '/images/drive-new/sarpras/11.webp',
      '/images/drive-new/sarpras/12.webp',
    ],
    tiers: [
      { amount: 50000, label: '50rb', impact: '1 kaleng cat tembok' },
      { amount: 100000, label: '100rb', impact: '1 set meja-kursi ½' },
      { amount: 250000, label: '250rb', impact: '1 kasur busa + sprei', featured: true },
      { amount: 500000, label: '500rb', impact: 'Perbaiki atap 1 ruang kelas' },
    ],
    faqs: [
      { question: 'Prioritas perbaikan apa yang paling mendesak?', answer: 'Prioritas 1: atap bocor 2 ruang kelas (darurat). Prioritas 2: 40 set meja-kursi. Prioritas 3: pengecatan dinding lembab.' },
      { question: 'Bisa bantu dalam bentuk barang?', answer: 'Sangat bisa! Kami terima donasi kasur, meja-kursi bekas layak pakai, atau cat tembok. Hubungi kami untuk koordinasi.' },
    ],
    hook: 'Atap Bocor, Meja Patah, Kasur Kempis — Mampukah Mereka Hafal dalam Kondisi Seperti Ini?',
    masalah: [
      { icon: '🏚️', title: 'Belajar di Bawah Atap Bocor', body: 'Musim hujan membuat 2 ruang kelas tidak bisa dipakai. Air merembes dari atap, plafon gypsum jebol, lantai becek. Siswa terpaksa belajar di teras masjid atau di asrama yang sempit.' },
      { icon: '🪑', title: 'Meja-Kursi Rongsokan', body: 'Puluhan meja-kursi sudah patah, goyang, dan membahayakan. Santri menulis dengan membungkukkan badan di lantai. Belum lagi lemari asrama yang pintunya rusak semua.' },
      { icon: '🛏️', title: 'Tidur di Lantai Beralas Kardus', body: 'Banyak santri baru tidak mendapat kasur karena terbatas. Mereka tidur beralas kardus di lantai semen. Istirahat yang tidak nyaman membuat mereka sulit fokus saat menghafal subuh.' },
    ],
    tokoh: {
      name: 'Ahmad',
      age: '13 tahun',
      asal: 'Kelas 7 PPTQ',
      story: 'Ahmad adalah santri baru yang datang dari keluarga sangat sederhana. Ayahnya buruh serabutan. Selama 2 bulan pertama, Ahmad tidur di lantai tanpa kasur. Ia tidak pernah mengeluh, tapi guru-gurunya melihat semangatnya mulai menurun karena sering sakit pinggang.',
      quote: 'Saya tidak apa-apa tidur di lantai, Ustadz. Yang penting saya bisa hafal Al-Qur\'an.',
      photo: '/images/drive-new/sarpras/1.webp',
    },
    testimoni: [
      { name: 'Ustadz Faisal', role: 'Wali Kelas 8', quote: 'Kondisi ini sudah berlangsung lama. Kami para guru sudah berusaha semaksimal mungkin dengan dana yang ada. Bantuan Anda sangat berarti.' },
      { name: 'Nyai Hj. Romlah', role: 'Pengasuh Pondok', quote: 'Kasur kempis saya biarkan masih bisa dipakai, tapi meja-kursi patah dan atap bocor harus segera diperbaiki. Demi kenyamanan anak-anak dalam belajar.' },
    ],
    campaignUpdate: {
      status: 'berjalan',
      progress: 15,
      note: 'Perbaikan darurat atap kelas 1 sudah dilakukan dengan dana swadaya guru. Masih tersisa atap kelas 2, 40 meja-kursi baru, dan 25 kasur.',
      date: 'Juli 2026',
    },
    accent: 'slate',
  },

  // ═══════════════════════════════════════════════════════════
  // 7. PENGELOLAAN SAMPAH & LIMBAH — ⭐⭐⭐
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'pengelolaan-sampah',
    title: 'Pengelolaan Sampah & Limbah',
    subtitle: 'Atasi Volume Sampah 600 Orang per Hari',
    description: 'Sampah dari 600 orang per hari sangat besar. Butuh motor roda 3, bak sampah beton, dan sistem pembuangan teratur.',
    ogTitle: 'Pengelolaan Sampah YPSMA — Atasi Sampah 600 Santri',
    ogDescription: 'Pengadaan motor roda 3, TPS beton, dan sistem pengelolaan sampah untuk 600 santri dan siswa.',
    heroImage: '/images/campaigns/photo_2026-07-12_19-28-52.webp',
    badge: 'Program Lingkungan — Satu Kali',
    stats: [
      { value: '600', label: 'Orang per Hari' },
      { value: 'Rp 53jt', label: 'Total Target' },
      { value: '4 Item', label: 'Kebutuhan' },
    ],
    stories: [
      {
        icon: '🗑️',
        title: 'Sampah Menumpuk Setiap Hari',
        body: 'Dengan 600 orang, volume sampah mencapai puluhan kilogram per hari. Tidak ada armada pengangkut, sampah sering dibakar atau dibuang sembarangan. Berdampak buruk pada kesehatan santri.',
      },
      {
        icon: '🛵',
        title: 'Butuh Armada Pengangkut',
        body: 'Kami membutuhkan motor roda 3 (angkong) yang kuat untuk mengangkut sampah ke TPS desa. Harga unit naik karena suku cadang impor terdampak kenaikan Dolar.',
      },
      {
        icon: '🌱',
        title: 'Lingkungan Sehat untuk Hafalan',
        body: 'Lingkungan yang bersih dan sehat sangat mempengaruhi konsentrasi belajar dan menghafal. Pengelolaan sampah yang baik juga mengajarkan santri tentang kebersihan sebagai bagian dari iman.',
      },
    ],
    budgetLabel: 'Rincian Pengelolaan Sampah',
    budgetItems: [
      { label: 'Motor roda 3 angkong sampah', amount: 'Rp 26.000.000' },
      { label: 'Pembangunan TPS beton', amount: 'Rp 8.000.000' },
      { label: '20 tong sampah besar', amount: 'Rp 6.000.000' },
      { label: 'APD petugas & obat pengurai limbah', amount: 'Rp 5.000.000' },
    ],
    budgetTotal: 'Rp 52.941.176',
    galleryImages: [
      '/images/IMG_7500.webp',
      '/images/IMG_7575.webp',
      '/images/campaigns/IMG_1879.webp',
      '/images/campaigns/photo_2026-07-12_19-28-52.webp',
    ],
    tiers: [
      { amount: 50000, label: '50rb', impact: '1 tong sampah besar ½' },
      { amount: 100000, label: '100rb', impact: 'APD petugas 1 bulan' },
      { amount: 250000, label: '250rb', impact: '1/40 motor roda 3', featured: true },
      { amount: 500000, label: '500rb', impact: '1/4 bak sampah beton' },
    ],
    faqs: [
      { question: 'Sampahnya akan dibawa ke mana?', answer: 'Motor roda 3 akan mengangkut sampah ke TPS Desa yang sudah bekerjasama dengan yayasan. Tidak ada pembakaran sampah lagi.' },
      { question: 'Ada program daur ulang?', answer: 'Rencana ke depan: sampah organik diolah jadi kompos untuk kebun yayasan. Sampah plastik dipilah untuk didaur ulang. Tahap awal fokus pada pengangkutan dan TPS dulu.' },
    ],
    hook: 'Dari Tumpukan Sampah ke Lingkungan Sehat — 600 Santri Butuh Solusi Sekarang',
    masalah: [
      { icon: '🗑️', title: 'Puluhan Kilogram Sampah Setiap Hari', body: 'Dengan 600 orang di lingkungan yayasan, volume sampah mencapai 30-40 kg per hari. Tidak ada armada pengangkut. Selama ini sampah dibakar atau dibuang di belakang asrama, menimbulkan polusi udara dan bau tidak sedap.' },
      { icon: '🦟', title: 'Ancaman Kesehatan Santri', body: 'Tumpukan sampah menjadi sarang nyamuk, lalat, dan tikus. Kasus diare dan demam berdarah pernah terjadi. Belajar dan menghafal Al-Qur\'an sulit maksimal di lingkungan yang tidak sehat.' },
      { icon: '🌱', title: 'Solusi Berkelanjutan', body: 'Kami punya rencana: motor roda 3 untuk angkut sampah, TPS beton yang higienis, dan nantinya pengolahan sampah organik jadi kompos. Tapi semua butuh biaya yang tidak sedikit.' },
    ],
    tokoh: {
      name: 'Fatimah',
      age: '15 tahun',
      asal: 'Kelas 9 PPTQ',
      story: 'Fatimah adalah ketua regu kebersihan asrama putri. Setiap pagi ia memimpin 10 santri membersihkan lingkungan. Ia sering mengeluh karena sampah menumpuk dan tidak ada tempat pembuangan yang layak. "Saya malu kalau ada tamu datang melihat lingkungan kami," katanya.',
      photo: '/images/campaigns/IMG_1879.webp',
      quote: 'Kami ingin belajar di lingkungan yang bersih dan sehat. Tolong bantu kami, Kak.',
    },
    testimoni: [
      { name: 'Ustadz Mahmud', role: 'Kepala Asrama Putra', quote: 'Sebagai pengasuh yang setiap hari melihat kondisi ini, saya sangat berharap program ini segera terwujud. Kesehatan santri adalah prioritas kami.' },
      { name: 'Nyai Hj. Romlah', role: 'Pengasuh Pondok', quote: 'Kebersihan sebagian dari iman. Kami sudah lama ingin memperbaiki sistem pengelolaan sampah, semoga Allah kirimkan donatur yang peduli.' },
    ],
    campaignUpdate: {
      status: 'berjalan',
      progress: 12,
      note: 'Survey lokasi TPS sudah dilakukan. Harga motor roda 3 naik 15% karena kenaikan suku cadang impor.',
      date: 'Juli 2026',
    },
    accent: 'lime',
  },

  // ═══════════════════════════════════════════════════════════
  // 8. SEDEKAH ANAK YATIM PIATU — ⭐⭐⭐⭐
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'sedekah-anak-yatim',
    title: 'Sedekah Anak Yatim Piatu',
    subtitle: 'Santunan 58 Anak Yatim — Tunai + Sembako',
    description: 'Santunan rutin untuk 58 anak yatim piatu (10 di yayasan, 48 di sekitar). Per anak Rp 300.000 berupa tunai dan sembako. Harga sembako naik imbas Dolar.',
    ogTitle: 'Sedekah Anak Yatim YPSMA — Santunan 58 Anak Yatim',
    ogDescription: 'Santunan rutin untuk 58 anak yatim piatu. Rp 300.000/anak berupa tunai dan sembako.',
    heroImage: '/images/IMG_7558.webp',
    badge: 'Program Anak Yatim — Rutin Bulanan',
    stats: [
      { value: '58', label: 'Anak Yatim' },
      { value: 'Rp 300rb', label: 'Per Anak/Bulan' },
      { value: 'Rp 20,5jt', label: 'Target Bulanan' },
    ],
    stories: [
      {
        icon: '👶',
        title: '58 Anak yang Kehilangan Kasih Sayang',
        body: '10 anak yatim/piatu tinggal di lingkungan yayasan, 48 lainnya tersebar di desa-desa sekitar Mojowarno. Mereka diasuh oleh keluarga yang juga pas-pasan secara ekonomi.',
      },
      {
        icon: '📦',
        title: 'Santunan Tunai + Sembako',
        body: 'Setiap anak mendapat Rp 300.000/bulan berupa uang tunai untuk keperluan sekolah dan paket sembako (beras, minyak, gula, susu, mie). Khusus anak di yayasan, juga mendapat bimbingan belajar.',
      },
      {
        icon: '🤲',
        title: 'Keutamaan Menyantuni Anak Yatim',
        body: 'Rasulullah ﷺ bersabda: "Aku dan orang yang menanggung anak yatim di surga seperti ini" — sambil merapatkan jari telunjuk dan jari tengah. Setiap rupiah Anda adalah investasi surga.',
      },
    ],
    budgetLabel: 'Rincian Santunan Anak Yatim per Bulan',
    budgetItems: [
      { label: '10 anak (yayasan) × Rp 300.000 (tunai + sembako)', amount: 'Rp 3.000.000' },
      { label: '48 anak (luar) × Rp 300.000 (tunai + sembako)', amount: 'Rp 14.400.000' },
      { label: 'Biaya operasional (15%)', amount: 'Rp 3.070.588' },
    ],
    budgetTotal: 'Rp 20.470.588',
    galleryImages: [
      '/images/IMG_7558.webp',
      '/images/IMG_7593.webp',
      '/images/campaigns/IMG_1887.webp',
      '/images/campaigns/IMG_1799.webp',
    ],
    tiers: [
      { amount: 50000, label: '50rb', impact: '1/6 santunan 1 anak yatim' },
      { amount: 100000, label: '100rb', impact: '1/3 santunan 1 anak yatim' },
      { amount: 300000, label: '300rb', impact: '💎 Santunan 1 anak penuh', featured: true },
      { amount: 500000, label: '500rb', impact: 'Santunan 1 anak + keluarganya' },
    ],
    faqs: [
      { question: 'Anak yatimnya berasal dari mana?', answer: '10 anak berada di lingkungan yayasan PPTQ Darussalam (santri yang yatim/piatu). 48 anak lainnya dari desa-desa sekitar Mojowarno yang sudah terdata oleh yayasan.' },
      { question: 'Apakah santunan rutin setiap bulan?', answer: 'Ya, idealnya rutin setiap bulan. Jika donasi lebih, kami salurkan 2 minggu sekali dengan nominal lebih besar per anak.' },
      { question: 'Bisa jadi donatur tetap anak yatim?', answer: 'Bisa! Anda bisa berkomitmen menyantuni 1 anak yatim secara rutin Rp 300.000/bulan. Kami kirimkan foto dan kabar perkembangan mereka.' },
    ],
    hook: '58 Anak Menanti Uluran Tanganmu — Sebulan Tanpa Santunan Berarti Setahun Tanpa Senyuman',
    masalah: [
      { icon: '😢', title: 'Hilangnya Cahaya di Wajah Mereka', body: 'Sejak orang tua mereka tiada, 58 anak ini kehilangan sumber kasih sayang dan nafkah. Ada yang tinggal dengan nenek yang sudah renta, ada pula yang diurus paman yang juga hidup pas-pasan. Sebulan tanpa santunan berarti mereka harus memilih — membeli buku atau makan hari ini.' },
      { icon: '📈', title: 'Harga Kebutuhan Pokok Melambung', body: 'Harga beras, minyak goreng, susu, dan gula terus naik. Keluarga yang mengasuh anak yatim ini semakin kewalahan. Beberapa anak bahkan terpaksa putus sekolah.' },
      { icon: '🤲', title: 'Keutamaan yang Tidak Pernah Putus', body: 'Rasulullah ﷺ bersabda: "Aku dan orang yang menanggung anak yatim di surga seperti ini" — beliau merapatkan jari telunjuk dan jari tengah. Setiap rupiah yang Anda berikan, pahalanya mengalir terus.' },
    ],
    tokoh: {
      name: 'Aisyah',
      age: '9 tahun',
      asal: 'Desa Mojowarno',
      story: 'Ayah Aisyah meninggal setahun lalu karena sakit. Ibunya bekerja serabutan sebagai buruh cuci. Aisyah, duduk di kelas 3 SD, hampir putus sekolah karena tidak punya seragam dan buku. Santunan yayasan menjadi satu-satunya harapan ia tetap bisa sekolah.',
      photo: '/images/campaigns/IMG_1887.webp',
      quote: 'Kakak, terima kasih sudah peduli sama aku. Aku mau sekolah biar bisa bantu ibu.',
    },
    testimoni: [
      { name: 'Ustadzah Farida', role: 'Pembina Anak Yatim YPSMA', quote: 'Anak-anak yatim di sini sangat bersyukur setiap kali menerima santunan. Bukan soal uangnya, tapi karena mereka tahu masih ada yang peduli.' },
      { name: 'Bapak Sutikno', role: 'Kakek dari 2 anak yatim asuh', quote: 'Saya sudah tua, tidak bisa bekerja keras. Santunan ini sangat berarti untuk cucu-cucu saya. Semoga donatur dibalas berlipat ganda oleh Allah.' },
    ],
    campaignUpdate: {
      status: 'berjalan',
      progress: 35,
      note: 'Bulan lalu 58 anak menerima santunan Rp 300.000 masing-masing (tunai + sembako). Bulan ini baru terkumpul 35% dari target.',
      date: 'Juli 2026',
    },
    accent: 'rose',
  },
];

// Slug → Campaign lookup
export const CAMPAIGN_BY_SLUG = Object.fromEntries(CAMPAIGNS.map(c => [c.slug, c])) as Record<string, Campaign>;

// Slug list for routing
export const CAMPAIGN_SLUGS = CAMPAIGNS.map(c => c.slug);
