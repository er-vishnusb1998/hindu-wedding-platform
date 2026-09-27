import React from 'react';
import { Wedding } from '../../types';
import { useWedding } from '../../context/WeddingContext';
import { Heart } from 'lucide-react';

interface FooterSectionProps {
  wedding: Wedding;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ wedding }) => {
  const { language } = useWedding();

  const groom = language === 'ml' && wedding.groom_malayalam_name ? wedding.groom_malayalam_name : wedding.groom_name;
  const bride = language === 'ml' && wedding.bride_malayalam_name ? wedding.bride_malayalam_name : wedding.bride_name;

  return (
    <footer className="py-5 text-center bg-dark text-white border-top border-warning position-relative mt-5">
      <div className="container">
        <div className="mb-3 text-warning">
          <Heart size={28} fill="var(--accent)" className="animate-float" />
        </div>

        <h3 className="font-heading gold-text-gradient fw-bold mb-2 fs-2">
          {groom} &amp; {bride}
        </h3>

        <p className="text-muted small mb-4">
          {language === 'ml'
            ? 'ഞങ്ങളുടെ മാംഗല്യ ചടങ്ങിലേക്ക് ഏവരെയും സ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു'
            : 'Thank you for showering us with your love, presence, and prayers.'}
        </p>

        <div className="gold-divider" style={{ width: '80px', margin: '1rem auto' }} />

        <div className="text-muted small mt-3" style={{ fontSize: '0.8rem' }}>
          Crafted with ❤️ for {wedding.title}
        </div>
      </div>
    </footer>
  );
};
