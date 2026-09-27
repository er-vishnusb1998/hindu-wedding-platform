import React from 'react';
import { Wedding } from '../../types';
import { useWedding } from '../../context/WeddingContext';
import { Map, ExternalLink } from 'lucide-react';
import { analytics } from '../../lib/analytics';

interface MapSectionProps {
  wedding: Wedding;
}

export const MapSection: React.FC<MapSectionProps> = ({ wedding }) => {
  const { language } = useWedding();

  if (!wedding.google_maps_url) return null;

  return (
    <section id="map" className="wedding-section container text-center">
      <div className="section-card animate-fade-in-up">
        <div className="mb-2 text-warning">
          <Map size={32} className="animate-float" />
        </div>

        <h2 className="font-heading gold-text-gradient fw-bold mb-2">
          {language === 'ml' ? 'മാപ്പും വഴികളും' : 'Interactive Location Map'}
        </h2>
        <div className="gold-divider" />

        <div className="p-3 bg-light border-gold rounded-4 my-3 text-center">
          <h4 className="font-heading text-primary fw-bold mb-1">{wedding.venue_name}</h4>
          <p className="text-muted small mb-3">{wedding.venue_address || wedding.location}</p>

          <a
            href={wedding.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => analytics.track({ weddingId: wedding.id, eventType: 'map_click' })}
            className="btn btn-warning rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
          >
            <ExternalLink size={16} />
            <span>{language === 'ml' ? 'ഗൂഗിൾ മാപ്പിൽ കാണുക' : 'Open in Google Maps App'}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
