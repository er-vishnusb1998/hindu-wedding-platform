import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, ExternalLink } from 'lucide-react';

interface LivePreviewModalProps {
  slug: string;
}

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({ slug }) => {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const previewUrl = `/w/${slug}`;

  return (
    <div className="admin-card animate-fade-in-up">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 border-bottom pb-3 gap-3">
        <div>
          <h4 className="fw-bold mb-1">Live Invitation Preview</h4>
          <p className="text-muted small mb-0">Test your invitation layout across mobile, tablet, and desktop viewports.</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div className="btn-group border rounded-pill p-1 bg-light">
            <button
              onClick={() => setDevice('mobile')}
              className={`btn btn-sm rounded-pill d-flex align-items-center gap-1 ${device === 'mobile' ? 'btn-dark' : 'btn-light'}`}
            >
              <Smartphone size={16} />
              <span className="d-none d-sm-inline">Mobile (375px)</span>
            </button>

            <button
              onClick={() => setDevice('tablet')}
              className={`btn btn-sm rounded-pill d-flex align-items-center gap-1 ${device === 'tablet' ? 'btn-dark' : 'btn-light'}`}
            >
              <Tablet size={16} />
              <span className="d-none d-sm-inline">Tablet (768px)</span>
            </button>

            <button
              onClick={() => setDevice('desktop')}
              className={`btn btn-sm rounded-pill d-flex align-items-center gap-1 ${device === 'desktop' ? 'btn-dark' : 'btn-light'}`}
            >
              <Monitor size={16} />
              <span className="d-none d-sm-inline">Desktop (100%)</span>
            </button>
          </div>

          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-warning rounded-pill px-3 btn-sm fw-semibold d-inline-flex align-items-center gap-1.5"
          >
            <ExternalLink size={14} />
            <span>Open Public URL</span>
          </a>
        </div>
      </div>

      <div className="preview-device-container">
        <div className={`preview-frame-${device}`}>
          <iframe
            src={previewUrl}
            title="Live Invitation Preview"
            className="w-100 h-100 border-0"
          />
        </div>
      </div>
    </div>
  );
};
