import Table from "@/components/daisyUI/Table";
import { getAllDataSatuan } from "@/data";
import TampilanUtama from "../TampilanUtama";
import { useEffect, useState } from "react";
import { SatuanType } from "@/data/interface";

interface TabelDataType {
  title: string;
  columns: string[];
  data: SatuanType[];
}

const Satuan = () => {
  const [tableData, setTableData] = useState<TabelDataType[]>([]);

  useEffect(() => {
    getAllDataSatuan().then((res) => {
      setTableData([res]);
    });
  }, []);
  
  return (
    <>
      <TampilanUtama link="/dashboard/satuan/tambah-satuan">
        <Table datas={tableData} />
      </TampilanUtama>
    </>
  );
};

export default Satuan;
