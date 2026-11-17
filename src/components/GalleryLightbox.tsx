import {useEffect} from 'react';
import {ChevronLeft, ChevronRight, X} from 'lucide-react';
import {GalleryPhoto} from '../data/lerengAsriData';
import {ResilientImage} from './ResilientImage';

interface GalleryLightboxProps {
  photos: GalleryPhoto[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export function GalleryLightbox({
  photos,
  activeIndex,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  useEffect(() => {
    if (activeIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        onNavigate((activeIndex + 1) % photos.length);
      } else if (e.key === 'ArrowLeft') {
        onNavigate((activeIndex - 1 + photos.length) % photos.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, photos.length, onClose, onNavigate]);

  if (activeIndex === null || !photos[activeIndex]) return null;

  const photo = photos[activeIndex];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      onClick={onClose}
    >
      <div
        className="flex items-center justify-between text-white max-w-5xl w-full mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-sm font-medium text-white/80 tabular-nums">
          {activeIndex + 1} / {photos.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup galeri foto"
          className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div
        className="relative max-w-4xl w-full mx-auto my-auto flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => onNavigate((activeIndex - 1 + photos.length) % photos.length)}
          aria-label="Foto sebelumnya"
          className="hidden sm:flex min-w-[48px] min-h-[48px] items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white mr-4 transition-colors shrink-0"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="w-full overflow-hidden rounded-2xl bg-[#111814] border border-white/10">
          <div className="aspect-4/3 sm:aspect-16/10 w-full overflow-hidden">
            <ResilientImage
              src={photo.image}
              alt={photo.title}
              loading="eager"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 sm:p-5 text-white bg-[#18231D]">
            <p className="text-xs text-[#85D8A5] font-medium">{photo.location}</p>
            <h3 className="font-display text-lg font-bold mt-0.5">{photo.title}</h3>
            <p className="text-sm text-white/80 mt-1 leading-relaxed">{photo.caption}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate((activeIndex + 1) % photos.length)}
          aria-label="Foto berikutnya"
          className="hidden sm:flex min-w-[48px] min-h-[48px] items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white ml-4 transition-colors shrink-0"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div
        className="flex sm:hidden items-center justify-center gap-4 pt-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => onNavigate((activeIndex - 1 + photos.length) % photos.length)}
          className="min-h-[48px] px-5 rounded-xl bg-white/15 text-white font-display text-sm font-semibold inline-flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          Sebelumnya
        </button>
        <button
          type="button"
          onClick={() => onNavigate((activeIndex + 1) % photos.length)}
          className="min-h-[48px] px-5 rounded-xl bg-white/15 text-white font-display text-sm font-semibold inline-flex items-center gap-1.5"
        >
          Berikutnya
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
