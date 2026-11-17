import {useEffect, useMemo, useState} from 'react';
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Clock,
  Expand,
  MapPin,
  Menu,
  Phone,
  Users,
  X,
} from 'lucide-react';
import {
  DESTINATIONS,
  DestinationCategory,
  DestinationItem,
  GALLERY_PHOTOS,
  HERO_IMAGE,
  PackageAudience,
  TOUR_PACKAGES,
  VILLAGE_CONTACT,
  VISITOR_REVIEWS,
  formatRupiah,
} from './data/lerengAsriData';
import {DestinationDetailModal} from './components/DestinationDetailModal';
import {FaqSection} from './components/FaqSection';
import {GalleryLightbox} from './components/GalleryLightbox';
import {HeroWeatherWidget} from './components/HeroWeatherWidget';
import {ResilientImage} from './components/ResilientImage';
import {TravelTipsSection} from './components/TravelTipsSection';
import {VillageMapSection} from './components/VillageMapSection';
import {WhatsAppBookingModal} from './components/WhatsAppBookingModal';
import {WhatsAppIcon} from './components/WhatsAppIcon';

const DESTINATION_FILTERS: {id: DestinationCategory; label: string}[] = [
  {id: 'semua', label: 'Semua'},
  {id: 'alam', label: 'Alam & Trekking'},
  {id: 'camping', label: 'Camping & Outbound'},
  {id: 'kuliner', label: 'Kuliner & Budaya'},
];

