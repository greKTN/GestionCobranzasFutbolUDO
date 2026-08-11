import { useState, useEffect } from 'react';
import { UserPlus, X, Edit2 } from 'lucide-react';

export interface DatosRegistro {
    id?: string;
    nombre: string;
    fecha_nacimiento: string; 
    posicion: string;         
    categoria: string;        
    id_categoria: number;
    telefono_jugador: string;
    peso: string | number;
    estatura: string | number;
    genero: string;
    beca: string;
    rep_nombre: string;
    rep_cedula: string;
    rep_telefono: string;
    rep_email: string;        
}

const estadoInicial: DatosRegistro = {
    nombre: '',
    fecha_nacimiento: '',
    posicion: 'Delantero',
    categoria: '',
    id_categoria: 1,
    telefono_jugador: '',
    peso: '',
    estatura: '',
    genero: 'Derecho',
    beca: 'Sin Beca',
    rep_nombre: '',
    rep_cedula: '',
    rep_telefono: '',
    rep_email: ''
};

interface ModalRegistroProps {
    abierto: boolean;
    cerrarModal: () => void;
    jugadorAEditar?: any; 
    recargarJugadores?: () => void;
}

export default function ModalRegistro({ abierto, cerrarModal, jugadorAEditar, recargarJugadores }: ModalRegistroProps) {
    const [datos, setDatos] = useState<DatosRegistro>(estadoInicial);
    const [edadCalculada, setEdadCalculada] = useState<number | null>(null);
    const esModoEdicion = !!jugadorAEditar;

    // Función pura para calcular la edad
    const calcularEdad = (fecha: string) => {
        const hoy = new Date();
        const cumple = new Date(fecha);
        let edad = hoy.getFullYear() - cumple.getFullYear();
        const m = hoy.getMonth() - cumple.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
            edad--;
        }
        return edad;
    };

    // Función DRY para asignar las categorías
    const obtenerCategoriaPorEdad = (edad: number) => {
        if (edad <= 5) return { categoria: 'Querubines', id_categoria: 4 };
        if (edad <= 7) return { categoria: 'Prebenjamin', id_categoria: 5 };
        if (edad <= 9) return { categoria: 'Benjamin', id_categoria: 6 };
        if (edad <= 11) return { categoria: 'Alevin', id_categoria: 7 };
        if (edad <= 13) return { categoria: 'Infantil', id_categoria: 8 };
        if (edad <= 15) return { categoria: 'Sub-15', id_categoria: 1 };
        if (edad <= 16) return { categoria: 'Sub-16', id_categoria: 9 };
        if (edad <= 18) return { categoria: 'Sub-18', id_categoria: 2 };
        return { categoria: 'Primer Equipo', id_categoria: 3 };
    };

    //Efecto para cargar los datos si estamos en modo edición
    useEffect(() => {
        if (jugadorAEditar && abierto) {
            let fechaFormateada = '';
            let categoriaInicial = jugadorAEditar.categoria || '';
            let idCategoriaInicial = 1; // Valor de fallback

            //Si trae fecha, la formateamos y se calcula la categoría a la que pertenece
            if (jugadorAEditar.nacimiento) {
                const [dia, mes, anio] = jugadorAEditar.nacimiento.split('/');
                fechaFormateada = `${anio}-${mes}-${dia}`;
                
                const edad = calcularEdad(fechaFormateada);
                setEdadCalculada(edad);
                
                const asignacion = obtenerCategoriaPorEdad(edad);
                categoriaInicial = asignacion.categoria;
                idCategoriaInicial = asignacion.id_categoria;
            }

            const pesoLimpio = (jugadorAEditar.peso && jugadorAEditar.peso !== '0 kg') ? jugadorAEditar.peso.replace(' kg', '').trim() : '';
            const alturaLimpia = (jugadorAEditar.altura && jugadorAEditar.altura !== '0 m') ? jugadorAEditar.altura.replace(' m', '').trim() : '';

            setDatos({
                id: jugadorAEditar.id,
                nombre: jugadorAEditar.name || '',
                fecha_nacimiento: fechaFormateada,
                posicion: jugadorAEditar.position || 'Delantero',
                categoria: categoriaInicial,       
                id_categoria: idCategoriaInicial,
                telefono_jugador: jugadorAEditar.telefono_jugador || '',
                peso: pesoLimpio,
                estatura: alturaLimpia,
                genero: jugadorAEditar.pierna || 'Derecho',
                beca: jugadorAEditar.beca || 'Sin Beca',
                rep_nombre: jugadorAEditar.representativeName || '',
                rep_cedula: '', 
                rep_telefono: jugadorAEditar.representativePhone || '',
                rep_email: ''   
            });
        } else {
            setDatos(estadoInicial);
            setEdadCalculada(null);
        }
    }, [jugadorAEditar, abierto]);

    const manejoCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setDatos(prevDatos => {
            const nuevosDatos = { ...prevDatos };

            if (name === 'rep_telefono' || name === 'telefono_jugador') {
                const numerico = value.replace(/\D/g, '');
                const truncado = numerico.slice(0, 11);
                if (truncado.length > 4) {
                    nuevosDatos[name] = `${truncado.slice(0, 4)}-${truncado.slice(4)}`;
                } else {
                    nuevosDatos[name] = truncado;
                }
            } 
            else if (name === 'rep_cedula') {
                const numerico = value.replace(/\D/g, '');
                const truncado = numerico.slice(0, 8);
                if (truncado.length > 0) {
                    nuevosDatos.rep_cedula = `V-${truncado}`;
                } else {
                    nuevosDatos.rep_cedula = '';
                }
            } 
            else if (name === 'fecha_nacimiento') {
                nuevosDatos.fecha_nacimiento = value;
                if (value) {
                    const edadActual = calcularEdad(value);
                    setEdadCalculada(edadActual);
                    
                
                    const asignacion = obtenerCategoriaPorEdad(edadActual);
                    nuevosDatos.categoria = asignacion.categoria;
                    nuevosDatos.id_categoria = asignacion.id_categoria;
                } else {
                    setEdadCalculada(null);
                    nuevosDatos.categoria = '';
                }
            } 
            else {
                nuevosDatos[name as keyof DatosRegistro] = value as never;
            }
            return nuevosDatos;
        });
    };

    const manejarCierre = () => {
        setDatos(estadoInicial);
        setEdadCalculada(null);
        cerrarModal();
    };

    const enviarDatos = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!esModoEdicion && datos.rep_cedula.length < 9) {
            alert("La cédula del representante debe tener al menos 7 dígitos numéricos.");
            return;
        }

        const datosFinales = { ...datos };
        if (!datosFinales.telefono_jugador || datosFinales.telefono_jugador.trim() === '') {
            datosFinales.telefono_jugador = datosFinales.rep_telefono;
        }

        const url = esModoEdicion 
            ? `http://localhost:5000/api/jugadores/${datos.id}` 
            : 'http://localhost:5000/api/jugadores';
            
        const method = esModoEdicion ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosFinales) 
            });

            if (response.ok) {
                alert(`¡Jugador ${esModoEdicion ? 'actualizado' : 'registrado'} correctamente!`);
                if (recargarJugadores) recargarJugadores();
                manejarCierre(); 
            } else {
                alert('Hubo un problema al guardar el registro en el servidor.');
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            alert('Error de conexión con el backend.');
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 p-4 ${abierto ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="bg-[#403B3E] border border-zinc-700/40 rounded p-5 sm:p-8 shadow-2xl w-full max-w-4xl relative max-h-[95vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 text-zinc-100">
                
                <button onClick={manejarCierre} type="button" className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                <div className="mb-6 pb-5 border-b border-zinc-700/40 pr-8">
                    <div className="flex items-center gap-2.5 text-[#B1ED25] font-bold text-lg mb-1">
                        {esModoEdicion ? <Edit2 size={20} /> : <UserPlus size={20} />}
                        <h2>{esModoEdicion ? 'Editar Jugador' : 'Registrar Jugador'}</h2>
                    </div>
                    <p className="text-zinc-400 text-xs sm:text-sm">
                        {esModoEdicion ? 'Actualiza los datos técnicos y personales del jugador.' : 'Ingresa los datos para una nueva ficha técnica.'}
                    </p>
                </div>
                
                <form onSubmit={enviarDatos} className="space-y-6">
                    {/* SECCIÓN JUGADOR */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-zinc-300 tracking-wider uppercase border-l-2 border-[#B1ED25] pl-2">Datos del Jugador</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-zinc-400 uppercase">Nombre Completo</label>
                                <input type="text" name="nombre" value={datos.nombre} onChange={manejoCambio} className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-2 px-3 text-zinc-100 text-sm outline-none transition-colors" required />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-zinc-400 uppercase">Teléfono del Jugador (Opcional)</label>
                                <input type="text" name="telefono_jugador" value={datos.telefono_jugador} onChange={manejoCambio} className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-2 px-3 text-zinc-100 text-sm outline-none transition-colors" placeholder="0414-1234567" />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-zinc-400 uppercase">Posición</label>
                                <select name="posicion" value={datos.posicion} onChange={manejoCambio} className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-2 px-3 text-zinc-100 text-sm outline-none transition-colors cursor-pointer appearance-none">
                                    <option value="Portero">Portero</option>
                                    <option value="Defensa">Defensa</option>
                                    <option value="Mediocampista">Mediocampista</option>
                                    <option value="Delantero">Delantero</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-zinc-400 uppercase">Fecha de Nacimiento</label>
                                <input type="date" name="fecha_nacimiento" value={datos.fecha_nacimiento} onChange={manejoCambio} className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-2 px-3 text-zinc-100 text-sm outline-none transition-colors [color-scheme:dark]" required />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-xs font-bold text-zinc-400 uppercase">Categoría Asignada</label>
                                <input type="text" name="categoria" value={datos.categoria} readOnly className="w-full bg-zinc-900/50 border-b-2 border-zinc-700 py-2 px-3 text-[#B1ED25] font-bold text-sm outline-none cursor-not-allowed" placeholder="Calculada automáticamente..." />
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN DATOS FÍSICOS Y DEPORTIVOS */}
                    <div className="space-y-4 pt-4 border-t border-zinc-700/40">
                        <h3 className="text-sm font-bold text-zinc-300 tracking-wider uppercase border-l-2 border-cyan-400 pl-2">Datos Físicos y Contrato</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-zinc-400 uppercase">Estatura (m)</label>
                                <input type="number" step="0.01" name="estatura" value={datos.estatura} onChange={manejoCambio} className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-2 px-3 text-zinc-100 text-sm outline-none transition-colors" placeholder="1.75" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-zinc-400 uppercase">Peso (kg)</label>
                                <input type="number" step="0.1" name="peso" value={datos.peso} onChange={manejoCambio} className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-2 px-3 text-zinc-100 text-sm outline-none transition-colors" placeholder="68.5" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-zinc-400 uppercase">Perfil Hábil</label>
                                <select name="genero" value={datos.genero} onChange={manejoCambio} className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-2 px-3 text-zinc-100 text-sm outline-none transition-colors cursor-pointer appearance-none">
                                    <option value="Derecho">Derecho</option>
                                    <option value="Zurdo">Zurdo</option>
                                    <option value="Ambidiestro">Ambidiestro</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-zinc-400 uppercase">Beca</label>
                                <select name="beca" value={datos.beca} onChange={manejoCambio} className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-2 px-3 text-zinc-100 text-sm outline-none transition-colors cursor-pointer appearance-none">
                                    <option value="Sin Beca">Sin Beca</option>
                                    <option value="Media Beca">Media Beca</option>
                                    <option value="Beca Completa">Beca Completa</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN REPRESENTANTE */}
                    <div className="space-y-4 pt-4 border-t border-zinc-700/40">
                        <h3 className="text-sm font-bold text-zinc-300 tracking-wider uppercase border-l-2 border-rose-500 pl-2">Datos del Representante</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-zinc-400 uppercase">Nombre del Representante</label>
                                <input type="text" name="rep_nombre" value={datos.rep_nombre} onChange={manejoCambio} className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-2 px-3 text-zinc-100 text-sm outline-none transition-colors" required />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-zinc-400 uppercase">Cédula</label>
                                <input type="text" name="rep_cedula" value={datos.rep_cedula} onChange={manejoCambio} className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-2 px-3 text-zinc-100 text-sm outline-none transition-colors" placeholder="Ej: V-12345678" required={!esModoEdicion} />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-zinc-400 uppercase">Teléfono</label>
                                <input type="text" name="rep_telefono" value={datos.rep_telefono} onChange={manejoCambio} className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-2 px-3 text-zinc-100 text-sm outline-none transition-colors" placeholder="0414-1234567" required />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-zinc-400 uppercase">Email</label>
                                <input type="email" name="rep_email" value={datos.rep_email} onChange={manejoCambio} className="w-full bg-[#1e1d1f]/60 border-b-2 border-zinc-600 focus:border-[#B1ED25] py-2 px-3 text-zinc-100 text-sm outline-none transition-colors" placeholder="correo@ejemplo.com" required={!esModoEdicion} />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center pt-8 border-t border-zinc-700/40">
                        <button type="submit" className="w-full sm:w-auto px-10 py-3 bg-[#B1ED25] text-zinc-900 text-xs sm:text-sm font-black hover:bg-lime-400 shadow-md transition-all uppercase tracking-wider" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}>
                            {esModoEdicion ? 'Guardar Cambios' : 'Procesar Registro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}