import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface PasswordProtectionModalProps {
  correctPasscode?: string;
  onUnlocked: () => void;
}

export const PasswordProtectionModal: React.FC<PasswordProtectionModalProps> = ({
  correctPasscode = '',
  onUnlocked,
}) => {
  const [inputPasscode, setInputPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPasscode === correctPasscode) {
      setError(false);
      onUnlocked();
    } else {
      setError(true);
    }
  };

  return (
    <div className="envelope-overlay">
      <div className="envelope-card animate-fade-in-up">
        <div className="mb-3 text-warning">
          <Lock size={48} className="animate-float" />
        </div>
        <h3 className="font-heading gold-text-gradient mb-2 fw-bold">Private Invitation</h3>
        <p className="text-muted small mb-4">
          This wedding invitation is protected. Please enter the invitation passcode provided by the couple to view.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="password"
              className={`rsvp-input text-center ${error ? 'border-danger' : ''}`}
              placeholder="Enter Invitation Passcode"
              value={inputPasscode}
              onChange={(e) => {
                setError(false);
                setInputPasscode(e.target.value);
              }}
              required
            />
            {error && <div className="text-danger small mt-2">Incorrect passcode. Please try again.</div>}
          </div>

          <button type="submit" className="btn btn-warning w-100 fw-semibold rounded-pill py-2.5 shadow-sm">
            Unlock Invitation
          </button>
        </form>
      </div>
    </div>
  );
};
