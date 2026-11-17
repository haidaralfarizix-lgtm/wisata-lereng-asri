import {useMemo, useState} from 'react';
import {
  Backpack,
  Bus,
  Check,
  Clock,
  Footprints,
  RotateCcw,
} from 'lucide-react';
import {
  TRAVEL_CHECKLIST_ITEMS,
  TRAVEL_TIPS,
  TravelTipCategory,
  TravelTipItem,
} from '../data/lerengAsriData';
import {WhatsAppIcon} from './WhatsAppIcon';

interface TravelTipsSectionProps {
  onAskTransport: (subject: string) => void;
}

const TIP_FILTERS: {id: TravelTipCategory; label: string}[] = [
  {id: 'semua', label: 'Semua Panduan'},
  {id: 'waktu', label: 'Waktu Berkunjung'},
  {id: 'transportasi', label: 'Transportasi Umum'},
  {id: 'fisik', label: 'Persiapan Fisik'},
  {id: 'perlengkapan', label: 'Perlengkapan'},
];

function renderCategoryIcon(category: TravelTipItem['category']) {
  switch (category) {
    case 'waktu':
      return <Clock className="w-5 h-5" aria-hidden="true" />;
    case 'transportasi':
      return <Bus className="w-5 h-5" aria-hidden="true" />;
    case 'fisik':
      return <Footprints className="w-5 h-5" aria-hidden="true" />;
    case 'perlengkapan':
      return <Backpack className="w-5 h-5" aria-hidden="true" />;
  }
}

