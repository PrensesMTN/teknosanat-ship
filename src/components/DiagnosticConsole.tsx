import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface DiagnosticConsoleProps {
  logs: string[];
}

export const DiagnosticConsole: React.FC<DiagnosticConsoleProps> = ({ logs }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="pointer-events-auto flex flex-col items-start">
      {isOpen && (
        <div className="mb-2 w-80 sm:w-96 max-h-48 overflow-y-auto hud-glass rounded-xl p-3 border border-cyan-500/30 text-xs font-mono-tech shadow-xl">
          <div className="flex items-center justify-between text-cyan-400 font-bold border-b border-cyan-500/20 pb-1.5 mb-2">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              SİSTEM KONSOLU & EVENT STREAM
            </span>
            <span className="text-[10px] text-slate-400">CANLI</span>
          </div>
          <div className="space-y-1 text-slate-300">
            {logs.slice(-8).map((log, index) => (
              <div key={index} className="leading-tight flex items-start gap-1">
                <span className="text-cyan-400 select-none">&gt;</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        id="toggle-console-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hud-glass border border-cyan-500/30 text-xs font-mono-tech text-cyan-300 hover:text-cyan-100 hover:border-cyan-400 transition-all cursor-pointer"
      >
        <Terminal className="w-3.5 h-3.5" />
        <span>KONSOL LOGLARI ({logs.length})</span>
        {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
      </button>
    </div>
  );
};
