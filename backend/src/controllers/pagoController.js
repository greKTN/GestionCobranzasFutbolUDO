const { pool } = require('../config/db');
const { createClient } = require('@supabase/supabase-js');

// Inicializamos el cliente de Supabase para poder usar el Storage (Buckets)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const registrarPago = async (req, res) => {
    try {
        const datos = req.body;
        const archivo = req.file; 
        let comprobante_url = null;

        //Si se envia una imagen, la subimos al bucket
        if (archivo) {
            const nombreUnico = `pagos/${Date.now()}_${archivo.originalname.replace(/\s+/g, '_')}`;
            
            const { data, error } = await supabase.storage
                .from('comprobantes')
                .upload(nombreUnico, archivo.buffer, {
                    contentType: archivo.mimetype
                });

            if (error) throw error;

            // Extraccion de la URL pública para guardarla en la DB
            const { data: urlData } = supabase.storage
                .from('comprobantes')
                .getPublicUrl(nombreUnico);
            
            comprobante_url = urlData.publicUrl;
        }

        // Mapeo el método de pago al ID de la tabla
        const metodos = { 'Transferencia': 1, 'Efectivo': 2, 'Pago Móvil': 3, 'Zelle': 4 };
        const id_metodo = metodos[datos.metodoPago] || 1;

        //Busqueda de ID del representante basándonos en el nombre del jugador que escribieron
        const getRepQuery = `SELECT id_representante FROM jugadores WHERE nombre ILIKE $1 LIMIT 1`;
        const repResult = await pool.query(getRepQuery, [`%${datos.atleta}%`]);
        const id_representante = repResult.rows.length > 0 ? repResult.rows[0].id_representante : null;

        //Tasa de cambio
        const tasa_cambio = datos.moneda === 'USD' ? 762.00 : null;

        // Guardado de info
        const insertQuery = `
            INSERT INTO pagos (id_representante, id_metodo_pago, monto, referencia, comprobante_url, moneda, tasa_cambio)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id;
        `;
        await pool.query(insertQuery, [
            id_representante, id_metodo, datos.monto, datos.referencia, comprobante_url, datos.moneda, tasa_cambio
        ]);

        res.json({ mensaje: "Pago registrado y comprobante subido con éxito", comprobante_url });

    } catch (error) {
        console.error("Error al registrar pago:", error);
        res.status(500).json({ error: "Hubo un error guardando el pago" });
    }
};

module.exports = { registrarPago };