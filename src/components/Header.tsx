import React from 'react';
import { Shield, Lock, Globe, PlusCircle, Wifi, Users, ChevronDown } from 'lucide-react';
import { Language } from '../types';
import { CORPORATE_INFO, VERIFIED_TARGETS } from '../data/masterData';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
  language: Language;
  onLanguageToggle: () => void;
  lockedAmountBDT: number;
  activeTenant: string;
  onTenantChange: (tenant: string) => void;
  onOpenDepositModal: () => void;
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  language,
  onLanguageToggle,
  lockedAmountBDT,
  activeTenant,
  onTenantChange,
  onOpenDepositModal,
  isOnline,
}) => {
  const targetBDT = CORPORATE_INFO.targetGoalBDT;
  const percentage = Math.min(100, Math.round((lockedAmountBDT / targetBDT) * 100));
  const formatLakhOrCr = (bdt: number) => {
    if (bdt >= 10000000) {
      return `৳${(bdt / 10000000).toFixed(2)} Cr`;
    }
    return `৳${(bdt / 100000).toFixed(1)} Lakh`;
  };

  const tabs = [
    { id: 'whatsapp', label: '1-Tap WhatsApp', labelBn: '১-ট্যাপ হোয়াটসঅ্যাপ', icon: '📱' },
    { id: 'audit', label: '10s Cold Audit', labelBn: '১০সে. কোল্ড অডিট', icon: '🏗️' },
    { id: 'approve', label: 'Approve & Lock', labelBn: 'অ্যাপ্রুভ ও লক', icon: '🛡️' },
    { id: 'invoice', label: 'Mushak-6.3', labelBn: 'মূসক-৬.৩ চালান', icon: '🧾' },
    { id: 'sandbox', label: 'Client Sandbox', labelBn: 'ক্লায়েন্ট স্যান্ডবক্স', icon: '🏢' },
    { id: 'vault', label: '4-in-1 Vault', labelBn: '৪-ইন-১ ভল্ট', icon: '📄' },
    { id: 'webhook', label: 'Webhook & RLS', labelBn: 'ওয়েবহুক ও আরএলএস', icon: '⚡' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#070A0F]/90 backdrop-blur-xl border-b border-[#1E293B]/80 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
      {/* Top Corporate Status Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Brand identity & Founder credentials */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-[#38BDF8]/60 glow-cyan shadow-[inset_0_1px_0_0_rgba(56,189,248,0.4)] overflow-hidden shrink-0">
            <img
              src="/assets/aistudio/images_3598e51a.jfif"
              alt="AIS Enterprise Systems Official Logo"
              className="w-full h-full object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#070A0F]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-white text-sm sm:text-base tracking-wide">
                AIS ENTERPRISE SYSTEMS
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono-num rounded bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                ARMY IBA SPECIALIST
              </span>
            </div>
            <p className="text-slate-400 text-[11px] font-sans flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-200 font-medium">Rizum Khan (Founder & Final Signatory)</span>
              <span className="text-slate-600">•</span>
              <span className="font-mono-num text-slate-300">BIN: 004982103-0101</span>
              <span className="hidden md:inline text-slate-600">•</span>
              <span className="hidden md:inline text-slate-400">HQ: 15 Mayakanon, Khilgaon, Dhaka</span>
            </p>
          </div>
        </div>

        {/* Live Scoreboard Pill & Quick Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* 90-Day 1-Crore Scoreboard Pill with Specular Highlight */}
          <div className="flex items-center gap-2 bg-[#0F1722]/80 border border-[#1E293B] rounded-full px-3 py-1 shadow-[inset_0_1px_0_0_rgba(56,189,248,0.22)] backdrop-blur-md">
            <div className="flex flex-col text-right">
              <div className="flex items-center gap-1 text-[11px]">
                <span className="text-emerald-400 font-bold font-mono-num">
                  {formatLakhOrCr(lockedAmountBDT)}
                </span>
                <span className="text-slate-500 font-mono-num">/</span>
                <span className="text-slate-400 font-mono-num">৳1.00 Cr Net</span>
              </div>
              <div className="w-24 sm:w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#38BDF8] to-emerald-400 transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.4)]"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] font-mono-num font-bold px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 shadow-[inset_0_1px_0_0_rgba(16,185,129,0.3)]">
              {percentage}%
            </span>
          </div>

          {/* Dual-Language Toggle Button */}
          <button
            onClick={onLanguageToggle}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0F1722]/80 hover:bg-slate-800 border border-[#1E293B] hover:border-[#38BDF8]/40 text-slate-200 text-xs font-medium transition cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
            title="Toggle Cultured Business Bangla / Boardroom English"
          >
            <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="font-bangla font-semibold">
              {language === 'en' ? '🇧🇩 বাংলা' : '🇬🇧 English'}
            </span>
          </button>

          {/* Rizum Khan + Lock Deposit Action */}
          <button
            onClick={onOpenDepositModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_12px_rgba(16,185,129,0.3)] transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lock Deposit</span>
            <span className="sm:hidden">Lock</span>
          </button>
        </div>
      </div>

      {/* Secondary Multi-Tenant & Network Status Bar */}
      <div className="bg-[#0b111a] border-t border-[#1E293B]/70 px-3 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        {/* Multi-Tenant RLS Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-slate-400">
            <Users className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="hidden sm:inline">Active Supabase RLS Tenant:</span>
          </div>
          <div className="relative">
            <select
              value={activeTenant}
              onChange={(e) => onTenantChange(e.target.value)}
              className="bg-[#0F1722] border border-[#1E293B] text-slate-200 font-mono-num text-[11px] rounded px-2.5 py-1 pr-6 focus:outline-none focus:border-[#38BDF8] cursor-pointer appearance-none"
            >
              <option value="superadmin">👑 Rizum Khan (SuperAdmin - Full Access)</option>
              <optgroup label="Tier-1 Developer Isolated Tenants">
                {VERIFIED_TARGETS.filter((t) => t.category === 'tier1').map((t) => (
                  <option key={t.slug} value={t.slug}>
                    🏢 {t.name} (tenant_slug: {t.slug})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Fast-Cash E-Com COD Tenants">
                {VERIFIED_TARGETS.filter((t) => t.category === 'ecom').map((t) => (
                  <option key={t.slug} value={t.slug}>
                    📦 {t.name} (tenant_slug: {t.slug})
                  </option>
                ))}
              </optgroup>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Network & Protocol Status */}
        <div className="flex items-center gap-3 font-mono-num text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">Dhaka 4G: {isOnline ? 'ONLINE' : 'OFFLINE QUEUE'}</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-1 text-slate-400">
            <Lock className="w-3 h-3 text-[#38BDF8]" />
            <span>RLS Enforced: JWT Claims</span>
          </div>
        </div>
      </div>

      {/* 7 Thumb-Friendly Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-2 sm:px-4 py-1.5">
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-7 gap-1 sm:gap-1.5">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#0F1722] text-[#38BDF8] border border-[#38BDF8]/60 glow-cyan shadow-[inset_0_1px_0_0_rgba(56,189,248,0.35)] font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0F1722]/60 border border-transparent hover:border-slate-800'
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span className="truncate">
                  {language === 'bn' ? tab.labelBn : tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
