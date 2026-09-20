import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Wind, 
  Thermometer, 
  Users, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Unlock,
  Radio
} from 'lucide-react';
import { RoomData } from '../types';
import { ROOMS_DATA } from '../config/roomsData';
import { audioEngine } from '../utils/AudioEngine';

interface InfoCardProps {
  room: RoomData;
  onClose: () => void;
  onSelectConnectedRoom: (roomId: string) => void;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  room,
  onClose,
  onSelectConnectedRoom
}) => {
  const [powerAdjustment, setPowerAdjustment] = useState<number>(room.powerDrawMW);
  const [isLockedDown, setIsLockedDown] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'subsystems' | 'crew' | 'logs'>('overview');

  const toggleLockdown = () => {
    audioEngine.playModeSwitch();
    setIsLockedDown(!isLockedDown);
  };

  const handleDoorJump = (id: string) => {
    audioEngine.playSelect();
    onSelectConnectedRoom(id);
  };

  return (
    <aside 
      id={`info-card-${room.id}`}
      className="pointer-events-auto w-full sm:w-[420px] max-h-[85vh] sm:max-h-[88vh] flex flex-col hud-glass rounded-2xl overflow-hidden border border-cyan-400/40 shadow-2xl hud-corner-brackets"
      style={{
        boxShadow: `0 12px 40px 0 rgba(0,0,0,0.8), 0 0 20px ${room.color}25`
      }}
    >
      {/* Header Bar */}
      <div 
        className="p-4 sm:p-5 border-b border-cyan-500/20 relative"
        style={{
          background: `linear-gradient(135deg, ${room.color}15 0%, rgba(8,16,32,0.8) 100%)`
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="w-2.5 h-2.5 rounded-full animate-ping"
                style={{ backgroundColor: room.color }}
              />
              <span className="text-[10px] font-mono-tech uppercase tracking-widest text-cyan-300">
                {room.deckName}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono-tech bg-slate-800 text-slate-300 border border-slate-700">
                {room.securityClearance}
              </span>
            </div>
            <h2 className="font-orbitron font-bold text-lg sm:text-xl text-white tracking-wide">
              {room.title}
            </h2>
            <p className="text-xs text-slate-300 font-mono-tech mt-0.5">
              {room.subtitle}
            </p>
          </div>

          <button
            id="close-infocard-btn"
            type="button"
            onClick={() => {
              audioEngine.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vital Quick Numbers */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-cyan-500/15">
          <div className="bg-slate-900/50 p-2 rounded-lg border border-cyan-500/20">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono-tech">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>GÜÇ ÇEKİMİ</span>
            </div>
            <div className="text-sm font-orbitron font-semibold text-amber-300 mt-0.5">
              {powerAdjustment.toFixed(1)} MW
            </div>
          </div>

          <div className="bg-slate-900/50 p-2 rounded-lg border border-cyan-500/20">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono-tech">
              <Wind className="w-3 h-3 text-cyan-400" />
              <span>OKSİJEN</span>
            </div>
            <div className="text-sm font-orbitron font-semibold text-cyan-300 mt-0.5">
              %{room.oxygenLevel}
            </div>
          </div>

          <div className="bg-slate-900/50 p-2 rounded-lg border border-cyan-500/20">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono-tech">
              <Thermometer className="w-3 h-3 text-emerald-400" />
              <span>SICAKLIK</span>
            </div>
            <div className="text-sm font-orbitron font-semibold text-emerald-300 mt-0.5">
              {room.temperatureC} °C
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-cyan-500/20 px-3 bg-slate-950/40">
        <button
          id="tab-overview"
          type="button"
          onClick={() => { audioEngine.playHover(); setActiveTab('overview'); }}
          className={`py-2 px-3 text-xs font-mono-tech border-b-2 cursor-pointer transition-all ${
            activeTab === 'overview'
              ? 'border-cyan-400 text-cyan-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          GENEL BAKIŞ
        </button>

        <button
          id="tab-subsystems"
          type="button"
          onClick={() => { audioEngine.playHover(); setActiveTab('subsystems'); }}
          className={`py-2 px-3 text-xs font-mono-tech border-b-2 cursor-pointer transition-all ${
            activeTab === 'subsystems'
              ? 'border-cyan-400 text-cyan-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          ALT SİSTEMLER ({room.subsystems.length})
        </button>

        <button
          id="tab-crew"
          type="button"
          onClick={() => { audioEngine.playHover(); setActiveTab('crew'); }}
          className={`py-2 px-3 text-xs font-mono-tech border-b-2 cursor-pointer transition-all ${
            activeTab === 'crew'
              ? 'border-cyan-400 text-cyan-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          PERSONEL ({room.crewCount})
        </button>

        <button
          id="tab-logs"
          type="button"
          onClick={() => { audioEngine.playHover(); setActiveTab('logs'); }}
          className={`py-2 px-3 text-xs font-mono-tech border-b-2 cursor-pointer transition-all ${
            activeTab === 'logs'
              ? 'border-cyan-400 text-cyan-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          LOGLAR
        </button>
      </div>

      {/* Tab Contents - Scrollable */}
      <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-sm">
        {activeTab === 'overview' && (
          <>
            <div>
              <h3 className="text-xs uppercase font-mono-tech text-cyan-400 mb-1 flex items-center gap-1.5">
                <Radio className="w-3 h-3" />
                MODÜL TANIMI
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {room.description}
              </p>
            </div>

            {/* Connected Corridors / Doors */}
            <div>
              <h3 className="text-xs uppercase font-mono-tech text-cyan-400 mb-2 flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3" />
                BAĞLANTILI KORİDORLAR & GEÇİŞLER
              </h3>
              <div className="flex flex-wrap gap-2">
                {room.doors.map((doorId) => {
                  const targetRoom = ROOMS_DATA[doorId];
                  if (!targetRoom) return null;
                  return (
                    <button
                      id={`door-link-${doorId}`}
                      key={doorId}
                      type="button"
                      onClick={() => handleDoorJump(doorId)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/40 text-xs font-mono-tech text-cyan-200 transition-all cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: targetRoom.color }} />
                      <span>{targetRoom.title}</span>
                      <ArrowRight className="w-3 h-3 text-cyan-400" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Power Shunt Controller */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/20 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono-tech">
                <span className="text-slate-300">ENERJİ DAĞITIM KALİBRASYONU</span>
                <span className="text-amber-400 font-bold">{powerAdjustment.toFixed(1)} MW</span>
              </div>
              <input
                id="power-slider"
                type="range"
                min={Math.max(5, room.powerDrawMW * 0.5)}
                max={room.powerDrawMW * 1.8}
                step={0.5}
                value={powerAdjustment}
                onChange={(e) => {
                  setPowerAdjustment(parseFloat(e.target.value));
                  audioEngine.playHover();
                }}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono-tech">
                <span>Eko-Mod</span>
                <span>Varsayılan: {room.powerDrawMW} MW</span>
                <span>Aşırı Yük (+80%)</span>
              </div>
            </div>

            {/* Security Lockdown Control */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-cyan-500/20">
              <div className="flex items-center gap-2.5">
                {isLockedDown ? (
                  <Lock className="w-4 h-4 text-red-400" />
                ) : (
                  <Unlock className="w-4 h-4 text-emerald-400" />
                )}
                <div>
                  <div className="text-xs font-mono-tech text-slate-200">
                    GÜVENLİK KİLİDİ (LOCKDOWN)
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono-tech">
                    {isLockedDown ? 'Oda manyetik basınçla mühürlendi' : 'Geçişler ve hava kilitleri açık'}
                  </div>
                </div>
              </div>

              <button
                id="lockdown-toggle-btn"
                type="button"
                onClick={toggleLockdown}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold transition-all cursor-pointer ${
                  isLockedDown
                    ? 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {isLockedDown ? 'MÜHÜRLÜ' : 'NORMAL'}
              </button>
            </div>
          </>
        )}

        {activeTab === 'subsystems' && (
          <div className="space-y-3">
            {room.subsystems.map((sub, idx) => (
              <div 
                key={idx} 
                className="p-3 rounded-lg bg-slate-900/60 border border-cyan-500/15 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-mono-tech">
                  <span className="text-slate-200 font-medium">{sub.name}</span>
                  <div className="flex items-center gap-1.5">
                    {sub.status === 'optimal' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {sub.status === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                    {sub.status === 'active' && <Zap className="w-3.5 h-3.5 text-cyan-400" />}
                    <span className="text-cyan-300 font-semibold">{sub.efficiency}%</span>
                  </div>
                </div>
                {/* Health Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      sub.efficiency > 90 ? 'bg-cyan-400' : sub.efficiency > 75 ? 'bg-amber-400' : 'bg-red-500'
                    }`}
                    style={{ width: `${sub.efficiency}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'crew' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400 pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                Kapasite: {room.crewCount} / {room.maxCrew} Kişi
              </span>
              <span className="text-emerald-400">Tüm Biyo-İşaretler Normal</span>
            </div>

            {room.personnel.map((person, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/50 border border-cyan-500/15"
              >
                <div>
                  <div className="text-xs font-bold text-slate-200 font-orbitron">{person.name}</div>
                  <div className="text-[11px] text-cyan-400 font-mono-tech">{person.role}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-mono-tech">
                  {person.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-2 font-mono-tech text-xs bg-slate-950/80 p-3 rounded-xl border border-cyan-500/20 text-slate-300">
            {room.telemetryLogs.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                <span className="text-cyan-400 font-semibold">{log.slice(0, 10)}</span>
                <span className="text-slate-300">{log.slice(10)}</span>
              </div>
            ))}
            <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
              [CANLI BAĞLANTI: TELEMETRİ KORUMALI VERİ YOLU AKTİF]
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-950/70 border-t border-cyan-500/20 flex items-center justify-between text-[11px] font-mono-tech text-slate-400">
        <span>KOORDİNAT: ({room.position.x}, {room.position.y}, {room.position.z})</span>
        <button
          id="close-card-footer-btn"
          type="button"
          onClick={() => {
            audioEngine.playClick();
            onClose();
          }}
          className="text-cyan-400 hover:text-cyan-200 underline cursor-pointer"
        >
          Genel Görünüme Dön
        </button>
      </div>
    </aside>
  );
};
