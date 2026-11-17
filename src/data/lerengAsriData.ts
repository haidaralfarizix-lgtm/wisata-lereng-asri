export type DestinationCategory = 'semua' | 'alam' | 'camping' | 'kuliner';
export type PackageAudience = 'semua' | 'keluarga' | 'rombongan';

export interface DestinationItem {
  id: string;
  name: string;
  category: Exclude<DestinationCategory, 'semua'>;
  categoryLabel: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  ticketPrice: string;
  openHours: string;
  walkTime: string;
  bestTime: string;
  facilities: string[];
  tips: string;
}

export interface TourPackage {
  id: string;
  name: string;
  audience: Exclude<PackageAudience, 'semua'>;
  audienceLabel: string;
  pricePerPerson: number;
  unitLabel: string;
  minParticipants: number;
  duration: string;
  highlightNote?: string;
  summary: string;
  inclusions: string[];
  image: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  location: string;
  caption: string;
  image: string;
}

export interface MapLandmark {
  id: string;
  number: string;
  name: string;
  zone: string;
  walkFromGate: string;
  elevation: string;
  description: string;
  facilities: string;
  x: number;
  y: number;
}

export interface AccessRoute {
  origin: string;
  duration: string;
  distance: string;
  routeSummary: string;
}

export interface VisitorReview {
  id: string;
  name: string;
  groupInfo: string;
  packageTaken: string;
  quote: string;
}

export const VILLAGE_CONTACT = {
  brandName: 'Desa Wisata Lereng Asri',
  shortName: 'Lereng Asri',
  whatsappNumber: '6281234567890',
  displayPhone: '+62 812-3456-7890',
  coordinatorName: 'Pokdarwis Lereng Asri',
  address: 'Dusun Krajan Timur, Desa Lereng Asri, Kec. Ngargoyoso, Jawa Tengah 57793',
  coordinates: '-7.6248, 111.1324',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-7.6248,111.1324',
  openHours: 'Setiap Hari · 06.00 – 18.00 WIB (Area Camping 24 Jam)',
};

export const HERO_IMAGE = '/src/assets/images/hero_lereng_asri_1794887184110.jpg';

