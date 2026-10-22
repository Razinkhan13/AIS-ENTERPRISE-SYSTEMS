import React, { useState } from 'react';
import {
  Shield,
  Globe,
  MessageSquare,
  Building2,
  CheckCircle,
  Zap,
  Play,
  RotateCcw,
  Clock,
  Flame,
  ShieldCheck,
  FileText,
  Printer,
  ChevronDown,
  ChevronUp,
  Landmark,
  Smartphone,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Language, VerifiedTarget } from '../types';
import { CORPORATE_INFO, VERIFIED_TARGETS, INITIAL_PROJECT_ASSETS } from '../data/masterData';
import { AiEngineConfig } from '../types/ai';
import { NrbSimulatorChat } from './ai/NrbSimulatorChat';

interface ClientPreviewViewProps {
  clientSlug: string;
  language: Language;
  onLanguageToggle: () => void;
  onAdminUnlock: () => void;
  aiConfig: AiEngineConfig;
}

export const ClientPreviewView: React.FC<ClientPreviewViewProps> = ({
  clientSlug,
  language,
  onLanguageToggle,
  onAdminUnlock,
  aiConfig,
}) => {
  const activeClient: VerifiedTarget =
    VERIFIED_TARGETS.find((t) => t.slug === clientSlug) || VERIFIED_TARGETS[0];

  // Specific project asset for slider initial values
  const matchedAsset = INITIAL_PROJECT_ASSETS.find((a) => a.developer_slug === activeClient.slug);
  const initialSqft = matchedAsset?.unsold_sqft || 65000;
  const initialPrice = matchedAsset?.avg_price_sqft || 31800;
  const initialOdRate = matchedAsset?.od_rate_pct || 14.0;

  // Currency simulator state
  const [currency, setCurrency] = useState<'USD' | 'GBP' | 'AED'>(activeClient.defaultCurrency || 'USD');
  const rates = {
    USD: { rate: 120, symbol: '$', city: 'New York (2:14 AM BD Time)' },
    GBP: { rate: 155, symbol: '£', city: 'London (1:40 AM BD Time)' },
    AED: { rate: 33, symbol: 'AED', city: 'Dubai (11:50 PM BD Time)' },
  };

  const getBdtNumber = (priceStr: string) => {
    const match = priceStr.match(/([\d.]+)\s*Cr/);
    if (match) return parseFloat(match[1]) * 10000000;
    return 48500000;
  };

  const currentPriceBDT = getBdtNumber(activeClient.bdtPrice);
  const priceForeign = Math.round(currentPriceBDT / rates[currency].rate);
  const booking30PctForeign = Math.round(priceForeign * 0.3);
  const emi36MonthsForeign = Math.round((priceForeign * 0.7) / 36);

  // Capital relief interactive sliders (preloaded for this client)
  const [unsoldSqft, setUnsoldSqft] = useState<number>(initialSqft);
  const [avgPriceSqft, setAvgPriceSqft] = useState<number>(initialPrice);
  const [odRatePct, setOdRatePct] = useState<number>(initialOdRate);

  const trappedCapitalBDT = unsoldSqft * avgPriceSqft;
  const trappedCapitalCr = trappedCapitalBDT / 10000000;
  const monthlyOdBleedBDT = (trappedCapitalBDT * (odRatePct / 100)) / 12;
  const monthlyOdBleedCr = monthlyOdBleedBDT / 10000000;
  const dailyBleedLakh = (monthlyOdBleedBDT / 30) / 100000;
  const syndicateUnlockCr = trappedCapitalCr * 0.15;

  // 38-second qualification test simulator states
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Expandable Proposal & Invoice
  const [showProposal, setShowProposal] = useState<boolean>(false);
  const [chatMode, setChatMode] = useState<'interactive' | 'static'>('interactive');

  // Admin PIN prompt modal
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  const steps = [
    {
      id: 1,
      title: 'Step 1: Meta Cloud API Webhook Ingested',
      delay: '0.2s',
      detail: `Inbound diaspora lead captured from Meta Ads campaign for ${activeClient.flagshipProject}.`,
      payload: {
        event: 'leadgen_payload',
        sender: `Dr. Tariq Rahman (+1-646-555-0198, New York)`,
        campaign: `${activeClient.name} — Luxury NRB Suites`,
        timestamp: '02:14:02 AM BD Time',
      },
    },
    {
      id: 2,
      title: 'Step 2: Gemini 2.5 Flash Autonomous Scoring',
      delay: '0.8s',
      detail: 'Assessed budget ($410k USD), source of funds, and Bangladesh Bank NRTA eligibility in 0.8s.',
      payload: {
        score: 98,
        intent: 'High Intent Cash Purchase',
        currency: `${currency} (${rates[currency].symbol})`,
        matched_project: activeClient.flagshipProject,
        repatriation: '100% Legal Central Bank NRTA Eligible',
      },
    },
    {
      id: 3,
      title: 'Step 3: 4K Walkthrough & NRTA EMI Dispatched',
      delay: '1.4s',
      detail: `Personalized WhatsApp media package sent with 36-month EMI calculated in ${currency}.`,
      payload: {
        recipient: 'Dr. Tariq Rahman',
        converted_quote: `${rates[currency].symbol} ${priceForeign.toLocaleString()} ${currency}`,
        down_payment_30pct: `${rates[currency].symbol} ${booking30PctForeign.toLocaleString()}`,
        monthly_emi: `${rates[currency].symbol} ${emi36MonthsForeign.toLocaleString()} / mo`,
      },
    },
    {
      id: 4,
      title: 'Step 4: 48h Priority Unit Escrow Locked',
      delay: '2.1s',
      detail: `Unit placed in Trust Bank PLC digital escrow register; Dhaka sales director notified via SMS.`,
      payload: {
        escrow_vault: `${CORPORATE_INFO.trustBank.bankName} (${CORPORATE_INFO.trustBank.accountNumber})`,
        unit_allocated: 'Luxury Suite 14-B',
        hold_expiry: '48 Hours Guaranteed Hold',
      },
    },
  ];

  const runSimulation = () => {
    setIsRunning(true);
    setActiveStep(1);
    setCompletedSteps([]);

    const timers: NodeJS.Timeout[] = [];
    timers.push(
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, 1]);
        setActiveStep(2);
      }, 700)
    );
    timers.push(
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, 2]);
        setActiveStep(3);
      }, 1500)
    );
    timers.push(
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, 3]);
        setActiveStep(4);
      }, 2300)
    );
    timers.push(
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, 4]);
        setIsRunning(false);
      }, 3100)
    );
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '1214') {
      setShowPinModal(false);
      onAdminUnlock();
    } else {
      setPinError('Invalid PIN. Access restricted to Rizum Khan.');
    }
  };

  const directWaUrl = `https://wa.me/8801715219176?text=${encodeURIComponent(
    `Hello Rizum Bhai, I am reviewing the AIS Executive Turnaround Prototype prepared for ${activeClient.name} (${activeClient.flagshipProject}). Let's discuss mobilizing this sandbox.`
  )}`;

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-col font-sans selection:bg-[#38BDF8] selection:text-black">
      {/* 1. EXCLUSIVE CLIENT EXECUTIVE HEADER */}
      <header className="sticky top-0 z-50 bg-[#070A0F]/90 backdrop-blur-xl border-b border-[#1E293B]/80 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Confidential Client Lockup */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-slate-900 border border-[#38BDF8]/60 glow-cyan shadow-[inset_0_1px_0_0_rgba(56,189,248,0.4)] overflow-hidden shrink-0">
              <img
                src="/assets/aistudio/images_3598e51a.jfif"
                alt="AIS Enterprise Systems Official Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-white text-sm sm:text-base tracking-wide">
                  AIS ENTERPRISE SYSTEMS
                </span>
                <span className="text-[10px] font-mono-num font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 shadow-[inset_0_1px_0_0_rgba(16,185,129,0.3)]">
                  CONFIDENTIAL
                </span>
              </div>
              <p className="text-xs text-[#38BDF8] font-mono-num font-medium">
                EXECUTIVE PROTOTYPE PREPARED EXCLUSIVELY FOR:{' '}
                <strong className="text-white uppercase">{activeClient.name}</strong>
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Language Switch */}
            <button
              onClick={onLanguageToggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F1722]/80 hover:bg-slate-800 border border-[#1E293B] text-slate-200 text-xs font-medium transition cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
            >
              <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="font-bangla font-semibold">
                {language === 'en' ? '🇧🇩 বাংলা' : '🇬🇧 English'}
              </span>
            </button>

            {/* Direct WhatsApp Concierge Button to Rizum Khan */}
            <a
              href={directWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_12px_rgba(16,185,129,0.3)] transition cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Message Rizum Khan (Founder)</span>
              <span className="sm:hidden">Message Founder</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. MAIN CLIENT SANDBOX CONTENT */}
      <main
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 space-y-8"
        style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#0F1722]/90 via-[#070A0F]/90 to-[#0F1722]/90 border border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-[inset_0_1px_0_0_rgba(56,189,248,0.22),0_10px_30px_-5px_rgba(0,0,0,0.7)] backdrop-blur-xl glow-cyan">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
            <div>
              <div className="text-xs font-mono-num text-slate-400 mb-1">
                Est. {activeClient.established} • {activeClient.location} • {activeClient.projectsCount}+ Projects Delivered
              </div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-wide">
                {activeClient.name}
              </h1>
              <p className="text-sm text-slate-300 mt-1">
                Flagship Asset Turnaround:{' '}
                <strong className="text-[#38BDF8]">{activeClient.flagshipProject}</strong>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-right">
              <div className="text-[11px] text-slate-400">Spec & Pricing Benchmark:</div>
              <div className="text-lg font-mono-num font-bold text-emerald-400 mt-0.5">
                {activeClient.bdtPrice}
              </div>
              <div className="text-[11px] text-slate-400 font-mono-num">{activeClient.unitSpec}</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#080C12] border border-rose-500/30 rounded-xl p-4">
              <span className="font-semibold text-rose-400 font-mono-num uppercase block mb-1">
                Diagnosed Macro Vulnerability
              </span>
              <p className="text-slate-300 leading-relaxed">
                {activeClient.diagnosedVulnerability}
              </p>
            </div>

            <div className="bg-[#080C12] border border-[#38BDF8]/40 rounded-xl p-4 glow-cyan">
              <span className="font-semibold text-[#38BDF8] font-mono-num uppercase block mb-1">
                AIS Dedicated Sandbox Solution
              </span>
              <p className="text-slate-300 leading-relaxed">
                {activeClient.customSolution}
              </p>
            </div>

            <div className="bg-[#080C12] border border-emerald-500/40 rounded-xl p-4 glow-emerald">
              <span className="font-semibold text-emerald-400 font-mono-num uppercase block mb-1">
                60-Day 5× Pipeline Guarantee
              </span>
              <p className="text-emerald-200/90 leading-relaxed">
                "{CORPORATE_INFO.warranty}"
              </p>
            </div>
          </div>
        </section>

        {/* 3. LIVE 38-SECOND NRB WHATSAPP CHAT SIMULATOR */}
        <section className="bg-[#0F1722] border border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E293B]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">💬</span>
                <h2 className="font-display font-bold text-white text-lg">
                  Live 38-Second NRB WhatsApp Concierge Simulator
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Experience how your US/UK/Gulf diaspora inquiries are qualified autonomously while Dhaka sleeps
              </p>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono-num">Currency:</span>
              <div className="grid grid-cols-3 gap-1">
                {(['USD', 'GBP', 'AED'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    className={`py-1 px-2.5 rounded-lg text-xs font-mono-num font-bold transition cursor-pointer ${
                      currency === c
                        ? 'bg-[#38BDF8] text-slate-950'
                        : 'bg-[#080C12] text-slate-400 border border-[#1E293B] hover:text-white'
                    }`}
                  >
                    {c} ({rates[c].symbol})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-slate-400">
              Interactive Test Mode:
            </div>
            <div className="flex bg-[#080C12] border border-[#1E293B] rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setChatMode('interactive')}
                className={`px-3 py-1 rounded text-xs transition cursor-pointer font-medium ${
                  chatMode === 'interactive'
                    ? 'bg-[#38BDF8] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ⚡ Live Interactive AI Dialogue
              </button>
              <button
                type="button"
                onClick={() => setChatMode('static')}
                className={`px-3 py-1 rounded text-xs transition cursor-pointer font-medium ${
                  chatMode === 'static'
                    ? 'bg-[#38BDF8] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📱 4-Bubble SLA Output Preview
              </button>
            </div>
          </div>

          {chatMode === 'interactive' ? (
            <NrbSimulatorChat
              language={language}
              activeClient={activeClient}
              config={aiConfig}
            />
          ) : (
            <div className="bg-[#080C12] rounded-2xl border border-slate-800 p-4 shadow-inner space-y-3 text-xs">
              <div className="flex justify-end">
                <div className="max-w-[85%] bg-[#005c4b] text-slate-100 rounded-2xl rounded-tr-xs p-3">
                  <p>
                    “Hi, I'm calling from {rates[currency].city}. I saw your ad for{' '}
                    <strong>{activeClient.flagshipProject}</strong>. Is there an upper-floor 3-bed unit available? What would be the total price in {currency} and what is your foreign repatriation (NRTA) booking process?”
                  </p>
                  <div className="text-[10px] text-emerald-300 font-mono-num text-right mt-1">
                    02:14 AM • Delivered ✓✓
                  </div>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="max-w-[90%] bg-[#202c33] text-slate-200 rounded-2xl rounded-tl-xs p-3 border border-slate-700/60">
                  <div className="text-[10px] text-[#38BDF8] font-mono-num font-semibold mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Response Time: 38 seconds • Auto-Converted
                  </div>
                  <p className="leading-relaxed">
                    “Assalamu Alaikum Sir. Thank you for your inquiry from {rates[currency].city} regarding{' '}
                    <strong>{activeClient.flagshipProject}</strong> by {activeClient.name}.
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
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono-num text-right mt-1">
                    02:14 AM • Sent ✓✓
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 4. INTERACTIVE 4-STEP 38-SECOND QUALIFICATION TELEMETRY TEST */}
        <section className="bg-[#0F1722] border border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E293B]">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-bold text-white text-base">
                  38-Second Live Webhook & Qualification Telemetry
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                End-to-end event execution pipeline: Meta Webhook → AI Intent Score → Currency Calculation → Escrow Hold
              </p>
            </div>

            <button
              onClick={runSimulation}
              disabled={isRunning}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                isRunning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#38BDF8] to-emerald-400 text-slate-950 shadow-lg shadow-[#38BDF8]/20'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isRunning ? 'Processing Pipeline...' : 'Run 38s Telemetry Test'}</span>
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {steps.map((st) => {
              const isCompleted = completedSteps.includes(st.id);
              const isCurrent = activeStep === st.id;

              return (
                <div
                  key={st.id}
                  className={`rounded-xl border p-3.5 transition-all duration-300 flex flex-col justify-between ${
                    isCompleted
                      ? 'bg-emerald-950/20 border-emerald-500/50 glow-emerald'
                      : isCurrent
                      ? 'bg-[#080C12] border-[#38BDF8] glow-cyan'
                      : 'bg-[#080C12] border-slate-800 text-slate-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono-num font-bold text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {st.delay}
                      </span>
                      {isCompleted && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <h4 className="font-display font-bold text-xs sm:text-sm text-white">{st.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1">{st.detail}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800 font-mono-num text-[10px] text-slate-400 bg-slate-950/60 p-2 rounded">
                    <pre className="overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(st.payload, null, 2)}
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. INTERACTIVE EXECUTIVE CAPITAL RELIEF SLIDERS (PRE-LOADED FOR THIS CLIENT) */}
        <section className="bg-[#0F1722] border border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-xl glow-rose">
          <div className="pb-4 border-b border-[#1E293B] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-base">
                  {activeClient.name} — Executive Capital Relief Sliders
                </h3>
                <p className="text-xs text-slate-400">
                  Pre-loaded with your project specifications. Slide to evaluate bank overdraft interest savings.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#080C12] border border-[#1E293B] rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Unabsorbed Luxury Stock</span>
                <span className="font-mono-num text-[#38BDF8] font-bold">
                  {unsoldSqft.toLocaleString()} sq ft
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="150000"
                step="2500"
                value={unsoldSqft}
                onChange={(e) => setUnsoldSqft(Number(e.target.value))}
                className="w-full accent-[#38BDF8] cursor-pointer"
              />
            </div>

            <div className="bg-[#080C12] border border-[#1E293B] rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Avg Price / SqFt</span>
                <span className="font-mono-num text-emerald-400 font-bold">
                  ৳ {avgPriceSqft.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="12000"
                max="40000"
                step="500"
                value={avgPriceSqft}
                onChange={(e) => setAvgPriceSqft(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="bg-[#080C12] border border-[#1E293B] rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Commercial Bank OD Rate</span>
                <span className="font-mono-num text-rose-400 font-bold">{odRatePct.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="11.0"
                max="18.0"
                step="0.5"
                value={odRatePct}
                onChange={(e) => setOdRatePct(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#080C12] border border-slate-800 rounded-xl p-3.5">
              <div className="text-[11px] text-slate-400">Trapped Inventory Capital</div>
              <div className="text-xl font-mono-num font-bold text-white mt-1">
                ৳ {trappedCapitalCr.toFixed(2)} Cr
              </div>
              <div className="text-[10px] text-slate-500">{activeClient.flagshipProject}</div>
            </div>

            <div className="bg-rose-950/20 border border-rose-500/40 rounded-xl p-3.5 glow-rose">
              <div className="text-[11px] text-rose-300 font-medium flex items-center justify-between">
                <span>Monthly Idle Overdraft Bleed</span>
                <Flame className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-xl font-mono-num font-bold text-rose-400 mt-1">
                ৳ {monthlyOdBleedCr.toFixed(2)} Cr / mo
              </div>
              <div className="text-[10px] text-rose-400/80 font-mono-num">
                Daily Drag: ৳ {dailyBleedLakh.toFixed(2)} Lakh / day
              </div>
            </div>

            <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-3.5 glow-emerald">
              <div className="text-[11px] text-emerald-300 font-medium flex items-center justify-between">
                <span>90-Day Syndicate Cashflow Unlock</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl font-mono-num font-bold text-emerald-400 mt-1">
                ৳ {syndicateUnlockCr.toFixed(2)} Cr
              </div>
              <div className="text-[10px] text-emerald-300/80">
                15% Liquid Syndicate Restructuring
              </div>
            </div>
          </div>
        </section>

        {/* 6. OFFICIAL 1-PAGE SANDBOX PROPOSAL & NBR MUSHAK-6.3 INVOICE VIEW */}
        <section className="bg-[#0F1722] border border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/40 text-[#38BDF8]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-base">
                  Official 1-Page Turnaround Proposal & NBR Mushak-6.3 Invoice
                </h3>
                <p className="text-xs text-slate-400">
                  Pre-configured strictly for {activeClient.name} with 60-Day 5× Pipeline Guarantee
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowProposal(!showProposal)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>{showProposal ? 'Collapse Proposal' : 'View Full Proposal & Invoice'}</span>
              {showProposal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showProposal && (
            <div className="mt-6 pt-6 border-t border-slate-800 space-y-6">
              {/* Proposal Document Preview */}
              <div className="bg-white text-slate-950 p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 text-xs space-y-4">
                <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-base text-slate-900 font-display">
                      AIS ENTERPRISE SYSTEMS — 90-DAY TURNAROUND PROPOSAL
                    </h4>
                    <div className="text-slate-600 font-mono-num text-[11px]">
                      Client: <strong>{activeClient.name}</strong> • Project: {activeClient.flagshipProject}
                    </div>
                  </div>
                  <div className="text-right font-mono-num text-[11px]">
                    <div>BIN: {CORPORATE_INFO.nbr.bin}</div>
                    <div>Service Code: {CORPORATE_INFO.nbr.serviceCode}</div>
                  </div>
                </div>

                <div className="space-y-2 text-slate-800 leading-relaxed">
                  <p>
                    <strong>1. Core Scope:</strong> Deployment of the autonomous 24/7 Meta Cloud API Webhook, Gemini 2.5 Flash sub-4m lead qualifier, and Trust Bank PLC escrow register specifically dedicated to <strong>{activeClient.flagshipProject}</strong>.
                  </p>
                  <p>
                    <strong>2. Commercial Terms:</strong> 50% Mobilization Retainer (৳23,00,000 BDT) due on signature; remaining 50% due on Day-14 go-live. 0% markup on third-party API pass-throughs.
                  </p>
                  <p className="bg-emerald-50 border border-emerald-300 p-2.5 rounded font-serif italic text-emerald-950">
                    <strong>3. Absolute Risk-Reversal Warranty:</strong> "{CORPORATE_INFO.warranty}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-300 grid grid-cols-2 gap-4 font-mono-num text-[11px]">
                  <div>
                    <div className="font-bold text-slate-900">VERIFIED SETTLEMENT CHANNELS:</div>
                    <div>Bank: {CORPORATE_INFO.trustBank.bankName}</div>
                    <div>Branch: {CORPORATE_INFO.trustBank.branch}</div>
                    <div>A/C No: <strong>{CORPORATE_INFO.trustBank.accountNumber}</strong></div>
                    <div>bKash: {CORPORATE_INFO.mfs.bkash} | Nagad: {CORPORATE_INFO.mfs.nagad}</div>
                  </div>

                  <div className="text-right flex flex-col justify-end">
                    <div className="border-b border-slate-900 w-36 ml-auto mb-1"></div>
                    <div className="font-bold text-slate-900">{CORPORATE_INFO.founder}</div>
                    <div className="text-slate-600">{CORPORATE_INFO.founderTitle}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Ready to activate this 90-day sandbox on {activeClient.flagshipProject}?
                </span>
                <a
                  href={directWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-950"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Confirm Sandbox Activation via WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* 7. DISCREET ADMIN RETURN GATE (FOR RIZUM ONLY) */}
      <footer className="mt-auto border-t border-slate-900/80 py-4 px-6 flex items-center justify-between text-[11px] text-slate-500">
        <div>
          © {new Date().getFullYear()} AIS Enterprise Systems (Army IBA Specialist) • All Rights Reserved.
        </div>

        {/* Discreet lock icon for Rizum Khan to enter PIN 1214 */}
        <button
          onClick={() => {
            setPinInput('');
            setPinError(null);
            setShowPinModal(true);
          }}
          className="flex items-center gap-1 text-slate-600 hover:text-slate-400 transition cursor-pointer text-[10px] font-mono-num"
          title="SuperAdmin Access"
        >
          <Lock className="w-3 h-3" />
          <span>Admin Unlock</span>
        </button>
      </footer>

      {/* Admin Unlock PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F1722] border border-[#1E293B] rounded-2xl p-6 max-w-sm w-full shadow-2xl glow-cyan text-center">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8] mx-auto mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-white text-base">Rizum Khan — SuperAdmin Unlock</h3>
            <p className="text-xs text-slate-400 mt-1">Enter your 4-digit security PIN to exit Client Preview Mode</p>

            <form onSubmit={handlePinSubmit} className="mt-4 space-y-3">
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="PIN (1214)"
                autoFocus
                className="w-full bg-[#080C12] border border-[#1E293B] rounded-lg px-3 py-2 text-center text-lg text-white font-mono-num tracking-widest focus:outline-none focus:border-[#38BDF8]"
              />

              {pinError && <p className="text-xs text-rose-400 font-mono-num">{pinError}</p>}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-slate-950 font-bold text-xs transition cursor-pointer"
                >
                  Unlock Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
