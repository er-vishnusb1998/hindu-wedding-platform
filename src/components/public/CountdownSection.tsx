import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { calculateTimeRemaining, TimeRemaining } from '../../utils/formatters';
import { Clock } from 'lucide-react';

interface CountdownSectionProps {
  weddingDate: string;
  weddingTime?: string;
}

export const CountdownSection: React.FC<CountdownSectionProps> = ({ weddingDate, weddingTime }) => {
  const { language } = useWedding();
  const [time, setTime] = useState<TimeRemaining>(() => calculateTimeRemaining(weddingDate, weddingTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateTimeRemaining(weddingDate, weddingTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [weddingDate, weddingTime]);

  return (
    <section className="wedding-section container text-center">
      <div className="section-card animate-fade-in-up">
        <div className="mb-2 text-warning">
          <Clock size={32} className="animate-float" />
        </div>

        <h2 className="font-heading gold-text-gradient fw-bold mb-2">
          {language === 'ml' ? 'മാംഗല്യ സുദിനത്തിലേക്ക്...' : 'Counting Down To The Big Day'}
        </h2>
        <p className="text-muted small">
          {language === 'ml' ? 'മംഗളകരമായ നിമിഷങ്ങൾക്ക് മണിക്കൂറുകൾ മാത്രം' : 'Every second brings us closer to our forever'}
        </p>

        {time.isPassed ? (
          <div className="alert alert-warning border-gold rounded-4 py-4 my-4 shadow-sm">
            <h3 className="font-heading gold-text-gradient fw-bold mb-1">
              {language === 'ml' ? 'ആഘോഷങ്ങൾ ആരംഭിച്ചു! ❤️' : 'The Celebration Has Begun ❤️'}
            </h3>
            <p className="text-muted mb-0 small">
              {language === 'ml' ? 'ഞങ്ങളുടെ വിവാഹ നിമിഷങ്ങളിൽ കൂടെയുള്ളതിന് നന്ദി' : 'Thank you for being part of our special moments'}
            </p>
          </div>
        ) : (
          <div className="countdown-grid">
            <div className="countdown-box">
              <div className="countdown-number">{time.days}</div>
              <div className="countdown-label">{language === 'ml' ? 'ദിവസങ്ങൾ' : 'Days'}</div>
            </div>

            <div className="countdown-box">
              <div className="countdown-number">{time.hours}</div>
              <div className="countdown-label">{language === 'ml' ? 'മണിക്കൂർ' : 'Hours'}</div>
            </div>

            <div className="countdown-box">
              <div className="countdown-number">{time.minutes}</div>
              <div className="countdown-label">{language === 'ml' ? 'മിനിറ്റ്' : 'Minutes'}</div>
            </div>

            <div className="countdown-box">
              <div className="countdown-number">{time.seconds}</div>
              <div className="countdown-label">{language === 'ml' ? 'സെക്കന്റ്' : 'Seconds'}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