export const DESTINATIONS: DestinationItem[] = [
  {
    id: 'bukit-pinus',
    name: 'Bukit Pinus & Sunrise Camp',
    category: 'camping',
    categoryLabel: 'Camping & Outbound',
    shortDesc:
      'Lahan berkemah lapang di bawah rindangnya hutan pinus dengan jalur kayu yang aman dan pemandangan matahari terbit.',
    fullDesc:
      'Area perkemahan keluarga dan rombongan yang tertata rapi di ketinggian 1.180 mdpl. Dilengkapi lantai kayu datar untuk tenda, penerangan jalur hangat, serta gardu pandang menghadap lembah berkabut saat pagi hari.',
    image: '/src/assets/images/dest_bukit_pinus_1794887184124.jpg',
    ticketPrice: 'Rp 20.000 / orang',
    openHours: '05.00 – 21.00 WIB (Camping 24 Jam)',
    walkTime: '15 menit dari Gerbang Utama',
    bestTime: '05.30 – 08.00 WIB atau sore menjelang senja',
    facilities: [
      'Sewa tenda & matras lengkap',
      'Kamar mandi air bersih 24 jam',
      'Area api unggun resmi',
      'Colokan listrik terpusat & mushola',
    ],
    tips: 'Bawa jaket hangat karena suhu malam berkisar 16–19 °C. Disarankan memesan tenda terlebih dahulu saat akhir pekan.',
  },
  {
    id: 'kebun-teh',
    name: 'Kebun Teh Terasering Lereng',
    category: 'alam',
    categoryLabel: 'Alam & Trekking',
    shortDesc:
      'Hamparan perkebunan teh hijau bertingkat dengan jalur batu yang nyaman untuk jalan santai keluarga dan wisata edukasi.',
    fullDesc:
      'Lintasi jalur setapak batu alam yang membelah terasering kebun teh warga. Pengunjung dapat menyapa pemetik teh lokal, menghirup udara sejuk pegunungan, dan berfoto di titik pandang lembah.',
    image: '/src/assets/images/dest_kebun_teh_1794887184550.jpg',
    ticketPrice: 'Rp 15.000 / orang',
    openHours: '06.00 – 17.00 WIB',
    walkTime: '5 menit dari Gerbang Utama',
    bestTime: '06.30 – 09.30 WIB saat kabut pagi perlahan turun',
    facilities: [
      'Jalur pejalan kaki berbatu & pagar bambu',
      'Saung istirahat di 3 titik pandang',
      'Pemandu edukasi petik teh (dengan reservasi)',
      'Warung teh hangat di ujung jalur',
    ],
    tips: 'Gunakan alas kaki yang nyaman dan tidak licin. Pagi hari sebelum pukul 09.00 memberikan pencahayaan terbaik dan udara paling segar.',
  },
  {
    id: 'curug-bening',
    name: 'Air Terjun Curug Bening',
    category: 'alam',
    categoryLabel: 'Alam & Trekking',
    shortDesc:
      'Air terjun alami berair jernih dengan kolam dangkal yang dikelilingi pakis hutan dan rimbunnya rumpun bambu.',
    fullDesc:
      'Mata air pegunungan yang mengalir sepanjang tahun melalui tebing batu berlumut menuju kolam alami berwarna hijau zamrud. Jalur trekking sudah dilengkapi pegangan bambu sehingga ramah untuk pemula dan anak usia sekolah.',
    image: '/src/assets/images/dest_curug_bening_1794887185596.jpg',
    ticketPrice: 'Rp 15.000 / orang',
    openHours: '07.00 – 16.30 WIB',
    walkTime: '25 menit trekking ringan',
    bestTime: '08.00 – 13.00 WIB saat sinar matahari menembus kanopi',
    facilities: [
      'Ruang ganti & bilas tertutup',
      'Gazebo bambu tepi sungai',
      'Penjaga pos keselamatan desa',
      'Penitipan barang di pos masuk curug',
    ],
    tips: 'Siapkan pakaian ganti dan handuk kecil jika berencana bermain air. Selalu ikuti arahan petugas pos saat musim hujan.',
  },
  {
    id: 'kampung-kopi',
    name: 'Pendopo Kopi & Kuliner Desa',
    category: 'kuliner',
    categoryLabel: 'Kuliner & Budaya',
    shortDesc:
      'Rumah kayu dan bambu terbuka dengan sajian nasi liwet daun pisang, gorengan hangat, dan seduhan kopi Arabika lereng.',
    fullDesc:
      'Dikelola langsung oleh ibu-ibu kelompok sadar wisata setempat, pendopo ini menjadi tempat berkumpul yang hangat untuk bersantap sambil menatap hamparan sawah dan bukit hijau. Tersedia paket makan prasmanan untuk rombongan.',
    image: '/src/assets/images/dest_kampung_kopi_1794887185425.jpg',
    ticketPrice: 'Gratis Masuk · Menu mulai Rp 15.000',
    openHours: '07.00 – 20.00 WIB',
    walkTime: '3 menit dari Area Parkir',
    bestTime: 'Jam makan siang atau sore hari sambil minum kopi',
    facilities: [
      'Meja lesehan & kursi kayu kapasitas 80 orang',
      'Dapur bersih & bahan pangan segar desa',
      'Mushola & toilet bersih dekat pendopo',
      'Gerai oleh-oleh kopi, teh, dan keripik lokal',
    ],
    tips: 'Untuk rombongan di atas 15 orang, silakan pesan menu nasi liwet minimal H-1 via WhatsApp agar hidangan siap hangat saat Anda tiba.',
  },
];

