import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Define types for the data
interface Vendor {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
}

interface VendorProduct {
  id: number;
  name: string;
  kategory: string;
  sellPrice: number;
  profitPercent: number;
}

const DetailProduk: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("ID penitip tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        // Fetch specific vendor data by ID
        const vendorResponse = await fetch(
          `http://localhost:3000/api/vendor/${id}`
        );
        if (!vendorResponse.ok) {
          throw new Error("Failed to fetch vendor data");
        }
        const vendorData = await vendorResponse.json();

        // Fetch products for this specific vendor
        const productsResponse = await fetch(
          `http://localhost:3000/api/vendor_product/vendor/${id}`
        );
        if (!productsResponse.ok) {
          throw new Error("Failed to fetch product data");
        }
        const productsData = await productsResponse.json();
        console.log(productsData);
        setVendor(vendorData);
        setProducts(productsData.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md my-8">
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Detail Barang
        </h1>

        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-700 mb-2">Penitip</h2>

          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Nama Penitip
                </p>
                <p className="text-base text-gray-900">{vendor?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">No. Telp</p>
                <p className="text-base text-gray-900">{vendor?.phoneNumber}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">
                  Alamat Penitip
                </p>
                <p className="text-base text-gray-900">{vendor?.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            Daftar Barang
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                    Nama Barang
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                    Kategori
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                    Harga Jual
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                    Persen Untung
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {product.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {product.kategory}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {new Intl.NumberFormat("id-ID").format(
                          product.sellPrice
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {product.profitPercent}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-3 px-4 text-center text-gray-500"
                    >
                      Tidak ada produk untuk penitip ini
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduk;
