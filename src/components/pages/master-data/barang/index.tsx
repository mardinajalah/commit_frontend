import Table from "@/components/daisyUI/Table";
import { Link } from "react-router-dom";
import { dataBarang } from "@/data";

const Barang = () => {
  return (
    <div className="p-5">
      <div className="flex justify-end my-3">
        <Link
          to="/dashboard/barang/tambah-barang"
          className="btn border-none bg-[#6C0AFF] text-white rounded-2xl"
        >
          Tambah Barang
        </Link>
      </div>
      <div className="mt-5 bg-[#fff] rounded-lg">
        <Table datas={dataBarang} />
      </div>
    </div>
  );
};

export default Barang;
