import React, { useState } from 'react';
import { WeddingEvent } from '../../types';
import { weddingService } from '../../services/weddingService';
import { storageService } from '../../services/storageService';
import { Calendar, Plus, Trash2, Edit3, Save, X } from 'lucide-react';

interface EventsEditorProps {
  weddingId: string;
  events: WeddingEvent[];
  onUpdated: () => void;
}

export const EventsEditor: React.FC<EventsEditorProps> = ({ weddingId, events, onUpdated }) => {
  const [editingEvent, setEditingEvent] = useState<Partial<WeddingEvent> | null>(null);
  const [saving, setSaving] = useState(false);

  const handleCreateNew = () => {
    setEditingEvent({
      wedding_id: weddingId,
      title: '',
      title_malayalam: '',
      event_date: new Date().toISOString().slice(0, 10),
      event_time: '10:30 AM',
      venue_name: '',
      venue_address: '',
      description: '',
      description_malayalam: '',
      google_maps_url: '',
      dress_code: 'Traditional Kerala Kasavu',
      display_order: events.length + 1,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editingEvent.title) return;

    setSaving(true);
    try {
      await weddingService.saveEvent({ ...editingEvent, wedding_id: weddingId });
      onUpdated();
      setEditingEvent(null);
    } catch (err) {
      console.error('Failed to save event:', err);
      alert('Failed to save event.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await weddingService.deleteEvent(eventId);
      onUpdated();
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !editingEvent) return;
    const file = e.target.files[0];
    try {
      const url = await storageService.uploadFile(file, 'wedding-images', `${weddingId}/events`);
      setEditingEvent((prev) => (prev ? { ...prev, image_url: url } : null));
    } catch (err) {
      console.error('Failed to upload event photo:', err);
    }
  };

  return (
    <div className="admin-card animate-fade-in-up">
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Calendar className="text-warning" size={22} />
            <span>Manage Wedding Events</span>
          </h4>
          <p className="text-muted small mb-0">Add unlimited ceremonies and events (e.g. Muhurtham, Reception, Haldi).</p>
        </div>
        {!editingEvent && (
          <button onClick={handleCreateNew} className="btn btn-warning rounded-pill px-3 fw-semibold d-flex align-items-center gap-1.5">
            <Plus size={18} />
            <span>Add New Event</span>
          </button>
        )}
      </div>

      {/* Editing Form Modal / Block */}
      {editingEvent && (
        <form onSubmit={handleSave} className="p-3 bg-light rounded-4 border border-warning mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <h5 className="fw-bold text-primary mb-0">{editingEvent.id ? 'Edit Event' : 'Create New Event'}</h5>
            <button type="button" onClick={() => setEditingEvent(null)} className="btn btn-sm btn-link text-secondary">
              <X size={20} />
            </button>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Event Title (English) *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Thaali Kettu / Wedding Ceremony"
                value={editingEvent.title || ''}
                onChange={(e) => setEditingEvent((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Event Title (Malayalam)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. മുഹൂർത്തം"
                value={editingEvent.title_malayalam || ''}
                onChange={(e) => setEditingEvent((prev) => ({ ...prev, title_malayalam: e.target.value }))}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Date *</label>
              <input
                type="date"
                className="form-control"
                value={editingEvent.event_date || ''}
                onChange={(e) => setEditingEvent((prev) => ({ ...prev, event_date: e.target.value }))}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Time *</label>
              <input
                type="text"
                className="form-control"
                placeholder="10:30 AM - 11:45 AM"
                value={editingEvent.event_time || ''}
                onChange={(e) => setEditingEvent((prev) => ({ ...prev, event_time: e.target.value }))}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Venue Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Sri Krishna Temple Hall"
                value={editingEvent.venue_name || ''}
                onChange={(e) => setEditingEvent((prev) => ({ ...prev, venue_name: e.target.value }))}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Dress Code</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Kasavu Saree & Mundu"
                value={editingEvent.dress_code || ''}
                onChange={(e) => setEditingEvent((prev) => ({ ...prev, dress_code: e.target.value }))}
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Venue Full Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="Guruvayur, Thrissur, Kerala"
                value={editingEvent.venue_address || ''}
                onChange={(e) => setEditingEvent((prev) => ({ ...prev, venue_address: e.target.value }))}
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Google Maps URL</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://maps.google.com/?q=..."
                value={editingEvent.google_maps_url || ''}
                onChange={(e) => setEditingEvent((prev) => ({ ...prev, google_maps_url: e.target.value }))}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Description (English)</label>
              <textarea
                className="form-control"
                rows={2}
                value={editingEvent.description || ''}
                onChange={(e) => setEditingEvent((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Description (Malayalam)</label>
              <textarea
                className="form-control"
                rows={2}
                value={editingEvent.description_malayalam || ''}
                onChange={(e) => setEditingEvent((prev) => ({ ...prev, description_malayalam: e.target.value }))}
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Event Photo</label>
              {editingEvent.image_url && <img src={editingEvent.image_url} alt="Event" className="img-thumbnail d-block mb-2 max-h-32" style={{ maxHeight: '100px' }} />}
              <input type="file" accept="image/*" className="form-control form-control-sm" onChange={handleImageUpload} />
            </div>
          </div>

          <div className="mt-3 text-end d-flex gap-2 justify-content-end">
            <button type="button" onClick={() => setEditingEvent(null)} className="btn btn-secondary rounded-pill px-3">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-warning rounded-pill px-4 fw-semibold d-flex align-items-center gap-1.5">
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Event'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Events List */}
      <div className="row g-3">
        {events.map((ev) => (
          <div key={ev.id} className="col-12">
            <div className="p-3 border rounded-3 d-flex flex-wrap align-items-center justify-content-between gap-3 bg-white shadow-sm">
              <div className="d-flex align-items-center gap-3">
                {ev.image_url && <img src={ev.image_url} alt={ev.title} className="rounded object-fit-cover" style={{ width: '64px', height: '64px' }} />}
                <div>
                  <h5 className="fw-bold mb-1 text-primary">{ev.title} {ev.title_malayalam && <span className="text-muted fw-normal fs-6 font-malayalam">({ev.title_malayalam})</span>}</h5>
                  <small className="text-muted">{ev.event_date} • {ev.event_time} • {ev.venue_name}</small>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <button onClick={() => setEditingEvent(ev)} className="btn btn-outline-primary btn-sm rounded-circle p-2" title="Edit Event">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => handleDelete(ev.id)} className="btn btn-outline-danger btn-sm rounded-circle p-2" title="Delete Event">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
