import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Shirt, Sparkles } from 'lucide-react';

export const DressCodeSection: React.FC = () => {
  const { language } = useWedding();

  return (
    <section id="dress-code" className="wedding-section container text-center">
      <div className="section-card animate-fade-in-up">
        <div className="mb-2 text-warning">
          <Shirt size={32} className="animate-float" />
        </div>

        <h2 className="font-heading gold-text-gradient fw-bold mb-2">
          {language === 'ml' ? 'വസ്ത്രധാരണ രീതി' : 'Dress Code & Attire'}
        </h2>
        <div className="gold-divider" />

        <div className="row justify-content-center my-3">
          <div className="col-12 col-md-8">
            <div className="p-3 bg-light rounded-4 border-gold">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <Sparkles size={18} className="text-warning" />
                <span className="fw-bold text-primary">
                  {language === 'ml' ? 'പരമ്പരാഗത കേരള ശൈലി' : 'Traditional Kasavu & Indian Ethnic Attire'}
                </span>
              </div>
              <p className="text-muted small mb-0 lh-lg">
                {language === 'ml'
                  ? 'മാംഗല്യ ചടങ്ങുകളിൽ പരമ്പരാഗത കേരള കസവ് സാരികളും മുണ്ടുകളും അല്ലെങ്കിൽ സിൽക്ക് വസ്ത്രങ്ങളും ധരിച്ച് ഏവരും പങ്കാളികളാകണമെന്ന് അഭ്യർത്ഥിക്കുന്നു.'
                  : 'We kindly request our guests to dress in Traditional Kasavu Sarees, Kerala Golden Trimmed Mundu, Silk Kurtas, or Festive Indian Ethnic Attire for the sacred ceremony.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
