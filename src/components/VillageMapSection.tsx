import {useState} from 'react';
import {Car, Compass, ExternalLink, Footprints, MapPin, Mountain} from 'lucide-react';
import {
  ACCESS_ROUTES,
  MAP_LANDMARKS,
  VILLAGE_CONTACT,
} from '../data/lerengAsriData';
import {WhatsAppIcon} from './WhatsAppIcon';

interface VillageMapSectionProps {
  onAskDirections: (subject: string) => void;
}

export function VillageMapSection({onAskDirections}: VillageMapSectionProps) {
  const [activeId, setActiveId] = useState<string>(MAP_LANDMARKS[0].id);
  const activeLandmark =
    MAP_LANDMARKS.find((item) => item.id === activeId) || MAP_LANDMARKS[0];

  return (
    <section
      id="lokasi"
      className="py-12 sm:py-16 bg-[#EEF3EF] border-t border-[#E4EDE6]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-8">
          <p className="text-sm font-semibold text-[#2E7D52]">
            Peta Lokasi &amp; Akses Perjalanan
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#19221C] mt-1 text-balance">
            Mudah Dijangkau, Jalur Wisata Tertata Rapi
          </h2>
          <p className="text-base text-[#435248] mt-2 leading-relaxed">
            Ketuk titik lokasi di peta desa di bawah ini untuk melihat jarak jalan kaki dari area parkir dan fasilitas di setiap zona.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Interactive Topographic Trail Map */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#D1DDD5] p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#19221C]">
                <Compass className="w-4 h-4 text-[#1E4D38]" aria-hidden="true" />
                <span>Peta Kawasan Desa Wisata Lereng Asri</span>
              </div>
              <span className="text-xs text-[#435248] tabular-nums">
                Ketinggian 1.040 – 1.180 mdpl
              </span>
            </div>

            <div className="relative w-full aspect-16/11 sm:aspect-16/10 rounded-xl overflow-hidden border border-[#E4EDE6] bg-[#E8F5E9]">
              <svg
                viewBox="0 0 100 72"
                className="w-full h-full block"
                role="img"
                aria-label="Peta jalur wisata Desa Wisata Lereng Asri"
              >
                <defs>
                  <linearGradient id="valleyGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#DCECE0" />
                    <stop offset="55%" stopColor="#CBE4D1" />
                    <stop offset="100%" stopColor="#B8DBC1" />
                  </linearGradient>
                </defs>
                <rect width="100" height="72" fill="url(#valleyGrad)" />

                {/* Topographic Contour Curves */}
                <path
                  d="M-5 56 Q 28 48, 52 58 T 105 48"
                  fill="none"
                  stroke="#9AC6A8"
                  strokeWidth="0.45"
                />
                <path
                  d="M-5 40 Q 34 32, 60 40 T 105 26"
                  fill="none"
                  stroke="#9AC6A8"
                  strokeWidth="0.45"
                />
                <path
                  d="M10 18 Q 48 10, 74 18 T 105 8"
                  fill="none"
                  stroke="#87B898"
                  strokeWidth="0.45"
                />

                {/* River stream toward Curug Bening */}
                <path
                  d="M 88 72 C 82 63, 78 58, 74 52 C 70 46, 65 45, 58 49"
                  fill="none"
                  stroke="#5FA8B5"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.7"
                />

                {/* Village Paved Entry Road */}
                <path
                  d="M 2 64 L 18 56 L 34 45"
                  fill="none"
                  stroke="#6C7A70"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                {/* Walking Trails connecting zones */}
                <path
                  d="M 18 56 L 34 45 L 52 32 L 78 19"
                  fill="none"
                  stroke="#1E4D38"
                  strokeWidth="0.9"
                  strokeDasharray="1.8 1.4"
                  strokeLinecap="round"
                />
                <path
                  d="M 34 45 C 48 52, 60 56, 74 53"
                  fill="none"
                  stroke="#1E4D38"
                  strokeWidth="0.9"
                  strokeDasharray="1.8 1.4"
                  strokeLinecap="round"
                />

                {/* Subtle terrain labels */}
                <text
                  x="6"
                  y="11"
                  fill="#2E5F46"
                  fontSize="2.7"
                  fontWeight="600"
                  opacity="0.85"
                >
                  Lereng Hutan Pinus
                </text>
                <text
                  x="58"
                  y="66"
                  fill="#235763"
                  fontSize="2.5"
                  fontWeight="600"
                  opacity="0.85"
                >
                  Aliran Sungai Curug
                </text>
              </svg>

              {/* Interactive Landmark Pins */}
              {MAP_LANDMARKS.map((landmark) => {
                const isActive = landmark.id === activeLandmark.id;
                const mappedY = (landmark.y / 100) * 72;
                const topPercent = (mappedY / 72) * 100;

                return (
                  <button
                    key={landmark.id}
                    type="button"
                    onClick={() => setActiveId(landmark.id)}
                    aria-pressed={isActive}
                    aria-label={`${landmark.number}. ${landmark.name}`}
                    style={{
                      left: `${landmark.x}%`,
                      top: `${topPercent}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center group focus:outline-none"
                  >
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-display text-xs font-bold shadow-md transition-transform ${
                        isActive
                          ? 'bg-[#D97706] text-white scale-110 ring-4 ring-white'
                          : 'bg-[#1E4D38] text-white hover:bg-[#0E3823] ring-2 ring-white/90'
                      }`}
                    >
                      <span className="tabular-nums">{landmark.number}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Landmark Selector Row */}
            <div className="mt-4 flex flex-wrap gap-2">
              {MAP_LANDMARKS.map((landmark) => {
                const isActive = landmark.id === activeLandmark.id;
                return (
                  <button
                    key={landmark.id}
                    type="button"
                    onClick={() => setActiveId(landmark.id)}
                    className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-display font-semibold transition-colors whitespace-nowrap shrink-0 border ${
                      isActive
                        ? 'bg-[#1E4D38] text-white border-[#1E4D38]'
                        : 'bg-[#F8FAF8] text-[#19221C] border-[#D1DDD5] hover:bg-[#EEF3EF]'
                    }`}
                  >
                    <span className="tabular-nums mr-1">{landmark.number}.</span>
                    {landmark.name.split('&')[0].trim()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Landmark Info + Google Maps CTA */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#D1DDD5] p-5 sm:p-6 flex flex-col justify-between gap-5">
            <div>
              <p className="text-xs font-semibold text-[#2E7D52]">
                Titik {activeLandmark.number} · {activeLandmark.zone}
              </p>
              <h3 className="font-display text-xl font-bold text-[#19221C] mt-1">
                {activeLandmark.name}
              </h3>
              <p className="text-base text-[#435248] mt-2 leading-relaxed">
                {activeLandmark.description}
              </p>

              <div className="mt-4 pt-4 border-t border-[#E4EDE6] space-y-2.5 text-sm">
                <div className="flex items-center gap-2.5 text-[#19221C]">
                  <Footprints className="w-4 h-4 text-[#1E4D38] shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="font-semibold">Jarak Jalan:</strong> {activeLandmark.walkFromGate}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-[#19221C]">
                  <Mountain className="w-4 h-4 text-[#1E4D38] shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="font-semibold">Ketinggian:</strong>{' '}
                    <span className="tabular-nums">{activeLandmark.elevation}</span>
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-[#19221C]">
                  <MapPin className="w-4 h-4 text-[#1E4D38] mt-0.5 shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="font-semibold">Fasilitas:</strong> {activeLandmark.facilities}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E4EDE6] space-y-3">
              <div className="text-sm text-[#435248]">
                <p className="font-semibold text-[#19221C]">Alamat Gerbang Utama:</p>
                <p className="mt-0.5 leading-relaxed">{VILLAGE_CONTACT.address}</p>
                <p className="text-xs mt-1 tabular-nums">
                  Koordinat GPS: {VILLAGE_CONTACT.coordinates}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5">
                <a
                  href={VILLAGE_CONTACT.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1E4D38] hover:bg-[#0E3823] text-white font-display text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  <span>Buka Rute di Google Maps</span>
                  <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={() =>
                    onAskDirections(
                      `Halo admin, mohon arahan rute terbaik dan info parkir menuju ${VILLAGE_CONTACT.brandName}.`
                    )
                  }
                  className="min-h-[48px] w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#D1DDD5] bg-[#F8FAF8] hover:bg-[#E8F5E9] text-[#19221C] font-display text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#137A48] shrink-0" />
                  <span>Tanya Rute &amp; Parkir Bus</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Access Routes from Nearby Cities */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {ACCESS_ROUTES.map((route) => (
            <div
              key={route.origin}
              className="bg-white rounded-xl border border-[#D1DDD5] p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 font-display text-base font-semibold text-[#19221C]">
                  <Car className="w-4 h-4 text-[#1E4D38] shrink-0" aria-hidden="true" />
                  {route.origin}
                </span>
                <span className="text-xs font-semibold text-[#2E7D52] tabular-nums whitespace-nowrap">
                  {route.duration} · {route.distance}
                </span>
              </div>
              <p className="text-sm text-[#435248] mt-2 leading-relaxed">
                {route.routeSummary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
