import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Trash2,
  Copy,
  Check,
  Globe,
  Clock,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { Language, VerifiedTarget } from '../../types';
import { ChatMessage, AiEngineConfig } from '../../types/ai';
import { copyToClipboardSafe } from '../../utils/clipboard';

interface NrbSimulatorChatProps {
  language: Language;
  activeClient: VerifiedTarget;
  config: AiEngineConfig;
}

export const NrbSimulatorChat: React.FC<NrbSimulatorChatProps> = ({
  language,
  activeClient,
  config,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(`ais_chat_nrb_${activeClient.slug}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      {
        id: 'msg-init-1',
        role: 'user',
        content: `Hi, I am calling from New York (Queens). I saw your listing for ${activeClient.flagshipProject}. How does the 30% booking deposit work and is my foreign currency 100% repatriable if construction stalls?`,
        timestamp: '02:14 AM BD Time',
      },
      {
        id: 'msg-init-2',
        role: 'assistant',
        content: `Assalamu Alaikum Sir. Thank you for connecting with ${activeClient.name} Concierge Desk.\n\n1. **Foreign Repatriation (NRTA Account):** Under Bangladesh Bank Foreign Exchange Regulation Act and circular guidelines, your funds enter through an authorized dealer Non-Resident Taka Account (NRTA). If a project is cancelled, the principal plus accrued central bank interest is 100% repatriable in USD back to your US bank without requiring separate central bank approval.\n\n2. **30% Down Payment Math:** For ${activeClient.flagshipProject} (${activeClient.bdtPrice} ≈ $410,000 USD), the initial booking requires 30% ($123,000 USD). The remaining 70% is disbursed in construction-linked milestones over 36 months ($7,914/month).\n\n3. **48-Hour Priority Hold:** We can lock Unit 14-B for 48 hours in our Trust Bank PLC digital escrow register. Would you like me to dispatch the verified architectural floorplan and NRTA deed draft?`,
        timestamp: '02:14 AM BD Time (38s SLA)',
        modelUsed: 'gemini-3.8-flash',
        engineUsed: 'gemini',
      },
    ];
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem(`ais_chat_nrb_${activeClient.slug}`, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeClient.slug]);

  const quickObjections = [
    {
      label: 'DAP 2022 FAR Risk',
      prompt: `Did RAJUK's DAP 2022 floor area ratio cuts affect the approval on ${activeClient.flagshipProject}? Are the upper floors approved with Occupancy Certificate?`,
    },
    {
      label: 'Trust Bank Escrow Security',
      prompt: `Why should I pay into Trust Bank PLC Escrow rather than the developer's standard account? What legal protection do I have?`,
    },
    {
      label: 'GBP Barclays Wire',
      prompt: `I earn in GBP in London. Can I disburse directly in British Pounds at mid-market spot rates, and how does Saf-Kabala deed registration work for overseas citizens?`,
    },
    {
      label: 'REDMA Delay Compensation',
      prompt: `What happens if handover is delayed past the agreed date? Does REDMA Section 15 15% annual compensation apply?`,
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

    const systemInstruction = `You are the autonomous 24/7 NRB Luxury Real Estate Concierge for AIS Enterprise Systems representing the developer "${activeClient.name}" in Dhaka, Bangladesh.
The active asset is "${activeClient.flagshipProject}" priced at "${activeClient.bdtPrice}" (${activeClient.unitSpec}).
The prospect is an overseas Non-Resident Bangladeshi (NRB) diaspora professional living in the US, UK, or Gulf.
Answer with cultured, respectful business etiquette.
Key parameters you enforce:
- Sub-4 minute inquiry response speed (38-second target SLA).
- Accurate currency conversion (USD/GBP/AED).
- Bangladesh Bank Foreign Exchange Guidelines: 100% legal repatriation via Non-Resident Taka Account (NRTA).
- Milestone escrow deposit via Trust Bank PLC (Account No: 00110466000494).
- 48-hour priority unit reservation.
- Dual-language capability: Respond in refined English or cultured Business Bangla (স্মার্ট ব্যবসায়িক বাংলা) based on the user's language. Keep answers concise, factual, and reassuring.`;

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
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        role: 'assistant',
        content: data.text || 'Thank you for your inquiry. A concierge representative will review your file.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations || [],
        groundingQueries: data.groundingQueries || [],
        engineUsed: data.engine,
        modelUsed: data.model,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      console.error('NRB chat simulation error:', err);
      const errMsg = err instanceof Error ? err.message : 'Connection failed';

      // Fallback friendly mock response if backend is completely offline
      const fallbackMsg: ChatMessage = {
        id: `msg-fallback-${Date.now()}`,
        role: 'assistant',
        content: `Assalamu Alaikum. Thank you for your question regarding ${activeClient.flagshipProject}.\n\nUnder our standard Trust Bank PLC digital escrow protocol, all overseas wire transfers are ring-fenced specifically for project execution. Handover timelines are protected under REDMA 2010 Section 15 with statutory interest protections.\n\n[Note: Local response generated. Engine error: ${errMsg}]`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        engineUsed: 'offline-heuristic',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearThread = () => {
    localStorage.removeItem(`ais_chat_nrb_${activeClient.slug}`);
    setMessages([]);
  };

  const handleCopyMessage = (content: string, id: string) => {
    copyToClipboardSafe(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-[#080C12] border border-[#1E293B] rounded-2xl p-4 shadow-xl flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="font-display font-bold text-white flex items-center gap-1.5">
              <span>NRB Diaspora Negotiation Simulator</span>
              <span className="text-[10px] font-mono-num text-slate-400">
                ({activeClient.name})
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono-num">
              Active Model: {config.engine === 'gemini' ? config.geminiModel : config.ollamaModel}
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

      {/* Quick Objection Prompts Bar */}
      <div className="py-2 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 border-b border-slate-800/60 no-scrollbar">
        <span className="text-slate-500 font-mono-num text-[10px] whitespace-nowrap">
          Test Objection:
        </span>
        {quickObjections.map((obj, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(obj.prompt)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 hover:border-[#38BDF8]/50 text-slate-300 hover:text-white transition cursor-pointer whitespace-nowrap shrink-0 text-[11px]"
          >
            {obj.label}
          </button>
        ))}
      </div>

      {/* Messages Scrollable Thread */}
      <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-4">
            <Bot className="w-8 h-8 mb-2 text-slate-600" />
            <p className="font-medium text-slate-400">No messages in thread.</p>
            <p className="text-[11px] text-slate-600 mt-1">
              Select an objection chip above or type a question to test live negotiation responses.
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
                  <div className="w-6 h-6 rounded-md bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#005c4b] text-slate-100 rounded-tr-xs'
                      : 'bg-[#0F1722] text-slate-200 border border-[#1E293B] rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap font-sans">{m.content}</p>

                  <div className="mt-2 pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono-num">
                    <span>{m.timestamp}</span>
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

                {isUser && (
                  <div className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex gap-2 justify-start items-center text-xs text-slate-400">
            <div className="w-6 h-6 rounded-md bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Bot className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-[#0F1722] border border-[#1E293B] rounded-xl px-3 py-2 text-slate-400 font-mono-num text-[11px] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
              <span>Synthesizing response ({config.engine === 'gemini' ? config.geminiModel : config.ollamaModel})...</span>
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
          placeholder={`Ask NRB inquiry or test objection for ${activeClient.name}...`}
          disabled={isLoading}
          className="flex-1 bg-[#0F1722] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#38BDF8]"
        />
        <button
          type="submit"
          disabled={isLoading || !inputPrompt.trim()}
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-950"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};
