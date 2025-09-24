import React from 'react';

interface HeatmapChartProps {
  data: { label: string; value: number }[];
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const maxValue = Math.max(...data.map(d => d.value), 1);

  const getColor = (value: number) => {
    const intensity = Math.round((value / maxValue) * 6) + 2; // scale from 2 to 8
    switch (intensity) {
      case 2: return 'bg-sky-200 text-sky-900';
      case 3: return 'bg-sky-300 text-sky-900';
      case 4: return 'bg-sky-400 text-white';
      case 5: return 'bg-sky-500 text-white';
      case 6: return 'bg-sky-600 text-white';
      case 7: return 'bg-sky-700 text-white';
      case 8: return 'bg-sky-800 text-white';
      default: return 'bg-sky-100 text-sky-800';
    }
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {sortedData.map(item => (
          <div
            key={item.label}
            className={`flex flex-col items-center justify-center p-4 rounded-lg text-center transition-colors duration-300 ${getColor(item.value)}`}
            aria-label={`${item.label}: ${item.value} usos`}
          >
            <span className="text-2xl font-bold">{item.value}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeatmapChart;
