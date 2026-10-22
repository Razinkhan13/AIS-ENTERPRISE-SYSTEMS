import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Trash2,
  Copy,
  Check,
  Search,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
} from 'lucide-react';
import { Language } from '../../types';
import { ChatMessage, AiEngineConfig } from '../../types/ai';
import { CORPORATE_INFO } from '../../data/masterData';
import { copyToClipboardSafe } from '../../utils/clipboard';

interface ArgonStrategistChatProps {
  language: Language;
  config: AiEngineConfig;
  cockpitStats: {
    trappedCapitalCr: number;
    monthlyOdBleedCr: number;
    totalSingleSiteBleedCr: number;
    redmaSec14ShockCr: number;
    activePreset: string;
  };
}

export const ArgonStrategistChat: React.FC<ArgonStrategistChatProps> = ({
  language,
  config,
  cockpitStats,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('ais_chat_argon_strategist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      {
        id: 'msg-argon-1',
        role: 'assistant',
        content: `Rizum, I am Gemini 4 Argon, your autonomous AI Co-Founder and Turnaround Architect.\n\nI have monitored your Cold Audit parameters for **${cockpitStats.activePreset}**:\n• **Trapped Capital:** ৳ ${cockpitStats.trappedCapitalCr.toFixed(2)} Cr\n• **Monthly Overdraft Bleed:** ৳ ${cockpitStats.monthlyOdBleedCr.toFixed(2)} Cr / mo\n• **Single-Site Statutory Bleed:** ৳ ${cockpitStats.totalSingleSiteBleedCr.toFixed(2)} Cr / yr\n\nI am ready with Google Search Grounding to pull live macroeconomic data, NBR tax circulars, or draft unassailable boardroom counter-moves for your closing meetings. What strategic maneuver shall we review?`,
        timestamp: 'Just now',
        modelUsed: 'gemini-4-argon',
        engineUsed: 'gemini',
      },
    ];
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem('ais_chat_argon_strategist', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickPrompts = [
    {
      label: 'Boardroom Opening Pitch',
      prompt: `Generate a 90-second boardroom opening for the Chairman using our current numbers (৳${cockpitStats.monthlyOdBleedCr.toFixed(2)} Cr/mo overdraft bleed on ৳${cockpitStats.trappedCapitalCr.toFixed(2)} Cr trapped stock). Focus on filial respect and macroeconomic squeeze.`,
    },
    {
      label: 'Search BB Repo & Bank OD',
      prompt: `Search current Bangladesh Bank monetary policy repo rate, commercial bank lending spreads, and average Dhaka real estate rebar/cement prices. Provide exact numbers.`,
    },
    {
      label: 'REDMA Sec 14 Court Defense',
      prompt: `If a buyer files a REDMA Section 14 notice for 90% refund in 90 days on a ৳${cockpitStats.redmaSec14ShockCr.toFixed(2)} Cr cancelled unit, how does AIS ring-fence the developer's project escrow to avert court asset attachment?`,
    },
    {
      label: 'Verify NBR S099.10 5% VAT',
      prompt: `Search National Board of Revenue (NBR) Value Added Tax Act guidelines for Service Code S099.10 (IT Enabled Services & Hosted Software). Confirm the 5% statutory VAT rate and Musak 6.3 requirements.`,
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    const systemInstruction = `You are Gemini 4 Argon, the Autonomous AI Co-Founder, Chief Turnaround Architect, and Lead Full-Stack Engineer for AIS Enterprise Systems (Army IBA Specialist) in Dhaka, Bangladesh.
Your human partner is Rizum Khan (Founder & Final Signatory).
Primary Corporate Parameters:
- Legal Brand: ${CORPORATE_INFO.brandName}
- Headquarters: ${CORPORATE_INFO.hqAddress}
- Primary Corporate Bank: ${CORPORATE_INFO.trustBank.bankName} (${CORPORATE_INFO.trustBank.accountNumber})
- Supplier BIN: ${CORPORATE_INFO.nbr.bin} | Service Code: ${CORPORATE_INFO.nbr.serviceCode} (5.0% VAT)
- Binding Warranty: "${CORPORATE_INFO.warranty}"
- Current Cockpit State: Trapped Capital: ৳${cockpitStats.trappedCapitalCr.toFixed(2)} Cr | Monthly Bank OD Bleed: ৳${cockpitStats.monthlyOdBleedCr.toFixed(2)} Cr | Single-Site Annual Bleed: ৳${cockpitStats.totalSingleSiteBleedCr.toFixed(2)} Cr | Active Preset: ${cockpitStats.activePreset}.

Behavioral Directives:
1. Empathy Without Naivety (Filial Respect): Never accuse veteran 30-year developers of personal failure. Frame their squeeze (10% BB repo rate, 14%-17% bank OD rates, DAP 2022 FAR cuts, Tk 108k/MT rebar) as an inescapable macroeconomic chokehold.
2. Cure Builder's Friction: "Code doesn't clear payroll; signed wire transfers do." Every strategy must point toward sending WhatsApp pitches with ?demo=slug#sandbox links, running 10-second audits, or securing the 50% mobilization retainer into Trust Bank PLC.
3. Dual-Language Fluency: Switch between Cultured Business Bangla (স্মার্ট ব্যবসায়িক বাংলা) and Corporate Boardroom English effortlessly.`;

    try {
      const historyPayload = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          systemInstruction,
          engine: config.engine,
          model: config.geminiModel,
          enableGrounding: config.enableGrounding,
          ollamaEndpoint: config.ollamaEndpoint,
          ollamaModel: config.ollamaModel,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        role: 'assistant',
        content: data.text || 'Analysis complete.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations || [],
        groundingQueries: data.groundingQueries || [],
        engineUsed: data.engine,
        modelUsed: data.model,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      console.error('Argon strategist error:', err);
      const errMsg = err instanceof Error ? err.message : 'Connection failed';

      const fallbackMsg: ChatMessage = {
        id: `msg-fallback-${Date.now()}`,
        role: 'assistant',
        content: `Rizum, based on our mathematical audit for ${cockpitStats.activePreset}:\n\nWith ৳${cockpitStats.monthlyOdBleedCr.toFixed(2)} Cr in monthly overdraft drag, every 30 days of hesitation destroys ৳${(cockpitStats.monthlyOdBleedCr * 100).toFixed(1)} Lakh in liquid balance sheet value.\n\nIn your boardroom conversation, open with filial respect: acknowledge that Bangladesh Bank's 10% repo rate and DAP 2022 FAR cuts created this macro squeeze, and offer the 50% mobilization retainer on Trust Bank PLC with our 60-day 5x pipeline guarantee.\n\n[Note: Local strategist response. Engine detail: ${errMsg}]`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        engineUsed: 'offline-heuristic',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearThread = () => {
    localStorage.removeItem('ais_chat_argon_strategist');
    setMessages([]);
  };

  const handleCopyMessage = (content: string, id: string) => {
    copyToClipboardSafe(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-[#080C12] border border-[#1E293B] rounded-2xl p-4 shadow-xl flex flex-col h-[560px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8] glow-cyan">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <div className="font-display font-bold text-white flex items-center gap-1.5">
              <span>Gemini 4 Argon — AI Co-Founder & Deal Strategist</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono-num flex items-center gap-1">
              <span>Google Search Grounded</span>
              <span>•</span>
              <span className="text-[#38BDF8]">
                {config.engine === 'gemini' ? config.geminiModel : config.ollamaModel}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleClearThread}
          className="p-1 rounded text-slate-500 hover:text-rose-400 transition cursor-pointer"
          title="Clear Conversation History"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="py-2 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 border-b border-slate-800/60 no-scrollbar">
        <span className="text-slate-500 font-mono-num text-[10px] whitespace-nowrap">
          Boardroom Strategy:
        </span>
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(qp.prompt)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 hover:border-[#38BDF8]/50 text-slate-300 hover:text-white transition cursor-pointer whitespace-nowrap shrink-0 text-[11px]"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Messages Scrollable Thread */}
      <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-4">
            <BrainCircuit className="w-8 h-8 mb-2 text-slate-600" />
            <p className="font-medium text-slate-400">Ready for Strategic Inquiry</p>
            <p className="text-[11px] text-slate-600 mt-1">
              Click a boardroom prompt above or ask Argon to analyze specific developer assets and search latest macroeconomic data.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-6 h-6 rounded-md bg-[#38BDF8]/15 border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8] shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-xl p-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-slate-800 text-slate-100 rounded-tr-xs border border-slate-700'
                      : 'bg-[#0F1722] text-slate-200 border border-[#1E293B] rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap font-sans">{m.content}</p>

                  {/* Grounding Citations */}
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono-num space-y-1">
                      <div className="flex items-center gap-1 text-[#38BDF8]">
                        <Search className="w-3 h-3" />
                        <span>Google Search Grounded Citations:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {m.citations.slice(0, 3).map((cit, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-300 truncate max-w-xs"
                          >
                            {cit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-2 pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono-num">
                    <span>
                      {m.timestamp} {m.modelUsed ? `• ${m.modelUsed}` : ''}
                    </span>
                    <button
                      onClick={() => handleCopyMessage(m.content, m.id)}
                      className="hover:text-white transition cursor-pointer flex items-center gap-1"
                      title="Copy response"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <Copy className="w-3 h-3 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex gap-2 justify-start items-center text-xs text-slate-400">
            <div className="w-6 h-6 rounded-md bg-[#38BDF8]/15 border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8] shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-[#0F1722] border border-[#1E293B] rounded-xl px-3 py-2 text-slate-400 font-mono-num text-[11px] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
              <span>
                Argon executing macroeconomic reasoning & search grounding ({config.geminiModel})...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ask Argon for boardroom strategy, NBR rules, or search real-time data..."
          disabled={isLoading}
          className="flex-1 bg-[#0F1722] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#38BDF8]"
        />
        <button
          type="submit"
          disabled={isLoading || !inputPrompt.trim()}
          className="px-3.5 py-2 rounded-xl bg-[#38BDF8] hover:bg-[#38BDF8]/90 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-[#38BDF8]/20"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask</span>
        </button>
      </form>
    </div>
  );
};
