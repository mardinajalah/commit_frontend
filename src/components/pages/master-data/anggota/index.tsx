import Table from "@/components/daisyUI/Table";
import { getAllDataAnggota, deleteAnggota } from "@/data";
import TampilanUtama from "../TampilanUtama";
import { useEffect, useState } from "react";
import { AnggotaType } from "@/data/interface";

const Anggota = () => {
  const [tableData, setTableData] = useState<
    { title: string; header: string[]; data: AnggotaType[] }[]
  >([]);

  const fetchData = () => {
    getAllDataAnggota().then((res) => {
      setTableData([res]);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      try {
        await deleteAnggota(id);
        fetchData(); // Refresh data
      } catch (err) {
        console.error("Gagal menghapus data:", err);
      }
    }
  };

  return (
    <>
      <TampilanUtama link="/dashboard/anggota/tambah-anggota">
        <Table
          datas={tableData}
          to="/dashboard/anggota/tambah-anggota"
          onDelete={handleDelete}
          idFild="nip"
        />
      </TampilanUtama>
    </>
  );
};

export default Anggota;
