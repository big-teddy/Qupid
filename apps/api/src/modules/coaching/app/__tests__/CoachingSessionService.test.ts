
import { CoachingSessionService } from "../CoachingSessionService.js";
import { ConversationService } from "../../../chat/app/ConversationService.js";
import { AIService } from "../../../chat/app/AIService.js";
import { MessageService } from "../../../chat/app/MessageService.js";
import { AnalysisService } from "../../../chat/app/AnalysisService.js";
import { CoachService } from "../CoachService.js";
import { NotificationService } from "../../../notification/app/NotificationService.js";

// Mock dependencies
jest.mock("../../../chat/app/ConversationService");
jest.mock("../../../chat/app/AIService");
jest.mock("../../../chat/app/MessageService");
jest.mock("../../../chat/app/AnalysisService");
jest.mock("../../../chat/app/AnalysisService");
jest.mock("../CoachService");
jest.mock("../../../notification/app/NotificationService");

describe("CoachingSessionService", () => {
    let coachingSessionService: CoachingSessionService;
    let mockConversationService: jest.Mocked<ConversationService>;
    let mockAIService: jest.Mocked<AIService>;
    let mockMessageService: jest.Mocked<MessageService>;
    let mockCoachService: jest.Mocked<CoachService>;
    let mockAnalysisService: jest.Mocked<AnalysisService>;
    let mockNotificationService: jest.Mocked<NotificationService>;

    beforeEach(() => {
        mockConversationService = new ConversationService() as jest.Mocked<ConversationService>;
        mockAIService = new AIService() as jest.Mocked<AIService>;
        mockMessageService = new MessageService() as jest.Mocked<MessageService>;
        mockAnalysisService = new AnalysisService() as jest.Mocked<AnalysisService>;
        mockCoachService = new CoachService() as jest.Mocked<CoachService>;
        mockNotificationService = new NotificationService() as jest.Mocked<NotificationService>;

        coachingSessionService = new CoachingSessionService(
            mockConversationService,
            mockAIService,
            mockMessageService,
            mockAnalysisService,
            mockCoachService,
            mockNotificationService
        );
    });

    describe("createSession", () => {
        it("should create a session via ConversationService", async () => {
            mockCoachService.getCoachById.mockResolvedValue({
                id: "coach-1",
                name: "Test Coach",
                specialty: "Testing",
                tagline: "I test things",
                intro: "Hello",
                avatar: "avatar.png",
                system_instruction: "You are a test coach"
            });
            mockConversationService.createSession.mockResolvedValue("session-123");

            const sessionId = await coachingSessionService.createSession("coach-1", "user-1");

            expect(mockCoachService.getCoachById).toHaveBeenCalledWith("coach-1");
            expect(mockConversationService.createSession).toHaveBeenCalledWith(
                "user-1",
                "coach-1",
                "coach",
                expect.stringContaining("Test Coach")
            );
            expect(sessionId).toBe("session-123");
        });
    });

    describe("sendMessage", () => {
        it("should send message and return AI response", async () => {
            const mockSession = {
                addMessage: jest.fn(),
            };
            mockConversationService.ensureSession.mockResolvedValue(mockSession as any);
            mockAIService.generateResponse.mockResolvedValue("AI Response");

            const response = await coachingSessionService.sendMessage("session-123", "Hello");

            expect(mockConversationService.ensureSession).toHaveBeenCalledWith("session-123");
            expect(mockMessageService.saveMessage).toHaveBeenCalledTimes(2); // User + AI
            expect(mockSession.addMessage).toHaveBeenCalledTimes(2);
            expect(mockAIService.generateResponse).toHaveBeenCalledWith(mockSession, "Hello", "coaching");
            expect(response).toBe("AI Response");
        });
    });
});
