
import React, { useEffect, useState } from 'react';
import { Persona, ConversationAnalysis } from '../types/index';
import { TargetIcon, TrendingUpIcon, ArrowLeftIcon } from '../components/Icons';

interface ConversationAnalysisScreenProps {
  analysis: ConversationAnalysis;
  persona: Persona;
  onNext: () => void;
  onBack: () => void;
}

const ScoreDonut: React.FC<{ score: number }> = ({ score }) => {
    const [displayScore, setDisplayScore] = useState(0);
    const size = 140;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    
    useEffect(() => {
        let start = 0;
        const end = score;
        if (start === end) {
            setDisplayScore(end);
            return;
        };

        const timer = setInterval(() => {
            start += 1;
            setDisplayScore(start);
            if (start >= end) clearInterval(timer);
        }, 15);
        return () => clearInterval(timer);
    }, [score]);

    const offset = circumference - (displayScore / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
                <circle
                    className="text-[#F2F4F6]"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className="text-[#F093B0] transition-all duration-500 ease-out"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black" style={{ color: 'var(--primary-pink-main)' }}>{displayScore}</span>
                <span className="text-base font-bold" style={{ color: 'var(--text-secondary)' }}>/100점</span>
            </div>
        </div>
    );
};

const AnalysisCategory: React.FC<{ emoji: string, title: string, score: number, feedback: string }> = ({ emoji, title, score, feedback }) => {
    const scoreColorClass = score >= 80 ? 'text-[#0AC5A8]' : score >= 60 ? 'text-yellow-500' : 'text-red-500';
    const bgColorClass = score >= 80 ? 'bg-[#0AC5A8]' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500';
    return (
        <div className="p-4 bg-white rounded-xl border border-[#F2F4F6]">
            <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-[#191F28]">{emoji} {title}</h3>
                <p className={`text-xl font-bold ${scoreColorClass}`}>{score}점</p>
            </div>
            <div className="w-full bg-[#F2F4F6] h-1.5 rounded-full mt-2">
                <div className={`${bgColorClass} h-1.5 rounded-full`} style={{ width: `${score}%` }}></div>
            </div>
            <p className="mt-2 text-sm text-[#8B95A1]">{feedback}</p>
        </div>
    )
}

const ConversationAnalysisScreen: React.FC<ConversationAnalysisScreenProps> = ({ analysis, persona, onNext, onBack }) => {
  return (
    <div className="flex flex-col h-full w-full bg-[#F9FAFB]">
        <header className="flex-shrink-0 p-5 pt-6 text-center relative">
            <button onClick={onBack} className="absolute left-3 top-4 p-2 rounded-full hover:bg-gray-100">
                <ArrowLeftIcon className="w-6 h-6 text-[#8B95A1]" />
            </button>
            <h1 className="text-2xl font-bold text-[#191F28]">대화 분석 완료!</h1>
            <p className="text-base text-gray-500 mt-1">{persona.name}님과의 대화 피드백이에요.</p>
        </header>
        
        <main className="flex-1 overflow-y-auto px-5 pb-28">
            <section className="p-6 flex flex-col items-center bg-white rounded-2xl border border-[#F2F4F6] animate-scale-in">
                <ScoreDonut score={analysis.totalScore} />
                <p className="mt-4 text-xl font-bold text-center text-[#191F28]">{analysis.feedback}</p>
            </section>

            <section className="mt-6 space-y-3 animate-fade-in-up delay-100">
                <AnalysisCategory emoji="😊" title="친근함" score={analysis.friendliness.score} feedback={analysis.friendliness.feedback} />
                <AnalysisCategory emoji="🤔" title="호기심" score={analysis.curiosity.score} feedback={analysis.curiosity.feedback} />
                <AnalysisCategory emoji="💬" title="공감력" score={analysis.empathy.score} feedback={analysis.empathy.feedback} />
            </section>
            
            <section className="mt-6 p-5 bg-white rounded-xl border border-[#F2F4F6] animate-fade-in-up delay-200">
                <h3 className="text-lg font-bold text-[#191F28] flex items-center"><TrendingUpIcon className="w-5 h-5 mr-2 text-green-500"/> 잘한 점</h3>
                <ul className="mt-3 list-disc list-inside space-y-1.5 text-base text-[#191F28]">
                    {analysis.positivePoints.map((point, i) => <li key={i}>{point}</li>)}
                </ul>
            </section>

            <section className="mt-4 p-5 bg-white rounded-xl border border-[#F2F4F6] animate-fade-in-up delay-300">
                <h3 className="text-lg font-bold text-[#191F28] flex items-center"><TargetIcon className="w-5 h-5 mr-2 text-orange-500"/> 개선할 점</h3>
                <div className="mt-3 space-y-3">
                    {analysis.pointsToImprove.map((point, i) => (
                        <div key={i}>
                            <p className="font-bold">{point.topic}</p>
                            <p className="text-sm text-[#8B95A1]">{point.suggestion}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
        
        <footer className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-[#F2F4F6]">
             <button
                onClick={onNext}
                className="w-full h-14 bg-[#F093B0] text-white text-lg font-bold rounded-xl"
            >
                홈으로 돌아가기
            </button>
        </footer>
    </div>
  );
};

export default ConversationAnalysisScreen;
