import React, { createContext, useContext, useState } from 'react';
import { WeddingFullData, Wedding } from '../types';
import { weddingService } from '../services/weddingService';

interface WeddingContextType {
  weddingData: WeddingFullData | null;
  setWeddingData: React.Dispatch<React.SetStateAction<WeddingFullData | null>>;
  language: 'en' | 'ml';
  toggleLanguage: () => void;
  musicPlaying: boolean;
  setMusicPlaying: (playing: boolean) => void;
  updateWeddingDetails: (updates: Partial<Wedding>) => Promise<void>;
  reloadWedding: (slug: string) => Promise<void>;
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weddingData, setWeddingData] = useState<WeddingFullData | null>(null);
  const [language, setLanguage] = useState<'en' | 'ml'>('en');
  const [musicPlaying, setMusicPlaying] = useState(false);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ml' : 'en'));
  };

  const updateWeddingDetails = async (updates: Partial<Wedding>) => {
    if (!weddingData) return;
    const updated = await weddingService.updateWedding({
      ...updates,
      id: weddingData.wedding.id,
    });
    setWeddingData((prev) => (prev ? { ...prev, wedding: updated } : null));
  };

  const reloadWedding = async (slug: string) => {
    const data = await weddingService.getWeddingBySlug(slug);
    setWeddingData(data);
  };

  return (
    <WeddingContext.Provider
      value={{
        weddingData,
        setWeddingData,
        language,
        toggleLanguage,
        musicPlaying,
        setMusicPlaying,
        updateWeddingDetails,
        reloadWedding,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
};
