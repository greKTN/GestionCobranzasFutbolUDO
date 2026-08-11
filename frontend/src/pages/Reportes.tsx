import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, BarChart3, Clock, Search, ExternalLink } from 'lucide-react';

export const Reportes = () => {
    const [distribucion, setDistribucion] = useState<any[]>([]);
    const [transacciones, setTransacciones] = useState<any[]>([]);
    const [flujoData, setFlujoData] = useState<any[]>([]);
    const [filtroTexto, setFiltroTexto] = useState('');
    const [cargando, setCargando] = useState(true);

    // Mapeo de colores fijos para los métodos de pago
    const coloresMetodos: { [key: string]: string } = {
        'Transferencia': 'bg-[#B1ED25]',
        'Pago Móvil': 'bg-[#ED25B1]',
        'Efectivo': 'bg-cyan-400',
        'Zelle': 'bg-indigo-400'
    };

    useEffect(() => {
        const fetchReportes = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/pagos/analiticas');
                if (response.ok) {
                    const data = await response.json();
                    setDistribucion(data.distribucion);
                    setTransacciones(data.transacciones);
                    setFlujoData(data.flujo);
                }
            } catch (error) {
                console.error("Error trayendo analíticas:", error);
            } finally {
                setCargando(false);
            }
        };
        fetchReportes();
    }, []);

    // Filtro inteligente para las transacciones (Busca por jugador, referencia o método)
    const transaccionesFiltradas = useMemo(() => {
        if (!filtroTexto) return transacciones;
        const textoLimpio = filtroTexto.toLowerCase();
        
        return transacciones.filter(t => 
            (t.jugador && t.jugador.toLowerCase().includes(textoLimpio)) ||
            (t.referencia && t.referencia.toLowerCase().includes(textoLimpio)) ||
            (t.estado && t.estado.toLowerCase().includes(textoLimpio))
        );
    }, [transacciones, filtroTexto]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto text-zinc-100 p-2">
            
            <div className="w-full bg-[#C7C2C5] text-zinc-900 py-3.5 px-6 shadow-md border-b border-zinc-300/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 -mt-4">
                <div>
                    <h1 className="text-xl font-black tracking-tight text-zinc-900">Reportes Financieros</h1>
                    <p className="text-[#ED25B1] text-xs font-semibold mt-0.5 flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#ED25B1] animate-pulse"></span>
                        Sincronización en tiempo real
                    </p>
                </div>
            </div>

            {cargando ? (
                <div className="w-full py-20 text-center text-zinc-500 font-bold animate-pulse">
                    Cargando analíticas desde el servidor...
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        
                        {/* LOG DE FLUJO DE CAJA */}
                        <div className="xl:col-span-2 bg-[#403B3E] border border-zinc-700/40 rounded p-5 shadow-lg">
                            <h2 className="text-sm font-bold text-zinc-100 mb-6 flex items-center gap-2">
                                <TrendingUp size={18} className="text-[#B1ED25]" /> Ingresos Brutos por Mes (Estimado USD)
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs sm:text-sm">
                                    <thead>
                                        <tr className="text-zinc-500 border-b border-zinc-600/50">
                                            <th className="pb-3 text-left font-bold px-2">Periodo</th>
                                            <th className="pb-3 text-right font-bold px-2">Total Recaudado</th>
                                            <th className="pb-3 text-right font-bold px-2">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-700/30">
                                        {flujoData.length > 0 ? flujoData.map((row, i) => (
                                            <tr key={i} className="hover:bg-zinc-700/20 transition-colors">
                                                <td className="py-4 px-2 font-semibold text-zinc-200 capitalize">{row.mes}</td>
                                                <td className="py-4 px-2 text-right font-bold text-[#B1ED25]">${Number(row.brutos).toFixed(2)}</td>
                                                <td className="py-4 px-2 text-right text-zinc-500">Cerrado</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={3} className="text-center py-4 text-zinc-500">Sin datos registrados</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* DISTRIBUCIÓN DE PAGOS */}
                        <div className="bg-[#403B3E] border border-zinc-700/40 rounded p-5 shadow-lg">
                            <h2 className="text-sm font-bold text-zinc-100 mb-6 flex items-center gap-2">
                                <BarChart3 size={18} className="text-[#B1ED25]" /> Distribución de Pagos
                            </h2>
                            <div className="space-y-6">
                                {distribucion.length > 0 ? distribucion.map((item, i) => {
                                    const colorClase = coloresMetodos[item.metodo] || 'bg-zinc-400';
                                    return (
                                        <div key={i}>
                                            <div className="flex justify-between items-end mb-1.5">
                                                <span className="text-xs font-bold text-zinc-300">{item.metodo}</span>
                                                <span className="text-[10px] text-zinc-500 italic">Uso general</span>
                                            </div>
                                            <div className="w-full bg-zinc-900/50 h-1.5 rounded-full overflow-hidden">
                                                <div className={`${colorClase} h-full rounded-full`} style={{ width: `${item.pct}%` }}></div>
                                            </div>
                                            <p className="text-[10px] text-zinc-400 font-bold mt-1">{item.pct}%</p>
                                        </div>
                                    )
                                }) : (
                                    <p className="text-center text-xs text-zinc-500">Aún no hay pagos procesados</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* REGISTRO DE TRANSACCIONES CON FILTRO */}
                    <div className="bg-[#403B3E] border border-zinc-700/40 rounded p-5 shadow-lg">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-700/40">
                            <div>
                                <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                                    <Clock size={18} className="text-[#B1ED25]" /> Registro de Transacciones
                                </h2>
                                <p className="text-[10px] text-zinc-500 font-medium uppercase mt-1 tracking-widest">Auditoría en tiempo real</p>
                            </div>
                            
                            {/* Buscador de transacciones */}
                            <div className="relative w-full md:w-72">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                                    <Search size={14} />
                                </span>
                                <input
                                    type="text"
                                    value={filtroTexto}
                                    onChange={(e) => setFiltroTexto(e.target.value)}
                                    placeholder="Buscar jugador o referencia..."
                                    className="w-full bg-[#1e1d1f]/60 border border-zinc-600 focus:border-[#B1ED25] rounded py-2 pl-9 pr-3 text-zinc-100 text-xs outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-xs sm:text-sm">
                                <thead>
                                    <tr className="text-zinc-400 border-b border-zinc-600/50 uppercase tracking-wider text-[10px]">
                                        <th className="pb-3 text-left font-bold px-2">Fecha y Ref</th>
                                        <th className="pb-3 text-left font-bold px-2">Jugador Destino</th>
                                        <th className="pb-3 text-left font-bold px-2">Método</th>
                                        <th className="pb-3 text-right font-bold px-2">Monto</th>
                                        <th className="pb-3 text-center font-bold px-2">Estado</th>
                                        <th className="pb-3 text-center font-bold px-2">Soporte</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-700/30">
                                    {transaccionesFiltradas.length > 0 ? transaccionesFiltradas.map((t, i) => (
                                        <tr key={i} className="hover:bg-zinc-700/20 transition-colors">
                                            <td className="py-3 px-2">
                                                <p className="text-zinc-200 font-bold">{t.fecha}</p>
                                                <p className="text-[10px] text-zinc-500 font-mono">Ref: {t.referencia}</p>
                                            </td>
                                            <td className="py-3 px-2 font-bold text-[#B1ED25]">{t.jugador || 'Desconocido'}</td>
                                            <td className="py-3 px-2 text-zinc-300">{t.metodo}</td>
                                            <td className="py-3 px-2 text-right font-bold text-zinc-100">
                                                {t.monto} <span className="text-[10px] text-zinc-500">{t.moneda}</span>
                                            </td>
                                            <td className="py-3 px-2 text-center">
                                                <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold ${
                                                    t.estado === 'En revisión' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
                                                    t.estado === 'Aprobado' ? 'bg-lime-500/20 text-lime-400 border border-lime-500/30' : 
                                                    'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30'
                                                }`}>
                                                    {t.estado}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 text-center">
                                                {t.comprobante_url ? (
                                                    <a href={t.comprobante_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors text-[10px] font-bold uppercase tracking-wider">
                                                        <ExternalLink size={12} /> Ver
                                                    </a>
                                                ) : (
                                                    <span className="text-[10px] text-zinc-600 font-bold">N/A</span>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={6} className="text-center py-8 text-zinc-500">No se encontraron transacciones.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};