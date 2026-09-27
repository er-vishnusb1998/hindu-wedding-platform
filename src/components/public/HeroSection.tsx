import React from 'react';
import { Wedding } from '../../types';
import { useWedding } from '../../context/WeddingContext';
import { formatDateString } from '../../utils/formatters';
import { Calendar, MapPin, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  wedding: Wedding;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ wedding }) => {
  const { language } = useWedding();

  const groom = language === 'ml' && wedding.groom_malayalam_name ? wedding.groom_malayalam_name : wedding.groom_name;
  const bride = language === 'ml' && wedding.bride_malayalam_name ? wedding.bride_malayalam_name : wedding.bride_name;
  const subtitle = language === 'ml' && wedding.hero_subtitle_malayalam ? wedding.hero_subtitle_malayalam : (wedding.hero_subtitle || 'Together with our families, we invite you to celebrate our wedding');
  const location = language === 'ml' && wedding.location_malayalam ? wedding.location_malayalam : wedding.location;

  return (
    <section className="wedding-section min-vh-100 d-flex flex-column align-items-center justify-content-center text-center position-relative">
      <div className="container py-4">
        {/* Arch Frame Couple Image */}
        {wedding.couple_photo_url && (
          <div className="hero-arch-container animate-fade-in-up">
            <div className="hero-arch-frame">
              <img
                src={wedding.couple_photo_url}
                alt={`${wedding.groom_name} & ${wedding.bride_name}`}
                className="hero-arch-img"
              />
            </div>
          </div>
        )}

        <div className="animate-fade-in-up">
          <p className="text-uppercase tracking-widest text-muted small fw-semibold mb-2" style={{ letterSpacing: '0.25em' }}>
            {subtitle}
          </p>

          <h1 className="font-heading gold-text-gradient fw-bold mb-2 display-3">
            {groom}
          </h1>
          <div className="font-script gold-text-gradient fs-1 my-1">&amp;</div>
          <h1 className="font-heading gold-text-gradient fw-bold mb-4 display-3">
            {bride}
          </h1>

          <div className="gold-divider" />

          {/* Date & Location Badges */}
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 mt-4">
            <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <Calendar size={18} className="text-warning" />
              <span className="fw-semibold small">{formatDateString(wedding.wedding_date, language)} • {wedding.wedding_time}</span>
            </div>

            <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <MapPin size={18} className="text-warning" />
              <span className="fw-semibold small">{location}</span>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 text-center">
          <a href="#story" className="text-decoration-none text-muted animate-float d-inline-block">
            <span className="d-block small text-uppercase tracking-wider mb-1" style={{ fontSize: '0.7rem' }}>Scroll Down</span>
            <ChevronDown size={22} className="text-warning" />
          </a>
        </div>
      </div>
    </section>
  );
};
