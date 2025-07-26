
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { PerformanceData } from '../types/index';
import { ArrowLeftIcon } from '../components/Icons';
import { Chart, registerables } from 'chart.js/auto';

Chart.register(...registerables);

interface PerformanceDetailScreenProps {
  data: PerformanceData;
  onBack: () => void;
}

const PerformanceDetailScreen: React.FC<PerformanceDetailScreenProps> = ({ data, onBack }) => {
  const lineChartRef = useRef<HTMLCanvasElement>(null);
  const radarChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let lineChart: Chart | null = null;
    let radarChart: Chart | null = null;

    if (lineChartRef.current) {
        const lineCtx = lineChartRef.current.getContext('2d');
        if (lineCtx) {
            lineChart = new Chart(lineCtx, {
                type: 'line',
                data: {
                    labels: ['월', '화', '수', '목', '금', '토', '일'],
                    datasets: [{
                        label: '일일 점수',
                        data: data.dailyScores,
                        borderColor: '#F093B0',
                        backgroundColor: 'rgba(240, 147, 176, 0.1)',
                        fill: true,
                        tension: 0.4,
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
            });
        }
    }

    if (radarChartRef.current) {
      const radarCtx = radarChartRef.current.getContext('2d');
      if (radarCtx) {
        radarChart = new Chart(radarCtx, {
            type: 'radar',
            data: data.radarData,
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    r: {
                        angleLines: { display: false },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: { display: false },
                        grid: { circular: true }
                    }
                }
            }
        });
      }
    }
    
    return () => {
        lineChart?.destroy();
        radarChart?.destroy();
    };
  }, [data]);

  const isEmptyData = !data || !data.dailyScores || data.dailyScores.length === 0 || !data.radarData || !data.categoryScores || data.categoryScores.length === 0;

  if (isEmptyData) {
    return (
      <div className="flex flex-col h-full w-full bg-[#F9FAFB] items-center justify-center">
        <h2 className="text-lg font-bold text-[#191F28] mb-2">아직 성장 기록이 없습니다</h2>
        <p className="text-[#8B95A1] mb-4">대화를 시작하면 성장 기록이 자동으로 쌓입니다.</p>
        <button className="px-6 py-3 bg-[#F093B0] text-white rounded-xl font-bold" onClick={onBack}>홈으로 돌아가기</button>
      </div>
    );
  }

  const formatNumber = (n: number, digits = 0) => n.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });

  return (
    <div className="flex flex-col h-full w-full bg-[#F9FAFB]">
      <header className="flex-shrink-0 flex items-center justify-between p-3 border-b border-[#F2F4F6] bg-white">
        <div className="w-10">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
              <ArrowLeftIcon className="w-6 h-6 text-[#8B95A1]" />
            </button>
        </div>
        <h2 className="text-center text-lg font-bold text-[#191F28]">
          내 대화 실력 분석
        </h2>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-5 space-y-4">
        <section className="p-6 flex flex-col items-center bg-white rounded-2xl border border-[#F2F4F6]">
            <p className="text-lg font-semibold text-[#8B95A1]">이번 주 평균</p>
            <p className="text-6xl font-black text-[#F093B0] my-1">{formatNumber(data.weeklyScore)}</p>
            <p className="text-lg font-bold text-[#0AC5A8]">+{formatNumber(data.scoreChange)}점 ({formatNumber(data.scoreChangePercentage, 1)}%↑)</p>
        </section>

        <section className="p-5 bg-white rounded-2xl border border-[#F2F4F6]">
            <h3 className="font-bold text-lg">주간 점수 변화</h3>
            <div className="h-48 mt-2"><canvas ref={lineChartRef}></canvas></div>
        </section>
        
        <section className="p-5 bg-white rounded-2xl border border-[#F2F4F6]">
            <h3 className="font-bold text-lg">영역별 능력치</h3>
            <div className="h-64 mt-2"><canvas ref={radarChartRef}></canvas></div>
        </section>

        <section className="space-y-3">
             {data.categoryScores.map((cat: { title: string; emoji: string; goal: number; score: number; change: number }) => (
                <div key={cat.title} className="p-4 bg-white rounded-xl border border-[#F2F4F6]">
                    <div className="flex items-center">
                        <p className="text-2xl mr-3">{cat.emoji}</p>
                        <div className="flex-1">
                            <p className="font-bold">{cat.title}</p>
                            <p className="text-sm text-[#8B95A1]">목표: {cat.goal}점</p>
                        </div>
                        <p className="text-2xl font-bold text-[#191F28]">{formatNumber(cat.score)}점</p>
                        <p className={`ml-2 text-sm font-semibold ${cat.change >= 0 ? 'text-[#0AC5A8]' : 'text-red-500'}`}>
                            ({cat.change >= 0 ? '+' : ''}{formatNumber(cat.change)})
                        </p>
                    </div>
                </div>
            ))}
        </section>

        <section className="p-5 bg-white rounded-2xl border border-[#F2F4F6]">
            <h3 className="font-bold text-lg">대화 기록 요약</h3>
            <div className="grid grid-cols-2 gap-4 mt-4 text-center">
                <div>
                    <p className="text-xl font-bold">{data.stats.totalTime}</p>
                    <p className="text-sm text-[#8B95A1]">총 대화 시간</p>
                </div>
                 <div>
                    <p className="text-xl font-bold">{data.stats.sessionCount}회</p>
                    <p className="text-sm text-[#8B95A1]">대화 횟수</p>
                </div>
                 <div>
                    <p className="text-xl font-bold">{data.stats.avgTime}</p>
                    <p className="text-sm text-[#8B95A1]">평균 대화 시간</p>
                </div>
                 <div>
                    <p className="text-xl font-bold">{data.stats.longestSession.time}</p>
                    <p className="text-sm text-[#8B95A1]">{data.stats.longestSession.persona}</p>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
};

export default PerformanceDetailScreen;
