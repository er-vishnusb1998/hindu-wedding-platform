import React from 'react';
import { Wedding } from '../../types';
import { useWedding } from '../../context/WeddingContext';
import { Heart } from 'lucide-react';

interface CoupleSectionProps {
  wedding: Wedding;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({ wedding }) => {
  const { language } = useWedding();

  const groom = language === 'ml' && wedding.groom_malayalam_name ? wedding.groom_malayalam_name : wedding.groom_name;
  const bride = language === 'ml' && wedding.bride_malayalam_name ? wedding.bride_malayalam_name : wedding.bride_name;
  const story = language === 'ml' && wedding.story_malayalam_text ? wedding.story_malayalam_text : (wedding.story_text || 'Two hearts, two families, one beautiful beginning.');
  const storyTitle = wedding.story_title || (language === 'ml' ? 'ഞങ്ങളുടെ സ്നേഹബന്ധം' : 'Our Story & Journey');

  return (
    <section id="story" className="wedding-section container">
      <div className="section-card text-center animate-fade-in-up">
        <div className="mb-3 text-warning">
          <Heart size={32} fill="var(--accent)" className="animate-float" />
        </div>

        <h2 className="font-heading gold-text-gradient fw-bold mb-3">{storyTitle}</h2>
        <div className="gold-divider" />

        <div className="row align-items-center justify-content-center my-4 g-4">
          {/* Groom Card */}
          <div className="col-12 col-md-5 text-center">
            <div className="couple-avatar-frame">
              <img
                src={wedding.groom_photo_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                alt={wedding.groom_name}
                className="couple-avatar-img"
              />
            </div>
            <h3 className="font-heading text-primary fw-bold mb-1">{groom}</h3>
            <p className="text-uppercase tracking-wider text-muted small fw-semibold">
              {language === 'ml' ? 'വരൻ' : 'The Groom'}
            </p>
          </div>

          <div className="col-12 col-md-2 text-center my-2">
            <span className="font-script fs-1 gold-text-gradient">&amp;</span>
          </div>

          {/* Bride Card */}
          <div className="col-12 col-md-5 text-center">
            <div className="couple-avatar-frame">
              <img
                src={wedding.bride_photo_url || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80'}
                alt={wedding.bride_name}
                className="couple-avatar-img"
              />
            </div>
            <h3 className="font-heading text-primary fw-bold mb-1">{bride}</h3>
            <p className="text-uppercase tracking-wider text-muted small fw-semibold">
              {language === 'ml' ? 'വധു' : 'The Bride'}
            </p>
          </div>
        </div>

        {/* Story Paragraph */}
        <div className="row justify-content-center">
          <div className="col-12 col-lg-9">
            <p className="lead text-muted lh-lg fst-italic px-3 mb-0" style={{ fontSize: '1.05rem' }}>
              &ldquo;{story}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
