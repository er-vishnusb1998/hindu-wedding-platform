import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, toggleLanguage } = useWedding();

  return (
    <button
      onClick={toggleLanguage}
      className="lang-switch-btn d-flex align-items-center gap-1.5"
      title="Switch Language / ഭാഷ മാറ്റുക"
    >
      <Globe size={15} />
      <span>{language === 'en' ? 'മലയാളം' : 'English'}</span>
    </button>
  );
};
