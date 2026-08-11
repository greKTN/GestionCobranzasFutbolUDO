import { useState, useRef, useEffect } from 'react';
import { CreditCard, Search, ChevronDown, UploadCloud } from 'lucide-react';

export interface PagoProps {
    atleta: string;
    concepto: string;
    metodoPago: string;
    moneda: string;
    monto: number | string;
    referencia: string;
}

const estadoInicial: PagoProps = {
    atleta: '',
    concepto: 'Mensualidad Futbol',
    metodoPago: 'Transferencia',
    moneda: 'USD',
    monto: '',
    referencia: ''
}

export const RegistroPagos = () => {
    const [datosPago, setDatosPago] = useState<PagoProps>(estadoInicial);
    const [archivoLocal, setArchivoLocal] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [jugadoresDB, setJugadoresDB] = useState<any[]>([]);
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

    // Traemos los jugadores de la base de datos al abrir la página
    useEffect(() => {
        const fetchJugadores = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/jugadores');
                if (response.ok) {
                    const data = await response.json();
                    setJugadoresDB(data);
                }
            } catch (error) {
                console.error("Error trayendo jugadores para el buscador:", error);
            }
        };
        fetchJugadores();
    }, []);

    // Filtramos la lista de jugadores en tiempo real basada en lo que escribe el usuario
    const jugadoresFiltrados = datosPago.atleta === '' 
        ? jugadoresDB 
        : jugadoresDB.filter(jugador => 
            jugador.name.toLowerCase().includes(datosPago.atleta.toLowerCase())
          );

    const manejoCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDatosPago(prev => ({ ...prev, [name]: value }));
        
        // Si el usuario escribe en el campo del atleta, mostramos la lista
        if (name === 'atleta') {
            setMostrarSugerencias(true);
        }
    };

    // Función para cuando se le da clic a un jugador de la lista
    const seleccionarJugador = (nombreJugador: string) => {
        setDatosPago(prev => ({ ...prev, atleta: nombreJugador }));
        setMostrarSugerencias(false); // Ocultamos la lista
    };

    const manejoArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setArchivoLocal(e.target.files[0]);
        }
    };

    const limpiarFormulario = () => {
        setDatosPago(estadoInicial);
        setArchivoLocal(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = new FormData();
        form.append('atleta', datosPago.atleta);
        form.append('concepto', datosPago.concepto);
        form.append('metodoPago', datosPago.metodoPago);
        form.append('moneda', datosPago.moneda);
        form.append('monto', String(datosPago.monto));
        form.append('referencia', datosPago.referencia);
        
        if (archivoLocal) {
            form.append('comprobante', archivoLocal);
        }

        try {
            const response = await fetch('http://localhost:5000/api/pagos', {
                method: 'POST',
                body: form
            });

            if (response.ok) {
                alert('¡Pago y comprobante registrados exitosamente en Supabase!');
                limpiarFormulario(); 
            } else {
                alert('Error al registrar el pago en el servidor.');
            }
        } catch (error) {
            console.error("Error en petición:", error);
            alert('Fallo de conexión con el backend.');
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto text-zinc-100 p-2">
            
            {/* HEADER UNIFICADO */}
            <div className="w-full bg-[#C7C2C5] text-zinc-900 py-3.5 px-6 shadow-md border-b border-zinc-300/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 -mt-4">
                <div>
                    <h1 className="text-xl font-black tracking-tight text-zinc-900">Registro de Pagos</h1>
                    <p className="text-zinc-900 text-xs font-semibold mt-0.5 flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                        Mayo 2026 - Temporada actual
                    </p>
                </div>
            </div>

            {/* CONTENEDOR PRINCIPAL DEL FORMULARIO */}
            <div className="bg-[#403B3E] border border-zinc-700/40 rounded p-5 sm:p-8 shadow-lg max-w-4xl mx-auto">
                
                <div className="mb-6 pb-5 border-b border-zinc-700/40 pr-8">
                    <div className="flex items-center gap-2.5 text-[#B1ED25] font-bold text-lg mb-1">
                        <CreditCard size={20} />
                        <h2>Registrar Pago</h2>
                    </div>
                    <p className="text-zinc-400 text-xs sm:text-sm">
                        Ingresa los detalles, la moneda y el comprobante para generar el registro oficial.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* CAMPO BUSCADOR DE ATLETA CON AUTOCOMPLETADO */}
                    <div className="space-y-2 relative">
                        <label className="block text-sm font-bold text-zinc-200 tracking-wide">
                            Miembro/Atleta
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                                <Search size={18} />
                            </span>
                            <input
                                type="text"
                                name="atleta"
                                value={datosPago.atleta}
                                onChange={manejoCambio}
                                onFocus={() => setMostrarSugerencias(true)}
                                // Usamos un setTimeout en el onBlur para dar tiempo a que el onClick de la lista se ejecute antes de desaparecer
                                onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
                                placeholder="Escribe para buscar un atleta..."
                                className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-3 pl-10 pr-10 text-zinc-100 placeholder-zinc-500 text-sm font-medium outline-none transition-colors"
                                required
                                autoComplete="off" // Apagamos el autocompletado nativo del navegador
                            />
                        </div>

                        {/* LISTA DESPLEGABLE (SUGERENCIAS) */}
                        {mostrarSugerencias && (
                            <ul className="absolute z-50 w-full bg-[#2d2a2c] border border-zinc-600 mt-1 max-h-48 overflow-y-auto shadow-2xl rounded-b-md">
                                {jugadoresFiltrados.length > 0 ? (
                                    jugadoresFiltrados.map((jugador) => (
                                        <li 
                                            key={jugador.id}
                                            onClick={() => seleccionarJugador(jugador.name)}
                                            className="px-4 py-3 hover:bg-zinc-700 cursor-pointer text-sm text-zinc-200 border-b border-zinc-700/50 last:border-0 flex justify-between items-center transition-colors"
                                        >
                                            <span className="font-bold">{jugador.name}</span>
                                            <span className="text-xs text-[#B1ED25] font-semibold">{jugador.categoria}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-4 py-3 text-sm text-zinc-500 italic text-center">
                                        No se encontraron coincidencias...
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>

                    {/* CONCEPTO Y MÉTODO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-zinc-200 tracking-wide">Concepto</label>
                            <div className="relative">
                                <select name="concepto" value={datosPago.concepto} onChange={manejoCambio} className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-3 px-3 text-zinc-100 text-sm font-medium outline-none transition-colors appearance-none cursor-pointer">
                                    <option value="Mensualidad Futbol">Mensualidad Futbol</option>
                                    <option value="Inscripción">Inscripción</option>
                                    <option value="Uniforme">Uniforme</option>
                                    <option value="Torneo">Torneo</option>
                                </select>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-400"><ChevronDown size={16} /></span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-zinc-200 tracking-wide">Método de Pago</label>
                            <div className="relative">
                                <select name="metodoPago" value={datosPago.metodoPago} onChange={manejoCambio} className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-3 px-3 text-zinc-100 text-sm font-medium outline-none transition-colors appearance-none cursor-pointer">
                                    <option value="Transferencia">Transferencia</option>
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Pago Móvil">Pago Móvil</option>
                                    <option value="Zelle">Zelle</option>
                                </select>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-400"><ChevronDown size={16} /></span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-zinc-200 tracking-wide">Moneda</label>
                            <div className="relative">
                                <select name="moneda" value={datosPago.moneda} onChange={manejoCambio} className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-3 px-3 text-zinc-100 text-sm font-medium outline-none transition-colors appearance-none cursor-pointer">
                                    <option value="USD">Dólares (USD)</option>
                                    <option value="Bs">Bolívares (Bs)</option>
                                </select>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-400"><ChevronDown size={16} /></span>
                            </div>
                            {datosPago.moneda === 'USD' && (
                                <p className="text-[10px] text-cyan-400 font-bold mt-1 tracking-wider">TASA AUTOMÁTICA: 762 Bs</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-zinc-200 tracking-wide">Monto</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#B1ED25] font-bold text-sm">
                                    {datosPago.moneda === 'USD' ? '$' : 'Bs'}
                                </span>
                                <input type="number" step="0.01" name="monto" value={datosPago.monto} onChange={manejoCambio} className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-3 pl-8 pr-3 text-zinc-100 text-sm font-semibold tracking-wide outline-none transition-colors" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-zinc-200 tracking-wide">Referencia</label>
                            <input type="text" name="referencia" value={datosPago.referencia} onChange={manejoCambio} className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-3 px-3 text-zinc-100 text-sm font-mono tracking-wider outline-none transition-colors" required />
                        </div>
                    </div>

                    {/* SUBIDA DE COMPROBANTE */}
                    <div className="space-y-2 pt-2 border-t border-zinc-700/40">
                        <label className="block text-sm font-bold text-zinc-200 tracking-wide">Comprobante de Pago</label>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${archivoLocal ? 'border-[#B1ED25] bg-[#B1ED25]/10' : 'border-zinc-600 hover:border-zinc-500 bg-[#1e1d1f]/40'}`}
                        >
                            <input type="file" ref={fileInputRef} onChange={manejoArchivo} className="hidden" accept="image/*,.pdf" />
                            <UploadCloud size={32} className={archivoLocal ? 'text-[#B1ED25] mb-2' : 'text-zinc-500 mb-2'} />
                            {archivoLocal ? (
                                <p className="text-sm font-bold text-[#B1ED25]">{archivoLocal.name}</p>
                            ) : (
                                <>
                                    <p className="text-sm font-bold text-zinc-300">Haz clic para subir el comprobante</p>
                                    <p className="text-xs text-zinc-500 mt-1">Soporta JPG, PNG o PDF</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center pt-4">
                        <button type="submit" className="w-full sm:w-auto px-10 py-3 bg-[#B1ED25] text-zinc-900 text-xs sm:text-sm font-black hover:bg-lime-400 shadow-md transition-all uppercase tracking-wider" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}>
                            Subir y Registrar Pago
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};