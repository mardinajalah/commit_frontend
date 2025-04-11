import Table from "@/components/daisyUI/Table";
import { dataSatuan } from "@/data";
import TampilanUtama from "../TampilanUtama";

const Satuan = () => {
  return (
    <>
      <TampilanUtama link="/dashboard/satuan/tambah-satuan">
        <Table datas={dataSatuan} />
      </TampilanUtama>
    </>
  );
};

export default Satuan;
