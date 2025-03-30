import { Routes, Route } from "react-router-dom"
import Dashboard from "@/components/pages/Dashboard"
import Pembeli from "@/components/pages/transaksi/Pembeli"
import Penjual from "@/components/pages/transaksi/Penjual"
import HutangPenjual from "@/components/pages/transaksi/HutangPenjual"
import Barang from "@/components/pages/master-data/barang"
import TambahBarang from "@/components/pages/master-data/barang/TambahBarang"
import Kategori from "@/components/pages/master-data/kategori"
import NotFound from "@/components/pages/404"

const RoutesIndex = () => {
  return (
    <Routes>
      <Route path="/" element={<h1>selamat Datang</h1>} />
      <Route path="/dashboard" element={Dashboard()} />
      <Route path="/pembeli" element={Pembeli()} />
      <Route path="/penjual" element={Penjual()} />
      <Route path="/hutang-penjual" element={HutangPenjual()} />
      <Route path="/barang" element={Barang()} />
      <Route path="/barang/tambah-barang" element={TambahBarang()} />
      <Route path="/kategori" element={Kategori()} />
      <Route path="/*" element={NotFound()} />
    </Routes>
  )
}

export default RoutesIndex