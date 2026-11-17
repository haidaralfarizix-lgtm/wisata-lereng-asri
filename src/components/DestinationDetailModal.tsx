import {useEffect} from 'react';
import {Clock, Footprints, MapPin, Sun, Ticket, X} from 'lucide-react';
import {DestinationItem} from '../data/lerengAsriData';
import {ResilientImage} from './ResilientImage';
import {WhatsAppIcon} from './WhatsAppIcon';

interface DestinationDetailModalProps {
  destination: DestinationItem | null;
  onClose: () => void;
  onBookInquiry: (destinationName: string) => void;
}

export function DestinationDetailModal({
  destination,
  onClose,
  onBookInquiry,
}: DestinationDetailModalProps) {
  useEffect(() => {
    if (!destination) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [destination, onClose]);

  if (!destination) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dest-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-[#D1DDD5] max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-56 sm:h-64 shrink-0 overflow-hidden bg-[#EEF3EF]">
          <ResilientImage
            src={destination.image}
            alt={destination.name}
            loading="eager"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail destinasi"
            className="absolute top-3 right-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/90 text-[#19221C] hover:bg-white shadow-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <p className="text-xs font-medium text-white/85">
              {destination.categoryLabel}
            </p>
            <h2
              id="dest-modal-title"
              className="font-display text-xl sm:text-2xl font-bold mt-0.5"
            >
              {destination.name}
            </h2>
          </div>
        </div>

        <div className="overflow-y-auto px-5 py-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-[#F8FAF8] border border-[#E4EDE6] rounded-xl p-4">
            <div className="flex items-start gap-2.5">
              <Ticket className="w-4 h-4 text-[#1E4D38] mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs text-[#435248]">Tiket Masuk</p>
                <p className="font-semibold text-[#19221C] tabular-nums">{destination.ticketPrice}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#1E4D38] mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs text-[#435248]">Jam Buka</p>
                <p className="font-semibold text-[#19221C] tabular-nums">{destination.openHours}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Footprints className="w-4 h-4 text-[#1E4D38] mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs text-[#435248]">Akses Jalan Kaki</p>
                <p className="font-semibold text-[#19221C]">{destination.walkTime}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Sun className="w-4 h-4 text-[#D97706] mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs text-[#435248]">Waktu Terbaik</p>
                <p className="font-semibold text-[#19221C]">{destination.bestTime}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold text-[#19221C] mb-1.5">
              Tentang Destinasi
            </h3>
            <p className="text-base leading-relaxed text-[#435248]">
              {destination.fullDesc}
            </p>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold text-[#19221C] mb-2">
              Fasilitas Tersedia
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {destination.facilities.map((facility) => (
                <li
                  key={facility}
                  className="flex items-start gap-2 text-sm text-[#19221C]"
                >
                  <MapPin className="w-4 h-4 text-[#2E7D52] mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{facility}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-[#E8F5E9]/70 border border-[#D1DDD5] p-4">
            <p className="font-display text-sm font-semibold text-[#0E3823]">
              Saran untuk Pengunjung
            </p>
            <p className="text-sm text-[#19221C] mt-1 leading-relaxed">
              {destination.tips}
            </p>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-[#E4EDE6] bg-white flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onBookInquiry(`Saya ingin bertanya jadwal & rute menuju ${destination.name}.`)}
            className="flex-1 min-h-[50px] inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-[#137A48] hover:bg-[#0F633A] text-white font-display text-base font-semibold transition-colors whitespace-nowrap"
          >
            <WhatsAppIcon className="w-5 h-5 shrink-0" />
            <span>Tanya &amp; Pesan Kunjungan</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[50px] px-5 py-3 rounded-xl border border-[#D1DDD5] bg-white hover:bg-[#EEF3EF] text-[#19221C] font-display text-sm font-semibold transition-colors whitespace-nowrap"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
