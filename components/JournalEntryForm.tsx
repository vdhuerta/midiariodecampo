import React, { useState, useEffect, useRef } from 'react';
import { JournalEntry, Goal, Attachment, LinkedGoal } from '../types';
import { getReflectionPrompts } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';
import { COMPETENCIES, BIBLIOGRAPHY } from '../constants';
import PaperClipIcon from './icons/PaperClipIcon';
import QuestionMarkCircleIcon from './icons/QuestionMarkCircleIcon';

interface JournalEntryFormProps {
  entry: JournalEntry | null;
  goals: Goal[];
  onSave: (entryData: Omit<JournalEntry, 'id' | 'sentimentAnalysis'>) => void;
  onCancel: () => void;
  isSaving: boolean;
}

const EXAMPLE_ENTRY_DATA = {
    title: 'Conflicto en Balonmano: Tensión entre Competitividad y Juego Limpio',
    date: '2024-10-23',
    reflection: `Hoy la clase de balonmano con el 7°B fue increíblemente intensa. El partido final estaba muy parejo y la competitividad se sentía en el aire. En la última jugada, Javier, uno de los estudiantes más hábiles pero también más impulsivos, le hizo una falta evidente a Sofía para quitarle el balón y anotar el gol de la victoria. La falta fue sutil, no la vi claramente en el momento, pero la reacción de Sofía y de su equipo fue inmediata.

Se generó un momento de alta tensión. El equipo de Sofía reclamaba "¡Falta! ¡Eso no es justo!" mientras el equipo de Javier celebraba efusivamente. Vi cómo la clase se polarizaba. Decidí detener todo inmediatamente.

Pausé el juego y reuní a los dos equipos en el centro. En lugar de tomar una decisión autoritaria, le pedí a Sofía que explicara cómo se sintió. Con voz temblorosa dijo que se sintió "engañada" y que no era justo ganar así. Luego, me dirigí a Javier y, sin acusarlo, le pregunté qué había pasado desde su perspectiva y si creía que la jugada había sido limpia. Tras un momento de silencio, y viendo la cara de sus compañeros, Javier admitió a regañadientes que sí, la había empujado un poco.

Este fue el punto de inflexión. No lo castigué, sino que abrí una breve conversación con toda la clase: "¿Qué es más importante en un juego aquí en la escuela: ganar a toda costa o respetar las reglas y a los compañeros?". La mayoría convergió en lo segundo. Acordamos anular el gol y repetir la última jugada. El ambiente cambió por completo. Aunque el equipo de Javier terminó perdiendo, al final se dieron la mano con otra actitud. Fue un momento de aprendizaje que trascendió completamente el balonmano.`,
    emotion: 'Inicialmente tenso y preocupado, luego satisfecho y aliviado.',
    skills: 'Desarrolladas por mí: Mediación de conflictos, comunicación asertiva, escucha activa, gestión del clima de aula, inteligencia emocional.\n\nObservadas en estudiantes: Competitividad exacerbada, frustración, honestidad, asertividad y empatía.',
    deontology: 'Se aplicó el principio de equidad al no validar una victoria injusta y proteger la seguridad emocional de Sofía (Deontología). Mi rol fue de mediador y facilitador, transformando el conflicto en una instancia formativa (Ethos).',
    dimensions: 'Dominio B: Creación de un ambiente propicio para el aprendizaje (restauré un clima de respeto y seguridad).\n\nDominio D: Responsabilidades profesionales (la misma acción de reflexionar en este diario es un ejercicio de este dominio).',
    tags: ['conflicto', 'juego limpio', 'balonmano', '7mo básico', 'habilidades socioemocionales', 'ética deportiva'],
    competencies: ['CFF2', 'CFF5', 'C9'],
    linkedGoals: [],
    supervisorFeedback: 'Excelente manejo de la situación. Transformaste un momento de tensión en una valiosa lección sobre ética deportiva. En lugar de sancionar, facilitaste un diálogo que llevó a los propios estudiantes a la reflexión. Bien visto.',
    linkedBibliography: ['rojas-2011'],
};


