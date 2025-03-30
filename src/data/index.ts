export const dataAccordion = [
  {
    id: 1,
    title: "Transaksi",
    items: [
      {
        id: 1,
        title: "Pembelian",
        path: "/pembeli",
      },
      {
        id: 2,
        title: "Penjualan",
        path: "/penjual",
      },
      {
        id: 3,
        title: "Hutang penjualan",
        path: "/hutang-penjual",
      },
      {
        id: 4,
        title: "Penjualan Titipan",
        path: "/titipan",
      },
      {
        id: 5,
        title: "Hutang Titipan",
        path: "/hutang-titipan",
      },
    ],
  },
  {
    id: 2,
    title: "Laporan",
    items: [
      {
        id: 1,
        title: "Laporan Penjualan",
        path: "/laporan-penjualan",
      },
      {
        id: 2,
        title: "Laporan Pembelian",
        path: "/laporan-pembelian",
      },
      {
        id: 3,
        title: "Laporan Piutang",
        path: "/laporan-piutang",
      },
      {
        id: 4,
        title: "Belanja Anggota",
        path: "/belanja-anggota",
      },
      {
        id: 5,
        title: "Laporan Transaksi",
        path: "/laporan-transaksi",
      },
      {
        id: 6,
        title: "Laporan Titipan",
        path: "/laporan-titipan",
      },
      {
        id: 7,
        title: "Pengeluaran",
        path: "/pengeluaran",
      },
    ],
  },
  {
    id: 3,
    title: "Master Data",
    items: [
      {
        id: 1,
        title: "Barang",
        path: "/barang",
      },
      {
        id: 2,
        title: "Kategori",
        path: "/kategori",
      },
      {
        id: 3,
        title: "Satuan",
        path: "/satuan",
      },
      {
        id: 4,
        title: "Pengurus",
        path: "/pengurus",
      },
      {
        id: 5,
        title: "Supplier",
        path: "/supplier",
      },
      {
        id: 6,
        title: "Petugas",
        path: "/petugas",
      },
      {
        id: 7,
        title: "Barang Titipan",
        path: "/barang-titipan",
      },
      {
        id: 8,
        title: "Penitip",
        path: "/penitip",
      },
    ],
  },
];

export const dataBarang = [
  {
    title: "barang",
    heders: ["id barang", "nama barang", "harga beli", "harga ecer", "harga grosir", "stok", "stok minimal", "barcode", "gambar", "kategori", "ukuran", "satuan", "status aktif"],
    data: [
      {
        id: "236472",
        name: "Sampoerna Ice Burst 20",
        hargaBeli: "Rp 30.128",
        hargaEcer: "Rp 30.128",
        hargaGrosir: "Rp 30.128",
        stok: "2,459 pcs",
        stokMinimal: "2,459 pcs",
        barcode: "1234567890",
        gambar: "gambar.jpg",
        kategori: "Makanan",
        ukuran: "Medium",
        satuan: "KG",
        status: "yes",
      },
    ],
  },
];

export const dataKategori = [{
  title: "kategori",
  heders: ["kode kategori", "nama", "aktif"],
  data: [
    {
      id: "1",
      nama: "Makanan",
      aktif: "yes",
    },
    {
      id: "2",
      nama: "Minuman",
      aktif: "yes",
    },
  ],
}]