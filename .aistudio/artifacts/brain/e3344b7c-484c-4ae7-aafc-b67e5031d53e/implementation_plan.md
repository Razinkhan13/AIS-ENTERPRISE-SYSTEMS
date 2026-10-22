# Open-Source & Gemini Dual-Engine AI Integration

Embed autonomous AI intelligence directly into the AIS Enterprise Command Center: an interactive NRB Diaspora Negotiation Simulator embedded inside Tab 1 (WhatsApp Blitz) and an autonomous Gemini 4 Argon Co-Founder & Macro Deal Strategist with Google Search Grounding inside Tab 2 (Cold Audit), fully switchable between Google Gemini API and 100% free self-hosted open-source models (Ollama, LocalAI, llama.cpp, vLLM).

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were confirmed with the user in Phase 1:
> - **Embedded Placement**: Rather than adding a detached modal or separate tab, intelligent conversational interfaces are embedded directly within their operational contexts: Tab 1 (WhatsApp outreach & concierge) and Tab 2 (Cold audit & macro balance sheet diagnostics).
> - **Open-Source & Bridge Architecture**: A self-hosted OpenAI-compatible endpoint bridge (Ollama, LocalAI, vLLM, Open-WebUI) running at zero subscription cost, with dual-engine fallback to Google Gemini (`gemini-3.8-flash` with Google Search Grounding for real-time Dhaka real estate, rebar prices, Bangladesh Bank repo rate, and NBR VAT rules).
> - **Dual Operational Persona**:
>   1. **Tab 1 Persona (NRB Diaspora Buyer Concierge & Simulator)**: Tests high-friction foreign buyer objections (foreign currency repatriation, 36-month construction milestone EMI, 48-hour unit holds, Saf-Kabala deed registration).
>   2. **Tab 2 Persona (Gemini 4 Argon AI Co-Founder & Deal Strategist)**: Autonomously advises Rizum Khan on boardroom maneuvers, REDMA Section 14 statutory refund defense, and commercial bank overdraft restructuring.

---

## 1. Overview & Core Concept

- **What It Does**:
  - **Tab 1: Embedded NRB Negotiation Simulator**: An interactive, multi-turn conversational cockpit embedded alongside the WhatsApp prototype. Allows Rizum Khan and sales teams to simulate live negotiations with prospective non-resident Bangladeshi buyers across New York, London, and Dubai time zones. Users can toggle between automated AI qualification and roleplay objection testing.
  - **Tab 2: Embedded Gemini 4 Argon Boardroom Co-Founder**: An intelligent deal diagnostic chat embedded beneath the 8-Katha REDMA model. Provides instant macroeconomic research, counter-arguments for skeptical chairmen, and real-time Google Search grounding on Bangladesh real estate policies, steel/cement prices, and DAP 2022 amendments.
  - **Open-Source Engine Bridge**: A zero-cost integration panel allowing Rizum Khan to connect to a local Ollama server (`http://localhost:11434/v1`), LocalAI, or any local OpenAI-compatible endpoint on their Windows PC, or switch to server-side Gemini API with one click.
- **Target Audience / Persona**: Rizum Khan (Founder & Final Signatory) conducting boardroom negotiations and qualifying high-ticket real estate developers in Dhaka.
- **Key Value**: Zero paid SaaS dependency ($0/mo cost), preserving 100% data privacy and offline readiness during Dhaka commutes, while providing instant live market research and high-pressure objection training.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Tab 1 Flow (NRB Simulation & Script Polishing)**:
   - User navigates to `📱 1-Tap WhatsApp`.
   - Alongside the static 4-bubble preview, an expandable **Interactive Concierge & Negotiation Sandbox** allows multi-turn dialogue.
   - User can click preset objection pills (e.g., *"What if DAP 2022 cancels the top floor?"*, *"Can I repatriate USD if the build stalls?"*, *"Why Trust Bank Escrow?"*).
   - The engine generates a cultured, bilingual response in under 2 seconds, displaying source conversion rates and time-zone context.

2. **Tab 2 Flow (Boardroom Strategy & Live Grounding)**:
   - User adjusts sliders on the Executive Capital Relief Cockpit in `🏗️ 10s Cold Audit`.
   - An embedded **Gemini 4 Argon Strategic Advisory Console** analyzes the exact calculated numbers (e.g. ৳2.41 Cr/mo overdraft bleed).
   - User can ask strategic questions or click one-tap boardroom prompts (*"How do I counter Sheltech's chairman on the Zamindar Fallacy?"*, *"Search latest Bangladesh Bank repo rate and NBR IT-ES VAT rules"*).
   - Grounded responses cite real-time search queries with verification badges.

3. **Engine Settings Flow**:
   - Both interfaces include an unobtrusive, single-line engine switcher:
     - `● Local Ollama (11434) [Free / Offline]`
     - `● Google Gemini 3.8 Flash [Search Grounded]`
   - Users can test connection health with an instant ping indicator.

### Visual Identity & Theme (Stitch Design System)

