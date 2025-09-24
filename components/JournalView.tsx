import React, { useState, useMemo } from 'react';
import { JournalEntry, Goal, UserInfo } from '../types';
import JournalEntryCard from './JournalEntryCard';
import JournalEntryForm from './JournalEntryForm';
import PlusIcon from './icons/PlusIcon';
import { generatePortfolioHTML } from '../services/pdfGenerator';
import { getSentimentAnalysis } from '../services/geminiService';

interface JournalViewProps {
  entries: JournalEntry[];
  goals: Goal[];
  userInfo: UserInfo;
  addEntry: (newEntry: JournalEntry) => void;
  updateEntry: (updatedEntry: JournalEntry) => void;
  deleteEntry: (id: string) => void;
}

const JournalView: React.FC<JournalViewProps> = ({ entries, goals, userInfo, addEntry, updateEntry, deleteEntry }) => {
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const allTags = useMemo(() => {
    const tagsSet = new Set(entries.flatMap(e => e.tags));
    return Array.from(tagsSet).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries
      .filter(entry => {
        const searchMatch = searchTerm.toLowerCase() === '' ||
          entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.reflection.toLowerCase().includes(searchTerm.toLowerCase());
        
        const tagMatch = selectedTag === '' || entry.tags.includes(selectedTag);

        return searchMatch && tagMatch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [entries, searchTerm, selectedTag]);

  const handleSave = async (entryData: Omit<JournalEntry, 'id' | 'sentimentAnalysis'>) => {
      setIsSaving(true);
      if (editingEntry) {
          const entryToUpdate: JournalEntry = { ...editingEntry, ...entryData };
          const analysis = await getSentimentAnalysis(entryToUpdate);
          updateEntry({ ...entryToUpdate, sentimentAnalysis: analysis || undefined });
      } else {
          const newEntry: JournalEntry = { ...entryData, id: new Date().toISOString() + Math.random() };
          addEntry(newEntry); // Add immediately for UI responsiveness
          const analysis = await getSentimentAnalysis(newEntry);
          if (analysis) {
              updateEntry({ ...newEntry, sentimentAnalysis: analysis });
          }
      }
      setIsSaving(false);
      setEditingEntry(null);
      setIsCreating(false);
  };
  
  const handleCancel = () => {
    setEditingEntry(null);
    setIsCreating(false);
  }

  const handleEdit = (entry: JournalEntry) => {
    setIsCreating(false);
    setEditingEntry(entry);
  };

  const startCreating = () => {
    setEditingEntry(null);
    setIsCreating(true);
  };

  const toggleEntrySelection = (entryId: string) => {
    setSelectedEntries(prev => 
      prev.includes(entryId) 
        ? prev.filter(id => id !== entryId) 
        : [...prev, entryId]
    );
  };
  
  const handleGeneratePortfolio = () => {
    const entriesToExport = entries.filter(entry => selectedEntries.includes(entry.id));

    // Calculate competency usage for exported entries
    const competenciesUsageData: { [key: string]: number } = {};
    entriesToExport.forEach(entry => {
        if (entry.competencies) {
            entry.competencies.forEach(compId => {
                competenciesUsageData[compId] = (competenciesUsageData[compId] || 0) + 1;
            });
        }
    });

    const chartData = Object.entries(competenciesUsageData)
        .map(([id, value]) => ({
            label: id, // As requested: CFF2, C1, etc.
            value
        }))
        .sort((a, b) => b.value - a.value);
        
    generatePortfolioHTML(entriesToExport, chartData, userInfo);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {isCreating || editingEntry ? (
        <JournalEntryForm
          entry={editingEntry}
          goals={goals}
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={isSaving}
        />
      ) : (
        <>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Diario de Campo</h1>
          <p className="mt-2 text-slate-600">Registra tus experiencias, reflexiona sobre tu práctica y documenta tu crecimiento.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por palabra clave..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-grow px-4 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
          />
          <select
            value={selectedTag}
            onChange={e => setSelectedTag(e.target.value)}
            className="w-full md:w-56 px-4 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
          >
            <option value="">Todas las etiquetas</option>
            {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
          </select>
          <button
            onClick={startCreating}
            className="flex items-center justify-center gap-2 bg-sky-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors shadow-sm"
          >
            <PlusIcon className="h-5 w-5" />
            Nueva Entrada
          </button>
        </div>
        
        {selectedEntries.length > 0 && (
          <div className="mb-6 bg-sky-100 border border-sky-200 p-4 rounded-lg flex items-center justify-between">
              <p className="text-sky-800 font-medium">{selectedEntries.length} entrada(s) seleccionada(s)</p>
              <button
                onClick={handleGeneratePortfolio}
                className="bg-sky-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors shadow-sm"
              >
                  Generar Portafolio
              </button>
          </div>
        )}
        </>
      )}

      {filteredEntries.length > 0 ? (
        <div className="space-y-4">
          {filteredEntries.map(entry => (
            <JournalEntryCard
              key={entry.id}
              entry={entry}
              isSelected={selectedEntries.includes(entry.id)}
              onToggleSelect={() => toggleEntrySelection(entry.id)}
              onEdit={() => handleEdit(entry)}
              onDelete={() => deleteEntry(entry.id)}
            />
          ))}
        </div>
      ) : (
        !isCreating && !editingEntry && (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-medium text-slate-700">No se encontraron entradas.</h3>
            <p className="text-slate-500 mt-1">
              {searchTerm || selectedTag ? 'Prueba a cambiar los filtros o' : 'Crea tu primera entrada para'} comenzar a documentar.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default JournalView;