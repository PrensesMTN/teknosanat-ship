import React from 'react';
import { 
  Box, 
  Grid, 
  Flame, 
  Layers, 
  Camera, 
  MapPin, 
  Maximize2
} from 'lucide-react';
import { CameraPreset, DeckLevel, ViewMode } from '../types';
import { ROOMS_DATA } from '../config/roomsData';
import { audioEngine } from '../utils/AudioEngine';

interface NavigationProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  activeDeck: DeckLevel;
  onDeckChange: (deck: DeckLevel) => void;
  onCameraPresetChange: (preset: CameraPreset) => void;
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  onResetView: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  viewMode,
  onViewModeChange,
  activeDeck,
  onDeckChange,
  onCameraPresetChange,
  selectedRoomId,
  onSelectRoom,
  onResetView
}) => {
  const handleViewMode = (mode: ViewMode) => {
    audioEngine.playModeSwitch();
    onViewModeChange(mode);
  };

  const handleDeck = (deck: DeckLevel) => {
    audioEngine.playClick();
    onDeckChange(deck);
  };

  const handlePreset = (preset: CameraPreset) => {
    audioEngine.playClick();
    onCameraPresetChange(preset);
  };

  const handleRoomClick = (id: string) => {
    audioEngine.playSelect();
    onSelectRoom(id);
  };

  return (
    <div className="pointer-events-auto flex flex-col gap-2.5 max-w-full">
      {/* Top Nav Control Bar: View Modes & Camera Presets */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl hud-glass w-fit">
        {/* View Modes */}
        <div className="flex items-center bg-slate-900/60 p-1 rounded-lg border border-cyan-500/20">
          <button
            id="view-mode-3d"
            type="button"
            onClick={() => handleViewMode('3d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono-tech transition-all cursor-pointer ${
              viewMode === '3d'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-cyan-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D GERÇEKÇİ</span>
          </button>

          <button
            id="view-mode-blueprint"
            type="button"
            onClick={() => handleViewMode('blueprint')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono-tech transition-all cursor-pointer ${
              viewMode === 'blueprint'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-cyan-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5 text-cyan-400" />
            <span>BLUEPRINT</span>
          </button>

          <button
            id="view-mode-flux"
            type="button"
            onClick={() => handleViewMode('flux')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono-tech transition-all cursor-pointer ${
              viewMode === 'flux'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-400/50 shadow-[0_0_8px_rgba(236,72,153,0.4)]'
                : 'text-slate-400 hover:text-pink-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-pink-400" />
            <span>ENERJİ AKISI</span>
          </button>
        </div>

        {/* Camera Angles */}
        <div className="flex items-center bg-slate-900/60 p-1 rounded-lg border border-cyan-500/20">
          <button
            id="cam-preset-iso"
            type="button"
            title="İzometrik Görünüm"
            onClick={() => handlePreset('iso')}
            className="p-1.5 text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4" />
          </button>

          <button
            id="cam-preset-top"
            type="button"
            title="2D Üstten Blueprint"
            onClick={() => handlePreset('top')}
            className="px-2 py-1 text-xs font-mono-tech text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-colors cursor-pointer"
          >
            ÜSTTEN
          </button>

          <button
            id="cam-preset-cockpit"
            type="button"
            title="Ön Kokpit Bakışı"
            onClick={() => handlePreset('cockpit')}
            className="px-2 py-1 text-xs font-mono-tech text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-colors cursor-pointer"
          >
            KOKPİT
          </button>

          <button
            id="reset-camera-btn"
            type="button"
            title="Kamerayı ve Seçimi Sıfırla"
            onClick={onResetView}
            className="p-1.5 text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-colors cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Deck Selector Bar */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl hud-glass w-fit">
        <span className="text-[10px] uppercase font-mono-tech text-cyan-400/80 px-2 flex items-center gap-1">
          <Layers className="w-3 h-3" />
          GÜVERTE:
        </span>

        <button
          id="deck-all"
          type="button"
          onClick={() => handleDeck(0)}
          className={`px-2.5 py-1 text-xs font-mono-tech rounded cursor-pointer transition-all ${
            activeDeck === 0
              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          TÜMÜ
        </button>

        <button
          id="deck-1"
          type="button"
          onClick={() => handleDeck(1)}
          className={`px-2.5 py-1 text-xs font-mono-tech rounded cursor-pointer transition-all ${
            activeDeck === 1
              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          G-1 (KOMUTA)
        </button>

        <button
          id="deck-2"
          type="button"
          onClick={() => handleDeck(2)}
          className={`px-2.5 py-1 text-xs font-mono-tech rounded cursor-pointer transition-all ${
            activeDeck === 2
              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          G-2 (MÜRETTEBAT)
        </button>

        <button
          id="deck-3"
          type="button"
          onClick={() => handleDeck(3)}
          className={`px-2.5 py-1 text-xs font-mono-tech rounded cursor-pointer transition-all ${
            activeDeck === 3
              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          G-3 (MÜHENDİSLİK)
        </button>
      </div>

      {/* Quick Room Jump Pills */}
      <div className="hidden lg:flex items-center gap-1.5 flex-wrap max-w-2xl">
        {Object.values(ROOMS_DATA).map((room) => {
          const isSelected = selectedRoomId === room.id;
          return (
            <button
              id={`jump-room-${room.id}`}
              key={room.id}
              type="button"
              onClick={() => handleRoomClick(room.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono-tech transition-all cursor-pointer hud-glass ${
                isSelected
                  ? 'border-cyan-400 text-cyan-200 bg-cyan-950/60 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  : 'text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40'
              }`}
            >
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: room.color }} 
              />
              <span className="truncate max-w-[120px]">{room.title}</span>
              {isSelected && <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
