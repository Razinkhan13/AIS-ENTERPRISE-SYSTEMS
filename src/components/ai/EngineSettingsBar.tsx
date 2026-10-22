import React, { useState, useEffect } from 'react';
import { Cpu, Search, Server, Check, AlertCircle, RefreshCw, ChevronDown } from 'lucide-react';
import { AiEngineConfig, AiEngineType } from '../../types/ai';

interface EngineSettingsBarProps {
  config: AiEngineConfig;
  onChange: (newConfig: AiEngineConfig) => void;
}

export const EngineSettingsBar: React.FC<EngineSettingsBarProps> = ({ config, onChange }) => {
  const [ollamaStatus, setOllamaStatus] = useState<{
    online: boolean;
    models: string[];
    error?: string;
  }>({ online: false, models: [] });
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const checkOllama = async () => {
    setIsChecking(true);
    try {
      const res = await fetch('/api/ai/ollama-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: config.ollamaEndpoint }),
      });
      const data = await res.json();
      setOllamaStatus({
        online: data.online,
        models: data.models || [],
        error: data.error,
      });
    } catch (e) {
      setOllamaStatus({ online: false, models: [], error: 'Failed to reach API' });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (config.engine === 'ollama') {
      checkOllama();
    }
  }, [config.engine, config.ollamaEndpoint]);

  return (
    <div className="bg-[#080C12] border border-[#1E293B] rounded-xl px-3 py-2 flex flex-wrap items-center justify-between gap-2.5 text-xs">
      {/* Engine Segmented Selector */}
      <div className="flex items-center gap-2">
        <span className="text-slate-400 font-mono-num text-[11px] flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Active Engine:</span>
        </span>
        <div className="flex items-center bg-[#0F1722] border border-[#1E293B] rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => onChange({ ...config, engine: 'gemini' })}
            className={`px-2.5 py-1 rounded text-xs transition cursor-pointer font-medium ${
              config.engine === 'gemini'
                ? 'bg-[#38BDF8] text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Google Gemini Cloud
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...config, engine: 'ollama' })}
            className={`px-2.5 py-1 rounded text-xs transition cursor-pointer font-medium flex items-center gap-1 ${
              config.engine === 'ollama'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Ollama / LocalAI</span>
            <span className="text-[10px] font-mono-num px-1 py-0.2 rounded bg-emerald-950 text-emerald-200">
              FREE
            </span>
          </button>
        </div>
      </div>

      {/* Engine-Specific Controls */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {config.engine === 'gemini' ? (
          <>
            {/* Model Selector */}
            <div className="flex items-center gap-1">
              <span className="text-slate-500 text-[11px]">Model:</span>
              <select
                value={config.geminiModel}
                onChange={(e) =>
                  onChange({ ...config, geminiModel: e.target.value as any })
                }
                className="bg-[#0F1722] border border-[#1E293B] text-slate-200 font-mono-num text-[11px] rounded px-2 py-0.5 focus:outline-none focus:border-[#38BDF8] cursor-pointer"
              >
                <option value="gemini-3.8-flash">gemini-3.8-flash (Balanced + Search)</option>
                <option value="gemini-4-argon">gemini-4-argon (Complex Reasoning)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Fast)</option>
              </select>
            </div>

            {/* Google Search Grounding Switch */}
            <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={config.enableGrounding}
                onChange={(e) => onChange({ ...config, enableGrounding: e.target.checked })}
                className="accent-[#38BDF8] cursor-pointer rounded"
              />
              <Search className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Google Search Grounding</span>
            </label>
          </>
        ) : (
          <>
            {/* Ollama Endpoint & Model Config */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[11px]">Host:</span>
              <input
                type="text"
                value={config.ollamaEndpoint}
                onChange={(e) => onChange({ ...config, ollamaEndpoint: e.target.value })}
                className="bg-[#0F1722] border border-[#1E293B] text-slate-200 font-mono-num text-[11px] rounded px-2 py-0.5 w-36 focus:outline-none focus:border-emerald-500"
                placeholder="http://localhost:11434"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[11px]">Model:</span>
              <input
                type="text"
                value={config.ollamaModel}
                onChange={(e) => onChange({ ...config, ollamaModel: e.target.value })}
                className="bg-[#0F1722] border border-[#1E293B] text-slate-200 font-mono-num text-[11px] rounded px-2 py-0.5 w-24 focus:outline-none focus:border-emerald-500"
                placeholder="llama3.2"
              />
            </div>

            {/* Status Ping */}
            <div className="flex items-center gap-1 text-[10px] font-mono-num">
              <button
                type="button"
                onClick={checkOllama}
                disabled={isChecking}
                className="p-1 rounded bg-[#0F1722] border border-[#1E293B] text-slate-400 hover:text-white cursor-pointer"
                title="Ping local Ollama instance"
              >
                <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin text-[#38BDF8]' : ''}`} />
              </button>
              <span
                className={`px-1.5 py-0.5 rounded ${
                  ollamaStatus.online
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                }`}
              >
                {ollamaStatus.online ? 'OLLAMA READY' : 'OFFLINE / FALLBACK'}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
