import Table from "@/components/daisyUI/Table";
import { deleteSupplier, getAllDataSupplier } from "@/data";
import TampilanUtama from "../TampilanUtama";
import { useEffect, useState } from "react";
import { SupplierType } from "@/data/interface";

const Supplier = () => {
  const [tableData, setTableData] = useState<
    { title: string; header: string[]; data: SupplierType[] }[]
  >([]);

  const fetchData = () => {
    getAllDataSupplier().then((res) => {
      setTableData([res]);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      try {
        await deleteSupplier(id);
        fetchData(); // Refresh data
      } catch (err) {
        console.error("Gagal menghapus data:", err);
      }
    }
  };

  return (
    <>
      <TampilanUtama link="/dashboard/supplier/tambah-supplier">
        <Table
          datas={tableData}
          to="/dashboard/supplier/tambah-supplier"
          onDelete={handleDelete}
        />
      </TampilanUtama>
    </>
  );
};

export default Supplier;
