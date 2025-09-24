import React, { useState } from 'react';
import { COMPETENCIES } from '../constants';
import ScaleIcon from './icons/ScaleIcon';

const AccordionItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 text-left"
        aria-expanded={isOpen}
      >
        <h3 className="text-md font-semibold text-slate-700">{title}</h3>
        <svg
          className={`w-5 h-5 text-slate-500 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-4 pr-4 text-slate-600 prose prose-sm max-w-none">
          {children}
        </div>
      )}
    </div>
  );
};

const DimensionesView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dimensiones Clave de la Práctica Docente</h1>
        <p className="mt-2 text-slate-600">
          Una guía para comprender y aplicar los fundamentos teóricos y éticos en tu quehacer como futuro docente de Educación Física.
        </p>
      </div>

      <div className="space-y-8">
        {/* Marco para la Buena Enseñanza */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Marco para la Buena Enseñanza (MBE)</h2>
          <div className="space-y-2">
            <AccordionItem title="Dominio A: Preparación de la enseñanza">
              <p>Implica el conocimiento profundo de la disciplina, el currículum y las características de los estudiantes. Se traduce en la habilidad para diseñar planificaciones coherentes y desafiantes que consideren la diversidad en el aula.</p>
              <blockquote>
                <strong>Ejemplo en Educación Física:</strong> Planificar una unidad de básquetbol para 7° básico, considerando la progresión de habilidades (dribling, pases, tiro) y adaptando actividades para estudiantes con diferentes niveles de destreza motriz o necesidades educativas especiales.
              </blockquote>
            </AccordionItem>
            <AccordionItem title="Dominio B: Creación de un ambiente propicio para el aprendizaje">
              <p>Se refiere a la creación de un clima de aula seguro, inclusivo y respetuoso. Involucra establecer normas claras y consistentes, y fomentar una cultura de altas expectativas y apoyo mutuo, donde el error es una oportunidad de aprendizaje.</p>
              <blockquote>
                <strong>Ejemplo en Educación Física:</strong> Establecer rutinas claras al inicio y final de la clase (saludo, calentamiento, vuelta a la calma) y promover un lenguaje de respeto y apoyo mutuo, interviniendo constructivamente cuando un estudiante se burla de otro por su desempeño.
              </blockquote>
            </AccordionItem>
            <AccordionItem title="Dominio C: Enseñanza para el aprendizaje de todos los estudiantes">
              <p>Engloba el dominio de estrategias de enseñanza efectivas y flexibles que se adapten a los distintos ritmos y estilos de aprendizaje. Incluye la capacidad de comunicar los contenidos de manera clara, monitorear el progreso y proveer retroalimentación oportuna.</p>
               <blockquote>
                <strong>Ejemplo en Educación Física:</strong> Durante una clase de gimnasia rítmica, utilizar demostraciones visuales, instrucciones verbales y apoyo kinestésico (manual) para enseñar un movimiento complejo, asegurando que todos los estilos de aprendizaje sean atendidos.
              </blockquote>
            </AccordionItem>
            <AccordionItem title="Dominio D: Responsabilidades profesionales">
              <p>Considera el compromiso del docente con su propio desarrollo profesional, la reflexión sistemática sobre su práctica y la colaboración activa con sus pares, la comunidad escolar y las familias para potenciar el aprendizaje de los estudiantes.</p>
               <blockquote>
                <strong>Ejemplo en Educación Física:</strong> Participar activamente en el consejo de profesores, compartir con colegas una estrategia exitosa para incluir a estudiantes con TEA en juegos grupales, y reflexionar sistemáticamente en este diario de campo sobre la propia práctica.
              </blockquote>
            </AccordionItem>
          </div>
        </div>
        
        {/* Competencias del Programa */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Competencias del Programa</h2>
          <div className="space-y-2">
            {COMPETENCIES.map(comp => (
                <AccordionItem key={comp.id} title={comp.label}>
                    {
                        {
                            'CFF2': <p>Se refiere a tomar decisiones pedagógicas y personales basadas en valores humanistas y cristianos, promoviendo la dignidad, la justicia y el bien común. <strong>Ejemplo:</strong> Al mediar en un conflicto, apelar a la empatía y al respeto mutuo, más allá de solo aplicar una sanción.</p>,
                            'CFF3': <p>Implica la habilidad de expresar ideas, instrucciones y retroalimentación de forma oral y escrita, adaptando el lenguaje al nivel de los estudiantes y utilizando diversos medios. <strong>Ejemplo:</strong> Explicar las reglas de un nuevo juego de forma verbal, apoyándose con un diagrama en la pizarra y realizando una demostración práctica.</p>,
                            'CFF5': <p>Es la capacidad de observar una situación de clase, identificar sus componentes clave, cuestionar las propias acciones y proponer mejoras fundamentadas. <strong>Ejemplo:</strong> Tras una clase donde los estudiantes se mostraron apáticos, analizar en el diario de campo las posibles causas (actividad poco motivante, instrucciones confusas) y planificar un ajuste para la siguiente sesión.</p>,
                            'CFF8': <p>Significa involucrarse activamente en la vida escolar, promoviendo la participación estudiantil y contribuyendo a un clima democrático. <strong>Ejemplo:</strong> Organizar una votación entre los estudiantes para decidir qué deportes trabajar en la siguiente unidad, fomentando su autonomía y compromiso.</p>,
                            'C1': <p>Consiste en aplicar el conocimiento teórico de la motricidad, la didáctica y la fisiología para fundamentar las decisiones pedagógicas. <strong>Ejemplo:</strong> Al enseñar voleibol, justificar la técnica del golpe de dedos basándose en principios biomecánicos para lograr mayor precisión y prevenir lesiones.</p>,
                            'C3': <p>Se trata de comprender y utilizar el currículum nacional como una hoja de ruta flexible, adaptando los objetivos de aprendizaje al contexto y necesidades del grupo. <strong>Ejemplo:</strong> Seleccionar un Objetivo de Aprendizaje sobre vida activa y saludable y diseñando un proyecto interdisciplinario con Ciencias sobre nutrición.</p>,
                            'C8': <p>Es la habilidad de transformar la experiencia práctica en conocimiento útil, a través de la reflexión y el registro ordenado de lo vivido. <strong>Ejemplo:</strong> Utilizar este diario de campo para documentar una estrategia de inclusión que funcionó bien, para poder replicarla y compartirla en el futuro.</p>,
                            'C9': <p>Implica establecer relaciones de colaboración y respeto con todos los actores de la comunidad educativa para potenciar el aprendizaje. <strong>Ejemplo:</strong> Organizar una muestra de danzas folclóricas invitando a las familias a participar y compartir sus propias tradiciones, fortaleciendo el vínculo escuela-comunidad.</p>
                        }[comp.id]
                    }
                </AccordionItem>
            ))}
          </div>
        </div>

        {/* Deontología y Ethos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-start gap-4">
               <div className="flex-shrink-0 bg-sky-100 p-3 rounded-lg mt-1">
                <ScaleIcon className="h-6 w-6 text-sky-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Deontología Profesional y Ethos Docente</h2>
                <div className="mt-4 prose prose-sm max-w-none text-slate-600 space-y-4">
                    <div>
                        <h4>Deontología Profesional: El "Qué se debe hacer"</h4>
                        <p>Es el conjunto de <strong>deberes, normas y principios éticos</strong> que rigen el ejercicio de la profesión docente. Se enfoca en las obligaciones concretas para garantizar una práctica justa, segura y de calidad.</p>
                        <blockquote>
                            <strong>Ejemplos para tus registros:</strong>
                            <ul>
                                <li>"Hoy, al formar equipos, me aseguré de que la selección fuera mixta y equilibrada para no perpetuar estereotipos de género (principio de equidad)."</li>
                                <li>"Un estudiante me confió una situación personal delicada; manejé la información con absoluta confidencialidad para proteger su bienestar."</li>
                                <li>"Antes de iniciar la actividad con colchonetas, realicé una exhaustiva revisión de seguridad del material (deber de cuidado)."</li>
                            </ul>
                        </blockquote>
                    </div>
                     <div>
                        <h4>Ethos Docente: El "Cómo se debe ser"</h4>
                        <p>Es el conjunto de <strong>rasgos, valores y comportamientos</strong> que conforman el carácter e identidad de un buen profesional de la educación. Va más allá de la norma escrita; es la manifestación de la vocación y el compromiso.</p>
                        <blockquote>
                            <strong>Ejemplos para tus registros:</strong>
                            <ul>
                                <li>"A pesar de la frustración de un grupo por no lograr un objetivo, mantuve una actitud positiva y alentadora, modelando resiliencia (ethos de superación)."</li>
                                <li>"Felicité públicamente el esfuerzo de un estudiante que, aunque no ganó, demostró un increíble juego limpio, reforzando los valores que quiero transmitir (ethos formativo)."</li>
                                <li>"Llegué con energía y entusiasmo a la clase, buscando contagiar mi pasión por el movimiento y la vida activa (ethos modélico)."</li>
                            </ul>
                        </blockquote>
                    </div>
                </div>
              </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default DimensionesView;