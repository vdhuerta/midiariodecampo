import React, { useState } from 'react';
import { UserInfo } from '../types';
import { CHILEAN_UNIVERSITIES } from '../constants';

interface OnboardingProps {
    onComplete: (userInfo: UserInfo) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [userInfo, setUserInfo] = useState<UserInfo>({
        name: '',
        surname: '',
        university: '',
        subject: 'Identidad Profesional Docente',
        academic: 'Víctor Huerta Herrera'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userInfo.name && userInfo.surname && userInfo.university) {
            onComplete(userInfo);
        }
    };

    return (
        <div 
            className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center"
            style={{ backgroundImage: `url('https://raw.githubusercontent.com/vdhuerta/assets-aplications/main/Intro_DiarioDeCampo.png')`}}
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
            <div className="relative w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-slate-300">
                <h1 className="text-2xl font-bold text-slate-800 text-center">Bienvenido a tu Diario de Campo</h1>
                <p className="text-slate-600 text-center mt-2 mb-6">Completa tus datos para personalizar la experiencia.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                            <input type="text" id="name" name="name" value={userInfo.name} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" />
                        </div>
                        <div>
                            <label htmlFor="surname" className="block text-sm font-medium text-slate-700 mb-1">Apellidos</label>
                            <input type="text" id="surname" name="surname" value={userInfo.surname} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="university" className="block text-sm font-medium text-slate-700 mb-1">Universidad</label>
                        <select id="university" name="university" value={userInfo.university} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none">
                            <option value="" disabled>Selecciona tu universidad</option>
                            {CHILEAN_UNIVERSITIES.sort().map(uni => <option key={uni} value={uni}>{uni}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Asignatura</label>
                        <select id="subject" name="subject" value={userInfo.subject} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed">
                            <option>Identidad Profesional Docente</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="academic" className="block text-sm font-medium text-slate-700 mb-1">Académico</label>
                         <select id="academic" name="academic" value={userInfo.academic} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed">
                            <option>Víctor Huerta Herrera</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full mt-4 bg-sky-600 text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-sky-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                        Comenzar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Onboarding;