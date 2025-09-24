
import React from 'react';
import { JournalEntry } from '../types';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import DownloadIcon from './icons/DownloadIcon';
import Tag from './Tag';
import { BIBLIOGRAPHY } from '../constants';

interface JournalEntryCardProps {
  entry: JournalEntry;
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({ entry, isSelected, onToggleSelect, onEdit, onDelete }) => {
  const formattedDate = new Date(entry.date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });

  const handleExport = () => {
    let markdown = `# ${entry.title}\n\n`;
    markdown += `**Fecha:** ${formattedDate}\n\n`;
    markdown += `## Reflexión Principal\n${entry.reflection}\n\n`;
    if (entry.skills) markdown += `## Habilidades\n${entry.skills}\n\n`;
    if (entry.deontology) markdown += `## Deontología y Ethos\n${entry.deontology}\n\n`;
    if (entry.dimensions) markdown += `## Dimensiones\n${entry.dimensions}\n\n`;
    if (entry.supervisorFeedback) markdown += `## Feedback del Supervisor\n${entry.supervisorFeedback}\n\n`;
    if (entry.tags.length > 0) markdown += `**Etiquetas:** ${entry.tags.join(', ')}\n`;
    if (entry.linkedBibliography && entry.linkedBibliography.length > 0) {
        const biblioTexts = entry.linkedBibliography.map(id => BIBLIOGRAPHY.find(b => b.id === id)?.author || id);
        markdown += `**Bibliografía Vinculada:** ${biblioTexts.join('; ')}\n`;
    }
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entry.date.split('T')[0]}-${entry.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const linkedBiblioAuthors = entry.linkedBibliography?.map(id => {
      return BIBLIOGRAPHY.find(b => b.id === id)?.author || 'Referencia no encontrada';
  }).join(', ');

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border ${isSelected ? 'border-sky-500 ring-2 ring-sky-200' : 'border-slate-200'} transition-all duration-200 hover:shadow-md`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-start gap-4">
            <input 
              type="checkbox" 
              checked={isSelected}
              onChange={onToggleSelect}
              className="mt-1.5 h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
              aria-label={`Seleccionar entrada: ${entry.title}`}
            />
            <div>
              <h2 className="text-xl font-semibold text-slate-800">{entry.title}</h2>
              <p className="text-sm text-slate-500 mt-1">{formattedDate}</p>
            </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={handleExport} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors" aria-label="Exportar a Markdown">
            <DownloadIcon className="h-5 w-5" />
          </button>
          <button onClick={onEdit} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors" aria-label="Editar entrada">
            <PencilIcon className="h-5 w-5" />
          </button>
          <button onClick={onDelete} className="p-2 rounded-full text-red-500 hover:bg-red-100 transition-colors" aria-label="Eliminar entrada">
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="mt-4 flex gap-6 items-start pl-9">
        {entry.attachment && entry.attachment.type.startsWith('image/') && (
          <img src={entry.attachment.data} alt="Adjunto" className="w-32 h-32 object-cover rounded-lg flex-shrink-0" />
        )}
        <div className="flex-grow">
          <p className="text-slate-600 whitespace-pre-wrap line-clamp-4">
            {entry.reflection}
          </p>
        </div>
      </div>
       {(entry.tags.length > 0 || linkedBiblioAuthors || entry.supervisorFeedback) && (
          <div className="mt-4 pl-9 space-y-3">
             {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map(tag => <Tag key={tag} label={tag} />)}
                </div>
              )}
              {linkedBiblioAuthors && (
                <p className="text-xs text-slate-500"><strong className="font-medium text-slate-600">Bibliografía:</strong> {linkedBiblioAuthors}</p>
              )}
               {entry.supervisorFeedback && (
                <p className="text-xs text-slate-500 bg-green-100 p-2 rounded-md"><strong className="font-medium text-slate-600">Feedback:</strong> {entry.supervisorFeedback.substring(0, 150)}...</p>
              )}
          </div>
       )}
    </div>
  );
};

export default JournalEntryCard;