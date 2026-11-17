import {useState} from 'react';
import {ChevronDown} from 'lucide-react';
import {FAQ_ITEMS} from '../data/lerengAsriData';
import {WhatsAppIcon} from './WhatsAppIcon';

interface FaqSectionProps {
  onAskQuestion: (subject: string) => void;
}

export function FaqSection({onAskQuestion}: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="py-12 sm:py-16 bg-white border-t border-[#E4EDE6]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Section Intro + Direct Help Box */}
          <div className="lg:col-span-4 space-y-5">
            <div>
              <p className="text-sm font-semibold text-[#2E7D52]">
                Tanya Jawab Pengunjung
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#19221C] mt-1 text-balance">
                Informasi Praktis Sebelum Berangkat
              </h2>
              <p className="text-base text-[#435248] mt-2 leading-relaxed">
                Jawaban singkat seputar akses jalan, keramahan jalur untuk pemula, hingga perlengkapan yang perlu dibawa ke Desa Wisata Lereng Asri.
              </p>
            </div>

            <div className="rounded-2xl bg-[#F8FAF8] border border-[#D1DDD5] p-5">
              <h3 className="font-display text-base font-bold text-[#19221C]">
                Masih ada pertanyaan khusus?
              </h3>
              <p className="text-sm text-[#435248] mt-1.5 leading-relaxed">
                Tanyakan langsung kondisi cuaca terkini, ketersediaan tenda, atau kebutuhan rombongan kepada pengelola desa.
              </p>
              <button
                type="button"
                onClick={() =>
                  onAskQuestion(
                    'Halo admin, saya ingin menanyakan informasi kunjungan ke Desa Wisata Lereng Asri.'
                  )
                }
                className="mt-4 w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#137A48] hover:bg-[#0F633A] text-white font-display text-sm font-semibold transition-colors whitespace-nowrap"
              >
                <WhatsAppIcon className="w-4 h-4 shrink-0" />
                <span>Tanya Admin via WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right Column: Accessible Accordion List */}
          <div className="lg:col-span-8 space-y-3">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openId === item.id;
              const panelId = `faq-panel-${item.id}`;
              const buttonId = `faq-button-${item.id}`;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-colors ${
                    isOpen
                      ? 'bg-[#F8FAF8] border-[#1E4D38]'
                      : 'bg-white border-[#D1DDD5] hover:bg-[#F8FAF8]/60'
                  }`}
                >
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => handleToggle(item.id)}
                    className="w-full min-h-[56px] px-5 py-4 flex items-center justify-between gap-4 text-left"
                  >
                    <div>
                      <span className="block text-xs font-semibold text-[#2E7D52]">
                        {item.topic}
                      </span>
                      <span className="block font-display text-base sm:text-lg font-bold text-[#19221C] mt-0.5 leading-snug">
                        {item.question}
                      </span>
                    </div>
                    <span
                      aria-hidden="true"
                      className={`min-w-[36px] min-h-[36px] rounded-xl flex items-center justify-center transition-transform duration-200 shrink-0 ${
                        isOpen
                          ? 'bg-[#1E4D38] text-white rotate-180'
                          : 'bg-[#EEF3EF] text-[#19221C]'
                      }`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="px-5 pb-5 pt-1 border-t border-[#E4EDE6]"
                    >
                      <p className="text-base text-[#435248] leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