const PACKAGE_FILTERS: {id: PackageAudience; label: string}[] = [
  {id: 'semua', label: 'Semua Paket'},
  {id: 'keluarga', label: 'Keluarga & Umum'},
  {id: 'rombongan', label: 'Rombongan & Sekolah'},
];

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destFilter, setDestFilter] = useState<DestinationCategory>('semua');
  const [packageFilter, setPackageFilter] = useState<PackageAudience>('semua');

  const [selectedDestination, setSelectedDestination] = useState<DestinationItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingPackageId, setBookingPackageId] = useState<string | undefined>(undefined);
  const [bookingSubject, setBookingSubject] = useState<string | undefined>(undefined);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  const filteredDestinations = useMemo(() => {
    if (destFilter === 'semua') return DESTINATIONS;
    return DESTINATIONS.filter((item) => item.category === destFilter);
  }, [destFilter]);

  const filteredPackages = useMemo(() => {
    if (packageFilter === 'semua') return TOUR_PACKAGES;
    return TOUR_PACKAGES.filter((pkg) => pkg.audience === packageFilter);
  }, [packageFilter]);

  const openPackageBooking = (packageId?: string) => {
    setBookingSubject(undefined);
    setBookingPackageId(packageId);
    setBookingModalOpen(true);
  };

  const openGeneralWhatsApp = (subject?: string) => {
    setBookingPackageId(undefined);
    setBookingSubject(subject);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#19221C] flex flex-col">
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      {/* Top Navigation Bar (Strict 3-Zone Contract) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E4EDE6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#beranda"
            className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#1E4D38] whitespace-nowrap shrink-0"
          >
            Lereng Asri
          </a>

          {/* Zone 2: Single-line Navigation Links (Desktop) */}
          <nav
            aria-label="Navigasi utama"
            className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#435248]"
          >
            <a
              href="#beranda"
              className="hover:text-[#1E4D38] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Beranda
            </a>
            <a
              href="#destinasi"
              className="hover:text-[#1E4D38] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Destinasi
            </a>
            <a
              href="#paket"
              className="hover:text-[#1E4D38] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Paket Wisata
            </a>
            <a
              href="#galeri"
              className="hover:text-[#1E4D38] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Galeri
            </a>
            <a
              href="#lokasi"
              className="hover:text-[#1E4D38] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Lokasi
            </a>
          </nav>

          {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => openPackageBooking(TOUR_PACKAGES[1].id)}
              className="hidden md:inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-xl bg-[#137A48] hover:bg-[#0F633A] text-white font-display text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0" />
              <span>Pesan WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu navigasi'}
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#19221C] hover:bg-[#EEF3EF] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <nav
            id="mobile-nav-drawer"
            aria-label="Navigasi seluler"
            className="md:hidden bg-white border-t border-[#E4EDE6] px-4 py-3 space-y-1 shadow-lg"
          >
            {[
              {href: '#beranda', label: 'Beranda'},
              {href: '#destinasi', label: 'Daftar Destinasi'},
              {href: '#paket', label: 'Paket Wisata & Harga'},
              {href: '#galeri', label: 'Galeri Foto'},
              {href: '#lokasi', label: 'Peta Lokasi & Rute'},
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between min-h-[48px] px-3 rounded-xl font-display text-base font-semibold text-[#19221C] hover:bg-[#EEF3EF] transition-colors"
              >
                <span>{item.label}</span>
                <ArrowRight className="w-4 h-4 text-[#435248]" aria-hidden="true" />
              </a>
            ))}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openPackageBooking(TOUR_PACKAGES[1].id);
                }}
                className="w-full min-h-[50px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#137A48] hover:bg-[#0F633A] text-white font-display text-base font-semibold transition-colors"
              >
                <WhatsAppIcon className="w-5 h-5 shrink-0" />
                <span>Pesan via WhatsApp</span>
              </button>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section (Beranda dengan Foto Utama) */}
        <section id="beranda" className="relative bg-[#0E3823]">
          <div className="relative min-h-[500px] sm:min-h-[540px] lg:min-h-[580px] flex items-end sm:items-center overflow-hidden">
            <ResilientImage
              src={HERO_IMAGE}
              alt="Pemandangan matahari terbit di atas hamparan kebun teh terasering dan hutan pinus Desa Wisata Lereng Asri"
              loading="eager"
              fallbackTitle="Desa Wisata Lereng Asri"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/25 sm:bg-gradient-to-r sm:from-black/80 sm:via-black/55 sm:to-black/20"
              aria-hidden="true"
            />

            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
              <div className="max-w-2xl text-white">
                <p className="text-sm sm:text-base font-semibold text-[#A5ECC0]">
                  Desa Wisata Lereng Asri · Ngargoyoso, 1.150 mdpl
                </p>
                <h1 className="font-display text-[32px] sm:text-5xl font-bold leading-[1.18] tracking-tight mt-2 text-balance">
                  Mari Singgah di Sejuknya Alam Lereng Asri
                </h1>
                <p className="text-base sm:text-lg text-white/90 mt-3 sm:mt-4 leading-relaxed max-w-xl">
                  Nikmati jalan pagi di kebun teh terasering, bermalam tenang di Bukit Pinus, hingga sajian nasi liwet hangat bersama keramahan warga desa.
                </p>

                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={() => openPackageBooking(TOUR_PACKAGES[0].id)}
                    className="min-h-[52px] inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#137A48] hover:bg-[#0F633A] text-white font-display text-base font-semibold shadow-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    <WhatsAppIcon className="w-5 h-5 shrink-0" />
                    <span>Pesan via WhatsApp</span>
                  </button>
                  <a
                    href="#paket"
                    className="min-h-[52px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/95 hover:bg-white text-[#19221C] font-display text-base font-semibold transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Lihat Paket &amp; Harga</span>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </a>
                </div>

                <HeroWeatherWidget />
              </div>
            </div>
          </div>

          {/* Full-width Operational Strip directly under Hero */}
          <div className="bg-white border-b border-[#E4EDE6]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div>
                <p className="text-xs text-[#435248] font-medium">Jam Buka Kawasan</p>
                <p className="font-display text-sm sm:text-base font-bold text-[#19221C] mt-0.5 tabular-nums">
                  06.00 – 18.00 WIB
                </p>
              </div>
              <div>
                <p className="text-xs text-[#435248] font-medium">Tiket Masuk Mulai</p>
                <p className="font-display text-sm sm:text-base font-bold text-[#1E4D38] mt-0.5 tabular-nums">
                  Rp 15.000 / orang
                </p>
              </div>
              <div>
                <p className="text-xs text-[#435248] font-medium">Kapasitas Parkir</p>
                <p className="font-display text-sm sm:text-base font-bold text-[#19221C] mt-0.5 tabular-nums">
                  40 Mobil &amp; 6 Bus
                </p>
              </div>
              <div>
                <p className="text-xs text-[#435248] font-medium">Konfirmasi Jadwal</p>
                <p className="font-display text-sm sm:text-base font-bold text-[#19221C] mt-0.5">
                  Langsung via WhatsApp
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Daftar Destinasi Section */}
        <section id="destinasi" className="py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold text-[#2E7D52]">
                  Daftar Destinasi Wisata
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#19221C] mt-1 text-balance">
                  Empat Sudut Alam &amp; Budaya di Satu Desa
                </h2>
                <p className="text-base text-[#435248] mt-2 leading-relaxed">
                  Semua lokasi saling terhubung jalur jalan kaki yang aman dan sejuk. Ketuk destinasi untuk melihat fasilitas lengkap dan jam terbaik berkunjung.
                </p>
              </div>

              {/* Interactive Category Filter Buttons */}
              <div
                role="group"
                aria-label="Filter kategori destinasi"
                className="flex flex-wrap gap-2"
              >
                {DESTINATION_FILTERS.map((filter) => {
                  const active = destFilter === filter.id;
                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setDestFilter(filter.id)}
                      aria-pressed={active}
                      className={`min-h-[44px] px-4 py-2 rounded-xl font-display text-sm font-semibold transition-colors whitespace-nowrap shrink-0 border ${
                        active
                          ? 'bg-[#1E4D38] text-white border-[#1E4D38]'
                          : 'bg-white text-[#19221C] border-[#D1DDD5] hover:bg-[#EEF3EF]'
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDestinations.map((dest) => (
                <article
                  key={dest.id}
                  className="bg-white rounded-2xl border border-[#D1DDD5] overflow-hidden flex flex-col justify-between transition-shadow hover:shadow-md"
                >
                  <div>
                    <div className="aspect-4/3 w-full overflow-hidden bg-[#EEF3EF]">
                      <ResilientImage
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-5 sm:p-6">
                      <p className="text-xs font-semibold text-[#2E7D52]">
                        <span>{dest.categoryLabel}</span>
                        <span aria-hidden="true" className="mx-1.5">·</span>
                        <span className="tabular-nums">{dest.walkTime}</span>
                      </p>
                      <h3 className="font-display text-xl font-bold text-[#19221C] mt-1">
                        {dest.name}
                      </h3>
                      <p className="text-base text-[#435248] mt-2 leading-relaxed">
                        {dest.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-[#E4EDE6] flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm">
                      <span className="text-[#435248]">Tiket: </span>
                      <span className="font-display font-bold text-[#1E4D38] tabular-nums">
                        {dest.ticketPrice}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedDestination(dest)}
                      className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EEF3EF] hover:bg-[#E8F5E9] text-[#0E3823] font-display text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>Lihat Detail</span>
                      <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Paket Wisata & Harga Section */}
        <section id="paket" className="py-12 sm:py-16 bg-white border-y border-[#E4EDE6]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold text-[#2E7D52]">
                  Paket Wisata &amp; Daftar Harga
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#19221C] mt-1 text-balance">
                  Harga Jelas, Tanpa Biaya Tersembunyi
                </h2>
                <p className="text-base text-[#435248] mt-2 leading-relaxed">
                  Pilih paket yang sesuai untuk liburan keluarga maupun rombongan sekolah dan kantor. Pemesanan dan pengecekan kuota dikonfirmasi langsung lewat WhatsApp pengelola.
                </p>
              </div>

              <div
                role="group"
                aria-label="Filter tipe peserta paket"
                className="flex flex-wrap gap-2"
              >
                {PACKAGE_FILTERS.map((filter) => {
                  const active = packageFilter === filter.id;
                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setPackageFilter(filter.id)}
                      aria-pressed={active}
                      className={`min-h-[44px] px-4 py-2 rounded-xl font-display text-sm font-semibold transition-colors whitespace-nowrap shrink-0 border ${
                        active
                          ? 'bg-[#1E4D38] text-white border-[#1E4D38]'
                          : 'bg-[#F8FAF8] text-[#19221C] border-[#D1DDD5] hover:bg-[#EEF3EF]'
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPackages.map((pkg) => {
                const isFeatured = Boolean(pkg.highlightNote);
                return (
                  <article
                    key={pkg.id}
                    className={`rounded-2xl border p-5 sm:p-6 flex flex-col justify-between transition-shadow hover:shadow-md ${
                      isFeatured
                        ? 'bg-[#F8FAF8] border-[#1E4D38]'
                        : 'bg-[#F8FAF8] border-[#D1DDD5]'
                    }`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
                        <span className="text-[#2E7D52]">
                          {pkg.audienceLabel}
                          <span aria-hidden="true" className="mx-1.5">·</span>
                          <span className="tabular-nums">{pkg.duration}</span>
                        </span>
                        {pkg.highlightNote && (
                          <span className="text-[#B45309] font-bold">
                            {pkg.highlightNote}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-xl font-bold text-[#19221C] mt-1.5">
                        {pkg.name}
                      </h3>

                      <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="font-display text-2xl sm:text-3xl font-bold text-[#1E4D38] tabular-nums">
                          {formatRupiah(pkg.pricePerPerson)}
                        </span>
                        <span className="text-sm text-[#435248]">/ {pkg.unitLabel}</span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[#435248]">
                        <span className="inline-flex items-center gap-1.5 tabular-nums">
                          <Users className="w-3.5 h-3.5 text-[#1E4D38]" aria-hidden="true" />
                          Minimal {pkg.minParticipants} orang
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#1E4D38]" aria-hidden="true" />
                          {pkg.duration}
                        </span>
                      </div>

                      <p className="text-base text-[#435248] mt-3 leading-relaxed">
                        {pkg.summary}
                      </p>

                      <div className="mt-4 pt-4 border-t border-[#E4EDE6]">
                        <p className="font-display text-sm font-semibold text-[#19221C] mb-2.5">
                          Fasilitas Termasuk:
                        </p>
                        <ul className="space-y-2">
                          {pkg.inclusions.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2.5 text-sm text-[#19221C] leading-snug"
                            >
                              <Check
                                className="w-4 h-4 text-[#2E7D52] mt-0.5 shrink-0"
                                aria-hidden="true"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#E4EDE6]">
                      <button
                        type="button"
                        onClick={() => openPackageBooking(pkg.id)}
                        className="w-full min-h-[50px] inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-[#137A48] hover:bg-[#0F633A] text-white font-display text-base font-semibold transition-colors whitespace-nowrap"
                      >
                        <WhatsAppIcon className="w-5 h-5 shrink-0" />
                        <span>Pesan Paket via WhatsApp</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Custom Group Inquiry Strip */}
            <div className="mt-8 rounded-2xl bg-[#E8F5E9] border border-[#D1DDD5] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-bold text-[#0E3823]">
                  Merencanakan Acara Khusus atau Rombongan Besar?
                </h3>
                <p className="text-sm sm:text-base text-[#19221C] mt-1 leading-relaxed">
                  Kami dapat menyesuaikan susunan kegiatan, menu makan prasmanan, dan jumlah pemandu sesuai anggaran rombongan Anda.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  openGeneralWhatsApp(
                    'Saya ingin konsultasi paket khusus / custom untuk rombongan.'
                  )
                }
                className="min-h-[48px] px-5 py-3 rounded-xl bg-[#1E4D38] hover:bg-[#0E3823] text-white font-display text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
              >
                <CalendarCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Konsultasi Paket Gratis</span>
              </button>
            </div>

            {/* Visitor Testimonials (Claim-to-Proof Adjacency directly under packages) */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
              {VISITOR_REVIEWS.map((review) => (
                <blockquote
                  key={review.id}
                  className="rounded-2xl bg-[#F8FAF8] border border-[#E4EDE6] p-5 sm:p-6"
                >
                  <p className="text-base text-[#19221C] leading-relaxed">
                    “{review.quote}”
                  </p>
                  <footer className="mt-4 pt-3 border-t border-[#E4EDE6]">
                    <p className="font-display text-sm font-bold text-[#19221C]">
                      {review.name}
                    </p>
                    <p className="text-xs text-[#435248] mt-0.5">
                      {review.groupInfo} · {review.packageTaken}
                    </p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* Galeri Foto Section */}
        <section id="galeri" className="py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-8">
              <p className="text-sm font-semibold text-[#2E7D52]">
                Galeri Suasana Desa
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#19221C] mt-1 text-balance">
                Potret Kegiatan &amp; Keindahan Lereng Asri
              </h2>
              <p className="text-base text-[#435248] mt-2 leading-relaxed">
                Ketuk salah satu foto untuk memperbesar tampilan dan membaca keterangan lokasi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {GALLERY_PHOTOS.map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="group text-left bg-white rounded-2xl border border-[#D1DDD5] overflow-hidden focus-visible:ring-2 focus-visible:ring-[#1E4D38] transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-[#EEF3EF]">
                    <ResilientImage
                      src={photo.image}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                    <span
                      className="absolute top-3 right-3 min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-lg bg-black/55 text-white opacity-90 group-hover:opacity-100 transition-opacity"
                      aria-hidden="true"
                    >
                      <Expand className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold text-[#2E7D52]">{photo.location}</p>
                    <h3 className="font-display text-base font-bold text-[#19221C] mt-0.5">
                      {photo.title}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Peta Lokasi & Akses Section */}
        <VillageMapSection onAskDirections={openGeneralWhatsApp} />

        {/* Tanya Jawab (FAQ) Section */}
        <FaqSection onAskQuestion={openGeneralWhatsApp} />

        {/* Tips Perjalanan Section */}
        <TravelTipsSection onAskTransport={openGeneralWhatsApp} />
      </main>

      {/* Footer & Kontak Pengelola */}
      <footer className="bg-[#0E3823] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <p className="font-display text-xl font-bold">{VILLAGE_CONTACT.brandName}</p>
            <p className="text-sm text-white/80 mt-2 leading-relaxed max-w-md">
              Dikelola langsung oleh {VILLAGE_CONTACT.coordinatorName} bersama warga setempat untuk menghadirkan wisata alam yang ramah keluarga, bersih, dan lestari.
            </p>
            <div className="mt-5">
              <button
                type="button"
                onClick={() => openPackageBooking(TOUR_PACKAGES[0].id)}
                className="min-h-[48px] inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#137A48] hover:bg-[#0F633A] text-white font-display text-sm font-semibold transition-colors whitespace-nowrap"
              >
                <WhatsAppIcon className="w-5 h-5 shrink-0" />
                <span>Hubungi Admin via WhatsApp</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="font-display text-sm font-semibold text-[#A5ECC0]">
              Navigasi Halaman
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/85">
              <li>
                <a href="#beranda" className="hover:text-white hover:underline">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#destinasi" className="hover:text-white hover:underline">
                  Daftar Destinasi
                </a>
              </li>
              <li>
                <a href="#paket" className="hover:text-white hover:underline">
                  Paket Wisata &amp; Harga
                </a>
              </li>
              <li>
                <a href="#galeri" className="hover:text-white hover:underline">
                  Galeri Foto
                </a>
              </li>
              <li>
                <a href="#lokasi" className="hover:text-white hover:underline">
                  Peta Lokasi &amp; Rute
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white hover:underline">
                  Tanya Jawab (FAQ)
                </a>
              </li>
              <li>
                <a href="#tips" className="hover:text-white hover:underline">
                  Tips Perjalanan
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3 text-sm text-white/85">
            <p className="font-display text-sm font-semibold text-[#A5ECC0]">
              Informasi Kontak &amp; Operasional
            </p>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#A5ECC0] mt-0.5 shrink-0" aria-hidden="true" />
              <p className="leading-relaxed">{VILLAGE_CONTACT.address}</p>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#A5ECC0] mt-0.5 shrink-0" aria-hidden="true" />
              <p className="tabular-nums">{VILLAGE_CONTACT.openHours}</p>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#A5ECC0] shrink-0" aria-hidden="true" />
              <p className="tabular-nums">{VILLAGE_CONTACT.displayPhone} (WhatsApp Resmi)</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/15">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-xs text-white/75 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© 2026 {VILLAGE_CONTACT.brandName}. Seluruh informasi tarif resmi Pokdarwis.</p>
            <p>Konfirmasi reservasi hanya melalui nomor WhatsApp resmi desa.</p>
          </div>
        </div>
      </footer>

      {/* Compact Floating WhatsApp Action Button (Respects <= 15% mobile sticky cap) */}
      <button
        type="button"
        onClick={() => openPackageBooking(TOUR_PACKAGES[0].id)}
        aria-label="Pesan atau konsultasi via WhatsApp"
        className="fixed bottom-4 right-4 z-40 h-12 px-4 sm:px-5 rounded-full bg-[#137A48] hover:bg-[#0F633A] text-white font-display text-sm font-semibold shadow-xl inline-flex items-center gap-2 transition-transform active:scale-95 border border-white/25 whitespace-nowrap"
      >
        <WhatsAppIcon className="w-5 h-5 shrink-0" />
        <span>Pesan WhatsApp</span>
      </button>

      {/* Modals & Lightbox */}
      <DestinationDetailModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        onBookInquiry={(subject) => {
          setSelectedDestination(null);
          openGeneralWhatsApp(subject);
        }}
      />

      <GalleryLightbox
        photos={GALLERY_PHOTOS}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(nextIndex) => setLightboxIndex(nextIndex)}
      />

      <WhatsAppBookingModal
        isOpen={bookingModalOpen}
        initialPackageId={bookingPackageId}
        initialSubject={bookingSubject}
        onClose={() => setBookingModalOpen(false)}
      />
    </div>
  );
}
