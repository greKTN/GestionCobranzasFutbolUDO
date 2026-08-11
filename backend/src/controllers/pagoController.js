const { pool } = require('../config/db'); // Ajusta la ruta si db.js está en /config

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
        
        // Mapeamos un estado ficticio por ahora, luego lo puedes calcular cruzando con la tabla "cargos" y "pagos"
        const jugadoresFormateados = rows.map(jugador => ({
            ...jugador,
            status: 'Al Dia', // Lógica pendiente de cobros
            avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=128&q=80', // Avatar por defecto
            dorsal: 10 // Campo pendiente en tu tabla DB
        }));

        res.json(jugadoresFormateados);
    } catch (error) {
        console.error('Error obteniendo jugadores:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { getJugadores };