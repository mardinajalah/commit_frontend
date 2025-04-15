import Table from "@/components/daisyUI/Table";
import { getAllDataPenitip, deletePenitip } from "@/data";
import TampilanUtama from "../TampilanUtama";
import { useEffect, useState } from "react";
import { PenitipType } from "@/data/interface";

const Penitip = () => {
  const [tableData, setTableData] = useState<
    { title: string; header: string[]; data: PenitipType[] }[]
  >([]);

  const fetchData = () => {
    getAllDataPenitip().then((res) => {
      setTableData([res]);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      try {
        await deletePenitip(id);
        fetchData(); // Refresh data
      } catch (err) {
        console.error("Gagal menghapus data:", err);
      }
    }
  };

  return (
    <>
      <TampilanUtama link="/dashboard/penitip/tambah-penitip">
        <Table
          datas={tableData}
          to="/dashboard/penitip/tambah-penitip"
          onDelete={handleDelete}
        />
      </TampilanUtama>
    </>
  );
};

export default Penitip;
