import { ROLEPLAY_SCENARIOS, Scenario } from "../data/scenarios";

class ScenarioService {
  /**
   * 모든 시나리오 목록을 비동기로 가져옵니다.
   */
  async getScenarios(): Promise<Scenario[]> {
    // 추후 API 호출로 대체 가능
    return Promise.resolve(ROLEPLAY_SCENARIOS);
  }

  /**
   * ID로 시나리오를 조회합니다.
   */
  async getScenarioById(id: string): Promise<Scenario | undefined> {
    return Promise.resolve(ROLEPLAY_SCENARIOS.find((s) => s.id === id));
  }

  /**
   * 난이도별 시나리오를 필터링합니다.
   */
  async getScenariosByDifficulty(
    difficulty: Scenario["difficulty"],
  ): Promise<Scenario[]> {
    return Promise.resolve(
      ROLEPLAY_SCENARIOS.filter((s) => s.difficulty === difficulty),
    );
  }
}

export const scenarioService = new ScenarioService();
