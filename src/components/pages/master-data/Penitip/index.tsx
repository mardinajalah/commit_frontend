import Table from "@/components/daisyUI/Table";
import { getAllDataPenitip, deletePenitip } from "@/data";
import TampilanUtama from "../TampilanUtama";
import { useEffect, useState } from "react";
import { PenitipType } from "@/data/interface";
import { Link } from "react-router-dom";

const Penitip = () => {
  const [tableData, setTableData] = useState<
    { title: string; header: string[]; data: PenitipType[] }[]
  >([]);

  const fetchData = () => {
    getAllDataPenitip()
      .then((res) => {
        // Memastikan data memiliki kolom 'listproduct' untuk tombol Detail Produk
        if (res && res.data && Array.isArray(res.data)) {
          const dataWithListProduct = {
            ...res,
            data: res.data.map((item: any) => ({
              id: item._id, // atau item.vendor_id
              ...item,
              listproduct: (
                <Link to={`/dashboard/penitip/detail-produk/${item._id}`}>
                  Detail Produk
                </Link>
              ),
            })),
          };

          setTableData([dataWithListProduct]);
        } else {
          console.error("Format data tidak valid:", res);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      // Periksa apakah id valid
      if (!id) {
        console.error("ID tidak valid:", id);
        return;
      }

      // Konfirmasi sebelum menghapus
      if (window.confirm("Yakin ingin menghapus data ini?")) {
        console.log("Menghapus penitip dengan ID:", id);

        // Panggil fungsi delete
        const result = await deletePenitip(id);
        console.log("Hasil delete:", result);

        // Refresh data setelah delete berhasil
        fetchData();
      }
    } catch (err) {
      console.error("Gagal menghapus data:", err);
      alert("Gagal menghapus data. Silahkan coba lagi.");
    }
  };

  return (
    <>
      <TampilanUtama link="/dashboard/penitip/tambah-penitip">
        <Table
          datas={tableData}
          to="/dashboard/penitip/detail-produk" // Route untuk detail produk
          onDelete={handleDelete} // Pastikan fungsi handleDelete dilewatkan dengan benar
          idFild="id" // Pastikan nama field ID sesuai dengan data Anda
        />
      </TampilanUtama>
    </>
  );
};

export default Penitip;
