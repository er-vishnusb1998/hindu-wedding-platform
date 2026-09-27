import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { weddingService } from '../../services/weddingService';
import { useWedding } from '../../context/WeddingContext';
import { WeddingFullData } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { PasswordProtectionModal } from '../../components/common/PasswordProtectionModal';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';
import { AudioPlayer } from '../../components/common/AudioPlayer';
import { OpeningEnvelope } from '../../components/public/OpeningEnvelope';
import { HeroSection } from '../../components/public/HeroSection';
import { CoupleSection } from '../../components/public/CoupleSection';
import { CountdownSection } from '../../components/public/CountdownSection';
import { EventsSection } from '../../components/public/EventsSection';
import { VenueSection } from '../../components/public/VenueSection';
import { GallerySection } from '../../components/public/GallerySection';
import { FamilySection } from '../../components/public/FamilySection';
import { DressCodeSection } from '../../components/public/DressCodeSection';
import { RSVPSection } from '../../components/public/RSVPSection';
import { GiftBlessingSection } from '../../components/public/GiftBlessingSection';
import { MapSection } from '../../components/public/MapSection';
import { FooterSection } from '../../components/public/FooterSection';
import { FloatingShareBar } from '../../components/public/FloatingShareBar';
import { analytics } from '../../lib/analytics';
import { Heart, Lock } from 'lucide-react';

export const GuestInvitationPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { weddingData, setWeddingData } = useWedding();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    weddingService.getWeddingBySlug(slug).then((data) => {
      if (!data) {
        setNotFound(true);
      } else {
        setWeddingData(data);

        // Check password protection
        if (!data.wedding.is_password_protected) {
          setIsUnlocked(true);
        }

        // Check opening envelope animation
        if (!data.wedding.opening_envelope_enabled) {
          setIsEnvelopeOpened(true);
        }

        // Track page view analytics
        analytics.track({ weddingId: data.wedding.id, eventType: 'page_view' });
      }
      setLoading(false);
    });
  }, [slug, setWeddingData]);

  if (loading) {
    return <LoadingSpinner message="Opening wedding invitation..." />;
  }

  if (notFound || !weddingData) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-background text-center p-4">
        <Heart size={48} className="text-muted mb-3 opacity-50" />
        <h2 className="font-heading gold-text-gradient fw-bold mb-2">Invitation Not Found</h2>
        <p className="text-muted small max-w-sm mb-4">
          The wedding invitation link you opened might be invalid or set to draft mode by the organizer.
        </p>
        <a href="/" className="btn btn-warning rounded-pill px-4">
          Return Home
        </a>
      </div>
    );
  }

  // Check draft status (Public guests only access published weddings)
  if (weddingData.wedding.status !== 'published') {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-background text-center p-4">
        <Lock size={48} className="text-warning mb-3 animate-float" />
        <h2 className="font-heading gold-text-gradient fw-bold mb-2">Invitation Under Preparation</h2>
        <p className="text-muted small max-w-md mb-4">
          This wedding invitation is currently being customized in draft mode. Please check back soon!
        </p>
      </div>
    );
  }

  const { wedding, sections, events, gallery, family } = weddingData;
  const activeThemeId = wedding.theme_id || 'kerala-traditional';

  return (
    <div className="invitation-container" data-theme={activeThemeId}>
      {/* 1. Optional Password Modal */}
      {!isUnlocked && wedding.is_password_protected && (
        <PasswordProtectionModal
          correctPasscode={wedding.passcode}
          onUnlocked={() => setIsUnlocked(true)}
        />
      )}

      {/* 2. Optional Opening Envelope Animation */}
      {isUnlocked && !isEnvelopeOpened && wedding.opening_envelope_enabled && (
        <OpeningEnvelope
          brideName={wedding.bride_name}
          groomName={wedding.groom_name}
          onOpened={() => setIsEnvelopeOpened(true)}
        />
      )}

      {/* 3. Main Guest Invitation Experience */}
      {isUnlocked && isEnvelopeOpened && (
        <>
          {/* Top Floating Controls */}
          <div className="invitation-top-bar">
            <LanguageSwitcher />
          </div>

          <AudioPlayer musicUrl={wedding.music_url} musicEnabled={wedding.music_enabled} />

          <FloatingShareBar wedding={wedding} />

          {/* Render Sections in Configured Display Order */}
          {sections
            .filter((s) => s.enabled)
            .sort((a, b) => a.display_order - b.display_order)
            .map((sec) => {
              switch (sec.section_type) {
                case 'hero':
                  return <HeroSection key={sec.id} wedding={wedding} />;
                case 'story':
                  return <CoupleSection key={sec.id} wedding={wedding} />;
                case 'countdown':
                  return (
                    <CountdownSection
                      key={sec.id}
                      weddingDate={wedding.wedding_date}
                      weddingTime={wedding.wedding_time}
                    />
                  );
                case 'events':
                  return (
                    <EventsSection
                      key={sec.id}
                      events={events}
                      weddingTitle={wedding.title}
                      weddingId={wedding.id}
                    />
                  );
                case 'venue':
                  return <VenueSection key={sec.id} wedding={wedding} />;
                case 'gallery':
                  return <GallerySection key={sec.id} gallery={gallery} />;
                case 'family':
                  return <FamilySection key={sec.id} family={family} />;
                case 'dress_code':
                  return <DressCodeSection key={sec.id} />;
                case 'rsvp':
                  return <RSVPSection key={sec.id} weddingId={wedding.id} />;
                case 'gifts':
                  return <GiftBlessingSection key={sec.id} wedding={wedding} />;
                case 'map':
                  return <MapSection key={sec.id} wedding={wedding} />;
                case 'footer':
                  return <FooterSection key={sec.id} wedding={wedding} />;
                default:
                  return null;
              }
            })}
        </>
      )}
    </div>
  );
};
