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
            title: "vendor",
            header: [
              "id",
              "name",
              "phoneNumber",
              "address",
              "isActive",
              "listproduct",
            ],
            data: res.data.map((item: any) => ({
              id: item.id,
              name: item.name,
              phoneNumber: item.phoneNumber,
              address: item.address,
              isActive: item.isActive ? "YES" : "NO",
              listproduct: (
                <Link
                  to={`/dashboard/penitip/detail-produk/${item.id}`}
                  className="text-blue-600 hover:underline"
                >
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
    const result = await swal({
      title: "Yakin ingin menghapus data ini?",
      icon: "warning",
      buttons: {
        confirm: {
          text: "Ya",
          value: true,
          visible: true,
          className: "btn btn-primary",
          closeModal: true,
        },
        cancel: {
          text: "Tidak",
          value: false,
          visible: true,
          className: "btn btn-danger",
          closeModal: true,
        },
      },
      dangerMode: true,
    });

    if (result) {
      try {
        await deletePenitip(id);
        swal("Berhasil", "Data berhasil dihapus", "success");
        fetchData();
      } catch (err) {
        swal("data digunakan", "Data Digunakan di komponen Lain", "error");
      }
    }
  };

  return (
    <>
      <TampilanUtama link="/dashboard/penitip/tambah-penitip">
        {tableData.length > 0 && (
          <Table
            datas={tableData}
            to="/dashboard/penitip/tambah-penitip"
            onDelete={handleDelete}
            idFild="id"
          />
        )}
      </TampilanUtama>
    </>
  );
};

export default Penitip;
