export const dataAccordion = [
  {
    id: 1,
    title: "Transaksi",
    items: [
      {
        id: 1,
        title: "Pembelian",
        path: "/dashboard/pembeli",
      },
      {
        id: 2,
        title: "Penjualan",
        path: "/dashboard/penjual",
      },
      {
        id: 3,
        title: "Hutang penjualan",
        path: "/dashboard/hutang-penjual",
      },
      {
        id: 4,
        title: "Penjualan Titipan",
        path: "/dashboard/titipan",
      },
      {
        id: 5,
        title: "Hutang Titipan",
        path: "/dashboard/hutang-titipan",
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
        path: "/dashboard/laporan-penjualan",
      },
      {
        id: 2,
        title: "Laporan Pembelian",
        path: "/dashboard/laporan-pembelian",
      },
      {
        id: 3,
        title: "Laporan Piutang",
        path: "/dashboard/laporan-piutang",
      },
      {
        id: 4,
        title: "Belanja Anggota",
        path: "/dashboard/belanja-anggota",
      },
      {
        id: 5,
        title: "Laporan Transaksi",
        path: "/dashboard/laporan-transaksi",
      },
      {
        id: 6,
        title: "Laporan Titipan",
        path: "/dashboard/laporan-titipan",
      },
      {
        id: 7,
        title: "Pengeluaran",
        path: "/dashboard/pengeluaran",
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
        path: "/dashboard/barang",
      },
      {
        id: 2,
        title: "Kategori",
        path: "/dashboard/kategori",
      },
      {
        id: 3,
        title: "Satuan",
        path: "/dashboard/satuan",
      },
      {
        id: 4,
        title: "Pengurus",
        path: "/dashboard/pengurus",
      },
      {
        id: 5,
        title: "Supplier",
        path: "/dashboard/supplier",
      },
      {
        id: 6,
        title: "Petugas",
        path: "/dashboard/petugas",
      },
      {
        id: 7,
        title: "Barang Titipan",
        path: "/dashboard/barang-titipan",
      },
      {
        id: 8,
        title: "Penitip",
        path: "/dashboard/penitip",
      },
    ],
  },
];

export const dataBarang = [
  {
    title: "barang",
    columns: [
      "id barang",
      "nama barang",
      "harga beli",
      "harga ecer",
      "harga grosir",
      "stok",
      "stok minimal",
      "barcode",
      "gambar",
      "kategori",
      "ukuran",
      "satuan",
      "status aktif",
    ],
    data: Array.from({ length: 100 }, (_, index) => (
      {
        id: `${index + 1}`,
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
      }
    )),
  },
];

export const dataSatuan = [
  {
    title: "satuan",
    columns: ["kode satuan", "satuan", "aktif"],
    data: [
      {
        kodeSatuan: "12345",
        satuan: "KG",
        aktif: "yes",
      },
    ],
  },
];

export const dataKategori = [
  {
    title: "kategori",
    columns: ["kode kategori", "nama", "aktif"],
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
  },
];
