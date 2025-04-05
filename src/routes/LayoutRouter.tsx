import { Routes, Route } from "react-router-dom"
import Pembeli from "@/components/pages/transaksi/Pembeli"
import Penjual from "@/components/pages/transaksi/Penjual"
import HutangPenjual from "@/components/pages/transaksi/HutangPenjual"
import Barang from "@/components/pages/master-data/barang"
import TambahBarang from "@/components/pages/master-data/barang/TambahBarang"
import Kategori from "@/components/pages/master-data/kategori"
import Dashboard from "@/components/pages/Dashboard"

const LayoutRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/pembeli" element={<Pembeli />} />
      <Route path="/penjual" element={<Penjual />} />
      <Route path="/hutang-penjual" element={<HutangPenjual />} />
      <Route path="/barang" element={<Barang/>} />
      <Route path="/barang/tambah-barang" element={<TambahBarang />} />
      <Route path="/kategori" element={<Kategori />} />
      <Route path="/*" element={<h1>data tidak di temukan</h1>} />
    </Routes>
  )
}

export default LayoutRouter