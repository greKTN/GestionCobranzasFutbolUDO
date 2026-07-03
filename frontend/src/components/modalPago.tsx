import {useState} from 'react';
import { CreditCard, Search, ChevronDown, X } from 'lucide-react';

export interface PagoProps {
    atleta: string;
    concepto: string;
    metodoPago: string;
    monto: number;
    referencia: string;
}

const estadoInicial: PagoProps = {
    atleta: '',
    concepto: 'Mensualidad Futbol',
    metodoPago: 'Transferencia',
    monto: 0,
    referencia: ''
}

export default function ModalPago({ abierto, cerrarModal }: { abierto: boolean; cerrarModal: () => void }) {
    const [datosPago, setDatosPago] = useState<PagoProps>(estadoInicial);

    //manejo de cambios en los datos del modal
    const manejoCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        //actualizacion de los campos del modal, garantizando que el monto se trabaje si o si como numero
        setDatosPago(prevDatos => ({
            ...prevDatos,
            // Si es el monto lo pasamos a número, si está vacío le ponemos 0. Lo demás pasa normal.
            [name]: name === 'monto' ? (value === '' ? 0 : Number(value)) : value
        }));
    };

    const manejarCierre = () => {
        setDatosPago(estadoInicial);
        cerrarModal();
    };

    //manejo de subida, mientras tanto se hace un alert pero luego hay que conectarlo a la DB
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(datosPago);
        alert('Pago Guardado y Reporte Generado Exitosamente');
        manejarCierre(); 
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300 p-4 ${abierto ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            
            <div className="bg-[#403B3E] border border-zinc-700/40 rounded p-5 sm:p-8 shadow-2xl w-full max-w-4xl relative max-h-[95vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
                
                {/* Botón X para cerrar */}
                <button onClick={manejarCierre} type="button" className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                {/* SUBHEADER */}
                <div className="mb-6 pb-5 border-b border-zinc-700/40 pr-8">
                    <div className="flex items-center gap-2.5 text-[#B1ED25] font-bold text-lg mb-1">
                        <CreditCard size={20} />
                        <h2>Registrar Pago</h2>
                    </div>
                    <p className="text-zinc-400 text-xs sm:text-sm">
                        Ingresa los detalles del ingreso para generar el comprobante oficial.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* MIEMBRO / ATLETA */}
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
                                name="atleta"
                                value={datosPago.atleta}
                                onChange={manejoCambio}
                                placeholder="Atleta por nombre o numero de ID"
                                className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-3 pl-10 pr-10 text-zinc-100 placeholder-zinc-500 text-sm font-medium outline-none transition-colors"
                                required
                            />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#B1ED25]">
                                <Search size={16} />
                            </span>
                        </div>
                    </div>

                    {/* CONCEPTO Y MÉTODO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-zinc-200 tracking-wide">
                                Concepto de pago
                            </label>
                            <div className="relative">
                                <select
                                    name="concepto"
                                    value={datosPago.concepto}
                                    onChange={manejoCambio}
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

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-zinc-200 tracking-wide">
                                Metodo de Pago
                            </label>
                            <div className="relative">
                                <select
                                    name="metodoPago"
                                    value={datosPago.metodoPago}
                                    onChange={manejoCambio}
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

                    {/* MONTO Y REFERENCIA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-zinc-200 tracking-wide">
                                Monto Total
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#B1ED25] font-bold text-sm">
                                    $
                                </span>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="monto"
                                    // Si el monto es 0, se muestra vacío para que no estorbe al empezar a escribir
                                    value={datosPago.monto == 0 ? '' : datosPago.monto}
                                    onChange={manejoCambio}
                                    className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-3 pl-8 pr-3 text-zinc-100 text-sm font-semibold tracking-wide outline-none transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-zinc-200 tracking-wide">
                                Numero de Referencia
                            </label>
                            <input
                                type="text"
                                name="referencia"
                                value={datosPago.referencia}
                                onChange={manejoCambio}
                                className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-3 px-3 text-zinc-100 text-sm font-mono tracking-wider outline-none transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* BOTÓN DE ACCIÓN */}
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
}