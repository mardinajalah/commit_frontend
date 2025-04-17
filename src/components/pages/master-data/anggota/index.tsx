import Table from "@/components/daisyUI/Table";
import { getAllDataAnggota, deleteAnggota } from "@/data";
import TampilanUtama from "../TampilanUtama";
import { useEffect, useState } from "react";
import { AnggotaType } from "@/data/interface";
import swal from "sweetalert";

const Anggota = () => {
  const [tableData, setTableData] = useState<
    { title: string; header: string[]; data: AnggotaType[] }[]
  >([]);

  const fetchData = () => {
    getAllDataAnggota().then((res) => {
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
        await deleteAnggota(id);
        fetchData(); // Refresh data
        swal("Berhasil", "Data berhasil dihapus", "success");
      } catch (err) {
        console.error("Gagal menghapus data:", err);
        swal("Error", "Gagal menghapus data", "error");
      }
    }
  };

  return (
    <>
      <TampilanUtama link="/dashboard/anggota/tambah-anggota">
        <Table
          datas={tableData}
          to="/dashboard/anggota/tambah-anggota"
          onDelete={handleDelete}
          idFild="nip"
        />
      </TampilanUtama>
    </>
  );
};

export default Anggota;
