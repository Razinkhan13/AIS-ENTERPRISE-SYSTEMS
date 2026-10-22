import React from 'react';
import {
  ShieldCheck,
  Lock,
  CheckCircle,
  Landmark,
  Smartphone,
  Layers,
  ArrowUpRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Language, TransactionRecord } from '../../types';
import { CORPORATE_INFO } from '../../data/masterData';

interface TabApproveLockProps {
  language: Language;
  transactions: TransactionRecord[];
  onLockTransaction: (txId: string) => void;
  onOpenDepositModal: () => void;
}

export const TabApproveLock: React.FC<TabApproveLockProps> = ({
  language,
  transactions,
  onLockTransaction,
  onOpenDepositModal,
}) => {
  const lockedTotal = transactions
    .filter((t) => t.status === 'Locked & Mobilized')
    .reduce((sum, t) => sum + t.amountBDT, 0);

  const pendingTotal = transactions
    .filter((t) => t.status === 'Pending Verification')
    .reduce((sum, t) => sum + t.amountBDT, 0);

  const formatBDT = (amount: number) => {
    if (amount >= 10000000) {
      return `৳ ${(amount / 10000000).toFixed(2)} Cr`;
    }
    return `৳ ${(amount / 100000).toFixed(1)} Lakh`;
  };

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Header & Financial Overview */}
      <section className="bg-[#0F1722] border border-[#1E293B] rounded-2xl p-5 shadow-xl glow-cyan">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-900 border border-[#38BDF8]/60 glow-cyan shadow-[inset_0_1px_0_0_rgba(56,189,248,0.4)] overflow-hidden shrink-0 flex items-center justify-center">
              <img
                src="/assets/aistudio/images_3598e51a.jfif"
                alt="AIS Official Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-lg">
                Rizum Khan — 90-Day ৳1.00 Crore Deal Queue & Signature Lock
              </h2>
              <p className="text-xs text-slate-400">
                Operating Directive (5% Human-in-the-Loop): 1-Tap wire transfer reconciliation & fund locking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenDepositModal}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-emerald-950"
            >
              <span>+ Record New Inbound Wire</span>
            </button>
          </div>
        </div>

        {/* Aggregate Counters */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-[#080C12] border border-emerald-500/40 rounded-xl p-3.5 glow-emerald">
            <div className="text-[11px] text-emerald-400 font-medium flex items-center justify-between">
              <span>Verified Locked & Mobilized</span>
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-mono-num font-bold text-emerald-400 mt-1">
              {formatBDT(lockedTotal)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono-num mt-0.5">
              Reconciled to Trust Bank / MFS Accounts
            </div>
          </div>

          <div className="bg-[#080C12] border border-amber-500/40 rounded-xl p-3.5">
            <div className="text-[11px] text-amber-300 font-medium flex items-center justify-between">
              <span>Boardroom Pipeline Awaiting Wire</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-mono-num font-bold text-amber-300 mt-1">
              {formatBDT(pendingTotal)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono-num mt-0.5">
              50% Retainer Proposals in Closing Phase
            </div>
          </div>

          <div className="bg-[#080C12] border border-[#38BDF8]/40 rounded-xl p-3.5 glow-cyan">
            <div className="text-[11px] text-[#38BDF8] font-medium flex items-center justify-between">
              <span>90-Day Net Target Benchmark</span>
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            </div>
            <div className="text-2xl font-mono-num font-bold text-white mt-1">
              ৳ 1,00,00,000 Net
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              100% Free Open-Source Architecture (0% SaaS Cost)
            </div>
          </div>
        </div>
      </section>

      {/* 2. Side-by-Side Model Comparison: 4-Client High-Ticket vs 3-Stream Volume */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Model A: 4-Client High-Ticket Enterprise Mix */}
        <div className="bg-[#0F1722] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
            <div className="flex items-center gap-2">
              <span className="text-base">🏛️</span>
              <h3 className="font-display font-bold text-white text-base">
                Path A: 4-Client High-Ticket Enterprise Mix
              </h3>
            </div>
            <span className="text-[10px] font-mono-num px-2 py-0.5 rounded bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
              RECOMMENDED
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Four disciplined boardroom enterprise partnerships in Dhaka to achieve ৳1.00 Crore liquid profit:
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-[#080C12] border border-slate-800 flex justify-between items-center">
              <div>
                <strong className="text-white">2× Tier-1 Turnarounds (Sheltech, Concord, bti)</strong>
                <div className="text-[10px] text-slate-400">@ ৳46.0 Lakh per engagement (50% Retainer: ৳23L)</div>
              </div>
              <span className="font-mono-num font-bold text-emerald-400">৳ 92.00 Lakh</span>
            </div>

            <div className="p-3 rounded-xl bg-[#080C12] border border-slate-800 flex justify-between items-center">
              <div>
                <strong className="text-white">2× Tier-2 Sandboxes (Dom-Inno, Anwar Landmark)</strong>
                <div className="text-[10px] text-slate-400">@ ৳12.0 Lakh per engagement (50% Retainer: ৳6L)</div>
              </div>
              <span className="font-mono-num font-bold text-emerald-400">৳ 24.00 Lakh</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Gross Contracted Value:</span>
            <span className="font-mono-num font-bold text-white text-sm">
              ৳ 1,16,00,000 (৳ 1.16 Cr Gross / ৳ 1.00 Cr Net)
            </span>
          </div>
        </div>

        {/* Model B: 3-Stream Volume Mix */}
        <div className="bg-[#0F1722] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
            <div className="flex items-center gap-2">
              <span className="text-base">🌊</span>
              <h3 className="font-display font-bold text-white text-base">
                Path B: 3-Stream Volume Alternative
              </h3>
            </div>
            <span className="text-[10px] font-mono-num px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
              FAST CASHFLOW
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Multi-tier diversified pipeline combining instant COD protection with mid-market setup:
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#080C12] border border-slate-800 flex justify-between items-center">
              <div>
                <strong className="text-white">Stream A: 50× E-Com COD Shields (Fast Cash)</strong>
                <div className="text-[10px] text-slate-400">@ ৳30k setup fee (Fabrilife, Gorur Ghash, Shajgoj)</div>
              </div>
              <span className="font-mono-num font-bold text-emerald-400">৳ 15.00 Lakh</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#080C12] border border-slate-800 flex justify-between items-center">
              <div>
                <strong className="text-white">Stream B: 15× Mid-Market Developers (Sub-4m)</strong>
                <div className="text-[10px] text-slate-400">@ ৳1.40 Lakh setup + retainers (Edison, Assure, Suvastu)</div>
              </div>
              <span className="font-mono-num font-bold text-emerald-400">৳ 21.00 Lakh</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#080C12] border border-slate-800 flex justify-between items-center">
              <div>
                <strong className="text-white">Stream C: Tier-1 Flagship Turnarounds</strong>
                <div className="text-[10px] text-slate-400">Balance enterprise contracts with statutory escrow</div>
              </div>
              <span className="font-mono-num font-bold text-emerald-400">৳ 68.10 Lakh</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Cumulative Target:</span>
            <span className="font-mono-num font-bold text-white text-sm">
              ৳ 1,04,10,000 BDT
            </span>
          </div>
        </div>
      </section>

      {/* 3. Pre-loaded Transaction Queue Table & Rizum's 1-Tap Lock */}
      <section className="bg-[#0F1722] border border-[#1E293B] rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#1E293B]">
          <div>
            <h3 className="font-display font-bold text-white text-base">
              Pre-Loaded High-Probability Transaction Queue (TX-901 to TX-907)
            </h3>
            <p className="text-xs text-slate-400">
              Clicking <strong className="text-emerald-400">🔒 Approve & Lock Funds</strong> validates the wire transfer and fires the bank reconciliation chime
            </p>
          </div>
          <span className="text-xs font-mono-num text-slate-400">
            Trust Bank Account: 00110466000494
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-mono-num">
                <th className="pb-2.5">TX CODE</th>
                <th className="pb-2.5">CLIENT & PROJECT</th>
                <th className="pb-2.5">PACKAGE TYPE</th>
                <th className="pb-2.5">AMOUNT (BDT)</th>
                <th className="pb-2.5">RECONCILED ACCOUNT</th>
                <th className="pb-2.5">STATUS</th>
                <th className="pb-2.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {transactions.map((tx) => {
                const isLocked = tx.status === 'Locked & Mobilized';

                return (
                  <tr
                    key={tx.id}
                    className={`hover:bg-slate-900/40 transition ${
                      isLocked ? 'bg-emerald-950/10' : ''
                    }`}
                  >
                    <td className="py-3 font-mono-num text-[#38BDF8] font-bold">
                      {tx.txCode}
                    </td>
                    <td className="py-3">
                      <div className="font-semibold text-white">{tx.clientName}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">
                        {tx.referenceNote}
                      </div>
                    </td>
                    <td className="py-3 text-slate-300">
                      <div>{tx.packageType}</div>
                      <span className="text-[10px] font-mono-num text-slate-500">
                        {tx.serviceCategory}
                      </span>
                    </td>
                    <td className="py-3 font-mono-num font-bold text-emerald-400 text-sm">
                      ৳ {tx.amountBDT.toLocaleString()}
                    </td>
                    <td className="py-3 text-[11px] text-slate-300">
                      <div className="flex items-center gap-1">
                        {tx.paymentMethod.includes('Trust') ? (
                          <Landmark className="w-3.5 h-3.5 text-[#38BDF8]" />
                        ) : (
                          <Smartphone className="w-3.5 h-3.5 text-pink-400" />
                        )}
                        <span>{tx.paymentMethod.split(' ')[0]}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono-num">
                        {tx.paymentMethod.match(/\((.*?)\)/)?.[1] || ''}
                      </span>
                    </td>
                    <td className="py-3">
                      {isLocked ? (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-num bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                          <CheckCircle className="w-3 h-3" />
                          <span>LOCKED</span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-num bg-amber-950/70 text-amber-300 border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          <span>PENDING WIRE</span>
                        </span>
                      )}
                      {tx.lockedTimestamp && (
                        <div className="text-[9px] text-slate-500 font-mono-num mt-0.5">
                          {tx.lockedTimestamp}
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {isLocked ? (
                        <span className="text-[11px] text-emerald-400 font-mono-num font-semibold">
                          Reconciled ✓
                        </span>
                      ) : (
                        <button
                          onClick={() => onLockTransaction(tx.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1 ml-auto shadow-md shadow-emerald-950 transition cursor-pointer"
                        >
                          <Lock className="w-3 h-3" />
                          <span>Approve & Lock</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
