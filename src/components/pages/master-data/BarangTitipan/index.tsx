import Table from "@/components/daisyUI/Table";
import { getAllDataBarangTitipan, deleteBarangTitipan } from "@/data";
import TampilanUtama from "../TampilanUtama";
import { useEffect, useState } from "react";
import { BarangTitipanType } from "@/data/interface";

const BarangTitipan = () => {
  const [tableData, setTableData] = useState<
    { title: string; header: string[]; data: BarangTitipanType[] }[]
  >([]);

  const fetchData = () => {
    getAllDataBarangTitipan().then((res) => {
      setTableData([res]);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      try {
        await deleteBarangTitipan(id);
        fetchData(); // Refresh data
      } catch (err) {
        console.error("Gagal menghapus data:", err);
      }
    }
  };

  return (
    <>
      <TampilanUtama link="/dashboard/barang-titipan/tambah-barang-titipan">
        <Table
          datas={tableData}
          to="/dashboard/barang-titipan/tambah-barang-titipan"
          onDelete={handleDelete}
        />
      </TampilanUtama>
    </>
  );
};

export default BarangTitipan;
