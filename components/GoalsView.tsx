import React, { useState } from 'react';
import { Goal } from '../types';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import ProgressBar from './ProgressBar';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface GoalsViewProps {
  goals: Goal[];
  addGoal: (text: string) => void;
  deleteGoal: (id: string) => void;
}

const GoalsView: React.FC<GoalsViewProps> = ({ goals, addGoal, deleteGoal }) => {
    const [newGoalText, setNewGoalText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newGoalText.trim()) {
            addGoal(newGoalText.trim());
            setNewGoalText('');
        }
    };

    const activeGoals = goals.filter(g => !g.completed);
    const completedGoals = goals.filter(g => g.completed);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Metas Profesionales</h1>
                <p className="mt-2 text-slate-600">Define y sigue tus objetivos de desarrollo para enfocar tu crecimiento.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={newGoalText}
                        onChange={(e) => setNewGoalText(e.target.value)}
                        placeholder="Ej: Mejorar la gestión del tiempo en clase"
                        className="flex-grow px-4 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                    />
                    <button type="submit" className="flex items-center justify-center gap-2 bg-sky-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors shadow-sm">
                        <PlusIcon className="h-5 w-5" />
                        Añadir Meta
                    </button>
                </form>
            </div>

            <div className="mt-8 space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">Metas Activas</h2>
                    {activeGoals.length > 0 ? (
                         <ul className="space-y-3">
                            {activeGoals.map(goal => (
                                <li key={goal.id} className="bg-white p-4 rounded-lg border border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-700">{goal.text}</span>
                                        <button onClick={() => deleteGoal(goal.id)} className="p-2 rounded-full text-slate-500 hover:text-red-500 transition-colors" aria-label="Eliminar meta">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3 mt-2">
                                        <ProgressBar progress={goal.progress} />
                                        <span className="text-sm font-medium text-slate-600 w-12 text-right">{Math.round(goal.progress)}%</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-500">No tienes metas activas. ¡Añade una para empezar!</p>
                    )}
                </div>
                 <div>
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">Metas Completadas</h2>
                    {completedGoals.length > 0 ? (
                         <ul className="space-y-3">
                            {completedGoals.map(goal => (
                                <li key={goal.id} className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200">
                                    <div className="flex items-center gap-3">
                                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                        <span className="text-slate-500 line-through">{goal.text}</span>
                                    </div>
                                    <button onClick={() => deleteGoal(goal.id)} className="p-2 rounded-full text-slate-500 hover:text-red-500 transition-colors" aria-label="Eliminar meta">
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-500">Aún no has completado ninguna meta.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GoalsView;