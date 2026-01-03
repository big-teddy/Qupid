import { UserService } from "../UserService.js";

// Mock Supabase
jest.mock("../../../../config/supabase.js");

describe("UserService", () => {
    let userService: UserService;
    let mockDb: any;
    let mockSupabase: any;

    beforeEach(() => {
        // Create mock structure
        mockDb = {
            getUser: jest.fn(),
            createUser: jest.fn(),
            toggleFavorite: jest.fn(),
            getFavorites: jest.fn(),
        };

        mockSupabase = {
            from: jest.fn(),
        };

        // Set up mocks
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const config = require("../../../../config/supabase");
        config.db = mockDb;
        config.supabase = mockSupabase;

        userService = new UserService();
        jest.clearAllMocks();
    });

    describe("getUserProfile", () => {
        it("should return user profile when user exists", async () => {
            const mockDbUser = {
                id: "user-123",
                name: "Test User",
                user_gender: "male",
                partner_gender: "female",
                experience: "beginner",
                confidence: 3,
                difficulty: 2,
                interests: ["music", "movies"],
                is_tutorial_completed: false,
                created_at: "2024-01-01",
            };

            mockDb.getUser.mockResolvedValue(mockDbUser);

            const result = await userService.getUserProfile("user-123");

            expect(result).toEqual({
                id: "user-123",
                name: "Test User",
                user_gender: "male",
                partner_gender: "female",
                experience: "beginner",
                confidence: 3,
                difficulty: 2,
                interests: ["music", "movies"],
                isTutorialCompleted: false,
                created_at: "2024-01-01",
            });
        });

        it("should return null when user does not exist", async () => {
            mockDb.getUser.mockResolvedValue(null);

            const result = await userService.getUserProfile("non-existent");

            expect(result).toBeNull();
        });
    });

    describe("createUserProfile", () => {
        it("should create user with default partner_gender when not provided", async () => {
            const mockDbUser = {
                id: "new-user",
                name: "New User",
                user_gender: "male",
                partner_gender: "female",
                experience: "",
                confidence: 3,
                difficulty: 2,
                interests: [],
                is_tutorial_completed: false,
                created_at: "2024-01-01",
            };

            mockDb.createUser.mockResolvedValue(mockDbUser);

            const result = await userService.createUserProfile({
                id: "new-user",
                name: "New User",
                user_gender: "male",
            });

            expect(mockDb.createUser).toHaveBeenCalledWith(
                expect.objectContaining({
                    user_gender: "male",
                    partner_gender: "female",
                }),
            );
            expect(result).not.toBeNull();
        });
    });

    describe("toggleFavorite", () => {
        it("should toggle favorite status", async () => {
            mockDb.toggleFavorite.mockResolvedValue(true);

            const result = await userService.toggleFavorite("user-123", "persona-456");

            expect(mockDb.toggleFavorite).toHaveBeenCalledWith("user-123", "persona-456");
            expect(result).toBe(true);
        });
    });

    describe("getFavorites", () => {
        it("should return list of favorite persona IDs", async () => {
            mockDb.getFavorites.mockResolvedValue([
                { persona_id: "persona-1" },
                { persona_id: "persona-2" },
            ]);

            const result = await userService.getFavorites("user-123");

            expect(result).toEqual(["persona-1", "persona-2"]);
        });
    });
});
