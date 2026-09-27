import React from 'react';
import { FamilyMember } from '../../types';
import { useWedding } from '../../context/WeddingContext';
import { Users } from 'lucide-react';

interface FamilySectionProps {
  family: FamilyMember[];
}

export const FamilySection: React.FC<FamilySectionProps> = ({ family }) => {
  const { language } = useWedding();

  if (!family || family.length === 0) return null;

  const groomFamily = family.filter((f) => f.family_side === 'groom');
  const brideFamily = family.filter((f) => f.family_side === 'bride');
  const blessingsFamily = family.filter((f) => f.family_side === 'blessings');

  return (
    <section id="family" className="wedding-section container">
      <div className="section-card text-center animate-fade-in-up">
        <div className="mb-2 text-warning">
          <Users size={32} className="animate-float" />
        </div>

        <h2 className="font-heading gold-text-gradient fw-bold mb-2">
          {language === 'ml' ? 'മുതിർന്നവരുടെ അനുഗ്രഹങ്ങളോടെ' : 'With Elders\' & Family Blessings'}
        </h2>
        <div className="gold-divider" />

        {blessingsFamily.length > 0 && (
          <div className="mb-4">
            <p className="text-uppercase tracking-wider text-muted small fw-semibold">
              {language === 'ml' ? 'ആശീർവാദങ്ങൾ' : 'With Divine Blessings of'}
            </p>
            {blessingsFamily.map((item) => (
              <div key={item.id} className="fw-bold text-primary fs-5 my-1 font-heading">
                {item.name} {item.relation && <span className="text-muted fw-normal fs-6">({item.relation})</span>}
              </div>
            ))}
          </div>
        )}

        <div className="row g-4 my-2 justify-content-center">
          {groomFamily.length > 0 && (
            <div className="col-12 col-md-6">
              <div className="p-3 rounded-4 bg-light border-gold text-center">
                <h4 className="font-heading text-primary fw-bold mb-3">
                  {language === 'ml' ? 'വരന്റെ കുടുംബം' : 'Groom\'s Family'}
                </h4>
                {groomFamily.map((item) => (
                  <div key={item.id} className="mb-2">
                    <div className="fw-semibold text-dark">{item.name}</div>
                    {item.relation && <div className="text-muted small">{item.relation}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {brideFamily.length > 0 && (
            <div className="col-12 col-md-6">
              <div className="p-3 rounded-4 bg-light border-gold text-center">
                <h4 className="font-heading text-primary fw-bold mb-3">
                  {language === 'ml' ? 'വധുവിന്റെ കുടുംബം' : 'Bride\'s Family'}
                </h4>
                {brideFamily.map((item) => (
                  <div key={item.id} className="mb-2">
                    <div className="fw-semibold text-dark">{item.name}</div>
                    {item.relation && <div className="text-muted small">{item.relation}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
