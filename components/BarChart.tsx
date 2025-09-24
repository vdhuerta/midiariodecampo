import React from 'react';

interface BarChartProps {
  data: { label: string; value: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value), 0);
  const chartHeight = 250;
  const chartWidth = 600;
  const barWidth = chartWidth / data.length;

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height={chartHeight} aria-label="Gráfico de barras" role="img">
        <g className="bars">
          {data.map((d, i) => {
            const barHeight = maxValue > 0 ? (d.value / maxValue) * (chartHeight - 40) : 0;
            const x = i * barWidth;
            const y = chartHeight - barHeight - 20;
            return (
              <g key={d.label} className="bar-group">
                <title>{`${d.label}: ${d.value}`}</title>
                <rect
                  x={x + barWidth * 0.1}
                  y={y}
                  width={barWidth * 0.8}
                  height={barHeight}
                  fill="rgb(2 132 199)" // sky-600
                  className="transition-all"
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize="12"
                  fill="rgb(15 23 42)" // slate-900
                >
                  {d.value}
                </text>
                 <text
                  x={x + barWidth / 2}
                  y={chartHeight - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fill="rgb(71 85 105)" // slate-500
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default BarChart;
