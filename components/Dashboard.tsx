

import React, { useMemo } from 'react';
import { JournalEntry, Goal } from '../types';
import { View } from '../App';

interface DashboardProps {
  setView: (view: View) => void;
  entries: JournalEntry[];
  goals: Goal[];
}

const StatsCard: React.FC<{ title: string; value: string | number; description: string }> = ({ title, value, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
    </div>
);

const TagCloud: React.FC<{ tags: { [key: string]: number } }> = ({ tags }) => {
    // FIX: Explicitly typing the sort callback arguments ensures they are treated as numbers, resolving a potential type inference issue.
    const sortedTags = useMemo(() => Object.entries(tags).sort((a: [string, number], b: [string, number]) => b[1] - a[1]).slice(0, 15), [tags]);
    const maxCount = Math.max(...sortedTags.map(([, count]) => count), 1);

    const getFontSize = (count: number) => {
        const size = 0.75 + (count / maxCount) * 1.25; // from 0.75rem to 2rem
        return `${Math.max(size, 0.85)}rem`;
    };

    return (
        <div className="flex flex-wrap gap-x-3 gap-y-2 items-center">
            {sortedTags.map(([tag, count]) => (
                <span key={tag} className="text-slate-600" style={{ fontSize: getFontSize(count) }}>
                    {tag}
                </span>
            ))}
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ setView, entries, goals }) => {
    const stats = useMemo(() => {
        const totalEntries = entries.length;
        const completedGoals = goals.filter(g => g.completed).length;
        const allTags: { [key: string]: number } = entries.flatMap(e => e.tags).reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });
        
        return { totalEntries, completedGoals, allTags };
    }, [entries, goals]);

    const randomEntry = useMemo(() => {
        if (entries.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * entries.length);
        return entries[randomIndex];
    }, [entries]);

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="overflow-hidden rounded-xl shadow-lg">
                <img 
                    src="https://raw.githubusercontent.com/vdhuerta/assets-aplications/main/Diario%20de%20Campo.jpg" 
                    alt="Cabecera de Diario de Campo"
                    className="w-full h-48 md:h-64 object-cover opacity-70"
                />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-slate-600 leading-relaxed">
                    Mi Diario de Campo PE es una aplicación web integral y moderna, diseñada específicamente para futuros docentes de Educación Física. Su propósito es ser una herramienta digital centralizada para documentar, analizar y reflexionar sobre las experiencias prácticas, conectando de manera efectiva la teoría académica con el ejercicio docente en el campo.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatsCard title="Entradas Totales" value={stats.totalEntries} description="Reflexiones sobre tu práctica" />
                <StatsCard title="Metas Completadas" value={`${stats.completedGoals} / ${goals.length}`} description="Objetivos de desarrollo profesional" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-700 mb-4">Temas Recurrentes</h2>
                {Object.keys(stats.allTags).length > 0 ? (
                    <TagCloud tags={stats.allTags} />
                ) : (
                    <p className="text-slate-500">Aún no has añadido etiquetas a tus entradas.</p>
                )}
            </div>

            {randomEntry && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">Para Re-reflexionar</h2>
                    <div className="border-l-4 border-sky-300 pl-4">
                        <p className="text-sm text-slate-500">{new Date(randomEntry.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <h3 className="font-semibold text-slate-800 mt-1">{randomEntry.title}</h3>
                        <p className="text-slate-600 mt-2 line-clamp-2">{randomEntry.reflection}</p>
                    </div>
                     <button 
                        onClick={() => setView('JOURNAL')}
                        className="mt-4 text-sm font-semibold text-sky-600 hover:underline"
                    >
                        Ver todas las entradas &rarr;
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;