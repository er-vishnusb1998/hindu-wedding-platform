import React, { useState } from 'react';
import { WeddingSection } from '../../types';
import { weddingService } from '../../services/weddingService';
import { Layers, ArrowUp, ArrowDown, Eye, EyeOff, Save, Check } from 'lucide-react';

interface SectionManagerProps {
  sections: WeddingSection[];
  onUpdated: (sections: WeddingSection[]) => void;
}

export const SectionManager: React.FC<SectionManagerProps> = ({ sections, onUpdated }) => {
  const [items, setItems] = useState<WeddingSection[]>(
    [...sections].sort((a, b) => a.display_order - b.display_order)
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleToggle = (id: string) => {
    setItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Re-assign display_order
    const reordered = updated.map((sec, i) => ({ ...sec, display_order: i + 1 }));
    setItems(reordered);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const savedSections = await weddingService.updateSections(items);
      onUpdated(savedSections);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to update sections:', err);
      alert('Failed to save sections.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-card animate-fade-in-up">
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Layers className="text-warning" size={22} />
            <span>Modular Section Builder</span>
          </h4>
          <p className="text-muted small mb-0">Enable, disable, or reorder invitation sections.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn btn-warning rounded-pill px-4 fw-semibold d-flex align-items-center gap-2">
          {saved ? <Check size={18} className="text-success" /> : <Save size={18} />}
          <span>{saving ? 'Saving...' : saved ? 'Saved Order!' : 'Save Section Order'}</span>
        </button>
      </div>

      <div className="list-group">
        {items.map((sec, index) => (
          <div
            key={sec.id}
            className={`list-group-item d-flex align-items-center justify-content-between p-3 ${
              !sec.enabled ? 'opacity-50 bg-light' : ''
            }`}
          >
            <div className="d-flex align-items-center gap-3">
              <span className="badge bg-secondary rounded-pill font-monospace">{index + 1}</span>
              <div>
                <strong className="d-block text-dark">{sec.title}</strong>
                {sec.title_malayalam && <small className="text-muted font-malayalam">{sec.title_malayalam}</small>}
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggle(sec.id)}
                className={`btn btn-sm ${sec.enabled ? 'btn-outline-success' : 'btn-outline-secondary'}`}
                title={sec.enabled ? 'Enabled (Click to Disable)' : 'Disabled (Click to Enable)'}
              >
                {sec.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
                <span className="ms-1 d-none d-sm-inline">{sec.enabled ? 'Enabled' : 'Disabled'}</span>
              </button>

              <button
                type="button"
                disabled={index === 0}
                onClick={() => handleMove(index, 'up')}
                className="btn btn-light btn-sm border"
                title="Move Up"
              >
                <ArrowUp size={16} />
              </button>

              <button
                type="button"
                disabled={index === items.length - 1}
                onClick={() => handleMove(index, 'down')}
                className="btn btn-light btn-sm border"
                title="Move Down"
              >
                <ArrowDown size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
