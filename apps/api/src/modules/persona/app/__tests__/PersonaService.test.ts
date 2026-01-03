import { PersonaService } from "../PersonaService.js";
import { db } from "../../../../config/supabase.js";

// Mock the database
jest.mock("../../../../config/supabase", () => ({
    db: {
        getPersonas: jest.fn(),
        getPersona: jest.fn(),
    },
}));

const mockDbPersona = {
    id: "persona-1",
    name: "테스트 페르소나",
    age: 25,
    gender: "female",
    occupation: "개발자",
    mbti: "ENFP",
    avatar: "/avatars/test.png",
    bio: "안녕하세요!",
    tags: ["활발한", "친근한"],
    match_rate: 85,
    personality: "친절하고 유머러스한 성격",
    interests: ["음악", "영화"],
    difficulty: "Easy" as const,
    created_at: new Date().toISOString(),
};

const mockDbPersona2 = {
    id: "persona-2",
    name: "테스트 남성",
    age: 28,
    gender: "male",
    occupation: "디자이너",
    mbti: "INTJ",
    avatar: "/avatars/test2.png",
    bio: "반갑습니다",
    tags: ["차분한", "지적인"],
    match_rate: 90,
    personality: "논리적이고 분석적인 성격",
    interests: ["독서", "게임"],
    difficulty: "Medium" as const,
    created_at: new Date().toISOString(),
};

describe("PersonaService", () => {
    let service: PersonaService;
    const mockedDb = db as jest.Mocked<typeof db>;

    beforeEach(() => {
        service = new PersonaService();
        jest.clearAllMocks();
    });

    describe("getAllPersonas", () => {
        it("should return all personas mapped to domain objects", async () => {
            mockedDb.getPersonas.mockResolvedValue([mockDbPersona, mockDbPersona2]);

            const result = await service.getAllPersonas();

            expect(result).toHaveLength(2);
            expect(result[0]).toMatchObject({
                id: "persona-1",
                name: "테스트 페르소나",
                age: 25,
                gender: "female",
                job: "개발자",
                mbti: "ENFP",
            });
            expect(result[1].gender).toBe("male");
        });

        it("should return empty array when no personas exist", async () => {
            mockedDb.getPersonas.mockResolvedValue([]);

            const result = await service.getAllPersonas();

            expect(result).toHaveLength(0);
        });
    });

    describe("getPersonaById", () => {
        it("should return a persona when found", async () => {
            mockedDb.getPersona.mockResolvedValue(mockDbPersona);

            const result = await service.getPersonaById("persona-1");

            expect(result).not.toBeNull();
            expect(result?.id).toBe("persona-1");
            expect(result?.name).toBe("테스트 페르소나");
            expect(result?.interests).toHaveLength(2);
        });

        it("should return null when persona not found", async () => {
            mockedDb.getPersona.mockResolvedValue(null);

            const result = await service.getPersonaById("non-existent");

            expect(result).toBeNull();
        });
    });

    describe("getPersonasByGender", () => {
        it("should filter personas by gender", async () => {
            mockedDb.getPersonas.mockResolvedValue([mockDbPersona, mockDbPersona2]);

            const femalePersonas = await service.getPersonasByGender("female");
            const malePersonas = await service.getPersonasByGender("male");

            expect(femalePersonas).toHaveLength(1);
            expect(femalePersonas[0].name).toBe("테스트 페르소나");
            expect(malePersonas).toHaveLength(1);
            expect(malePersonas[0].name).toBe("테스트 남성");
        });
    });

    describe("getRecommendedPersonas", () => {
        it("should return opposite gender personas sorted by match rate", async () => {
            mockedDb.getPersonas.mockResolvedValue([mockDbPersona, mockDbPersona2]);

            // Male user should get female personas
            const result = await service.getRecommendedPersonas("male", 5);

            expect(result).toHaveLength(1);
            expect(result[0].gender).toBe("female");
        });

        it("should limit results to specified count", async () => {
            const manyPersonas = Array(10)
                .fill(null)
                .map((_, i) => ({
                    ...mockDbPersona,
                    id: `persona-${i}`,
                    match_rate: 50 + i,
                }));
            mockedDb.getPersonas.mockResolvedValue(manyPersonas);

            const result = await service.getRecommendedPersonas("male", 3);

            expect(result).toHaveLength(3);
            // Should be sorted by match_rate descending
            expect(result[0].match_rate).toBeGreaterThan(result[1].match_rate);
        });
    });
});
