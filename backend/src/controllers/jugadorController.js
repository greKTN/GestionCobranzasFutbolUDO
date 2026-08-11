const { pool } = require('../config/db');

const registrarJugador = async (req, res) => {
    try {
        const datos = req.body;

        //Guardar o buscar al representante
        // Se usa el ON CONFLICT para que si la cédula ya existe, no de error y solo nos devuelva el ID
        const repQuery = `
            INSERT INTO representantes (nombre, cedula, telefono, email)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (cedula) DO UPDATE SET nombre = EXCLUDED.nombre
            RETURNING id;
        `;
        const repResult = await pool.query(repQuery, [
            datos.rep_nombre, 
            datos.rep_cedula, 
            datos.rep_telefono, 
            datos.rep_email
        ]);
        
        const id_representante = repResult.rows[0].id;

        // Guardado de jugador usando el ID del representante
        const jugQuery = `
            INSERT INTO jugadores (nombre, posicion, fecha_nacimiento, peso, estatura, genero, beca, id_categoria, id_representante, telefono)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
        await pool.query(jugQuery, [
            datos.nombre, 
            datos.posicion, 
            datos.fecha_nacimiento, 
            datos.peso || 0, 
            datos.estatura || 0, 
            datos.genero || 'Derecho', 
            datos.beca || 'Sin Beca', 
            datos.id_categoria || 1, 
            id_representante,
            datos.telefono_jugador
        ]);

        res.json({ mensaje: "Jugador guardado con éxito en Supabase" });

    } catch (error) {
        console.error("Error guardando:", error);
        res.status(500).json({ error: "Hubo un error guardando los datos" });
    }
};

const getJugadores = async (req, res) => {
    try {
        const query = `
            SELECT 
                j.id, 
                j.nombre as name, 
                j.posicion as position, 
                j.beca, 
                j.peso || ' kg' as peso, 
                j.estatura || ' m' as altura, 
                TO_CHAR(j.fecha_nacimiento, 'DD/MM/YYYY') as nacimiento,
                j.genero as pierna, -- Ajustar según cómo guardes el perfil hábil
                c.nombre as categoria,
                r.nombre as "representativeName", 
                r.telefono as "representativePhone"
            FROM jugadores j
            LEFT JOIN categorias c ON j.id_categoria = c.id
            LEFT JOIN representantes r ON j.id_representante = r.id;
        `;
        
        const { rows } = await pool.query(query);
        
        //Mock por ahora
        const jugadoresFormateados = rows.map(jugador => ({
            ...jugador,
            status: 'Al Dia',
            avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=128&q=80', // Avatar por defecto
            dorsal: 10
        }));

        res.json(jugadoresFormateados);
    } catch (error) {
        console.error('Error obteniendo jugadores:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const editarJugador = async (req, res) => {
    try {
        const { id } = req.params; 
        const datos = req.body;

       const jugQuery = `
            UPDATE jugadores 
            SET nombre = $1, posicion = $2, fecha_nacimiento = $3, id_categoria = $4,
                peso = $5, estatura = $6, genero = $7, beca = $8, telefono = $9
            WHERE id = $10
            RETURNING id_representante;
        `;
        const result = await pool.query(jugQuery, [
            datos.nombre, 
            datos.posicion, 
            datos.fecha_nacimiento, 
            datos.id_categoria || 1,
            datos.peso || 0,
            datos.estatura || 0,
            datos.genero || 'Derecho',
            datos.beca || 'Sin Beca',
            datos.telefono_jugador,
            id
        ]);

        const id_representante = result.rows[0].id_representante;

        const repQuery = `
            UPDATE representantes 
            SET nombre = $1, telefono = $2
            WHERE id = $3
        `;
        await pool.query(repQuery, [datos.rep_nombre, datos.rep_telefono, id_representante]);

        res.json({ mensaje: "Jugador actualizado con éxito en Supabase" });

    } catch (error) {
        console.error("Error actualizando:", error);
        res.status(500).json({ error: "Hubo un error actualizando los datos" });
    }
};

module.exports = { registrarJugador, getJugadores, editarJugador };