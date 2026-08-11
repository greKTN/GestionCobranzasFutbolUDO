import { useState, useRef } from 'react';
import { CreditCard, Search, ChevronDown, X, UploadCloud } from 'lucide-react';

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

export default function ModalPago({ abierto, cerrarModal }: { abierto: boolean; cerrarModal: () => void }) {
    const [datosPago, setDatosPago] = useState<PagoProps>(estadoInicial);
    const [archivoLocal, setArchivoLocal] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const manejoCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDatosPago(prev => ({ ...prev, [name]: value }));
    };

    const manejoArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setArchivoLocal(e.target.files[0]);
        }
    };

    const manejarCierre = () => {
        setDatosPago(estadoInicial);
        setArchivoLocal(null);
        cerrarModal();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Empaquetacion de todo en FormData porque tiene un archivo
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
                // no se le coloca 'Content-Type': 'application/json' porque el formData ya lo integra
                body: form
            });

            if (response.ok) {
                alert('¡Pago y comprobante registrados exitosamente en Supabase!');
                manejarCierre(); 
            } else {
                alert('Error al registrar el pago en el servidor.');
            }
        } catch (error) {
            console.error("Error en petición:", error);
            alert('Fallo de conexión con el backend.');
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 p-4 ${abierto ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="bg-[#403B3E] border border-zinc-700/40 rounded p-5 sm:p-8 shadow-2xl w-full max-w-4xl relative max-h-[95vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
                
                <button onClick={manejarCierre} type="button" className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>

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
                    
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-zinc-200 tracking-wide">Miembro/Atleta</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400"><Search size={18} /></span>
                            <input type="text" name="atleta" value={datosPago.atleta} onChange={manejoCambio} placeholder="Nombre del atleta registrado" className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-3 pl-10 pr-10 text-zinc-100 placeholder-zinc-500 text-sm font-medium outline-none transition-colors" required />
                        </div>
                    </div>

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
}