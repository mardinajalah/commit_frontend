import { Link } from "react-router-dom";

const DataNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 min-h-[400px] p-10 mt-28 rounded-xl z-10 mx-auto text-center bg-white sm:max-w-[600px] shadow-lg">
      <img
        src="/image/undraw_no-data_ig65.png"
        alt="Data Not Found"
        className="w-64 h-auto mx-auto mb-8"
      />
      <h2 className="text-2xl font-bold text-black">Data Tidak Ditemukan</h2>
      <p className="text-base text-gray-600 mt-3">
        Coba periksa kembali atau muat ulang data.
      </p>
    </div>
  );
};

export default DataNotFound;
