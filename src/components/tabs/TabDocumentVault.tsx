import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Edit3,
  RotateCcw,
  Check,
  Copy,
  BookOpen,
  Briefcase,
  Shield,
  Layers,
  Download,
} from 'lucide-react';
import { Language } from '../../types';
import { CORPORATE_INFO, VERIFIED_TARGETS } from '../../data/masterData';
import { copyToClipboardSafe } from '../../utils/clipboard';

interface TabDocumentVaultProps {
  language: Language;
}

export const TabDocumentVault: React.FC<TabDocumentVaultProps> = ({ language }) => {
  const [activeDoc, setActiveDoc] = useState<'manual' | 'dossier' | 'msa' | 'invoice' | 'stitch_blueprint'>('manual');
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [copiedDoc, setCopiedDoc] = useState<boolean>(false);

  const docs = [
    { id: 'manual', label: 'Doc 1: Master Operating Manual (৳1Cr Math)', icon: '📘' },
    { id: 'dossier', label: 'Doc 2: Tier-1 RE Turnaround Dossier (10 Giants)', icon: '🏛️' },
    { id: 'msa', label: 'Doc 3: 1-Page Client Proposal & MSA', icon: '📜' },
    { id: 'invoice', label: 'Doc 4: Formal NBR Mushak-6.3 Tax Invoice', icon: '🧾' },
    { id: 'stitch_blueprint', label: 'Doc 5: Google Stitch UI Spec & Blueprint', icon: '🎨' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCurrentDoc = () => {
    const el = document.getElementById('printable-vault-area');
    if (el) {
      copyToClipboardSafe(el.innerText);
      setCopiedDoc(true);
      setTimeout(() => setCopiedDoc(false), 2000);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Document Selector & Action Ribbon */}
      <section className="no-print bg-[#0F1722] border border-[#1E293B] rounded-2xl p-4 sm:p-5 shadow-xl glow-cyan">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/40 text-[#38BDF8]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-base">
                AIS 4-in-1 Document Vault & Statutory Exporter
              </h2>
              <p className="text-xs text-slate-400">
                Print-isolated A4 sheets with inline editing and legal sign-off
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditable(!isEditable)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                isEditable
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditable ? 'Editing Enabled' : 'Enable Inline Edit'}</span>
            </button>

            <button
              onClick={handleCopyCurrentDoc}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              {copiedDoc ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            <a
              href="/ais_command_center.html"
              download="ais_command_center.html"
              className="px-3.5 py-1.5 rounded-xl bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-[#38BDF8]/20"
              title="Download standalone single-file zero-cost HTML application"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download HTML</span>
            </a>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-950"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4 / PDF</span>
            </button>
          </div>
        </div>

        {/* 5 Tabs */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {docs.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDoc(d.id as any)}
              className={`p-2.5 rounded-xl text-xs font-medium text-left transition cursor-pointer truncate ${
                activeDoc === d.id
                  ? 'bg-[#38BDF8] text-slate-950 font-bold shadow-md'
                  : 'bg-[#080C12] text-slate-300 border border-[#1E293B] hover:border-slate-700'
              }`}
            >
              <span>{d.icon} </span>
              <span>{d.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* A4 Printable Document Container */}
      <div
        id="printable-vault-area"
        contentEditable={isEditable}
        suppressContentEditableWarning={true}
        className="bg-white text-[#0F1722] rounded-2xl p-6 sm:p-12 shadow-2xl border border-slate-300 font-sans max-w-4xl mx-auto min-h-[900px] leading-relaxed selection:bg-[#38BDF8]/30"
      >
        {/* DOCUMENT 1: MASTER OPERATING MANUAL */}
        {activeDoc === 'manual' && (
          <div className="space-y-6">
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between gap-4">
              <div className="w-14 h-14 rounded-full border border-slate-300 overflow-hidden shrink-0 shadow-sm bg-slate-900">
                <img
                  src="/assets/aistudio/images_3598e51a.jfif"
                  alt="AIS Enterprise Systems Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center flex-1">
                <div className="text-xs uppercase tracking-widest font-bold text-slate-500 font-mono-num">
                  CONFIDENTIAL • BOARDROOM OPERATING DIRECTIVE
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 mt-1 font-display">
                  AIS Enterprise Systems — 90-Day ৳1 Crore Net Profit Architecture
                </h1>
                <p className="text-xs text-slate-600 mt-1">
                  Founder & Final Signatory: <strong>Rizum Khan</strong> • AI Co-Founder: <strong>Gemini 4 Argon</strong>
                </p>
              </div>
              <div className="text-right text-[11px] font-mono-num text-slate-500 shrink-0 hidden sm:block">
                <div>DOC REF: AIS-OP-01</div>
                <div>DHAKA-1214</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono-num bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <strong>Primary Objective:</strong> ৳1,00,00,000 (1.0 Crore BDT) Liquid Net Profit
              </div>
              <div>
                <strong>Time Horizon:</strong> 90 Calendar Days
              </div>
              <div>
                <strong>Hardware Stack:</strong> Windows PC + Android Phone
              </div>
              <div>
                <strong>Software Cost:</strong> 100% Free & Open Source ($0 / ৳0 SaaS)
              </div>
            </div>

            <div className="text-xs text-slate-800 space-y-3">
              <h2 className="font-bold text-sm text-slate-900 uppercase border-b border-slate-300 pb-1">
                1. Operating Directive (95% AI / 5% Human-in-the-Loop)
              </h2>
              <p>
                Gemini 4 Argon autonomously performs 95% of engineering, lead scoring, forensic financial auditing, WhatsApp outreach scripts, and statutory Mushak-6.3 tax invoicing.
              </p>
              <p>
                Rizum Khan executes only two high-value actions:
                <br />
                <strong>(1)</strong> Attending high-level boardroom meetings with Chairmen and Managing Directors in Dhaka.
                <br />
                <strong>(2)</strong> Clicking "Approve & Lock Funds" once the client's 50% mobilization deposit hits Trust Bank PLC (Account: 00110466000494) or verified bKash/Nagad channels.
              </p>

              <h2 className="font-bold text-sm text-slate-900 uppercase border-b border-slate-300 pb-1 mt-4">
                2. The ৳1.00 Crore Mathematical Trajectory
              </h2>
              <div className="grid grid-cols-2 gap-3 text-[11px] font-mono-num">
                <div className="p-2.5 bg-slate-100 rounded border border-slate-300">
                  <div className="font-bold text-slate-900">PATH A: 4-CLIENT ENTERPRISE MIX</div>
                  <div className="mt-1">• 2× Tier-1 Flagship Turnarounds @ ৳46L = ৳92.00 Lakh</div>
                  <div>• 2× Tier-2 Sandboxes @ ৳12L = ৳24.00 Lakh</div>
                  <div className="mt-1 font-bold text-emerald-800">Total: ৳1.16 Cr Gross / ৳1.00 Cr Net</div>
                </div>

                <div className="p-2.5 bg-slate-100 rounded border border-slate-300">
                  <div className="font-bold text-slate-900">PATH B: 3-STREAM VOLUME MIX</div>
                  <div className="mt-1">• Stream A: 50× E-Com COD Shields @ ৳30k = ৳15.00 Lakh</div>
                  <div>• Stream B: 15× Mid-Market RE @ ৳1.40L = ৳21.00 Lakh</div>
                  <div>• Stream C: Tier-1 Flagship Turnaround = ৳68.10 Lakh</div>
                  <div className="mt-1 font-bold text-emerald-800">Total: ৳1,04,10,000 BDT</div>
                </div>
              </div>

              <h2 className="font-bold text-sm text-slate-900 uppercase border-b border-slate-300 pb-1 mt-4">
                3. The Binding Risk-Reversal Warranty
              </h2>
              <p className="bg-emerald-50 border border-emerald-300 p-3 rounded font-serif italic text-emerald-950">
                "{CORPORATE_INFO.warranty}"
              </p>
            </div>
          </div>
        )}

        {/* DOCUMENT 2: TIER-1 RE TURNAROUND DOSSIER */}
        {activeDoc === 'dossier' && (
          <div className="space-y-6">
            <div className="border-b-2 border-slate-900 pb-4 text-center">
              <div className="text-xs uppercase tracking-widest font-bold text-slate-500 font-mono-num">
                AIS STRATEGIC MARKET INTELLIGENCE
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-1 font-display">
                Tier-1 Real Estate Liquidity Vulnerability Matrix
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                Audited Top 10 Real Estate Developers in Dhaka, Bangladesh
              </p>
            </div>

            <div className="overflow-x-auto text-[11px]">
              <table className="w-full border-collapse border border-slate-300 text-left">
                <thead>
                  <tr className="bg-slate-100 font-bold text-slate-900">
                    <th className="p-2 border border-slate-300">#</th>
                    <th className="p-2 border border-slate-300">Developer & Year</th>
                    <th className="p-2 border border-slate-300">Flagship Asset & Spec</th>
                    <th className="p-2 border border-slate-300">Diagnosed Liquidity Vulnerability</th>
                    <th className="p-2 border border-slate-300">Custom AIS Turnaround Solution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 text-slate-800">
                  {VERIFIED_TARGETS.filter((t) => t.category === 'tier1').map((t, idx) => (
                    <tr key={t.id}>
                      <td className="p-2 border border-slate-300 font-mono-num font-bold text-center">
                        {idx + 1}
                      </td>
                      <td className="p-2 border border-slate-300 font-semibold">
                        {t.name}
                        <div className="text-[10px] text-slate-500 font-normal">Est. {t.established}</div>
                      </td>
                      <td className="p-2 border border-slate-300">
                        <strong>{t.flagshipProject}</strong>
                        <div className="text-[10px] text-slate-600">{t.unitSpec}</div>
                        <div className="text-[10px] font-mono-num font-bold text-emerald-800">{t.bdtPrice}</div>
                      </td>
                      <td className="p-2 border border-slate-300 text-[10px] leading-tight">
                        {t.diagnosedVulnerability}
                      </td>
                      <td className="p-2 border border-slate-300 text-[10px] text-slate-900 font-medium leading-tight">
                        {t.customSolution}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DOCUMENT 3: 1-PAGE CLIENT PROPOSAL & MSA */}
        {activeDoc === 'msa' && (
          <div className="space-y-6">
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between gap-4">
              <div className="w-14 h-14 rounded-full border border-slate-300 overflow-hidden shrink-0 shadow-sm bg-slate-900">
                <img
                  src="/assets/aistudio/images_3598e51a.jfif"
                  alt="AIS Enterprise Systems Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center flex-1">
                <div className="text-xs uppercase tracking-widest font-bold text-slate-500 font-mono-num">
                  BINDING COMMERCIAL COVENANT & TURNAROUND AGREEMENT
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 mt-1 font-display">
                  Master Service Agreement & Turnaround Retainer
                </h1>
                <p className="text-xs text-slate-600 mt-1">
                  Ref: AIS-MSA-2026-90D • Supplier BIN: <strong>{CORPORATE_INFO.nbr.bin}</strong>
                </p>
              </div>
              <div className="text-right text-[11px] font-mono-num text-slate-500 shrink-0 hidden sm:block">
                <div>ESCROW: TRUST BANK</div>
                <div>A/C: 00110466000494</div>
              </div>
            </div>

            <div className="text-xs text-slate-800 space-y-3 leading-relaxed">
              <p>
                This Master Service Agreement is entered into between <strong>AIS Enterprise Systems (Army IBA Specialist)</strong> ("Turnaround Architect"), headquartered at {CORPORATE_INFO.hqAddress}, represented by <strong>Rizum Khan</strong> (Founder & Final Signatory), and the Client Developer ("Client").
              </p>

              <h3 className="font-bold text-sm text-slate-900 uppercase border-b border-slate-300 pb-1">
                Article 1: Scope of Work (The 90-Day Turnaround Cockpit)
              </h3>
              <p>
                1. Deployment of autonomous 24/7 Meta Cloud API Webhook and Gemini 2.5 Flash qualification engine, answering inbound diaspora inquiries from US, UK, and UAE within 38 seconds.
                <br />
                2. Ring-fenced Trust Bank PLC Escrow register integration for priority unit holds and Saf-Kabala deed acceleration.
                <br />
                3. Sub-division and syndicate packaging of stagnant luxury inventory to clear commercial bank overdrafts compounding at 14% to 17%.
              </p>

              <h3 className="font-bold text-sm text-slate-900 uppercase border-b border-slate-300 pb-1 mt-4">
                Article 2: Commercial Terms & Milestones
              </h3>
              <p>
                • <strong>Total Engagement Consideration:</strong> ৳ 46,00,000 BDT (Forty-Six Lakh Taka) + Statutory 5% VAT.
                <br />
                • <strong>Mobilization Retainer:</strong> 50% (৳ 23,00,000 BDT) due immediately upon signature.
                <br />
                • <strong>Go-Live Milestone:</strong> 50% (৳ 23,00,000 BDT) due upon Day-14 full system go-live.
                <br />
                • <strong>Zero Third-Party Markup:</strong> 0% markup on Meta Cloud API or messaging gateway pass-through expenses.
              </p>

              <h3 className="font-bold text-sm text-slate-900 uppercase border-b border-slate-300 pb-1 mt-4">
                Article 3: Absolute Risk-Reversal Warranty
              </h3>
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded font-serif italic text-emerald-950">
                "{CORPORATE_INFO.warranty}"
              </div>

              <div className="pt-8 grid grid-cols-2 gap-8 text-xs">
                <div>
                  <div className="border-b border-slate-900 w-44 mb-1"></div>
                  <div className="font-bold text-slate-900">{CORPORATE_INFO.founder}</div>
                  <div className="text-slate-600">Founder & Final Signatory</div>
                  <div className="text-slate-500">{CORPORATE_INFO.brandName}</div>
                </div>

                <div className="text-right">
                  <div className="border-b border-slate-900 w-44 mb-1 ml-auto"></div>
                  <div className="font-bold text-slate-900">Authorized Signatory</div>
                  <div className="text-slate-600">Managing Director / Chairman</div>
                  <div className="text-slate-500">Client Real Estate Entity</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT 4: OFFICIAL MUSHAK-6.3 FORM */}
        {activeDoc === 'invoice' && (
          <div className="space-y-4">
            <div className="text-center border-b-2 border-slate-900 pb-3">
              <div className="text-xs font-bangla font-bold tracking-wider text-slate-800">
                গণপ্রজাতন্ত্রী বাংলাদেশ সরকার • জাতীয় রাজস্ব বোর্ড
              </div>
              <h2 className="text-2xl font-bold font-bangla text-slate-900">
                কর চালানপত্র (মূসক-৬.৩)
              </h2>
              <div className="text-xs font-bangla text-slate-600">
                [বিধি ৪০ এর উপ-বিধি (১) এর দফা (গ) দ্রষ্টব্য]
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono-num border-b border-slate-200 pb-2">
              <div>চালান নং: <strong>2026-2027-DHK-0482</strong></div>
              <div className="text-right">তারিখ: <strong>2026-10-20</strong></div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded border border-slate-200">
              <div>
                <strong>সরবরাহকারী:</strong> {CORPORATE_INFO.brandName}<br />
                <strong>স্বত্বাধিকারী:</strong> {CORPORATE_INFO.founder}<br />
                <strong>বিআইএন (BIN):</strong> {CORPORATE_INFO.nbr.bin}<br />
                <strong>ঠিকানা:</strong> {CORPORATE_INFO.hqAddress}
              </div>
              <div>
                <strong>সেবা কোড:</strong> {CORPORATE_INFO.nbr.serviceCode} ({CORPORATE_INFO.nbr.serviceDescription})<br />
                <strong>ব্যাংক:</strong> {CORPORATE_INFO.trustBank.bankName}<br />
                <strong>হিসাব নং:</strong> {CORPORATE_INFO.trustBank.accountNumber}<br />
                <strong>শাখা:</strong> {CORPORATE_INFO.trustBank.branch}
              </div>
            </div>

            <table className="w-full text-left text-xs border border-slate-300 border-collapse mt-3">
              <thead>
                <tr className="bg-slate-100 font-bold border border-slate-300">
                  <th className="p-2 border border-slate-300">বিবরণ</th>
                  <th className="p-2 border border-slate-300 text-right">মূল্য (টাকা)</th>
                  <th className="p-2 border border-slate-300 text-right">মূসক (৫%)</th>
                  <th className="p-2 border border-slate-300 text-right">সর্বমোট (টাকা)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border border-slate-300">
                  <td className="p-2 border border-slate-300">
                    ৫০% মোবিলাইজেশন রিটেইনার — টার্নঅ্যারাউন্ড ককপিট ও এসক্রো সিস্টেম
                  </td>
                  <td className="p-2 border border-slate-300 text-right font-mono-num">
                    ২৩,০০,০০০
                  </td>
                  <td className="p-2 border border-slate-300 text-right font-mono-num">
                    ১,১৫,০০০
                  </td>
                  <td className="p-2 border border-slate-300 text-right font-mono-num font-bold">
                    ২৪,১৫,০০০
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="pt-8 flex justify-between text-xs">
              <div className="text-slate-600">
                মুদ্রণ তারিখ: 2026-10-20 • ঢাকা, বাংলাদেশ
              </div>
              <div className="text-right">
                <div className="border-b border-slate-900 w-44 mb-1 ml-auto"></div>
                <div className="font-bold text-slate-900">{CORPORATE_INFO.founder}</div>
                <div className="text-slate-600 font-mono-num">{CORPORATE_INFO.founderTitle}</div>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT 5: GOOGLE STITCH UI SPEC & MASTER BLUEPRINT */}
        {activeDoc === 'stitch_blueprint' && (
          <div className="space-y-6">
            <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <span className="text-[10px] font-mono-num font-bold uppercase tracking-wider text-slate-500">
                  SYSTEM SPECIFICATION • CONFIDENTIAL
                </span>
                <h1 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                  GOOGLE STITCH DESIGN SYSTEM MASTER BLUEPRINT
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  Universal Design Constitution, Token Architecture & Zero-Cost Open-Source Stack
                </p>
              </div>
              <div className="text-right text-xs font-mono-num text-slate-700">
                <div>Source: <strong className="text-slate-900">AIS Enterprise Systems</strong></div>
                <div>Architect: <strong>Gemini 4 Argon</strong></div>
                <div>Final Signatory: <strong>Rizum Khan</strong></div>
              </div>
            </div>

            {/* Design Tokens Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="border border-slate-300 rounded-xl p-3 bg-slate-50">
                <div className="font-bold text-slate-900 mb-1">Color Palette (Obsidian & Cyan)</div>
                <div className="space-y-1 font-mono-num text-[11px] text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-[#080C12] border border-slate-400 inline-block shrink-0" />
                    <span>Canvas: <strong>#080C12</strong> (Obsidian)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-[#0F1722] border border-slate-400 inline-block shrink-0" />
                    <span>Card: <strong>#0F1722</strong> (Deep Navy)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-[#38BDF8] inline-block shrink-0" />
                    <span>Accent: <strong>#38BDF8</strong> (Electric Cyan)</span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-300 rounded-xl p-3 bg-slate-50">
                <div className="font-bold text-slate-900 mb-1">Financial Semantic Tokens</div>
                <div className="space-y-1 font-mono-num text-[11px] text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-[#10B981] inline-block shrink-0" />
                    <span>Success/Locked: <strong>#10B981</strong> (Emerald)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-[#F43F5E] inline-block shrink-0" />
                    <span>OD Bleed/Sec 14: <strong>#F43F5E</strong> (Rose)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-[#F59E0B] inline-block shrink-0" />
                    <span>Delay Drag: <strong>#F59E0B</strong> (Amber)</span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-300 rounded-xl p-3 bg-slate-50">
                <div className="font-bold text-slate-900 mb-1">Typography Hierarchy</div>
                <div className="space-y-1 text-[11px] text-slate-700">
                  <div>Display: <strong className="font-display">Syne</strong> (700/800 weight)</div>
                  <div>Primary UI: <strong>DM Sans</strong> (400/500/700)</div>
                  <div>Numbers/Code: <strong className="font-mono-num">JetBrains Mono</strong></div>
                  <div>Bangla: <strong className="font-bangla">Noto Sans Bengali</strong></div>
                </div>
              </div>
            </div>

            {/* Statutory Parameters & Operational Covenant */}
            <div className="border border-slate-300 rounded-xl p-4 bg-slate-50 text-xs space-y-2">
              <div className="font-bold text-slate-900 uppercase font-mono-num text-[11px]">
                Statutory Corporate Specifications:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800">
                <div>
                  <strong>Legal Brand:</strong> {CORPORATE_INFO.brandName}<br />
                  <strong>BIN:</strong> {CORPORATE_INFO.nbr.bin} (Service Code {CORPORATE_INFO.nbr.serviceCode} • 5% VAT)<br />
                  <strong>Headquarters:</strong> {CORPORATE_INFO.hqAddress}
                </div>
                <div>
                  <strong>Primary Bank:</strong> {CORPORATE_INFO.trustBank.bankName} (A/C: {CORPORATE_INFO.trustBank.accountNumber})<br />
                  <strong>MFS Channels:</strong> bKash: {CORPORATE_INFO.mfs.bkash} | Nagad: {CORPORATE_INFO.mfs.nagad}<br />
                  <strong>Operating Target:</strong> ৳1,00,00,000 Net Liquid Profit in 90 Days
                </div>
              </div>
              <div className="pt-2 border-t border-slate-300 italic font-serif text-slate-700">
                "{CORPORATE_INFO.warranty}"
              </div>
            </div>

            {/* Embedded Live Stitch Preview Asset */}
            <div className="no-print border-2 border-slate-300 rounded-xl overflow-hidden shadow-inner bg-slate-950 p-2 space-y-2">
              <div className="flex items-center justify-between text-xs px-2 text-slate-300">
                <span className="font-mono-num font-semibold text-[#38BDF8] flex items-center gap-1.5">
                  <span>🎨 Stitch Preview Asset:</span>
                  <code className="text-slate-400">public/assets/aistudio/Stitch_-_Preview_e1cd7a27.html</code>
                </span>
                <a
                  href="/assets/aistudio/Stitch_-_Preview_e1cd7a27.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[#38BDF8] font-mono-num text-[11px] transition"
                >
                  Open in Full Window ↗
                </a>
              </div>
              <div className="w-full h-96 rounded-lg overflow-hidden border border-slate-800 bg-[#191a1f]">
                <iframe
                  src="/assets/aistudio/Stitch_-_Preview_e1cd7a27.html"
                  title="Stitch Preview"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between text-xs text-slate-600">
              <div>System Version: Stitch 2026.10 • Zero Paid SaaS Architecture</div>
              <div className="font-mono-num">Generated for: Rizum Khan (AIS Enterprise Systems)</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
