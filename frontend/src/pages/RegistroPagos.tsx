import { useState } from 'react';
import { CreditCard, Search, ChevronDown } from 'lucide-react';

export const RegistroPagos = () => {
    // ESTADOS DEL FORMULARIO
    const [busquedaAtleta, setBusquedaAtleta] = useState('');
    const [concepto, setConcepto] = useState('Mensualidad Futbol');
    const [metodoPago, setMetodoPago] = useState('Transferencia');
    const [monto, setMonto] = useState('0.00');
    const [referencia, setReferencia] = useState('TNX-99203');

    // Manejo del envío del formulario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ busquedaAtleta, concepto, metodoPago, monto, referencia });
        alert('Pago Guardado y Reporte Generado Exitosamente');
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto text-zinc-100 p-2">
            
            {/* HEADER UNIFICADO (Estilo exacto al mockup) */}
            <div className="w-full bg-[#C7C2C5] text-zinc-900 py-3.5 px-6 shadow-md border-b border-zinc-300/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 -mt-4">
                <div>
                    <h1 className="text-xl font-black tracking-tight text-zinc-900">Registro de Pagos</h1>
                    <p className="text-zinc-900 text-xs font-semibold mt-0.5 flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-rose-600  animate-pulse"></span>
                        Mayo 2026 - Temporada actual
                    </p>
                </div>
            </div>

            {/* CONTENEDOR PRINCIPAL DEL FORMULARIO */}
            <div className="bg-[#403B3E] border border-zinc-700/40 rounded p-5 sm:p-8 shadow-lg max-w-4xl mx-auto">
                
                {/* SUBHEADER: REGISTRAR PAGO */}
                <div className="mb-6 pb-5 border-b border-zinc-700/40">
                    <div className="flex items-center gap-2.5 text-[#B1ED25] font-bold text-lg mb-1">
                        <CreditCard size={20} />
                        <h2>Registrar Pago</h2>
                    </div>
                    <p className="text-zinc-400 text-xs sm:text-sm">
                        Ingresa los detalles del ingreso para generar el comprobante oficial.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* CAMPO 1: MIEMBRO / ATLETA (Ocupa todo el ancho) */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-zinc-200 tracking-wide">
                            Miembro/Atleta
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                                <Search size={18} />
                            </span>
                            <input
                                type="text"
                                value={busquedaAtleta}
                                onChange={(e) => setBusquedaAtleta(e.target.value)}
                                placeholder="Atleta por nombre o numero de ID"
                                className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-3 pl-10 pr-10 text-zinc-100 placeholder-zinc-500 text-sm font-medium outline-none transition-colors"
                            />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#B1ED25]">
                                <Search size={16} />
                            </span>
                        </div>
                    </div>

                    {/* FILA DE DOS COLUMNAS: CONCEPTO Y MÉTODO (Se apila en móvil) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Concepto de Pago */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-zinc-200 tracking-wide">
                                Concepto de pago
                            </label>
                            <div className="relative">
                                <select
                                    value={concepto}
                                    onChange={(e) => setConcepto(e.target.value)}
                                    className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-3 px-3 text-zinc-100 text-sm font-medium outline-none transition-colors appearance-none cursor-pointer"
                                >
                                    <option value="Mensualidad Futbol">Mensualidad Futbol</option>
                                    <option value="Inscripción">Inscripción</option>
                                    <option value="Uniforme">Uniforme</option>
                                    <option value="Torneo">Torneo</option>
                                </select>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-400">
                                    <ChevronDown size={16} />
                                </span>
                            </div>
                        </div>

                        {/* Método de Pago */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-zinc-200 tracking-wide">
                                Metodo de Pago
                            </label>
                            <div className="relative">
                                <select
                                    value={metodoPago}
                                    onChange={(e) => setMetodoPago(e.target.value)}
                                    className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-3 px-3 text-zinc-100 text-sm font-medium outline-none transition-colors appearance-none cursor-pointer"
                                >
                                    <option value="Transferencia">Transferencia</option>
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Pago Móvil">Pago Móvil</option>
                                    <option value="Zelle">Zelle</option>
                                </select>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-400">
                                    <ChevronDown size={16} />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* FILA DE DOS COLUMNAS: MONTO Y REFERENCIA (Se apila en móvil) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Monto Total */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-zinc-200 tracking-wide">
                                Monto Total
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#B1ED25] font-bold text-sm">
                                    $
                                </span>
                                <input
                                    type="text"
                                    value={monto}
                                    onChange={(e) => setMonto(e.target.value)}
                                    className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-3 pl-8 pr-3 text-zinc-100 text-sm font-semibold tracking-wide outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Número de Referencia */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-zinc-200 tracking-wide">
                                Numero de Referencia
                            </label>
                            <input
                                type="text"
                                value={referencia}
                                onChange={(e) => setReferencia(e.target.value)}
                                className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-3 px-3 text-zinc-100 text-sm font-mono tracking-wider outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* BOTÓN DE ACCIÓN CENTRALIZADO */}
                    <div className="flex justify-center pt-4">
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-10 py-3 bg-[#B1ED25] text-zinc-900 text-xs sm:text-sm font-black hover:bg-lime-400 shadow-md transition-all uppercase tracking-wider"
                            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}
                        >
                            Guardar y Generar Reporte
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};