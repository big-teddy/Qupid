import React, { useMemo } from 'react';

interface RadarChartProps {
    data: {
        friendliness: number;
        curiosity: number;
        empathy: number;
    };
    size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ data, size = 200 }) => {
    const center = size / 2;
    const radius = (size / 2) * 0.8;
    const maxVal = 100; // Assuming exp is roughly 0-100 per level or relative score

    // Normalize data to 0-1 range (adjust divisor based on expected max score/exp)
    const norm = {
        f: Math.min(data.friendliness / 100, 1),
        c: Math.min(data.curiosity / 100, 1),
        e: Math.min(data.empathy / 100, 1)
    };

    // 3 Points: Top (Friendliness), Bottom Right (Curiosity), Bottom Left (Empathy)
    const points = [
        // Top
        { x: center, y: center - radius },
        // Bottom Right
        { x: center + radius * Math.cos(Math.PI / 6), y: center + radius * Math.sin(Math.PI / 6) },
        // Bottom Left
        { x: center - radius * Math.cos(Math.PI / 6), y: center + radius * Math.sin(Math.PI / 6) }
    ];

    // Data Points
    const dataPoints = [
        { x: center, y: center - radius * norm.f },
        { x: center + radius * norm.c * Math.cos(Math.PI / 6), y: center + radius * norm.c * Math.sin(Math.PI / 6) },
        { x: center - radius * norm.e * Math.cos(Math.PI / 6), y: center + radius * norm.e * Math.sin(Math.PI / 6) }
    ];

    const polyPoints = points.map(p => `${p.x},${p.y}`).join(' ');
    const dataPolyPoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

    return (
        <svg width={size} height={size} className="mx-auto overflow-visible">
            {/* Background Triangle */}
            <polygon points={polyPoints} fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="1" />
            {/* Inner Triangles (Grid) */}
            {[0.25, 0.5, 0.75].map(scale => {
                const r = radius * scale;
                const gridPoints = [
                    { x: center, y: center - r },
                    { x: center + r * Math.cos(Math.PI / 6), y: center + r * Math.sin(Math.PI / 6) },
                    { x: center - r * Math.cos(Math.PI / 6), y: center + r * Math.sin(Math.PI / 6) }
                ].map(p => `${p.x},${p.y}`).join(' ');
                return <polygon key={scale} points={gridPoints} fill="none" stroke="#F2F4F6" strokeWidth="1" />;
            })}

            {/* Axis Lines */}
            {points.map((p, i) => (
                <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#E5E7EB" width="1" />
            ))}

            {/* Data Polygon */}
            <polygon points={dataPolyPoints} fill="rgba(219, 112, 147, 0.2)" stroke="#DB7093" strokeWidth="2" />

            {/* Data Dots */}
            {dataPoints.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill="#DB7093" />
            ))}

            {/* Labels */}
            <text x={center} y={center - radius - 10} textAnchor="middle" fontSize="12" fill="#4B5563">친근함</text>
            <text x={points[1].x + 10} y={points[1].y + 10} textAnchor="middle" fontSize="12" fill="#4B5563">호기심</text>
            <text x={points[2].x - 10} y={points[2].y + 10} textAnchor="middle" fontSize="12" fill="#4B5563">공감력</text>
        </svg>
    );
};
