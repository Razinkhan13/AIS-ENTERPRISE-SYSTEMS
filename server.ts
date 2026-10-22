import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const portArgIndex = process.argv.indexOf('--port');
  const cliPort = portArgIndex !== -1 && process.argv[portArgIndex + 1] ? Number(process.argv[portArgIndex + 1]) : null;
  const PORT = cliPort || (process.env.NODE_ENV === 'production' ? (Number(process.env.PORT) || 3000) : 3000);

  app.use(express.json());

  // Server-side GoogleGenAI client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Check Ollama/LocalAI connection and list installed local models
  app.post('/api/ai/ollama-status', async (req: Request, res: Response) => {
    const endpoint = req.body.endpoint || 'http://localhost:11434';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const resp = await fetch(`${endpoint}/api/tags`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (resp.ok) {
        const data = await resp.json();
        return res.json({
          online: true,
          endpoint,
          models: data.models?.map((m: { name: string }) => m.name) || ['llama3.2:latest'],
        });
      }
      return res.json({ online: false, endpoint, error: `HTTP ${resp.status}` });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Connection failed';
      return res.json({
        online: false,
        endpoint,
        error: errorMsg,
        guide: 'Start Ollama locally: Run "ollama run llama3.2" on your PC',
      });
    }
  });

  // Dual-Engine Chat Endpoint (Gemini 3.8 Flash + Google Search Grounding OR Open-Source Ollama/LocalAI)
  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    try {
      const {
        messages = [],
        systemInstruction = '',
        engine = 'gemini',
        model = 'gemini-3.8-flash',
        enableGrounding = true,
        ollamaEndpoint = 'http://localhost:11434',
        ollamaModel = 'llama3.2',
      } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      // --- ENGINE 1: OPEN-SOURCE OLLAMA / LOCALAI ENDPOINT ---
      if (engine === 'ollama') {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 15000);

          const openAiMessages = [
            ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
            ...messages.map((m: { role: string; content: string }) => ({
              role: m.role === 'assistant' || m.role === 'model' ? 'assistant' : 'user',
              content: m.content,
            })),
          ];

          const response = await fetch(`${ollamaEndpoint}/v1/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: ollamaModel || 'llama3.2',
              messages: openAiMessages,
              temperature: 0.7,
            }),
            signal: controller.signal,
          });

          clearTimeout(timeout);

          if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Ollama returned status ${response.status}: ${errText}`);
          }

          const data = await response.json();
          const replyText = data.choices?.[0]?.message?.content || 'No response generated from local model.';

          return res.json({
            text: replyText,
            engine: 'ollama',
            model: ollamaModel,
            citations: [],
            groundingQueries: [],
          });
        } catch (ollamaErr: unknown) {
          const errMsg = ollamaErr instanceof Error ? ollamaErr.message : 'Ollama request failed';
          console.warn('Ollama local bridge failed, falling back to Gemini API:', errMsg);

          // Fallback to Gemini if local Ollama server is offline or unreachable
          const geminiContents = messages.map((m: { role: string; content: string }) => ({
            role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
            parts: [{ text: m.content }],
          }));

          const fallbackResponse = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: geminiContents,
            config: {
              systemInstruction: systemInstruction
                ? `${systemInstruction}\n[Note: Running via cloud fallback as local Ollama (${ollamaEndpoint}) is offline]`
                : undefined,
              tools: enableGrounding ? [{ googleSearch: {} }] : undefined,
            },
          });

          const searchChunks = fallbackResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
          const searchQueries = fallbackResponse.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

          const citations = searchChunks
            .map((chunk: { web?: { uri?: string; title?: string } }) => chunk.web?.title || chunk.web?.uri)
            .filter(Boolean);

          return res.json({
            text: fallbackResponse.text,
            engine: 'gemini-fallback',
            model: 'gemini-3.8-flash',
            warning: `Local Ollama endpoint (${ollamaEndpoint}) was unreachable. Answer generated using Gemini 3.8 Flash.`,
            citations,
            groundingQueries: searchQueries,
          });
        }
      }

      // --- ENGINE 2: GOOGLE GEMINI API (Search-Grounded) ---
      // Map contents for multi-turn chat
      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      // Select supported model
      const targetModel =
        model === 'gemini-4-argon' || model === 'gemini-3.1-flash-lite'
          ? model
          : 'gemini-3.8-flash';

      const response = await ai.models.generateContent({
        model: targetModel,
        contents,
        config: {
          systemInstruction: systemInstruction || undefined,
          // Search Grounding using Google Search
          tools: enableGrounding ? [{ googleSearch: {} }] : undefined,
        },
      });

      const searchChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const searchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

      const citations = searchChunks
        .map((chunk: { web?: { uri?: string; title?: string } }) => chunk.web?.title || chunk.web?.uri)
        .filter(Boolean);

      return res.json({
        text: response.text,
        engine: 'gemini',
        model: targetModel,
        citations,
        groundingQueries: searchQueries,
      });
    } catch (error: unknown) {
      console.error('AI chat endpoint error:', error);
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      return res.status(500).json({ error: message });
    }
  });

  // Serve static assets or mount Vite in dev
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`AIS Command Center server listening on port ${PORT}`);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
    } else {
      console.error('Server error:', err);
    }
  });

  process.on('SIGTERM', () => {
    server.close(() => process.exit(0));
  });
  process.on('SIGINT', () => {
    server.close(() => process.exit(0));
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
