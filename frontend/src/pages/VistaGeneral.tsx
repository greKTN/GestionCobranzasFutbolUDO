import { UserPlus, CircleDollarSign, FileText, ChevronRight, TrendingUp, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ModalPago from '../components/modalPago';
import { useState, useEffect } from 'react';

export const VistaGeneral = () => {
    const navegar = useNavigate();
    const [modalPagoAbierto, setModalPagoAbierto] = useState<boolean>(false);
    const [cargando, setCargando] = useState(true);

    // Estados dinámicos conectados a la BD
    const [estadisticasClub, setEstadisticasClub] = useState({
        solidezFinanciera: 0, capacidadActual: 0, capacidadMaxima: 160,
        montoMorosos: 0, cantidadMorosos: 0, becasOtorgadas: 0, porcentajeBecas: 0
    });
    const [movimientosRecientes, setMovimientosRecientes] = useState<any[]>([]);
    const [listaMorosos, setListaMorosos] = useState<any[]>([]);

    useEffect(() => {
        const cargarDashboard = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/dashboard');
                if (response.ok) {
                    const data = await response.json();
                    setEstadisticasClub(data.estadisticasClub);
                    setListaMorosos(data.listaMorosos);
                    setMovimientosRecientes(data.movimientosRecientes);
                }
            } catch (error) {
                console.error("Error conectando con el backend:", error);
            } finally {
                setCargando(false);
            }
        };
        cargarDashboard();
    }, []);

    if (cargando) {
        return <div className="text-center text-zinc-400 mt-20 font-bold animate-pulse">Sincronizando con base de datos...</div>;
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto text-zinc-100 p-2">
            
            <div className="w-full bg-[#d4cece] text-zinc-900 py-3.5 px-6 shadow-md rounded-l border-b border-zinc-300/30 flex flex-col md:flex-row md:items-center md:justify-between gap-2 -mt-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-zinc-900">Vista General</h1>
                    <p className="text-zinc-700 text-xs font-semibold mt-0.5 flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                        Estadísticas en Tiempo Real
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center justify-between p-4 bg-[#d4cece] text-zinc-900 rounded-l shadow-md hover:bg-zinc-300 transition-all duration-200 group border border-zinc-300/30" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }} onClick={() => navegar('/jugadores')}>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-zinc-800 text-white rounded-l"><UserPlus size={20} /></div>
                        <div className="text-left">
                            <p className="font-bold text-base leading-tight">Registrar Jugador</p>
                            <p className="text-xs text-zinc-600">Nueva ficha técnica</p>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-zinc-500 group-hover:translate-x-1 transition-transform mr-1" />
                </button>

                <button onClick={() => setModalPagoAbierto(true)} className="flex items-center justify-between p-4 bg-[#d4cece] text-zinc-900 rounded-l shadow-md hover:bg-zinc-300 transition-all duration-200 group border border-zinc-300/30" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-zinc-800 text-white rounded-l"><CircleDollarSign size={20} /></div>
                        <div className="text-left">
                            <p className="font-bold text-base leading-tight">Registrar Pago</p>
                            <p className="text-xs text-zinc-600">Mensualidad o inscripción</p>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-zinc-500 group-hover:translate-x-1 transition-transform mr-1" />
                </button>

                <button className="flex items-center justify-between p-4 bg-[#d4cece] text-zinc-900 rounded-l shadow-md hover:bg-zinc-300 transition-all duration-200 group border border-zinc-300/30" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }} onClick={() => navegar('/reportes')}>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-zinc-800 text-white rounded-l"><FileText size={20} /></div>
                        <div className="text-left">
                            <p className="font-bold text-base leading-tight">Generar Reporte</p>
                            <p className="text-xs text-zinc-600">Financiero o Deportivo</p>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-zinc-500 group-hover:translate-x-1 transition-transform mr-1" />
                </button>
            </div>

            <div className="w-full bg-linear-to-r from-[#ED254E] via-[#EF3E61] to-[#F692A6] rounded-l shadow-xl p-6 relative overflow-hidden border border-rose-400/20" style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}>
                <div className="absolute -right-6 -bottom-6 text-white/5 pointer-events-none"><TrendingUp size={200} /></div>
                <p className="text-white/90 text-sm font-semibold uppercase tracking-wider flex items-center gap-2 mb-6 pl-4">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping"></span> Estadísticas del Club en tiempo real
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pl-4">
                    <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-white/20 pb-4 lg:pb-0">
                        <p className="text-white/80 font-bold text-xs uppercase tracking-widest">Solidez Financiera</p>
                        <p className="text-4xl md:text-5xl font-black text-white mt-1">${estadisticasClub.solidezFinanciera.toFixed(2)}</p>
                    </div>
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-black/15 p-4 rounded-l backdrop-blur-xs mr-4">
                        <div>
                            <p className="text-[#B1ED25] text-xs font-bold uppercase">Capacidad del equipo</p>
                            <p className="text-2xl font-black text-[#B1ED25]">{estadisticasClub.capacidadActual}<span className="text-sm font-normal text-white/60">/{estadisticasClub.capacidadMaxima}</span></p>
                            <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div className="bg-[#B1ED25] h-full rounded-full" style={{ width: `${(estadisticasClub.capacidadActual / estadisticasClub.capacidadMaxima) * 100}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <p className="text-[#EDC525] text-xs font-bold uppercase">Morosos</p>
                            <p className="text-2xl font-black text-[#EDC525]">${estadisticasClub.montoMorosos}</p>
                            <p className="text-xs text-[#EDC525]">{estadisticasClub.cantidadMorosos} personas</p>
                        </div>
                        <div>
                            <p className="text-white text-xs font-bold uppercase">Becas Otorgadas</p>
                            <p className="text-2xl font-black text-white mt-1">{estadisticasClub.becasOtorgadas}</p>
                            <p className="text-xs text-white">{estadisticasClub.porcentajeBecas}% del total</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-l p-5 shadow-lg flex flex-col">
                    <h2 className="text-base font-bold text-lime-400 mb-4 flex items-center gap-2 border-b border-zinc-700/50 pb-2">
                        <ArrowUpRight size={18} /> Registro de Pagos Recientes
                    </h2>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                        {movimientosRecientes.length > 0 ? movimientosRecientes.map((mov) => (
                            <div key={mov.id} className="p-px bg-lime-500/30 hover:bg-lime-400 transition-colors duration-200" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}>
                                <div className="p-4 bg-zinc-900/90 rounded-l flex items-center justify-between" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}>
                                    <div>
                                        <p className="text-sm font-bold text-lime-400">Pago Recibido</p>
                                        <p className="text-xs text-zinc-300 mt-0.5">{mov.detalle}</p>
                                    </div>
                                    <span className="text-lg font-black text-lime-400">+{mov.monto}$</span>
                                </div>
                            </div>
                        )) : <p className="text-zinc-500 text-sm text-center py-4">No hay pagos recientes</p>}
                    </div>
                </div>

                <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-l p-5 shadow-lg flex flex-col">
                    <h2 className="text-base font-bold text-rose-400 mb-4 flex items-center gap-2 border-b border-zinc-700/50 pb-2">
                        <AlertTriangle size={18} /> Objetivos de alta prioridad: Morosos
                    </h2>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                        {listaMorosos.length > 0 ? listaMorosos.map((moroso) => (
                            <div key={moroso.id} className="p-px bg-[#ED254E]/30 hover:bg-[#ED254E] transition-colors duration-200" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}>
                                <div className="p-3 bg-zinc-900/90 rounded-l flex items-center justify-between" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}>
                                    <div className="flex items-center gap-3">
                                        <img src={moroso.avatar} alt={moroso.nombre} className="w-10 h-10 rounded-lg object-cover border border-zinc-700" />
                                        <div>
                                            <p className="text-sm font-bold text-zinc-100">{moroso.nombre}</p>
                                            <p className="text-xs text-zinc-400">{moroso.equipo}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20">${moroso.deuda}</span>
                                </div>
                            </div>
                        )) : <p className="text-zinc-500 text-sm text-center py-4">¡Todos los jugadores están al día!</p>}
                    </div>
                </div>

            </div>
            
            <ModalPago abierto={modalPagoAbierto} cerrarModal={() => { setModalPagoAbierto(false); window.location.reload(); }} />

        </div>
    );
};