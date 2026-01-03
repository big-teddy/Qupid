/**
 * 프리셋 아바타 서비스
 * 
 * 실시간 생성 대신 사전 생성된 아바타 풀에서 랜덤 선택
 * - 안정성 향상
 * - 성별 오류 방지
 * - 로딩 속도 개선
 */

interface AvatarPool {
    male: string[];
    female: string[];
}

// 사전 생성된 아바타 이미지 경로
const AVATAR_POOL: AvatarPool = {
    female: [
        "/avatars/avatar_female_01_1766066269944.png",
        "/avatars/avatar_female_02_1766066289270.png",
        "/avatars/avatar_female_03_1766066310453.png",
        "/avatars/avatar_female_04_1766066328668.png",
        "/avatars/avatar_female_05_1766066354530.png",
        "/avatars/avatar_female_06_1766066395469.png",
        "/avatars/avatar_female_07_1766066413188.png",
        "/avatars/avatar_female_08_1766066432478.png",
    ],
    male: [
        "/avatars/avatar_male_01_1766066447923.png",
        "/avatars/avatar_male_02_1766066465655.png",
    ],
};

// 사용된 아바타 추적 (중복 방지)
const usedAvatars: Set<string> = new Set();

/**
 * 성별에 맞는 랜덤 아바타 선택
 * 중복 사용 최소화
 */
export function getPresetAvatar(gender: "male" | "female"): string {
    const pool = AVATAR_POOL[gender];

    // 사용 가능한 아바타 필터링
    const available = pool.filter(avatar => !usedAvatars.has(avatar));

    // 모두 사용되었으면 리셋
    if (available.length === 0) {
        pool.forEach(avatar => usedAvatars.delete(avatar));
        return getPresetAvatar(gender);
    }

    // 랜덤 선택
    const selected = available[Math.floor(Math.random() * available.length)];
    usedAvatars.add(selected);

    return selected;
}

/**
 * 특정 인덱스의 아바타 가져오기 (테스트용)
 */
export function getAvatarByIndex(gender: "male" | "female", index: number): string {
    const pool = AVATAR_POOL[gender];
    return pool[index % pool.length];
}

/**
 * 사용된 아바타 기록 초기화
 */
export function resetAvatarUsage(): void {
    usedAvatars.clear();
}

/**
 * 아바타 풀 크기 조회
 */
export function getAvatarPoolSize(gender: "male" | "female"): number {
    return AVATAR_POOL[gender].length;
}
