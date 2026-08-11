const express = require('express');
const router = express.Router();
const multer = require('multer');
// Importamos la nueva función
const { registrarPago, getReportesFinancieros } = require('../controllers/pagoController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('comprobante'), registrarPago);
// Agregamos la ruta GET para los reportes
router.get('/analiticas', getReportesFinancieros);

module.exports = router;