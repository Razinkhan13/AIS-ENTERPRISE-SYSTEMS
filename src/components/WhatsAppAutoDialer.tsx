import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  MessageSquare,
  Copy,
  ExternalLink,
  Check,
  Send,
  Sparkles,
  Smartphone,
  Globe,
  RotateCcw,
  ShieldCheck,
  Flame,
  ChevronDown,
  History,
  Zap,
} from 'lucide-react';
import { Language, VerifiedTarget } from '../types';
import { VERIFIED_TARGETS, CORPORATE_INFO } from '../data/masterData';
import { copyToClipboardSafe } from '../utils/clipboard';
import { playDialerChime } from '../utils/audio';

interface WhatsAppAutoDialerProps {
  language: Language;
  baseUrl: string;
  selectedTarget?: VerifiedTarget;
  onSelectTarget?: (target: VerifiedTarget) => void;
  onTestLockedClientView: (slug: string) => void;
}

export type CtaStrategy = 'boardroom' | 'nrb_speed' | 'warranty' | 'teaser';

interface DialLogItem {
  id: string;
  timestamp: string;
  targetName: string;
  phone: string;
  strategy: string;
  demoLink: string;
}

export const WhatsAppAutoDialer: React.FC<WhatsAppAutoDialerProps> = ({
  language,
  baseUrl,
  selectedTarget,
  onSelectTarget,
  onTestLockedClientView,
}) => {
  const [activeTarget, setActiveTarget] = useState<VerifiedTarget>(
    selectedTarget || VERIFIED_TARGETS[0]
  );

  // Sync if parent updates selectedTarget
  useEffect(() => {
    if (selectedTarget) {
      setActiveTarget(selectedTarget);
      setCustomPhone(selectedTarget.phone);
    }
  }, [selectedTarget]);

  const [customPhone, setCustomPhone] = useState<string>(
    selectedTarget?.phone || VERIFIED_TARGETS[0].phone
  );
  const [strategy, setStrategy] = useState<CtaStrategy>('boardroom');
  const [ctaLang, setCtaLang] = useState<Language>(language);
  const [isEditingMessage, setIsEditingMessage] = useState<boolean>(false);
  const [editedMessage, setEditedMessage] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [dialLogs, setDialLogs] = useState<DialLogItem[]>(() => {
    const saved = localStorage.getItem('ais_autodialer_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      {
        id: 'log-1',
        timestamp: '11:42 AM Today',
        targetName: 'Sheltech (Pvt.) Ltd.',
        phone: '8801711590123',
        strategy: 'Boardroom Diagnostic',
        demoLink: `${baseUrl}/?demo=sheltech#sandbox`,
      },
    ];
  });

  const demoLink = `${baseUrl}/?demo=${activeTarget.slug}#sandbox`;

  // Standardized clean phone formatter (removes +, spaces, dashes, leading zeroes if starting with 88)
  const cleanPhone = (raw: string) => {
    let cleaned = raw.replace(/[^\d]/g, '');
    if (cleaned.startsWith('01') && cleaned.length === 11) {
      cleaned = '88' + cleaned;
    }
    return cleaned;
  };

  const formattedPhone = cleanPhone(customPhone);

  // CTA Template Generator
  const generateCtaMessage = (
    target: VerifiedTarget,
    strat: CtaStrategy,
    lang: Language,
    link: string
  ): string => {
    if (lang === 'bn') {
      switch (strat) {
        case 'nrb_speed':
          return `আসসালামু আলাইকুম ${target.name} টিম,

আমি এআইএস এন্টারপ্রাইজ সিস্টেমস থেকে রিজুম খান। আমেরিকা, যুক্তরাজ্য ও মধ্যপ্রাচ্যের প্রবাসী বাংলাদেশীরা যখন রাত ২টায় "${target.flagshipProject}" ফ্ল্যাগশিপ প্রজেক্টের খোঁজে ইনকোয়ারি পাঠান—তখন মাত্র ৩৮ সেকেন্ডে সেন্ট্রাল ব্যাংক NRTA কারেন্সি কনভার্সন ও ৩৬ মাসের EMI শিডিউলসহ স্বয়ংক্রিয়ভাবে রেসপন্স পাঠাতে আমরা আপনাদের জন্য একটি ডেডিকেটেড লাইভ স্যান্ডবক্স প্রস্তুত করেছি।

আপনার প্রতিষ্ঠানের জন্য এক্সক্লুসিভ লাইভ প্রোটোটাইপটি দেখতে নিচের লিঙ্কে ট্যাপ করুন:
👉 ${link}

বোর্ডরুম ডায়াগনস্টিক বৈঠকের জন্য আমি সরাসরি চেয়ারম্যান স্যারের সময় প্রত্যাশা করছি।
— রিজুম খান (ফাউন্ডার ও ফাইনাল সিগনেটরি)
AIS Enterprise Systems | ট্রাস্ট ব্যাংক পিএলসি | বিন: 004982103-0101`;

        case 'warranty':
          return `সম্মানিত চেয়ারম্যান স্যার ও পরিচালনা পর্ষদ (${target.name}),

আমি রিজুম খান (AIS Enterprise Systems)। আপনাদের "${target.flagshipProject}" প্রকল্পের আনঅ্যাবজরবড লাক্সারি স্টক ও ১৪% ব্যাংক ওভারড্রাফট ড্র্যাগ নিরসনে আমাদের ৬০ দিনের ১০০% মানি-ব্যাক ওয়ারেন্টি অফার:

"যদি AIS আপনাদের রেসপন্স টাইম সাব-৪ মিনিটে নামিয়ে এনে ৬০ দিনের মধ্যে আমাদের ফির ৫ গুণ সমমূল্যের ভেরিফায়েড ক্রেতা পাইপলাইন তৈরি না করতে পারে, তবে আমরা সম্পূর্ণ ফি ফেরত দেব এবং আপনারা সমস্ত সিস্টেম ও কোড আজীবন ব্যবহার করতে পারবেন।"

আপনাদের সিকিউরড স্যান্ডবক্স ও মূসক-৬.৩ ইনভয়েস দেখতে ভিজিট করুন:
👉 ${link}

— রিজুম খান (ফাউন্ডার ও ফাইনাল সিগনেটরি)
হেডকোয়ার্টার: ১৫ মায়াকানন, বাসাবো, খিলগাঁও, ঢাকা-১২১৪`;

        case 'teaser':
          return `আসসালামু আলাইকুম স্যার। "${target.flagshipProject}"-এর আটকে থাকা মূলধন দ্রুত রিলিজ করতে এবং প্রবাসী ক্রেতাদের ৩৮ সেকেন্ডে কোয়ালিফাই করতে আপনার জন্য প্রস্তুত করা ১-ক্লিক এক্সিকিউটিভ স্যান্ডবক্সটি দেখুন:
👉 ${link}
— রিজুম খান (AIS Enterprise Systems)`;

        case 'boardroom':
        default:
          return `আসসালামু আলাইকুম ${target.name} টিম,

আমি এআইএস এন্টারপ্রাইজ সিস্টেমস থেকে রিজুম খান। আপনাদের ফ্ল্যাগশিপ প্রকল্প "${target.flagshipProject}"-এর অবিক্রিত লাক্সারি ইনভেন্টরি ও ১৪% ব্যাংক ওভারড্রাফট ড্র্যাগ নিয়ে আমরা একটি ১০ সেকেন্ডের এক্সিকিউটিভ লিকুইডিটি অডিট প্রস্তুত করেছি।

আমেরিকা, লন্ডন ও গালফ প্রবাসীদের ২৪/৭ ইনকোয়ারিতে ৩৮ সেকেন্ডে অটোমেটিক রেসপন্স দিয়ে কীভাবে আটকে থাকা মূলধন দ্রুত ছাড় করানো যায়—তা দেখতে আপনাদের ডেডিকেটেড লাইভ স্যান্ডবক্স ডেমো ভিজিট করুন:
👉 ${link}

বোর্ডরুম ডায়াগনস্টিক বৈঠকের জন্য আমি সরাসরি চেয়ারম্যান স্যারের সময় প্রত্যাশা করছি।
ধন্যবাদান্তে,
রিজুম খান (ফাউন্ডার ও ফাইনাল সিগনেটরি)
AIS Enterprise Systems (Army IBA Specialist)
বিন: 004982103-0101 | ট্রাস্ট ব্যাংক পিএলসি`;
      }
    } else {
      switch (strat) {
        case 'nrb_speed':
          return `Dear ${target.name} Leadership & Chairman,

This is Rizum Khan from AIS Enterprise Systems. While Dhaka sleeps at 2:00 AM, high-net-worth US/UK/Gulf diaspora buyers are inquiring about "${target.flagshipProject}". We have engineered an autonomous Turnaround Cockpit that delivers a 38-second qualification with central bank NRTA foreign exchange pricing ($400k+ USD) and a 48-hour priority escrow hold.

Experience your customized interactive live sandbox here:
👉 ${link}

We would be honored to demonstrate this 10-second diagnostic in your boardroom.
Respectfully,
Rizum Khan (Founder & Final Signatory)
AIS Enterprise Systems (BIN: 004982103-0101)
Headquarters: 15 Mayakanon, Khilgaon, Dhaka-1214`;

        case 'warranty':
          return `Dear ${target.name} Board of Directors & Chairman,

This is Rizum Khan from AIS Enterprise Systems (Army IBA Specialist). To address the 14% commercial bank overdraft drag on "${target.flagshipProject}", we stand behind our binding risk-reversal covenant:

"If AIS does not cut inbound lead response time to sub-4 minutes and qualify at least 5x our fee in verified buyer pipeline within 60 days, we refund 100% of our fee and you retain all installed workflows, code, and systems."

Review your tailored executive single-asset sandbox and NBR Mushak-6.3 breakdown here:
👉 ${link}

Respectfully,
Rizum Khan (Founder & Final Signatory)
Trust Bank PLC (Account No: 00110466000494)`;

        case 'teaser':
          return `Hello Sir, regarding the unabsorbed inventory on "${target.flagshipProject}", here is your confidential 1-click executive turnaround prototype & diaspora concierge:
👉 ${link}
— Rizum Khan, Founder & Managing Partner, AIS Enterprise Systems`;

        case 'boardroom':
        default:
          return `Dear ${target.name} Board of Directors & Chairman,

This is Rizum Khan from AIS Enterprise Systems (Army IBA Specialist). We have conducted an executive liquidity diagnosis on "${target.flagshipProject}" regarding the 14% commercial bank overdraft drag and unabsorbed luxury stock.

We have provisioned an autonomous 24/7 NRI/NRB Turnaround Cockpit that cuts inquiry response time to 38 seconds across US/UK/Gulf time zones. Explore your custom live interactive sandbox here:
👉 ${link}

Commercial Covenant: If AIS does not cut your response time to sub-4 minutes and qualify at least 5x our fee in verified buyer pipeline within 60 days, we refund 100% of our fee and you retain all installed systems.

Respectfully,
Rizum Khan (Founder & Final Signatory)
AIS Enterprise Systems (BIN: 004982103-0101)
Headquarters: 15 Mayakanon, Khilgaon, Dhaka-1214`;
      }
    }
  };

  const defaultMsg = generateCtaMessage(activeTarget, strategy, ctaLang, demoLink);
  const activeMessage = isEditingMessage ? editedMessage : defaultMsg;

  // Deep Link URLs
  // 1. Native Mobile WhatsApp protocol: whatsapp://send?phone=...&text=...
  const mobileDeepLink = `whatsapp://send?phone=${formattedPhone}&text=${encodeURIComponent(
    activeMessage
  )}`;
  // 2. Universal Web / API link: https://wa.me/...
  const universalWaLink = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
    activeMessage
  )}`;
  // 3. WhatsApp Web desktop explicit: https://web.whatsapp.com/send?phone=...
  const desktopWebLink = `https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(
    activeMessage
  )}`;

  const copyWithFeedback = (text: string, key: string) => {
    const success = copyToClipboardSafe(text);
    if (success) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleTargetChange = (slug: string) => {
    const t = VERIFIED_TARGETS.find((item) => item.slug === slug);
    if (t) {
      setActiveTarget(t);
      setCustomPhone(t.phone);
      setIsEditingMessage(false);
      if (onSelectTarget) {
        onSelectTarget(t);
      }
    }
  };

  const recordDialLog = (actionType: 'mobile_app' | 'web') => {
    playDialerChime();
    const newLog: DialLogItem = {
      id: `dial-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      targetName: activeTarget.name,
      phone: formattedPhone,
      strategy:
        strategy === 'boardroom'
          ? 'Boardroom Audit'
          : strategy === 'nrb_speed'
          ? '38s NRB Velocity'
          : strategy === 'warranty'
          ? '60-Day 5x Covenant'
          : 'Executive Teaser',
      demoLink: demoLink,
    };
    const updated = [newLog, ...dialLogs.slice(0, 9)];
    setDialLogs(updated);
    try {
      localStorage.setItem('ais_autodialer_logs', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  const handleAutoDialMobile = (e: React.MouseEvent) => {
    recordDialLog('mobile_app');
    // Open the native mobile deep link; if inside iframe or desktop, window.location.href or fallback
    try {
      window.location.href = mobileDeepLink;
    } catch (err) {
      window.open(universalWaLink, '_blank');
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#0F1722] via-[#09101A] to-[#0F1722] border-2 border-emerald-500/50 rounded-2xl p-4 sm:p-6 shadow-2xl glow-emerald">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950">
            <PhoneCall className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-white text-lg tracking-wide">
                WhatsApp Auto-Dialer & Deep Link Engine
              </h2>
              <span className="text-[10px] font-mono-num font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                ⚡ MOBILE PROTOCOL: whatsapp://send
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Generates instant native mobile WhatsApp app intents with pre-filled high-converting boardroom CTAs and isolated client demo links.
            </p>
          </div>
        </div>

        {/* Quick Language Toggle for Pitch */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <span className="text-xs text-slate-400">CTA Language:</span>
          <div className="flex bg-[#080C12] border border-[#1E293B] rounded-lg p-0.5">
            <button
              onClick={() => {
                setCtaLang('en');
                setIsEditingMessage(false);
              }}
              className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                ctaLang === 'en'
                  ? 'bg-[#38BDF8] text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => {
                setCtaLang('bn');
                setIsEditingMessage(false);
              }}
              className={`px-2.5 py-1 rounded text-xs font-bangla font-medium transition cursor-pointer ${
                ctaLang === 'bn'
                  ? 'bg-[#38BDF8] text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🇧🇩 বাংলা
            </button>
          </div>
        </div>
      </div>

      {/* Target Selector & Strategy Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Column: Target Developer & Phone Selector (5 cols) */}
        <div className="md:col-span-5 space-y-3.5">
          <div className="bg-[#080C12] border border-[#1E293B] rounded-xl p-3.5 space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between mb-1.5">
                <span>Select Target Enterprise (20 Verified):</span>
                <span className="text-[10px] font-mono-num text-[#38BDF8]">
                  {activeTarget.category.toUpperCase()}
                </span>
              </label>
              <select
                value={activeTarget.slug}
                onChange={(e) => handleTargetChange(e.target.value)}
                className="w-full bg-[#0F1722] border border-slate-700 text-white rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-400 cursor-pointer"
              >
                {VERIFIED_TARGETS.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.name} ({t.flagshipProject.split('(')[0].trim()})
                  </option>
                ))}
              </select>
            </div>

            {/* Direct Mobile/WhatsApp Number */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Target Mobile / WhatsApp Number:</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono-num">BD +880</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  placeholder="e.g. 8801711590123"
                  className="w-full bg-[#0F1722] border border-slate-700 text-emerald-400 font-mono-num rounded-lg pl-3 pr-20 py-2 text-xs font-bold focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="button"
                  onClick={() => setCustomPhone(activeTarget.phone)}
                  className="absolute right-1.5 top-1.5 px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-300 hover:text-white"
                  title="Reset to verified company phone"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Target Spec Pill */}
            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>Flagship:</span>
                <strong className="text-white truncate max-w-[180px]">
                  {activeTarget.flagshipProject}
                </strong>
              </div>
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>Benchmark Pricing:</span>
                <span className="text-emerald-400 font-mono-num font-bold">
                  {activeTarget.bdtPrice}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>Vulnerability:</span>
                <span className="text-rose-400 text-[10px] truncate max-w-[200px]">
                  {activeTarget.diagnosedVulnerability}
                </span>
              </div>
            </div>
          </div>

          {/* Strategy Selector Buttons */}
          <div className="bg-[#080C12] border border-[#1E293B] rounded-xl p-3.5 space-y-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono-num block">
              Call-to-Action Strategy:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  id: 'boardroom',
                  label: 'Boardroom Audit',
                  desc: '10s Overdraft Diagnosis',
                  icon: '🏗️',
                },
                {
                  id: 'nrb_speed',
                  label: '38s NRB Velocity',
                  desc: 'Diaspora Repatriation',
                  icon: '⚡',
                },
                {
                  id: 'warranty',
                  label: '60-Day 5× Covenant',
                  desc: '100% Fee Return Guarantee',
                  icon: '🛡️',
                },
                {
                  id: 'teaser',
                  label: 'Executive Teaser',
                  desc: '2-Line Direct Follow-Up',
                  icon: '💬',
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setStrategy(item.id as CtaStrategy);
                    setIsEditingMessage(false);
                  }}
                  className={`p-2.5 rounded-lg text-left transition cursor-pointer flex flex-col justify-between ${
                    strategy === item.id
                      ? 'bg-emerald-950/70 border border-emerald-500 text-white glow-emerald'
                      : 'bg-[#0F1722] border border-[#1E293B] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <span>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 leading-tight">
                    {item.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Message Preview & Deep Link Dispatcher (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-3">
          {/* Message Preview Box */}
          <div className="bg-[#080C12] border border-[#1E293B] rounded-xl p-3.5 flex-1 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pre-Filled WhatsApp Message Payload:</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (!isEditingMessage) {
                      setEditedMessage(defaultMsg);
                    }
                    setIsEditingMessage(!isEditingMessage);
                  }}
                  className="text-[11px] text-[#38BDF8] hover:underline cursor-pointer font-medium"
                >
                  {isEditingMessage ? 'Done Editing' : '✏️ Customize Text'}
                </button>
                {isEditingMessage && (
                  <button
                    onClick={() => {
                      setIsEditingMessage(false);
                      setEditedMessage('');
                    }}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Textarea or formatted preview */}
            {isEditingMessage ? (
              <textarea
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                rows={8}
                className="w-full bg-[#0F1722] border border-emerald-500/60 rounded-lg p-2.5 text-xs text-slate-200 font-sans leading-relaxed focus:outline-none"
              />
            ) : (
              <div className="bg-[#0F1722] rounded-lg p-3 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto font-sans border border-slate-800/80">
                {activeMessage}
              </div>
            )}

            {/* Embedded Deep Link Verification */}
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] flex items-center justify-between gap-2">
              <span className="text-slate-400 truncate">
                Attached Demo Link:{' '}
                <strong className="text-[#38BDF8] font-mono-num">{demoLink}</strong>
              </span>
              <button
                onClick={() => onTestLockedClientView(activeTarget.slug)}
                className="shrink-0 text-[#38BDF8] hover:underline flex items-center gap-1 text-[11px] font-bold"
              >
                <span>👁️ Test View</span>
              </button>
            </div>
          </div>

          {/* 1-Tap Auto-Dial & Deep Link Trigger Bar */}
          <div className="bg-[#080C12] border border-[#1E293B] rounded-xl p-3.5 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* PRIMARY: Native Mobile WhatsApp Intent (whatsapp://send) */}
              <a
                href={mobileDeepLink}
                onClick={handleAutoDialMobile}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-950 glow-emerald"
                title="Directly opens WhatsApp app on Android / iOS with pre-filled conversation"
              >
                <PhoneCall className="w-4 h-4 fill-current" />
                <span>⚡ 1-Tap WhatsApp Auto-Dial</span>
              </a>

              {/* SECONDARY: Web/Universal fallback */}
              <a
                href={universalWaLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => recordDialLog('web')}
                className="py-3 px-4 rounded-xl bg-[#0F1722] hover:bg-slate-800 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                title="Open in WhatsApp Web browser tab"
              >
                <Globe className="w-4 h-4" />
                <span>Open in Web</span>
              </a>
            </div>

            {/* Quick Copy Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyWithFeedback(mobileDeepLink, 'deep-link')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedKey === 'deep-link' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Deep Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Deep Link URL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => copyWithFeedback(activeMessage, 'full-msg')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedKey === 'full-msg' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Message Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Message Text</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[10px] font-mono-num text-slate-500">
                Recipient: <span className="text-emerald-400">+{formattedPhone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Outbound Auto-Dial Dispatch History Strip */}
      {dialLogs.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>Recent Auto-Dial Dispatches:</span>
            </span>
            <button
              onClick={() => {
                setDialLogs([]);
                localStorage.removeItem('ais_autodialer_logs');
              }}
              className="text-[10px] text-slate-500 hover:text-slate-300"
            >
              Clear Log
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 text-[11px]">
            {dialLogs.map((log) => (
              <div
                key={log.id}
                className="bg-[#080C12] border border-slate-800 rounded-lg px-2.5 py-1.5 flex items-center gap-2 shrink-0 text-slate-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white">{log.targetName}</span>
                <span className="text-slate-400 font-mono-num">+{log.phone}</span>
                <span className="text-[10px] text-emerald-400 font-mono-num px-1 py-0.5 rounded bg-emerald-950/60">
                  {log.strategy}
                </span>
                <span className="text-[10px] text-slate-500">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
