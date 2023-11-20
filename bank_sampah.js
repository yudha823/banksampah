const abi_json = require('../abi.json');
const abi_bank_sampah = abi_json.waste_bank;
const rpc = process.env.RPC;
const Web3 = require('web3');

async function daftarPengguna(_sender, _user, _nama, _alamat, _informasiKontak){
    let web3main = new Web3(rpc);
    let loadContract = new web3main.eth.Contract(abi_bank_sampah.abi, abi_bank_sampah.contract_address);


    let data = await loadContract.methods.daftarPengguna(
        _user, 
        _nama, 
        _alamat, 
        _informasiKontak
    )
     //calculate gas data
     let finalPrice = 0;
     let [gasUsed, currentGasPriceInNetwork] =await Promise.all([
         await data.estimateGas({from: _sender, value: Web3.utils.toWei(finalPrice.toString())}) + 21000,
         Number(await Web3.utils.fromWei((await web3main.eth.getGasPrice()).toString(), 'gwei'))
     ]);
     currentGasPriceInNetwork = Number(currentGasPriceInNetwork.toFixed(0))
     let estimate = {
         "currentGasPriceInNetwork" : [currentGasPriceInNetwork,'gwei'],
         "gasUsedForTransaction"  : [gasUsed, "gas"],
         "gasCostForTransaction"  : [
             await Web3.utils.fromWei(await Web3.utils.toWei((gasUsed * currentGasPriceInNetwork).toString(), 'gwei')),
             'ether',
             `with ${currentGasPriceInNetwork} gwei gas price`
         ]
     }

    return {
        data: data.encodeABI(),
        contract_address: abi_bank_sampah.contract_address,
    };
}

async function cekPengguna(_user) {
    let web3main = new Web3(rpc);
    let loadContract = new web3main.eth.Contract(abi_bank_sampah.abi, abi_bank_sampah.contract_address);

    let user_data = await loadContract.methods.users(_user).call();

    let obj_user = {
        nama: user_data.nama,
        alamat: user_data.alamat,
        informasiKontak: user_data.informasiKontak,
        terdaftar: user_data.terdaftar,
        point: Number(Web3.utils.fromWei(user_data.point)),
    }

    return obj_user;
}

async function tambahkanTransaksiSampah(_jenisSampah, _berat, _tanggal, _user, _sender) {
    let web3main = new Web3(rpc);
    let loadContract = new web3main.eth.Contract(abi_bank_sampah.abi, abi_bank_sampah.contract_address);

    let data = await loadContract.methods.tambahkanTransaksiSampah(
        _jenisSampah,
        Web3.utils.toWei(_berat.toString()),
        _tanggal,
        _user
    );

    // Hitung poin reward berdasarkan berat sampah (1 poin per kilogram)
    let poinReward = _berat;

    //calculate gas data
    let finalPrice = 0;
    let [gasUsed, currentGasPriceInNetwork] =await Promise.all([
        await data.estimateGas({from: _sender, value: Web3.utils.toWei(finalPrice.toString())}) + 21000,
        Number(await Web3.utils.fromWei((await web3main.eth.getGasPrice()).toString(), 'gwei'))
    ]);
    currentGasPriceInNetwork = Number(currentGasPriceInNetwork.toFixed(0))
    let estimate = {
        "currentGasPriceInNetwork" : [currentGasPriceInNetwork,'gwei'],
        "gasUsedForTransaction"  : [gasUsed, "gas"],
        "gasCostForTransaction"  : [
            await Web3.utils.fromWei(await Web3.utils.toWei((gasUsed * currentGasPriceInNetwork).toString(), 'gwei')),
            'ether',
            `with ${currentGasPriceInNetwork} gwei gas price`
        ]
    }

    return {
        data: data.encodeABI(),
        contract_address: abi_bank_sampah.contract_address,
    };
}

async function tukarPoin(_point, _sender) {
    try {
        let web3main = new Web3(rpc);
        let loadContract = new web3main.eth.Contract(abi_bank_sampah.abi, abi_bank_sampah.contract_address);

        // Kurangkan poin dari akun pengguna
        let data = loadContract.methods.tukarPoin(Web3.utils.toWei(_point.toString()));

        // Perhitungan estimasi gas
        let finalPrice = 0;
        let [gasUsed, currentGasPriceInNetwork] = await Promise.all([
            await data.estimateGas({ from: _sender, value: Web3.utils.toWei(finalPrice.toString()) }) + 21000,
            Number(await Web3.utils.fromWei((await web3main.eth.getGasPrice()).toString(), 'gwei'))
        ]);
        currentGasPriceInNetwork = Number(currentGasPriceInNetwork.toFixed(0));
        let estimate = {
            "currentGasPriceInNetwork": [currentGasPriceInNetwork, 'gwei'],
            "gasUsedForTransaction": [gasUsed, "gas"],
            "gasCostForTransaction": [
                await Web3.utils.fromWei(await Web3.utils.toWei((gasUsed * currentGasPriceInNetwork).toString(), 'gwei')),
                'ether',
                `with ${currentGasPriceInNetwork} gwei gas price`
            ]
        };

        return {
            data: data.encodeABI(),
            contract_address: abi_bank_sampah.contract_address    
        };
    } catch (error) {
        console.error('Error during tukarPoin:', error);
        throw error;
    }
}

async function cekSaldo(_user) {
    try {
        let web3main = new Web3(rpc);
        let loadContract = new web3main.eth.Contract(abi_bank_sampah.abi, abi_bank_sampah.contract_address);

        // Ambil data pengguna dari smart contract
        let user_data = await loadContract.methods.users(_user).call();

        // Periksa apakah pengguna terdaftar
        if (user_data.terdaftar) {
            // Ambil saldo pengguna dari smart contract
            let saldo = user_data.point / 1000000000;

            // Konversi nilai saldo ke format yang diinginkan (misalnya, bagi 10^9)
            let saldoFormatted = saldo / 1000000000; // 1 Ether = 10^9 Wei

            // Mengembalikan saldo yang sudah diformat sebagai angka langsung
            return saldoFormatted;
        } else {
            throw new Error("Pengguna belum terdaftar");
        }
    } catch (error) {
        console.error('Error during cekSaldo:', error);
        throw error;
    }
}

module.exports = {
    daftarPengguna,
    cekPengguna,
    tambahkanTransaksiSampah,
    tukarPoin,
    cekPengguna,
    cekSaldo
};