import React, { useState } from 'react';
import { Wedding, ThemeConfig } from '../../types';
import { THEME_PRESETS } from '../../lib/themePresets';
import { weddingService } from '../../services/weddingService';
import { Palette, Check } from 'lucide-react';

interface ThemeEditorProps {
  wedding: Wedding;
  onUpdated: (updated: Wedding) => void;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ wedding, onUpdated }) => {
  const [selectedThemeId, setSelectedThemeId] = useState(wedding.theme_id || THEME_PRESETS[0].id);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSelectTheme = async (themeId: string) => {
    setSelectedThemeId(themeId);
    setSaving(true);
    try {
      const updated = await weddingService.updateWedding({
        id: wedding.id,
        theme_id: themeId,
      });
      onUpdated(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to change theme:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-card animate-fade-in-up">
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Palette className="text-warning" size={24} />
            <span>Select Wedding Theme</span>
          </h4>
          <p className="text-muted small mb-0">Choose a luxury aesthetic preset tailored for Indian wedding invitations.</p>
        </div>
        {saved && (
          <span className="badge bg-success text-white px-3 py-2 rounded-pill d-flex align-items-center gap-1">
            <Check size={14} /> Theme Applied!
          </span>
        )}
      </div>

      <div className="row g-3">
        {THEME_PRESETS.map((preset) => {
          const isActive = selectedThemeId === preset.id;

          return (
            <div key={preset.id} className="col-12 col-md-6 col-lg-4">
              <div
                onClick={() => handleSelectTheme(preset.id)}
                className={`theme-option-card ${isActive ? 'active' : ''}`}
                style={{ background: preset.background_color, color: preset.text_color }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="font-heading fw-bold mb-0" style={{ color: preset.primary_color }}>
                    {preset.name}
                  </h5>
                  {isActive && <Check className="text-warning fw-bold" size={20} />}
                </div>

                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="color-swatch" style={{ background: preset.primary_color }} title="Primary Color" />
                  <span className="color-swatch" style={{ background: preset.secondary_color }} title="Secondary Color" />
                  <span className="color-swatch" style={{ background: preset.accent_color }} title="Accent Gold" />
                  <span className="color-swatch" style={{ background: preset.border_color }} title="Border Color" />
                </div>

                <div
                  className="p-2.5 rounded text-center small fw-semibold"
                  style={{ background: preset.surface_color, border: `1px solid ${preset.border_color}`, color: preset.text_color }}
                >
                  <span style={{ fontFamily: preset.font_heading }}>Preview Typography</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
