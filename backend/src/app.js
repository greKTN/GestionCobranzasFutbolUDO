const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
    res.json({ message: 'API de Gestión de Cobranzas funcionando correctamente' });
});

// Importar rutas
const jugadorRoutes = require('./routes/jugadorRoutes');
// (Futuro) const pagoRoutes = require('./routes/pagoRoutes');

// Usar rutas
app.use('/api/jugadores', jugadorRoutes);
// app.use('/api/pagos', pagoRoutes);

module.exports = app;