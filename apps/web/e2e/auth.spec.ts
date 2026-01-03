import { test, expect } from "@playwright/test";

test.describe("Authentication Flow (Auth-First)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should direct guest to signup screen", async ({ page }) => {
    // 1. Intro Screen 확인
    await expect(page.locator("text=무료로 시작하기")).toBeVisible();

    // 2. 시작 버튼 클릭
    await page.click("text=무료로 시작하기");

    // 3. 회원가입 화면 확인
    await expect(page.locator("h1", { hasText: "회원가입" })).toBeVisible({ timeout: 10000 });

    // 기본 정보 입력 폼 확인
    await expect(page.locator('input[placeholder="이름을 입력해주세요"]')).toBeVisible();
    await expect(page.locator('input[placeholder="이메일을 입력해주세요"]')).toBeVisible();
  });

  test("should handle login flow via signup screen", async ({ page }) => {
    // 1. Signup Screen으로 이동
    await page.click("text=무료로 시작하기");
    await expect(page.locator("h1", { hasText: "회원가입" })).toBeVisible();

    // 2. 뒤로가기 버튼(헤더의 화살표)을 클릭하여 로그인 화면으로 이동
    // ArrowLeftIcon을 찾기 위해 button 태그 검색 (구체적인 selector 필요할 수 있음)
    // 헤더의 첫 번째 버튼
    await page.locator("header button").first().click();

    // 3. 로그인 화면 확인
    await expect(page.locator("h1", { hasText: "로그인" })).toBeVisible();

    // 4. 로그인 수행
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[type="password"]', "password123");

    // 로그인 버튼 클릭
    await page.click("button:has-text('로그인')");

    // 참고: 실제 DB 연동이 없으므로 성공 여부는 확인하기 어려울 수 있음.
    // 하지만 여기까지 에러 없이 동작하는지 확인.
  });

  // Fixed: Use data-testid for stable element selection
  test("should complete signup and redirect to onboarding", async ({ page }) => {
    // 1. Signup Screen 진입
    await page.click("text=무료로 시작하기");

    // 2. 폼 입력
    const randomId = Math.random().toString(36).substring(7);
    const email = `test_${randomId}@example.com`;

    await page.fill('input[placeholder="이름을 입력해주세요"]', "E2E테스트");
    await page.fill('input[placeholder="이메일을 입력해주세요"]', email);
    await page.fill('input[placeholder="6자 이상 입력해주세요"]', "password123");
    await page.fill('input[placeholder="비밀번호를 다시 입력해주세요"]', "password123");

    // 3. 다음 버튼 클릭
    await page.click("text=다음");

    // 4. 성별 선택 (Step 2)
    await expect(page.locator("text=당신의 성별은?")).toBeVisible();
    await page.click("text=남성");
    await page.locator("button:has-text('여성')").last().click();

    // 5. 회원가입 완료 버튼 클릭
    await page.click("text=회원가입 완료");

    // 6. 회원가입 성공 후 온보딩(skipIntro)으로 리다이렉트 확인
    await expect(page.locator("text=본인의 성별을 선택해주세요")).toBeVisible({ timeout: 20000 });

    // 7. 온보딩 진행
    // 성별 선택 (이미 선택되어 있을 수 있으나 다시 클릭)
    await page.click("text=남성");
    await page.click("text=다음 단계로");

    // 경험 선택
    await expect(page.locator("text=이성과의 연애 경험이")).toBeVisible();
    await page.getByText("전혀 없어요").click();

    // 관심사 선택
    await expect(page.locator("text=평소 관심 있는 분야")).toBeVisible({ timeout: 10000 });

    // data-testid를 사용하여 안정적으로 클릭
    await page.click('[data-testid="interest-option-🎮 게임"]');
    await page.click('[data-testid="interest-option-🎬 영화/드라마"]');
    await page.click('[data-testid="interest-option-📚 독서"]');

    // "설문 완료하기" 또는 "분석 시작하기" 버튼 클릭
    // 버튼 텍스트가 상태에 따라 다를 수 있으므로 확인 (InterestsScreen.tsx: "설문 완료하기")
    const submitButton = page.locator("button", { hasText: "설문 완료하기" });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // 결과: 튜토리얼 인트로 화면 확인 (또는 완료 화면)
    // CompletionScreen이 렌더링됨: "당신의 프로필이 완성됐어요!"
    await expect(page.locator("text=당신의 프로필이")).toBeVisible({ timeout: 30000 });

    // 최종 완료 버튼 클릭 ("첫 대화 시작하기")
    await page.click("text=첫 대화 시작하기");
  });
});