export const TOUR_PACKAGES: TourPackage[] = [
  {
    id: 'paket-jelajah-pagi',
    name: 'Paket Jelajah Alam Sehari',
    audience: 'keluarga',
    audienceLabel: 'Keluarga & Umum',
    pricePerPerson: 95000,
    unitLabel: 'orang',
    minParticipants: 4,
    duration: '07.00 – 15.00 WIB',
    summary:
      'Pilihan pas untuk keluarga atau sahabat yang ingin menikmati kebun teh, trekking ke Curug Bening, dan makan siang hangat tanpa repot.',
    inclusions: [
      'Tiket masuk Kebun Teh & Air Terjun Curug Bening',
      'Pemandu wisata lokal ramah selama perjalanan',
      '1x makan siang Nasi Liwet Daun Pisang di Pendopo',
      '1x seduhan kopi Arabika atau teh hangat',
      'Air mineral & dokumentasi foto dasar',
    ],
    image: '/src/assets/images/dest_kebun_teh_1794887184550.jpg',
  },
  {
    id: 'paket-kemah-keluarga',
    name: 'Paket Kemah Keluarga Asri',
    audience: 'keluarga',
    audienceLabel: 'Keluarga & Umum',
    pricePerPerson: 185000,
    unitLabel: 'orang',
    minParticipants: 4,
    duration: '2 Hari 1 Malam',
    highlightNote: 'Paling Diminati',
    summary:
      'Menginap nyaman di Bukit Pinus tanpa perlu membawa perlengkapan kemah sendiri. Semua tenda, makan malam, dan sarapan sudah disiapkan.',
    inclusions: [
      'Tenda dome bersih (kapasitas 4 orang) + matras & sleeping bag',
      'Tiket masuk Bukit Pinus & Kebun Teh Terasering',
      '1x makan malam liwet hangat + 1x sarapan pagi',
      'Kayu bakar api unggun & jagung bakar malam',
      'Akses kamar mandi air bersih 24 jam & penjagaan malam',
    ],
    image: '/src/assets/images/dest_bukit_pinus_1794887184124.jpg',
  },
  {
    id: 'paket-outbound-rombongan',
    name: 'Paket Outbound Sekolah & Kantor',
    audience: 'rombongan',
    audienceLabel: 'Rombongan & Sekolah',
    pricePerPerson: 160000,
    unitLabel: 'orang',
    minParticipants: 20,
    duration: '08.00 – 16.00 WIB',
    summary:
      'Kegiatan kebersamaan dan permainan tim di lapangan hijau berlatar gunung, dipandu fasilitator berpengalaman dengan konsumsi prasmanan lengkap.',
    inclusions: [
      'Permainan team building & ice breaking (5–6 sesi)',
      'Fasilitator lapangan & peralatan game lengkap',
      'Makan siang prasmanan desa + 2x kudapan tradisional',
      'Sewa Pendopo Utama & pengeras suara',
      'Tim P3K siaga & parkir khusus bus pariwisata',
    ],
    image: '/src/assets/images/aktivitas_wisata_alam_1794887187216.jpg',
  },
  {
    id: 'paket-edukasi-kopi-teh',
    name: 'Paket Edukasi Petik Teh & Kopi',
    audience: 'keluarga',
    audienceLabel: 'Keluarga & Umum',
    pricePerPerson: 120000,
    unitLabel: 'orang',
    minParticipants: 2,
    duration: '3,5 Jam',
    summary:
      'Pengalaman interaktif belajar memetik pucuk teh bersama petani desa dilanjutkan sesi mencicipi dan menyeduh kopi lereng.',
    inclusions: [
      'Tur terasering bersama petani teh setempat',
      'Sesi seduh manual kopi Arabika Lereng Asri',
      'Kudapan singkong keju & wedang jahe hangat',
      '1 kemasan oleh-oleh teh hijau atau kopi bubuk (100 g)',
    ],
    image: '/src/assets/images/dest_kampung_kopi_1794887185425.jpg',
  },
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'galeri-1',
    title: 'Mentari Pagi dari Balkon Lereng',
    location: 'Gardu Pandang Utama',
    caption: 'Kabut tipis menyelimuti lembah kebun teh saat matahari terbit sekitar pukul 05.45 WIB.',
    image: '/src/assets/images/hero_lereng_asri_1794887184110.jpg',
  },
  {
    id: 'galeri-2',
    title: 'Suasana Senja di Bukit Pinus',
    location: 'Bukit Pinus & Sunrise Camp',
    caption: 'Deretan tenda kanvas di atas lantai kayu yang aman dan kering untuk bermalam bersama keluarga.',
    image: '/src/assets/images/dest_bukit_pinus_1794887184124.jpg',
  },
  {
    id: 'galeri-3',
    title: 'Jalur Batu di Tengah Kebun Teh',
    location: 'Kebun Teh Terasering',
    caption: 'Trek pejalan kaki yang tertata rapi memudahkan lansia maupun anak-anak menikmati pemandangan kebun.',
    image: '/src/assets/images/dest_kebun_teh_1794887184550.jpg',
  },
  {
    id: 'galeri-4',
    title: 'Kesegaran Alami Curug Bening',
    location: 'Air Terjun Curug Bening',
    caption: 'Kolam alami berair jernih dan sejuk yang dapat dicapai dalam 25 menit jalan santai dari pos.',
    image: '/src/assets/images/dest_curug_bening_1794887185596.jpg',
  },
  {
    id: 'galeri-5',
    title: 'Sajian Hangat Ibu-Ibu Desa',
    location: 'Pendopo Kopi & Kuliner',
    caption: 'Nasi liwet lengkap dan kopi tubruk panas disajikan langsung dengan keramahan warga desa.',
    image: '/src/assets/images/dest_kampung_kopi_1794887185425.jpg',
  },
  {
    id: 'galeri-6',
    title: 'Trekking Bersama Pemandu Lokal',
    location: 'Jalur Punggung Bukit',
    caption: 'Pemandu desa siap menemani rombongan menyusuri rute alam yang aman sembari berbagi cerita lokal.',
    image: '/src/assets/images/aktivitas_wisata_alam_1794887187216.jpg',
  },
];

