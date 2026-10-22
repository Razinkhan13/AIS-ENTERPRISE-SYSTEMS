import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Landmark, Smartphone, AlertCircle } from 'lucide-react';
import { VERIFIED_TARGETS, CORPORATE_INFO } from '../data/masterData';
import { playFundsLockedChime } from '../utils/audio';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (tx: {
    clientName: string;
    clientSlug: string;
    amountBDT: number;
    packageType: string;
    paymentMethod: 'Trust Bank PLC (00110466000494)' | 'bKash (01715219176)' | 'Nagad (01708761298)';
    serviceCategory: 'Tier-1 RE' | 'Mid-RE' | 'E-Com COD' | 'Vault MSA';
    referenceNote: string;
  }) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onAddTransaction }) => {
  const [selectedTarget, setSelectedTarget] = useState(VERIFIED_TARGETS[0].slug);
  const [amountBDT, setAmountBDT] = useState<number>(2300000); // ৳23 Lakh
  const [packageType, setPackageType] = useState('50% Tier-1 Turnaround Retainer');
  const [paymentMethod, setPaymentMethod] = useState<'Trust Bank PLC (00110466000494)' | 'bKash (01715219176)' | 'Nagad (01708761298)'>(
    'Trust Bank PLC (00110466000494)'
  );
  const [referenceNote, setReferenceNote] = useState('Chairman Boardroom Sign-off & Bank Mobilization Deposit');
  const [serviceCategory, setServiceCategory] = useState<'Tier-1 RE' | 'Mid-RE' | 'E-Com COD' | 'Vault MSA'>('Tier-1 RE');

  if (!isOpen) return null;

  const currentClient = VERIFIED_TARGETS.find((t) => t.slug === selectedTarget);

  const handlePresetSelect = (presetAmount: number, presetPkg: string, cat: 'Tier-1 RE' | 'Mid-RE' | 'E-Com COD' | 'Vault MSA') => {
    setAmountBDT(presetAmount);
    setPackageType(presetPkg);
    setServiceCategory(cat);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClient || amountBDT <= 0) return;

    playFundsLockedChime();
    onAddTransaction({
      clientName: currentClient.name,
      clientSlug: currentClient.slug,
      amountBDT: Number(amountBDT),
      packageType,
      paymentMethod,
      serviceCategory,
      referenceNote,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0F1722] border border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-2xl glow-cyan text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-[#38BDF8]/60 overflow-hidden shrink-0 flex items-center justify-center glow-cyan shadow-[inset_0_1px_0_0_rgba(56,189,248,0.4)]">
              <img
                src="/assets/aistudio/images_3598e51a.jfif"
                alt="AIS Official Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">
                Rizum Khan — Lock Mobilization Deposit
              </h2>
              <p className="text-xs text-slate-400">
                Action (2): Approve & lock client wire transfer into verified account
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Package Presets */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Quick Commercial Presets:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handlePresetSelect(2300000, '50% Tier-1 Turnaround Retainer', 'Tier-1 RE')}
              className={`p-2 rounded-lg border text-left cursor-pointer transition ${
                amountBDT === 2300000
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="font-bold font-mono-num">৳23.0 Lakh</div>
              <div className="text-[10px] text-slate-400 truncate">50% Tier-1 Retainer</div>
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect(600000, '50% 8-Katha Sandbox Retainer', 'Tier-1 RE')}
              className={`p-2 rounded-lg border text-left cursor-pointer transition ${
                amountBDT === 600000
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="font-bold font-mono-num">৳6.0 Lakh</div>
              <div className="text-[10px] text-slate-400 truncate">50% 8-Katha Sandbox</div>
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect(110000, 'Vault MSA Token Deposit', 'Vault MSA')}
              className={`p-2 rounded-lg border text-left cursor-pointer transition ${
                amountBDT === 110000
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="font-bold font-mono-num">৳1.10 Lakh</div>
              <div className="text-[10px] text-slate-400 truncate">MSA Vault Token</div>
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect(25000, 'E-Com COD Shield Fast Pilot', 'E-Com COD')}
              className={`p-2 rounded-lg border text-left cursor-pointer transition ${
                amountBDT === 25000
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="font-bold font-mono-num">৳25,000</div>
              <div className="text-[10px] text-slate-400 truncate">COD Shield Pilot</div>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Select Client Target:
            </label>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="w-full bg-[#080C12] border border-[#1E293B] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#38BDF8]"
            >
              {VERIFIED_TARGETS.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name} ({t.flagshipProject})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Deposit Amount (BDT):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-mono-num">৳</span>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={amountBDT}
                  onChange={(e) => setAmountBDT(Number(e.target.value))}
                  className="w-full bg-[#080C12] border border-[#1E293B] rounded-lg pl-7 pr-3 py-2 text-emerald-400 font-mono-num font-bold text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Verified Inbound Account:
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full bg-[#080C12] border border-[#1E293B] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="Trust Bank PLC (00110466000494)">
                  🏦 Trust Bank (00110466000494)
                </option>
                <option value="bKash (01715219176)">📱 bKash (01715219176)</option>
                <option value="Nagad (01708761298)">📱 Nagad (01708761298)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Package / Milestone Description:
            </label>
            <input
              type="text"
              value={packageType}
              onChange={(e) => setPackageType(e.target.value)}
              className="w-full bg-[#080C12] border border-[#1E293B] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#38BDF8]"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Audit Note / Bank Transaction Reference:
            </label>
            <input
              type="text"
              value={referenceNote}
              onChange={(e) => setReferenceNote(e.target.value)}
              className="w-full bg-[#080C12] border border-[#1E293B] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#38BDF8]"
            />
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
            <span>
              By clicking <strong className="text-emerald-400">Approve & Lock Funds</strong>, Rizum Khan certifies that the 50% mobilization deposit has been reconciled in Trust Bank PLC or official MFS channels. The top scoreboard will update immediately.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-900/40 transition cursor-pointer glow-emerald"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approve & Lock Funds</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
