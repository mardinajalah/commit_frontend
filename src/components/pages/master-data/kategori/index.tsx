import Table from "@/components/daisyUI/Table";
import { dataKategori } from "@/data";
import TampilanUtama from "../TampilanUtama";

const Kategori = () => {
  return (
    <TampilanUtama link="/dashboard/kategori/tambah-kategori">
      <Table datas={dataKategori} />
    </TampilanUtama>
  );
};

export default Kategori;
