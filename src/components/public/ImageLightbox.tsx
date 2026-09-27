import React, { useEffect } from 'react';
import { GalleryItem } from '../../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
  gallery: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  gallery,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!gallery || gallery.length === 0 || currentIndex < 0) return null;
  const currentItem = gallery[currentIndex];

  return (
    <div
      className="position-fixed inset-0 z-3 bg-dark bg-opacity-95 d-flex flex-column align-items-center justify-content-center p-3"
      style={{ backdropFilter: 'blur(10px)', zIndex: 2050 }}
    >
      {/* Top Bar with Close */}
      <button
        onClick={onClose}
        className="btn btn-link text-white position-absolute top-0 end-0 m-3 p-2 text-decoration-none"
        title="Close Lightbox"
      >
        <X size={32} />
      </button>

      {/* Main Image View */}
      <div className="position-relative text-center max-w-100 max-h-80 d-flex align-items-center justify-content-center">
        <button
          onClick={onPrev}
          className="btn btn-dark bg-opacity-50 text-white rounded-circle p-2 position-absolute start-0 ms-2 z-2"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          <ChevronLeft size={28} />
        </button>

        <img
          src={currentItem.image_url}
          alt={currentItem.caption || 'Wedding Photo'}
          className="img-fluid rounded-3 shadow-lg"
          style={{ maxHeight: '75vh', objectFit: 'contain' }}
        />

        <button
          onClick={onNext}
          className="btn btn-dark bg-opacity-50 text-white rounded-circle p-2 position-absolute end-0 me-2 z-2"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Caption & Counter */}
      <div className="text-center text-white mt-3">
        {currentItem.caption && <p className="mb-1 text-light small fs-6">{currentItem.caption}</p>}
        <span className="text-muted small">
          {currentIndex + 1} of {gallery.length}
        </span>
      </div>
    </div>
  );
};
