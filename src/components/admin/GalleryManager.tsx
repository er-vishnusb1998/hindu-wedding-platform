import React, { useState } from 'react';
import { GalleryItem } from '../../types';
import { weddingService } from '../../services/weddingService';
import { storageService } from '../../services/storageService';
import { Image as ImageIcon, Upload, Trash2, Star } from 'lucide-react';

interface GalleryManagerProps {
  weddingId: string;
  gallery: GalleryItem[];
  onUpdated: () => void;
}

export const GalleryManager: React.FC<GalleryManagerProps> = ({ weddingId, gallery, onUpdated }) => {
  const [uploading, setUploading] = useState(false);

  const handleMultipleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);

    const files = Array.from(e.target.files);
    try {
      for (const file of files) {
        const url = await storageService.uploadFile(file, 'wedding-images', `${weddingId}/gallery`);
        await weddingService.saveGalleryItem({
          wedding_id: weddingId,
          image_url: url,
          caption: file.name.replace(/\.[^/.]+$/, ''),
        });
      }
      onUpdated();
    } catch (err) {
      console.error('Failed to upload images:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete photo from gallery?')) return;
    try {
      await weddingService.deleteGalleryItem(id);
      onUpdated();
    } catch (err) {
      console.error('Failed to delete gallery item:', err);
    }
  };

  const handleSetCover = async (item: GalleryItem) => {
    try {
      // First update all items cover state to false
      for (const g of gallery) {
        if (g.is_cover) {
          await weddingService.saveGalleryItem({ ...g, is_cover: false });
        }
      }
      await weddingService.saveGalleryItem({ ...item, is_cover: true });
      onUpdated();
    } catch (err) {
      console.error('Failed to set cover photo:', err);
    }
  };

  return (
    <div className="admin-card animate-fade-in-up">
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <ImageIcon className="text-warning" size={22} />
            <span>Manage Photo Gallery</span>
          </h4>
          <p className="text-muted small mb-0">Upload multiple photos for your wedding masonry lightbox gallery.</p>
        </div>

        <label className={`btn btn-warning rounded-pill px-3.5 fw-semibold cursor-pointer d-flex align-items-center gap-2 ${uploading ? 'disabled' : ''}`}>
          <Upload size={18} />
          <span>{uploading ? 'Uploading...' : 'Upload Photos'}</span>
          <input type="file" multiple accept="image/*" className="d-none" onChange={handleMultipleUpload} disabled={uploading} />
        </label>
      </div>

      {gallery.length === 0 ? (
        <div className="text-center py-5 border rounded-4 bg-light">
          <ImageIcon size={48} className="text-muted mb-2 opacity-50" />
          <h5 className="fw-bold text-dark mb-1">No photos uploaded yet.</h5>
          <p className="text-muted small">Upload pre-wedding &amp; celebration photos to share with your guests.</p>
        </div>
      ) : (
        <div className="row g-3">
          {gallery.map((item) => (
            <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 border shadow-sm position-relative overflow-hidden">
                <img src={item.image_url} alt={item.caption || 'Photo'} className="card-img-top object-fit-cover" style={{ height: '180px' }} />

                {item.is_cover && (
                  <span className="position-absolute top-0 start-0 m-2 badge bg-warning text-dark d-flex align-items-center gap-1 shadow-sm">
                    <Star size={12} fill="#000" /> Cover Photo
                  </span>
                )}

                <div className="card-body p-2 d-flex align-items-center justify-content-between">
                  <small className="text-muted truncate me-2">{item.caption || 'Photo'}</small>
                  <div className="d-flex align-items-center gap-1">
                    {!item.is_cover && (
                      <button onClick={() => handleSetCover(item)} className="btn btn-outline-warning btn-sm p-1" title="Set as Cover">
                        <Star size={14} />
                      </button>
                    )}
                    <button onClick={() => handleDelete(item.id)} className="btn btn-outline-danger btn-sm p-1" title="Delete Photo">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
