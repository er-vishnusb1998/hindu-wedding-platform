import React from 'react';
import { WeddingEvent } from '../../types';
import { useWedding } from '../../context/WeddingContext';
import { formatDateString } from '../../utils/formatters';
import { getGoogleCalendarUrl, downloadIcsFile } from '../../utils/calendar';
import { Calendar, MapPin, Clock, Shirt, Download, ExternalLink } from 'lucide-react';
import { analytics } from '../../lib/analytics';

interface EventsSectionProps {
  events: WeddingEvent[];
  weddingTitle: string;
  weddingId: string;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ events, weddingTitle, weddingId }) => {
  const { language } = useWedding();

  if (!events || events.length === 0) return null;

  return (
    <section id="events" className="wedding-section container">
      <div className="text-center mb-5 animate-fade-in-up">
        <h2 className="font-heading gold-text-gradient fw-bold mb-2">
          {language === 'ml' ? 'മാംഗല്യ ചടങ്ങുകൾ' : 'Auspicious Ceremonies & Events'}
        </h2>
        <p className="text-muted small">
          {language === 'ml' ? 'നിങ്ങളുടെ സാന്നിധ്യം ഞങ്ങൾ ആഗ്രഹിക്കുന്നു' : 'We look forward to celebrating each moment with you'}
        </p>
        <div className="gold-divider" />
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          {events.map((ev) => {
            const title = language === 'ml' && ev.title_malayalam ? ev.title_malayalam : ev.title;
            const description = language === 'ml' && ev.description_malayalam ? ev.description_malayalam : ev.description;

            return (
              <div key={ev.id} className="event-card animate-fade-in-up">
                <div className="row align-items-center g-4">
                  {ev.image_url && (
                    <div className="col-12 col-md-4">
                      <img
                        src={ev.image_url}
                        alt={ev.title}
                        className="img-fluid rounded-4 shadow-sm w-100 object-fit-cover"
                        style={{ maxHeight: '200px' }}
                      />
                    </div>
                  )}

                  <div className={ev.image_url ? 'col-12 col-md-8' : 'col-12'}>
                    <h3 className="font-heading text-primary fw-bold mb-2">{title}</h3>

                    <div className="d-flex flex-wrap align-items-center gap-3 text-muted small mb-3">
                      <div className="d-flex align-items-center gap-1.5">
                        <Calendar size={16} className="text-warning" />
                        <span>{formatDateString(ev.event_date, language)}</span>
                      </div>
                      <div className="d-flex align-items-center gap-1.5">
                        <Clock size={16} className="text-warning" />
                        <span>{ev.event_time}</span>
                      </div>
                      <div className="d-flex align-items-center gap-1.5">
                        <MapPin size={16} className="text-warning" />
                        <span className="fw-semibold">{ev.venue_name}</span>
                      </div>
                    </div>

                    {description && <p className="text-muted small mb-3 lh-base">{description}</p>}

                    {ev.venue_address && (
                      <p className="text-muted small fst-italic mb-3">
                        <span className="fw-semibold">Address:</span> {ev.venue_address}
                      </p>
                    )}

                    {ev.dress_code && (
                      <div className="d-inline-flex align-items-center gap-1.5 bg-light border-gold rounded-pill px-3 py-1 text-muted small mb-3">
                        <Shirt size={14} className="text-warning" />
                        <span><strong className="text-primary">{language === 'ml' ? 'വസ്ത്രധാരണം:' : 'Dress Code:'}</strong> {ev.dress_code}</span>
                      </div>
                    )}

                    {/* Buttons: Add to Calendar & Google Maps */}
                    <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
                      <a
                        href={getGoogleCalendarUrl(ev, weddingTitle)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => analytics.track({ weddingId, eventType: 'calendar_add' })}
                        className="btn btn-outline-warning btn-sm rounded-pill d-inline-flex align-items-center gap-1 px-3"
                      >
                        <Calendar size={14} />
                        <span>Google Calendar</span>
                      </a>

                      <button
                        onClick={() => {
                          downloadIcsFile(ev, weddingTitle);
                          analytics.track({ weddingId, eventType: 'calendar_add' });
                        }}
                        className="btn btn-outline-secondary btn-sm rounded-pill d-inline-flex align-items-center gap-1 px-3"
                      >
                        <Download size={14} />
                        <span>Download .ICS</span>
                      </button>

                      {ev.google_maps_url && (
                        <a
                          href={ev.google_maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => analytics.track({ weddingId, eventType: 'map_click' })}
                          className="btn btn-warning btn-sm rounded-pill d-inline-flex align-items-center gap-1 px-3 text-dark fw-medium ms-auto"
                        >
                          <ExternalLink size={14} />
                          <span>{language === 'ml' ? 'മാപ്പ് കാണുക' : 'Get Directions'}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
