import React, { useMemo } from 'react';
import { JournalEntry } from '../types';
import BarChart from './BarChart';
import { COMPETENCIES } from '../constants';

interface ProgressViewProps {
  entries: JournalEntry[];
}

const ProgressView: React.FC<ProgressViewProps> = ({ entries }) => {
  const entriesByMonth = useMemo(() => {
    const data: { [key: string]: number } = {};
    entries.forEach(entry => {
      const month = new Date(entry.date).toLocaleString('es-ES', { year: 'numeric', month: 'short' });
      data[month] = (data[month] || 0) + 1;
    });
    return Object.entries(data)
      .map(([label, value]) => ({ label, value }))
      .sort((a,b) => new Date(a.label).getTime() - new Date(b.label).getTime()); // This might not sort correctly due to locale month name
  }, [entries]);

  const competenciesUsage = useMemo(() => {
    const data: { [key: string]: number } = {};
    entries.forEach(entry => {
      entry.competencies.forEach(compId => {
        data[compId] = (data[compId] || 0) + 1;
      });
    });
    return Object.entries(data)
      .map(([id, value]) => ({ 
        label: COMPETENCIES.find(c => c.id === id)?.id || id, 
        value 
      }))
      .sort((a, b) => b.value - a.value);
  }, [entries]);

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
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Uso de Competencias</h2>
         {competenciesUsage.length > 0 ? (
          <BarChart data={competenciesUsage} />
        ) : (
          <p className="text-slate-500">Aún no has vinculado ninguna competencia a tus entradas.</p>
        )}
      </div>
    </div>
  );
};

export default ProgressView;
