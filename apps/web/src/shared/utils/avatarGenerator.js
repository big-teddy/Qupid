/**
 * 페르소나 아바타 이미지 생성기
 *
 * 🚀 로컬 프리셋 아바타 사용 (외부 서비스 의존성 제거)
 * - 안정성 향상 (504 에러 방지)
 * - 빠른 로딩
 * - 고품질 AI 생성 이미지
 */
// 🎨 로컬 프리셋 아바타 (public/avatars/ 폴더에 저장됨)
const PREDEFINED_AVATARS = {
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
const usedAvatars = new Set();
// 🚀 랜덤 아바타 생성 (중복 최소화)
export const getRandomAvatar = (gender) => {
    const pool = PREDEFINED_AVATARS[gender];
    // 사용 가능한 아바타 필터링
    const available = pool.filter((avatar) => !usedAvatars.has(avatar));
    // 모두 사용되었으면 리셋
    if (available.length === 0) {
        pool.forEach((avatar) => usedAvatars.delete(avatar));
        return getRandomAvatar(gender);
    }
    // 랜덤 선택
    const selected = available[Math.floor(Math.random() * available.length)];
    usedAvatars.add(selected);
    return selected;
};
// 이름 기반 일관된 아바타 (같은 이름 = 같은 아바타)
export const getConsistentAvatar = (name, gender) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const avatars = PREDEFINED_AVATARS[gender];
    const index = Math.abs(hash) % avatars.length;
    return avatars[index];
};
// 기존 호환성 유지
export const generateAvatarUrl = (gender, _seed) => {
    return getRandomAvatar(gender);
};
