import React, { useState, useEffect } from 'react';
import {
  Building2,
  ShieldCheck,
  Zap,
  Play,
  RotateCcw,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { Language, VerifiedTarget } from '../../types';
import { VERIFIED_TARGETS, CORPORATE_INFO } from '../../data/masterData';

interface TabClientSandboxProps {
  language: Language;
  clientSlug: string;
  onClientChange: (slug: string) => void;
}

export const TabClientSandbox: React.FC<TabClientSandboxProps> = ({
  language,
  clientSlug,
  onClientChange,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const activeClient =
    VERIFIED_TARGETS.find((t) => t.slug === clientSlug) || VERIFIED_TARGETS[0];

  const steps = [
    {
      id: 1,
      title: 'Step 1: Meta Cloud API Webhook Ingested',
      delay: '0.2s',
      detail: 'Inbound prospect lead payload received from Meta Graph API v21.0 via edge gateway.',
      payload: {
        event: 'leadgen_payload',
        sender: '+1-646-555-0198 (New York, USA)',
        campaign: `${activeClient.name} — NRB Luxury Diaspora`,
        timestamp: '02:14:02.120 AM BD Time',
        status: 'Ingested',
      },
    },
    {
      id: 2,
      title: 'Step 2: Gemini 2.5 Flash Autonomous Scoring',
      delay: '0.8s',
      detail: 'Parsed intent, budget ($410k USD), source of funds, and central bank NRTA eligibility in JSON format.',
      payload: {
        model: 'gemini-2.5-flash-preview',
        score: 98,
        intent: 'High Intent Cash Purchase',
        currency_detected: 'USD ($)',
        matched_unit: activeClient.flagshipProject,
        nrta_eligibility: 'Verified 100% Repatriable',
      },
    },
    {
      id: 3,
      title: 'Step 3: 4K Walkthrough & NRTA EMI Dispatched',
      delay: '1.4s',
      detail: 'Personalized WhatsApp media message delivered to prospect mobile with live currency conversion.',
      payload: {
        channel: 'WhatsApp Cloud API',
        recipient: 'Dr. Tariq Rahman',
        converted_quote: '$410,000 USD (৳ 4.85 Cr)',
        emi_breakdown: '36 Mo @ $7,972 / mo',
        assets_attached: ['4K_Walkthrough.mp4', 'NRTA_SafKabala_Schedule.pdf'],
      },
    },
    {
      id: 4,
      title: 'Step 4: 48h Priority Unit Escrow Locked',
      delay: '2.1s',
      detail: 'Unit placed on temporary reservation in Trust Bank PLC escrow register; sales director alerted.',
      payload: {
        escrow_vault: 'Trust Bank PLC (00110466000494)',
        unit_allocated: 'Tower-A Unit 14-B',
        hold_expiry: '48 Hours (Auto-releases if no wire)',
        director_sms: 'Dispatched to Dhaka Sales VP via SSL Wireless',
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

  const resetSimulation = () => {
    setIsRunning(false);
    setActiveStep(0);
    setCompletedSteps([]);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* 1. White-Labeled Hero Profile */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0F1722] via-[#080C12] to-[#0F1722] border border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-2xl glow-cyan">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-num font-bold bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40">
                WHITE-LABELED DEEP-LINK DESTINATION
              </span>
              <span className="text-xs text-slate-400 font-mono-num">
                ?demo={activeClient.slug}#sandbox
              </span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-wide">
              {activeClient.name}
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Flagship Asset Turnaround: <strong className="text-[#38BDF8]">{activeClient.flagshipProject}</strong>
            </p>
          </div>

          {/* Target Switcher */}
          <div className="flex items-center gap-2 bg-[#080C12] border border-[#1E293B] p-2 rounded-xl">
            <span className="text-xs text-slate-400 font-medium">Switch Target:</span>
            <select
              id="sandboxDevSelect"
              value={activeClient.slug}
              onChange={(e) => onClientChange(e.target.value)}
              className="bg-[#0F1722] border border-slate-700 text-xs text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#38BDF8]"
            >
              {VERIFIED_TARGETS.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3 Value Pillars */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#080C12]/80 border border-[#1E293B] rounded-xl p-4">
            <div className="text-xs font-semibold text-rose-400 flex items-center gap-1.5 uppercase font-mono-num">
              <span>Diagnosed Vulnerability</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {activeClient.diagnosedVulnerability}
            </p>
          </div>

          <div className="bg-[#080C12]/80 border border-[#1E293B] rounded-xl p-4">
            <div className="text-xs font-semibold text-[#38BDF8] flex items-center gap-1.5 uppercase font-mono-num">
              <span>AIS Single-Site Sandbox</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {activeClient.customSolution}
            </p>
          </div>

          <div className="bg-[#080C12]/80 border border-emerald-500/40 rounded-xl p-4 glow-emerald">
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 uppercase font-mono-num">
              <span>Binding Risk-Reversal Warranty</span>
            </div>
            <p className="text-xs text-emerald-200/90 mt-2 leading-relaxed font-sans">
              Sub-4min response SLA + 5× fee pipeline qualified in 60 days, or 100% full fee return.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Interactive 38-Second Qualification Test Simulator */}
      <section className="bg-[#0F1722] border border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E293B]">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="font-display font-bold text-white text-lg">
                Interactive 38-Second Qualification Test Simulator
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Simulates a live inbound 2:14 AM NRB inquiry passing through Meta Webhook, Gemini 2.5 Flash, and Trust Bank Escrow
            </p>
          </div>

          <div className="flex items-center gap-2">
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
              <span>{isRunning ? 'Executing Pipeline...' : 'Run 38s Qualification Test'}</span>
            </button>
            <button
              onClick={resetSimulation}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
              title="Reset Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Steps Timeline Flow */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                    <span
                      className={`font-mono-num font-bold px-2 py-0.5 rounded text-[10px] ${
                        isCompleted
                          ? 'bg-emerald-900 text-emerald-300'
                          : isCurrent
                          ? 'bg-[#38BDF8]/20 text-[#38BDF8]'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {st.delay}
                    </span>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-ping" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </div>

                  <h4
                    className={`font-display font-bold text-xs sm:text-sm ${
                      isCompleted ? 'text-emerald-300' : isCurrent ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {st.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {st.detail}
                  </p>
                </div>

                {/* Micro Payload Preview */}
                <div className="mt-3 pt-2 border-t border-slate-800/60 font-mono-num text-[10px] text-slate-400 bg-slate-950/60 p-2 rounded">
                  <pre className="overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(st.payload, null, 2)}
                  </pre>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Execution Status Banner */}
        <div className="mt-5 p-3 rounded-xl bg-[#080C12] border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                completedSteps.length === 4
                  ? 'bg-emerald-400'
                  : isRunning
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-slate-600'
              }`}
            />
            <span className="text-slate-300">
              Simulation Status:{' '}
              {completedSteps.length === 4
                ? '✅ Lead Qualified & Priority Hold Active (Total Time: 2.1s)'
                : isRunning
                ? '⚡ Processing Realtime Telemetry...'
                : 'Ready for Test Run'}
            </span>
          </div>

          <span className="text-slate-500 font-mono-num text-[11px]">
            SLA Standard: Sub-4 Minutes (Achieved: 0.035m)
          </span>
        </div>
      </section>
    </div>
  );
};
