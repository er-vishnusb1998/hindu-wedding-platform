import React, { useState } from 'react';
import { Wedding } from '../../types';
import { weddingService } from '../../services/weddingService';
import { storageService } from '../../services/storageService';
import { Save, Upload, Check } from 'lucide-react';

interface BasicInfoEditorProps {
  wedding: Wedding;
  onUpdated: (updated: Wedding) => void;
}

export const BasicInfoEditor: React.FC<BasicInfoEditorProps> = ({ wedding, onUpdated }) => {
  const [formData, setFormData] = useState<Wedding>(wedding);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof Wedding) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      const url = await storageService.uploadFile(file, 'wedding-images', `${wedding.id}/photos`);
      setFormData((prev) => ({ ...prev, [field]: url }));
    } catch (err) {
      console.error('Photo upload failed:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await weddingService.updateWedding(formData);
      onUpdated(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Failed to update basic info:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card animate-fade-in-up">
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <h4 className="fw-bold mb-0">Couple &amp; Wedding Details</h4>
        <button type="submit" disabled={saving} className="btn btn-warning rounded-pill px-4 fw-semibold d-flex align-items-center gap-2">
          {saved ? <Check size={18} className="text-success" /> : <Save size={18} />}
          <span>{saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">Groom Name (English)</label>
          <input type="text" name="groom_name" className="form-control" value={formData.groom_name} onChange={handleTextChange} required />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">Groom Name (Malayalam)</label>
          <input type="text" name="groom_malayalam_name" className="form-control" placeholder="വിഷ്ണു" value={formData.groom_malayalam_name || ''} onChange={handleTextChange} />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">Bride Name (English)</label>
          <input type="text" name="bride_name" className="form-control" value={formData.bride_name} onChange={handleTextChange} required />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">Bride Name (Malayalam)</label>
          <input type="text" name="bride_malayalam_name" className="form-control" placeholder="വിജീഷ" value={formData.bride_malayalam_name || ''} onChange={handleTextChange} />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">Wedding Date</label>
          <input type="date" name="wedding_date" className="form-control" value={formData.wedding_date} onChange={handleTextChange} required />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">Main Ceremony Time</label>
          <input type="text" name="wedding_time" className="form-control" placeholder="10:30 AM" value={formData.wedding_time} onChange={handleTextChange} required />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">Location / City (English)</label>
          <input type="text" name="location" className="form-control" value={formData.location} onChange={handleTextChange} required />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">Location / City (Malayalam)</label>
          <input type="text" name="location_malayalam" className="form-control" placeholder="തൃശ്ശൂർ, കേരളം" value={formData.location_malayalam || ''} onChange={handleTextChange} />
        </div>

        <div className="col-12">
          <label className="form-label fw-semibold">Main Venue Name</label>
          <input type="text" name="venue_name" className="form-control" value={formData.venue_name} onChange={handleTextChange} required />
        </div>

        <div className="col-12">
          <label className="form-label fw-semibold">Venue Address</label>
          <textarea name="venue_address" className="form-control" rows={2} value={formData.venue_address || ''} onChange={handleTextChange} />
        </div>

        <div className="col-12">
          <label className="form-label fw-semibold">Google Maps Direction URL</label>
          <input type="url" name="google_maps_url" className="form-control" placeholder="https://maps.google.com/?q=..." value={formData.google_maps_url || ''} onChange={handleTextChange} />
        </div>

        {/* Photos Section */}
        <div className="col-12 my-3">
          <h5 className="fw-bold text-primary border-bottom pb-2">Photos</h5>
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label fw-semibold">Couple Cover Photo</label>
          {formData.couple_photo_url && <img src={formData.couple_photo_url} alt="Couple" className="img-thumbnail d-block mb-2 max-h-40 object-fit-cover" style={{ height: '120px', width: '100%' }} />}
          <input type="file" accept="image/*" className="form-control form-control-sm" onChange={(e) => handlePhotoUpload(e, 'couple_photo_url')} />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label fw-semibold">Groom Photo</label>
          {formData.groom_photo_url && <img src={formData.groom_photo_url} alt="Groom" className="img-thumbnail d-block mb-2 max-h-40 object-fit-cover" style={{ height: '120px', width: '100%' }} />}
          <input type="file" accept="image/*" className="form-control form-control-sm" onChange={(e) => handlePhotoUpload(e, 'groom_photo_url')} />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label fw-semibold">Bride Photo</label>
          {formData.bride_photo_url && <img src={formData.bride_photo_url} alt="Bride" className="img-thumbnail d-block mb-2 max-h-40 object-fit-cover" style={{ height: '120px', width: '100%' }} />}
          <input type="file" accept="image/*" className="form-control form-control-sm" onChange={(e) => handlePhotoUpload(e, 'bride_photo_url')} />
        </div>

        {/* Story Section */}
        <div className="col-12 my-3">
          <h5 className="fw-bold text-primary border-bottom pb-2">Couple Story</h5>
        </div>

        <div className="col-12">
          <label className="form-label fw-semibold">Story Paragraph (English)</label>
          <textarea name="story_text" className="form-control" rows={3} value={formData.story_text || ''} onChange={handleTextChange} />
        </div>

        <div className="col-12">
          <label className="form-label fw-semibold">Story Paragraph (Malayalam)</label>
          <textarea name="story_malayalam_text" className="form-control" rows={3} value={formData.story_malayalam_text || ''} onChange={handleTextChange} />
        </div>
      </div>

      <div className="mt-4 pt-3 border-top text-end">
        <button type="submit" disabled={saving} className="btn btn-warning rounded-pill px-4 fw-semibold">
          {saving ? 'Saving...' : 'Save All Details'}
        </button>
      </div>
    </form>
  );
};
