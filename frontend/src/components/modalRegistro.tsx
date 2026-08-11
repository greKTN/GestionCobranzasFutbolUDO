import { useState } from 'react';

export interface DatosRegistro {
    // Datos del Jugador
    nombre: string;
    fecha_nacimiento: string; // Requerido por tu BD
    posicion: string;         // Opcional en tu BD
    categoria: string;        // Calculado por edad
    
    // Datos del Representante
    rep_nombre: string;
    rep_cedula: string;
    rep_telefono: string;
    rep_email: string;        // Requerido por tu BD (NOT NULL)
}

const estadoInicial: DatosRegistro = {
    nombre: '',
    fecha_nacimiento: '',
    posicion: 'Delantero',
    categoria: '',
    rep_nombre: '',
    rep_cedula: '',
    rep_telefono: '',
    rep_email: ''
};

export default function ModalRegistro({ abierto, cerrarModal }: { abierto: boolean, cerrarModal: () => void }) {
    const [datos, setDatos] = useState<DatosRegistro>(estadoInicial);
    const [edadCalculada, setEdadCalculada] = useState<number | null>(null);

    // Función para calcular la edad exacta basada en la fecha de nacimiento
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

    const manejoCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setDatos(prevDatos => {
            const nuevosDatos = { ...prevDatos };

            // Teléfono del representante con tu formato 04xx-xxxxxxx
            if (name === 'rep_telefono') {
                const numerico = value.replace(/\D/g, '');
                const truncado = numerico.slice(0, 11);
                if (truncado.length > 4) {
                    nuevosDatos.rep_telefono = `${truncado.slice(0, 4)}-${truncado.slice(4)}`;
                } else {
                    nuevosDatos.rep_telefono = truncado;
                }
            } 
            // Cédula del representante con V-
            else if (name === 'rep_cedula') {
                const numerico = value.replace(/\D/g, '');
                const truncado = numerico.slice(0, 8);
                if (truncado.length > 0) {
                    nuevosDatos.rep_cedula = `V-${truncado}`;
                } else {
                    nuevosDatos.rep_cedula = '';
                }
            } 
            // Manejo de la fecha y cálculo automático de tu categoría
            else if (name === 'fecha_nacimiento') {
                nuevosDatos.fecha_nacimiento = value;
                
                if (value) {
                    const edadActual = calcularEdad(value);
                    setEdadCalculada(edadActual);
                    
                    if (edadActual <= 7) nuevosDatos.categoria = 'sub-7';
                    else if (edadActual <= 9) nuevosDatos.categoria = 'sub-9';
                    else if (edadActual <= 11) nuevosDatos.categoria = 'sub-11';
                    else if (edadActual <= 15) nuevosDatos.categoria = 'sub-15';
                    else if (edadActual <= 16) nuevosDatos.categoria = 'sub-16';
                    else if (edadActual <= 18) nuevosDatos.categoria = 'sub-18';
                    else nuevosDatos.categoria = 'Primer Equipo';
                } else {
                    setEdadCalculada(null);
                    nuevosDatos.categoria = '';
                }
            } 
            else {
                nuevosDatos[name as keyof DatosRegistro] = value;
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

        if (datos.rep_cedula.length < 9) {
            alert("La cédula del representante debe tener al menos 7 dígitos numéricos.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/jugadores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            if (response.ok) {
                alert('¡Jugador registrado correctamente en la base de datos!');
                manejarCierre(); 
            } else {
                alert('Hubo un problema al guardar el registro en el servidor.');
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            alert('Error de conexión con el backend. Revisa que tu servidor esté corriendo.');
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300 ${abierto ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
                
                <button onClick={manejarCierre} type="button" className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold">
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-4 text-zinc-900 border-b pb-2">Registro de Jugador</h2>
                
                <form onSubmit={enviarDatos} className="space-y-4">
                    
                    {/* SECCIÓN JUGADOR */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h3 className="text-md font-bold text-blue-800 mb-3 uppercase text-sm">Datos del Jugador</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm font-bold" htmlFor="nombre">Nombre Completo:</label>
                                <input type="text" id="nombre" name="nombre" value={datos.nombre} onChange={manejoCambio} className="w-full p-2 border border-gray-300 rounded text-zinc-900 bg-white outline-none focus:border-blue-500" required />
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm font-bold" htmlFor="posicion">Posición:</label>
                                <select id="posicion" name="posicion" value={datos.posicion} onChange={manejoCambio} className="w-full p-2 border border-gray-300 rounded text-zinc-900 bg-white outline-none focus:border-blue-500">
                                    <option value="Portero">Portero</option>
                                    <option value="Defensa">Defensa</option>
                                    <option value="Mediocampista">Mediocampista</option>
                                    <option value="Delantero">Delantero</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1 text-sm font-bold" htmlFor="fecha_nacimiento">Fecha de Nacimiento:</label>
                                <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" value={datos.fecha_nacimiento} onChange={manejoCambio} className="w-full p-2 border border-gray-300 rounded text-zinc-900 bg-white outline-none focus:border-blue-500" required />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1 text-sm font-bold" htmlFor="categoria">Categoría (Auto-asignada):</label>
                                <input type="text" id="categoria" name="categoria" value={datos.categoria} readOnly className="w-full p-2 border border-gray-300 rounded text-blue-900 font-semibold bg-blue-50 outline-none" placeholder="Seleccione fecha..." />
                            </div>
                        </div>

                        {edadCalculada !== null && edadCalculada < 11 && (
                            <div className="mt-3 text-sm text-amber-800 bg-amber-100 border border-amber-300 p-2 rounded shadow-sm">
                                <strong>Aviso:</strong> El jugador tiene {edadCalculada} años. Se deberá rellenar un formulario adicional con la información del representante tras este registro.
                            </div>
                        )}
                    </div>

                    {/* SECCIÓN REPRESENTANTE */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h3 className="text-md font-bold text-blue-800 mb-3 uppercase text-sm">Datos del Representante</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm font-bold" htmlFor="rep_nombre">Nombre del Representante:</label>
                                <input type="text" id="rep_nombre" name="rep_nombre" value={datos.rep_nombre} onChange={manejoCambio} className="w-full p-2 border border-gray-300 rounded text-zinc-900 bg-white outline-none focus:border-blue-500" required />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1 text-sm font-bold" htmlFor="rep_cedula">Cédula:</label>
                                <input type="text" id="rep_cedula" name="rep_cedula" value={datos.rep_cedula} onChange={manejoCambio} className="w-full p-2 border border-gray-300 rounded text-zinc-900 bg-white outline-none focus:border-blue-500" placeholder="Ej: V-12345678" required />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1 text-sm font-bold" htmlFor="rep_telefono">Teléfono: </label>
                                <input type="text" id="rep_telefono" name="rep_telefono" value={datos.rep_telefono} onChange={manejoCambio} className="w-full p-2 border border-gray-300 rounded text-zinc-900 bg-white outline-none focus:border-blue-500" placeholder="0414-1234567" required />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1 text-sm font-bold" htmlFor="rep_email">Email:</label>
                                <input type="email" id="rep_email" name="rep_email" value={datos.rep_email} onChange={manejoCambio} className="w-full p-2 border border-gray-300 rounded text-zinc-900 bg-white outline-none focus:border-blue-500" placeholder="correo@ejemplo.com" required />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                        <button type="button" onClick={manejarCierre} className="bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded hover:bg-gray-300 transition-all duration-200">
                            Cancelar
                        </button>
                        <button type="submit" className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
                            Registrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}