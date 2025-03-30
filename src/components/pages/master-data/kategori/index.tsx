import Table from "@/components/daisyUI/Table";
import { Link } from "react-router-dom";
import { dataKategori } from "@/data";

const Kategori = () => {
  return (
    <div className='p-5'>
      <div className='flex justify-end my-3'>
        <Link to='/kategori/tambah-kategori' className='btn border-none bg-[#6C0AFF] text-white rounded-2xl'>
          Tambah Kategori
        </Link>
      </div>
      <div className='mt-5 bg-[#fff] rounded-lg'>
        <Table datas={dataKategori} />
      </div>
    </div>
  );
};

export default Kategori;
