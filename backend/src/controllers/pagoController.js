const { pool } = require('../config/db');
const { createClient } = require('@supabase/supabase-js');

// Inicializamos el cliente de Supabase para poder usar el Storage (Buckets)
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);

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

const getReportesFinancieros = async (req, res) => {
    try {
        // 1. Distribución de Pagos (Agrupamos por método)
        const distQuery = `
            SELECT mp.nombre as metodo, COUNT(p.id) as cantidad
            FROM pagos p
            JOIN metodos_pago mp ON p.id_metodo_pago = mp.id
            GROUP BY mp.nombre
        `;
        const distResult = await pool.query(distQuery);

        // Convertimos a porcentajes
        const totalPagos = distResult.rows.reduce((acc, row) => acc + parseInt(row.cantidad), 0);
        const distribucion = distResult.rows.map(row => ({
            metodo: row.metodo,
            pct: totalPagos > 0 ? Math.round((parseInt(row.cantidad) / totalPagos) * 100) : 0
        }));

        // 2. Transacciones Recientes (Cruzamos tablas para traer el nombre del jugador)
        const transQuery = `
            SELECT 
                p.id, 
                TO_CHAR(p.fecha_pago, 'DD/MM/YYYY HH12:MI AM') as fecha,
                p.monto, 
                p.moneda, 
                p.estado, 
                p.referencia,
                p.comprobante_url,
                mp.nombre as metodo,
                j.nombre as jugador
            FROM pagos p
            JOIN metodos_pago mp ON p.id_metodo_pago = mp.id
            LEFT JOIN representantes r ON p.id_representante = r.id
            LEFT JOIN jugadores j ON j.id_representante = r.id
            ORDER BY p.fecha_pago DESC
            LIMIT 100;
        `;
        const transResult = await pool.query(transQuery);

        // 3. Flujo de Caja Básico (Agrupamos ingresos por mes)
        const flujoQuery = `
            SELECT 
                TO_CHAR(fecha_pago, 'TMMonth') as mes,
                SUM(CASE WHEN moneda = 'USD' THEN monto ELSE monto / COALESCE(tasa_cambio, 762) END) as brutos
            FROM pagos
            GROUP BY TO_CHAR(fecha_pago, 'TMMonth'), EXTRACT(MONTH FROM fecha_pago)
            ORDER BY EXTRACT(MONTH FROM fecha_pago) DESC
            LIMIT 6;
        `;
        const flujoResult = await pool.query(flujoQuery);

        res.json({
            distribucion,
            transacciones: transResult.rows,
            flujo: flujoResult.rows
        });

    } catch (error) {
        console.error("Error obteniendo reportes:", error);
        res.status(500).json({ error: "Error interno obteniendo analíticas" });
    }
};

module.exports = { registrarPago, getReportesFinancieros };