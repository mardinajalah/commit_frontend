const TambahKategori = () => {
  return (
    <div className="min-h-screen p-6 mt-28">
      <div className="flex justify-center">
        <form className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kode Kategori
            </label>
            <input
              type="text"
              autoComplete="off"
              name="id"
              disabled
              className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#6C0AFF] transition"
              placeholder="Tidak dapat diubah"
            />
            <p className="text-sm text-gray-500 mt-1">
              kode kategori tidak dapat diubah
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Kategori
            </label>
            <input
              type="text"
              autoComplete="off"
              name="kategori"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C0AFF] transition"
              placeholder="Masukan kategori"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aktif
            </label>
            <select
              name="aktif"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C0AFF] transition"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-[#6C0AFF] text-white px-6 py-2 rounded-full hover:bg-[#5a00e6] transition"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahKategori;
