import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading wedding invitation...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-background text-center p-4">
      <div className="mb-4 animate-float">
        <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" stroke="#D4AF37" strokeWidth="2" strokeDasharray="6 6" className="animate-spin-slow"/>
          <path d="M50 20C40 35 25 45 25 55C25 68.8 36.2 80 50 80C63.8 80 75 68.8 75 55C75 45 60 35 50 20Z" fill="url(#goldGrad)"/>
          <defs>
            <linearGradient id="goldGrad" x1="25" y1="20" x2="75" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D4AF37" />
              <stop offset="1" stopColor="#800020" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h4 className="font-heading text-primary fw-bold mb-2">{message}</h4>
      <p className="text-muted small">Please wait a moment</p>
    </div>
  );
};
