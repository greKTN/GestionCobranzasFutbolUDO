import { 
    UserPlus, 
    CircleDollarSign, 
    FileText, 
    ChevronRight, 
    TrendingUp, 
    AlertTriangle,
    ArrowUpRight
} from 'lucide-react';

export const VistaGeneral = () => {
    
    // ==========================================
    // COMPAS: AQUÍ VAMOS A CONECTAR EL BACKEND (PostgreSQL)
    // Dejé estos datos mockeados con la misma estructura que tirará la API.
    // Cuando montemos los endpoints, cambiamos esto por un useEffect o un React Query.
    // ==========================================

    const estadisticasClub = {
        solidezFinanciera: 7120.0,
        capacidadActual: 142,
        capacidadMaxima: 160,
        montoMorosos: 900,
        cantidadMorosos: 15,
        becasOtorgadas: 16,
        porcentajeBecas: 11.26
    };

    const movimientosRecientes = [
        { id: 1, tipo: 'PAGO_RECIBIDO', detalle: 'G. Brito // Equipo Sub-21', monto: 60, fecha: 'Reciente' },
        { id: 2, tipo: 'NUEVA_INCORPORACION', detalle: 'R. Silva // Equipo Sub-16', monto: 110, fecha: 'Reciente' },
        { id: 3, tipo: 'PAGO_RECIBIDO', detalle: 'M. Gomez // Infantiles', monto: 50, fecha: 'Ayer' },
        { id: 4, tipo: 'PAGO_RECIBIDO', detalle: 'A. Pereira // Equipo Sub-15', monto: 60, fecha: 'Ayer' },
    ];

    const listaMorosos = [
        { id: 1, nombre: 'Andres Ramos', equipo: 'Primer Equipo', deuda: 180, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80' },
        { id: 2, nombre: 'Ricardo Santos', equipo: 'Equipo Sub-21', deuda: 75, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80' },
        { id: 3, nombre: 'Alex Michigan', equipo: 'Equipo Sub-15', deuda: 120, avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=80&q=80' },
        { id: 4, nombre: 'Sheldon Mejias', equipo: 'Infantiles', deuda: 240, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80' },
        { id: 5, nombre: 'Juan Pérez', equipo: 'Equipo Sub-16', deuda: 100, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80' },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto text-zinc-100">
        
        {/* HEADER UNIFICADO CON EL COLOR DE LA SIDEBAR (Efecto barra conectada) */}
        <div className="w-full bg-[#d4cece] text-zinc-900 py-3.5 px-6 shadow-md rounded-l-l border-b border-zinc-300/30 flex flex-col md:flex-row md:items-center md:justify-between gap-2 -mt-4">
            <div>
                <h1 className="text-2xl font-black tracking-tight text-zinc-900">Vista General</h1>
                <p className="text-zinc-700 text-xs font-semibold mt-0.5 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                    Mayo 2026 - Temporada actual
                </p>
            </div>
        </div>

        {/* ACCIONES RÁPIDAS (Los 3 botones de arriba con corte diagonal en la esquina inferior derecha) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Registrar Jugador */}
            <button 
                className="flex items-center justify-between p-4 bg-[#d4cece] text-zinc-900 rounded-l shadow-md hover:bg-zinc-300 transition-all duration-200 group border border-zinc-300/30"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
            >
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-zinc-800 text-white rounded-l">
                <UserPlus size={20} />
                </div>
                <div className="text-left">
                <p className="font-bold text-base leading-tight">Registrar Jugador</p>
                <p className="text-xs text-zinc-600">Nueva ficha técnica</p>
                </div>
            </div>
            <ChevronRight size={18} className="text-zinc-500 group-hover:translate-x-1 transition-transform mr-1" />
            </button>

            {/* Registrar Pago */}
            <button 
                className="flex items-center justify-between p-4 bg-[#d4cece] text-zinc-900 rounded-l shadow-md hover:bg-zinc-300 transition-all duration-200 group border border-zinc-300/30"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
            >
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-zinc-800 text-white rounded-l">
                <CircleDollarSign size={20} />
                </div>
                <div className="text-left">
                <p className="font-bold text-base leading-tight">Registrar Pago</p>
                <p className="text-xs text-zinc-600">Mensualidad o inscripción</p>
                </div>
            </div>
            <ChevronRight size={18} className="text-zinc-500 group-hover:translate-x-1 transition-transform mr-1" />
            </button>

            {/* Generar Reporte */}
            <button 
                className="flex items-center justify-between p-4 bg-[#d4cece] text-zinc-900 rounded-l shadow-md hover:bg-zinc-300 transition-all duration-200 group border border-zinc-300/30"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
            >
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-zinc-800 text-white rounded-l">
                <FileText size={20} />
                </div>
                <div className="text-left">
                <p className="font-bold text-base leading-tight">Generar Reporte</p>
                <p className="text-xs text-zinc-600">Financiero o Deportivo</p>
                </div>
            </div>
            <ChevronRight size={18} className="text-zinc-500 group-hover:translate-x-1 transition-transform mr-1" />
            </button>
        </div>

        {/* TARJETÓN DE ESTADÍSTICAS EN TIEMPO REAL */}
        <div 
            className="w-full bg-linear-to-r from-[#ED254E] via-[#EF3E61] to-[#F692A6] rounded-l shadow-xl p-6 relative overflow-hidden border border-rose-400/20"
            style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}
        >
            <div className="absolute -right-6 -bottom-6 text-white/5 pointer-events-none">
            <TrendingUp size={200} />
            </div>

            <p className="text-white/90 text-sm font-semibold uppercase tracking-wider flex items-center gap-2 mb-6 pl-4">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            Estadísticas del Club en tiempo real
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pl-4">
            {/* Solidez Financiera */}
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-white/20 pb-4 lg:pb-0">
                <p className="text-white/80 font-bold text-xs uppercase tracking-widest">Solidez Financiera</p>
                <p className="text-4xl md:text-5xl font-black text-white mt-1">
                {estadisticasClub.solidezFinanciera.toFixed(1)}$
                </p>
            </div>

            {/* Bloque derecho con sub-métricas */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-black/15 p-4 rounded-l backdrop-blur-xs mr-4">
                {/* Capacidad */}
                <div>
                <p className="text-[#B1ED25] text-xs font-bold uppercase">Capacidad del equipo</p>
                <p className="text-2xl font-black text-[#B1ED25]">
                    {estadisticasClub.capacidadActual}<span className="text-sm font-normal text-white/60">/{estadisticasClub.capacidadMaxima}</span>
                </p>
                <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#B1ED25] h-full rounded-full" style={{ width: `${(estadisticasClub.capacidadActual / estadisticasClub.capacidadMaxima) * 100}%` }}></div>
                </div>
                </div>

                {/* Morosos rápidos */}
                <div>
                <p className="text-[#EDC525] text-xs font-bold uppercase">Morosos</p>
                <p className="text-2xl font-black text-[#EDC525]">{estadisticasClub.montoMorosos}$</p>
                <p className="text-xs text-[#EDC525]">{estadisticasClub.cantidadMorosos} personas</p>
                </div>

                {/* Becas */}
                <div>
                <p className="text-white text-xs font-bold uppercase">Becas Otorgadas</p>
                <p className="text-2xl font-black text-white mt-1">{estadisticasClub.becasOtorgadas}</p>
                <p className="text-xs text-white">{estadisticasClub.porcentajeBecas}% del total</p>
                </div>
            </div>
            </div>
        </div>

        {/* SECCIÓN INFERIOR: DOS COLUMNAS CON SCROLL INDEPENDIENTE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* COLUMNA IZQUIERDA: MOVIMIENTOS RECIENTES */}
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-l p-5 shadow-lg flex flex-col">
                <h2 className="text-base font-bold text-lime-400 mb-4 flex items-center gap-2 border-b border-zinc-700/50 pb-2">
                    <ArrowUpRight size={18} />
                    Registro de Movimientos Recientes
                </h2>
                
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                    {movimientosRecientes.map((mov) => (
                        /* Contenedor externo que simula el borde neón verde lima con corte */
                        <div 
                            key={mov.id}
                            className="p-px bg-lime-500/30 hover:bg-lime-400 transition-colors duration-200"
                            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}
                        >
                            {/* Cuerpo interno de la tarjeta */}
                            <div 
                                className="p-4 bg-zinc-900/90 rounded-l flex items-center justify-between"
                                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}
                            >
                                <div>
                                    <p className={`text-sm font-bold ${mov.tipo === 'PAGO_RECIBIDO' ? 'text-lime-400' : 'text-rose-400'}`}>
                                        {mov.tipo === 'PAGO_RECIBIDO' ? 'Pago Recibido' : 'Nueva Incorporación'}
                                    </p>
                                    <p className="text-xs text-zinc-300 mt-0.5">{mov.detalle}</p>
                                </div>
                                <span className="text-lg font-black text-lime-400">
                                    +{mov.monto}$
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* COLUMNA DERECHA: OBJETIVOS ALTA PRIORIDAD / MOROSOS */}
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-l p-5 shadow-lg flex flex-col">
                <h2 className="text-base font-bold text-rose-400 mb-4 flex items-center gap-2 border-b border-zinc-700/50 pb-2">
                    <AlertTriangle size={18} />
                    Objetivos de alta prioridad: Morosos
                </h2>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                    {listaMorosos.map((moroso) => (
                        /* Contenedor externo que simula el borde neón fucsia con corte */
                        <div 
                            key={moroso.id}
                            className="p-px bg-[#ED254E]/30 hover:bg-[#ED254E] transition-colors duration-200"
                            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}
                        >
                            {/* Cuerpo interno de la tarjeta */}
                            <div 
                                className="p-3 bg-zinc-900/90 rounded-l flex items-center justify-between"
                                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}
                            >
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={moroso.avatar} 
                                        alt={moroso.nombre} 
                                        className="w-10 h-10 rounded-lg object-cover border border-zinc-700"
                                    />
                                    <div>
                                        <p className="text-sm font-bold text-zinc-100">{moroso.nombre}</p>
                                        <p className="text-xs text-zinc-400">{moroso.equipo}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20">
                                    {moroso.deuda}$
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
        </div>
    );
};