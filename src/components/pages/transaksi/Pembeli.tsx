import { FaSearch, FaTrash } from "react-icons/fa";

const Pembeli = () => {
  const products = [
    { kode: "BRG001", nama: "surya", hargaBeli: "", hargaJual: "", hargaGrosir: "", stok: "", subTotal: "" },
    { kode: "BRG001", nama: "surya", hargaBeli: "", hargaJual: "", hargaGrosir: "", stok: "", subTotal: "" },
    { kode: "BRG001", nama: "surya", hargaBeli: "", hargaJual: "", hargaGrosir: "", stok: "", subTotal: "" },
    { kode: "BRG001", nama: "surya", hargaBeli: "", hargaJual: "", hargaGrosir: "", stok: "", subTotal: "" },
  ];

  return (
    <div className='bg-white p-6 rounded-lg shadow-md border border-gray-300 w-full max-w-4xl mx-auto my-10'>
      <h2 className='text-lg font-semibold mb-4'>Form Transaksi</h2>

      {/* Form Inputs */}
      <div className='grid grid-cols-2 gap-4'>
        <div className='flex items-center'>
          <label className='w-24 text-gray-700'>Tanggal:</label>
          <input type='date' className='border border-gray-300 p-2 rounded-lg w-full' />
        </div>
        <div className='flex items-center'>
          <label className='w-24 text-gray-700'>Kode Beli:</label>
          <input type='text' className='border border-gray-300 p-2 rounded-lg w-full' />
        </div>
        <div className='flex items-center'>
          <label className='w-24 text-gray-700'>Supplier:</label>
          <div className='relative w-full'>
            <input type='text' placeholder='Cari supplier' className='border border-gray-300 p-2 rounded-lg w-full' />
            <FaSearch className='absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer' />
          </div>
        </div>
        <div className='flex items-center'>
          <label className='w-24 text-gray-700'>Total:</label>
          <input type='text' className='border border-gray-300 p-2 rounded-lg w-full' />
        </div>
      </div>

      {/* Radio Button Lunas */}
      <div className='mt-4 flex items-center gap-3'>
        <label className='text-gray-700'>Lunas:</label>
        <label className='flex items-center gap-1'>
          <input type='radio' name='lunas' className='accent-purple-600' /> Yes
        </label>
        <label className='flex items-center gap-1'>
          <input type='radio' name='lunas' className='accent-purple-600' /> No
        </label>
      </div>

      {/* Produk */}
      <div className='mt-4'>
        <h3 className='font-semibold text-gray-700'>Produk</h3>
        <div className='flex gap-2 mt-2'>
          <div className='bg-gray-200 px-4 py-2 rounded-lg text-gray-700 flex items-center gap-1'>
            <FaSearch />
            <input type='text' placeholder='Cari Produk' className='bg-gray-200 focus:outline-none' />
          </div>
          <button className='bg-purple-600 px-4 py-2 rounded-lg text-white hover:bg-purple-700 transition'>Reset</button>
        </div>
      </div>

      {/* Tabel Produk */}
      <div className='mt-4 border border-gray-300 rounded-lg overflow-hidden'>
        <table className='w-full text-left border-collapse'>
          <thead className='bg-gray-200'>
            <tr>
              <th className='p-2 border'>Kode</th>
              <th className='p-2 border'>Nama</th>
              <th className='p-2 border'>Harga Beli</th>
              <th className='p-2 border'>Harga Jual</th>
              <th className='p-2 border'>Harga Grosir</th>
              <th className='p-2 border'>Stok</th>
              <th className='p-2 border'>Sub Total</th>
              <th className='p-2 border'>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className='hover:bg-gray-100'>
                <td className='p-2 border'>{product.kode}</td>
                <td className='p-2 border'>{product.nama}</td>
                <td className='p-2 border'>
                  <input type='text' className='border border-gray-300 p-1 rounded w-full' />
                </td>
                <td className='p-2 border'>
                  <input type='text' className='border border-gray-300 p-1 rounded w-full' />
                </td>
                <td className='p-2 border'>
                  <input type='text' className='border border-gray-300 p-1 rounded w-full' />
                </td>
                <td className='p-2 border'>
                  <input type='text' className='border border-gray-300 p-1 rounded w-full' />
                </td>
                <td className='p-2 border'>
                  <input type='text' className='border border-gray-300 p-1 rounded w-full' />
                </td>
                <td className='p-2 border text-center'>
                  <button className='text-red-600 hover:text-red-800'>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tombol Simpan */}
      <div className='flex justify-end mt-4'>
        <button className='bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition font-semibold'>Simpan</button>
      </div>
    </div>
  );
};

export default Pembeli;
