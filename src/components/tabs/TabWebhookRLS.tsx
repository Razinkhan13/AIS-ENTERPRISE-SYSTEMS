import React, { useState, useEffect } from 'react';
import {
  Server,
  Database,
  Lock,
  Copy,
  Check,
  Zap,
  Radio,
  FileCode,
  Shield,
  Activity,
  Plus,
  RefreshCw,
  Save,
} from 'lucide-react';
import { Language, InboundLead, ProjectAsset } from '../../types';
import {
  SUPABASE_SQL_SCHEMA,
  INITIAL_INBOUND_LEADS,
  INITIAL_PROJECT_ASSETS,
  VERIFIED_TARGETS,
} from '../../data/masterData';
import { copyToClipboardSafe } from '../../utils/clipboard';

interface TabWebhookRLSProps {
  language: Language;
  activeTenant: string;
  onTenantChange: (tenant: string) => void;
}

export const TabWebhookRLS: React.FC<TabWebhookRLSProps> = ({
  language,
  activeTenant,
  onTenantChange,
}) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [inboundLeads, setInboundLeads] = useState<InboundLead[]>(() => {
    const saved = localStorage.getItem('ais_inbound_leads');
    return saved ? JSON.parse(saved) : INITIAL_INBOUND_LEADS;
  });

  const [projectAssets] = useState<ProjectAsset[]>(INITIAL_PROJECT_ASSETS);
  const [activeTable, setActiveTable] = useState<'inbound_leads' | 'project_assets'>('inbound_leads');
  const [leadToast, setLeadToast] = useState<string | null>(null);

  // Dhaka Offline Draft Pad (persisted to localStorage)
  const [offlineDraft, setOfflineDraft] = useState(() => {
    return (
      localStorage.getItem('ais_dhaka_offline_pad') ||
      `# Dhaka Traffic Boardroom Offline Notes
- Met with Sheltech Chairman at Panthapath.
- Discussed REDMA Sec 14 refund exposure on Bithika Banani.
- Chairman agreed in principle to 50% mobilization retainer (৳23L) via Trust Bank.
- Follow up WhatsApp sent with live sandbox: ?demo=sheltech#sandbox`
    );
  });
  const [savedDraftStatus, setSavedDraftStatus] = useState(false);

  useEffect(() => {
    localStorage.setItem('ais_inbound_leads', JSON.stringify(inboundLeads));
  }, [inboundLeads]);

  const handleCopySql = () => {
    copyToClipboardSafe(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleSaveDraft = () => {
    localStorage.setItem('ais_dhaka_offline_pad', offlineDraft);
    setSavedDraftStatus(true);
    setTimeout(() => setSavedDraftStatus(false), 2000);
  };

  const injectSimulatedLead = () => {
    const names = [
      'Dr. Shafiqul Islam (Neurosurgeon, Harvard Medical, Boston)',
      'Tanzeem Ahmed (Principal Eng, DeepMind, London)',
      'Mustafa Kamal (Managing Director, Gulf Petro, Dubai)',
      'Salma Begum (Investment Banker, Singapore)',
    ];
    const cities = ['Boston, USA', 'London, UK', 'Dubai, UAE', 'Singapore'];
    const currencies = ['USD', 'GBP', 'AED', 'USD'];
    const budgets = ['$520,000', '£350,000', 'AED 1,900,000', '$450,000'];
    const bdtBudgets = ['৳ 6.24 Cr', '৳ 5.42 Cr', '৳ 6.27 Cr', '৳ 5.40 Cr'];

    const targetSlug =
      activeTenant === 'superadmin' ? 'sheltech' : activeTenant;

    const matchedTarget =
      VERIFIED_TARGETS.find((t) => t.slug === targetSlug) || VERIFIED_TARGETS[0];

    const idx = Math.floor(Math.random() * names.length);
    const newLead: InboundLead = {
      id: `lead-${Date.now()}`,
      developer_slug: matchedTarget.slug,
      lead_name: names[idx],
      diaspora_location: cities[idx],
      currency: currencies[idx],
      budget_local: budgets[idx],
      budget_bdt: bdtBudgets[idx],
      preferred_project: matchedTarget.flagshipProject,
      response_time_sec: Math.floor(Math.random() * 20) + 25,
      ai_score: Math.floor(Math.random() * 8) + 92,
      status: '48h Unit Hold',
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }) + ' BD Time',
    };

    setInboundLeads((prev) => [newLead, ...prev]);
    setLeadToast(`⚡ New Webhook: ${newLead.lead_name} (${newLead.budget_bdt}) answered in ${newLead.response_time_sec}s!`);
    setTimeout(() => setLeadToast(null), 4000);
  };

  // Filter based on RLS Tenant
  const visibleLeads =
    activeTenant === 'superadmin'
      ? inboundLeads
      : inboundLeads.filter((l) => l.developer_slug === activeTenant);

  const visibleAssets =
    activeTenant === 'superadmin'
      ? projectAssets
      : projectAssets.filter((a) => a.developer_slug === activeTenant);

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Alert */}
      {leadToast && (
        <div className="fixed top-24 right-4 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce border border-emerald-400">
          <Zap className="w-4 h-4 fill-current" />
          <span>{leadToast}</span>
        </div>
      )}

      {/* 1. Failover Telemetry Bar */}
      <section className="bg-[#0F1722] border border-[#1E293B] rounded-2xl p-5 shadow-xl glow-cyan">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/40 text-[#38BDF8]">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-base">
                Multi-Channel Failover Telemetry & Cloud Webhooks
              </h2>
              <p className="text-xs text-slate-400">
                Triple-redundancy event delivery: Primary WhatsApp Cloud API + Steadfast Courier + SSL Wireless
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>99.98% High-Availability Uptime</span>
          </div>
        </div>

        {/* 3 Failover Gateways */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Primary */}
          <div className="bg-[#080C12] border border-emerald-500/40 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-400 font-mono-num">PRIMARY (Active)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-mono-num">
                  HTTP 200 OK
                </span>
              </div>
              <div className="font-bold text-white text-xs">WhatsApp Cloud API (Graph v21.0)</div>
              <p className="text-[11px] text-slate-400 mt-1 font-mono-num">
                Endpoint: <code className="text-slate-300">/api/webhook/whatsapp</code>
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono-num flex justify-between">
              <span>Avg Latency: 180ms</span>
              <span className="text-emerald-400">0% Packet Loss</span>
            </div>
          </div>

          {/* Secondary */}
          <div className="bg-[#080C12] border border-[#1E293B] rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-[#38BDF8] font-mono-num">SECONDARY (Standby)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono-num">
                  READY
                </span>
              </div>
              <div className="font-bold text-white text-xs">Steadfast Courier API (COD Engine)</div>
              <p className="text-[11px] text-slate-400 mt-1 font-mono-num">
                Endpoint: <code className="text-slate-300">portal.packzy.com/api/v1/create_order</code>
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono-num flex justify-between">
              <span>Auto-Hold on COD Fraud</span>
              <span className="text-[#38BDF8]">Steadfast Shield</span>
            </div>
          </div>

          {/* Tertiary */}
          <div className="bg-[#080C12] border border-[#1E293B] rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-amber-300 font-mono-num">TERTIARY (SMS Fallback)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono-num">
                  STANDBY
                </span>
              </div>
              <div className="font-bold text-white text-xs">SSL Wireless Bangladesh SMS Gateway</div>
              <p className="text-[11px] text-slate-400 mt-1 font-mono-num">
                Endpoint: <code className="text-slate-300">sms.sslwireless.com/pushapi/v3</code>
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono-num flex justify-between">
              <span>Dhaka Offline Delivery</span>
              <span className="text-amber-400">Triggers if no WhatsApp read</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Supabase Realtime Table Inspector */}
      <section className="bg-[#0F1722] border border-[#1E293B] rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#38BDF8]" />
            <div>
              <h3 className="font-display font-bold text-white text-base">
                Supabase Realtime Table Inspector (RLS Active)
              </h3>
              <p className="text-xs text-slate-400">
                Currently Viewing Tenant:{' '}
                <strong className="text-[#38BDF8] font-mono-num">
                  {activeTenant === 'superadmin' ? '👑 SuperAdmin (Rizum Khan)' : activeTenant}
                </strong>
              </p>
            </div>
          </div>

          {/* Table Switcher & Inject Lead Action */}
          <div className="flex items-center gap-2">
            <div className="flex bg-[#080C12] border border-[#1E293B] rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setActiveTable('inbound_leads')}
                className={`px-3 py-1 rounded text-xs transition cursor-pointer ${
                  activeTable === 'inbound_leads'
                    ? 'bg-[#38BDF8] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                inbound_leads ({visibleLeads.length})
              </button>
              <button
                onClick={() => setActiveTable('project_assets')}
                className={`px-3 py-1 rounded text-xs transition cursor-pointer ${
                  activeTable === 'project_assets'
                    ? 'bg-[#38BDF8] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                project_assets ({visibleAssets.length})
              </button>
            </div>

            <button
              onClick={injectSimulatedLead}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1 transition cursor-pointer shadow-md shadow-emerald-950"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Inject Sub-4m NRB Lead</span>
            </button>
          </div>
        </div>

        {/* Dynamic Table View */}
        <div className="mt-4 overflow-x-auto">
          {activeTable === 'inbound_leads' ? (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-mono-num">
                  <th className="pb-2">TENANT SLUG</th>
                  <th className="pb-2">LEAD NAME</th>
                  <th className="pb-2">DIASPORA LOCATION</th>
                  <th className="pb-2">BUDGET (LOCAL / BDT)</th>
                  <th className="pb-2">MATCHED PROJECT</th>
                  <th className="pb-2">SLA RESPONSE</th>
                  <th className="pb-2">AI SCORE</th>
                  <th className="pb-2">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {visibleLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-2.5 font-mono-num text-[#38BDF8]">{lead.developer_slug}</td>
                    <td className="py-2.5 font-semibold text-white">{lead.lead_name}</td>
                    <td className="py-2.5 text-slate-300">{lead.diaspora_location}</td>
                    <td className="py-2.5 font-mono-num text-emerald-400 font-bold">
                      {lead.budget_local} ({lead.budget_bdt})
                    </td>
                    <td className="py-2.5 text-slate-300">{lead.preferred_project}</td>
                    <td className="py-2.5 font-mono-num text-emerald-400">
                      ⚡ {lead.response_time_sec}s
                    </td>
                    <td className="py-2.5 font-mono-num">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                        {lead.ai_score}/100
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-num bg-slate-800 text-slate-300 border border-slate-700">
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-mono-num">
                  <th className="pb-2">TENANT SLUG</th>
                  <th className="pb-2">PROJECT ASSET</th>
                  <th className="pb-2">LOCATION</th>
                  <th className="pb-2">UNSOLD SQFT</th>
                  <th className="pb-2">AVG PRICE/SQFT</th>
                  <th className="pb-2">OD RATE</th>
                  <th className="pb-2">MONTHLY OD BLEED</th>
                  <th className="pb-2">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {visibleAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-2.5 font-mono-num text-[#38BDF8]">{asset.developer_slug}</td>
                    <td className="py-2.5 font-semibold text-white">{asset.project_name}</td>
                    <td className="py-2.5 text-slate-300">{asset.location}</td>
                    <td className="py-2.5 font-mono-num">{asset.unsold_sqft.toLocaleString()} sq ft</td>
                    <td className="py-2.5 font-mono-num text-emerald-400">
                      ৳ {asset.avg_price_sqft.toLocaleString()}
                    </td>
                    <td className="py-2.5 font-mono-num text-rose-400">{asset.od_rate_pct}%</td>
                    <td className="py-2.5 font-mono-num font-bold text-rose-400">
                      ৳ {asset.monthly_od_bleed_cr.toFixed(2)} Cr / mo
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono-num ${
                          asset.status === 'Critical Bleed'
                            ? 'bg-rose-950 text-rose-400 border border-rose-500/40'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* 3. 5-Part Supabase Multi-Tenant SQL Schema + Dhaka Offline Draft Pad */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 5-Part Supabase SQL Schema Viewer */}
        <div className="lg:col-span-8 bg-[#0F1722] border border-[#1E293B] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-[#38BDF8]" />
              <div>
                <h3 className="font-display font-bold text-white text-base">
                  5-Part Supabase Multi-Tenant SQL Schema (PostgreSQL 16)
                </h3>
                <p className="text-xs text-slate-400">
                  Ready to paste into Supabase Free Tier SQL Editor for instant deployment
                </p>
              </div>
            </div>

            <button
              onClick={handleCopySql}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              {copiedSql ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied SQL!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy Full SQL</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-3 bg-[#080C12] border border-slate-800 rounded-xl p-3.5 max-h-96 overflow-y-auto font-mono-num text-[11px] text-slate-300 leading-relaxed">
            <pre className="whitespace-pre-wrap">{SUPABASE_SQL_SCHEMA}</pre>
          </div>
        </div>

        {/* Right: Dhaka Traffic Offline Draft Pad */}
        <div className="lg:col-span-4 bg-[#0F1722] border border-[#1E293B] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" />
                <h3 className="font-display font-bold text-white text-sm">
                  Dhaka Traffic Offline Draft Pad
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono-num">Local Auto-Save</span>
            </div>

            <p className="text-[11px] text-slate-400 mt-2">
              For spotty cellular reception during Dhaka VIP boardroom commutes (Airport Rd / Gulshan-2 / Motijheel).
            </p>

            <textarea
              value={offlineDraft}
              onChange={(e) => setOfflineDraft(e.target.value)}
              rows={12}
              className="w-full mt-3 bg-[#080C12] border border-[#1E293B] rounded-xl p-3 text-xs text-slate-200 font-mono-num focus:outline-none focus:border-[#38BDF8] resize-none leading-relaxed"
              placeholder="Type offline notes or draft WhatsApp messages here..."
            />
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono-num">
              {savedDraftStatus ? 'Saved to LocalStorage ✓' : 'Kept in browser memory'}
            </span>
            <button
              onClick={handleSaveDraft}
              className="px-3.5 py-1.5 rounded-lg bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-slate-950 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Offline Notes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
