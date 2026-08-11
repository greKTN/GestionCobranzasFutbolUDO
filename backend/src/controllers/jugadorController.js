const { pool } = require('../config/db'); // Tu conexión a Supabase

const registrarJugador = async (req, res) => {
    try {
        const datos = req.body;

        // 1. Guardar o buscar al representante
        // Usamos ON CONFLICT para que si la cédula ya existe, no de error y solo nos devuelva el ID
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

        // 2. Guardar al jugador usando el ID del representante
        const jugQuery = `
            INSERT INTO jugadores (nombre, posicion, fecha_nacimiento, peso, estatura, genero, beca, id_categoria, id_representante)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;
        await pool.query(jugQuery, [
            datos.nombre, 
            datos.posicion, 
            datos.fecha_nacimiento, 
            datos.peso || 0, 
            datos.estatura || 0, 
            datos.genero || 'Derecho', 
            datos.beca || 0, 
            datos.id_categoria || 1, 
            id_representante
        ]);

        res.json({ mensaje: "Jugador guardado con éxito en Supabase" });

    } catch (error) {
        console.error("Error guardando:", error);
        res.status(500).json({ error: "Hubo un error guardando los datos" });
    }
};

module.exports = { registrarJugador };