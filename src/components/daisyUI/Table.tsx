import { useEffect, useState } from 'react';
import { getPagination } from '../layouts/Pagination';
import { Link } from 'react-router-dom';

type TableProps = {
  datas: {
    title: string;
    header: string[];
    data: any[];
  }[];
  to: string;
  onDelete: (id: string) => void;
};

const Table = ({ datas, to, onDelete }: TableProps) => {
  if (!datas || datas.length === 0) return <p className='text-center'>Data tidak tersedia</p>;

  const tableData = datas[0];
  const { header, data } = tableData;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // 🔁 Atur ulang currentPage jika melebihi total halaman baru
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [data.length, totalPages]);

  const displayedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className='p-4 overflow-hidden max-w-full'>
      <h1 className='text-2xl font-semibold pb-5'>Daftar {tableData.title}</h1>
      <div className='overflow-x-auto w-full'>
        <table className='w-full border border-gray-300 rounded-lg min-w-max table-auto'>
          <thead className='bg-gray-200'>
            <tr className='text-center'>
              {header.map((column, index) => (
                <th
                  key={index}
                  className='capitalize p-2 border border-gray-300'
                >
                  {column === 'id' ? 'No' : column}
                </th>
              ))}
              <th className='p-2 border border-gray-300'>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {displayedData.length === 0 ? (
              <tr>
                <td
                  colSpan={header.length + 1}
                  className='text-center p-4'
                >
                  Tidak ada data pada halaman ini.
                </td>
              </tr>
            ) : (
              displayedData.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className='bg-white hover:bg-gray-100 text-center'
                >
                  {header.map((column, columnIndex) => (
                    <td
                      key={columnIndex}
                      className='p-2 border border-gray-300'
                    >
                      {column.toLowerCase() === 'id'
                        ? rowIndex + 1 + (currentPage - 1) * itemsPerPage // 🔁 Nomor urut
                        : item[column]}
                    </td>
                  ))}
                  <td className='p-2 border border-gray-300'>
                    <Link
                      to={`${to}/${item.id}`}
                      className='cursor-pointer px-2 py-1 bg-yellow-500 text-white rounded mr-2'
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={() => onDelete(item.id)}
                      className='cursor-pointer px-2 py-1 bg-red-500 text-white rounded'
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='flex justify-center mt-4 space-x-2'>
        <button
          className='px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-200 disabled:opacity-50'
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {getPagination(currentPage, totalPages).map((item, index) => (
          <button
            key={index}
            className={`px-4 py-2 border border-gray-300 rounded text-sm ${item === currentPage ? 'bg-blue-500 text-white' : item === '...' ? 'bg-white text-gray-500 cursor-default' : 'bg-white hover:bg-gray-200'}`}
            disabled={item === '...'}
            onClick={() => typeof item === 'number' && setCurrentPage(item)}
          >
            {item}
          </button>
        ))}

        <button
          className='px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-200 disabled:opacity-50'
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
