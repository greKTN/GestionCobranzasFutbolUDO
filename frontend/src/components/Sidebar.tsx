import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

// Definimos lo que recibe la Sidebar desde App.tsx
interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    }

    export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {

    const menuItems = [
        { name: 'Vista General', path: '/' },
        { name: 'Gestión de jugadores', path: '/jugadores' },
        { name: 'Cobranza', path: '/cobranza' },
        { name: 'Reportes', path: '/reportes' },
    ];

    return (
        <>
        {/* 1. Capa invisible/traslúcida de fondo: Detecta clicks fuera de la barra */}
        {/* Usamos fixed, inset-0 para cubrir toda la pantalla, y un z-30 para que quede debajo de la sidebar (z-40) */}
        <div
            onClick={() => setIsOpen(false)}
            className={`fixed inset-0 z-30 bg-black/5  transition-opacity duration-300
            ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}
        />

        {/* Botón hamburguesa exterior: Sutil, limpio y orgánico */}
        {!isOpen && (
            <button
            onClick={() => setIsOpen(true)}
            className="fixed top-6 left-6 z-50 p-2 rounded-full text-zinc-900 hover:bg-zinc-200 hover:text-zinc-950 transition-all duration-200 border border-zinc-300/30 bg-zinc-100/50 backdrop-blur-sm flex items-center justify-center shadow-sm"
            title="Abrir menú"
            >
            <Menu size={15} />
            </button>
        )}

        {/* Contenedor de la Sidebar Flotante */}
        <div
            className={`fixed top-4 bottom-4 left-4 z-40 bg-[#d4cece] text-zinc-900 transition-all duration-300 flex flex-col pt-4
            rounded-l shadow-xl border border-zinc-300/50
            ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full opacity-0 pointer-events-none'} 
            `}
        >
            {/* Botón de cierre */}
            <div className="flex justify-end px-4">
            <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full text-zinc-600 hover:bg-zinc-300/60 hover:text-zinc-950 transition-colors duration-200 flex items-center justify-center"
                title="Cerrar menú"
            >
                <X size={18} />
            </button>
            </div>

            {/* Logo */}
            <div className={`flex justify-center mb-8 transition-opacity duration-200 ${!isOpen && 'opacity-0'}`}>
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-zinc-800 flex items-center justify-center bg-white shadow-md">
                <img src="/src/assets/elegantes_fc.png" alt="Elegantes FC" className="object-cover w-full h-full" />
            </div>
            </div>

            {/* Enlaces */}
            <nav className={`flex flex-col items-center space-y-4 px-4 transition-opacity duration-200 ${!isOpen && 'opacity-0'}`}>
            {menuItems.map((item) => (
                <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                    w-full text-center py-2.5 px-4 rounded-full text-lg font-semibold transition-all duration-200
                    ${isActive 
                    ? 'bg-[#ED254E4D] text-[#ED254E] shadow-md font-bold scale-105' 
                    : 'text-[#30161c] hover:bg-zinc-200/50 hover:text-black'
                    }
                `}
                >
                {item.name}
                </NavLink>
            ))}
            </nav>
        </div>
        </>
    );
};