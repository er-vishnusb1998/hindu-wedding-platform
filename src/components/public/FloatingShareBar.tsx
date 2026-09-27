import React from 'react';
import { Wedding } from '../../types';
import { formatDateString } from '../../utils/formatters';
import { analytics } from '../../lib/analytics';
import { Share2 } from 'lucide-react';

interface FloatingShareBarProps {
  wedding: Wedding;
}

export const FloatingShareBar: React.FC<FloatingShareBarProps> = ({ wedding }) => {
  const currentUrl = window.location.href;

  const shareText = `You're invited to celebrate the wedding of ${wedding.groom_name} & ${wedding.bride_name} ❤️\n\nDate: ${formatDateString(
    wedding.wedding_date
  )}\nLocation: ${wedding.location}\n\nView Digital Invitation:\n${currentUrl}`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  const handleNativeShare = async () => {
    analytics.track({ weddingId: wedding.id, eventType: 'share_click' });

    if (navigator.share) {
      try {
        await navigator.share({
          title: wedding.title,
          text: `You're invited to celebrate the wedding of ${wedding.groom_name} & ${wedding.bride_name} ❤️`,
          url: currentUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleNativeShare}
      className="floating-whatsapp-btn"
      title="Share Wedding Invitation on WhatsApp"
    >
      <Share2 size={24} />
    </a>
  );
};
