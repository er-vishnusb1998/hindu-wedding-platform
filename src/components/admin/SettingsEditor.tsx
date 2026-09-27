import React, { useState } from 'react';
import { Wedding } from '../../types';
import { weddingService } from '../../services/weddingService';
import { validateSlug } from '../../utils/slug';
import { Settings, Lock, Globe, Save, Check } from 'lucide-react';

interface SettingsEditorProps {
  wedding: Wedding;
  onUpdated: (updated: Wedding) => void;
}

export const SettingsEditor: React.FC<SettingsEditorProps> = ({ wedding, onUpdated }) => {
  const [formData, setFormData] = useState<Wedding>(wedding);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData((prev) => ({ ...prev, slug: val }));
    const validation = validateSlug(val);
    setSlugError(validation.isValid ? null : validation.error || 'Invalid slug format.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateSlug(formData.slug);
    if (!validation.isValid) {
      setSlugError(validation.error || 'Invalid slug.');
      return;
    }

    setSaving(true);
    try {
      const updated = await weddingService.updateWedding(formData);
      onUpdated(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to update settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card animate-fade-in-up">
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Settings className="text-warning" size={22} />
            <span>Settings, Slug &amp; Privacy</span>
          </h4>
          <p className="text-muted small mb-0">Configure your custom invitation URL, SEO, and password protection.</p>
        </div>

        <button type="submit" disabled={saving || Boolean(slugError)} className="btn btn-warning rounded-pill px-4 fw-semibold d-flex align-items-center gap-2">
          {saved ? <Check size={18} className="text-success" /> : <Save size={18} />}
          <span>{saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}</span>
        </button>
      </div>

      <div className="row g-4">
        {/* Slug Configuration */}
        <div className="col-12">
          <label className="form-label fw-bold text-primary">Custom Invitation Slug URL *</label>
          <div className="input-group">
            <span className="input-group-text bg-light text-muted fw-semibold">
              {window.location.origin}/w/
            </span>
            <input
              type="text"
              className={`form-control ${slugError ? 'is-invalid' : ''}`}
              value={formData.slug}
              onChange={handleSlugChange}
              required
            />
          </div>
          {slugError ? (
            <div className="text-danger small mt-1">{slugError}</div>
          ) : (
            <small className="text-muted">Public URL will be: <strong>{window.location.origin}/w/{formData.slug}</strong></small>
          )}
        </div>

        {/* Password Protection */}
        <div className="col-12 border-top pt-3">
          <div className="p-3 bg-light border rounded-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="d-flex align-items-center gap-2">
                <Lock size={18} className="text-warning" />
                <strong className="text-dark">Protect Invitation with Password</strong>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={formData.is_password_protected}
                  onChange={(e) => setFormData((prev) => ({ ...prev, is_password_protected: e.target.checked }))}
                />
              </div>
            </div>

            {formData.is_password_protected && (
              <div className="mt-3">
                <label className="form-label fw-semibold small">Invitation Passcode</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter passcode (e.g. 2026)"
                  value={formData.passcode || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, passcode: e.target.value }))}
                  required={formData.is_password_protected}
                />
                <small className="text-muted">Guests will be prompted for this passcode before viewing invitation details.</small>
              </div>
            )}
          </div>
        </div>

        {/* SEO Meta */}
        <div className="col-12 border-top pt-3">
          <h5 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
            <Globe size={18} />
            <span>SEO &amp; Social Sharing Metadata</span>
          </h5>

          <div className="mb-3">
            <label className="form-label fw-semibold">SEO Title</label>
            <input
              type="text"
              className="form-control"
              value={formData.seo_title || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, seo_title: e.target.value }))}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">SEO Description</label>
            <textarea
              className="form-control"
              rows={2}
              value={formData.seo_description || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, seo_description: e.target.value }))}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">UPI ID for Digital Blessings (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. vishnu.vijisha@upi"
              value={formData.upi_id || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, upi_id: e.target.value }))}
            />
          </div>
        </div>
      </div>
    </form>
  );
};
