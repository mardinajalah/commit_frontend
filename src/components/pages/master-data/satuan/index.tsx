import Table from "@/components/daisyUI/Table";
import { getAllDataSatuan, deleteSatuan } from "@/data";
import TampilanUtama from "../TampilanUtama";
import { useEffect, useState } from "react";
import { SatuanType } from "@/data/interface";

const Satuan = () => {
  const [tableData, setTableData] = useState<{ title: string; header: string[]; data: SatuanType[] }[]>([]);

  const fetchData = () => {
    getAllDataSatuan().then((res) => {
      setTableData([res]);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      try {
        await deleteSatuan(id);
        fetchData(); // Refresh data
      } catch (err) {
        console.error("Gagal menghapus data:", err);
      }
    }
  };

  return (
    <>
      <TampilanUtama link="/dashboard/satuan/tambah-satuan">
        <Table
          datas={tableData}
          to="/dashboard/satuan/tambah-satuan"
          onDelete={handleDelete}
        />
      </TampilanUtama>
    </>
  );
};

export default Satuan;