- **Canvas & Card Architecture**: Obsidian `#080C12` background, Navy `#0F1722` structural surfaces with hairline `1px solid #1E293B` boundaries.
- **Typography**: Display titles in `'Syne'`, body copy in `'DM Sans'`, tabular figures and endpoints in `'JetBrains Mono'`, and Bengali text in `'Noto Sans Bengali'`.
- **Chat Styling**: Clean speech bubbles with subtle status metadata (`· Delivered 02:14 AM · 38s SLA`). No cluttered badge sandwiches or decorative animated status dots on static cards.
- **Micro-Interactions**: Smooth 150ms hover feedback, clear active states on segmented controls, auto-scrolling message streams, and copy buttons with 2-second check confirmations.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Direct Tab Embedding vs. Separate Tab**
  - *Chosen Approach*: Embed the chat consoles directly within Tab 1 (WhatsApp) and Tab 2 (Audit) rather than creating an isolated 8th tab.
  - *Why*: Eliminates context-switching friction. When Rizum Khan is auditing a developer's 8-katha site in Tab 2, the AI Co-Founder is immediately adjacent to the calculated numbers and presets.
  - *Alternatives Considered*: A global floating drawer was considered, but it obscured table columns and touch sliders on mobile and tablet viewports.

- **Decision 2: Dual Local Ollama Bridge + Server Gemini Proxy**
  - *Chosen Approach*: Implement a lightweight Express server-side proxy route `/api/ai/chat` that seamlessly routes to either Gemini API (`@google/genai` with `googleSearch` grounding) or local open-source Ollama/LocalAI instances based on client toggle.
  - *Why*: Fully satisfies the user's requirement for a 100% open-source solution while maintaining full compatibility with AI Studio's Gemini capabilities and search grounding.
  - *Zero SaaS Rule*: If no internet or external API key is present, the app gracefully falls back to the local open-source bridge or intelligent deterministic heuristic responses.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AIS COMMAND CENTER FRONTEND                          │
│                                                                             │
│  ┌───────────────────────────────┐     ┌─────────────────────────────────┐  │
│  │    Tab 1: 1-Tap WhatsApp      │     │      Tab 2: 10s Cold Audit      │  │
│  │ ───────────────────────────── │     │ ─────────────────────────────── │  │
│  │ • Verified Targets Grid       │     │ • 4-Slider Relief Cockpit       │  │
│  │ • Static 4-Bubble Mock        │     │ • 8-Katha REDMA Model           │  │
│  │ • [NEW] Embedded NRB Chatbot  │     │ • [NEW] Gemini 4 Argon Advisor  │  │
│  │   (Diaspora Objection Sim)    │     │   (Grounding & Boardroom Intel) │  │
│  └───────────────┬───────────────┘     └────────────────┬────────────────┘  │
│                  │                                      │                   │
│                  └───────────────────┬──────────────────┘                   │
│                                      ▼                                      │
│                        Dual-Engine Client Hook / Service                    │
│                      (Mode: Ollama Local vs. Gemini Cloud)                  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP POST /api/ai/chat
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SERVER BACKEND (server.ts)                        │
│                                                                             │
│                     ┌─────────────────────────────────┐                     │
│                     │       Router: /api/ai/chat      │                     │
│                     └────────────────┬────────────────┘                     │
│                                      │                                      │
│              ┌───────────────────────┴───────────────────────┐              │
│              ▼                                               ▼              │
│   [Engine: 'gemini']                              [Engine: 'ollama']        │
│   • GoogleGenAI SDK                               • Local Proxy Request     │
│   • gemini-3.8-flash                              • http://localhost:11434  │
│   • tools: [{ googleSearch: {} }]                 • /v1/chat/completions    │
│   • Server-side API key (no leak)                 • 100% Free / Open Source │
└─────────────────────────────────────────────────────────────────────────────┘
```

### State Model & Persistence

- **Chat Thread Store (`ais_chat_threads`)**:
  - `threadId`: `'nrb-simulator'` | `'argon-strategist'`
  - `messages`: Array of `{ id, role: 'user' | 'assistant', content, timestamp, citations?: string[], modelUsed }`
  - Persisted in browser `localStorage` with a 1-click `"Clear Thread"` or `"Export Transcript"` action.
- **Engine Preference Store (`ais_ai_engine_config`)**:
  - `activeEngine`: `'gemini'` | `'ollama'`
  - `ollamaEndpoint`: Default `http://localhost:11434`
  - `ollamaModel`: Default `llama3.2:latest` / `mistral:latest` / `qwen2.5:latest`
  - `searchGroundingEnabled`: Boolean (Gemini mode)

### Interactive Component & State Mapping

- **Tab 1: NRB Simulator Component**:
  - Manages real-time multi-turn conversation thread.
  - Preloaded starter objections:
    - *"Why should I trust a Dhaka developer with 30% upfront when I live in Queens?"*
    - *"Can I pay in GBP via Barclays to an escrow account?"*
    - *"What happens if DAP 2022 delays the occupancy certificate?"*
  - Automatically incorporates active project specs and currency into system prompts.
- **Tab 2: Argon Boardroom Advisor Component**:
  - Connects to current slider values (trapped capital, monthly OD bleed, REDMA penalty).
  - Preloaded boardroom strategic prompts:
    - *"Generate a 3-bullet opening script to break the Zamindar Fallacy with Sheltech's chairman."*
    - *"Search latest real estate VAT circulars from NBR for IT-enabled services."*
    - *"Calculate syndicate liquidation discount vs. 14.5% bank overdraft carrying cost."*
  - Displays search sources and grounding metadata when `googleSearch` is active.
- **Full-Stack Express Bridge (`server.ts`)**:
  - Handles `/api/ai/chat` with graceful error recovery (e.g. if Ollama is not running locally, returns actionable setup instructions without crashing).
  - Connects `@google/genai` with `gemini-3.8-flash` and `tools: [{ googleSearch: {} }]`.
