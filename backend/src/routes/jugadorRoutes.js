const express = require('express');
const router = express.Router();

const { registrarJugador, getJugadores, editarJugador } = require('../controllers/jugadorController');

// Definicion de los endpoints
router.post('/', registrarJugador);
router.get('/', getJugadores); // GET para cargar la tabla
router.put('/:id', editarJugador); // PUT para actualizar un jugador

module.exports = router;