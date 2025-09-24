
import React from 'react';
import { BIBLIOGRAPHY } from '../constants';
import LibraryIcon from './icons/LibraryIcon';

const ResourcesView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Recursos y Bibliografía</h1>
        <p className="mt-2 text-slate-600">
          Consulta los autores y textos clave del programa para enriquecer tu reflexión y conectar la teoría con la práctica.
        </p>
      </div>

      <div className="space-y-6">
        {BIBLIOGRAPHY.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-sky-100 p-3 rounded-lg mt-1">
                <LibraryIcon className="h-6 w-6 text-sky-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">{item.title}</h2>
                <p className="text-sm font-medium text-slate-600 mt-1">{item.author}</p>
                <p className="text-slate-500 mt-2">{item.details}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <footer className="mt-12 text-center text-sm text-slate-500">
        <p>Creado por Víctor Huerta © 2025</p>
      </footer>
    </div>
  );
};

export default ResourcesView;