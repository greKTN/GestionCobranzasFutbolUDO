const express = require('express');
const router = express.Router();
const { registrarJugador } = require('../controllers/jugadorController');

router.post('/', registrarJugador);

module.exports = router;