import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { weddingService } from '../../services/weddingService';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, HeartHandshake } from 'lucide-react';
import { analytics } from '../../lib/analytics';

interface RSVPSectionProps {
  weddingId: string;
}

export const RSVPSection: React.FC<RSVPSectionProps> = ({ weddingId }) => {
  const { language } = useWedding();
  const [guestName, setGuestName] = useState('');
  const [attendingStatus, setAttendingStatus] = useState<'attending' | 'not_attending'>('attending');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mealPreference, setMealPreference] = useState('Traditional Sadhya (Veg)');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !phoneNumber.trim()) return;

    setSubmitting(true);
    try {
      await weddingService.submitRsvp({
        wedding_id: weddingId,
        guest_name: guestName.trim(),
        attending_status: attendingStatus,
        number_of_guests: numberOfGuests,
        phone_number: phoneNumber.trim(),
        meal_preference: mealPreference,
        message: message.trim(),
      });

      analytics.track({ weddingId, eventType: 'rsvp_submit' });
      setSubmitted(true);

      if (attendingStatus === 'attending') {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } catch (err) {
      console.error('RSVP Submission Error:', err);
      alert('Failed to submit RSVP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="wedding-section container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-7">
          <div className="rsvp-form-card animate-fade-in-up text-center">
            <div className="mb-2 text-warning">
              <HeartHandshake size={36} className="animate-float" />
            </div>

            <h2 className="font-heading gold-text-gradient fw-bold mb-2">
              {language === 'ml' ? 'സാന്നിധ്യം അറിയിക്കുക (RSVP)' : 'Kindly Respond (RSVP)'}
            </h2>
            <p className="text-muted small">
              {language === 'ml' ? 'നിങ്ങളുടെ സാന്നിധ്യം മുൻകൂട്ടി അറിയിക്കുമല്ലോ' : 'Please let us know if you will be joining our celebrations'}
            </p>
            <div className="gold-divider" />

            {submitted ? (
              <div className="py-4 animate-fade-in-up">
                <CheckCircle2 size={54} className="text-success mb-3" />
                <h3 className="font-heading text-primary fw-bold mb-2">
                  {language === 'ml' ? 'നന്ദി! നിങ്ങളുടെ പ്രതികരണം ലഭിച്ചു' : 'Thank You For Your RSVP!'}
                </h3>
                <p className="text-muted small mb-0">
                  {attendingStatus === 'attending'
                    ? (language === 'ml'
                        ? 'നിങ്ങളെ സ്വീകരിക്കാൻ ഞങ്ങൾ കാത്തിരിക്കുന്നു ❤️'
                        : 'We look forward to welcoming you to our celebration ❤️')
                    : (language === 'ml'
                        ? 'നിങ്ങളുടെ ആശംസകൾക്ക് നന്ദി'
                        : 'Thank you for your blessings and warm wishes!')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="text-start mt-4">
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-primary">
                    {language === 'ml' ? 'നിങ്ങളുടെ പേര് *' : 'Your Full Name *'}
                  </label>
                  <input
                    type="text"
                    className="rsvp-input"
                    placeholder="e.g. Unnikrishnan Nair"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-primary">
                    {language === 'ml' ? 'ഫോൺ നമ്പർ *' : 'Mobile Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    className="rsvp-input"
                    placeholder="e.g. +91 98470 12345"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-primary mb-2">
                    {language === 'ml' ? 'പങ്കെടുക്കൽ *' : 'Will You Be Attending? *'}
                  </label>
                  <div className="d-flex gap-3">
                    <button
                      type="button"
                      className={`btn flex-fill py-2 rounded-3 fw-semibold ${
                        attendingStatus === 'attending' ? 'btn-warning text-dark' : 'btn-outline-secondary'
                      }`}
                      onClick={() => setAttendingStatus('attending')}
                    >
                      {language === 'ml' ? 'തീർച്ചയായും പങ്കെടുക്കും 👍' : 'Joyfully Accept 👍'}
                    </button>
                    <button
                      type="button"
                      className={`btn flex-fill py-2 rounded-3 fw-semibold ${
                        attendingStatus === 'not_attending' ? 'btn-danger' : 'btn-outline-secondary'
                      }`}
                      onClick={() => setAttendingStatus('not_attending')}
                    >
                      {language === 'ml' ? 'പങ്കെടുക്കുവാൻ സാധിക്കില്ല' : 'Regretfully Decline'}
                    </button>
                  </div>
                </div>

                {attendingStatus === 'attending' && (
                  <>
                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-primary">
                        {language === 'ml' ? 'കൂടെയുള്ള അതിഥികളുടെ എണ്ണം' : 'Number of Guests Attending'}
                      </label>
                      <select
                        className="rsvp-input"
                        value={numberOfGuests}
                        onChange={(e) => setNumberOfGuests(Number(e.target.value))}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-primary">
                        {language === 'ml' ? 'ഭക്ഷണ മുൻഗണന' : 'Meal Preference'}
                      </label>
                      <select
                        className="rsvp-input"
                        value={mealPreference}
                        onChange={(e) => setMealPreference(e.target.value)}
                      >
                        <option value="Traditional Sadhya (Veg)">Traditional Kerala Sadhya (Vegetarian)</option>
                        <option value="Standard Vegetarian">Standard Vegetarian</option>
                        <option value="Non-Vegetarian">Non-Vegetarian Feast</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="mb-4">
                  <label className="form-label fw-semibold small text-primary">
                    {language === 'ml' ? 'ആശംസകൾ / സന്ദേശം' : 'Blessings & Message for the Couple'}
                  </label>
                  <textarea
                    className="rsvp-input"
                    rows={3}
                    placeholder="Write a sweet message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-warning w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                >
                  <Send size={18} />
                  <span>{submitting ? 'Submitting...' : (language === 'ml' ? 'പ്രതികരണം സമർപ്പിക്കുക' : 'Submit RSVP')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
