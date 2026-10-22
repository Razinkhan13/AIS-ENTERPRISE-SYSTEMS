import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Check,
  Building,
  Landmark,
  ShieldCheck,
  Calendar,
  DollarSign,
  Send,
} from 'lucide-react';
import { Language, VerifiedTarget } from '../../types';
import { CORPORATE_INFO, VERIFIED_TARGETS } from '../../data/masterData';
import { copyToClipboardSafe } from '../../utils/clipboard';

interface TabMushakInvoiceProps {
  language: Language;
}

export const TabMushakInvoice: React.FC<TabMushakInvoiceProps> = ({ language }) => {
  const [selectedSlug, setSelectedSlug] = useState('sheltech');
  const [packagePreset, setPackagePreset] = useState<number>(2300000); // Default ৳23L
  const [customAmount, setCustomAmount] = useState<number>(2300000);
  const [packageName, setPackageName] = useState('50% Mobilization Retainer — Tier-1 Flagship Turnaround Cockpit');
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [invoiceSerial, setInvoiceSerial] = useState('2026-2027-DHK-0482');
  const [copiedNote, setCopiedNote] = useState(false);

  const currentClient = VERIFIED_TARGETS.find((t) => t.slug === selectedSlug) || VERIFIED_TARGETS[0];

  const packages = [
    { name: '50% 8-Katha Sandbox Retainer', amount: 600000, label: '৳6,00,000' },
    { name: 'Vault MSA Legal Token Deposit', amount: 110000, label: '৳1,10,000' },
    { name: 'Full Turnkey 8-Katha Sandbox', amount: 120000, label: '৳12,00,000' },
    { name: '50% Tier-1 Flagship Retainer', amount: 2300000, label: '৳23,00,000' },
    { name: 'E-Com COD Shield Fast Pilot', amount: 25000, label: '৳25,000' },
  ];

  const handlePackageSelect = (pkg: typeof packages[0]) => {
    setPackagePreset(pkg.amount);
    setCustomAmount(pkg.amount);
    setPackageName(pkg.name);
  };

  // Statutory Calculations (NBR Service Code S099.10 - 5.0% VAT)
  const baseValue = customAmount;
  const vatRate = CORPORATE_INFO.nbr.vatRatePct; // 5.0%
  const vatAmount = Math.round(baseValue * (vatRate / 100));
  const totalPayable = baseValue + vatAmount;

  const handlePrint = () => {
    window.print();
  };

  const getWhatsAppInvoiceNote = () => {
    return `*GOVERNMENT OF BANGLADESH — NATIONAL BOARD OF REVENUE*
*FORM MUSHAK-6.3 TAX INVOICE & RETAINER AGREEMENT*
Invoice Serial: ${invoiceSerial}
Date: ${invoiceDate}

*Supplier:* ${CORPORATE_INFO.brandName}
*Supplier BIN:* ${CORPORATE_INFO.nbr.bin}
*Service Code:* ${CORPORATE_INFO.nbr.serviceCode} (${CORPORATE_INFO.nbr.serviceDescription})
*Address:* ${CORPORATE_INFO.hqAddress}

*Recipient / Client:* ${currentClient.name}
*Flagship Asset:* ${currentClient.flagshipProject}
*Scope / Service:* ${packageName}

*Base Taxable Value:* ৳ ${baseValue.toLocaleString()} BDT
*Statutory 5% VAT (S099.10):* ৳ ${vatAmount.toLocaleString()} BDT
*Total Invoice Amount:* ৳ ${totalPayable.toLocaleString()} BDT

*Verified Inbound Wire Instructions:*
Bank: ${CORPORATE_INFO.trustBank.bankName}
Branch: ${CORPORATE_INFO.trustBank.branch}
Account Name: ${CORPORATE_INFO.trustBank.accountName}
Account No: ${CORPORATE_INFO.trustBank.accountNumber}
Routing: ${CORPORATE_INFO.trustBank.routingNumber}
bKash Merchant: ${CORPORATE_INFO.mfs.bkash} | Nagad: ${CORPORATE_INFO.mfs.nagad}

*Binding 60-Day 5x Pipeline Guarantee:*
${CORPORATE_INFO.warranty}

*Signatory:* Rizum Khan (Founder & Final Signatory)`;
  };

  const copyInvoiceNote = () => {
    const text = getWhatsAppInvoiceNote();
    copyToClipboardSafe(text);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Configuration Controls Bar */}
      <section className="no-print bg-[#0F1722] border border-[#1E293B] rounded-2xl p-5 shadow-xl glow-cyan">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/40 text-[#38BDF8]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-lg">
                NBR Mushak-6.3 Tax Invoice Generator & 60-Day Risk-Reversal Warranty
              </h2>
              <p className="text-xs text-slate-400">
                Supplier BIN: <span className="text-[#38BDF8] font-mono-num">004982103-0101</span> • Service Code: <span className="text-emerald-400 font-mono-num">S099.10</span> (5% Statutory VAT)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyInvoiceNote}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              {copiedNote ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied Note!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy WhatsApp Note</span>
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-emerald-950"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF Mushak-6.3</span>
            </button>
          </div>
        </div>

        {/* Dynamic Package Selectors */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {packages.map((pkg) => (
            <button
              key={pkg.name}
              onClick={() => handlePackageSelect(pkg)}
              className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                customAmount === pkg.amount
                  ? 'bg-[#38BDF8]/15 border-[#38BDF8] text-white'
                  : 'bg-[#080C12] border-[#1E293B] text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-bold font-mono-num text-sm text-[#38BDF8]">{pkg.label}</div>
              <div className="text-[11px] truncate mt-0.5">{pkg.name}</div>
            </button>
          ))}
        </div>

        {/* Custom Edit Inputs */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Select Client Target:</label>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="w-full bg-[#080C12] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-[#38BDF8]"
            >
              {VERIFIED_TARGETS.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name} ({t.flagshipProject})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Base Consideration Amount (BDT):</label>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(Number(e.target.value))}
              className="w-full bg-[#080C12] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-emerald-400 font-mono-num font-bold focus:outline-none focus:border-[#38BDF8]"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Invoice Serial & Date:</label>
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="text"
                value={invoiceSerial}
                onChange={(e) => setInvoiceSerial(e.target.value)}
                className="bg-[#080C12] border border-[#1E293B] rounded-lg px-2 py-1.5 text-white font-mono-num text-[11px]"
              />
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="bg-[#080C12] border border-[#1E293B] rounded-lg px-2 py-1.5 text-white font-mono-num text-[11px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Official Printable Mushak-6.3 Sheet Surface */}
      <div
        id="printable-vault-area"
        className="bg-white text-[#0F1722] rounded-2xl p-6 sm:p-10 shadow-2xl border border-slate-300 font-sans max-w-4xl mx-auto"
      >
        {/* NBR Formal Header with Official AIS Logo */}
        <div className="border-b-2 border-slate-900 pb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="w-14 h-14 rounded-full border border-slate-300 overflow-hidden shrink-0 shadow-sm bg-slate-900">
              <img
                src="/assets/aistudio/images_3598e51a.jfif"
                alt="AIS Enterprise Systems Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center flex-1">
              <div className="text-sm font-bangla font-bold tracking-wider text-slate-800">
                গণপ্রজাতন্ত্রী বাংলাদেশ সরকার • জাতীয় রাজস্ব বোর্ড
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-bangla text-slate-900 mt-0.5">
                কর চালানপত্র (মূসক-৬.৩)
              </h1>
              <div className="text-xs font-bangla text-slate-600 mt-0.5">
                [বিধি ৪০ এর উপ-বিধি (১) এর দফা (গ) দ্রষ্টব্য] • সেবা প্রদান চালানপত্র
              </div>
            </div>
            <div className="text-right text-[11px] font-mono-num text-slate-600">
              <div className="font-bold text-slate-900">AIS ENTERPRISE</div>
              <div>BIN: {CORPORATE_INFO.nbr.bin}</div>
            </div>
          </div>
        </div>

        {/* Invoice Metadata Row */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-xs font-mono-num border-b border-slate-200 pb-3">
          <div>
            <span className="text-slate-600">চালান নম্বর (Invoice No): </span>
            <strong className="text-slate-900 text-sm">{invoiceSerial}</strong>
          </div>
          <div className="text-right">
            <span className="text-slate-600">তারিখ ও সময় (Date): </span>
            <strong className="text-slate-900">{invoiceDate}</strong>
          </div>
        </div>

        {/* Supplier & Recipient 2-Column Block */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-slate-200 pb-4">
          {/* Supplier Box */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="font-bold text-slate-900 uppercase text-[11px] mb-1 font-mono-num">
              সরবরাহকারীর বিবরণ (SUPPLIER)
            </div>
            <div className="font-bold text-sm text-slate-900">{CORPORATE_INFO.brandName}</div>
            <div className="text-slate-700 mt-0.5">
              স্বত্বাধিকারী ও সাইনকারী: <strong>{CORPORATE_INFO.founder}</strong>
            </div>
            <div className="text-slate-600 mt-0.5">{CORPORATE_INFO.hqAddress}</div>
            <div className="mt-2 font-mono-num font-bold text-slate-900">
              ব্যবসায়িক শনাক্তকরণ সংখ্যা (BIN):{' '}
              <span className="bg-slate-200 px-1 py-0.5 rounded">{CORPORATE_INFO.nbr.bin}</span>
            </div>
          </div>

          {/* Recipient Box */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="font-bold text-slate-900 uppercase text-[11px] mb-1 font-mono-num">
              গ্রহীতার বিবরণ (CLIENT / BUYER)
            </div>
            <div className="font-bold text-sm text-slate-900">{currentClient.name}</div>
            <div className="text-slate-700 mt-0.5">
              প্রকল্প: <strong>{currentClient.flagshipProject}</strong>
            </div>
            <div className="text-slate-600 mt-0.5">{currentClient.location}</div>
            <div className="mt-2 text-slate-700">
              যোগাযোগ: <span className="font-mono-num">{currentClient.phone}</span>
            </div>
          </div>
        </div>

        {/* 11-Column Formal NBR Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border border-slate-300 text-slate-800 text-[11px]">
                <th className="p-2 border border-slate-300 text-center">ক্র. নং</th>
                <th className="p-2 border border-slate-300">পণ্যের/সেবার বিবরণ ও কোড</th>
                <th className="p-2 border border-slate-300 text-center">পরিমাণ</th>
                <th className="p-2 border border-slate-300 text-right">মূল্য (টাকা)</th>
                <th className="p-2 border border-slate-300 text-right">সম্পূরক শুল্ক</th>
                <th className="p-2 border border-slate-300 text-right">মূসক হার</th>
                <th className="p-2 border border-slate-300 text-right">মূসকের পরিমাণ</th>
                <th className="p-2 border border-slate-300 text-right">সর্বমোট (টাকা)</th>
              </tr>
            </thead>
            <tbody className="text-slate-900">
              <tr className="border border-slate-300">
                <td className="p-2.5 border border-slate-300 text-center font-mono-num">১</td>
                <td className="p-2.5 border border-slate-300">
                  <div className="font-bold">{packageName}</div>
                  <div className="text-[11px] text-slate-600">
                    সেবা কোড: {CORPORATE_INFO.nbr.serviceCode} — {CORPORATE_INFO.nbr.serviceDescription}
                  </div>
                  <div className="text-[10px] text-slate-500 italic mt-0.5">
                    {currentClient.flagshipProject} অটোনোমাস লিকুইডিটি সিস্টেম ও ট্রাস্ট ব্যাংক এসক্রো
                  </div>
                </td>
                <td className="p-2.5 border border-slate-300 text-center font-mono-num">১ লট</td>
                <td className="p-2.5 border border-slate-300 text-right font-mono-num font-semibold">
                  {baseValue.toLocaleString()}
                </td>
                <td className="p-2.5 border border-slate-300 text-right font-mono-num text-slate-500">
                  ০.০০
                </td>
                <td className="p-2.5 border border-slate-300 text-right font-mono-num font-semibold">
                  ৫.০%
                </td>
                <td className="p-2.5 border border-slate-300 text-right font-mono-num font-bold text-slate-800">
                  {vatAmount.toLocaleString()}
                </td>
                <td className="p-2.5 border border-slate-300 text-right font-mono-num font-bold text-slate-950">
                  ৳ {totalPayable.toLocaleString()}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-bold border border-slate-300">
                <td colSpan={6} className="p-2 border border-slate-300 text-right">
                  সর্বমোট প্রদেয় টাকা (কথায়: {totalPayable.toLocaleString()} টাকা মাত্র):
                </td>
                <td className="p-2 border border-slate-300 text-right font-mono-num">
                  ৳ {vatAmount.toLocaleString()}
                </td>
                <td className="p-2 border border-slate-300 text-right font-mono-num text-sm text-emerald-800">
                  ৳ {totalPayable.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Binding 60-Day 5x Pipeline Risk-Reversal Warranty Clause */}
        <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-xs">
          <div className="font-bold text-emerald-950 flex items-center gap-1.5 font-mono-num">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>আইনগত বাধ্যবাধকতামূলক ৬০-দিনের ৫ গুণ ক্যাশ পাইপলাইন গ্যারান্টি (WARRANTY CLAUSE):</span>
          </div>
          <p className="text-emerald-900 mt-1 leading-relaxed">
            "{CORPORATE_INFO.warranty}"
          </p>
        </div>

        {/* Bank Wire Details & Official Signatures */}
        <div className="mt-6 pt-4 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <div className="font-bold text-slate-900 uppercase text-[11px] font-mono-num mb-1">
              ব্যাংক ও এমএফএস ওয়্যার ইনস্ট্রাকশন:
            </div>
            <div className="space-y-0.5 text-slate-700 font-mono-num">
              <div>ব্যাংক: <strong>{CORPORATE_INFO.trustBank.bankName}</strong></div>
              <div>শাখা: {CORPORATE_INFO.trustBank.branch}</div>
              <div>অ্যাকাউন্ট নাম: <strong>{CORPORATE_INFO.trustBank.accountName}</strong></div>
              <div>অ্যাকাউন্ট নম্বর: <strong className="text-slate-950">{CORPORATE_INFO.trustBank.accountNumber}</strong></div>
              <div>রাউটিং নম্বর: {CORPORATE_INFO.trustBank.routingNumber}</div>
              <div className="pt-1">bKash: {CORPORATE_INFO.mfs.bkash} | Nagad: {CORPORATE_INFO.mfs.nagad}</div>
            </div>
          </div>

          <div className="flex flex-col justify-end text-right">
            <div className="inline-block self-end border-b-2 border-slate-900 w-48 mb-1"></div>
            <div className="font-bold text-slate-900 text-sm">{CORPORATE_INFO.founder}</div>
            <div className="text-slate-600 text-[11px] font-mono-num">
              {CORPORATE_INFO.founderTitle}
            </div>
            <div className="text-slate-500 text-[10px]">{CORPORATE_INFO.brandName}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
