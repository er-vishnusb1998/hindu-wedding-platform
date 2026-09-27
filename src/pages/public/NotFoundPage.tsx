import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-background text-center p-4">
      <Heart size={48} className="text-warning mb-3 animate-float" />
      <h2 className="font-heading gold-text-gradient fw-bold mb-2">404 — Page Not Found</h2>
      <p className="text-muted small max-w-sm mb-4">
        The page or invitation link you requested does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-warning rounded-pill px-4">
        Go to Homepage
      </Link>
    </div>
  );
};