export const MAP_LANDMARKS: MapLandmark[] = [
  {
    id: 'pos-gerbang',
    number: '01',
    name: 'Gerbang Utama & Area Parkir',
    zone: 'Pusat Kedatangan',
    walkFromGate: 'Titik Awal (0 menit)',
    elevation: '1.040 mdpl',
    description:
      'Loket resmi Pokdarwis Lereng Asri, area parkir luas untuk 40 mobil dan 6 bus pariwisata, serta pusat informasi wisatawan.',
    facilities: 'Parkir luas · Loket tiket · Toilet · Mushola utama',
    x: 18,
    y: 78,
  },
  {
    id: 'pendopo',
    number: '02',
    name: 'Pendopo Kopi & Kuliner Desa',
    zone: 'Zona Ramah Keluarga',
    walkFromGate: '3 menit jalan santai',
    elevation: '1.055 mdpl',
    description:
      'Tempat istirahat, makan siang prasmanan nasi liwet, serta sentra oleh-oleh kopi dan teh hasil panen warga.',
    facilities: 'Kapasitas 80 kursi · Dapur desa · Gerai oleh-oleh',
    x: 34,
    y: 62,
  },
  {
    id: 'kebun-teh',
    number: '03',
    name: 'Kebun Teh Terasering',
    zone: 'Zona Alam Terbuka',
    walkFromGate: '5 menit jalan santai',
    elevation: '1.110 mdpl',
    description:
      'Jalur batu alam melingkar melewati hamparan teh hijau dengan tiga saung peristirahatan di sepanjang lereng.',
    facilities: 'Jalur batu aman · 3 saung pandang · Spot foto pagi',
    x: 52,
    y: 44,
  },
  {
    id: 'bukit-pinus',
    number: '04',
    name: 'Bukit Pinus & Sunrise Camp',
    zone: 'Zona Perkemahan',
    walkFromGate: '15 menit jalan kaki',
    elevation: '1.180 mdpl',
    description:
      'Kawasan hutan pinus teduh dengan dek tenda keluarga, area outbound rombongan, dan gardu pandang matahari terbit.',
    facilities: 'Area tenda · MCK 24 jam · Lapangan outbound',
    x: 78,
    y: 26,
  },
  {
    id: 'curug-bening',
    number: '05',
    name: 'Air Terjun Curug Bening',
    zone: 'Zona Trekking Lembah',
    walkFromGate: '25 menit trekking ringan',
    elevation: '1.075 mdpl',
    description:
      'Air terjun jernih di lembah selatan desa dengan jalur tangga tanah berpegangan bambu dan gazebo tepi sungai.',
    facilities: 'Gazebo · Ruang bilas · Pos jaga keselamatan',
    x: 74,
    y: 74,
  },
];

export const ACCESS_ROUTES: AccessRoute[] = [
  {
    origin: 'Dari Yogyakarta',
    duration: '± 1 jam 45 menit',
    distance: '62 km',
    routeSummary: 'Via Jl. Raya Solo – Karanganyar – Simpang Pasar Ngargoyoso (jalan beraspal mulus dua arah).',
  },
  {
    origin: 'Dari Solo / Surakarta',
    duration: '± 1 jam 10 menit',
    distance: '41 km',
    routeSummary: 'Via Karanganyar Kota – Terminal Tawangmangu arah barat menuju Desa Lereng Asri.',
  },
  {
    origin: 'Dari Semarang (Via Tol)',
    duration: '± 1 jam 50 menit',
    distance: '108 km',
    routeSummary: 'Keluar Gerbang Tol Karanganyar / Colomadu, lanjut jalur provinsi ke arah lereng timur.',
  },
];

