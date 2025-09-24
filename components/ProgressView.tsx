import React, { useMemo, useState } from 'react';
import { JournalEntry } from '../types';
import BarChart from './BarChart';
import HeatmapChart from './HeatmapChart';
import RadarChart from './RadarChart';
import { COMPETENCIES } from '../constants';

interface ProgressViewProps {
  entries: JournalEntry[];
}

type ChartType = 'bar' | 'heatmap' | 'radar';

const ProgressView: React.FC<ProgressViewProps> = ({ entries }) => {
  const [competencyChartType, setCompetencyChartType] = useState<ChartType>('bar');

  const entriesByMonth = useMemo(() => {
    const data: { [key: string]: number } = {};
    entries.forEach(entry => {
      const month = new Date(entry.date).toLocaleString('es-ES', { year: 'numeric', month: 'short' });
      data[month] = (data[month] || 0) + 1;
    });
    const sortedData = Object.entries(data).sort(([monthA], [monthB]) => {
        // A simple sort that may not be perfect across years, but works for typical academic year scenarios
        const dateA = new Date(`01 ${monthA.replace(' ', ' ')}`);
        const dateB = new Date(`01 ${monthB.replace(' ', ' ')}`);
        return dateA.getTime() - dateB.getTime();
    });
    return sortedData.map(([label, value]) => ({ label, value }));
  }, [entries]);

  const competenciesUsage = useMemo(() => {
    const dataMap = new Map<string, number>();
    COMPETENCIES.forEach(c => dataMap.set(c.id, 0)); // Initialize all with 0

    entries.forEach(entry => {
      if (entry.competencies) {
          entry.competencies.forEach(compId => {
            if(dataMap.has(compId)) {
                dataMap.set(compId, (dataMap.get(compId) || 0) + 1);
            }
          });
      }
    });

    return Array.from(dataMap.entries())
      .map(([id, value]) => ({ 
        label: id, 
        value 
      }));
  }, [entries]);

  const renderCompetencyChart = () => {
    const filteredData = competenciesUsage.filter(d => d.value > 0);

    if (competenciesUsage.every(d => d.value === 0)) {
        return <p className="text-slate-500">Aún no has vinculado ninguna competencia a tus entradas.</p>;
    }

    switch (competencyChartType) {
        case 'heatmap':
            return <HeatmapChart data={filteredData} />;
        case 'radar':
            return <RadarChart data={competenciesUsage} />;
        case 'bar':
        default:
            return <BarChart data={filteredData.sort((a,b) => b.value - a.value)} />;
    }
  };
  
  const ChartTypeButton: React.FC<{type: ChartType, label: string}> = ({ type, label }) => (
      <button 
        onClick={() => setCompetencyChartType(type)}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            competencyChartType === type 
            ? 'bg-sky-600 text-white' 
            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
        }`}
      >
        {label}
      </button>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Progreso y Evolución</h1>
        <p className="mt-2 text-slate-600">Visualiza tu desarrollo a lo largo del tiempo a través de tus reflexiones.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Entradas por Mes</h2>
        {entriesByMonth.length > 0 ? (
          <BarChart data={entriesByMonth} />
        ) : (
          <p className="text-slate-500">No hay suficientes datos para mostrar el gráfico.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold text-slate-700">Uso de Competencias</h2>
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
                <ChartTypeButton type="bar" label="Barras" />
                <ChartTypeButton type="heatmap" label="Mapa de Calor" />
                <ChartTypeButton type="radar" label="Telaraña" />
            </div>
        </div>
         {renderCompetencyChart()}
      </div>
    </div>
  );
};

export default ProgressView;