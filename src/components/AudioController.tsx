import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio, Disc } from 'lucide-react';
import { audioEngine } from '../utils/AudioEngine';

export const AudioController: React.FC = () => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [ambientActive, setAmbientActive] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.4);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    // Start ambient reactor hum on first user interaction or mount
    const startAudio = () => {
      if (ambientActive && !isMuted) {
        audioEngine.startAmbientHum();
      }
      window.removeEventListener('pointerdown', startAudio);
    };
    window.addEventListener('pointerdown', startAudio);
    return () => {
      window.removeEventListener('pointerdown', startAudio);
      audioEngine.stopAmbientHum();
    };
  }, [ambientActive, isMuted]);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    audioEngine.setMuted(next);
    if (!next) {
      audioEngine.playClick();
      if (ambientActive) audioEngine.startAmbientHum();
    }
  };

  const toggleAmbient = () => {
    const next = !ambientActive;
    setAmbientActive(next);
    if (next) {
      audioEngine.startAmbientHum();
      audioEngine.playClick();
    } else {
      audioEngine.stopAmbientHum();
    }
  };

  const handleVolume = (val: number) => {
    setVolume(val);
    audioEngine.setVolume(val);
  };

  return (
    <div className="pointer-events-auto flex items-center gap-2">
      {isExpanded && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg hud-glass border border-cyan-500/30 animate-in fade-in">
          {/* Reactor Hum Toggle */}
          <button
            id="ambient-hum-toggle"
            type="button"
            onClick={toggleAmbient}
            title={ambientActive ? 'Reaktör Uğultusunu Kapat' : 'Reaktör Uğultusunu Aç'}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono-tech transition-colors cursor-pointer ${
              ambientActive 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3 h-3 text-cyan-400" />
            <span>REAKTÖR SESİ</span>
          </button>

          {/* Volume Slider */}
          <div className="flex items-center gap-1.5">
            <input
              id="master-volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>
      )}

      {/* Main Sound Button */}
      <button
        id="audio-controller-btn"
        type="button"
        onClick={() => {
          setIsExpanded(!isExpanded);
          audioEngine.playHover();
        }}
        onDoubleClick={toggleMute}
        title={isMuted ? 'Ses Kapalı (Açmak için tıkla)' : 'Ses Ayarları (Aç/Kapat için çift tıkla)'}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg hud-glass border transition-all cursor-pointer ${
          isMuted 
            ? 'border-red-500/40 text-red-400 bg-red-950/20' 
            : 'border-cyan-500/30 text-cyan-300 hover:border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
        }`}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4 text-cyan-400" />
        )}

        {/* Animated Equalizer Waveform bars */}
        {!isMuted && (
          <div className="flex items-end gap-0.5 h-3.5">
            <span className="w-0.5 bg-cyan-400 animate-pulse h-2" style={{ animationDelay: '0ms' }} />
            <span className="w-0.5 bg-cyan-400 animate-pulse h-3.5" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 bg-cyan-400 animate-pulse h-1.5" style={{ animationDelay: '300ms' }} />
            <span className="w-0.5 bg-cyan-400 animate-pulse h-3" style={{ animationDelay: '450ms' }} />
          </div>
        )}
      </button>
    </div>
  );
};
