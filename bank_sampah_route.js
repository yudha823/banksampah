const express = require('express');
const router = express.Router();
const bankSampahController = require('../controllers/bank_sampah_controller');

router.post('/daftarPengguna', bankSampahController.daftarPengguna);
router.get('/cekPengguna', bankSampahController.cekPengguna);
router.post('/tambahkanTransaksiSampah', bankSampahController.tambahkanTransaksiSampah);
router.post('/tukarPoin', bankSampahController.tukarPoin);
router.get('/cekSaldo', bankSampahController.cekSaldo);

module.exports = router;

