import { JournalEntry, UserInfo } from '../types';
import { BIBLIOGRAPHY } from '../constants';

const getChartHTML = (data: { label: string; value: number }[]): string => {
  const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero
  const chartHeight = 250;
  const chartWidth = 600;
  const barWidth = data.length > 0 ? chartWidth / data.length : 0;

  if (data.length === 0) {
    return '<p class="text-slate-500 text-center">No hay datos de competencias para mostrar.</p>';
  }

  const bars = data.map((d, i) => {
    const barHeight = (d.value / maxValue) * (chartHeight - 40);
    const x = i * barWidth;
    const y = chartHeight - barHeight - 20;
    return `
      <g class="bar-group" role="listitem" aria-label="${d.label}: ${d.value}">
        <title>${d.label}: ${d.value}</title>
        <rect
          x="${x + barWidth * 0.1}"
          y="${y}"
          width="${barWidth * 0.8}"
          height="${barHeight}"
          fill="rgb(2 132 199)"
        />
        <text
          x="${x + barWidth / 2}"
          y="${y - 5}"
          text-anchor="middle"
          font-size="12"
          fill="rgb(15 23 42)"
        >
          ${d.value}
        </text>
         <text
          x="${x + barWidth / 2}"
          y="${chartHeight - 5}"
          text-anchor="middle"
          font-size="10"
          fill="rgb(71 85 105)"
        >
          ${d.label}
        </text>
      </g>
    `;
  }).join('');

  return `
    <div class="w-full overflow-x-auto">
      <svg viewBox="0 0 ${chartWidth} ${chartHeight}" width="100%" height="${chartHeight}" aria-label="Gráfico de barras de uso de competencias" role="list">
        ${bars}
      </svg>
    </div>
  `;
};


const getEntryHTML = (entry: JournalEntry): string => {
    const formattedDate = new Date(entry.date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    });

    const reflectionHTML = `<div class="text-slate-600 whitespace-pre-wrap">${entry.reflection}</div>`;
    
    const fullReflectionAndImageHTML = entry.attachment && entry.attachment.type.startsWith('image/')
        ? `<div class="mt-4 flex flex-col sm:flex-row gap-6 items-start">
                <img src="${entry.attachment.data}" alt="Adjunto" class="w-full sm:w-40 sm:h-40 object-cover rounded-lg flex-shrink-0" />
                <div class="flex-grow">${reflectionHTML}</div>
           </div>`
        : `<div class="mt-4">${reflectionHTML}</div>`;

    // --- Análisis Pedagógico ---
    const skillsHTML = entry.skills ? `<div><h4 class="font-semibold text-slate-700">Habilidades</h4><p class="text-slate-600 whitespace-pre-wrap">${entry.skills}</p></div>` : '';
    const deontologyHTML = entry.deontology ? `<div><h4 class="font-semibold text-slate-700">Deontología y Ethos</h4><p class="text-slate-600 whitespace-pre-wrap">${entry.deontology}</p></div>` : '';
    const dimensionsHTML = entry.dimensions ? `<div><h4 class="font-semibold text-slate-700">Dimensiones</h4><p class="text-slate-600 whitespace-pre-wrap">${entry.dimensions}</p></div>` : '';

    const analysisHTML = (skillsHTML || deontologyHTML || dimensionsHTML) ? `
        <div class="mt-4 pt-4 border-t border-slate-200">
            <h3 class="text-lg font-semibold text-slate-800 mb-2">Análisis Pedagógico</h3>
            <div class="space-y-3 text-sm">
                ${skillsHTML}
                ${deontologyHTML}
                ${dimensionsHTML}
            </div>
        </div>
    ` : '';

    // --- Detalles y Conexiones ---
    const linkedBiblioAuthors = entry.linkedBibliography?.map(id => {
        return BIBLIOGRAPHY.find(b => b.id === id)?.author || 'Referencia no encontrada';
    }).join(', ');
    
    const tagsHTML = entry.tags.length > 0
        ? `<div>
             <strong class="font-medium text-slate-600">Etiquetas:</strong>
             <div class="flex flex-wrap gap-2 mt-1">
                ${entry.tags.map(tag => `<span class="bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-1 rounded-full">${tag}</span>`).join('')}
             </div>
           </div>`
        : '';
        
    const competenciesHTML = entry.competencies.length > 0
        ? `<div>
             <strong class="font-medium text-slate-600">Competencias:</strong>
             <div class="flex flex-wrap gap-2 mt-1">
                ${entry.competencies.map(comp => `<span class="bg-rose-100 text-rose-800 text-xs font-medium px-2.5 py-1 rounded-full">${comp}</span>`).join('')}
             </div>
           </div>`
        : '';
    
    const biblioHTML = linkedBiblioAuthors
        ? `<p class="text-sm text-slate-600"><strong class="font-medium">Bibliografía:</strong> ${linkedBiblioAuthors}</p>`
        : '';

    const feedbackHTML = entry.supervisorFeedback
        ? `<div>
            <strong class="font-medium text-slate-600">Feedback del Supervisor:</strong>
            <p class="text-sm text-slate-600 bg-green-100 p-3 rounded-md mt-1 whitespace-pre-wrap">${entry.supervisorFeedback}</p>
           </div>`
        : '';
    
    const detailsHTML = (tagsHTML || competenciesHTML || biblioHTML || feedbackHTML)
        ? `<div class="mt-4 pt-4 border-t border-slate-200 space-y-4">
             ${tagsHTML}
             ${competenciesHTML}
             ${biblioHTML}
             ${feedbackHTML}
           </div>`
        : '';

    return `
        <div class="bg-white p-6 rounded-xl shadow-md border border-slate-200 break-inside-avoid mb-4">
            <div class="flex justify-between items-start gap-4">
                <div>
                    <h2 class="text-xl font-semibold text-slate-800">${entry.title}</h2>
                    <p class="text-sm text-slate-500 mt-1">${formattedDate}</p>
                </div>
            </div>
            ${fullReflectionAndImageHTML}
            ${analysisHTML}
            ${detailsHTML}
        </div>
    `;
};

export const generatePortfolioHTML = (entries: JournalEntry[], competenciesChartData: { label: string; value: number }[], userInfo: UserInfo) => {
    const entriesHTML = entries
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(getEntryHTML)
        .join('');
    
    const chartHTML = competenciesChartData.length > 0
        ? `
        <div class="bg-white p-6 rounded-xl shadow-md border border-slate-200 break-inside-avoid mt-8">
            <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center">Uso de Competencias</h2>
            ${getChartHTML(competenciesChartData)}
        </div>
        `
        : '';

    const fullHTML = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Portafolio - Mi Diario de Campo PE</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: #f0fdf4; /* green-50 */
                }
                @media print {
                    .break-inside-avoid {
                        page-break-inside: avoid;
                    }
                     body {
                        background-color: #fff;
                    }
                }
            </style>
        </head>
        <body class="p-4 sm:p-6 lg:p-8">
            <div class="max-w-5xl mx-auto">
                <div class="mb-8 text-center">
                    <h1 class="text-4xl font-bold text-slate-800">Portafolio Profesional</h1>
                    <p class="mt-2 text-slate-600">Mi Diario de Campo PE</p>
                    <p class="text-md text-slate-500">${userInfo.name} ${userInfo.surname}</p>
                    <p class="text-sm text-slate-500 mt-2">Generado el: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div class="space-y-4">
                    ${entriesHTML}
                </div>
                ${chartHTML}
            </div>
        </body>
        </html>
    `;

    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portafolio-diario-de-campo-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};