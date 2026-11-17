import {useEffect, useMemo, useState} from 'react';
import {Check, Copy, Minus, Plus, X} from 'lucide-react';
import {
  TOUR_PACKAGES,
  VILLAGE_CONTACT,
  buildWhatsAppUrl,
  formatRupiah,
} from '../data/lerengAsriData';
import {WhatsAppIcon} from './WhatsAppIcon';

interface WhatsAppBookingModalProps {
  isOpen: boolean;
  initialPackageId?: string;
  initialSubject?: string;
  onClose: () => void;
}

export function WhatsAppBookingModal({
  isOpen,
  initialPackageId,
  initialSubject,
  onClose,
}: WhatsAppBookingModalProps) {
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    initialPackageId || TOUR_PACKAGES[0].id
  );
  const [visitorName, setVisitorName] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [participants, setParticipants] = useState(4);
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (initialPackageId) {
      setSelectedPackageId(initialPackageId);
      const pkg = TOUR_PACKAGES.find((p) => p.id === initialPackageId);
      if (pkg) {
        setParticipants(pkg.minParticipants);
      }
    } else if (initialSubject) {
      setSelectedPackageId('konsultasi');
      setNotes(initialSubject);
    }
  }, [isOpen, initialPackageId, initialSubject]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const selectedPackage = useMemo(
    () => TOUR_PACKAGES.find((p) => p.id === selectedPackageId) || null,
    [selectedPackageId]
  );

  const estimatedTotal = selectedPackage
    ? selectedPackage.pricePerPerson * participants
    : null;

  const formattedDate = useMemo(() => {
    if (!visitDate) return 'Belum ditentukan';
    try {
      return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(`${visitDate}T00:00:00`));
    } catch {
      return visitDate;
    }
  }, [visitDate]);

  const whatsappMessage = useMemo(() => {
    const nama = visitorName.trim() || 'Calon Pengunjung';
    const lines = [
      `Halo Admin ${VILLAGE_CONTACT.brandName}, saya ingin bertanya / melakukan pemesanan wisata:`,
      '',
      `• Nama / Rombongan: ${nama}`,
      `• Pilihan Paket: ${selectedPackage ? selectedPackage.name : 'Konsultasi Wisata / Kunjungan Umum'}`,
      `• Rencana Tanggal: ${formattedDate}`,
      `• Jumlah Peserta: ${participants} orang`,
    ];

    if (estimatedTotal !== null && selectedPackage) {
      lines.push(
        `• Estimasi Biaya: ${formatRupiah(estimatedTotal)} (${formatRupiah(selectedPackage.pricePerPerson)}/orang)`
      );
    }

    if (notes.trim()) {
      lines.push(`• Catatan: ${notes.trim()}`);
    }

    lines.push('', 'Mohon informasi ketersediaan kuota dan konfirmasinya. Terima kasih.');
    return lines.join('\n');
  }, [visitorName, selectedPackage, formattedDate, participants, estimatedTotal, notes]);

  const whatsappHref = useMemo(() => buildWhatsAppUrl(whatsappMessage), [whatsappMessage]);

  const handlePackageChange = (value: string) => {
    setSelectedPackageId(value);
    const pkg = TOUR_PACKAGES.find((p) => p.id === value);
    if (pkg && participants < pkg.minParticipants) {
      setParticipants(pkg.minParticipants);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-[#D1DDD5] max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-[#D1DDD5]" aria-hidden="true" />
        </div>

        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-[#E4EDE6] shrink-0">
          <div>
            <h2
              id="booking-modal-title"
              className="font-display text-lg sm:text-xl font-bold text-[#19221C]"
            >
              Pesan Wisata via WhatsApp
            </h2>
            <p className="text-sm text-[#435248] mt-0.5">
              Konfirmasi kuota &amp; jadwal langsung dengan pengelola desa tanpa biaya awal.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup formulir pemesanan"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#435248] hover:bg-[#EEF3EF] hover:text-[#19221C] transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 space-y-5">
          <div>
            <label
              htmlFor="booking-package"
              className="block font-display text-sm font-semibold text-[#19221C] mb-1.5"
            >
              Pilih Paket atau Keperluan
            </label>
            <select
              id="booking-package"
              value={selectedPackageId}
              onChange={(e) => handlePackageChange(e.target.value)}
              className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-[#D1DDD5] bg-[#F8FAF8] text-base text-[#19221C] focus:border-[#1E4D38] focus:bg-white focus:outline-none"
            >
              {TOUR_PACKAGES.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} ({formatRupiah(pkg.pricePerPerson)}/{pkg.unitLabel})
                </option>
              ))}
              <option value="konsultasi">Konsultasi Wisata / Paket Rombongan Khusus</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="booking-name"
                className="block font-display text-sm font-semibold text-[#19221C] mb-1.5"
              >
                Nama Pemesan / Instansi
              </label>
              <input
                id="booking-name"
                type="text"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="Contoh: Ibu Sari / Keluarga"
                className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-[#D1DDD5] bg-[#F8FAF8] text-base text-[#19221C] placeholder:text-[#435248]/60 focus:border-[#1E4D38] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="booking-date"
                className="block font-display text-sm font-semibold text-[#19221C] mb-1.5"
              >
                Tanggal Kunjungan
              </label>
              <input
                id="booking-date"
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-[#D1DDD5] bg-[#F8FAF8] text-base text-[#19221C] focus:border-[#1E4D38] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="booking-count"
                className="font-display text-sm font-semibold text-[#19221C]"
              >
                Jumlah Peserta
              </label>
              {selectedPackage && (
                <span className="text-xs text-[#435248]">
                  Minimal {selectedPackage.minParticipants} orang untuk paket ini
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setParticipants((prev) => Math.max(1, prev - 1))}
                aria-label="Kurangi jumlah peserta"
                className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-xl border border-[#D1DDD5] bg-[#F8FAF8] text-[#19221C] hover:bg-[#EEF3EF] active:scale-95 transition-transform"
              >
                <Minus className="w-5 h-5" />
              </button>
              <input
                id="booking-count"
                type="number"
                min={1}
                max={500}
                value={participants}
                onChange={(e) => {
                  const parsed = parseInt(e.target.value, 10);
                  setParticipants(Number.isNaN(parsed) ? 1 : Math.max(1, Math.min(500, parsed)));
                }}
                className="w-24 min-h-[48px] text-center font-display text-lg font-bold tabular-nums rounded-xl border border-[#D1DDD5] bg-white text-[#19221C] focus:border-[#1E4D38] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setParticipants((prev) => Math.min(500, prev + 1))}
                aria-label="Tambah jumlah peserta"
                className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-xl border border-[#D1DDD5] bg-[#F8FAF8] text-[#19221C] hover:bg-[#EEF3EF] active:scale-95 transition-transform"
              >
                <Plus className="w-5 h-5" />
              </button>
              <span className="text-sm text-[#435248]">orang</span>
            </div>
          </div>

          <div>
            <label
              htmlFor="booking-notes"
              className="block font-display text-sm font-semibold text-[#19221C] mb-1.5"
            >
              Catatan Tambahan (Opsional)
            </label>
            <textarea
              id="booking-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Bawa anak kecil, butuh menu non-pedas, atau parkir bus."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D1DDD5] bg-[#F8FAF8] text-base text-[#19221C] placeholder:text-[#435248]/60 focus:border-[#1E4D38] focus:bg-white focus:outline-none resize-none"
            />
          </div>

          {estimatedTotal !== null && selectedPackage && (
            <div className="rounded-xl bg-[#E8F5E9] border border-[#D1DDD5] p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[#0E3823]">
                  Estimasi Total Paket ({participants} orang)
                </p>
                <p className="text-xs text-[#435248] mt-0.5">
                  Pembayaran dilakukan langsung setelah konfirmasi ketersediaan dengan admin.
                </p>
              </div>
              <p className="font-display text-xl font-bold text-[#1E4D38] tabular-nums">
                {formatRupiah(estimatedTotal)}
              </p>
            </div>
          )}

          <div className="rounded-xl bg-[#F8FAF8] border border-[#E4EDE6] p-3.5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-[#435248]">
                Pratinjau Pesan WhatsApp
              </span>
              <button
                type="button"
                onClick={handleCopyText}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E4D38] hover:text-[#0E3823] py-1 px-2 rounded-lg hover:bg-[#EEF3EF] transition-colors whitespace-nowrap shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Salin Teks
                  </>
                )}
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-[#435248]">
              {whatsappMessage}
            </pre>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-[#E4EDE6] bg-white flex flex-col sm:flex-row gap-3 shrink-0">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-[52px] inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#137A48] hover:bg-[#0F633A] text-white font-display text-base font-semibold shadow-sm transition-colors whitespace-nowrap"
          >
            <WhatsAppIcon className="w-5 h-5 shrink-0" />
            <span>Kirim Pesanan ke WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
