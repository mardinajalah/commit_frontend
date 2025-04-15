import { deleteBarang, getAllDataBarang } from '@/data';
import TampilanUtama from '../TampilanUtama';
import Table from '@/components/daisyUI/Table';
import { useEffect, useState } from "react";
import { BarangType } from '@/data/interface';

const Barang = () => {
  const [tableData, setTableData] = useState<{ title: string; header: string[]; data: BarangType[] }[]>([]);

  const fetchData = () => {
    getAllDataBarang().then((res) => {
      setTableData([res]);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      try {
        await deleteBarang(id);
        fetchData();
      } catch (err) {
        console.error("Gagal menghapus data:", err);
      }
    }
  };
  
  return (
    <>
      <TampilanUtama link='/dashboard/barang/tambah-barang'>
        <Table
          datas={tableData}
          to='/dashboard/barang/tambah-barang'
          onDelete={handleDelete}
        />
      </TampilanUtama>
    </>
  );
};

export default Barang;
