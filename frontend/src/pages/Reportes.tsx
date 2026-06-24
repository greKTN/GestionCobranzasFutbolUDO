import { TrendingUp, BarChart3, Clock } from 'lucide-react';

export const Reportes = () => {
    // Datos de ejemplo para el flujo
    const flujoData = [
        { mes: 'Junio', brutos: '$680.20', gastos: '$220.10', neto: '$460.10', variacion: '+4.2%' },
        { mes: 'Mayo', brutos: '$650.44', gastos: '$240.80', neto: '$409.64', variacion: '+2.2%' },
        { mes: 'Abril', brutos: '$640.50', gastos: '$250.60', neto: '$389.90', variacion: '-2.1%' },
        { mes: 'Marzo', brutos: '$680.60', gastos: '$230.10', neto: '$450.50', variacion: '+15.8%' },
        { mes: 'Febrero', brutos: '$670.90', gastos: '$238.50', neto: '$432.40', variacion: '+1.5%' },
        { mes: 'Enero', brutos: '$690.00', gastos: '$241.20', neto: '$448.20', variacion: '+8.0%' },
    ];

    const distribucion = [
        { metodo: 'Transferencia', pct: 55, color: 'bg-[#B1ED25]' },
        { metodo: 'Pago Movil', pct: 10, color: 'bg-[#ED25B1]' },
        { metodo: 'Tarjeta', pct: 15, color: 'bg-indigo-400' },
        { metodo: 'Efectivo', pct: 10, color: 'bg-cyan-400' },
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto text-zinc-100 p-2">
            
            {/* HEADER UNIFICADO */}
            <div className="w-full bg-[#C7C2C5] text-zinc-900 py-3.5 px-6 shadow-md border-b border-zinc-300/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 -mt-4">
                <div>
                    <h1 className="text-xl font-black tracking-tight text-zinc-900">Reportes</h1>
                    <p className="text-[#ED25B1] text-xs font-semibold mt-0.5 flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#ED25B1] animate-pulse"></span>
                        Mayo 2026 - Temporada actual
                    </p>
                </div>
            </div>

            {/* GRID PRINCIPAL: Tabla + Distribución */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* LOG DE FLUJO DE CAJA (Ocupa 2/3 en escritorio) */}
                <div className="xl:col-span-2 bg-[#403B3E] border border-zinc-700/40 rounded p-5 shadow-lg">
                    <h2 className="text-sm font-bold text-zinc-100 mb-6 flex items-center gap-2">
                        <TrendingUp size={18} className="text-[#B1ED25]" /> Log de Flujo de Caja Mensual
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs sm:text-sm">
                            <thead>
                                <tr className="text-zinc-500 border-b border-zinc-600/50">
                                    <th className="pb-3 text-left font-bold px-2">Periodo</th>
                                    <th className="pb-3 text-right font-bold px-2">Ingresos</th>
                                    <th className="pb-3 text-right font-bold px-2">Gastos</th>
                                    <th className="pb-3 text-right font-bold px-2">Balance</th>
                                    <th className="pb-3 text-right font-bold px-2">Var.</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-700/30">
                                {flujoData.map((row, i) => (
                                    <tr key={i} className="hover:bg-zinc-700/20 transition-colors">
                                        <td className="py-4 px-2 font-semibold text-zinc-200">{row.mes}</td>
                                        <td className="py-4 px-2 text-right">{row.brutos}</td>
                                        <td className="py-4 px-2 text-right text-rose-400">{row.gastos}</td>
                                        <td className="py-4 px-2 text-right font-bold">{row.neto}</td>
                                        <td className={`py-4 px-2 text-right font-mono font-bold ${row.variacion.startsWith('+') ? 'text-[#B1ED25]' : 'text-rose-500'}`}>
                                            {row.variacion}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* DISTRIBUCIÓN DE PAGOS (Panel Lateral) */}
                <div className="bg-[#403B3E] border border-zinc-700/40 rounded p-5 shadow-lg">
                    <h2 className="text-sm font-bold text-zinc-100 mb-6 flex items-center gap-2">
                        <BarChart3 size={18} className="text-[#B1ED25]" /> Distribución de Pagos
                    </h2>
                    <div className="space-y-6">
                        {distribucion.map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-end mb-1.5">
                                    <span className="text-xs font-bold text-zinc-300">{item.metodo}</span>
                                    <span className="text-[10px] text-zinc-500 italic">Valor Estimado</span>
                                </div>
                                <div className="w-full bg-zinc-900/50 h-1.5 rounded-full overflow-hidden">
                                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }}></div>
                                </div>
                                <p className="text-[10px] text-zinc-400 font-bold mt-1">{item.pct}%</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* REGISTRO DE TRANSACCIONES */}
            <div className="bg-[#403B3E] border border-zinc-700/40 rounded p-5 shadow-lg">
                <h2 className="text-sm font-bold text-zinc-100 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-[#B1ED25]" /> Registro de Transacciones
                </h2>
                <p className="text-[10px] text-zinc-500 font-medium uppercase mb-4 tracking-widest">Base de datos financiera en tiempo real</p>
                <div className="w-full border-t border-zinc-700/40 py-20 text-center text-zinc-600 text-xs italic">
                    Esperando sincronización de registros...
                </div>
            </div>

        </div>
    );
};