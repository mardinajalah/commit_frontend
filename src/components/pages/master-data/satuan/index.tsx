import Table from "@/components/daisyUI/Table";
import { Link } from "react-router-dom";
import { dataSatuan } from "@/data";

const Satuan = () => {
  return (
    <div className="p-5">
      <div className="flex justify-end my-3">
        <Link
          to="/dashboard/sataun/tambah-satuan"
          className="btn border-none bg-[#6C0AFF] text-white rounded-2xl"
        >
          Tambah Satuan
        </Link>
      </div>
      <div className="mt-5 bg-[#fff] rounded-lg">
        <Table datas={dataSatuan} />
      </div>
    </div>
  );
};

export default Satuan;
