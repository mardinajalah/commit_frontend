import Table from "@/components/daisyUI/Table";
import { dataBarang } from "@/data";
import TampilanUtama from "../TampilanUtama";

const Anggota = () => {
  return (
    <>
      <TampilanUtama link="/dashboard/anggota/tambah-anggota">
        <Table datas={dataBarang} />
      </TampilanUtama>
    </>
  );
};

export default Anggota;
