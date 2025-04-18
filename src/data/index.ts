import axios from "axios";

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
        title: "Anggota",
        path: "/dashboard/anggota",
      },
      {
        id: 5,
        title: "Pengurus",
        path: "/dashboard/pengurus",
      },
      {
        id: 6,
        title: "Supplier",
        path: "/dashboard/supplier",
      },
      {
        id: 7,
        title: "Petugas",
        path: "/dashboard/petugas",
      },
      {
        id: 8,
        title: "Barang Titipan",
        path: "/dashboard/barang-titipan",
      },
      {
        id: 9,
        title: "Penitip",
        path: "/dashboard/penitip",
      },
    ],
  },
];
//   {
//     title: 'barang',
//     header: ['id barang', 'nama barang', 'harga beli', 'harga ecer', 'harga grosir', 'stok', 'stok minimal', 'barcode', 'gambar', 'kategori', 'ukuran', 'satuan', 'status aktif'],
//     data: [
//       {
//         id: '12345',
//         name: 'Sampoerna Ice Burst 20',
//         hargaBeli: 'Rp 30.128',
//         hargaEcer: 'Rp 30.128',
//         hargaGrosir: 'Rp 30.128',
//         stok: '2,459 pcs',
//         stokMinimal: '2,459 pcs',
//         barcode: '1234567890',
//         gambar: 'gambar.jpg',
//         kategori: 'Makanan',
//         ukuran: 'Medium',
//         satuan: 'KG',
//         status: 'yes',
//       },
//     ],
//   },
// ];

export const getAllDataBarang = () => {
  const datas = axios
    .get("http://localhost:3000/api/product")
    .then((res) => res.data)
    .catch((err) => (console.log(err), []));

  return datas;
};

export const deleteBarang = (id: string) => {
  return axios.delete(`http://localhost:3000/api/product/${id}`);
};

export const getAllDataSatuan = () => {
  const datas = axios
    .get("http://localhost:3000/api/unit")
    .then((res) => res.data)
    .catch((err) => (console.log(err), []));

  return datas;
};

export const deleteSatuan = (id: string) => {
  return axios.delete(`http://localhost:3000/api/unit/${id}`);
};

export const getAllDataKategori = () => {
  const datas = axios
    .get("http://localhost:3000/api/category")
    .then((res) => res.data)
    .catch((err) => (console.log(err), []));

  return datas;
};

export const deleteKategori = (id: string) => {
  return axios.delete(`http://localhost:3000/api/category/${id}`);
};

export const getAllDataAnggota = () => {
  const datas = axios
    .get("http://localhost:3000/api/member")
    .then((res) => res.data)
    .catch((err) => (console.log(err), []));

  return datas;
};

export const deleteAnggota = (id: string) => {
  return axios.delete(`http://localhost:3000/api/member/${id}`);
};

export const getAllDataSupplier = () => {
  const datas = axios
    .get("http://localhost:3000/api/supplier")
    .then((res) => res.data)
    .catch((err) => (console.log(err), []));

  return datas;
};

export const deleteSupplier = (id: string) => {
  return axios.delete(`http://localhost:3000/api/supplier/${id}`);
};

export const getAllDataBarangTitipan = () => {
  const datas = axios
    .get("http://localhost:3000/api/vendor_product")
    .then((res) => res.data)
    .catch((err) => (console.log(err), []));

  return datas;
};

export const deleteBarangTitipan = (id: string) => {
  return axios.delete(`http://localhost:3000/api/vendor_product/${id}`);
};

export const getAllDataPenitip = () => {
  const datas = axios
    .get("http://localhost:3000/api/vendor")
    .then((res) => res.data)
    .catch((err) => (console.log(err), []));

  return datas;
};

export const deletePenitip = (id: string) => {
  return axios.delete(`http://localhost:3000/api/vendor/${id}`);
};