export function TravelTipsSection({onAskTransport}: TravelTipsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<TravelTipCategory>('semua');
  const [checkedIds, setCheckedIds] = useState<string[]>([
    'cek-jaket',
    'cek-sepatu',
  ]);

  const filteredTips = useMemo(() => {
    if (activeFilter === 'semua') return TRAVEL_TIPS;
    return TRAVEL_TIPS.filter((tip) => tip.category === activeFilter);
  }, [activeFilter]);

  const toggleChecklist = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetChecklist = () => {
    setCheckedIds([]);
  };

  const checkedCount = checkedIds.length;
  const totalChecklist = TRAVEL_CHECKLIST_ITEMS.length;

  return (
    <section
      id="tips"
      className="py-12 sm:py-16 bg-[#F8FAF8] border-t border-[#E4EDE6]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading & Filter Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#2E7D52]">
              Tips Perjalanan Wisatawan
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#19221C] mt-1 text-balance">
              Panduan Praktis Agar Kunjungan Lebih Nyaman
            </h2>
            <p className="text-base text-[#435248] mt-2 leading-relaxed">
              Rekomendasi waktu kedatangan, rute angkutan umum dari Solo, hingga persiapan fisik dan barang bawaan sebelum menyusuri jalur alam Ngargoyoso.
            </p>
          </div>

          <div
            className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0"
            role="tablist"
            aria-label="Filter kategori tips perjalanan"
          >
            {TIP_FILTERS.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl font-display text-sm font-semibold transition-colors whitespace-nowrap shrink-0 border ${
                    isActive
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

        {/* Main Content: Tips Cards + Interactive Packing Checklist */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Tips Cards Grid */}
          <div
            className={`lg:col-span-8 grid grid-cols-1 ${
              filteredTips.length > 1 ? 'md:grid-cols-2' : ''
            } gap-5`}
          >
            {filteredTips.map((tip) => (
              <article
                key={tip.id}
                className="rounded-2xl bg-white border border-[#D1DDD5] p-5 sm:p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-[#EEF3EF] text-[#1E4D38] flex items-center justify-center shrink-0">
                        {renderCategoryIcon(tip.category)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#2E7D52]">
                          {tip.categoryLabel}
                        </p>
                        <p className="font-display text-sm font-bold text-[#B45309] tabular-nums">
                          {tip.highlightValue}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-bold text-[#19221C] mt-4 leading-snug">
                    {tip.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#435248] mt-2 leading-relaxed">
                    {tip.summary}
                  </p>

                  <ul className="mt-4 pt-4 border-t border-[#E4EDE6] space-y-2.5">
                    {tip.actionPoints.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-sm text-[#19221C] leading-relaxed"
                      >
                        <Check
                          className="w-4 h-4 text-[#2E7D52] mt-1 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          {/* Right Sidebar: Interactive Readiness Checklist + Transport Help */}
          <aside className="lg:col-span-4 rounded-2xl bg-white border border-[#D1DDD5] p-5 sm:p-6 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[#2E7D52]">
                  Ceklis Siap Berangkat
                </p>
                <h3 className="font-display text-lg font-bold text-[#19221C] mt-0.5">
                  Daftar Bawaan Ringkas
                </h3>
              </div>
              <span className="font-display text-sm font-bold text-[#1E4D38] tabular-nums shrink-0 pt-0.5">
                {checkedCount}/{totalChecklist} siap
              </span>
            </div>

            <div className="w-full h-2 rounded-lg bg-[#EEF3EF] overflow-hidden">
              <div
                className="h-full bg-[#2E7D52] transition-all duration-200"
                style={{
                  width: `${Math.round((checkedCount / totalChecklist) * 100)}%`,
                }}
              />
            </div>

            <ul className="space-y-2.5" aria-label="Ceklis persiapan wisatawan">
              {TRAVEL_CHECKLIST_ITEMS.map((item) => {
                const isChecked = checkedIds.includes(item.id);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isChecked}
                      onClick={() => toggleChecklist(item.id)}
                      className={`w-full min-h-[48px] p-3 rounded-xl border text-left flex items-start gap-3 transition-colors ${
                        isChecked
                          ? 'bg-[#EEF3EF] border-[#2E7D52]'
                          : 'bg-[#F8FAF8] border-[#D1DDD5] hover:bg-[#EEF3EF]/60'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-[#1E4D38] border-[#1E4D38] text-white'
                            : 'bg-white border-[#435248]/50'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block font-display text-sm font-semibold leading-snug ${
                            isChecked
                              ? 'text-[#1E4D38]'
                              : 'text-[#19221C]'
                          }`}
                        >
                          {item.label}
                        </span>
                        <span className="block text-xs text-[#435248] mt-0.5 leading-relaxed">
                          {item.note}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center justify-between gap-3 pt-1">
              <p className="text-xs text-[#435248] leading-relaxed">
                {checkedCount === totalChecklist
                  ? 'Semua perlengkapan dasar sudah siap untuk berwisata.'
                  : 'Centang barang yang sudah Anda siapkan di tas.'}
              </p>
              {checkedCount > 0 && (
                <button
                  type="button"
                  onClick={resetChecklist}
                  className="min-h-[36px] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#435248] hover:text-[#19221C] hover:bg-[#EEF3EF] transition-colors shrink-0 whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-[#E4EDE6]">
              <p className="text-sm font-semibold text-[#19221C]">
                Butuh arahan angkutan atau shuttle rombongan?
              </p>
              <p className="text-xs text-[#435248] mt-1 leading-relaxed">
                Admin Pokdarwis siap membantu estimasi ongkos ojek desa dari Pasar Ngargoyoso atau koordinasi parkir bus.
              </p>
              <button
                type="button"
                onClick={() =>
                  onAskTransport(
                    'Halo admin Desa Wisata Lereng Asri, saya ingin menanyakan panduan transportasi menuju lokasi dan kondisi jalur saat ini.'
                  )
                }
                className="mt-3 w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#137A48] hover:bg-[#0F633A] text-white font-display text-sm font-semibold transition-colors whitespace-nowrap"
              >
                <WhatsAppIcon className="w-4 h-4 shrink-0" />
                <span>Tanya Rute &amp; Transportasi</span>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
