import Table from "@/components/daisyUI/Table";
import { getAllDataSatuan, deleteSatuan } from "@/data";
import TampilanUtama from "../TampilanUtama";
import { useEffect, useState } from "react";
import { SatuanType } from "@/data/interface";
import swal from "sweetalert";

const Satuan = () => {
  const [tableData, setTableData] = useState<{ title: string; header: string[]; data: SatuanType[] }[]>([]);

  const fetchData = () => {
    getAllDataSatuan().then((res) => {
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
    })

    if (result) {
      try {
        await deleteSatuan(id);
        swal("Berhasil", "Data berhasil dihapus", "success");
        fetchData();
      } catch (err) {
        swal("data digunakan", "Data Digunakan di komponen Lain", "error");
      }
    }
  };

  return (
    <>
      <TampilanUtama link="/dashboard/satuan/tambah-satuan">
        <Table
          datas={tableData}
          to="/dashboard/satuan/tambah-satuan"
          onDelete={handleDelete}
        />
      </TampilanUtama>
    </>
  );
};

export default Satuan;
