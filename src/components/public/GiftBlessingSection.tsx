import React from 'react';
import { Wedding } from '../../types';
import { useWedding } from '../../context/WeddingContext';
import { Gift, QrCode } from 'lucide-react';

interface GiftBlessingSectionProps {
  wedding: Wedding;
}

export const GiftBlessingSection: React.FC<GiftBlessingSectionProps> = ({ wedding }) => {
  const { language } = useWedding();

  const text = wedding.gift_blessing_text || (language === 'ml'
    ? 'നിങ്ങളുടെ സാന്നിധ്യവും പ്രാർത്ഥനയുമാണ് ഞങ്ങൾക്ക് ഏറ്റവും വലിയ സമ്മാനം!'
    : 'Your presence, blessings, and warm wishes are the greatest gifts we could ever ask for!');

  return (
    <section id="gifts" className="wedding-section container text-center">
      <div className="section-card animate-fade-in-up">
        <div className="mb-2 text-warning">
          <Gift size={32} className="animate-float" />
        </div>

        <h2 className="font-heading gold-text-gradient fw-bold mb-2">
          {language === 'ml' ? 'ആശീർവാദങ്ങൾ & സമ്മാനങ്ങൾ' : 'Blessings & Gifts'}
        </h2>
        <div className="gold-divider" />

        <div className="row justify-content-center my-3">
          <div className="col-12 col-md-8">
            <p className="lead text-muted lh-base fst-italic mb-4">{text}</p>

            {wedding.upi_id && (
              <div className="p-3 bg-light rounded-4 border-gold d-inline-block text-center shadow-sm">
                <div className="d-flex align-items-center justify-content-center gap-1.5 mb-2 text-primary fw-bold">
                  <QrCode size={18} className="text-warning" />
                  <span>{language === 'ml' ? 'UPI ആശംസ നിധി' : 'Digital Blessing (UPI Shagun)'}</span>
                </div>
                <div className="bg-white p-2 rounded border font-monospace text-dark fw-semibold mb-1">
                  {wedding.upi_id}
                </div>
                <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                  {language === 'ml' ? 'നിങ്ങളുടെ സ്നേഹോപഹാരം സമർപ്പിക്കാം' : 'Optional digital gift contribution'}
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
