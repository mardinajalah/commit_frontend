import React, { useState } from "react";

const TableComponent: React.FC = () => {
  const allData = Array(10).fill({
    id: 236472,
    name: "Sampoerna Ice Burst 20",
    hargaBeli: "Rp 30.128",
    hargaEcer: "Rp 30.128",
    hargaGrosir: "Rp 30.128",
    stok: "2,459 pcs",
    stokMinimal: "2,459 pcs",
    barcode: "1234567890",
    gambar: "https://via.placeholder.com/40",
    kategori: "Makanan",
    ukuran: "Medium",
    satuan: "KG",
    status: "Yes",
    aktif: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(allData.length / itemsPerPage);
  const displayedData = allData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-4 overflow-hidden max-w-full">
      <h1 className="text-2xl font-semibold pb-5">Data Barang</h1>
      <div className="overflow-x-auto w-full">
        <table className="w-full border border-gray-300 rounded-lg min-w-max table-auto">
          <thead className="bg-gray-200">
            <tr className="text-left">
              <th className="p-2 border border-gray-300">ID Barang</th>
              <th className="p-2 border border-gray-300">Nama Barang</th>
              <th className="p-2 border border-gray-300">Harga Beli</th>
              <th className="p-2 border border-gray-300">Harga Ecer</th>
              <th className="p-2 border border-gray-300">Harga Grosir</th>
              <th className="p-2 border border-gray-300">Stok</th>
              <th className="p-2 border border-gray-300">Stok Minimal</th>
              <th className="p-2 border border-gray-300">Kategori</th>
              <th className="p-2 border border-gray-300">Satuan</th>
              <th className="p-2 border border-gray-300">Gambar</th>
              <th className="p-2 border border-gray-300">Ukuran</th>
              <th className="p-2 border border-gray-300">Barcode</th>
              <th className="p-2 border border-gray-300">Status</th>
              <th className="p-2 border border-gray-300">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {displayedData.map((item, index) => (
              <tr key={index} className="bg-white hover:bg-gray-100">
                <td className="p-2 border border-gray-300">{item.id}</td>
                <td className="p-2 border border-gray-300">{item.name}</td>
                <td className="p-2 border border-gray-300">{item.hargaBeli}</td>
                <td className="p-2 border border-gray-300">{item.hargaEcer}</td>
                <td className="p-2 border border-gray-300">{item.hargaGrosir}</td>
                <td className="p-2 border border-gray-300">{item.stok}</td>
                <td className="p-2 border border-gray-300">{item.stokMinimal}</td>
                <td className="p-2 border border-gray-300">{item.kategori}</td>
                <td className="p-2 border border-gray-300">{item.satuan}</td>
                <td className="p-2 border border-gray-300"><img src={item.gambar} alt="Gambar" className="w-10 h-10" /></td>
                <td className="p-2 border border-gray-300">{item.ukuran}</td>
                <td className="p-2 border border-gray-300">{item.barcode}</td>
                <td className="p-2 border border-gray-300 text-green-600 font-bold">{item.status}</td>
                <td className="p-2 border border-gray-300">
                  <button className="px-2 py-1 bg-yellow-500 text-white rounded mr-2">✏️</button>
                  <button className="px-2 py-1 bg-red-500 text-white rounded">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        <button
          className="px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-200"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-4 py-2 border border-gray-300 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-200"}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-200"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableComponent;
