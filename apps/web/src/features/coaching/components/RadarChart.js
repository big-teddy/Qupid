import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const RadarChart = ({ data, size = 200 }) => {
  const center = size / 2;
  const radius = (size / 2) * 0.8;
  const maxVal = 100; // Assuming exp is roughly 0-100 per level or relative score
  // Normalize data to 0-1 range (adjust divisor based on expected max score/exp)
  const norm = {
    f: Math.min(data.friendliness / 100, 1),
    c: Math.min(data.curiosity / 100, 1),
    e: Math.min(data.empathy / 100, 1),
  };
  // 3 Points: Top (Friendliness), Bottom Right (Curiosity), Bottom Left (Empathy)
  const points = [
    // Top
    { x: center, y: center - radius },
    // Bottom Right
    {
      x: center + radius * Math.cos(Math.PI / 6),
      y: center + radius * Math.sin(Math.PI / 6),
    },
    // Bottom Left
    {
      x: center - radius * Math.cos(Math.PI / 6),
      y: center + radius * Math.sin(Math.PI / 6),
    },
  ];
  // Data Points
  const dataPoints = [
    { x: center, y: center - radius * norm.f },
    {
      x: center + radius * norm.c * Math.cos(Math.PI / 6),
      y: center + radius * norm.c * Math.sin(Math.PI / 6),
    },
    {
      x: center - radius * norm.e * Math.cos(Math.PI / 6),
      y: center + radius * norm.e * Math.sin(Math.PI / 6),
    },
  ];
  const polyPoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const dataPolyPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");
  return _jsxs("svg", {
    width: size,
    height: size,
    className: "mx-auto overflow-visible",
    children: [
      _jsx("polygon", {
        points: polyPoints,
        fill: "#F9FAFB",
        stroke: "#E5E7EB",
        strokeWidth: "1",
      }),
      [0.25, 0.5, 0.75].map((scale) => {
        const r = radius * scale;
        const gridPoints = [
          { x: center, y: center - r },
          {
            x: center + r * Math.cos(Math.PI / 6),
            y: center + r * Math.sin(Math.PI / 6),
          },
          {
            x: center - r * Math.cos(Math.PI / 6),
            y: center + r * Math.sin(Math.PI / 6),
          },
        ]
          .map((p) => `${p.x},${p.y}`)
          .join(" ");
        return _jsx(
          "polygon",
          {
            points: gridPoints,
            fill: "none",
            stroke: "#F2F4F6",
            strokeWidth: "1",
          },
          scale,
        );
      }),
      points.map((p, i) =>
        _jsx(
          "line",
          {
            x1: center,
            y1: center,
            x2: p.x,
            y2: p.y,
            stroke: "#E5E7EB",
            width: "1",
          },
          i,
        ),
      ),
      _jsx("polygon", {
        points: dataPolyPoints,
        fill: "rgba(219, 112, 147, 0.2)",
        stroke: "#DB7093",
        strokeWidth: "2",
      }),
      dataPoints.map((p, i) =>
        _jsx("circle", { cx: p.x, cy: p.y, r: "4", fill: "#DB7093" }, i),
      ),
      _jsx("text", {
        x: center,
        y: center - radius - 10,
        textAnchor: "middle",
        fontSize: "12",
        fill: "#4B5563",
        children: "\uCE5C\uADFC\uD568",
      }),
      _jsx("text", {
        x: points[1].x + 10,
        y: points[1].y + 10,
        textAnchor: "middle",
        fontSize: "12",
        fill: "#4B5563",
        children: "\uD638\uAE30\uC2EC",
      }),
      _jsx("text", {
        x: points[2].x - 10,
        y: points[2].y + 10,
        textAnchor: "middle",
        fontSize: "12",
        fill: "#4B5563",
        children: "\uACF5\uAC10\uB825",
      }),
    ],
  });
};