export const VISITOR_REVIEWS: VisitorReview[] = [
  {
    id: 'rev-1',
    name: 'Keluarga Bapak Hendra Wijaya',
    groupInfo: '6 orang · Dari Semarang',
    packageTaken: 'Paket Kemah Keluarga Asri',
    quote:
      'Tenda sudah berdiri rapi saat kami datang sore hari. Kamar mandinya bersih dan anak-anak senang sekali membakar jagung lalu melihat kabut pagi di kebun teh.',
  },
  {
    id: 'rev-2',
    name: 'Ibu Ratna Kusuma, S.Pd.',
    groupInfo: '45 siswa & guru · SMP Negeri 4 Surakarta',
    packageTaken: 'Paket Outbound Sekolah & Kantor',
    quote:
      'Komunikasi dengan pengelola via WhatsApp sangat cepat dan jelas sejak awal. Bus besar bisa parkir langsung di gerbang, makan siang liwetnya hangat dan pas untuk rombongan.',
  },
];

export interface FaqItem {
  id: string;
  topic: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-lokasi',
    topic: 'Akses & Transportasi',
    question: 'Bagaimana cara menuju lokasi Desa Wisata Lereng Asri?',
    answer:
      'Lokasi dapat dijangkau kendaraan pribadi (motor atau mobil keluarga) maupun bus pariwisata melalui jalur beraspal mulus arah Karanganyar – Ngargoyoso. Dari Yogyakarta memakan waktu sekitar 1 jam 45 menit, sedangkan dari Solo sekitar 1 jam 10 menit. Setibanya di gerbang utama tersedia area parkir luas untuk 40 mobil dan 6 bus.',
  },
  {
    id: 'faq-pemula',
    topic: 'Tingkat Kesulitan',
    question: 'Apakah jalur wisata dan trekking ramah untuk pemula, anak-anak, dan lansia?',
    answer:
      'Ya, sangat ramah pemula. Area Pendopo Kuliner dan jalur batu Kebun Teh Terasering berada 3–5 menit jalan santai dari area parkir dengan tanjakan landai. Untuk Air Terjun Curug Bening tersedia tangga tanah berpegangan bambu selama ±25 menit trekking ringan, serta pemandu desa yang siap mendampingi rombongan.',
  },
  {
    id: 'faq-perlengkapan',
    topic: 'Persiapan Barang',
    question: 'Barang apa saja yang sebaiknya dibawa saat berkunjung atau berkemah?',
    answer:
      'Gunakan sepatu atau sandal gunung yang tidak licin. Bawalah jaket hangat (suhu sore dan malam berkisar 16–19 °C), pakaian ganti bila berencana bermain air di Curug Bening, serta obat-obatan pribadi. Khusus peserta Paket Kemah Keluarga, tenda dome, matras, dan sleeping bag sudah kami siapkan.',
  },
  {
    id: 'faq-pemesanan',
    topic: 'Reservasi & Pembayaran',
    question: 'Bagaimana cara memesan paket wisata dan apakah ada pembayaran di website?',
    answer:
      'Website ini tidak menggunakan pembayaran otomatis. Anda cukup menekan tombol Pesan via WhatsApp, mengisi perkiraan tanggal serta jumlah peserta, lalu mengirim pesan ke admin Pokdarwis. Ketersediaan kuota dan rincian pembayaran dikonfirmasi langsung secara manual melalui chat WhatsApp resmi.',
  },
  {
    id: 'faq-fasilitas',
    topic: 'Fasilitas Umum',
    question: 'Apakah tersedia toilet bersih, mushola, dan makanan halal untuk rombongan?',
    answer:
      'Seluruh zona utama dilengkapi toilet dan kamar bilas berair pegunungan yang bersih (tersedia 24 jam di area Bukit Pinus), mushola di gerbang utama maupun area camp, serta sajian makanan halal tradisional yang dimasak segar oleh ibu-ibu kelompok sadar wisata di Pendopo Kuliner.',
  },
  {
    id: 'faq-cuaca',
    topic: 'Cuaca & Kenyamanan',
    question: 'Bagaimana jika turun hujan saat hari kunjungan?',
    answer:
      'Terdapat tiga saung teduh di sepanjang jalur kebun teh dan Pendopo Utama berkapasitas 80 orang untuk berteduh sambil menikmati kopi atau teh hangat. Jika kondisi cuaca kurang mendukung sebelum kedatangan, jadwal kunjungan dapat dikonsultasikan ulang secara fleksibel bersama admin via WhatsApp.',
  },
];

export function formatRupiah(amount: number): string {
  return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${VILLAGE_CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
