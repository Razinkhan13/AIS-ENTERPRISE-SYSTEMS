import React, { useState } from 'react';
import {
  MessageSquare,
  Copy,
  ExternalLink,
  Check,
  Send,
  Sparkles,
  PhoneCall,
  Clock,
  DollarSign,
  Building2,
  ChevronRight,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { Language, TargetCategory, VerifiedTarget } from '../../types';
import { VERIFIED_TARGETS, BOARDROOM_SCRIPTS, CORPORATE_INFO } from '../../data/masterData';
import { copyToClipboardSafe } from '../../utils/clipboard';
import { AiEngineConfig } from '../../types/ai';
import { EngineSettingsBar } from '../ai/EngineSettingsBar';
import { NrbSimulatorChat } from '../ai/NrbSimulatorChat';
import { WhatsAppAutoDialer } from '../WhatsAppAutoDialer';
import { playDialerChime } from '../../utils/audio';

interface TabWhatsAppProps {
  language: Language;
  onNavigateToSandbox: (slug: string) => void;
  onTestLockedClientView: (slug: string) => void;
  aiConfig: AiEngineConfig;
  onAiConfigChange: (config: AiEngineConfig) => void;
}

export const TabWhatsApp: React.FC<TabWhatsAppProps> = ({
  language,
  onNavigateToSandbox,
  onTestLockedClientView,
  aiConfig,
  onAiConfigChange,
}) => {
  const [activeChatMode, setActiveChatMode] = useState<'interactive' | 'static'>('interactive');
  const [baseUrl, setBaseUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'https://ais-enterprise.netlify.app';
  });

  const [selectedSlug, setSelectedSlug] = useState('sheltech');
  const [currency, setCurrency] = useState<'USD' | 'GBP' | 'AED'>('USD');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<TargetCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected client for live concierge prototype
  const activeClient = VERIFIED_TARGETS.find((t) => t.slug === selectedSlug) || VERIFIED_TARGETS[0];
  const [selectedDialerTarget, setSelectedDialerTarget] = useState<VerifiedTarget>(activeClient);

  // Currency rate simulator calculations
  const rates = {
    USD: { rate: 120, symbol: '$', city: 'New York (2:14 AM BD Time)' },
    GBP: { rate: 155, symbol: '£', city: 'London (1:40 AM BD Time)' },
    AED: { rate: 33, symbol: 'AED', city: 'Dubai (11:50 PM BD Time)' },
  };

  const getBdtNumber = (priceStr: string) => {
    // E.g. "৳ 4.85 Cr" -> 4.85 * 10000000 = 48500000
    const match = priceStr.match(/([\d.]+)\s*Cr/);
    if (match) return parseFloat(match[1]) * 10000000;
    return 48500000;
  };

  const currentPriceBDT = getBdtNumber(activeClient.bdtPrice);
  const priceForeign = Math.round(currentPriceBDT / rates[currency].rate);
  const booking30PctForeign = Math.round(priceForeign * 0.3);
  const emi36MonthsForeign = Math.round((priceForeign * 0.7) / 36);

  const demoLink = `${baseUrl}/?demo=${activeClient.slug}`;

  const copyWithFeedback = (text: string, key: string) => {
    const success = copyToClipboardSafe(text);
    if (success) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  // Generate customized WhatsApp pitch message
  const getWhatsAppPitch = (target: VerifiedTarget) => {
    const targetLink = `${baseUrl}/?demo=${target.slug}`;
    if (language === 'bn') {
      return `আসসালামু আলাইকুম ${target.name} টিম,

আমি এআইএস এন্টারপ্রাইজ সিস্টেমস থেকে রিজুম খান। আপনাদের ফ্ল্যাগশিপ প্রকল্প "${target.flagshipProject}"-এর অবিক্রিত লাক্সারি ইনভেন্টরি ও ১৪% ব্যাংক ওভারড্রাফট ড্র্যাগ নিয়ে আমরা একটি ১০ সেকেন্ডের এক্সিকিউটিভ লিকুইডিটি অডিট প্রস্তুত করেছি।

আমেরিকা, লন্ডন ও গালফ প্রবাসীদের ২৪/৭ ইনকোয়ারিতে ৩৮ সেকেন্ডে অটোমেটিক রেসপন্স দিয়ে কীভাবে আটকে থাকা মূলধন দ্রুত ছাড় করানো যায়—তা দেখতে আপনাদের ডেডিকেটেড লাইভ স্যান্ডবক্স ডেমো ভিজিট করুন:
${targetLink}

বোর্ডরুম ডায়াগনস্টিক বৈঠকের জন্য আমি সরাসরি চেয়ারম্যান স্যারের সময় প্রত্যাশা করছি।
ধন্যবাদান্তে,
রিজুম খান (ফাউন্ডার ও ফাইনাল সিগনেটরি)
AIS Enterprise Systems (Army IBA Specialist)
বিন: 004982103-0101 | ট্রাস্ট ব্যাংক পিএলসি`;
    }

    return `Dear ${target.name} Board of Directors & Chairman,

This is Rizum Khan from AIS Enterprise Systems (Army IBA Specialist). We have conducted an executive liquidity diagnosis on "${target.flagshipProject}" regarding the 14% commercial bank overdraft drag and unabsorbed luxury stock.

We have provisioned an autonomous 24/7 NRI/NRB Turnaround Cockpit that cuts inquiry response time to 38 seconds across US/UK/Gulf time zones. Explore your custom live interactive sandbox here:
${targetLink}

Commercial Covenant: If AIS does not cut your response time to sub-4 minutes and qualify at least 5x our fee in verified buyer pipeline within 60 days, we refund 100% of our fee and you retain all installed systems.

Respectfully,
Rizum Khan (Founder & Final Signatory)
AIS Enterprise Systems (BIN: 004982103-0101)
Headquarters: 15 Mayakanon, Khilgaon, Dhaka-1214`;
  };

  // Filter targets
  const filteredTargets = VERIFIED_TARGETS.filter((t) => {
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.flagshipProject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Top Client-Branded Experiential Demo Link Generator Bar */}
      <section className="bg-[#0F1722] border border-[#1E293B] rounded-2xl p-4 sm:p-5 shadow-xl glow-cyan">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-base">
                Client-Branded Experiential Demo Link Generator
              </h2>
              <p className="text-xs text-slate-400">
                Auto-generates live <code className="text-[#38BDF8] font-mono-num">?demo=slug#sandbox</code> deep links with zero friction
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Target Base Host:</span>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="bg-[#080C12] border border-[#1E293B] rounded px-2.5 py-1 text-slate-200 font-mono-num text-xs w-56 sm:w-72 focus:outline-none focus:border-[#38BDF8]"
              placeholder="https://your-site.netlify.app"
            />
          </div>
        </div>

        {/* Dynamic Link Bar & Actions */}
        <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 bg-[#080C12] border border-[#1E293B] rounded-xl px-3 py-2 text-xs font-mono-num text-[#38BDF8] truncate flex items-center gap-2">
            <span className="text-slate-500 font-sans">Embedded URL:</span>
            <span className="truncate">{demoLink}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => copyWithFeedback(demoLink, 'top-demo-link')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'top-demo-link' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy Demo Link</span>
                </>
              )}
            </button>
            <button
              onClick={() => onTestLockedClientView(activeClient.slug)}
              className="px-4 py-2 rounded-xl bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-[#38BDF8]/20"
              title="Test the exact isolated screen the client will see"
            >
              <ExternalLink className="w-4 h-4" />
              <span>👁️ Test Locked Client View</span>
            </button>
          </div>
        </div>
      </section>

      {/* WhatsApp Auto-Dialer & Deep Link Engine */}
      <div id="whatsapp-autodialer-section">
        <WhatsAppAutoDialer
          language={language}
          baseUrl={baseUrl}
          selectedTarget={selectedDialerTarget}
          onSelectTarget={(target) => {
            setSelectedDialerTarget(target);
            setSelectedSlug(target.slug);
          }}
          onTestLockedClientView={onTestLockedClientView}
        />
      </div>

      {/* Engine Settings Bar */}
      <EngineSettingsBar config={aiConfig} onChange={onAiConfigChange} />

      {/* Main Grid: Live NRB Prototype vs Boardroom Scripts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Live Branded NRB WhatsApp Concierge Prototype & AI Simulator */}
        <div className="lg:col-span-7 bg-[#0F1722] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1E293B]">
            <div className="flex items-center gap-2">
              <span className="text-lg">💬</span>
              <div>
                <h3 className="font-display font-bold text-white text-base">
                  Live Branded NRB WhatsApp Concierge & AI Simulator
                </h3>
                <p className="text-xs text-slate-400">
                  Sub-4m qualification engine answering foreign-currency diaspora inquiries
                </p>
              </div>
            </div>
            
            {/* Mode Switcher */}
            <div className="flex bg-[#080C12] border border-[#1E293B] rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setActiveChatMode('interactive')}
                className={`px-2.5 py-1 rounded text-xs transition cursor-pointer font-medium ${
                  activeChatMode === 'interactive'
                    ? 'bg-[#38BDF8] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ⚡ Live AI Simulator
              </button>
              <button
                type="button"
                onClick={() => setActiveChatMode('static')}
                className={`px-2.5 py-1 rounded text-xs transition cursor-pointer font-medium ${
                  activeChatMode === 'static'
                    ? 'bg-[#38BDF8] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📱 4-Bubble SLA Output
              </button>
            </div>
          </div>

          {/* Client & Currency Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Active Tier-1 Developer Client:
              </label>
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                className="w-full bg-[#080C12] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#38BDF8]"
              >
                {VERIFIED_TARGETS.filter((t) => t.category === 'tier1' || t.slug === 'assure').map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.name} — {t.flagshipProject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Diaspora Buyer Currency & Timezone:
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['USD', 'GBP', 'AED'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-mono-num font-bold transition cursor-pointer ${
                      currency === c
                        ? 'bg-[#38BDF8] text-slate-950 shadow-md'
                        : 'bg-[#080C12] text-slate-400 border border-[#1E293B] hover:text-slate-200'
                    }`}
                  >
                    {c} ({rates[c].symbol})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Project Specs Summary Banner */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-[#1E293B] text-xs flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-slate-400">Flagship Asset: </span>
              <strong className="text-white">{activeClient.flagshipProject}</strong>
              <span className="text-slate-500 mx-1.5">•</span>
              <span className="text-slate-300">{activeClient.unitSpec}</span>
            </div>
            <div className="flex items-center gap-2 font-mono-num">
              <span className="text-slate-400">BDT:</span>
              <span className="text-white font-bold">{activeClient.bdtPrice}</span>
              <span className="text-slate-600">≈</span>
              <span className="text-emerald-400 font-bold">
                {rates[currency].symbol} {priceForeign.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Conditional: Interactive Multi-Turn AI Sandbox OR Static Phone Frame */}
          {activeChatMode === 'interactive' ? (
            <NrbSimulatorChat
              language={language}
              activeClient={activeClient}
              config={aiConfig}
            />
          ) : (
            <div className="bg-[#080C12] rounded-2xl border border-slate-800 p-3 sm:p-4 shadow-inner">
            {/* Chat header */}
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-xs">
                  {activeClient.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-slate-200">
                    {activeClient.name} Concierge Desk
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono-num">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Autonomous 24/7 • Gemini 2.5 Flash
                  </div>
                </div>
              </div>
              <div className="text-[10px] font-mono-num text-slate-500">
                {rates[currency].city}
              </div>
            </div>

            {/* Simulated 4-bubble WhatsApp conversation */}
            <div className="space-y-3 text-xs">
              {/* Bubble 1: NRB Prospect Inquiry */}
              <div className="flex justify-end">
                <div className="max-w-[85%] bg-[#005c4b] text-slate-100 rounded-2xl rounded-tr-xs p-3 shadow-md">
                  <p className="font-sans leading-relaxed">
                    “Hi, I'm calling from {rates[currency].city}. I saw your ad for{' '}
                    <strong>{activeClient.flagshipProject}</strong>. Is there an upper-floor 3-bed unit available? What would be the total price in {currency} and what is your foreign repatriation (NRTA) booking process?”
                  </p>
                  <div className="text-[10px] text-emerald-300 font-mono-num text-right mt-1">
                    02:14 AM • Delivered ✓✓
                  </div>
                </div>
              </div>

              {/* Bubble 2: AIS Concierge Instant Response (38 Seconds) */}
              <div className="flex justify-start">
                <div className="max-w-[90%] bg-[#202c33] text-slate-200 rounded-2xl rounded-tl-xs p-3 border border-slate-700/60 shadow-md">
                  <div className="text-[10px] text-[#38BDF8] font-mono-num font-semibold mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Response Time: 38 seconds • Auto-Converted
                  </div>
                  <p className="font-sans leading-relaxed">
                    {language === 'bn' ? (
                      <>
                        “আসসালামু আলাইকুম স্যার। {activeClient.name}-এর ফ্ল্যাগশিপ <strong>{activeClient.flagshipProject}</strong>-এ আপনার আগ্রহের জন্য ধন্যবাদ।
                        <br /><br />
                        • <strong>ইউনিট সাইজ:</strong> {activeClient.unitSpec}
                        <br />
                        • <strong>মূল্য:</strong> {activeClient.bdtPrice} (বর্তমান ব্যাংক রেট অনুযায়ী আনুমানিক <strong>{rates[currency].symbol} {priceForeign.toLocaleString()} {currency}</strong>)
                        <br />
                        • <strong>৩০% বুকিং (NRTA অনুমোদিত):</strong> {rates[currency].symbol} {booking30PctForeign.toLocaleString()}
                        <br />
                        • <strong>৩৬ মাসের সহজ ইএমআই:</strong> মাত্র {rates[currency].symbol} {emi36MonthsForeign.toLocaleString()} / মাস
                        <br /><br />
                        আপনার জন্য ইউনিটটি <strong>৪৮ ঘণ্টার এক্সক্লুসিভ হোল্ড</strong>-এ রাখা হয়েছে। বাংলাদেশ ব্যাংক সার্কুলার অনুযায়ী শতভাগ বৈধ ফরেন কারেন্সি রেপ্যাট্রিয়েশন গ্যারান্টিযুক্ত।”
                      </>
                    ) : (
                      <>
                        “Assalamu Alaikum Sir. Thank you for your inquiry from {rates[currency].city} regarding <strong>{activeClient.flagshipProject}</strong> by {activeClient.name}.
                        <br /><br />
                        • <strong>Selected Spec:</strong> {activeClient.unitSpec}
                        <br />
                        • <strong>Total Consideration:</strong> {activeClient.bdtPrice} (Converted at official central bank rate: <strong>{rates[currency].symbol} {priceForeign.toLocaleString()} {currency}</strong>)
                        <br />
                        • <strong>30% NRTA Down Payment:</strong> {rates[currency].symbol} {booking30PctForeign.toLocaleString()}
                        <br />
                        • <strong>36-Month Construction-Linked EMI:</strong> {rates[currency].symbol} {emi36MonthsForeign.toLocaleString()} / month
                        <br /><br />
                        Unit 12-A has been placed on a <strong>48-Hour Priority Hold</strong> under your mobile identifier with full BB NRTA repatriation eligibility.”
                      </>
                    )}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono-num text-right mt-1">
                    02:14 AM • Sent ✓✓
                  </div>
                </div>
              </div>

              {/* Bubble 3: 4K Walkthrough & Digital Brochure Attachment */}
              <div className="flex justify-start">
                <div className="max-w-[85%] bg-[#202c33] text-slate-200 rounded-2xl rounded-tl-xs p-2.5 border border-slate-700/60 shadow-md">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8]">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="text-xs truncate">
                      <div className="font-semibold text-slate-200 truncate">
                        {activeClient.flagshipProject} — 4K Architectural Walkthrough
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono-num">
                        18.4 MB • PDF Dossier & NRTA Schedule
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bubble 4: Fast Deposit Lock Option */}
              <div className="flex justify-start">
                <div className="max-w-[85%] bg-[#202c33] text-slate-200 rounded-2xl rounded-tl-xs p-3 border border-slate-700/60 shadow-md">
                  <p className="text-slate-300">
                    {language === 'bn'
                      ? '“স্যার, ট্রাস্ট ব্যাংক পিএলসি ডিজিটাল এসক্রো চ্যানেলে আপনার বুকিং স্লিপ লক করতে চান? নিচের বাটনে চাপ দিন।”'
                      : '“Would you like to lock this 48-hour hold via Trust Bank PLC Digital Escrow? Tap below to view your verified agreement.”'}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => onNavigateToSandbox(activeClient.slug)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition cursor-pointer"
                    >
                      🔒 Lock 48h Escrow Hold
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Right: 3 Spoken Boardroom & Gatekeeper Script Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0F1722] border border-[#1E293B] rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="font-display font-bold text-white text-sm">
                  3 Spoken Boardroom Scripts
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">Rizum Khan Spoken Verbal Playbook</span>
            </div>

            <div className="mt-3 space-y-3">
              {BOARDROOM_SCRIPTS.map((script, idx) => {
                const currentText = language === 'bn' ? script.banglaScript : script.englishScript;
                const copyId = `script-${script.id}`;

                return (
                  <div
                    key={script.id}
                    className="p-3 rounded-xl bg-[#080C12] border border-[#1E293B] hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-display font-bold text-[#38BDF8]">
                        Card {idx + 1}: {language === 'bn' ? script.titleBn : script.title}
                      </span>
                      <button
                        onClick={() => copyWithFeedback(currentText, copyId)}
                        className="p-1 rounded text-slate-400 hover:text-white transition cursor-pointer"
                        title="Copy Script"
                      >
                        {copiedKey === copyId ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono-num mb-2">
                      Target Role: <span className="text-slate-300">{script.targetRole}</span>
                    </div>

                    <p className="text-xs text-slate-300 font-sans leading-relaxed italic bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                      {currentText}
                    </p>

                    <p className="text-[10px] text-amber-400/90 mt-2 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 shrink-0" />
                      <span>{script.strategicNote}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: All 20 Verified Targets Grid */}
      <section className="bg-[#0F1722] border border-[#1E293B] rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#1E293B]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <h3 className="font-display font-bold text-white text-lg">
                All 20 Verified Outreach Targets & Liquidity Dossiers
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              10 Tier-1 Real Estate Giants + 5 Mid-Market Developers + 5 Fast-Cash E-Com COD Targets
            </p>
          </div>

          {/* Filter Pills & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search targets or project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#080C12] border border-[#1E293B] rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#38BDF8] w-48 sm:w-56"
              />
            </div>

            <div className="flex items-center bg-[#080C12] border border-[#1E293B] rounded-lg p-0.5 text-xs">
              {(
                [
                  { id: 'all', label: 'All (20)' },
                  { id: 'tier1', label: 'Tier-1 RE (10)' },
                  { id: 'mid', label: 'Mid-RE (5)' },
                  { id: 'ecom', label: 'E-Com COD (5)' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                    filterCategory === cat.id
                      ? 'bg-[#38BDF8] text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTargets.map((target) => {
            const pitch = getWhatsAppPitch(target);
            const cleanTargetPhone = target.phone.replace(/[^\d]/g, '');
            const mobileDeepLink = `whatsapp://send?phone=${cleanTargetPhone}&text=${encodeURIComponent(pitch)}`;
            const waUrl = `https://wa.me/${cleanTargetPhone}?text=${encodeURIComponent(pitch)}`;
            const isSelected = selectedSlug === target.slug;

            return (
              <div
                key={target.id}
                className={`rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#080C12] border-[#38BDF8] glow-cyan'
                    : 'bg-[#080C12]/70 border-[#1E293B] hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-display font-bold text-white text-sm">
                          {target.name}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono-num font-semibold ${
                            target.category === 'tier1'
                              ? 'bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30'
                              : target.category === 'mid'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {target.category === 'tier1'
                            ? 'Tier-1 RE'
                            : target.category === 'mid'
                            ? 'Mid-RE'
                            : 'E-Com COD'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Est. {target.established} • {target.location}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono-num px-2 py-0.5 rounded-full shrink-0 ${
                        target.currentStatus === 'Locked & Mobilized'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                          : target.currentStatus === 'Boardroom Scheduled'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {target.currentStatus}
                    </span>
                  </div>

                  {/* Flagship Asset & Pricing */}
                  <div className="mt-3 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                    <div className="text-slate-300 font-semibold truncate">
                      {target.flagshipProject}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
                      <span>{target.unitSpec}</span>
                      <strong className="text-emerald-400 font-mono-num font-bold">
                        {target.bdtPrice}
                      </strong>
                    </div>
                  </div>

                  {/* Diagnosed Vulnerability */}
                  <div className="mt-2 text-xs">
                    <span className="text-rose-400 font-semibold text-[11px]">Vulnerability: </span>
                    <span className="text-slate-300 text-[11px] leading-tight">
                      {target.diagnosedVulnerability}
                    </span>
                  </div>

                  {/* Custom AIS Solution */}
                  <div className="mt-1.5 text-xs">
                    <span className="text-[#38BDF8] font-semibold text-[11px]">AIS Solution: </span>
                    <span className="text-slate-400 text-[11px] leading-tight">
                      {target.customSolution}
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-1.5">
                    {/* Native Mobile Deep Link Auto-Dial */}
                    <a
                      href={mobileDeepLink}
                      onClick={() => playDialerChime()}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-950"
                      title="Directly opens native WhatsApp mobile app with pre-filled pitch and demo link"
                    >
                      <PhoneCall className="w-3.5 h-3.5 fill-current" />
                      <span>⚡ Auto-Dial</span>
                    </a>

                    {/* Universal Web WhatsApp */}
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
                      title="Open in WhatsApp Web"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>

                    {/* Load into Auto-Dialer Console */}
                    <button
                      onClick={() => {
                        setSelectedDialerTarget(target);
                        const dialerEl = document.getElementById('whatsapp-autodialer-section');
                        if (dialerEl) {
                          dialerEl.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="p-1.5 rounded-lg bg-[#0F1722] hover:bg-slate-800 border border-[#38BDF8]/40 text-[#38BDF8] text-xs transition cursor-pointer"
                      title="Load this target into WhatsApp Auto-Dialer console"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => copyWithFeedback(pitch, `pitch-${target.slug}`)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
                      title="Copy Customized Pitch"
                    >
                      {copiedKey === `pitch-${target.slug}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <button
                      onClick={() => onTestLockedClientView(target.slug)}
                      className="text-[#38BDF8] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                      title="Test the exact isolated screen the client will see"
                    >
                      <span>👁️ Test Locked Client View</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                    <span className="text-slate-400 font-mono-num">
                      Fee: ৳{target.dealValueLakh}L
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
