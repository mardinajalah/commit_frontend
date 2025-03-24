import { Routes, Route } from "react-router-dom"
import Dashboard from "@/components/pages/Dashboard"
import Pembeli from "@/components/pages/Pembeli"
import Penjual from "@/components/pages/Penjual"
import HutangPenjual from "@/components/pages/HutangPenjual"
import NotFound from "@/components/pages/404"

const RoutesIndex = () => {
  return (
    <Routes>
      <Route path="/" element={<h1>selamat Datang</h1>} />
      <Route path="/dashboard" element={Dashboard()} />
      <Route path="/pembeli" element={Pembeli()} />
      <Route path="/penjual" element={Penjual()} />
      <Route path="/hutang-penjual" element={HutangPenjual()} />
      <Route path="/*" element={NotFound()} />
    </Routes>
  )
}

export default RoutesIndex