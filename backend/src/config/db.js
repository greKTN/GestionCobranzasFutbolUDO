const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Requerido por Supabase para conexiones externas
    }
});

// Prueba de conexión inicial para validar que todo esté bien al arrancar
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error adquiriendo cliente de PostgreSQL', err.stack);
    } else {
        console.log('Conexión exitosa a la base de datos en Supabase');
    }
    if (release) release();
});

module.exports = { pool };