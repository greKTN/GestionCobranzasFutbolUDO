const express = require('express');
const cors = require('cors');
require('dotenv').config();

//Importacion de rutas
const jugadorRoutes = require('./routes/jugadorRoutes'); 
const pagoRoutes = require('./routes/pagoRoutes');

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json()); 
require('dotenv').config();

// Rutas de la API
app.use('/api/jugadores', jugadorRoutes);
app.use('/api/pagos', pagoRoutes);
const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo al pelo en el puerto ${PORT}`);
});