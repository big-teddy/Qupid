import { ChatService } from "../ChatService.js";
import { ConversationService } from "../ConversationService.js";
import { MessageService } from "../MessageService.js";
import { AnalysisService } from "../AnalysisService.js";
import { AIService } from "../AIService.js";
import { ChatSession } from "../../domain/ChatSession.js";

describe("ChatService", () => {
  let chatService: ChatService;
  let mockConvService: jest.Mocked<ConversationService>;
  let mockMsgService: jest.Mocked<MessageService>;
  let mockAnalysisService: jest.Mocked<AnalysisService>;
  let mockAIService: jest.Mocked<AIService>;

  beforeEach(() => {
    mockConvService = {
      createSession: jest.fn(),
      ensureSession: jest.fn(),
      getUserConversationHistory: jest.fn(),
      getSession: jest.fn(),
      endSession: jest.fn(),
      cleanupOldSessions: jest.fn(),
      getConversationDetail: jest.fn(),
      getConversationStats: jest.fn(),
      calculateStreak: jest.fn(),
    } as any;

    mockMsgService = {
      saveMessage: jest.fn(),
      getMessages: jest.fn(),
    } as any;

    mockAnalysisService = {
      analyzeConversation: jest.fn(),
      getRealtimeFeedback: jest.fn(),
      getCoachSuggestion: jest.fn(),
      saveConversationAnalysis: jest.fn(),
      getConversationAnalysis: jest.fn(),
      analyzeConversationStyle: jest.fn(),
    } as any;

    mockAIService = {
      generateResponse: jest.fn(),
      streamResponse: jest.fn(),
      processPostExchange: jest.fn(),
    } as any;

    chatService = new ChatService(
      mockConvService,
      mockMsgService,
      mockAnalysisService,
      mockAIService
    );
  });

  describe("createSession", () => {
    it("should delegate to ConversationService.createSession", async () => {
      mockConvService.createSession.mockResolvedValue("session-123");

      const result = await chatService.createSession("user1", "persona1", "sys");

      expect(result).toBe("session-123");
      expect(mockConvService.createSession).toHaveBeenCalledWith("user1", "persona1", "sys");
    });
  });

  describe("sendMessage", () => {
    it("should coordinate session, message saving, and AI response", async () => {
      const mockSession = { addMessage: jest.fn() } as unknown as ChatSession;
      mockConvService.ensureSession.mockResolvedValue(mockSession);
      mockAIService.generateResponse.mockResolvedValue("AI Response");

      const result = await chatService.sendMessage("session-123", "Hello AI");

      expect(result).toBe("AI Response");

      // 1. Ensure Session
      expect(mockConvService.ensureSession).toHaveBeenCalledWith("session-123");

      // 2. Save User Message
      expect(mockSession.addMessage).toHaveBeenCalledWith(expect.objectContaining({
        sender: "user",
        text: "Hello AI"
      }));
      expect(mockMsgService.saveMessage).toHaveBeenCalledWith("session-123", expect.objectContaining({
        sender: "user",
        text: "Hello AI"
      }));

      // 3. AI Service
      expect(mockAIService.generateResponse).toHaveBeenCalledWith(mockSession, "Hello AI");

      // 4. Save AI Message
      expect(mockSession.addMessage).toHaveBeenCalledWith(expect.objectContaining({
        sender: "ai",
        text: "AI Response"
      }));
      expect(mockMsgService.saveMessage).toHaveBeenCalledWith("session-123", expect.objectContaining({
        sender: "ai",
        text: "AI Response"
      }));

      // 5. Post Exchange
      expect(mockAIService.processPostExchange).toHaveBeenCalledWith(mockSession);
    });

    it("should propagate errors from sub-services", async () => {
      mockConvService.ensureSession.mockRejectedValue(new Error("Database error"));

      await expect(chatService.sendMessage("session-123", "Hi"))
        .rejects.toThrow("Database error");
    });
  });

  describe("analyzeConversation", () => {
    it("should delegate to AnalysisService", async () => {
      const mockMessages = [] as any;
      const mockAnalysis = { totalScore: 100 } as any;
      mockAnalysisService.analyzeConversation.mockResolvedValue(mockAnalysis);

      const result = await chatService.analyzeConversation(mockMessages);

      expect(result).toBe(mockAnalysis);
      expect(mockAnalysisService.analyzeConversation).toHaveBeenCalledWith(mockMessages);
    });
  });

  describe("streamMessage", () => {
    it("should coordinate streaming flow properly", async () => {
      const mockSession = { addMessage: jest.fn() } as unknown as ChatSession;
      const onChunk = jest.fn();
      mockConvService.ensureSession.mockResolvedValue(mockSession);
      mockAIService.streamResponse.mockResolvedValue("Full AI Response");

      await chatService.streamMessage("session-123", "User Msg", onChunk);

      expect(mockConvService.ensureSession).toHaveBeenCalledWith("session-123");
      expect(mockMsgService.saveMessage).toHaveBeenCalledWith("session-123", expect.objectContaining({ text: "User Msg" }));
      expect(mockAIService.streamResponse).toHaveBeenCalledWith(mockSession, "User Msg", onChunk);
      expect(mockMsgService.saveMessage).toHaveBeenCalledWith("session-123", expect.objectContaining({ text: "Full AI Response" }));
      expect(mockAIService.processPostExchange).toHaveBeenCalledWith(mockSession);
    });
  });
});
