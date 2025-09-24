import { JournalEntry } from '../types';
import { COMPETENCIES } from '../constants';

declare const jspdf: any;

export const generatePortfolioPDF = (entries: JournalEntry[], bibliography: any[]) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();

  const docWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = margin;
  const today = new Date().toLocaleDateString('es-ES');

  // --- Helper Functions ---

  const addHeader = (text: string) => {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(text, margin, margin - 5);
    doc.line(margin, margin, docWidth - margin, margin);
  };
  
  const addFooter = (pageNumber: number, totalPages: number) => {
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(150);
      const text = `Página ${pageNumber} de ${totalPages}`;
      const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      doc.text(text, (docWidth - textWidth) / 2, doc.internal.pageSize.getHeight() - 10);
  };

  const checkPageBreak = (requiredHeight: number) => {
    if (y + requiredHeight > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
      addHeader('Portafolio Profesional - Mi Diario de Campo PE');
    }
  };
  
  const addWrappedText = (text: string, x: number, maxWidth: number, options: any = {}) => {
      doc.setFont(options.font || 'Helvetica', options.fontStyle || 'normal');
      doc.setFontSize(options.fontSize || 10);
      doc.setTextColor(options.color || '#334155'); // slate-700
      
      const lines = doc.splitTextToSize(text || 'N/A', maxWidth);
      lines.forEach((line: string) => {
        checkPageBreak(5); // approx height for a line
        doc.text(line, x, y);
        y += 5;
      });
      y += 3; // a little space after the block
  };

  // --- Cover Page ---
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('Portafolio Profesional', docWidth / 2, 80, { align: 'center' });
  doc.setFontSize(16);
  doc.text('Diario de Campo de Educación Física', docWidth / 2, 95, { align: 'center' });
  
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Generado el: ${today}`, docWidth / 2, 150, { align: 'center' });
  doc.text(`Número de entradas: ${entries.length}`, docWidth / 2, 160, { align: 'center' });


  // --- Entries Loop ---
  if (entries.length > 0) {
      doc.addPage();
      y = margin;
      addHeader('Portafolio Profesional - Mi Diario de Campo PE');
  }

  entries.forEach((entry, index) => {
    checkPageBreak(50); // Initial check for new entry
    
    if (index > 0) {
        doc.line(margin, y, docWidth - margin, y);
        y += 10;
    }
    
    // Title & Date
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor('#1e293b'); // slate-800
    addWrappedText(entry.title, margin, docWidth - margin * 2, { fontSize: 16, fontStyle: 'bold' });
    
    const formattedDate = new Date(entry.date).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
    });
    addWrappedText(formattedDate, margin, docWidth - margin * 2, { fontSize: 10, color: '#64748b' }); // slate-500
    y += 5;

    // Main Reflection
    addWrappedText(entry.reflection, margin, docWidth - margin * 2);

    // Image attachment
    if (entry.attachment && entry.attachment.type.startsWith('image/')) {
      const imgProps = doc.getImageProperties(entry.attachment.data);
      const imgWidth = 100;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      checkPageBreak(imgHeight + 10);
      doc.addImage(entry.attachment.data, 'JPEG', margin, y, imgWidth, imgHeight);
      y += imgHeight + 10;
    }

    // Other fields
    const fields = [
      { label: 'Habilidades', content: entry.skills },
      { label: 'Deontología y Ethos', content: entry.deontology },
      { label: 'Dimensiones (MBE)', content: entry.dimensions },
      { label: 'Feedback del Supervisor', content: entry.supervisorFeedback },
    ];
    
    fields.forEach(field => {
        if (field.content) {
            checkPageBreak(15);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(11);
            addWrappedText(field.label, margin, docWidth - margin * 2, { fontSize: 11, fontStyle: 'bold' });
            addWrappedText(field.content, margin, docWidth - margin * 2, { fontSize: 10 });
        }
    });

    // Tags, Competencies, Bibliography
    if (entry.tags.length > 0) {
        checkPageBreak(15);
        addWrappedText('Etiquetas:', margin, docWidth - margin * 2, { fontSize: 10, fontStyle: 'bold' });
        addWrappedText(entry.tags.join(', '), margin + 2, docWidth - margin * 2 - 2, { fontSize: 9 });
    }
    if (entry.competencies.length > 0) {
        checkPageBreak(15);
        addWrappedText('Competencias:', margin, docWidth - margin * 2, { fontSize: 10, fontStyle: 'bold' });
        const compLabels = entry.competencies.map(id => COMPETENCIES.find(c => c.id === id)?.label || id);
        addWrappedText(compLabels.join('\n'), margin + 2, docWidth - margin * 2 - 2, { fontSize: 9 });
    }
     if (entry.linkedBibliography && entry.linkedBibliography.length > 0) {
        checkPageBreak(15);
        addWrappedText('Bibliografía Vinculada:', margin, docWidth - margin * 2, { fontSize: 10, fontStyle: 'bold' });
        const biblioLabels = entry.linkedBibliography.map(id => {
            const bib = bibliography.find(b => b.id === id);
            return bib ? `${bib.author} - "${bib.title}"` : id;
        });
        addWrappedText(biblioLabels.join('\n'), margin + 2, docWidth - margin * 2 - 2, { fontSize: 9 });
    }
    y += 10;
  });
  
  // Add footers to all pages
  const totalPages = doc.internal.getNumberOfPages();
  for(let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  doc.save(`portafolio-diario-de-campo-${new Date().toISOString().split('T')[0]}.pdf`);
};
