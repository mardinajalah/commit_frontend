import Table from "@/components/daisyUI/Table"

const Barang = () => {
  return (
    <div className="p-5">
      <div className="flex justify-end my-3">
        <button className="btn border-none bg-[#6C0AFF] text-white rounded-2xl">Tambah Barang</button>
      </div>
      <div className="mt-5 bg-[#fff] rounded-lg">
        <Table />
      </div>
    </div>
  )
}

export default Barang