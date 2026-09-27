import React, { useRef, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  musicUrl?: string;
  musicEnabled?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ musicUrl, musicEnabled = true }) => {
  const { musicPlaying, setMusicPlaying } = useWedding();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.play().catch(() => {
        // Handle browser autoplay policy block gracefully
        setMusicPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [musicPlaying, setMusicPlaying]);

  if (!musicEnabled || !musicUrl) return null;

  return (
    <div className="floating-audio-widget">
      <audio ref={audioRef} src={musicUrl} loop preload="auto" />

      <button
        onClick={() => setMusicPlaying(!musicPlaying)}
        className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-1.5"
        style={{ color: 'var(--primary)' }}
        title={musicPlaying ? 'Mute Background Music' : 'Play Background Music'}
      >
        {musicPlaying ? (
          <>
            <Pause size={18} className="text-warning" />
            <Volume2 size={16} className="animate-pulse" />
            <span className="small fw-semibold d-none d-sm-inline ms-1" style={{ fontSize: '0.8rem' }}>Music On</span>
          </>
        ) : (
          <>
            <Play size={18} className="text-muted" />
            <VolumeX size={16} className="text-muted" />
            <span className="small text-muted d-none d-sm-inline ms-1" style={{ fontSize: '0.8rem' }}>Music Off</span>
          </>
        )}
      </button>
    </div>
  );
};
