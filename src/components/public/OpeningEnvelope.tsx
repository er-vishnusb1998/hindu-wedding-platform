import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import confetti from 'canvas-confetti';
import { Sparkles, Heart } from 'lucide-react';

interface OpeningEnvelopeProps {
  brideName: string;
  groomName: string;
  onOpened: () => void;
}

export const OpeningEnvelope: React.FC<OpeningEnvelopeProps> = ({
  brideName,
  groomName,
  onOpened,
}) => {
  const { setMusicPlaying, weddingData, language } = useWedding();
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    setOpening(true);

    // Trigger golden celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#800020', '#FFFDF5', '#E6C200'],
    });

    // Start audio if enabled by admin
    if (weddingData?.wedding.music_enabled) {
      setMusicPlaying(true);
    }

    setTimeout(() => {
      onOpened();
    }, 700);
  };

  return (
    <div className={`envelope-overlay ${opening ? 'animate-fade-out' : ''}`}>
      <div className="envelope-card animate-fade-in-up">
        <div className="mb-3 text-warning">
          <Sparkles size={40} className="animate-float" />
        </div>

        <p className="text-uppercase tracking-widest text-muted small fw-semibold mb-2" style={{ letterSpacing: '0.2em' }}>
          {language === 'ml' ? 'സ്നേഹത്തോടെ ക്ഷണിക്കുന്നു' : 'You Are Cordially Invited'}
        </p>

        <h2 className="font-heading gold-text-gradient fw-bold mb-3" style={{ fontSize: '2.5rem' }}>
          {groomName} & {brideName}
        </h2>

        <p className="text-muted small fst-italic mb-4">
          {language === 'ml'
            ? 'ഞങ്ങളുടെ മാംഗല്യ ചടങ്ങിലേക്ക് ഏവരെയും ഹൃദയപൂർവ്വം ക്ഷണിക്കുന്നു'
            : 'To celebrate our sacred union and joyful wedding celebration'}
        </p>

        <div className="gold-divider" />

        <button
          onClick={handleOpen}
          className="envelope-seal-btn"
          title="Open Royal Wedding Invitation"
        >
          <Heart fill="#FFFFFF" size={32} />
        </button>

        <p className="text-muted small mt-3 fw-medium">
          {language === 'ml' ? 'വിവാഹപത്രിക തുറക്കുവാൻ അമർത്തുക' : 'Tap to Open Invitation'}
        </p>
      </div>
    </div>
  );
};
