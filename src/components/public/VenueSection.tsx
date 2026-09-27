import React from 'react';
import { Wedding } from '../../types';
import { useWedding } from '../../context/WeddingContext';
import { MapPin, Navigation } from 'lucide-react';
import { analytics } from '../../lib/analytics';

interface VenueSectionProps {
  wedding: Wedding;
}

export const VenueSection: React.FC<VenueSectionProps> = ({ wedding }) => {
  const { language } = useWedding();

  return (
    <section id="venue" className="wedding-section container">
      <div className="section-card text-center animate-fade-in-up">
        <div className="mb-2 text-warning">
          <MapPin size={32} className="animate-float" />
        </div>

        <h2 className="font-heading gold-text-gradient fw-bold mb-2">
          {language === 'ml' ? 'വിവാഹ വേദി' : 'Wedding Venue & Location'}
        </h2>
        <div className="gold-divider" />

        <div className="row justify-content-center my-4">
          <div className="col-12 col-md-8">
            <h3 className="font-heading text-primary fw-bold mb-2">{wedding.venue_name}</h3>
            {wedding.venue_address && (
              <p className="text-muted lh-base mb-4">{wedding.venue_address}</p>
            )}

            {wedding.google_maps_url && (
              <a
                href={wedding.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.track({ weddingId: wedding.id, eventType: 'map_click' })}
                className="btn btn-warning rounded-pill px-4 py-2.5 shadow-sm fw-semibold d-inline-flex align-items-center gap-2"
              >
                <Navigation size={18} />
                <span>{language === 'ml' ? 'വേദിയിലേക്കുള്ള ഗൂഗിൾ മാപ്പ്' : 'Get Venue Directions'}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
