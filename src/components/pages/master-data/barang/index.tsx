import { dataBarang } from '@/data';
import TampilanUtama from '../TampilanUtama';
import Table from '@/components/daisyUI/Table';

const Barang = () => {
  return (
    <>
      <TampilanUtama link='/dashboard/barang/tambah-barang'>
        <Table
          datas={dataBarang}
          to=''
          onDelete={() => {}}
        />
      </TampilanUtama>
    </>
  );
};

export default Barang;
