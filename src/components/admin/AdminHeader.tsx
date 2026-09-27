import React, { useState } from 'react';
import { Wedding } from '../../types';
import { weddingService } from '../../services/weddingService';
import { ExternalLink, Copy, Check, Send, AlertTriangle } from 'lucide-react';

interface AdminHeaderProps {
  wedding: Wedding;
  onWeddingUpdated: (updated: Wedding) => void;
  activeTabTitle: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  wedding,
  onWeddingUpdated,
  activeTabTitle,
}) => {
  const [copied, setCopied] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const publicUrl = `${window.location.origin}/w/${wedding.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTogglePublish = async () => {
    setPublishing(true);
    try {
      const nextStatus = wedding.status === 'published' ? 'draft' : 'published';
      const updated = await weddingService.updateWedding({
        id: wedding.id,
        status: nextStatus,
      });
      onWeddingUpdated(updated);
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <header className="d-flex flex-wrap align-items-center justify-content-between pb-3 mb-4 border-bottom gap-3">
      <div>
        <h3 className="fw-bold mb-1">{activeTabTitle}</h3>
        <p className="text-muted small mb-0">
          Managing: <strong className="text-dark">{wedding.groom_name} &amp; {wedding.bride_name}</strong>
        </p>
      </div>

      <div className="d-flex flex-wrap align-items-center gap-2">
        <button
          onClick={handleCopyLink}
          className="btn btn-outline-secondary btn-sm rounded-pill d-inline-flex align-items-center gap-1.5 px-3"
        >
          {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
          <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
        </button>

        <a
          href={`/w/${wedding.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-primary btn-sm rounded-pill d-inline-flex align-items-center gap-1.5 px-3 text-decoration-none"
        >
          <ExternalLink size={14} />
          <span>Open Public Link</span>
        </a>

        <button
          onClick={handleTogglePublish}
          disabled={publishing}
          className={`btn btn-sm rounded-pill d-inline-flex align-items-center gap-1.5 px-3.5 fw-semibold ${
            wedding.status === 'published' ? 'btn-danger' : 'btn-success'
          }`}
        >
          {wedding.status === 'published' ? (
            <>
              <AlertTriangle size={14} />
              <span>Unpublish</span>
            </>
          ) : (
            <>
              <Send size={14} />
              <span>Publish Invitation</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
