import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAllDataSupplier, getAllDataBarang } from "@/data";

// ================= Interface =================
interface Supplier {
  id: number;
  name: string;
  phoneNumber: string; // Added phoneNumber field
}

interface Product {
  id: number;
  name: string;
}

interface FormProduct {
  productId: number;
  purchasePrice: number;
  retailPrice: number;
  wholesalePrice: number;
  quantity: number;
  subtotal: number;
}

interface FormValues {
  saleDate: string;
  supplierId: number;
  isPaid: boolean;
  products: FormProduct[];
}

// ================= Schema =================
const formSchema = z.object({
  saleDate: z.string().min(1, "Tanggal wajib diisi"),
  supplierId: z.number().min(1, "Supplier wajib diisi"),
  isPaid: z.boolean(),
  products: z
    .array(
      z.object({
        productId: z.number().min(1, "Produk wajib dipilih"),
        purchasePrice: z.number().nonnegative(),
        retailPrice: z.number().nonnegative(),
        wholesalePrice: z.number().nonnegative(),
        quantity: z.number().nonnegative(),
        subtotal: z.number().nonnegative(),
      })
    )
    // Removed any restrictions on the maximum number of products
    .min(1, "Minimal 1 produk harus ditambahkan"),
});

export default function FormTransaksi() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const { register, handleSubmit, control, setValue, watch, reset } =
    useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        saleDate: new Date().toISOString().slice(0, 10),
        supplierId: 0,
        isPaid: false,
        products: [],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  useEffect(() => {
    const fetchSuppliersAndProducts = async () => {
      try {
        const suppliersResponse = await getAllDataSupplier();
        const productsResponse = await getAllDataBarang();

        // Ensure the data is extracted correctly from the API response
        const suppliersData = Array.isArray(suppliersResponse.data)
          ? suppliersResponse.data.map((supplier: any) => ({
              id: supplier.id,
              name: supplier.name,
              phoneNumber: supplier.phoneNumber, // Extract phoneNumber
            }))
          : [];
        const productsData = Array.isArray(productsResponse.data)
          ? productsResponse.data.map((product: any) => ({
              id: product.id,
              name: product.name,
            }))
          : [];

        setSuppliers(suppliersData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSuppliers([]); // Fallback to empty array
        setProducts([]); // Fallback to empty array
      }
    };

    fetchSuppliersAndProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts([]);
    } else {
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(results);
    }
  }, [searchQuery, products]);

  const totalHarga = watch("products").reduce(
    (total, item) => total + item.subtotal,
    0
  );

  const handleAddProduct = (product: Product) => {
    append({
      productId: product.id,
      purchasePrice: 0,
      retailPrice: 0,
      wholesalePrice: 0,
      quantity: 0,
      subtotal: 0,
    });
    setSearchQuery("");
    setFilteredProducts([]);
  };

  const handleResetProducts = () => {
    reset({
      saleDate: watch("saleDate"),
      supplierId: watch("supplierId"),
      isPaid: watch("isPaid"),
      products: [], // Clear the products array
    });
  };

  const onSubmit = async (data: FormValues) => {
    const parsed = formSchema.safeParse(data);
    if (!parsed.success) {
      swal("Error", "Form tidak valid", "error");
      return;
    }

    try {
      if (!Array.isArray(data.products) || data.products.length === 0) {
        throw new Error("Produk tidak valid atau kosong");
      }

      const payload = {
        supplierId: data.supplierId,
        isPaid: data.isPaid ? "YES" : "NO",
        totalAmount: data.products.reduce(
          (total, product) => total + product.subtotal,
          0
        ),
        product: data.products.map((product) => ({
          productId: product.productId,
          purchasePrice: product.purchasePrice,
          retailPrice: product.retailPrice,
          wholesalePrice: product.wholesalePrice,
          quantity: product.quantity,
          subtotal: product.subtotal,
        })),
      };

      const res = await fetch("http://localhost:3000/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        swal("Error", errorData.message || "Gagal menyimpan", "error");
        return;
      }

      swal("Berhasil", "Transaksi berhasil disimpan", "success");
      reset();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      swal("Error", `Terjadi kesalahan: ${errorMessage}`, "error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 space-y-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto mt-10"
    >
      <h1 className="text-2xl font-bold text-gray-800 ">
        Form Transaksi Pembelian
      </h1>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal
          </label>
          <input
            type="date"
            {...register("saleDate")}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supplier
          </label>
          <select
            {...register("supplierId", { valueAsNumber: true })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value={0}>Pilih Supplier</option>
            {suppliers.map((sup) => (
              <option key={sup.id} value={sup.id}>
                {sup.name} - {sup.phoneNumber}{" "}
                {/* Display name and phone number */}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Harga
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
            value={totalHarga.toLocaleString()}
            readOnly
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lunas
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="yes"
                onChange={() => setValue("isPaid", true)}
                className="form-radio"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="no"
                onChange={() => setValue("isPaid", false)}
                className="form-radio"
              />
              <span>No</span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Tambah Produk
        </h2>
        <div className="relative mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama produk..."
              className="w-full border border-gray-300 rounded-lg p-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
          <button
            type="button"
            onClick={handleResetProducts}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Reset
          </button>
        </div>
        {filteredProducts.length > 0 && (
          <div
            className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto"
            style={{ width: "50%" }} // Ensure the width matches the input field
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleAddProduct(product)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {product.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border border-gray-300">No</th>
              <th className="p-2 border border-gray-300">Nama</th>
              <th className="p-2 border border-gray-300">Harga Beli</th>
              <th className="p-2 border border-gray-300">Harga Jual</th>
              <th className="p-2 border border-gray-300">Harga Grosir</th>
              <th className="p-2 border border-gray-300">Jumlah</th>
              <th className="p-2 border border-gray-300">Sub Total</th>
              <th className="p-2 border border-gray-300">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => {
              const productName =
                products.find((p) => p.id === field.productId)?.name ||
                "Unknown";
              return (
                <tr key={field.productId} className="text-center">
                  <td className="p-2 border border-gray-300">
                    {field.productId}
                  </td>
                  <td className="p-2 border border-gray-300">{productName}</td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="number"
                      {...register(`products.${index}.purchasePrice`, {
                        valueAsNumber: true,
                        onChange: (e) => {
                          const value = parseFloat(e.target.value);
                          const quantity =
                            watch(`products.${index}.quantity`) || 0;
                          setValue(
                            `products.${index}.subtotal`,
                            value * quantity
                          );
                        },
                      })}
                      className="w-full border border-gray-300 rounded-lg p-1"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="number"
                      {...register(`products.${index}.retailPrice`, {
                        valueAsNumber: true,
                      })}
                      className="w-full border border-gray-300 rounded-lg p-1"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="number"
                      {...register(`products.${index}.wholesalePrice`, {
                        valueAsNumber: true,
                      })}
                      className="w-full border border-gray-300 rounded-lg p-1"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="number"
                      {...register(`products.${index}.quantity`, {
                        valueAsNumber: true,
                        onChange: (e) => {
                          const value = parseInt(e.target.value);
                          const price =
                            watch(`products.${index}.purchasePrice`) || 0;
                          setValue(`products.${index}.subtotal`, price * value);
                        },
                      })}
                      className="w-full border border-gray-300 rounded-lg p-1"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      value={watch(`products.${index}.subtotal`) || 0}
                      readOnly
                      className="w-full border border-gray-300 rounded-lg p-1 bg-gray-100"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className=" text-red-500 hover:text-red-900 transition"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        type="submit"
        className="w-full bg-[#6C0AFF] text-white py-2 rounded-lg hover:bg-[#5a00e6] transition"
      >
        Simpan Transaksi
      </button>
    </form>
  );
}
