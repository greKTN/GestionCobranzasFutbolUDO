import { useState, useMemo, useEffect } from 'react';
import { UserPlus, Filter, ChevronDown, User, TrendingUp, Edit2 } from 'lucide-react';
import  ModalRegistro from '../components/modalRegistro';

// ==========================================
// MOCK DATA: SIMULACIÓN DE DATOS CON CAMPOS DE FICHA
// ==========================================
export const GestionJugadores = () => {
    // 1. Estado para almacenar los jugadores de la BDD
    const [jugadoresDB, setJugadoresDB] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('Sub-15');
    const [filtroFinanciero, setFiltroFinanciero] = useState<string>('Todos');
    const [showCatDropdown, setShowCatDropdown] = useState<boolean>(false);
    const [showAdvDropdown, setShowAdvDropdown] = useState<boolean>(false);
    const [modalAbierto, setModalAbierto] = useState<boolean>(false);

    const categoriasDisponibles = ['Querubines','Prebenjamin','Benjamin','Alevin','Infantil', 'Sub-15', 'Sub-16', 'Sub-18', 'Primer Equipo'];
    const opcionesFinancieras = ['Todos', 'Al Dia', 'Moroso'];

    // 2. Fetch al backend cuando el componente se monta
    useEffect(() => {
        const fetchJugadores = async () => {
            try {
                // Ajusta el puerto si tu backend corre en otro distinto al 5000
                const response = await fetch('http://localhost:5000/api/jugadores');
                if (!response.ok) throw new Error('Error al conectar con el backend');
                
                const data = await response.json();
                setJugadoresDB(data);
            } catch (error) {
                console.error("Error trayendo datos:", error);
            } finally {
                setCargando(false);
            }
        };

        fetchJugadores();
    }, []);

    const filteredPlayers = useMemo(() => {
        return jugadoresDB.filter(player => {
            const matchesCategoria = player.categoria === categoriaSeleccionada;
            const matchesFinanciero = filtroFinanciero === 'Todos' || player.status === filtroFinanciero;
            return matchesCategoria && matchesFinanciero;
        });
    }, [jugadoresDB, categoriaSeleccionada, filtroFinanciero]);

    const selectedPlayer = useMemo(() => {
        return jugadoresDB.find(p => p.id === selectedPlayerId) || null;
    }, [jugadoresDB, selectedPlayerId]);

    const handlePlayerClick = (id: number) => {
        setSelectedPlayerId(prev => prev === id ? null : id);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto text-zinc-100 p-2">
            
            {/* HEADER UNIFICADO */}
            <div className="w-full bg-[#C7C2C5] text-zinc-900 py-3.5 px-6 shadow-md border-b border-zinc-300/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 -mt-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-zinc-900">Gestión de Jugadores</h1>
                    <p className="text-zinc-700 text-xs font-semibold mt-0.5 flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                        Mayo 2026 - Temporada actual
                    </p>
                </div>
            </div>

            {/* CONTENEDOR PRINCIPAL: grid en móviles/tablets para que no se rompa, flex en pantallas grandes */}
            <div className="grid grid-cols-1 xl:flex xl:flex-row gap-6 w-full items-start">

                {/* COLUMNA IZQUIERDA: TABLA DE JUGADORES */}
                <div className={`transition-all duration-300 ease-in-out w-full ${selectedPlayerId ? 'xl:w-[58%]' : 'xl:w-full'} shrink-0`}>
                    <div className="bg-[#403B3E] border border-zinc-700/40 rounded p-4 sm:p-5 shadow-lg flex flex-col">
                        
                        {/* CONTROLES DE PLANTILLA RESPONSIVOS */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-4 border-b border-[#C7C2C5] gap-4">
                            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2 whitespace-nowrap">
                                <span className="w-2 h-2 rounded-full bg-[#B1ED25]"></span> Plantilla Activa
                            </h2>
                            <div className="flex flex-wrap items-center gap-3 relative w-full md:w-auto">
                                
                                {/* Dropdown Categoría */}
                                <div className="relative flex-1 sm:flex-none">
                                    <button 
                                        onClick={() => { setShowCatDropdown(!showCatDropdown); setShowAdvDropdown(false); }}
                                        className="w-full flex items-center justify-between gap-2 px-3 py-1.5 bg-[#403B3E] hover:bg-zinc-900 text-zinc-300 text-sm font-semibold border border-[#FFFFFF] transition-colors"
                                    >
                                        <span className="text-[#FFFFFF] font-normal">Categoría:</span>
                                        {categoriaSeleccionada}
                                        <ChevronDown size={14} className="text-zinc-500" />
                                    </button>
                                    {showCatDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 bg-[#403B3E] border border-[#ffffff] shadow-xl z-50 overflow-hidden">
                                            {categoriasDisponibles.map((cat) => (
                                                <button
                                                    key={cat}
                                                    onClick={() => { setCategoriaSeleccionada(cat); setShowCatDropdown(false); }}
                                                    className={`w-full text-left px-4 py-2 text-xs font-semibold block hover:bg-zinc-800 transition-colors ${categoriaSeleccionada === cat ? 'text-[#B1ED25] bg-zinc-900' : 'text-zinc-300'}`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Dropdown Filtros Avanzados */}
                                <div className="relative flex-1 sm:flex-none">
                                    <button 
                                        onClick={() => { setShowAdvDropdown(!showAdvDropdown); setShowCatDropdown(false); }}
                                        className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 bg-[#403B3E] hover:bg-zinc-900 text-zinc-300 text-sm font-semibold border transition-colors ${filtroFinanciero !== 'Todos' ? 'border-[#B1ED25] text-[#B1ED25]' : 'border-[#FFFFFF]'}`}
                                    >
                                        <span className="flex items-center gap-1.5">
                                            <Filter size={16} className={filtroFinanciero !== 'Todos' ? 'text-[#B1ED25]' : 'text-zinc-500'} />
                                            Filtros
                                        </span>
                                        <ChevronDown size={14} className="text-zinc-500" />
                                    </button>
                                    {showAdvDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 bg-[#403B3E] border border-[#ffffff] shadow-xl z-50 p-2 space-y-1">
                                            <p className="text-[10px] uppercase tracking-wider text-white font-bold px-2 py-1">Estado Financiero</p>
                                            {opcionesFinancieras.map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => { setFiltroFinanciero(status); setShowAdvDropdown(false); }}
                                                    className={`w-full text-left px-2 py-1.5 text-xs rounded-sm font-semibold block hover:bg-zinc-800 transition-colors ${filtroFinanciero === status ? 'text-[#B1ED25] bg-zinc-900' : 'text-zinc-300'}`}
                                                >
                                                    {status === 'Todos' ? 'Mostrar Todos' : status}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Registrar Jugador */}
                                <button 
                                    onClick={() => setModalAbierto(true)}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-1.5 bg-[#403B3E] hover:bg-zinc-900 text-[#ffffff] text-sm font-black border border-[#ffffff] shadow-sm transition-all"
                                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}
                                >
                                    <UserPlus size={16} />
                                    Registrar Jugador
                                </button>
                            </div>
                        </div>

                        {/* TABLA DE JUGADORES (Con scroll horizontal seguro para pantallas pequeñas) */}
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-zinc-300 text-sm border-separate border-spacing-y-2 min-w-175 xl:min-w-0">
                                <thead className="text-xs text-zinc-200 uppercase tracking-wider">
                                    <tr>
                                        <th className="pb-2 px-3 text-left font-bold">Jugador</th>
                                        <th className="pb-2 px-3 text-left font-bold">Categoría y Beca</th>
                                        <th className="pb-2 px-3 text-left font-bold">Contacto y Representante</th>
                                        <th className="pb-2 px-3 text-left font-bold">Estado Financiero</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPlayers.length > 0 ? (
                                        filteredPlayers.map((player) => {
                                            const isSelected = selectedPlayerId === player.id;
                                            return (
                                                <tr 
                                                    key={player.id} 
                                                    onClick={() => handlePlayerClick(player.id)}
                                                    className={`transition-all duration-150 cursor-pointer group rounded-md
                                                        ${isSelected 
                                                            ? 'bg-[#28370540] outline-1 outline-[#B1ED25] shadow-[0_0_12px_rgba(163,230,53,0.15)]' 
                                                            : 'bg-[#1e1d1f]/60 hover:bg-[#1e1d1f]'
                                                        }`}
                                                >
                                                    <td className="py-3 px-3 flex items-center gap-3 rounded-l-md">
                                                        <img src={player.avatar} alt={player.name} className="w-9 h-9 rounded-l object-cover border border-zinc-700/50" />
                                                        <div>
                                                            <p className={`font-bold transition-colors ${isSelected ? 'text-[#B1ED25]' : 'text-zinc-100 group-hover:text-[#B1ED25]'}`}>{player.name}</p>
                                                            <p className="text-[#ED25B1] text-xs font-mono">ID: 0000000{player.id}</p>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-3 vertical-align-middle">
                                                        <p className="font-semibold text-zinc-200">{player.categoria}</p>
                                                        <p className={`text-xs ${player.beca === 'Sin Beca' ? 'text-zinc-500' : 'text-cyan-400 font-medium'}`}>{player.beca}</p>
                                                    </td>
                                                    <td className="py-3 px-3">
                                                        <p className="text-zinc-200 font-medium">{player.representativeName}</p>
                                                        <p className="text-zinc-500 text-xs font-mono">{player.representativePhone}</p>
                                                    </td>
                                                    <td className="py-3 px-3 rounded-r-md">
                                                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${player.status === 'Al Dia' ? 'text-lime-400' : 'text-rose-400'}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${player.status === 'Al Dia' ? 'bg-lime-400' : 'bg-rose-500 animate-pulse'}`}></span>
                                                            {player.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center py-8 text-zinc-500 font-medium bg-[#1e1d1f]/20 rounded-md">
                                                No hay jugadores registrados en esta categoría con el filtro seleccionado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: FICHA TÉCNICA (Arreglado el desbordamiento interno) */}
                <div className={`transition-all duration-300 ease-in-out w-full ${selectedPlayerId && selectedPlayer ? 'xl:w-[42%] opacity-100 block' : 'h-0 xl:w-0 opacity-0 hidden overflow-hidden'} shrink-0`}>
                    {selectedPlayer && (
                        <div className="bg-[#28370540] border-2 border-[#B1ED25] p-5 shadow-[0_0_15px_rgba(177,237,37,0.1)] flex flex-col w-full text-zinc-100 rounded-sm box-border">
                            
                            {/* Header de la Ficha */}
                            <div className="flex flex-row items-center justify-between border-b border-zinc-700/50 pb-4 mb-5">
                                <div className="flex items-center gap-2 text-[#B1ED25] font-bold text-sm">
                                    <User size={16} />
                                    <span>Ficha Técnica del Jugador</span>
                                </div>
                                <span className={`inline-flex items-center gap-1 text-xs font-bold ${selectedPlayer.status === 'Al Dia' ? 'text-lime-400' : 'text-rose-400'}`}>
                                    <span className={`w-1 h-1 rounded-full ${selectedPlayer.status === 'Al Dia' ? 'bg-lime-400' : 'bg-rose-500'}`}></span>
                                    {selectedPlayer.status}
                                </span>
                            </div>

                            {/* Foto y Datos Básicos Centrales */}
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="p-1 border border-[#B1ED25] mb-3 bg-[#1e1d1f]">
                                    <img 
                                        src={selectedPlayer.avatar} 
                                        alt={selectedPlayer.name} 
                                        className="w-24 h-24 sm:w-28 sm:h-28 object-cover"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-white tracking-wide">{selectedPlayer.name}</h3>
                                <p className="text-zinc-400 text-xs font-semibold mt-0.5">
                                    {selectedPlayer.position} <span className="mx-1 text-zinc-600">|</span> Dorsal {selectedPlayer.dorsal}
                                </p>
                                <p className="text-zinc-500 font-mono text-[11px] mt-1">ID: 0000000{selectedPlayer.id}</p>
                            </div>

                            {/* Separador e Indicador de Sección */}
                            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3 px-1">Datos físicos y personales</p>

                            {/* Cuadrícula de Datos (Cambiado a grid fluido para evitar que se pise el texto) */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-[#1e1d1f]/40 p-2.5 sm:p-3 border-l-2 border-[#B1ED25] rounded-r-sm min-w-0">
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase truncate">Nacimiento</p>
                                    <p className="text-xs font-semibold text-zinc-200 mt-0.5 truncate">{selectedPlayer.nacimiento}</p>
                                </div>
                                <div className="bg-[#1e1d1f]/40 p-2.5 sm:p-3 border-l-2 border-[#B1ED25] rounded-r-sm min-w-0">
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase truncate">Perfil Hábil</p>
                                    <p className="text-xs font-semibold text-zinc-200 mt-0.5 truncate">{selectedPlayer.pierna}</p>
                                </div>
                                <div className="bg-[#1e1d1f]/40 p-2.5 sm:p-3 border-l-2 border-[#B1ED25] rounded-r-sm min-w-0">
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase truncate">Estatura</p>
                                    <p className="text-xs font-semibold text-zinc-200 mt-0.5 truncate">{selectedPlayer.altura}</p>
                                </div>
                                <div className="bg-[#1e1d1f]/40 p-2.5 sm:p-3 border-l-2 border-[#B1ED25] rounded-r-sm min-w-0">
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase truncate">Peso Corporal</p>
                                    <p className="text-xs font-semibold text-zinc-200 mt-0.5 truncate">{selectedPlayer.peso}</p>
                                </div>
                            </div>

                            {/* Botones de Acción Inferiores (Ajustado padding y clipPath para que entren perfectos) */}
                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-700/50 w-full overflow-hidden">
                                <button 
                                    className="flex items-center justify-center gap-1.5 py-2.5 border border-[#ffffff] text-white text-xs font-bold bg-[#403B3E] hover:bg-zinc-800 transition-colors w-full whitespace-nowrap px-1"
                                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)' }}
                                >
                                    <Edit2 size={12} className="shrink-0" />
                                    <span>Editar Perfil</span>
                                </button>
                                <button 
                                    className="flex items-center justify-center gap-1.5 py-2.5 bg-[#B1ED25] text-zinc-900 text-xs font-black hover:bg-lime-400 transition-colors w-full whitespace-nowrap px-1"
                                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)' }}
                                >
                                    <TrendingUp size={12} className="shrink-0" />
                                    <span>Reporte Detalle</span>
                                </button>
                            </div>

                        </div>
                    )}
                </div>

            </div>
            <ModalRegistro 
                abierto={modalAbierto} 
                cerrarModal={() => setModalAbierto(false)} 
            />
        </div>
    );
};