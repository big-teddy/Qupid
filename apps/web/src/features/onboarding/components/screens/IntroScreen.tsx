import React from "react";
import { ProgressIndicator } from "../ProgressIndicator";

interface IntroScreenProps {
    onNext: () => void;
    onLogin: () => void;
    progress: number;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
    onNext,
    onLogin,
    progress,
}) => {
    return (
        <div className="flex flex-col h-full w-full animate-fade-in p-6">
            <header className="absolute top-4 left-6 right-6 h-14 flex items-center justify-center z-10">
                <ProgressIndicator total={4} current={progress} />
            </header>
            <main className="flex-1 flex flex-col justify-center -mt-14">
                <h1 className="text-3xl font-bold leading-tight animate-scale-in text-[#191F28]">
                    <span className="text-[#F093B0]">3개월 후,</span>
                    <br />
                    자신 있게 대화하는
                    <br />
                    당신을 만나보세요
                </h1>
                <div className="mt-10 space-y-4">
                    {[
                        "AI와 무제한 대화 연습",
                        "실시간 대화 실력 분석",
                        "실제 이성과 안전한 매칭",
                    ].map((text, i) => (
                        <div
                            key={text}
                            className="flex items-center opacity-0 animate-fade-in-up"
                            style={{
                                animationDelay: `${i * 100 + 200}ms`,
                                animationFillMode: "forwards",
                            }}
                        >
                            <span className="text-lg mr-3 text-[#0AC5A8]">✓</span>
                            <p className="text-lg font-medium text-[#191F28]">{text}</p>
                        </div>
                    ))}
                </div>
            </main>
            <div
                className="absolute bottom-0 left-0 right-0 p-4 bg-white flex flex-col gap-3"
                style={{ boxShadow: "0 -10px 30px -10px rgba(0,0,0,0.05)" }}
            >
                <button
                    onClick={onLogin}
                    className="w-full h-14 text-white text-lg font-bold rounded-xl transition-colors duration-300 bg-[var(--primary-pink-main)]"
                >
                    무료로 시작하기
                </button>
                <p className="text-center text-xs text-gray-400">
                    계정을 만들면 모든 기능을 이용할 수 있어요
                </p>
            </div>
        </div>
    );
};
