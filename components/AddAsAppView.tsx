import React from 'react';
import EllipsisVerticalIcon from './icons/EllipsisVerticalIcon';
import ArrowUpTrayIcon from './icons/ArrowUpTrayIcon';
import DevicePhoneMobileIcon from './icons/DevicePhoneMobileIcon';
import PlusIcon from './icons/PlusIcon';

const InstructionStep: React.FC<{ number: number; icon?: React.ReactNode; text: string }> = ({ number, icon, text }) => (
    <li className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 bg-sky-100 text-sky-700 font-bold rounded-full flex items-center justify-center">
            {number}
        </div>
        <div className="flex-grow pt-1 flex items-center gap-2">
            {icon && <span className="text-slate-600">{icon}</span>}
            <span className="text-slate-600">{text}</span>
        </div>
    </li>
);


const AddAsAppView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Agregar como APP</h1>
        <p className="mt-2 text-slate-600">
          Instala esta aplicación en tu teléfono para un acceso más rápido y una experiencia de pantalla completa, ¡como una app nativa!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Android Instructions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <img src="https://www.google.com/chrome/static/images/chrome-logo-m100.svg" alt="Chrome Logo" className="h-8 w-8" />
            <h2 className="text-xl font-bold text-slate-800">Para Android (con Chrome)</h2>
          </div>
          <ol className="space-y-4">
            <InstructionStep number={1} text="Abre la aplicación en el navegador Chrome." />
            <InstructionStep 
                number={2} 
                icon={<EllipsisVerticalIcon className="h-6 w-6" />}
                text="Toca el menú de los tres puntos en la esquina superior derecha." 
            />
            <InstructionStep 
                number={3} 
                icon={<DevicePhoneMobileIcon className="h-6 w-6" />}
                text="Busca y selecciona la opción 'Instalar aplicación' o 'Agregar a la pantalla principal'." 
            />
            <InstructionStep number={4} text="Confirma la acción y el ícono aparecerá en tu pantalla de inicio." />
          </ol>
        </div>

        {/* iPhone Instructions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-8 w-8"><path fill="#0096FF" d="M24 6A18 18 0 1 0 24 42A18 18 0 1 0 24 6Z"/><path fill="#FFF" d="m13.5 24l7.8-13.5l7.8 13.5l-7.8 13.5z"/><path fill="#E53935" d="m21.3 10.5l-7.8 13.5h15.6z"/></svg>
            <h2 className="text-xl font-bold text-slate-800">Para iPhone (con Safari)</h2>
          </div>
          <ol className="space-y-4">
            <InstructionStep number={1} text="Abre esta página en el navegador Safari." />
            <InstructionStep
                number={2}
                icon={<ArrowUpTrayIcon className="h-6 w-6" />}
                text="Toca el ícono de 'Compartir' en la barra inferior."
            />
            <InstructionStep
                number={3}
                icon={<PlusIcon className="h-6 w-6 p-1 bg-slate-200 rounded" />}
                text="Desplázate hacia abajo y selecciona 'Agregar a la pantalla de inicio'."
            />
            <InstructionStep number={4} text="Confirma el nombre y toca 'Agregar'. El ícono aparecerá en tu pantalla." />
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AddAsAppView;
