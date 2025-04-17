import { deleteBarang, getAllDataBarang } from '@/data';
import TampilanUtama from '../TampilanUtama';
import Table from '@/components/daisyUI/Table';
import { useEffect, useState } from "react";
import { BarangType } from '@/data/interface';
import swal from 'sweetalert';

const Barang = () => {
  const [tableData, setTableData] = useState<{ title: string; header: string[]; data: BarangType[] }[]>([]);

  const fetchData = () => {
    getAllDataBarang().then((res) => {
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
        await deleteBarang(id);
        fetchData();
        swal("Berhasil", "Data berhasil dihapus", "success");
      } catch (err) {
        swal("error", "data Galal dihapus", "error");
      }
    }
  };
  
  return (
    <>
      <TampilanUtama link='/dashboard/barang/tambah-barang'>
        <Table
          datas={tableData}
          to='/dashboard/barang/tambah-barang'
          onDelete={handleDelete}
        />
      </TampilanUtama>
    </>
  );
};

export default Barang;
