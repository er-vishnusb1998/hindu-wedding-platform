import React, { useState } from 'react';
import { GalleryItem } from '../../types';
import { useWedding } from '../../context/WeddingContext';
import { ImageLightbox } from './ImageLightbox';
import { Camera } from 'lucide-react';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const { language } = useWedding();
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  if (!gallery || gallery.length === 0) return null;

  return (
    <section id="gallery" className="wedding-section container">
      <div className="text-center mb-5 animate-fade-in-up">
        <div className="mb-2 text-warning">
          <Camera size={32} className="animate-float" />
        </div>
        <h2 className="font-heading gold-text-gradient fw-bold mb-2">
          {language === 'ml' ? 'സ്നേഹചിത്രങ്ങൾ' : 'Wedding Photo Gallery'}
        </h2>
        <p className="text-muted small">
          {language === 'ml' ? 'മനോഹരമായ നിമിഷങ്ങളുടെ ചിത്ര ശേഖരം' : 'Capturing moments of love, laughter, and togetherness'}
        </p>
        <div className="gold-divider" />
      </div>

      <div className="gallery-grid">
        {gallery.map((item, index) => (
          <div
            key={item.id}
            className="gallery-item-card animate-fade-in-up"
            onClick={() => setSelectedIndex(index)}
          >
            <img
              src={item.image_url}
              alt={item.caption || 'Wedding Photo'}
              loading="lazy"
              className="gallery-item-img"
            />
            {item.caption && (
              <div className="position-absolute bottom-0 inset-x-0 p-2.5 bg-dark bg-opacity-60 text-white small text-center truncate">
                {item.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex >= 0 && (
        <ImageLightbox
          gallery={gallery}
          currentIndex={selectedIndex}
          onClose={() => setSelectedIndex(-1)}
          onNext={() => setSelectedIndex((prev) => (prev + 1) % gallery.length)}
          onPrev={() => setSelectedIndex((prev) => (prev - 1 + gallery.length) % gallery.length)}
        />
      )}
    </section>
  );
};
