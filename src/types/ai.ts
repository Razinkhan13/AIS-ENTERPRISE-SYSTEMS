export type AiEngineType = 'gemini' | 'ollama';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: string[];
  groundingQueries?: string[];
  engineUsed?: string;
  modelUsed?: string;
}

export interface AiEngineConfig {
  engine: AiEngineType;
  geminiModel: 'gemini-3.8-flash' | 'gemini-4-argon' | 'gemini-3.1-flash-lite';
  enableGrounding: boolean;
  ollamaEndpoint: string;
  ollamaModel: string;
}
