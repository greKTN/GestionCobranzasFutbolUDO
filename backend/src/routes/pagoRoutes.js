const express = require('express');
const router = express.Router();
const multer = require('multer');
const { registrarPago } = require('../controllers/pagoController');

// Configuracion de Multer para guardar la imagen temporalmente en la memoria RAM
const upload = multer({ storage: multer.memoryStorage() });

// upload.single('comprobante') le dice que busque un archivo con ese nombre exacto
router.post('/', upload.single('comprobante'), registrarPago);

module.exports = router;