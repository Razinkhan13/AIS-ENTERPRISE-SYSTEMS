import React, { useState } from 'react';
import {
  TrendingDown,
  Flame,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  Sliders,
  DollarSign,
  FileSpreadsheet,
} from 'lucide-react';
import { Language, RedmaPreset } from '../../types';
import { REDMA_PRESETS, COGNITIVE_BIAS_BATTLECARDS } from '../../data/masterData';
import { AiEngineConfig } from '../../types/ai';
import { EngineSettingsBar } from '../ai/EngineSettingsBar';
import { ArgonStrategistChat } from '../ai/ArgonStrategistChat';

interface TabColdAuditProps {
  language: Language;
  aiConfig: AiEngineConfig;
  onAiConfigChange: (config: AiEngineConfig) => void;
}

export const TabColdAudit: React.FC<TabColdAuditProps> = ({
  language,
  aiConfig,
  onAiConfigChange,
}) => {
  // --- Cockpit Slider States ---
  const [unsoldSqft, setUnsoldSqft] = useState<number>(65000);
  const [avgPriceSqft, setAvgPriceSqft] = useState<number>(31800);
  const [odRatePct, setOdRatePct] = useState<number>(14.0);
  const [responseDelayHours, setResponseDelayHours] = useState<number>(72);

  // --- 8-Katha Empirical Model States ---
  const [selectedPresetName, setSelectedPresetName] = useState<string>(REDMA_PRESETS[0].name);
  const [katha, setKatha] = useState<number>(8);
  const [unitSqft, setUnitSqft] = useState<number>(2200);
  const [pricePerSqft, setPricePerSqft] = useState<number>(20000);
  const [cancelledUnits, setCancelledUnits] = useState<number>(1);
  const [stalledUnits, setStalledUnits] = useState<number>(1);
  const [bankOdCrore, setBankOdCrore] = useState<number>(3.1878);

  // Cockpit Calculations:
  // Trapped Capital = unsoldSqft * avgPriceSqft
  const trappedCapitalBDT = unsoldSqft * avgPriceSqft;
  const trappedCapitalCr = trappedCapitalBDT / 10000000;

  // Monthly Idle OD Bleed = (trappedCapitalBDT * (odRatePct / 100)) / 12
  const monthlyOdBleedBDT = (trappedCapitalBDT * (odRatePct / 100)) / 12;
  const monthlyOdBleedCr = monthlyOdBleedBDT / 10000000;
  const dailyBleedLakh = (monthlyOdBleedBDT / 30) / 100000;

  // 90-Day Syndicate Unlock = ~15% velocity unlock of trapped stock
  const syndicateUnlockCr = trappedCapitalCr * 0.15;

  // NRB Attrition rate based on delay slider
  // 4h = 15%, 24h = 45%, 48h = 65%, 72h = 78%
  const attritionPct = Math.min(85, Math.round(15 + (responseDelayHours / 72) * 63));
  const lostPipelineMonthlyCr = (trappedCapitalCr * 0.08) * (attritionPct / 100);

  // --- 8-Katha REDMA Section 14/15 Calculations ---
  // unitPriceCr = (sqft * priceSqft) / 10,000,000
  const unitPriceCr = (unitSqft * pricePerSqft) / 10000000;
  // paidMilestoneCr = unitPriceCr * 0.5 (assuming 50% milestone paid)
  const paidMilestoneCr = unitPriceCr * 0.5;

  // REDMA Sec 14 Mandatory 90-Day Refund Shock = cancelled * paidMilestoneCr * 0.90
  const redmaSec14ShockCr = cancelledUnits * paidMilestoneCr * 0.90;

  // REDMA Sec 15 Delay Penalty (15%/yr) = stalled * paidMilestoneCr * 0.15 * 100 (in Lakh)
  const redmaSec15PenaltyLakh = stalledUnits * paidMilestoneCr * 0.15 * 100;

  // Bank OD Carrying Drag (14%/yr) = odCrore * 0.14 * 100 (in Lakh)
  const bankOdDragLakh = bankOdCrore * 0.14 * 100;

  // Displacement Rent = (katha / 8) * 12 (in Lakh/yr)
  const displacementRentLakh = (katha / 8) * 12;

  // Site Security & Rebar Decay = (katha / 8) * 18 (in Lakh/yr)
  const siteSecurityDecayLakh = (katha / 8) * 18;

  // Total Single-Site Annual Bleed = (Delay Penalty + Bank OD + Displacement + Security) + (Sec 14 Shock in Lakh)
  const annualCarryingBleedLakh = redmaSec15PenaltyLakh + bankOdDragLakh + displacementRentLakh + siteSecurityDecayLakh;
  const totalSingleSiteBleedCr = (annualCarryingBleedLakh / 100) + redmaSec14ShockCr;

  const handleLoadPreset = (preset: RedmaPreset) => {
    setSelectedPresetName(preset.name);
    setKatha(preset.katha);
    setUnitSqft(preset.sqft);
    setPricePerSqft(preset.priceSqft);
    setCancelledUnits(preset.cancelledUnits);
    setStalledUnits(preset.stalledUnits);
    setBankOdCrore(preset.bankOdCrore);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Engine Settings Ribbon */}
      <EngineSettingsBar config={aiConfig} onChange={onAiConfigChange} />

      {/* 1. Interactive Executive Capital Relief Cockpit */}
      <section className="bg-[#0F1722] border border-[#1E293B] rounded-2xl p-5 shadow-xl glow-rose">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-400">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-lg">
                Interactive Executive Capital Relief Cockpit
              </h2>
              <p className="text-xs text-slate-400">
                Boardroom Touch Sliders: Real-time overdraft bleed and trapped balance sheet exposure
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono-num">
              Macro Benchmark: BB Repo 10.0% • DAP 2022 FAR Cut
            </span>
          </div>
        </div>

        {/* 4 Interactive Sliders */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Slider 1: Unabsorbed Luxury Stock */}
          <div className="bg-[#080C12] border border-[#1E293B] rounded-xl p-3.5 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Unabsorbed Luxury Stock</span>
              <span className="font-mono-num text-[#38BDF8] font-bold">
                {unsoldSqft.toLocaleString()} sq ft
              </span>
            </div>
            <input
              type="range"
              min="15000"
              max="250000"
              step="5000"
              value={unsoldSqft}
              onChange={(e) => setUnsoldSqft(Number(e.target.value))}
              className="w-full accent-[#38BDF8] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono-num">
              <span>15,000</span>
              <span>Default: 65k</span>
              <span>250,000</span>
            </div>
          </div>

          {/* Slider 2: Avg Selling Price / SqFt */}
          <div className="bg-[#080C12] border border-[#1E293B] rounded-xl p-3.5 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Avg Selling Price / SqFt</span>
              <span className="font-mono-num text-emerald-400 font-bold">
                ৳ {avgPriceSqft.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="45000"
              step="500"
              value={avgPriceSqft}
              onChange={(e) => setAvgPriceSqft(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono-num">
              <span>৳10,000</span>
              <span>Default: ৳31.8k</span>
              <span>৳45,000</span>
            </div>
          </div>

          {/* Slider 3: Commercial Bank OD Rate */}
          <div className="bg-[#080C12] border border-[#1E293B] rounded-xl p-3.5 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Bank Overdraft (OD) Rate</span>
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
            <div className="flex justify-between text-[10px] text-slate-500 font-mono-num">
              <span>11.0%</span>
              <span>Default: 14.0%</span>
              <span>18.0%</span>
            </div>
          </div>

          {/* Slider 4: Sales Desk Response Delay */}
          <div className="bg-[#080C12] border border-[#1E293B] rounded-xl p-3.5 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Sales Desk Delay</span>
              <span className="font-mono-num text-amber-300 font-bold">
                {responseDelayHours}h ({attritionPct}% Loss)
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="72"
              step="4"
              value={responseDelayHours}
              onChange={(e) => setResponseDelayHours(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono-num">
              <span>Sub-4m (AIS)</span>
              <span>24h</span>
              <span>72h (78% NRB Drop)</span>
            </div>
          </div>
        </div>

        {/* Real-Time Boardroom Financial Outputs */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[#080C12] border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] text-slate-400 font-medium">Trapped Inventory Capital</div>
            <div className="text-xl sm:text-2xl font-mono-num font-bold text-white mt-1">
              ৳ {trappedCapitalCr.toFixed(2)} Cr
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Across {unsoldSqft.toLocaleString()} sq ft unabsorbed
            </div>
          </div>

          <div className="bg-rose-950/20 border border-rose-500/40 rounded-xl p-3.5 glow-rose">
            <div className="text-[11px] text-rose-300 font-medium flex items-center justify-between">
              <span>Monthly Bank OD Bleed</span>
              <Flame className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-xl sm:text-2xl font-mono-num font-bold text-rose-400 mt-1">
              ৳ {monthlyOdBleedCr.toFixed(2)} Cr / mo
            </div>
            <div className="text-[10px] text-rose-400/80 font-mono-num mt-0.5">
              Daily Loss: ৳ {dailyBleedLakh.toFixed(2)} Lakh / day
            </div>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-3.5 glow-emerald">
            <div className="text-[11px] text-emerald-300 font-medium flex items-center justify-between">
              <span>90-Day Syndicate Unlock</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-mono-num font-bold text-emerald-400 mt-1">
              ৳ {syndicateUnlockCr.toFixed(2)} Cr
            </div>
            <div className="text-[10px] text-emerald-300/80 mt-0.5">
              15% Bulk Corporate Syndicate Liquidation
            </div>
          </div>

          <div className="bg-amber-950/20 border border-amber-500/40 rounded-xl p-3.5">
            <div className="text-[11px] text-amber-300 font-medium flex items-center justify-between">
              <span>NRB Attrition to Dubai/Turkey</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-mono-num font-bold text-amber-300 mt-1">
              {attritionPct}% Drop
            </div>
            <div className="text-[10px] text-amber-300/80 mt-0.5 font-mono-num">
              ~৳ {lostPipelineMonthlyCr.toFixed(2)} Cr lost per month
            </div>
          </div>
        </div>
      </section>

      {/* 2. Single-Site REDMA 2010 Section 14/15 Liquidity Mirror (8-Katha Model) */}
      <section className="bg-[#0F1722] border border-[#1E293B] rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/40 text-[#38BDF8]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-lg">
                Single-Site REDMA 2010 Sec 14/15 Liquidity Mirror (8-Katha Empirical Model)
              </h3>
              <p className="text-xs text-slate-400">
                Exact statutory formulas for mandatory 90-day refunds, delay penalties, and carrying costs
              </p>
            </div>
          </div>

          {/* Quick-load 5 Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 mr-1">Presets:</span>
            {REDMA_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleLoadPreset(preset)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                  selectedPresetName === preset.name
                    ? 'bg-[#38BDF8] text-slate-950 font-bold'
                    : 'bg-[#080C12] text-slate-300 border border-[#1E293B] hover:border-slate-700'
                }`}
              >
                {preset.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Land Area (Katha):</label>
            <input
              type="number"
              value={katha}
              onChange={(e) => setKatha(Number(e.target.value))}
              className="w-full bg-[#080C12] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-white font-mono-num font-bold focus:outline-none focus:border-[#38BDF8]"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Unit Area (Sq Ft):</label>
            <input
              type="number"
              value={unitSqft}
              onChange={(e) => setUnitSqft(Number(e.target.value))}
              className="w-full bg-[#080C12] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-white font-mono-num font-bold focus:outline-none focus:border-[#38BDF8]"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Price / SqFt (BDT):</label>
            <input
              type="number"
              value={pricePerSqft}
              onChange={(e) => setPricePerSqft(Number(e.target.value))}
              className="w-full bg-[#080C12] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-emerald-400 font-mono-num font-bold focus:outline-none focus:border-[#38BDF8]"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Cancelled Units:</label>
            <input
              type="number"
              min="0"
              value={cancelledUnits}
              onChange={(e) => setCancelledUnits(Number(e.target.value))}
              className="w-full bg-[#080C12] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-rose-400 font-mono-num font-bold focus:outline-none focus:border-[#38BDF8]"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Stalled Handover Units:</label>
            <input
              type="number"
              min="0"
              value={stalledUnits}
              onChange={(e) => setStalledUnits(Number(e.target.value))}
              className="w-full bg-[#080C12] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-amber-300 font-mono-num font-bold focus:outline-none focus:border-[#38BDF8]"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Site Bank OD (Crore):</label>
            <input
              type="number"
              step="0.1"
              value={bankOdCrore}
              onChange={(e) => setBankOdCrore(Number(e.target.value))}
              className="w-full bg-[#080C12] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-rose-400 font-mono-num font-bold focus:outline-none focus:border-[#38BDF8]"
            />
          </div>
        </div>

        {/* Detailed Financial Forensic Matrix */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Statutory Formula Breakdown Card */}
          <div className="p-4 rounded-xl bg-[#080C12] border border-[#1E293B] space-y-2.5 text-xs">
            <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1.5 flex items-center justify-between">
              <span>Statutory Formula Audit</span>
              <span className="text-[10px] font-mono-num text-[#38BDF8]">
                Unit Price: ৳ {unitPriceCr.toFixed(2)} Cr
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-900">
              <span className="text-slate-300">
                1. REDMA Sec 14 Mandatory 90-Day Refund:
                <div className="text-[10px] text-slate-500">cancelled × paidMilestone × 0.90</div>
              </span>
              <span className="font-mono-num font-bold text-rose-400">
                ৳ {redmaSec14ShockCr.toFixed(2)} Cr
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-900">
              <span className="text-slate-300">
                2. REDMA Sec 15 Delay Interest (15%/yr):
                <div className="text-[10px] text-slate-500">stalled × paidMilestone × 15%</div>
              </span>
              <span className="font-mono-num font-bold text-amber-300">
                ৳ {redmaSec15PenaltyLakh.toFixed(2)} Lakh / yr
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-900">
              <span className="text-slate-300">
                3. Bank OD Carrying Drag (14%/yr):
                <div className="text-[10px] text-slate-500">odCrore × 0.14 × 100</div>
              </span>
              <span className="font-mono-num font-bold text-rose-400">
                ৳ {bankOdDragLakh.toFixed(2)} Lakh / yr
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-900">
              <span className="text-slate-300">
                4. Landowner Displacement Rent:
                <div className="text-[10px] text-slate-500">(katha / 8) × ৳12 Lakh/yr</div>
              </span>
              <span className="font-mono-num font-bold text-slate-300">
                ৳ {displacementRentLakh.toFixed(2)} Lakh / yr
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-300">
                5. Site Security & Rebar Corrosion Decay:
                <div className="text-[10px] text-slate-500">(katha / 8) × ৳18 Lakh/yr</div>
              </span>
              <span className="font-mono-num font-bold text-slate-300">
                ৳ {siteSecurityDecayLakh.toFixed(2)} Lakh / yr
              </span>
            </div>
          </div>

          {/* Boardroom Liquidity Summary & Verdict */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-rose-950/30 to-[#080C12] border border-rose-500/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-rose-400 font-mono-num">
                  Total Single-Site Annual Bleed
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-num bg-rose-950 text-rose-300 border border-rose-500/40">
                  CRITICAL SQUEEZE
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-mono-num font-extrabold text-white mt-2">
                ৳ {totalSingleSiteBleedCr.toFixed(2)} Cr / yr
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {language === 'bn' ? (
                  <>
                    এই একটি মাত্র ৮-কাঠার সাইটে প্রতি বছর{' '}
                    <strong className="text-rose-400">
                      ৳{totalSingleSiteBleedCr.toFixed(2)} কোটি
                    </strong>{' '}
                    টাকা ধ্বংস হচ্ছে। রিডমা ধারা ১৪-এর আদালত নোটিশ আসলে ১৫ দিনের মধ্যে সাইটের ব্যাংক অ্যাকাউন্ট ফ্রিজ হতে পারে।
                  </>
                ) : (
                  <>
                    On this single 8-katha boutique site alone,{' '}
                    <strong className="text-rose-400">
                      ৳{totalSingleSiteBleedCr.toFixed(2)} Crore
                    </strong>{' '}
                    evaporates annually. A single REDMA Section 14 court notice can freeze project bank accounts within 15 days.
                  </>
                )}
              </p>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-[#0F1722] border border-[#1E293B] text-xs">
              <div className="text-[#38BDF8] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AIS Single-Site Sandbox Cure:</span>
              </div>
              <p className="text-slate-300 text-[11px] mt-1">
                Ring-fence this project into a standalone Trust Bank Escrow SPV, subdivide the cancelled unit into high-velocity 800-1,200 sqft layouts, and deploy the 38-second WhatsApp NRB funnel to liquidate stock in 90 days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Promoter Cognitive Bias Battlecards */}
      <section className="bg-[#0F1722] border border-[#1E293B] rounded-2xl p-5 shadow-xl">
        <div className="pb-3 border-b border-[#1E293B]">
          <h3 className="font-display font-bold text-white text-base">
            3 Promoter Cognitive Bias Battlecards
          </h3>
          <p className="text-xs text-slate-400">
            Psychological & macroeconomic counters for veteran 30-year developers
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {COGNITIVE_BIAS_BATTLECARDS.map((card, i) => (
            <div
              key={card.id}
              className="bg-[#080C12] border border-[#1E293B] rounded-xl p-4 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs font-display font-bold text-[#38BDF8]">
                  <span>Battlecard {i + 1}:</span>
                  <span>{card.title}</span>
                </div>

                <div className="mt-2.5 p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs italic">
                  {card.chairmanQuote}
                </div>

                <div className="mt-3 text-xs text-slate-300">
                  <strong className="text-slate-200 block text-[11px] uppercase tracking-wider mb-1">
                    Forensic Reality:
                  </strong>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {card.economicReality}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="text-[11px] font-semibold text-emerald-400 mb-1 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" /> Rizum Khan Spoken Counter:
                </div>
                <p className="text-xs text-slate-200 italic bg-emerald-950/30 p-2 rounded border border-emerald-500/30">
                  {card.counterMove}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Autonomous Gemini 4 Argon Co-Founder & Search-Grounded Deal Strategist */}
      <section className="bg-[#0F1722] border border-[#1E293B] rounded-2xl p-5 shadow-xl glow-cyan">
        <div className="pb-3 border-b border-[#1E293B] flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-white text-base">
              Autonomous Gemini 4 Argon Co-Founder & Deal Strategist Console
            </h3>
            <p className="text-xs text-slate-400">
              Live macroeconomic deal reasoning, NBR statutory audits, and Google Search grounded counter-moves
            </p>
          </div>
          <span className="text-[10px] font-mono-num px-2 py-0.5 rounded bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
            BOARDROOM STRATEGIST
          </span>
        </div>

        <div className="mt-4">
          <ArgonStrategistChat
            language={language}
            config={aiConfig}
            cockpitStats={{
              trappedCapitalCr,
              monthlyOdBleedCr,
              totalSingleSiteBleedCr,
              redmaSec14ShockCr,
              activePreset: selectedPresetName,
            }}
          />
        </div>
      </section>
    </div>
  );
};
