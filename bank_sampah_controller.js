const bank_sampah = require("../src/bank_sampah");

const daftarPengguna = async (req, res, next) => {
    try {
        const payload = req.body;

        const result = await bank_sampah.daftarPengguna(
            payload.sender,
            payload.user,
            payload.nama,
            payload.alamat,
            payload.informasiKontak
        );

        res.send(result);
    } catch (e) {
        console.error('Error saat mendaftarkan pengguna: ', e);
        res.status(500).send({
            error: e.toString()
        });
    }
};

const cekPengguna = async (req, res, next) => {
    try {
        const payload = req.query;

        const result = await bank_sampah.cekPengguna(
            payload.user
        );

        res.send(result);
    } catch (e) {
        console.error('Error saat cek pengguna: ', e);
        res.status(500).send({
            error: e.toString()
        });
    }
};

const tambahkanTransaksiSampah = async (req, res, next) => {
    try {
        const payload = req.body;

        const result = await bank_sampah.tambahkanTransaksiSampah(
            payload.jenisSampah,
            payload.berat,
            payload.tanggal,
            payload.user,
            payload.sender
        );

        res.send(result);
    } catch (e) {
        console.error('Error saat menambahkan transaksi sampah: ', e);
        res.status(500).send({
            error: e.toString()
        });
    }
};

const tukarPoin = async (req, res, next) => {
    try {
        const payload = req.body;

        const result = await bank_sampah.tukarPoin(
            payload.point,
            payload.sender
        );

        res.send(result);
    } catch (e) {
        console.error('Error saat melakukan penukaran poin: ', e);
        res.status(500).send({
            error: e.toString()
        });
    }
};

const cekSaldo = async (req, res, next) => {
    try {
        const payload = req.query;

        const saldo = await bank_sampah.cekSaldo(payload.user);

        res.send({ saldo: saldo });
    } catch (e) {
        console.error('Error saat cek saldo: ', e);
        res.status(500).send({
            error: e.toString()
        });
    }
};


module.exports = {
    daftarPengguna,
    cekPengguna,
    tambahkanTransaksiSampah,
    tukarPoin,
    cekSaldo
    
};