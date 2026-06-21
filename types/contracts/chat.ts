export type ChatRole = "user" | "assistant";
export type ChatMessage = { id: string; userId: string; role: ChatRole; content: string; createdAt: string };
export type ChatRequest = { message: string; include_context: boolean };
export type ChatResponse = { userMessage: ChatMessage; message: ChatMessage; provider: "gemini" | "local-fallback"; streaming: boolean };
