import Table from "@/components/daisyUI/Table";
import { getAllDataBarangTitipan, deleteBarangTitipan } from "@/data";
import TampilanUtama from "../TampilanUtama";
import { useEffect, useState } from "react";
import { BarangTitipanType } from "@/data/interface";

const BarangTitipan = () => {
  const [tableData, setTableData] = useState<
    { title: string; header: string[]; data: BarangTitipanType[] }[]
  >([]);

  const fetchData = () => {
    getAllDataBarangTitipan().then((res) => {
      setTableData([res]);
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
        await deleteBarangTitipan(id);
        swal("Berhasil", "Data berhasil dihapus", "success");
        fetchData();
      } catch (err) {
        swal("data digunakan", "Data Digunakan di komponen Lain", "error");
      }
    }
  };

  return (
    <>
      <TampilanUtama link="/dashboard/barang-titipan/tambah-barang-titipan">
        <Table
          datas={tableData}
          to="/dashboard/barang-titipan/tambah-barang-titipan"
          onDelete={handleDelete}
        />
      </TampilanUtama>
    </>
  );
};

export default BarangTitipan;
