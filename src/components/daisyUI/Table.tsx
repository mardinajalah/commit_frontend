import { useState } from "react";
import { getPagination } from "@/components/layouts/Pagination";

type tableProps = {
  title: string;
  columns: string[];
  data: { [key: string]: string }[];
}[];



const TableComponent = ({ datas }: { datas: tableProps }) => {
  if (!datas || datas.length === 0)
    return <p className="text-center">Data tidak tersedia</p>;

  const tableData = datas[0]; // Ambil elemen pertama
  const { columns, data } = tableData;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const displayedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 overflow-hidden max-w-full">
      <h1 className="text-2xl font-semibold pb-5">Daftar {tableData.title}</h1>
      <div className="overflow-x-auto w-full">
        <table className="w-full border border-gray-300 rounded-lg min-w-max table-auto">
          <thead className="bg-gray-200">
            <tr className="text-center">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="capitalize p-2 border border-gray-300"
                >
                  {column}
                </th>
              ))}
              <th className="p-2 border border-gray-300">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {displayedData.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className="bg-white hover:bg-gray-100 text-center"
              >
                {Object.values(item).map((value, colIndex) => (
                  <td key={colIndex} className="p-2 border border-gray-300">
                    {value}
                  </td>
                ))}
                <td className="p-2 border border-gray-300">
                  <button className="cursor-pointer px-2 py-1 bg-yellow-500 text-white rounded mr-2">
                    ✏️
                  </button>
                  <button className="cursor-pointer px-2 py-1 bg-red-500 text-white rounded">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          className="px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-200 disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {getPagination(currentPage, totalPages).map((item, index) => (
          <button
            key={index}
            className={`px-4 py-2 border border-gray-300 rounded text-sm ${
              item === currentPage
                ? "bg-blue-500 text-white"
                : item === "..."
                ? "bg-white text-gray-500 cursor-default"
                : "bg-white hover:bg-gray-200"
            }`}
            disabled={item === "..."}
            onClick={() => typeof item === "number" && setCurrentPage(item)}
          >
            {item}
          </button>
        ))}

        <button
          className="px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-200 disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableComponent;
