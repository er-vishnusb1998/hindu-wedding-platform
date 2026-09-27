import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, QrCode, Sparkles } from 'lucide-react';

interface QRCodeModalProps {
  slug: string;
  title: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ slug, title }) => {
  const qrRef = useRef<HTMLDivElement | null>(null);
  const publicUrl = `${window.location.origin}/w/${slug}`;

  const handleDownloadQr = () => {
    if (!qrRef.current) return;
    const svgElement = qrRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20, 360, 360);

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `QR_${slug}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="admin-card animate-fade-in-up text-center">
      <div className="mb-3 text-warning">
        <QrCode size={40} className="animate-float" />
      </div>

      <h4 className="fw-bold mb-2 font-heading text-primary">Invitation QR Code</h4>
      <p className="text-muted small mb-4">
        Print this QR Code on your physical wedding invitations, reception welcome boards, or ceremony cards.
      </p>

      <div className="p-4 bg-light border-gold rounded-4 d-inline-block shadow-sm mb-4" ref={qrRef}>
        <QRCodeSVG
          value={publicUrl}
          size={220}
          level="H"
          includeMargin={true}
          fgColor="#4A0E17"
          bgColor="#FFFFFF"
        />
        <div className="mt-2 text-dark font-monospace small fw-bold">/w/{slug}</div>
      </div>

      <div>
        <button
          onClick={handleDownloadQr}
          className="btn btn-warning rounded-pill px-4 py-2.5 fw-bold shadow-sm d-inline-flex align-items-center gap-2"
        >
          <Download size={18} />
          <span>Download High-Res QR Code (PNG)</span>
        </button>
      </div>
    </div>
  );
};
