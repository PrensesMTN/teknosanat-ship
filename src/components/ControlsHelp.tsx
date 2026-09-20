import React, { useState } from 'react';
import { HelpCircle, MousePointer, Move, ZoomIn, Eye } from 'lucide-react';

export const ControlsHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="pointer-events-auto relative">
      <button
        id="help-guide-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="3D Kontroller ve Kullanım Rehberi"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hud-glass border border-cyan-500/30 text-xs font-mono-tech text-cyan-300 hover:text-white transition-colors cursor-pointer"
      >
        <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden sm:inline">KONTROLLER</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-72 p-3.5 hud-glass rounded-xl border border-cyan-400/40 text-xs font-mono-tech space-y-2.5 shadow-2xl z-50">
          <div className="flex items-center justify-between font-orbitron font-bold text-cyan-300 pb-1.5 border-b border-cyan-500/20">
            <span>3D ETKİLEŞİM REHBERİ</span>
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-slate-300">
            <div className="flex items-center gap-2">
              <MousePointer className="w-4 h-4 text-cyan-400 shrink-0" />
              <span><strong>Sol Tık + Sürükle:</strong> 3D Yörüngede Serbest Dönüş</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400 shrink-0" />
              <span><strong>Odaya / İşarete Tıkla:</strong> Odaya Uç ve Detayları Aç</span>
            </div>
            <div className="flex items-center gap-2">
              <Move className="w-4 h-4 text-cyan-400 shrink-0" />
              <span><strong>Sağ Tık + Sürükle:</strong> Kamerayı Kaydır (Pan)</span>
            </div>
            <div className="flex items-center gap-2">
              <ZoomIn className="w-4 h-4 text-cyan-400 shrink-0" />
              <span><strong>Fare Tekerleği:</strong> Yakınlaş / Uzaklaş (Zoom)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
