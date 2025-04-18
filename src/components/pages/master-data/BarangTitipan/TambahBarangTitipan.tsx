import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { z } from "zod";
import axios from "axios";
import { debounce } from "lodash";

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

interface FilterOptions {
  sortBy: "name" | "newest";
  addressFilter: string;
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

// Skema validasi untuk keseluruhan form
const formSchema = z.object({
  vendorId: z.number().positive("Penitip harus dipilih"),
  items: z.array(barangSchema).min(1, "Minimal 1 barang harus ditambahkan"),
});

const TambahBarangTitipan = () => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // State untuk penitip
  const [searchQuery, setSearchQuery] = useState("");
  const [penitipResults, setPenitipResults] = useState<Penitip[]>([]);
  const [showPenitipResults, setShowPenitipResults] = useState(false);
  const [selectedPenitip, setSelectedPenitip] = useState<Penitip | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // State untuk filter penitip
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sortBy: "name",
    addressFilter: "",
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);

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

  const [barangList, setBarangList] = useState<BarangTitipan[]>([]);

  const [errors, setErrors] = useState<{
    form?: string;
    newBarang?: Partial<Record<keyof BarangTitipan, string>>;
    items?: Record<number, Partial<Record<keyof BarangTitipan, string>>>;
  }>({});

  const debouncedSearch = useRef(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setPenitipResults([]);
        setShowPenitipResults(false);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/vendor?search=${query}`
        );
        const vendors = response.data.data || response.data;
        const filteredVendors = applyFilters(vendors);
        setPenitipResults(filteredVendors);
        setShowPenitipResults(true);
      } catch (err) {
        console.error("Error searching for penitip:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300)
  ).current;

  useEffect(() => {
    if (paramId) {
      axios
        .get(`http://localhost:3000/api/vendor_product/${paramId}`)
        .then((res) => {
          const data = res.data;
          setNewBarang({
            name: data.name,
            category: data.category,
            categoryId: data.categoryId,
            sellPrice: data.sellPrice,
            profitPercent: data.profitPercent,
          });
        })
        .catch((err) => console.error("Gagal mengambil data barang:", err));
    }
  }, [paramId]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/category")
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error("Gagal mengambil kategori:", err));
  }, []);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!selectedPenitip || selectedPenitip.name !== query) {
      debouncedSearch(query);
    }
  };

  const toggleFilterPanel = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  const applyFilters = (vendors: Penitip[]): Penitip[] => {
    let filteredVendors = [...vendors];

    if (filterOptions.addressFilter) {
      filteredVendors = filteredVendors.filter((vendor) =>
        vendor.address
          .toLowerCase()
          .includes(filterOptions.addressFilter.toLowerCase())
      );
    }

    if (filterOptions.sortBy === "name") {
      filteredVendors.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filterOptions.sortBy === "newest") {
      filteredVendors.sort((a, b) => b.id - a.id);
    }

    return filteredVendors;
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilterOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    if (penitipResults.length > 0) {
      setPenitipResults(applyFilters(penitipResults));
    } else if (searchQuery) {
      debouncedSearch(searchQuery);
    }
    setShowFilterPanel(false);
  };

  const handleResetFilters = () => {
    setFilterOptions({
      sortBy: "name",
      addressFilter: "",
    });
  };

  const selectPenitip = (penitip: Penitip) => {
    setSelectedPenitip(penitip);
    setShowPenitipResults(false);
    setSearchQuery(penitip.name);
    setErrors((prev) => ({ ...prev, form: undefined }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        event.target instanceof HTMLElement &&
        !searchInputRef.current.contains(event.target) &&
        !event.target.closest(".search-results")
      ) {
        setShowPenitipResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!paramId && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [paramId]);

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

  // Submit form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (paramId) {
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

      const updatedPayload = {
        name: newBarang.name,
        categoryId: newBarang.categoryId,
        sellPrice: parseFloat(newBarang.sellPrice.toString()),
        profitPercent: parseFloat(newBarang.profitPercent.toString()),
      };

      axios
        .put(
          `http://localhost:3000/api/vendor_product/${paramId}`,
          updatedPayload
        )
        .then(() => {
          swal("Berhasil", "Data anggota berhasil disimpan", "success");
          navigate("/dashboard/barang-titipan");
        })
        .catch(() => {
          swal("Error", "Gagal mengambil data", "error");
        });

      return;
    }

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
        if (paramId) {
          swal("Berhasil", "Data berhasil diubah", "success");
        } else {
          swal("Berhasil", "Data berhasil ditambahkan", "success");
        }
        navigate("/dashboard/barang-titipan");
      })
      .catch(() => {
        swal("Gagal", "Gagal menyimpan data", "error");
      });
  };

  return (
    <div className="p-5">
      <form
        onSubmit={handleSubmit}
        className="p-6 mt-5 bg-white rounded-lg shadow-md border border-gray-300"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {paramId ? "Edit Barang Titipan" : "Tambah Barang Titipan"}
        </h2>

        {/* Pencarian Penitip */}
        {!paramId && (
          <div className="mb-6 relative">
            <label className="block text-gray-700 mb-1">Cari Penitip</label>
            <div className="flex gap-2 mb-2">
              <div className="relative flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  placeholder="Ketik nama penitip..."
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  onFocus={() => {
                    if (penitipResults.length > 0) {
                      setShowPenitipResults(true);
                    }
                  }}
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800"></div>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={toggleFilterPanel}
                className={`px-4 py-2 ${
                  showFilterPanel
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                } rounded hover:bg-blue-700 hover:text-white`}
              >
                Filter
              </button>
            </div>

            {/* Filter Panel */}
            {showFilterPanel && (
              <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4 shadow-md">
                <h4 className="font-semibold mb-3">Filter Pencarian</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Urutkan Berdasarkan
                    </label>
                    <select
                      name="sortBy"
                      value={filterOptions.sortBy}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                    >
                      <option value="name">Nama (A-Z)</option>
                      <option value="newest">Terbaru</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Alamat Mengandung
                    </label>
                    <input
                      type="text"
                      name="addressFilter"
                      value={filterOptions.addressFilter}
                      onChange={handleFilterChange}
                      placeholder="Filter alamat"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 hover:bg-gray-200"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyFilters}
                    className="px-3 py-1 bg-[#6C0AFF] text-white rounded-lg hover:bg-[#5a00e6]"
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            )}

            {/* Hasil pencarian penitip */}
            {showPenitipResults && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto search-results">
                {penitipResults.length > 0 ? (
                  penitipResults.map((penitip) => (
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
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500">
                    {searchQuery
                      ? "Tidak ada hasil yang ditemukan"
                      : "Mulai mengetik untuk mencari penitip"}
                  </div>
                )}
              </div>
            )}

            {errors.form && (
              <p className="text-red-500 text-sm mt-1">{errors.form}</p>
            )}
          </div>
        )}

        {/* Info Penitip */}
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
                  value={newBarang.categoryId}
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
                >
                  + Tambah Barang
                </button>
              </div>
            )}
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
