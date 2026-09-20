/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Engine } from './core/Engine';
import { HUDOverlay } from './components/HUDOverlay';
import { Navigation } from './components/Navigation';
import { InfoCard } from './components/InfoCard';
import { AudioController } from './components/AudioController';
import { DiagnosticConsole } from './components/DiagnosticConsole';
import { ControlsHelp } from './components/ControlsHelp';
import { ROOMS_DATA, INITIAL_SHIP_TELEMETRY } from './config/roomsData';
import { CameraPreset, DeckLevel, ShipTelemetry, ViewMode } from './types';
import { audioEngine } from './utils/AudioEngine';

export default function App() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);
  const [activeDeck, setActiveDeck] = useState<DeckLevel>(0);
  const [viewMode, setViewMode] = useState<ViewMode>('3d');
  const [telemetry, setTelemetry] = useState<ShipTelemetry>(INITIAL_SHIP_TELEMETRY);
  const [logs, setLogs] = useState<string[]>([
    '[INIT] USS Prometheus 3D WebGL motoru başlatıldı.',
    '[SYS] 8 adet primer güverte modülü yüklendi.',
    '[NET] Telemetri veri akışı senkronize edildi.'
  ]);

  const addLog = useCallback((message: string) => {
    const time = new Date().toLocaleTimeString('tr-TR');
    setLogs((prev) => [...prev, `[${time}] ${message}`]);
  }, []);

  // Initialize 3D Engine
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const engine = new Engine(canvasContainerRef.current, {
      onRoomSelect: (roomId: string) => {
        setSelectedRoomId(roomId);
        const room = ROOMS_DATA[roomId];
        if (room) {
          addLog(`[SEÇİM] ${room.title} odaklandı. Koordinatlar: (${room.position.x}, ${room.position.y}, ${room.position.z})`);
        }
      },
      onRoomHover: (roomId: string | null) => {
        setHoveredRoomId(roomId);
      },
      onFpsUpdate: (fps: number) => {
        setTelemetry((prev) => ({ ...prev, fps }));
      }
    });

    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [addLog]);

  // Handle Room Selection from UI
  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    if (engineRef.current) {
      engineRef.current.selectRoom(roomId);
    }
  };

  // Close Room InfoCard
  const handleCloseInfoCard = () => {
    setSelectedRoomId(null);
    if (engineRef.current) {
      engineRef.current.selectRoom(null);
      engineRef.current.setCameraPreset('iso');
    }
    addLog('[NAV] Genel gemi görünümüne dönüldü.');
  };

  // Deck Switching
  const handleDeckChange = (deck: DeckLevel) => {
    setActiveDeck(deck);
    setTelemetry((prev) => ({ ...prev, activeDeck: deck }));
    if (engineRef.current) {
      engineRef.current.setDeck(deck);
    }
    const deckNames: Record<DeckLevel, string> = {
      0: 'Tüm Güverteler',
      1: 'Güverte 1 (Üst Komuta & Bilim)',
      2: 'Güverte 2 (Mürettebat & Destek)',
      3: 'Güverte 3 (Mühendislik & İtiş)'
    };
    addLog(`[GÜVERTE] ${deckNames[deck]} filtrelendi.`);
  };

  // View Mode Changing (3D vs Blueprint vs Flux)
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setTelemetry((prev) => ({ ...prev, viewMode: mode }));
    if (engineRef.current) {
      engineRef.current.setViewMode(mode);
    }
    const modeNames: Record<ViewMode, string> = {
      '3d': '3D Gerçekçi PBR Kaplama',
      'blueprint': 'Holografik Şematik Blueprint',
      'flux': 'Enerji & Güç Akısı (Flux)'
    };
    addLog(`[GÖRÜNÜM] Modu değiştirildi: ${modeNames[mode]}`);
  };

  // Camera Presets
  const handleCameraPreset = (preset: CameraPreset) => {
    if (engineRef.current) {
      engineRef.current.setCameraPreset(preset);
    }
    addLog(`[KAMERA] Bakış açısı uygulandı: ${preset.toUpperCase()}`);
  };

  // Reset View
  const handleResetView = () => {
    audioEngine.playClick();
    setSelectedRoomId(null);
    setActiveDeck(0);
    if (engineRef.current) {
      engineRef.current.selectRoom(null);
      engineRef.current.setDeck(0);
      engineRef.current.setCameraPreset('iso');
    }
    addLog('[KAMERA] Kamera ve seçimler sıfırlandı.');
  };

  const selectedRoom = selectedRoomId ? ROOMS_DATA[selectedRoomId] : null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050811] text-slate-100 font-sans select-none">
      {/* 3D WebGL Canvas Viewport */}
      <div 
        ref={canvasContainerRef} 
        id="webgl-canvas-container"
        className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
      />

      {/* Blueprint Grid & Scanline Aesthetic Overlays */}
      <div className="absolute inset-0 pointer-events-none blueprint-grid-overlay opacity-30 z-[1]" />
      <div className="absolute inset-0 pointer-events-none scanlines opacity-25 z-[1]" />

      {/* Top Telemetry & Ship Header HUD */}
      <HUDOverlay 
        telemetry={telemetry} 
        selectedRoomTitle={selectedRoom ? selectedRoom.title : undefined}
      />

      {/* Hover Room Tooltip if hovered */}
      {hoveredRoomId && !selectedRoomId && ROOMS_DATA[hoveredRoomId] && (
        <div 
          className="pointer-events-none absolute bottom-28 left-1/2 -translate-x-1/2 z-20 hud-glass px-4 py-2 rounded-xl border border-cyan-400/50 flex items-center gap-2.5 shadow-2xl animate-in fade-in"
        >
          <span 
            className="w-2.5 h-2.5 rounded-full" 
            style={{ backgroundColor: ROOMS_DATA[hoveredRoomId].color }} 
          />
          <div>
            <div className="text-xs font-orbitron font-bold text-white tracking-wide">
              {ROOMS_DATA[hoveredRoomId].title}
            </div>
            <div className="text-[10px] text-cyan-300 font-mono-tech">
              {ROOMS_DATA[hoveredRoomId].deckName} • İncelemek için tıkla
            </div>
          </div>
        </div>
      )}

      {/* Bottom Main UI Overlay */}
      <div className="absolute bottom-0 inset-x-0 p-3 sm:p-5 flex flex-col sm:flex-row items-end justify-between gap-4 pointer-events-none z-20">
        {/* Left: View Mode, Deck Selector & Room Quick Jump */}
        <Navigation
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          activeDeck={activeDeck}
          onDeckChange={handleDeckChange}
          onCameraPresetChange={handleCameraPreset}
          selectedRoomId={selectedRoomId}
          onSelectRoom={handleSelectRoom}
          onResetView={handleResetView}
        />

        {/* Right Controls: Diagnostic Logs, Audio, and Help */}
        <div className="flex items-center gap-2.5">
          <DiagnosticConsole logs={logs} />
          <AudioController />
          <ControlsHelp />
        </div>
      </div>

      {/* Side Slide-Over Modal: Selected Room Details */}
      {selectedRoom && (
        <div className="absolute top-16 sm:top-20 right-3 sm:right-5 z-30 pointer-events-none animate-in fade-in slide-in-from-right duration-300">
          <InfoCard
            room={selectedRoom}
            onClose={handleCloseInfoCard}
            onSelectConnectedRoom={handleSelectRoom}
          />
        </div>
      )}
    </div>
  );
}
