let contractAddress; // Variabel untuk menyimpan alamat kontrak
let data; // Variabel untuk menyimpan data yang dihasilkan
let userAddress; // Variabel untuk menyimpan alamat pengguna
let accounts = []; // Inisialisasi accounts

async function daftarPengguna() {
    const userAddressInput = $('#userAddress').val();
    const nama = $('#nama').val();
    const alamat = $('#alamat').val();
    const informasiKontak = $('#informasiKontak').val();

    try {
        // Kirim permintaan ke backend untuk mendaftarkan pengguna
        const result = await $.ajax({
            url: 'http://localhost:8080/bank/daftarPengguna',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                sender: '0x9C6991Dcf4252D8e71bb5c4164541B6D6d81f47A',
                user: userAddressInput,
                nama: nama,
                alamat: alamat,
                informasiKontak: informasiKontak
            })
        });

        // Simpan alamat kontrak dan data yang dihasilkan
        contractAddress = result.contract_address;
        data = result.data;
        userAddress = userAddressInput; // Simpan alamat pengguna

        // Tampilkan informasi di frontend
        $('#status').text(`Pengguna ${userAddress} berhasil didaftarkan!`);

        alert('Data pengguna berhasil disimpan. Gunakan tombol Buka MetaMask untuk Konfirmasi setelah selesai pendaftaran pengguna.');

        // Ambil akun setelah mendaftarkan pengguna
        await getAccount();

    } catch (error) {
        $('#status').text(`Error: ${error.responseJSON ? error.responseJSON.error : error.message}`);
    }
}

async function getAccount() {
    try {
        accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0]; // Simpan alamat Ethereum pengguna
    } catch (error) {
        console.error(error);
        $('#status').text(`Error: ${error.message}`);
    }
}

function openMetaMask() {
    if (!contractAddress || !data || !userAddress) {
        alert('Silakan daftar pengguna terlebih dahulu.');
        return;
    }

    ethereum
        .request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: userAddress, // Menggunakan alamat Ethereum pengguna
                    to: contractAddress,
                    value: '0x0',
                    gasLimit: '0x5028',
                    maxPriorityFeePerGas: '0x3b9aca00',
                    maxFeePerGas: '0x2540be400',
                    data: data,
                },
            ],
        })
        .then((txHash) => {
            console.log(txHash);
            alert(`Konfirmasi di MetaMask berhasil. Hash transaksi: ${txHash}`);
        })
        .catch((error) => {
            console.error(error);
            alert(`Error: ${error.message}`);
        });
}

async function tambahTransaksiSampah() {
    const jenisSampah = $('#jenisSampah').val();
    const berat = $('#berat').val();
    const tanggal = new Date($('#tanggal').val()).getTime() / 1000;
    const userAddressInput = $('#userAddressTransaksi').val();

    try {
        // Kirim permintaan ke backend untuk menambah transaksi sampah
        const result = await $.ajax({
            url: 'http://localhost:8080/bank/tambahkanTransaksiSampah',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                jenisSampah: jenisSampah,
                berat: berat,
                tanggal: tanggal,
                user: userAddressInput,
                sender: '0x9C6991Dcf4252D8e71bb5c4164541B6D6d81f47A'
            })
        });

        // Simpan alamat kontrak dan data yang dihasilkan
        contractAddress = result.contract_address;
        data = result.data;
        userAddress = userAddressInput; // Simpan alamat pengguna

        // Tampilkan informasi di frontend
        $('#status').text(`Transaksi sampah berhasil ditambahkan! Hash transaksi: ${result.transactionHash}`);

        alert('Data transaksi sampah berhasil disimpan. Gunakan tombol Buka MetaMask untuk Konfirmasi setelah selesai menambahkan transaksi.');

        // Ambil akun setelah menambahkan transaksi sampah
        await getAccount();
        
        // Konfirmasi transaksi sampah menggunakan MetaMask
        openMetaMask();

    } catch (error) {
        $('#status').text(`Error: ${error.responseJSON ? error.responseJSON.error : error.message}`);
    }
}

// Fungsi untuk cek pengguna
function cekPengguna() {
    const userAddressCek = $('#userAddressCek').val();

    $.ajax({
        url: 'http://localhost:8080/bank/cekPengguna',
        method: 'GET',
        data: {
            user: userAddressCek
        },
        success: function (result) {
            $('#status').text(`Informasi Pengguna ${userAddressCek}: ${JSON.stringify(result)}`);
        },
        error: function (error) {
            $('#status').text(`Error: ${error.responseJSON ? error.responseJSON.error : error.message}`);
        }
    });
}

// File: frontend.js

// ...

async function cekSaldo() {
    const userAddressCekSaldo = $('#userAddressCekSaldo').val();

    try {
        // Kirim permintaan ke backend untuk cek saldo
        const result = await $.ajax({
            url: 'http://localhost:8080/bank/cekSaldo',
            method: 'GET',
            data: {
                user: userAddressCekSaldo
            }
        });

        // Periksa apakah 'error' ada dalam respons
        if ('error' in result) {
            $('#statusCekSaldo').text(`Error: ${result.error}`);
        } else {
            // Tampilkan informasi di frontend
            $('#statusCekSaldo').text(`Poin Pengguna ${userAddressCekSaldo}: ${result.saldo}`);
        }

    } catch (error) {
        $('#statusCekSaldo').text(`Error: ${error.message}`);
    }
}




async function tukarPoin() {
    const alamatPengguna = $('#alamatPengguna').val();
    const jumlahPoin = $('#jumlahPoin').val();

    try {
        // Kirim permintaan ke backend untuk tukar poin
        const result = await $.ajax({
            url: 'http://localhost:8080/bank/tukarPoin',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                point: parseInt(jumlahPoin), // Parse jumlahPoin ke tipe integer
                sender: alamatPengguna
            })
        });

        // Simpan alamat kontrak dan data yang dihasilkan
        const contractAddress = result.contract_address;
        const data = result.data;

        // Tampilkan informasi di frontend
        $('#statusTukarPoin').text(`Poin Pengguna ${alamatPengguna}: ${result.message}`);

        // Ambil akun setelah tukar poin
        await getAccount();

        // Konfirmasi tukar poin menggunakan MetaMask
        ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        from: userAddress, // Menggunakan alamat Ethereum pengguna
                        to: contractAddress,
                        value: '0x0',
                        gasLimit: '0x5028',
                        maxPriorityFeePerGas: '0x3b9aca00',
                        maxFeePerGas: '0x2540be400',
                        data: data,
                    },
                ],
            })
            .then((txHash) => {
                console.log(txHash);
                alert(`Konfirmasi di MetaMask berhasil. Hash transaksi: ${txHash}`);
            })
            .catch((error) => {
                console.error(error);
                alert(`Error: ${error.message}`);
            });

    } catch (error) {
        $('#statusTukarPoin').text(`Error: ${error.responseJSON.error}`);
    }
}






// Panggil fungsi cekPoinPengguna() saat tombol di klik
$('#btnCekPoin').click(function () {
    cekPoinPengguna();
});

// Panggil fungsi cekPengguna() saat tombol di klik
$('#btnCekPengguna').click(function () {
    cekPengguna();
});

// Panggil fungsi tambahTransaksiSampah() saat tombol di klik
$('#btnTambahTransaksi').click(function () {
    tambahTransaksiSampah();
});
