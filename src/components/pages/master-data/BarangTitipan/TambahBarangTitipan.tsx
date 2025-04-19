import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { z } from "zod";
import axios from "axios";
import swal from "sweetalert";

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

const formSchema = z.object({
  vendorId: z.number().positive("Penitip harus dipilih"),
  items: z.array(barangSchema).min(1, "Minimal 1 barang harus ditambahkan"),
});

const TambahBarangTitipan = () => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [penitipResults, setPenitipResults] = useState<Penitip[]>([]);
  const [filteredPenitipResults, setFilteredPenitipResults] = useState<
    Penitip[]
  >([]);
  const [selectedPenitip, setSelectedPenitip] = useState<Penitip | null>(null);
  const [categories, setCategories] = useState<KategoriOption[]>([]);
  const [newBarang, setNewBarang] = useState<BarangTitipan>({
    name: "",
    category: "",
    categoryId: 0,
    sellPrice: "",
    profitPercent: "",
  });

  const [barangList, setBarangList] = useState<BarangTitipan[]>([]);
  const [errors, setErrors] = useState<{
    form?: string;
    newBarang?: Partial<Record<keyof BarangTitipan, string>>;
    items?: Record<number, Partial<Record<keyof BarangTitipan, string>>>;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch product data if in edit mode
  useEffect(() => {
    if (paramId) {
      setIsLoading(true);
      axios
        .get<{
          name: string;
          category: string;
          categoryId: number;
          sellPrice: number;
          profitPercent: number;
          vendorId?: number;
        }>(`http://localhost:3000/api/vendor_product/${paramId}`)
        .then((res) => {
          const data = res.data;

          // Set product data with defensive checks
          setNewBarang({
            name: data.name || "",
            category: data.category || "",
            categoryId: data.categoryId || 0,
            sellPrice: data.sellPrice || "",
            profitPercent: data.profitPercent || "",
          });

          // Fetch vendor data if available
          if (data.vendorId) {
            axios
              .get<Penitip>(`http://localhost:3000/api/vendor/${data.vendorId}`)
              .then((vendorRes) => {
                setSelectedPenitip(vendorRes.data);
              })
              .catch((vendorErr) => {
                console.error("Gagal mengambil data penitip:", vendorErr);
              })
              .finally(() => {
                setIsLoading(false);
              });
          } else {
            setIsLoading(false);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.error("Gagal mengambil data barang:", err);

          // Display detailed error message
          if (err.response) {
            console.error("Server response data:", err.response.data);
            console.error("Server response status:", err.response.status);
            console.error("Server response headers:", err.response.headers);

            const errorMessage =
              err.response.data?.message || "Terjadi kesalahan pada server";
            swal("Error", `Gagal mengambil data: ${errorMessage}`, "error");
          } else if (err.request) {
            console.error("No response received:", err.request);
            swal(
              "Error",
              "Server tidak merespon. Cek koneksi jaringan Anda.",
              "error"
            );
          } else {
            console.error("Error setting up request:", err.message);
            swal("Error", `Terjadi kesalahan: ${err.message}`, "error");
          }

          // Navigate back to list page if data can't be fetched
          navigate("/dashboard/barang-titipan");
        });
    }
  }, [paramId, navigate]);

  // Fetch categories
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/category")
      .then((res) => {
        if (res.data && res.data.data) {
          setCategories(res.data.data);
        } else {
          console.error("Format data kategori tidak sesuai:", res.data);
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil kategori:", err);
        swal("Error", "Gagal mengambil data kategori", "error");
      });
  }, []);

  // Fetch vendors
  useEffect(() => {
    if (!paramId) {
      // Only fetch vendors in add mode
      axios
        .get("http://localhost:3000/api/vendor")
        .then((res) => {
          if (res.data && res.data.data) {
            setPenitipResults(res.data.data || []);
          } else {
            console.error("Format data penitip tidak sesuai:", res.data);
          }
        })
        .catch((err) => {
          console.error("Gagal mengambil data penitip:", err);
          swal("Error", "Gagal mengambil data penitip", "error");
        });
    }
  }, [paramId]);

  // Update category name when categories are loaded in edit mode
  useEffect(() => {
    if (paramId && newBarang.categoryId && categories.length > 0) {
      const selectedCategory = categories.find(
        (cat) => cat.id === newBarang.categoryId
      );
      if (selectedCategory) {
        setNewBarang((prev) => ({
          ...prev,
          category: selectedCategory.name,
        }));
      }
    }
  }, [categories, newBarang.categoryId, paramId]);

  // Filter vendors based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPenitipResults([]);
      return;
    }

    const filteredResults = penitipResults.filter((penitip) =>
      penitip.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPenitipResults(filteredResults);
  }, [searchQuery, penitipResults]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const selectPenitip = (penitip: Penitip) => {
    setSelectedPenitip(penitip);
    setSearchQuery("");
    setFilteredPenitipResults([]);
    setErrors((prev) => ({ ...prev, form: undefined }));
  };

  const handleBarangChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setNewBarang((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      newBarang: {
        ...prev.newBarang,
        [name]: undefined,
      },
    }));

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

  const addBarang = () => {
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

    setBarangList([...barangList, newBarang]);

    setNewBarang({
      name: "",
      category: "",
      categoryId: 0,
      sellPrice: "",
      profitPercent: "",
    });

    setErrors((prev) => ({
      ...prev,
      newBarang: {},
    }));
  };

  const removeBarang = (index: number) => {
    const updatedList = [...barangList];
    updatedList.splice(index, 1);
    setBarangList(updatedList);

    if (errors.items && errors.items[index]) {
      const updatedErrors = { ...errors };
      delete updatedErrors.items![index];
      setErrors(updatedErrors);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Handle edit mode
    if (paramId) {
      // Validate edit form
      const editFormResult = z
        .object({
          name: z
            .string()
            .min(1, "Nama barang harus diisi")
            .max(50, "Nama maksimal 50 karakter"),
          categoryId: z.number().positive("Kategori harus dipilih"),
          sellPrice: z.coerce
            .number()
            .positive("Harga jual harus lebih dari 0"),
          profitPercent: z.coerce
            .number()
            .min(0, "Persentase keuntungan tidak boleh negatif"),
        })
        .safeParse(newBarang);

      if (!editFormResult.success) {
        const fieldErrors: Partial<Record<keyof BarangTitipan, string>> = {};
        editFormResult.error.errors.forEach((err) => {
          const fieldName = err.path[0] as keyof BarangTitipan;
          fieldErrors[fieldName] = err.message;
        });

        setErrors((prev) => ({
          ...prev,
          newBarang: fieldErrors,
        }));

        return;
      }

      // If validation succeeds, submit the update
      setIsLoading(true);
      const payload = {
        name: newBarang.name,
        categoryId: newBarang.categoryId,
        sellPrice: parseFloat(newBarang.sellPrice.toString()),
        profitPercent: parseFloat(newBarang.profitPercent.toString()),
      };

      axios
        .put(`http://localhost:3000/api/vendor_product/${paramId}`, payload)
        .then(() => {
          swal("Berhasil", "Data berhasil diubah", "success");
          navigate("/dashboard/barang-titipan");
        })
        .catch((err) => {
          console.error("Gagal mengubah data:", err);

          // Display specific error message if available
          if (err.response && err.response.data && err.response.data.message) {
            swal(
              "Gagal",
              `Gagal menyimpan data: ${err.response.data.message}`,
              "error"
            );
          } else {
            swal("Gagal", "Gagal menyimpan data", "error");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });

      return;
    }

    // Handle add mode
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
            const index = err.path[1] as number;
            const field = err.path[2] as keyof BarangTitipan;

            if (!formErrors.items) formErrors.items = {};
            if (!formErrors.items[index]) formErrors.items[index] = {};

            formErrors.items[index][field] = err.message;
          } else {
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

    setIsLoading(true);
    const promises = barangList.map((item) => {
      const singleItemPayload = {
        vendorId: selectedPenitip.id,
        name: item.name,
        categoryId: item.categoryId,
        sellPrice: parseFloat(item.sellPrice.toString()),
        profitPercent: parseFloat(item.profitPercent.toString()),
        entryDate: new Date().toISOString(),
      };

      return axios.post(
        "http://localhost:3000/api/vendor_product",
        singleItemPayload
      );
    });

    Promise.all(promises)
      .then(() => {
        swal("Berhasil", "Data berhasil ditambahkan", "success");
        navigate("/dashboard/barang-titipan");
      })
      .catch((err) => {
        console.error("Gagal menyimpan data:", err);

        // Display specific error message if available
        if (err.response && err.response.data && err.response.data.message) {
          swal(
            "Gagal",
            `Gagal menyimpan data: ${err.response.data.message}`,
            "error"
          );
        } else {
          swal("Gagal", "Gagal menyimpan data", "error");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading && paramId) {
    return (
      <div className="p-5 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <form
        onSubmit={handleSubmit}
        className="p-6 mt-5 bg-white rounded-lg shadow-md border border-gray-300"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {paramId ? "Edit Barang Titipan" : "Tambah Barang Titipan"}
        </h2>

        {!paramId && (
          <div className="mb-6 relative">
            <label className="block text-gray-700 mb-1">Cari Penitip</label>
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder="Ketik nama penitip..."
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            {filteredPenitipResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto search-results">
                {filteredPenitipResults.map((penitip) => (
                  <div
                    key={penitip.id}
                    onClick={() => selectPenitip(penitip)}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                  >
                    <div className="font-medium">{penitip.name}</div>
                    <div className="text-sm text-gray-600">
                      {penitip.phoneNumber}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {penitip.address}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {errors.form && (
              <p className="text-red-500 text-sm mt-1">{errors.form}</p>
            )}
          </div>
        )}

        {selectedPenitip && !paramId && (
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

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Daftar Barang</h3>

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
                  value={newBarang.categoryId || ""}
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value);
                    const selectedCategory = categories.find(
                      (cat) => cat.id === selectedId
                    );

                    setNewBarang((prev) => ({
                      ...prev,
                      categoryId: selectedId,
                      category: selectedCategory?.name || "",
                    }));

                    setErrors((prev) => ({
                      ...prev,
                      newBarang: {
                        ...prev.newBarang,
                        category: undefined,
                      },
                    }));
                  }}
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

            {!paramId && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={addBarang}
                  className="px-4 py-2 bg-[#6C0AFF] text-white rounded-lg hover:bg-[#5a00e6] transition"
                  disabled={isLoading}
                >
                  + Tambah Barang
                </button>
              </div>
            )}
          </div>

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

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/barang-titipan")}
            className="cursor-pointer border border-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition"
            disabled={isLoading}
          >
            Batal
          </button>
          <button
            type="submit"
            className="cursor-pointer bg-[#6C0AFF] text-white px-6 py-2 rounded-full hover:bg-[#5a00e6] transition"
            disabled={isLoading}
          >
            {isLoading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TambahBarangTitipan;
