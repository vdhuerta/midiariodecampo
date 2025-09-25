import React, { useMemo } from 'react';
import { JournalEntry, Goal } from '../types';
import { View } from '../App';
import DevicePhoneMobileIcon from './icons/DevicePhoneMobileIcon';

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
    const sortedTags = useMemo(() => Object.entries(tags).sort((a: [string, number], b: [string, number]) => b[1] - a[1]).slice(0, 25), [tags]);
    const maxCount = Math.max(...sortedTags.map(([, count]) => count), 1);
    const minCount = Math.min(...sortedTags.map(([, count]) => count), 1);

    const getDynamicStyle = (count: number): React.CSSProperties => {
        const range = maxCount - minCount;
        const normalizedCount = range > 0 ? (count - minCount) / range : 0.5;
        
        // Font size from ~10px to ~20px
        const fontSize = 0.65 + normalizedCount * 0.6; // from 0.65rem to 1.25rem
        return {
            fontSize: `${fontSize.toFixed(2)}rem`,
        };
    };

    const getColorClass = (tag: string): string => {
        const colors = [
            'bg-sky-100 text-sky-800 border-sky-200',
            'bg-rose-100 text-rose-800 border-rose-200',
            'bg-green-100 text-green-800 border-green-200',
            'bg-amber-100 text-amber-800 border-amber-200',
            'bg-indigo-100 text-indigo-800 border-indigo-200',
            'bg-pink-100 text-pink-800 border-pink-200',
            'bg-purple-100 text-purple-800 border-purple-200',
            'bg-teal-100 text-teal-800 border-teal-200',
            'bg-lime-100 text-lime-800 border-lime-200',
            'bg-cyan-100 text-cyan-800 border-cyan-200',
        ];
        
        let hash = 0;
        if (tag.length === 0) return colors[0];
        for (let i = 0; i < tag.length; i++) {
            const char = tag.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        
        const index = Math.abs(hash % colors.length);
        return colors[index];
    };

    return (
        <div className="flex flex-wrap gap-3 items-center">
            {sortedTags.map(([tag, count]) => (
                <div 
                    key={tag} 
                    className={`flex items-baseline gap-1.5 font-medium px-3 py-1.5 rounded-full border transition-all duration-300 ${getColorClass(tag)}`}
                    style={getDynamicStyle(count)}
                >
                    <span>{tag}</span>
                    <span className="font-semibold text-[0.7em] opacity-80">{count}</span>
                </div>
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
                    src="https://raw.githubusercontent.com/vdhuerta/assets-aplications/main/Intro_MiDiario.png" 
                    alt="Cabecera de Diario de Campo"
                    className="w-full h-48 md:h-64 object-cover opacity-50"
                />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-slate-600 leading-relaxed">
                    Mi Diario de Campo es una aplicación web integral y moderna, diseñada específicamente para futuros docentes de Educación Física. Su propósito es ser una herramienta digital centralizada para documentar, analizar y reflexionar sobre las experiencias prácticas, conectando de manera efectiva la teoría académica con el ejercicio docente en el campo.
                </p>
            </div>
            
            <div className="bg-sky-100 p-6 rounded-xl shadow-sm border border-sky-200 flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                    <DevicePhoneMobileIcon className="h-12 w-12 text-sky-600" />
                </div>
                <div className="flex-grow text-center sm:text-left">
                    <h2 className="text-lg font-semibold text-sky-800">Lleva tu Diario a todas partes</h2>
                    <p className="text-sky-700 mt-1">Instala la aplicación en tu teléfono para un acceso rápido y una experiencia de pantalla completa.</p>
                </div>
                <button
                    onClick={() => setView('ADD_AS_APP')}
                    className="w-full sm:w-auto flex-shrink-0 bg-sky-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-sky-700 transition-colors shadow-sm"
                >
                    Ver instrucciones
                </button>
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