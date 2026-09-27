import React, { useState } from 'react';
import { Wedding } from '../../types';
import { weddingService } from '../../services/weddingService';
import { storageService } from '../../services/storageService';
import { Music, Upload, Save, Play, Pause, Check } from 'lucide-react';

interface MusicManagerProps {
  wedding: Wedding;
  onUpdated: (updated: Wedding) => void;
}

export const MusicManager: React.FC<MusicManagerProps> = ({ wedding, onUpdated }) => {
  const [musicEnabled, setMusicEnabled] = useState(wedding.music_enabled);
  const [musicUrl, setMusicUrl] = useState(wedding.music_url || '');
  const [envelopeEnabled, setEnvelopeEnabled] = useState(wedding.opening_envelope_enabled);
  const [uploading, setUploading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [saved, setSaved] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);
    try {
      const url = await storageService.uploadFile(file, 'wedding-music', `${wedding.id}/music`);
      setMusicUrl(url);
    } catch (err) {
      console.error('Failed to upload audio:', err);
      alert('Failed to upload audio file.');
    } finally {
      setUploading(false);
    }
  };

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await weddingService.updateWedding({
        id: wedding.id,
        music_enabled: musicEnabled,
        music_url: musicUrl,
        opening_envelope_enabled: envelopeEnabled,
      });
      onUpdated(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save music settings:', err);
    }
  };

  return (
    <form onSubmit={handleSave} className="admin-card animate-fade-in-up">
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Music className="text-warning" size={22} />
            <span>Background Music &amp; Opening Card</span>
          </h4>
          <p className="text-muted small mb-0">Configure background audio and royal opening envelope animation.</p>
        </div>

        <button type="submit" className="btn btn-warning rounded-pill px-4 fw-semibold d-flex align-items-center gap-2">
          {saved ? <Check size={18} className="text-success" /> : <Save size={18} />}
          <span>{saved ? 'Saved!' : 'Save Music Settings'}</span>
        </button>
      </div>

      <div className="row g-4">
        {/* Envelope Toggle */}
        <div className="col-12">
          <div className="p-3 border rounded-3 bg-light d-flex align-items-center justify-content-between">
            <div>
              <strong className="d-block text-dark">Royal Envelope Opening Animation</strong>
              <small className="text-muted">Show guests a closed royal card with "Open Invitation" button upon first visit.</small>
            </div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={envelopeEnabled}
                onChange={(e) => setEnvelopeEnabled(e.target.checked)}
              />
            </div>
          </div>
        </div>

        {/* Music Enable Toggle */}
        <div className="col-12">
          <div className="p-3 border rounded-3 bg-light d-flex align-items-center justify-content-between">
            <div>
              <strong className="d-block text-dark">Background Music Player</strong>
              <small className="text-muted">Enable subtle shehnai/flute background audio for guests.</small>
            </div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={musicEnabled}
                onChange={(e) => setMusicEnabled(e.target.checked)}
              />
            </div>
          </div>
        </div>

        {musicEnabled && (
          <div className="col-12">
            <label className="form-label fw-semibold">Upload Audio MP3 File</label>
            <div className="d-flex align-items-center gap-2 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Audio URL or upload below..."
                value={musicUrl}
                onChange={(e) => setMusicUrl(e.target.value)}
              />
              <label className="btn btn-outline-secondary text-nowrap cursor-pointer">
                <Upload size={16} className="me-1" />
                <span>{uploading ? 'Uploading...' : 'Upload MP3'}</span>
                <input type="file" accept="audio/*" className="d-none" onChange={handleAudioUpload} disabled={uploading} />
              </label>
            </div>

            {musicUrl && (
              <div className="p-3 bg-white border rounded-3 d-flex align-items-center justify-content-between">
                <audio ref={audioRef} src={musicUrl} />
                <span className="small text-muted truncate max-w-sm me-2">{musicUrl}</span>
                <button type="button" onClick={handleTogglePlay} className="btn btn-outline-warning btn-sm rounded-circle p-2">
                  {playing ? <Pause size={18} /> : <Play size={18} />}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
};
