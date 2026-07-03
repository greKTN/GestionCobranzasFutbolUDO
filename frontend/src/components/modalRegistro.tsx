import { useState } from 'react';

export interface DatosRegistro {
    nombre: string;
    edad: number | string;
    cedula: string;
    telefono: string;
    representante: string;
    categoria: string;
}

//estado en blanco para resetear al cerrar el modal
const estadoInicial: DatosRegistro = {
    nombre: '',
    edad: '',
    cedula: '',
    telefono: '',
    representante: '',
    categoria: ''
};

export default function ModalRegistro({ abierto, cerrarModal }: { abierto: boolean, cerrarModal: () => void }) {
    const [datos, setDatos] = useState<DatosRegistro>(estadoInicial);

    //manejo de los cambios de la info del modal
    const manejoCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        //aca se garantiza que los datos solo se puedan escribir como uno quiere
        setDatos(prevDatos => {
            const nuevosDatos = { ...prevDatos };

            //aca se garantiza que el telefono sean numeros y este parseado a 04xx-xxxxxxx
            if (name == 'telefono') {
                const numerico = value.replace(/\D/g, '');
                const truncado = numerico.slice(0, 11);
                if (truncado.length > 4) {
                    nuevosDatos.telefono = `${truncado.slice(0, 4)}-${truncado.slice(4)}`;
                } else {
                    nuevosDatos.telefono = truncado;
                }
            } 
            //aca se garantiza que la cedula sea solo numeros y tenga el V- al principio, no pensamos en extranjeros
            else if (name === 'cedula') {
                const numerico = value.replace(/\D/g, '');
                //se limita a 8 dígitos máximo
                const truncado = numerico.slice(0, 8);
                
                //Si hay números, se le pone el V-, sino, se deja en blanco
                if (truncado.length > 0) {
                    nuevosDatos.cedula = `V-${truncado}`;
                } else {
                    nuevosDatos.cedula = '';
                }
            } 
            //aca se garantiza que la edad sea solo numeros y se le asigne una categoria automaticamente dependiendo de la misma
            else if (name === 'edad') {
                const edadNum = value === '' ? '' : Number(value);
                nuevosDatos.edad = edadNum;
                
                //manejo de asignacion de categorias automaticamente dependiendo de la edad del jugador
                if (typeof edadNum === 'number') {
                    if (edadNum <= 7) nuevosDatos.categoria = 'sub-7';
                    else if (edadNum <= 9) nuevosDatos.categoria = 'sub-9';
                    else if (edadNum <= 11) nuevosDatos.categoria = 'sub-11';
                    else if (edadNum <= 15) nuevosDatos.categoria = 'sub-15';
                    else if (edadNum <= 16) nuevosDatos.categoria = 'sub-16';
                    else if (edadNum <= 18) nuevosDatos.categoria = 'sub-18';
                    else nuevosDatos.categoria = 'Primer Equipo';
                } 
                else {
                    nuevosDatos.categoria = ''; //si borra la edad, se limpia la categoría
                }
            } 
            else {
                //para nombre, representante, y demas
                nuevosDatos[name as keyof DatosRegistro] = value;
            }

            return nuevosDatos;
        });
    };

    //limpia los campos y le avisa al modal que cierre
    const manejarCierre = () => {
        setDatos(estadoInicial);
        cerrarModal();
    };

    //manejo de envio de datos, por ahora solo hace un alert, pero luego se conectara a la DB
    const enviarDatos = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (datos.cedula.length < 9) {
            alert("La cédula debe tener al menos 7 dígitos numéricos.");
            return;
        }

        alert(`Datos enviados: ${JSON.stringify(datos)}`);
        manejarCierre();
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300 ${abierto ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
                
                {/* Botón X */}
                <button onClick={manejarCierre} type="button" className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-4 text-zinc-900">Registro de Jugador</h2>
                
                <form onSubmit={enviarDatos}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1 text-sm font-bold" htmlFor="nombre">Nombre:</label>
                        <input type="text" id="nombre" name="nombre" value={datos.nombre} onChange={manejoCambio} className="w-full p-2 border rounded text-zinc-900 bg-white" required />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1 text-sm font-bold" htmlFor="edad">Edad:</label>
                        <input type="number" id="edad" name="edad" value={datos.edad} onChange={manejoCambio} min="3" max="50" className="w-full p-2 border rounded text-zinc-900 bg-white" required />
                        
                        {Number(datos.edad) < 11 && datos.edad !== '' && (
                            <div className="mt-2 text-sm text-amber-800 bg-amber-100 border border-amber-300 p-2 rounded shadow-sm">
                                <strong>Aviso:</strong> Para los chamos menores de 11 años, se deberá rellenar un formulario adicional con la información del representante tras este registro.
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1 text-sm font-bold" htmlFor="cedula">Cédula:</label>
                        <input type="text" id="cedula" name="cedula" value={datos.cedula} onChange={manejoCambio} className="w-full p-2 border rounded text-zinc-900 bg-white" placeholder="Ej: 12345678" required />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1 text-sm font-bold" htmlFor="telefono">Teléfono: </label>
                        <input type="text" id="telefono" name="telefono" value={datos.telefono} onChange={manejoCambio} className="w-full p-2 border rounded text-zinc-900 bg-white" placeholder="0414-1234567" required />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1 text-sm font-bold" htmlFor="representante">Representante:</label>
                        <input type="text" id="representante" name="representante" value={datos.representante} onChange={manejoCambio} className="w-full p-2 border rounded text-zinc-900 bg-white" required />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1 text-sm font-bold" htmlFor="categoria">Categoría:</label>
                        <select id="categoria" name="categoria" value={datos.categoria} onChange={manejoCambio} className="w-full p-2 border rounded text-zinc-900 bg-white" required>
                            <option value="">Seleccione una categoría</option>
                            <option value="sub-7">Sub-7</option>
                            <option value="sub-9">Sub-9</option>
                            <option value="sub-11">Sub-11</option>
                            <option value="sub-15">Sub-15</option>
                            <option value="sub-16">Sub-16</option>
                            <option value="sub-18">Sub-18</option>
                            <option value="Primer Equipo">Primer Equipo</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        {/* Botón de cancelar */}
                        <button type="button" onClick={manejarCierre} className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded hover:bg-gray-300 transition-all duration-200">
                            Cancelar
                        </button>
                        <button type="submit" className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
                            Registrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}