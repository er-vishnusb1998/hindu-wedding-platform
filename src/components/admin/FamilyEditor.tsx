import React, { useState } from 'react';
import { FamilyMember, FamilySide } from '../../types';
import { weddingService } from '../../services/weddingService';
import { Users, Plus, Trash2, Save, X } from 'lucide-react';

interface FamilyEditorProps {
  weddingId: string;
  family: FamilyMember[];
  onUpdated: () => void;
}

export const FamilyEditor: React.FC<FamilyEditorProps> = ({ weddingId, family, onUpdated }) => {
  const [editingMember, setEditingMember] = useState<Partial<FamilyMember> | null>(null);
  const [saving, setSaving] = useState(false);

  const handleCreateNew = () => {
    setEditingMember({
      wedding_id: weddingId,
      name: '',
      relation: '',
      family_side: 'groom',
      display_order: family.length + 1,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.name) return;

    setSaving(true);
    try {
      await weddingService.saveFamilyMember({
        ...editingMember,
        wedding_id: weddingId,
        name: editingMember.name,
      });
      onUpdated();
      setEditingMember(null);
    } catch (err) {
      console.error('Failed to save family member:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete family member?')) return;
    try {
      await weddingService.deleteFamilyMember(id);
      onUpdated();
    } catch (err) {
      console.error('Failed to delete family member:', err);
    }
  };

  return (
    <div className="admin-card animate-fade-in-up">
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Users className="text-warning" size={22} />
            <span>Family Members &amp; Blessings</span>
          </h4>
          <p className="text-muted small mb-0">Add parents, elders, and family members for blessings.</p>
        </div>
        {!editingMember && (
          <button onClick={handleCreateNew} className="btn btn-warning rounded-pill px-3 fw-semibold d-flex align-items-center gap-1.5">
            <Plus size={18} />
            <span>Add Family Member</span>
          </button>
        )}
      </div>

      {editingMember && (
        <form onSubmit={handleSave} className="p-3 bg-light rounded-4 border border-warning mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <h5 className="fw-bold text-primary mb-0">{editingMember.id ? 'Edit Member' : 'Add Member'}</h5>
            <button type="button" onClick={() => setEditingMember(null)} className="btn btn-sm btn-link text-secondary">
              <X size={20} />
            </button>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Full Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Mr. Sadeeshbabu P K & Mrs. Indira"
                value={editingMember.name || ''}
                onChange={(e) => setEditingMember((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Relation / Designation</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Parents of the Groom"
                value={editingMember.relation || ''}
                onChange={(e) => setEditingMember((prev) => ({ ...prev, relation: e.target.value }))}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Family Group</label>
              <select
                className="form-select"
                value={editingMember.family_side || 'groom'}
                onChange={(e) => setEditingMember((prev) => ({ ...prev, family_side: e.target.value as FamilySide }))}
              >
                <option value="blessings">Eldest Matriarch / Patriarch Blessings</option>
                <option value="groom">Groom's Family</option>
                <option value="bride">Bride's Family</option>
              </select>
            </div>
          </div>

          <div className="mt-3 text-end d-flex gap-2 justify-content-end">
            <button type="button" onClick={() => setEditingMember(null)} className="btn btn-secondary rounded-pill px-3">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-warning rounded-pill px-4 fw-semibold d-flex align-items-center gap-1.5">
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Member'}</span>
            </button>
          </div>
        </form>
      )}

      <div className="row g-3">
        {family.map((item) => (
          <div key={item.id} className="col-12 col-md-6">
            <div className="p-3 border rounded-3 d-flex align-items-center justify-content-between bg-white shadow-sm">
              <div>
                <strong className="d-block text-dark">{item.name}</strong>
                <small className="text-muted">{item.relation || item.family_side.toUpperCase()}</small>
                <span className="badge bg-light text-dark border ms-2">{item.family_side}</span>
              </div>
              <button onClick={() => handleDelete(item.id)} className="btn btn-outline-danger btn-sm rounded-circle p-1.5">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
