import React from "react";
import { UserProfile } from "@qupid/core";
import { CheckIcon } from "@qupid/ui";
import { OnboardingHeader } from "../OnboardingHeader";
import { FixedBottomButton } from "../FixedBottomButton";

type NewUserProfile = Omit<
    UserProfile,
    "id" | "created_at" | "isTutorialCompleted"
>;

interface CompletionScreenProps {
    onComplete: () => void;
    profile: NewUserProfile;
    progress: number;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
    onComplete,
    profile,
    progress,
}) => {
    const partnerGender = profile.user_gender === "male" ? "여성 AI" : "남성 AI";
    return (
        <div className="flex flex-col h-full w-full animate-fade-in p-6">
            <OnboardingHeader progress={progress} />
            <main className="flex-1 flex flex-col justify-center -mt-14">
                <div className="w-32 h-32 rounded-full bg-[#F093B0] flex items-center justify-center animate-scale-in self-center">
                    <CheckIcon className="w-16 h-16 text-white" />
                </div>
                <h1
                    className="mt-8 text-[28px] font-bold text-center"
                    style={{ color: "#191F28" }}
                >
                    당신의 프로필이
                    <br />
                    완성됐어요!
                </h1>
                <div className="mt-6 p-6 bg-[#F9FAFB] rounded-2xl border border-[#E5E8EB]">
                    <ul className="space-y-3">
                        <li className="flex justify-between">
                            <span className="font-bold">성별</span>
                            <span>
                                {profile.user_gender === "male" ? "남성" : "여성"} (
                                {partnerGender}와 연습)
                            </span>
                        </li>
                        <li className="flex justify-between">
                            <span className="font-bold">경험</span>
                            <span>{profile.experience}</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="font-bold">관심사</span>
                            <span className="truncate ml-4">
                                {profile.interests
                                    .map((i: string) => i.split(" ")[1])
                                    .join(", ")}
                            </span>
                        </li>
                    </ul>
                </div>
            </main>
            <FixedBottomButton onClick={onComplete}>
                첫 대화 시작하기
            </FixedBottomButton>
        </div>
    );
};
