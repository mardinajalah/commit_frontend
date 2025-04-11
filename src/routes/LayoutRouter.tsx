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

const LayoutRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/pembeli" element={<Pembeli />} />
      <Route path="/penjual" element={<Penjual />} />
      <Route path="/hutang-penjual" element={<HutangPenjual />} />
      <Route path="/barang" element={<Barang />} />
      <Route path="/barang/tambah-barang" element={<TambahBarang />} />
      <Route path="/satuan" element={<Satuan />} />
      <Route path="/kategori" element={<Kategori />} />
      <Route path="/*" element={<DataNotFound />} />
    </Routes>
  );
};

export default LayoutRouter;