const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ entry, goals, onSave, onCancel, isSaving }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    reflection: '',
    emotion: '',
    skills: '',
    deontology: '',
    dimensions: '',
    tags: [] as string[],
    competencies: [] as string[],
    linkedGoals: [] as LinkedGoal[],
    supervisorFeedback: '',
    linkedBibliography: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [attachment, setAttachment] = useState<Attachment | undefined>(undefined);
  const [aiPrompts, setAiPrompts] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showSkillsHelp, setShowSkillsHelp] = useState(false);
  const [showDeontologyHelp, setShowDeontologyHelp] = useState(false);
  const [showDimensionsHelp, setShowDimensionsHelp] = useState(false);
  
  // Refs for help popups and focus management
  const skillsHelpRef = useRef<HTMLDivElement>(null);
  const deontologyHelpRef = useRef<HTMLDivElement>(null);
  const dimensionsHelpRef = useRef<HTMLDivElement>(null);
  const fileInputLabelRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    if (entry) {
      setFormData({
        title: entry.title,
        date: new Date(entry.date).toISOString().split('T')[0],
        reflection: entry.reflection,
        emotion: entry.emotion || '',
        skills: entry.skills,
        deontology: entry.deontology,
        dimensions: entry.dimensions,
        tags: entry.tags || [],
        competencies: entry.competencies || [],
        linkedGoals: entry.linkedGoals || [],
        supervisorFeedback: entry.supervisorFeedback || '',
        linkedBibliography: entry.linkedBibliography || [],
      });
      setTagInput('');
      setAttachment(entry.attachment);
    } else {
      // Reset form for new entry
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        reflection: '',
        emotion: '',
        skills: '',
        deontology: '',
        dimensions: '',
        tags: [],
        competencies: [],
        linkedGoals: [],
        supervisorFeedback: '',
        linkedBibliography: [],
      });
      setTagInput('');
      setAttachment(undefined);
    }
    setAiPrompts('');
  }, [entry]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (skillsHelpRef.current && !skillsHelpRef.current.contains(event.target as Node)) {
        setShowSkillsHelp(false);
      }
      if (deontologyHelpRef.current && !deontologyHelpRef.current.contains(event.target as Node)) {
        setShowDeontologyHelp(false);
      }
      if (dimensionsHelpRef.current && !dimensionsHelpRef.current.contains(event.target as Node)) {
        setShowDimensionsHelp(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Effect to prevent screen jumping on file upload by refocusing the label
  useEffect(() => {
    if (attachment && entry?.attachment?.data !== attachment.data) {
        fileInputLabelRef.current?.focus();
    }
  }, [attachment, entry]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const addTagsFromInput = (input: string) => {
    const newTags = input.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '' && !formData.tags.includes(tag));
    
    if (newTags.length > 0) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, ...newTags] }));
    }
    setTagInput('');
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes(',')) {
      addTagsFromInput(value);
    } else {
      setTagInput(value);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTagsFromInput(tagInput);
    }
  };

  const handleTagBlur = () => {
    addTagsFromInput(tagInput);
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({...prev, tags: prev.tags.filter(tag => tag !== tagToRemove)}));
  };

  const handleCompetencyChange = (competencyId: string) => {
    setFormData(prev => {
        const newCompetencies = prev.competencies.includes(competencyId)
            ? prev.competencies.filter(c => c !== competencyId)
            : [...prev.competencies, competencyId];
        return {...prev, competencies: newCompetencies};
    });
  };
  
  const handleBibliographyChange = (biblioId: string) => {
    setFormData(prev => {
        const newBiblio = prev.linkedBibliography.includes(biblioId)
            ? prev.linkedBibliography.filter(b => b !== biblioId)
            : [...prev.linkedBibliography, biblioId];
        return {...prev, linkedBibliography: newBiblio};
    });
  };

  const handleGoalProgressChange = (goalId: string, progress: string) => {
    const progressValue = parseInt(progress, 10);
    
    setFormData(prev => {
      const existingLink = prev.linkedGoals.find(lg => lg.goalId === goalId);
      let newLinkedGoals;

      if (!isNaN(progressValue) && progressValue > 0) {
        const cappedProgress = Math.max(0, Math.min(100, progressValue));
        if (existingLink) {
          // Update existing link
          newLinkedGoals = prev.linkedGoals.map(lg => 
            lg.goalId === goalId ? { ...lg, progress: cappedProgress } : lg
          );
        } else {
          // Add new link
          newLinkedGoals = [...prev.linkedGoals, { goalId, progress: cappedProgress }];
        }
      } else {
        // Remove link if progress is cleared or invalid
        newLinkedGoals = prev.linkedGoals.filter(lg => lg.goalId !== goalId);
      }
      return { ...prev, linkedGoals: newLinkedGoals };
    });
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment({
          name: file.name,
          type: file.type,
          data: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a final version of tags including any pending input
    const finalTags = [...formData.tags];
    if (tagInput.trim() !== '') {
        const newTagsFromInput = tagInput.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag !== '' && !finalTags.includes(tag));
        finalTags.push(...newTagsFromInput);
    }

    if (formData.title.trim() && formData.reflection.trim()) {
      onSave({ 
        ...formData,
        tags: finalTags,
        date: new Date(formData.date + 'T00:00:00.000Z').toISOString(),
        attachment,
      });
      setTagInput('');
    }
  };
  
  const handleGetAIPrompts = async () => {
    if (!formData.title && !formData.reflection) {
        setAiPrompts("Por favor, escribe un título o una reflexión antes de pedir sugerencias.");
        return;
    }
    setIsAiLoading(true);
    setAiPrompts('');
    const prompts = await getReflectionPrompts({
        ...formData,
        date: new Date(formData.date + 'T00:00:00.000Z').toISOString(),
    });
    setAiPrompts(prompts);
    setIsAiLoading(false);
  };

  const handleLoadExample = () => {
    setFormData(EXAMPLE_ENTRY_DATA);
    setTagInput('');
    setAttachment(undefined);
    setAiPrompts('');
  };

  const activeGoals = goals.filter(g => !g.completed || (entry?.linkedGoals.some(lg => lg.goalId === g.id)));

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-8 mb-8">
      
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h2 className="text-xl font-semibold text-slate-800">Detalles de la Entrada</h2>
            <button
                type="button"
                onClick={handleLoadExample}
                className="bg-sky-100 text-sky-700 text-sm font-semibold px-3 py-1 rounded-md hover:bg-sky-200 transition-colors"
            >
                Ejemplo
            </button>
        </div>
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Título</label>
            <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} placeholder="Ej: Desafío en la clase de voleibol" className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" required />
          </div>
          <div className="mt-6 md:mt-0">
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
            <input id="date" name="date" type="date" value={formData.date} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" required />
          </div>
        </div>
        <div>
          <label htmlFor="reflection" className="block text-sm font-medium text-slate-700 mb-1">Reflexión Principal</label>
          <textarea id="reflection" name="reflection" value={formData.reflection} onChange={handleChange} placeholder="Describe la situación, tus pensamientos, sentimientos y lo que aprendiste..." className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" rows={10} required />
        </div>
         <div>
            <label htmlFor="emotion" className="block text-sm font-medium text-slate-700 mb-1">Estado Emocional</label>
            <input id="emotion" name="emotion" type="text" value={formData.emotion} onChange={handleChange} placeholder="¿Cómo te sentiste? Ej: enérgico, frustrado, satisfecho" className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" />
            <p className="text-xs text-slate-500 mt-1">Este dato ayudará a la IA a darte un mejor análisis.</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-800 border-b border-slate-200 pb-3">Análisis Pedagógico</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div ref={skillsHelpRef} className="relative">
              <div className="flex items-center gap-1 mb-1">
                <label htmlFor="skills" className="block text-sm font-medium text-slate-700">Habilidades</label>
                <button type="button" onClick={() => setShowSkillsHelp(prev => !prev)} className="text-slate-400 hover:text-slate-600" aria-label="Mostrar ayuda para Habilidades">
                  <QuestionMarkCircleIcon className="h-4 w-4" />
                </button>
              </div>
               {showSkillsHelp && (
                <div className="absolute bottom-full left-0 mb-2 w-full max-w-xs p-3 bg-slate-800 text-white text-sm rounded-lg shadow-lg z-10">
                  Ej. Trabajo en Equipo, Comunicación, Resiliencia, Empatía, Autoconciencia, Deportividad, etc.
                </div>
              )}
              <textarea id="skills" name="skills" value={formData.skills} onChange={handleChange} placeholder="¿Qué habilidades pusiste en práctica?" className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" rows={4}/>
          </div>
          <div ref={deontologyHelpRef} className="relative">
              <div className="flex items-center gap-1 mb-1">
                <label htmlFor="deontology" className="block text-sm font-medium text-slate-700">Deontología y Ethos</label>
                 <button type="button" onClick={() => setShowDeontologyHelp(prev => !prev)} className="text-slate-400 hover:text-slate-600" aria-label="Mostrar ayuda para Deontología y Ethos">
                  <QuestionMarkCircleIcon className="h-4 w-4" />
                </button>
              </div>
               {showDeontologyHelp && (
                <div className="absolute bottom-full left-0 mb-2 w-full max-w-xs p-3 bg-slate-800 text-white text-sm rounded-lg shadow-lg z-10">
                  Ej. Respeto a la diversidad, manejo confidencial de información, promoción del juego limpio, seguridad del alumnado, equidad en el trato.
                </div>
              )}
              <textarea id="deontology" name="deontology" value={formData.deontology} onChange={handleChange} placeholder="¿Qué principios éticos entraron en juego?" className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" rows={4}/>
          </div>
          <div ref={dimensionsHelpRef} className="relative">
              <div className="flex items-center gap-1 mb-1">
                <label htmlFor="dimensions" className="block text-sm font-medium text-slate-700">Dimensiones</label>
                 <button type="button" onClick={() => setShowDimensionsHelp(prev => !prev)} className="text-slate-400 hover:text-slate-600" aria-label="Mostrar ayuda para Dimensiones">
                  <QuestionMarkCircleIcon className="h-4 w-4" />
                </button>
              </div>
               {showDimensionsHelp && (
                <div className="absolute bottom-full left-0 mb-2 w-full max-w-sm p-3 bg-slate-800 text-white text-sm rounded-lg shadow-lg z-10">
                  <p className="font-semibold mb-1">Marco para la Buena Enseñanza:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>A: Preparación de la enseñanza.</li>
                    <li>B: Creación de un ambiente propicio para el aprendizaje.</li>
                    <li>C: Enseñanza para el aprendizaje de todos los estudiantes.</li>
                    <li>D: Responsabilidades profesionales.</li>
                  </ul>
                </div>
              )}
              <textarea id="dimensions" name="dimensions" value={formData.dimensions} onChange={handleChange} placeholder="¿Qué dimensiones observaste?" className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" rows={4}/>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-800 border-b border-slate-200 pb-3">Organización y Conexiones</h2>
        <div>
            <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-1">Etiquetas (separadas por coma o Enter)</label>
            <div className="flex flex-wrap gap-2 items-center p-2 border border-slate-300 rounded-lg">
                {formData.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-sky-100 text-sky-800 text-xs font-medium px-2 py-1 rounded-full">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-sky-600 hover:text-sky-800">&times;</button>
                    </span>
                ))}
                <input 
                    id="tags" 
                    type="text" 
                    value={tagInput} 
                    onChange={handleTagChange}
                    onKeyDown={handleTagKeyDown}
                    onBlur={handleTagBlur}
                    placeholder="Añadir etiqueta..." 
                    className="flex-1 bg-transparent outline-none p-1 min-w-[120px]" 
                />
            </div>
        </div>
        <div>
            <p className="block text-sm font-medium text-slate-700 mb-2">Competencias Vinculadas</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {COMPETENCIES.map(comp => (
                    <label key={comp.id} className="flex items-start gap-2 text-sm text-slate-600">
                        <input type="checkbox" checked={formData.competencies.includes(comp.id)} onChange={() => handleCompetencyChange(comp.id)} className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                        <span>{comp.label}</span>
                    </label>
                ))}
            </div>
        </div>
        <div>
            <p className="block text-sm font-medium text-slate-700 mb-2">Bibliografía Vinculada</p>
            <div className="grid grid-cols-1 gap-y-3">
                {BIBLIOGRAPHY.map(bib => (
                    <label key={bib.id} className="flex items-start gap-2 text-sm text-slate-600">
                        <input type="checkbox" checked={formData.linkedBibliography.includes(bib.id)} onChange={() => handleBibliographyChange(bib.id)} className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                        <span><strong>{bib.author}</strong> - {bib.title}</span>
                    </label>
                ))}
            </div>
        </div>
      </div>
      
      {activeGoals.length > 0 && (
        <div className="space-y-6">
          <div className="border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 pb-3">Vincular a Metas Profesionales</h2>
          </div>
            <div className="space-y-3">
                {activeGoals.map(goal => {
                    const linkedGoal = formData.linkedGoals.find(lg => lg.goalId === goal.id);
                    return (
                        <div key={goal.id} className="grid grid-cols-12 items-center gap-3">
                            <label htmlFor={`goal-${goal.id}`} className="col-span-10 text-sm text-slate-600">{goal.text}</label>
                            <div className="col-span-2 relative">
                                <input 
                                    type="number" 
                                    id={`goal-${goal.id}`}
                                    value={linkedGoal?.progress || ''}
                                    onChange={(e) => handleGoalProgressChange(goal.id, e.target.value)}
                                    min="0"
                                    max="100"
                                    placeholder="%"
                                    className="w-full px-2 py-1 border border-slate-300 rounded-md text-right focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                                 />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
      )}

       <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-800 border-b border-slate-200 pb-3">Adjunto y Feedback</h2>
          <div>
            <label htmlFor="supervisorFeedback" className="block text-sm font-medium text-slate-700 mb-1">Feedback del Supervisor</label>
            <textarea id="supervisorFeedback" name="supervisorFeedback" value={formData.supervisorFeedback} onChange={handleChange} placeholder="Pega aquí los comentarios o feedback recibido por parte de tu supervisor o mentor..." className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" rows={4} />
          </div>
          <div className="flex items-center gap-4">
            <label 
              htmlFor="file-upload" 
              ref={fileInputLabelRef}
              tabIndex={-1}
              className="cursor-pointer flex items-center gap-2 bg-white border border-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors outline-none focus:ring-2 focus:ring-sky-500"
            >
              <PaperClipIcon className="h-5 w-5"/>
              <span>{attachment ? 'Cambiar Imagen' : 'Adjuntar Imagen'}</span>
            </label>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
            {attachment && (
              <div className="flex items-center gap-2">
                  <img src={attachment.data} alt="Preview" className="h-10 w-10 object-cover rounded" />
                  <span className="text-sm text-slate-500">{attachment.name}</span>
                  <button type="button" onClick={() => setAttachment(undefined)} className="text-red-500 hover:text-red-700 text-xl">&times;</button>

              </div>
            )}
          </div>
       </div>

      <div className="pt-2">
        <button type="button" onClick={handleGetAIPrompts} disabled={isAiLoading} className="flex items-center gap-2 bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50">
          <SparklesIcon className="h-5 w-5 text-yellow-500"/>
          {isAiLoading ? 'Generando...' : 'Sugerir Puntos de Reflexión'}
        </button>
         {(isAiLoading || aiPrompts) && (
            <div className="mt-4 p-4 bg-green-100 border border-green-200 rounded-lg text-slate-700">
                {isAiLoading && <p>Pensando...</p>}
                {aiPrompts && <div className="prose prose-sm max-w-none whitespace-pre-wrap">{aiPrompts}</div>}
            </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={isSaving} className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors shadow-sm disabled:bg-sky-400 disabled:cursor-not-allowed">
          {isSaving ? 'Guardando...' : (entry ? 'Actualizar Entrada' : 'Guardar Entrada')}
        </button>
      </div>
    </form>
  );
};

export default JournalEntryForm;