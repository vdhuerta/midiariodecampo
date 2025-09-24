import { JournalEntry, UserInfo } from '../types';
import { BIBLIOGRAPHY } from '../constants';

// --- INLINED STYLES ---
// All necessary styles are embedded directly into the HTML file.
// This makes the portfolio self-contained and viewable offline or on mobile viewers
// that block external network requests.
const PORTFOLIO_STYLES = `
  body { font-family: 'Inter', sans-serif; background-color: #f0fdf4; margin: 0; padding: 1rem; }
  @media print { body { background-color: #fff; } }
  .max-w-5xl { max-width: 64rem; }
  .mx-auto { margin-left: auto; margin-right: auto; }
  .mb-8 { margin-bottom: 2rem; }
  .text-center { text-align: center; }
  .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
  .font-bold { font-weight: 700; }
  .text-slate-800 { color: #1e293b; }
  .mt-2 { margin-top: 0.5rem; }
  .text-slate-600 { color: #475569; }
  .text-md { font-size: 1rem; line-height: 1.5rem; }
  .text-slate-500 { color: #64748b; }
  .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
  .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
  .bg-white { background-color: #fff; }
  .p-6 { padding: 1.5rem; }
  .rounded-xl { border-radius: 0.75rem; }
  .shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
  .border { border-width: 1px; }
  .border-slate-200 { border-color: #e2e8f0; }
  .break-inside-avoid { page-break-inside: avoid; }
  .mb-4 { margin-bottom: 1rem; }
  .flex { display: flex; }
  .justify-between { justify-content: space-between; }
  .items-start { align-items: flex-start; }
  .gap-4 { gap: 1rem; }
  .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
  .font-semibold { font-weight: 600; }
  .mt-1 { margin-top: 0.25rem; }
  .whitespace-pre-wrap { white-space: pre-wrap; }
  .mt-4 { margin-top: 1rem; }
  .sm\\:flex-row { flex-direction: row; }
  .gap-6 { gap: 1.5rem; }
  .w-full { width: 100%; }
  .sm\\:w-40 { width: 10rem; }
  .sm\\:h-40 { height: 10rem; }
  .object-cover { object-fit: cover; }
  .rounded-lg { border-radius: 0.5rem; }
  .flex-shrink-0 { flex-shrink: 0; }
  .flex-grow { flex-grow: 1; }
  .pt-4 { padding-top: 1rem; }
  .border-t { border-top-width: 1px; }
  .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
  .mb-2 { margin-bottom: 0.5rem; }
  .space-y-3 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.75rem; }
  .font-medium { font-weight: 500; }
  .flex-wrap { flex-wrap: wrap; }
  .gap-2 { gap: 0.5rem; }
  .bg-sky-100 { background-color: #e0f2fe; }
  .text-sky-800 { color: #075985; }
  .text-xs { font-size: 0.75rem; line-height: 1rem; }
  .px-2\\.5 { padding-left: 0.625rem; padding-right: 0.625rem; }
  .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
  .rounded-full { border-radius: 9999px; }
  .bg-rose-100 { background-color: #ffe4e6; }
  .text-rose-800 { color: #9f1239; }
  .bg-green-100 { background-color: #dcfce7; }
  .p-3 { padding: 0.75rem; }
  .rounded-md { border-radius: 0.375rem; }
  .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
  .mt-8 { margin-top: 2rem; }
  .text-2xl { font-size: 1.5rem; line-height: 2rem; }
  .w-full { width: 100%; }
  .overflow-x-auto { overflow-x: auto; }
`;

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
        ? `<div class="mt-4 flex sm:flex-row gap-6 items-start" style="flex-direction: column;">
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
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
                ${PORTFOLIO_STYLES}
                /* Specific styles for sm: breakpoint equivalent */
                @media (min-width: 640px) {
                    .sm\\:flex-row { flex-direction: row; }
                    .sm\\:w-40 { width: 10rem; }
                    .sm\\:h-40 { height: 10rem; }
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