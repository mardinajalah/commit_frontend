import { Routes, Route } from "react-router-dom";
import Pembeli from "@/components/pages/transaksi/Pembeli";
import Penjual from "@/components/pages/transaksi/Penjual";
import HutangPenjual from "@/components/pages/transaksi/HutangPenjual";
import Barang from "@/components/pages/master-data/barang";
import TambahBarang from "@/components/pages/master-data/barang/TambahBarang";
import Kategori from "@/components/pages/master-data/kategori";
import Dashboard from "@/components/pages/Dashboard";
import Satuan from "@/components/pages/master-data/satuan";
import DataNotFound from "@/components/pages/OtherPage/DataNotFound";
import TambahKategori from "@/components/pages/master-data/kategori/TambahKategori";
import Anggota from "@/components/pages/master-data/anggota";
import TambahAnggota from "@/components/pages/master-data/anggota/TambahAnggota";
import TambahSatuan from "@/components/pages/master-data/satuan/TambahSatuan";
import Supplier from "@/components/pages/master-data/supplier";
import TambahSupplier from "@/components/pages/master-data/supplier/TambahSupplier";

const LayoutRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="pembeli" element={<Pembeli />} />
      <Route path="penjual" element={<Penjual />} />
      <Route path="hutang-penjual" element={<HutangPenjual />} />
      <Route path="barang" element={<Barang />} />
      <Route path="barang/tambah-barang" element={<TambahBarang />} />
      <Route path="barang/tambah-barang/:id" element={<TambahBarang />} />
      <Route path="satuan" element={<Satuan />} />
      <Route path="satuan/tambah-satuan" element={<TambahSatuan />} />
      <Route path="satuan/tambah-satuan/:id" element={<TambahSatuan />} />
      <Route path="anggota" element={<Anggota />} />
      <Route path="kategori" element={<Kategori />} />
      <Route path="kategori/tambah-kategori" element={<TambahKategori />} />
      <Route path="kategori/tambah-kategori/:id" element={<TambahKategori />} />
      <Route path="anggota" element={<Anggota />} />
      <Route path="anggota/tambah-anggota" element={<TambahAnggota />} />
      <Route path="anggota/tambah-anggota/:nip" element={<TambahAnggota />} />
      <Route path="supplier" element={<Supplier />} />
      <Route path="supplier/tambah-supplier" element={<TambahSupplier />} />
      <Route path="supplier/tambah-supplier/:id" element={<TambahSupplier />} />

      <Route path="*" element={<DataNotFound />} />
    </Routes>
  );
};

export default LayoutRouter;
