import Table from "@/components/daisyUI/Table";
import { getAllDataKategori, deleteKategori } from "@/data";
import TampilanUtama from "../TampilanUtama";
import { useEffect, useState } from "react";
import { KategoriType } from "@/data/interface";

const Kategori = () => {
  const [tableData, setTableData] = useState<
    { title: string; header: string[]; data: KategoriType[] }[]
  >([]);

  const fetchData = () => {
    getAllDataKategori().then((res) => {
      setTableData([res]);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      try {
        await deleteKategori(id);
        fetchData(); // Refresh data
      } catch (err) {
        console.error("Gagal menghapus data:", err);
      }
    }
  };

  return (
    <>
      <TampilanUtama link="/dashboard/kategori/tambah-kategori">
        <Table
          datas={tableData}
          to="/dashboard/kategori/tambah-kategori"
          onDelete={handleDelete}
        />
      </TampilanUtama>
    </>
  );
};

export default Kategori;
