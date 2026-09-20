import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Activity, 
  Wifi, 
  Layers, 
  Compass,
  Cpu
} from 'lucide-react';
import { ShipTelemetry } from '../types';

interface HUDOverlayProps {
  telemetry: ShipTelemetry;
  selectedRoomTitle?: string;
  onOpenDeckSelect?: () => void;
}

export const HUDOverlay: React.FC<HUDOverlayProps> = ({
  telemetry,
  selectedRoomTitle,
}) => {
  const [stardate, setStardate] = useState<string>('79421.4');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const val = (79420 + (now.getSeconds() * 0.1) + (now.getMilliseconds() * 0.0001)).toFixed(2);
      setStardate(val);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 sm:p-5 select-none z-10">
      {/* Top Telemetry Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 w-full">
        {/* Ship Identification & Logo */}
        <div className="pointer-events-auto flex items-center gap-3 hud-glass px-4 py-2.5 rounded-lg hud-corner-brackets">
          <div className="relative w-8 h-8 flex items-center justify-center rounded border border-cyan-400/40 bg-cyan-950/40">
            <Compass className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '24s' }} />
            <div className="absolute inset-0 rounded bg-cyan-400/10 blur-[2px]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-orbitron font-bold tracking-wider text-xs sm:text-sm text-cyan-300">
                USS PROMETHEUS
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono-tech border border-cyan-400/30">
                NX-801
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono-tech flex items-center gap-2">
              <span>ETKİLEŞİMLİ 3D BLUEPRINT</span>
              <span className="text-cyan-500">•</span>
              <span className="text-cyan-400 font-semibold">SD {stardate}</span>
            </div>
          </div>
        </div>

        {/* Center Live Telemetry Gauges */}
        <div className="pointer-events-auto hidden md:flex items-center gap-4 hud-glass px-4 py-2 rounded-lg">
          {/* Hull Integrity */}
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-mono-tech">Gövde Dayanımı</div>
              <div className="text-xs font-orbitron font-bold text-emerald-300">
                {telemetry.hullIntegrity}%
              </div>
            </div>
          </div>

          <div className="w-[1px] h-6 bg-cyan-500/20" />

          {/* Reactor Power */}
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-mono-tech">İyon Reaktör</div>
              <div className="text-xs font-orbitron font-bold text-amber-300">
                {telemetry.reactorOutputGW} GW
              </div>
            </div>
          </div>

          <div className="w-[1px] h-6 bg-cyan-500/20" />

          {/* Warp Status */}
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-mono-tech">Warp Sürüşü</div>
              <div className="text-xs font-orbitron font-bold text-cyan-300">
                {telemetry.warpDriveState}
              </div>
            </div>
          </div>

          <div className="w-[1px] h-6 bg-cyan-500/20" />

          {/* Life Support */}
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-indigo-400" />
            <div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-mono-tech">Yaşam Desteği</div>
              <div className="text-xs font-orbitron font-bold text-indigo-300">
                %{telemetry.lifeSupportLevel}
              </div>
            </div>
          </div>
        </div>

        {/* Right Status & FPS */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Radar Scanner Mini Widget */}
          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg hud-glass border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute inset-1 rounded-full border border-cyan-400/30" />
            <div className="absolute inset-2.5 rounded-full border border-cyan-400/20" />
            <div className="absolute w-full h-[1px] bg-cyan-400/30" />
            <div className="absolute h-full w-[1px] bg-cyan-400/30" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-cyan-400/30 rounded-full animate-radar origin-center" />
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>

          {/* FPS Badge */}
          <div className="hud-glass px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 border border-cyan-500/30 text-xs font-mono-tech">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-300 font-bold">{telemetry.fps}</span>
            <span className="text-slate-400 text-[10px]">FPS</span>
          </div>
        </div>
      </header>

      {/* Center Reticle / Active Focus Indicator */}
      {selectedRoomTitle && (
        <div className="self-center mb-auto mt-6 hud-glass px-4 py-1.5 rounded-full border border-cyan-400/40 flex items-center gap-2 animate-pulse-subtle">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-orbitron tracking-wider text-cyan-200">
            ODAK: {selectedRoomTitle}
          </span>
        </div>
      )}
    </div>
  );
};
