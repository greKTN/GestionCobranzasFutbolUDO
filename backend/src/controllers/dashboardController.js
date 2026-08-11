const { pool } = require('../config/db');

const getDashboardData = async (req, res) => {
    try {
        //Estadísticas Generales (Jugadores, becas, plata total)
        const statsQuery = `
            SELECT
                (SELECT COUNT(*) FROM jugadores) as total_jugadores,
                (SELECT COUNT(*) FROM jugadores WHERE beca != 'Sin Beca') as becas_otorgadas,
                (SELECT COALESCE(SUM(CASE WHEN moneda = 'USD' THEN monto ELSE monto/762 END), 0) FROM pagos) as solidez_financiera
        `;
        const statsResult = await pool.query(statsQuery);
        const stats = statsResult.rows[0];

        //Lista de Morosos (Agrupando deudas pendientes por jugador)
        const morososQuery = `
            SELECT
                j.id, j.nombre, c.nombre as equipo,
                SUM(cg.monto_exigido) as deuda
            FROM jugadores j
            JOIN categorias c ON j.id_categoria = c.id
            JOIN cargos cg ON j.id = cg.id_jugador
            WHERE cg.estado = 'Pendiente'
            GROUP BY j.id, j.nombre, c.nombre
            ORDER BY deuda DESC
        `;
        const morososResult = await pool.query(morososQuery);
        const listaMorosos = morososResult.rows.map(m => ({
            id: m.id,
            nombre: m.nombre,
            equipo: m.equipo,
            deuda: Number(m.deuda),
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80'
        }));

        const montoMorosos = listaMorosos.reduce((acc, m) => acc + m.deuda, 0);
        const cantidadMorosos = listaMorosos.length;

        // Movimientos Recientes (Últimos pagos)
        const movQuery = `
            SELECT p.id, p.monto, p.referencia, r.nombre as representante
            FROM pagos p
            LEFT JOIN representantes r ON p.id_representante = r.id
            ORDER BY p.fecha_pago DESC LIMIT 5
        `;
        const movResult = await pool.query(movQuery);
        const movimientosRecientes = movResult.rows.map((m, index) => ({
            id: index,
            tipo: 'PAGO_RECIBIDO',
            detalle: `${m.representante || 'Desconocido'} // Ref: ${m.referencia}`,
            monto: Number(m.monto),
            fecha: 'Reciente'
        }));

        // Cálculos finales para React
        const capacidadActual = parseInt(stats.total_jugadores);
        const becasOtorgadas = parseInt(stats.becas_otorgadas);
        const capacidadMaxima = 160;

        res.json({
            estadisticasClub: {
                solidezFinanciera: Number(stats.solidez_financiera),
                capacidadActual,
                capacidadMaxima,
                montoMorosos,
                cantidadMorosos,
                becasOtorgadas,
                porcentajeBecas: capacidadActual > 0 ? Number(((becasOtorgadas / capacidadActual) * 100).toFixed(2)) : 0
            },
            listaMorosos,
            movimientosRecientes
        });

    } catch (error) {
        console.error("Error en dashboard:", error);
        res.status(500).json({ error: "Error obteniendo datos del dashboard" });
    }
};

module.exports = { getDashboardData };