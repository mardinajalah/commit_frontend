import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { z } from "zod";
import axios from "axios";

// Definisi tipe data
interface Penitip {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
}

interface KategoriOption {
  id: number;
  name: string;
  isActive: string;
}

interface BarangTitipan {
  name: string;
  category: string;
  categoryId: number;
  sellPrice: number | string;
  profitPercent: number | string;
}

// Skema validasi untuk barang titipan
const barangSchema = z.object({
  name: z
    .string()
    .min(1, "Nama barang harus diisi")
    .max(50, "Nama maksimal 50 karakter"),
  category: z.string().min(1, "Kategori harus dipilih"),
  sellPrice: z.coerce.number().positive("Harga jual harus lebih dari 0"),
  profitPercent: z.coerce
    .number()
    .min(0, "Persentase keuntungan tidak boleh negatif"),
});

// Skema validasi untuk keseluruhan form
const formSchema = z.object({
  vendorId: z.number().positive("Penitip harus dipilih"),
  items: z.array(barangSchema).min(1, "Minimal 1 barang harus ditambahkan"),
});

const TambahBarangTitipan = () => {
  const navigate = useNavigate();

  // State untuk penitip
  const [searchQuery, setSearchQuery] = useState("");
  const [penitipResults, setPenitipResults] = useState<Penitip[]>([]);
  const [showPenitipResults, setShowPenitipResults] = useState(false);
  const [selectedPenitip, setSelectedPenitip] = useState<Penitip | null>(null);

  // State untuk kategori
  const [categories, setCategories] = useState<KategoriOption[]>([]);

  // State untuk form barang baru
  const [newBarang, setNewBarang] = useState<BarangTitipan>({
    name: "",
    category: "",
    categoryId: 0,
    sellPrice: "",
    profitPercent: "",
  });

  // State untuk daftar barang
  const [barangList, setBarangList] = useState<BarangTitipan[]>([]);

  // State untuk error
  const [errors, setErrors] = useState<{
    form?: string;
    newBarang?: Partial<Record<keyof BarangTitipan, string>>;
    items?: Record<number, Partial<Record<keyof BarangTitipan, string>>>;
  }>({});

  // Fetch kategori saat komponen dimount
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/category")
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error("Gagal mengambil kategori:", err));
  }, []);

  // Pencarian penitip
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(
        `http://localhost:3000/api/vendor?search=${searchQuery}`
      );
      setPenitipResults(response.data.data || response.data);
      setShowPenitipResults(true);
    } catch (err) {
      console.error("Error searching for penitip:", err);
    }
  };

  // Pilih penitip
  const selectPenitip = (penitip: Penitip) => {
    setSelectedPenitip(penitip);
    setShowPenitipResults(false);
    setSearchQuery(penitip.name);
    // Reset errors jika ada
    setErrors((prev) => ({ ...prev, form: undefined }));
  };

  // Handle perubahan form barang baru
  const handleBarangChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setNewBarang((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset error untuk field ini
    setErrors((prev) => ({
      ...prev,
      newBarang: {
        ...prev.newBarang,
        [name]: undefined,
      },
    }));

    // Jika memilih kategori, set categoryId
    if (name === "category") {
      const selectedCategory = categories.find((cat) => cat.name === value);
      if (selectedCategory) {
        setNewBarang((prev) => ({
          ...prev,
          categoryId: selectedCategory.id,
        }));
      }
    }
  };

  // Tambah barang ke daftar
  const addBarang = () => {
    // Validasi barang baru
    const result = barangSchema.safeParse(newBarang);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof BarangTitipan, string>> = {};
      result.error.errors.forEach((err) => {
        const fieldName = err.path[0] as keyof BarangTitipan;
        fieldErrors[fieldName] = err.message;
      });

      setErrors((prev) => ({
        ...prev,
        newBarang: fieldErrors,
      }));

      return;
    }

    // Tambahkan barang ke list
    setBarangList([...barangList, newBarang]);

    // Reset form barang baru
    setNewBarang({
      name: "",
      category: "",
      categoryId: 0,
      sellPrice: "",
      profitPercent: "",
    });

    // Reset error untuk form barang baru
    setErrors((prev) => ({
      ...prev,
      newBarang: {},
    }));
  };

  // Hapus barang dari daftar
  const removeBarang = (index: number) => {
    const updatedList = [...barangList];
    updatedList.splice(index, 1);
    setBarangList(updatedList);

    // Hapus error untuk item ini jika ada
    if (errors.items && errors.items[index]) {
      const updatedErrors = { ...errors };
      delete updatedErrors.items![index];
      setErrors(updatedErrors);
    }
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPenitip) {
      setErrors((prev) => ({
        ...prev,
        form: "Silakan pilih penitip terlebih dahulu",
      }));
      return;
    }

    if (barangList.length === 0) {
      setErrors((prev) => ({
        ...prev,
        form: "Silakan tambahkan minimal satu barang",
      }));
      return;
    }

    // Validasi keseluruhan form
    const payload = {
      vendorId: selectedPenitip.id,
      items: barangList,
    };

    const result = formSchema.safeParse(payload);

    if (!result.success) {
      const formErrors: {
        form?: string;
        items?: Record<number, Partial<Record<keyof BarangTitipan, string>>>;
      } = {};

      result.error.errors.forEach((err) => {
        if (err.path[0] === "vendorId") {
          formErrors.form = err.message;
        } else if (err.path[0] === "items") {
          if (err.path.length > 1) {
            // Error untuk item tertentu
            const index = err.path[1] as number;
            const field = err.path[2] as keyof BarangTitipan;

            if (!formErrors.items) formErrors.items = {};
            if (!formErrors.items[index]) formErrors.items[index] = {};

            formErrors.items[index][field] = err.message;
          } else {
            // Error untuk keseluruhan items
            formErrors.form = err.message;
          }
        }
      });

      setErrors((prev) => ({
        ...prev,
        ...formErrors,
      }));

      return;
    }

    // Kirim data satu per satu (bukan array)
    // Dari error terlihat bahwa API mengharapkan satu objek per request, bukan array

    const promises = barangList.map((item) => {
      console.log(item.categoryId);
      const singleItemPayload = {
        vendorId: selectedPenitip.id,
        name: item.name,
        categoryId: item.categoryId,
        sellPrice: parseFloat(item.sellPrice.toString()),
        profitPercent: parseFloat(item.profitPercent.toString()),
        entryDate: new Date().toISOString(), // Tambahkan entryDate yang diperlukan oleh skema Prisma
      };

      return axios.post(
        "http://localhost:3000/api/vendor_product",
        singleItemPayload
      );
    });

    Promise.all(promises)
      .then(() => {
        alert("Data berhasil disimpan");
        navigate("/dashboard/barang-titipan");
      })
      .catch((err) => {
        console.error("Gagal menyimpan:", err.response?.data || err.message);
        alert(
          "Gagal menyimpan data: " +
            (err.response?.data?.message || err.message)
        );
      });
  };

  return (
    <div className="p-5">
      <form
        onSubmit={handleSubmit}
        className="p-6 mt-5 bg-white rounded-lg shadow-md border border-gray-300"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Titipan Baru</h2>

        {/* Pencarian Penitip */}
        <div className="mb-6 relative">
          <label className="block text-gray-700 mb-1">Cari Penitip</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari penitip"
              className="flex-1 p-2 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cari
            </button>
          </div>

          {/* Hasil pencarian penitip */}
          {showPenitipResults && penitipResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg">
              {penitipResults.map((penitip) => (
                <div
                  key={penitip.id}
                  onClick={() => selectPenitip(penitip)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {penitip.name} - {penitip.phoneNumber}
                </div>
              ))}
            </div>
          )}

          {errors.form && (
            <p className="text-red-500 text-sm mt-1">{errors.form}</p>
          )}
        </div>

        {/* Info Penitip */}
        {selectedPenitip && (
          <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded">
            <div>
              <p className="font-medium">Nama Customer</p>
              <p>{selectedPenitip.name}</p>
            </div>
            <div>
              <p className="font-medium">No. Telp</p>
              <p>{selectedPenitip.phoneNumber}</p>
            </div>
            <div className="col-span-2">
              <p className="font-medium">Alamat</p>
              <p>{selectedPenitip.address}</p>
            </div>
          </div>
        )}

        {/* Daftar Barang */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Daftar Barang</h3>

          {/* Form Input Barang */}
          <div className="bg-gray-50 p-4 rounded mb-4">
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-2">
                <label className="block text-gray-700 mb-1">Nama Barang</label>
                <input
                  type="text"
                  name="name"
                  value={newBarang.name}
                  onChange={handleBarangChange}
                  placeholder="Masukkan nama barang"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {errors.newBarang?.name && (
                  <p className="text-red-500 text-sm">
                    {errors.newBarang.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Kategori</label>
                <select
                  name="category"
                  value={newBarang.category}
                  onChange={handleBarangChange}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="">Pilih kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.newBarang?.category && (
                  <p className="text-red-500 text-sm">
                    {errors.newBarang.category}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Harga Jual</label>
                <input
                  type="text"
                  name="sellPrice"
                  value={newBarang.sellPrice}
                  onChange={handleBarangChange}
                  placeholder="Masukkan harga jual"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {errors.newBarang?.sellPrice && (
                  <p className="text-red-500 text-sm">
                    {errors.newBarang.sellPrice}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Profit %</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="profitPercent"
                    value={newBarang.profitPercent}
                    onChange={handleBarangChange}
                    placeholder="Persentase"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {errors.newBarang?.profitPercent && (
                    <p className="text-red-500 text-sm">
                      {errors.newBarang.profitPercent}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={addBarang}
                className="px-4 py-2 bg-[#6C0AFF] text-white rounded-lg hover:bg-[#5a00e6] transition"
              >
                + Tambah Barang
              </button>
            </div>
          </div>

          {/* Tabel Daftar Barang */}
          {barangList.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Nama Barang</th>
                    <th className="px-4 py-2 text-left">Kategori</th>
                    <th className="px-4 py-2 text-right">Harga Jual</th>
                    <th className="px-4 py-2 text-right">Profit %</th>
                    <th className="px-4 py-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {barangList.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.category}</td>
                      <td className="px-4 py-2 text-right">
                        {typeof item.sellPrice === "number"
                          ? item.sellPrice.toLocaleString()
                          : parseFloat(item.sellPrice).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {item.profitPercent}%
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeBarang(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tombol Submit */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/barang-titipan")}
            className="cursor-pointer border border-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            className="cursor-pointer bg-[#6C0AFF] text-white px-6 py-2 rounded-full hover:bg-[#5a00e6] transition"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
};

export default TambahBarangTitipan;
