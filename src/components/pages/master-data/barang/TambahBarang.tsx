const TambahBarang = () => {
  return (
    <div className='p-5'>
      <div className='p-6 mt-5 bg-white rounded-lg shadow-md border border-gray-300'>
        <h2 className='text-2xl font-bold mb-4 text-gray-800'>Barang Baru</h2>
        <div className='mb-3 flex flex-col gap-2'>
          <div>
            <label className='block text-gray-700 mb-1'>Nama Produk</label>
            <input type='text' placeholder='Masukkan nama produk' className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500' />
          </div>
          <div>
            <label className='block text-gray-700 mb-1'>Gambar</label>
            <input type='file' className='w-full p-2 border border-gray-300 rounded-lg cursor-pointer bg-gray-100' />
          </div>
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <div>
            <label className='block text-gray-700 mb-1'>Kategori</label>
            <select className='w-full p-2 border border-gray-300 rounded-lg bg-white'>
              <option>Pilih kategori</option>
            </select>
          </div>

          <div>
            <label className='block text-gray-700 mb-1'>Ukuran</label>
            <input type='text' placeholder='Masukkan ukuran' className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500' />
          </div>

          <div>
            <label className='block text-gray-700 mb-1'>Satuan</label>
            <select className='w-full p-2 border border-gray-300 rounded-lg bg-white'>
              <option>Pilih satuan</option>
            </select>
          </div>

          <div>
            <label className='block text-gray-700 mb-1'>Harga Cash</label>
            <input type='text' placeholder='Masukkan harga cash' className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500' />
          </div>

          <div>
            <label className='block text-gray-700 mb-1'>Harga Cashbon</label>
            <input type='text' placeholder='Masukkan harga cashbon' className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500' />
          </div>

          <div>
            <label className='block text-gray-700 mb-1'>Harga Grosir</label>
            <input type='text' placeholder='Masukkan harga grosir' className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500' />
          </div>

          <div>
            <label className='block text-gray-700 mb-1'>Stok</label>
            <input type='text' placeholder='Masukkan stok' className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500' />
          </div>

          <div>
            <label className='block text-gray-700 mb-1'>Minimal Stok</label>
            <input type='text' placeholder='Masukkan Minimal stok' className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500' />
          </div>

          <div className='flex items-center gap-3 mt-3'>
            <label className='flex items-center gap-3 mt-3 cursor-pointer'>
              <span className='text-gray-700 text-sm font-medium'>Status Aktif</span>
              <div className='relative'>
                <input type='checkbox' className='sr-only peer' />
                <div className='w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-purple-500 transition duration-300'></div>
                <div className='w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 peer-checked:translate-x-5 transition-transform duration-300'></div>
              </div>
            </label>
          </div>
        </div>
        <div className='flex justify-end'>
          <button
            onClick={() => {
              location.replace("/dashboard/barang");
            }}
            className='cursor-pointer mt-4 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 font-semibold'
          >
            Tambah Barang
          </button>
        </div>
      </div>
    </div>
  );
};

export default TambahBarang;
