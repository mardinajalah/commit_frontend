import { getAllDataBarang } from '@/data';
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
  
  return (
    <>
      <TampilanUtama link='/dashboard/barang/tambah-barang'>
        <Table
          datas={tableData}
          to=''
          onDelete={() => {}}
        />
      </TampilanUtama>
    </>
  );
};

export default Barang;
