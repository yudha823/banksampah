// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BankSampah is Ownable{

    // Struct untuk menyimpan informasi transaksi sampah
    struct Transaction {
        uint256 idTransaksi;
        address pengguna;
        string jenisSampah;
        uint256 berat;
        uint256 tanggal;
    }
    mapping(uint256 => Transaction) public transactions;

    uint256 public totalTx;

    address public poolToken;
    address public contractToken;

    //data user
    struct User {
        string nama;
        string alamat;
        string informasiKontak;
        bool terdaftar;
        uint point;
    }
    //mapping data user to list users
    mapping(address => User) public users;

    event TransaksiSampahDitambahkan(uint256 indexed idTransaksi, address indexed pengguna, string jenisSampah, uint256 berat, uint256 tanggal, uint timestamp);
    event PoinRewardDitambahkan(address indexed pengguna, uint256 poin, uint timestamp);
    event PenggunaDidaftarkan(address indexed pengguna, string nama, string alamat, string informasiKontak, uint timestamp);

    constructor(address _contractToken) Ownable(msg.sender){
        poolToken = msg.sender;
        contractToken = _contractToken;
    }

    function setPool(address _pool) public onlyOwner {
        poolToken = _pool;
    }

    function setContractToken(address _contractToken) public onlyOwner {
        contractToken = _contractToken;
    }



    // Fungsi untuk mendaftarkan pengguna baru
    function daftarPengguna(
        address _user,
        string memory _nama, 
        string memory _alamat, 
        string memory _informasiKontak
    ) public onlyOwner(){
        require(users[_user].terdaftar == false, "Pengguna sudah terdaftar");

        users[_user] = User(_nama, _alamat, _informasiKontak, true, 0);

        emit PenggunaDidaftarkan(_user, _nama, _alamat, _informasiKontak, block.timestamp);
    }

    // Fungsi untuk menambahkan transaksi sampah
    function tambahkanTransaksiSampah(
        string memory _jenisSampah, 
        uint256 _berat, 
        uint256 _tanggal,
        address _user
    ) public onlyOwner{

        require(_berat > 0, "Berat harus lebih dari 0");
        require(users[_user].terdaftar == true, "Pengguna belum terdaftar");

        // Tingkatkan total transaksi dan gunakan sebagai ID transaksi
        totalTx =  totalTx +1;

        uint256 current_Id = totalTx;

        transactions[current_Id]= Transaction(current_Id, _user, _jenisSampah, _berat, _tanggal);

        emit TransaksiSampahDitambahkan(current_Id, _user, _jenisSampah, _berat, _tanggal, block.timestamp);

        // Hitung poin reward berdasarkan berat sampah (contoh: 1 poin per kilogram)
        users[_user].point =users[_user].point + _berat;
        emit PoinRewardDitambahkan(_user, _berat, block.timestamp);
    }


    // Fungsi untuk menukar poin dengan uang tunai
    function tukarPoin(uint256 _point) public {
        require(users[msg.sender].terdaftar == true, "Pengguna belum terdaftar");

        require(_point > 0, "poin param must not zero");
        require(users[msg.sender].point > 0 && users[msg.sender].point >= _point, "Poin tidak mencukupi");


        //kirim token ke wallet
        IERC20(contractToken).transferFrom(poolToken, msg.sender, _point);
      
      
        users[msg.sender].point = users[msg.sender].point - _point;
    }
}
