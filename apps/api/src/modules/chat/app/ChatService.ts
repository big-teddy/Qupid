import { ChatSession } from "../domain/ChatSession.js";
import { Message, ConversationAnalysis, RealtimeFeedback } from "@qupid/core";
import { ConversationService } from "./ConversationService.js";
import { MessageService } from "./MessageService.js";
import { AnalysisService } from "./AnalysisService.js";
import { AIService } from "./AIService.js";

// Facade for Chat Sub-services
export class ChatService {
  private conversationService: ConversationService;
  private messageService: MessageService;
  private analysisService: AnalysisService;
  private aiService: AIService;

  constructor(
    conversationService?: ConversationService,
    messageService?: MessageService,
    analysisService?: AnalysisService,
    aiService?: AIService,
  ) {
    this.conversationService = conversationService || new ConversationService();
    this.messageService = messageService || new MessageService();
    this.analysisService = analysisService || new AnalysisService();
    this.aiService = aiService || new AIService();
  }

  // =====================================================
  // Session Management (Delegated to ConversationService)
  // =====================================================

  async createSession(
    userId: string,
    personaId: string,
    systemInstruction: string,
  ): Promise<string> {
    return this.conversationService.createSession(
      userId,
      personaId,
      'persona',
      systemInstruction,
    );
  }

  getSession(sessionId: string): ChatSession | undefined {
    return this.conversationService.getSession(sessionId);
  }

  async endSession(sessionId: string): Promise<void> {
    return this.conversationService.endSession(sessionId);
  }

  cleanupOldSessions(): void {
    return this.conversationService.cleanupOldSessions();
  }

  // =====================================================
  // Messaging Logic (Orchestrated)
  // =====================================================

  async sendMessage(sessionId: string, message: string): Promise<string> {
    // 1. Ensure Session
    const session = await this.conversationService.ensureSession(sessionId);

    // 2. Process User Message
    const userMsg = {
      sender: "user" as const,
      text: message,
      timestamp: Date.now(),
    };
    session.addMessage(userMsg);
    await this.messageService.saveMessage(sessionId, userMsg);

    // 3. Generate AI Response
    const aiResponseText = await this.aiService.generateResponse(
      session,
      message,
    );

    // 4. Process AI Message
    const aiMsg = {
      sender: "ai" as const,
      text: aiResponseText,
      timestamp: Date.now(),
    };
    session.addMessage(aiMsg);
    await this.messageService.saveMessage(sessionId, aiMsg);

    // 5. Post-Process (Async Memory Extraction)
    this.aiService.processPostExchange(session);

    return aiResponseText;
  }

  async streamMessage(
    sessionId: string,
    userMessage: string,
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    // 1. Ensure Session
    const session = await this.conversationService.ensureSession(sessionId);

    // 2. Process User Message
    const userMsg = {
      sender: "user" as const,
      text: userMessage,
      timestamp: Date.now(),
    };
    session.addMessage(userMsg);
    await this.messageService.saveMessage(sessionId, userMsg);

    // 3. Stream AI Response
    const aiResponseText = await this.aiService.streamResponse(
      session,
      userMessage,
      onChunk,
    );

    // 4. Process AI Message
    const aiMsg = {
      sender: "ai" as const,
      text: aiResponseText,
      timestamp: Date.now(),
    };
    session.addMessage(aiMsg);
    await this.messageService.saveMessage(sessionId, aiMsg);

    // 5. Post-Process (Async Memory Extraction)
    this.aiService.processPostExchange(session);
  }

  // =====================================================
  // Analysis & Feedback (Delegated to AnalysisService)
  // =====================================================

  async analyzeConversation(
    messages: Message[],
  ): Promise<ConversationAnalysis> {
    return this.analysisService.analyzeConversation(messages);
  }

  async getRealtimeFeedback(
    lastUserMessage: string,
    lastAiMessage?: string,
  ): Promise<RealtimeFeedback | null> {
    return this.analysisService.getRealtimeFeedback(
      lastUserMessage,
      lastAiMessage,
    );
  }

  async getCoachSuggestion(
    messages: Message[],
    persona?: any,
  ): Promise<{ reason: string; suggestion: string }> {
    return this.analysisService.getCoachSuggestion(messages, persona);
  }

  async saveConversationAnalysis(
    conversationId: string,
    analysis: ConversationAnalysis,
  ): Promise<void> {
    return this.analysisService.saveConversationAnalysis(
      conversationId,
      analysis,
    );
  }

  async getConversationAnalysis(conversationId: string): Promise<any> {
    return this.analysisService.getConversationAnalysis(conversationId);
  }

  async analyzeConversationStyle(messages: Message[]) {
    return this.analysisService.analyzeConversationStyle(messages);
  }

  // =====================================================
  // History & Stats (Delegated)
  // =====================================================

  async getUserConversationHistory(
    userId: string,
    page?: number,
    limit?: number,
    filter?: string,
  ) {
    return this.conversationService.getUserConversationHistory(
      userId,
      page,
      limit,
      filter,
    );
  }

  async getConversationDetail(userId: string, conversationId: string) {
    return this.conversationService.getConversationDetail(
      userId,
      conversationId,
    );
  }

  async getConversationStats(userId: string) {
    return this.conversationService.getConversationStats(userId);
  }

  async calculateStreak(userId: string): Promise<number> {
    return this.conversationService.calculateStreak(userId);
  }

  // =====================================================
  // Legacy Wrappers
  // =====================================================

  async getConversationMessages(conversationId: string): Promise<Message[]> {
    return this.messageService.getMessages(conversationId);
  }
}
