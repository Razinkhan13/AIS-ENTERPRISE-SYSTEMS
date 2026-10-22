import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DepositModal } from './components/DepositModal';
import { TabWhatsApp } from './components/tabs/TabWhatsApp';
import { TabColdAudit } from './components/tabs/TabColdAudit';
import { TabApproveLock } from './components/tabs/TabApproveLock';
import { TabMushakInvoice } from './components/tabs/TabMushakInvoice';
import { TabClientSandbox } from './components/tabs/TabClientSandbox';
import { TabDocumentVault } from './components/tabs/TabDocumentVault';
import { TabWebhookRLS } from './components/tabs/TabWebhookRLS';
import { Language, TransactionRecord } from './types';
import { AiEngineConfig } from './types/ai';
import { PRELOADED_TRANSACTIONS, VERIFIED_TARGETS, CORPORATE_INFO } from './data/masterData';
import { playFundsLockedChime } from './utils/audio';
import { ClientPreviewView } from './components/ClientPreviewView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('whatsapp');
  const [language, setLanguage] = useState<Language>('en');
  const [activeTenant, setActiveTenant] = useState<string>('superadmin');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Strict Dual-Mode Isolation: Client Preview Lockdown Mode vs SuperAdmin Mode
  const [isClientPreviewMode, setIsClientPreviewMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return Boolean(params.get('demo') || params.get('client'));
    }
    return false;
  });

  const [demoClientSlug, setDemoClientSlug] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('demo') || params.get('client') || 'sheltech';
    }
    return 'sheltech';
  });

  // Dual-Engine AI Configuration (Gemini 3.8 Flash with Search Grounding vs. Local Ollama)
  const [aiConfig, setAiConfig] = useState<AiEngineConfig>(() => {
    const saved = localStorage.getItem('ais_ai_engine_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      engine: 'gemini',
      geminiModel: 'gemini-3.8-flash',
      enableGrounding: true,
      ollamaEndpoint: 'http://localhost:11434',
      ollamaModel: 'llama3.2',
    };
  });

  useEffect(() => {
    localStorage.setItem('ais_ai_engine_config', JSON.stringify(aiConfig));
  }, [aiConfig]);

  // Transactions state persisted to localStorage
  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    const saved = localStorage.getItem('ais_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved transactions:', e);
      }
    }
    return PRELOADED_TRANSACTIONS;
  });

  // Calculate locked total
  const lockedAmountBDT = transactions
    .filter((t) => t.status === 'Locked & Mobilized')
    .reduce((sum, t) => sum + t.amountBDT, 0);

  // Save transactions and sync
  useEffect(() => {
    localStorage.setItem('ais_transactions', JSON.stringify(transactions));
    // BroadcastChannel sync across multiple tabs
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('ais_fund_sync');
        bc.postMessage({ type: 'SYNC_TRANSACTIONS', transactions });
        bc.close();
      } catch (e) {
        // BroadcastChannel ignored if not permitted
      }
    }
  }, [transactions]);

  // Listen for cross-tab sync and online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine);
    }

    // Deep link detection from URL: e.g. ?demo=sheltech or ?client=sheltech
    const urlParams = new URLSearchParams(window.location.search);
    const demoParam = urlParams.get('demo') || urlParams.get('client');
    const hashParam = window.location.hash;

    if (demoParam) {
      setDemoClientSlug(demoParam);
      setIsClientPreviewMode(true);
    } else if (hashParam) {
      const cleanHash = hashParam.replace('#', '');
      if (['whatsapp', 'audit', 'approve', 'invoice', 'sandbox', 'vault', 'webhook'].includes(cleanHash)) {
        setCurrentTab(cleanHash);
      }
    }

    // Cross-tab broadcast listener
    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bc = new BroadcastChannel('ais_fund_sync');
        bc.onmessage = (event) => {
          if (event.data?.type === 'SYNC_TRANSACTIONS' && Array.isArray(event.data.transactions)) {
            setTransactions(event.data.transactions);
          }
        };
      } catch (e) {
        console.debug('BroadcastChannel listener skipped:', e);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (bc) bc.close();
    };
  }, []);

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    window.location.hash = tabId;
  };

  const handleLanguageToggle = () => {
    setLanguage((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  const handleAdminUnlock = () => {
    setIsClientPreviewMode(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('demo');
    url.searchParams.delete('client');
    window.history.replaceState({}, document.title, url.pathname + url.hash);
  };

  const handleTestLockedClientView = (slug: string) => {
    setDemoClientSlug(slug);
    setIsClientPreviewMode(true);
    const url = new URL(window.location.href);
    url.searchParams.set('demo', slug);
    window.history.pushState({}, '', url.toString());
  };

  const handleLockTransaction = (txId: string) => {
    playFundsLockedChime();
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? {
              ...t,
              status: 'Locked & Mobilized' as const,
              lockedTimestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }) + ' BD Time',
            }
          : t
      )
    );
  };

  const handleAddTransaction = (newTxData: {
    clientName: string;
    clientSlug: string;
    amountBDT: number;
    packageType: string;
    paymentMethod: 'Trust Bank PLC (00110466000494)' | 'bKash (01715219176)' | 'Nagad (01708761298)';
    serviceCategory: 'Tier-1 RE' | 'Mid-RE' | 'E-Com COD' | 'Vault MSA';
    referenceNote: string;
  }) => {
    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}`,
      txCode: `TX-${Math.floor(100 + Math.random() * 900)}`,
      clientName: newTxData.clientName,
      clientSlug: newTxData.clientSlug,
      packageType: newTxData.packageType,
      amountBDT: newTxData.amountBDT,
      serviceCategory: newTxData.serviceCategory,
      paymentMethod: newTxData.paymentMethod,
      status: 'Locked & Mobilized',
      lockedTimestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }) + ' BD Time',
      referenceNote: newTxData.referenceNote,
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleNavigateToSandbox = (slug: string) => {
    setDemoClientSlug(slug);
    setCurrentTab('sandbox');
    window.location.hash = 'sandbox';
  };

  // Strict Client Preview Lockdown Mode: Hides all admin UI & competitor data
  if (isClientPreviewMode) {
    return (
      <ClientPreviewView
        clientSlug={demoClientSlug}
        language={language}
        onLanguageToggle={handleLanguageToggle}
        onAdminUnlock={handleAdminUnlock}
        aiConfig={aiConfig}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#080C12] text-slate-100 flex flex-col font-sans selection:bg-[#38BDF8] selection:text-black">
      {/* Sticky Command Header */}
      <Header
        currentTab={currentTab}
        onTabChange={handleTabChange}
        language={language}
        onLanguageToggle={handleLanguageToggle}
        lockedAmountBDT={lockedAmountBDT}
        activeTenant={activeTenant}
        onTenantChange={setActiveTenant}
        onOpenDepositModal={() => setIsDepositModalOpen(true)}
        isOnline={isOnline}
      />

      {/* Main Command Center Body */}
      <main
        className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-5"
        style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {currentTab === 'whatsapp' && (
          <TabWhatsApp
            language={language}
            onNavigateToSandbox={handleNavigateToSandbox}
            onTestLockedClientView={handleTestLockedClientView}
            aiConfig={aiConfig}
            onAiConfigChange={setAiConfig}
          />
        )}

        {currentTab === 'audit' && (
          <TabColdAudit
            language={language}
            aiConfig={aiConfig}
            onAiConfigChange={setAiConfig}
          />
        )}

        {currentTab === 'approve' && (
          <TabApproveLock
            language={language}
            transactions={transactions}
            onLockTransaction={handleLockTransaction}
            onOpenDepositModal={() => setIsDepositModalOpen(true)}
          />
        )}

        {currentTab === 'invoice' && (
          <TabMushakInvoice language={language} />
        )}

        {currentTab === 'sandbox' && (
          <TabClientSandbox
            language={language}
            clientSlug={demoClientSlug}
            onClientChange={setDemoClientSlug}
          />
        )}

        {currentTab === 'vault' && (
          <TabDocumentVault language={language} />
        )}

        {currentTab === 'webhook' && (
          <TabWebhookRLS
            language={language}
            activeTenant={activeTenant}
            onTenantChange={setActiveTenant}
          />
        )}
      </main>

      {/* Rizum Khan Lock Deposit Modal */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      {/* Mobile-First Ergonomic Bottom Bar (Android Phone Safe) */}
      <div className="no-print fixed bottom-0 inset-x-0 z-40 bg-[#080C12]/95 backdrop-blur-md border-t border-[#1E293B] py-2 px-4 flex items-center justify-between text-xs sm:hidden">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-mono-num text-[11px]">
            Locked: ৳{(lockedAmountBDT / 100000).toFixed(1)}L
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs"
          >
            + Lock Deposit
          </button>
        </div>
      </div>
    </div>
  );
}
