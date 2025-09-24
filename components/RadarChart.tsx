import React from 'react';

interface RadarChartProps {
  data: { label: string; value: number }[];
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  const size = 300;
  const center = size / 2;
  const radius = center - 30;
  const numAxes = data.length;
  const angleSlice = (Math.PI * 2) / numAxes;
  const maxValue = Math.max(...data.map(d => d.value), 1); // Use at least 1 to avoid division by zero
  const levels = 5;

  if (numAxes === 0) return null;

  // Function to get point coordinates
  const getPoint = (value: number, index: number) => {
    const r = (value / maxValue) * radius;
    const angle = angleSlice * index - Math.PI / 2;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Generate axis lines and labels
  const axes = data.map((item, i) => {
    const endPoint = getPoint(maxValue, i);
    const labelPoint = getPoint(maxValue * 1.15, i);
    return (
      <g key={item.label}>
        <line x1={center} y1={center} x2={endPoint.x} y2={endPoint.y} stroke="rgb(203 213 225)" strokeWidth="1" />
        <text
          x={labelPoint.x}
          y={labelPoint.y}
          fontSize="10"
          fill="rgb(71 85 105)"
          textAnchor={labelPoint.x > center ? 'start' : labelPoint.x < center ? 'end' : 'middle'}
          dominantBaseline="middle"
        >
          {item.label}
        </text>
      </g>
    );
  });

  // Generate concentric polygons (levels)
  const gridLevels = Array.from({ length: levels }, (_, i) => {
    const levelFactor = radius * ((i + 1) / levels);
    const points = Array.from({ length: numAxes }, (__, j) => {
      const angle = angleSlice * j - Math.PI / 2;
      return `${center + levelFactor * Math.cos(angle)},${center + levelFactor * Math.sin(angle)}`;
    }).join(' ');
    return <polygon key={i} points={points} stroke="rgb(226 232 240)" fill="none" />;
  });
  
  // Generate data polygon
  const dataPoints = data.map((item, i) => {
      const point = getPoint(item.value, i);
      return `${point.x},${point.y}`;
  }).join(' ');

  const dataCircles = data.map((item, i) => {
    const point = getPoint(item.value, i);
    return <circle key={`dot-${i}`} cx={point.x} cy={point.y} r="3" fill="rgb(2 132 199)" />;
  })

  return (
    <div className="w-full flex justify-center">
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-label="Gráfico de telaraña de competencias" role="img">
            <g>
                {gridLevels}
                {axes}
                <polygon points={dataPoints} stroke="rgb(2 132 199)" strokeWidth="2" fill="rgba(2, 132, 199, 0.25)" />
                {dataCircles}
            </g>
        </svg>
    </div>
  );
};

export default RadarChart;
