import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { z } from "zod";

const formSchema = z.object({
  id: z.string().min(5, "ID harus 5 karakter").max(5, "ID maksimal 5 karakter"),
  satuan: z.string().max(50, "Satuan maksimal 50 karakter"),
  aktif: z.enum(["Yes", "No"], { errorMap: () => ({ message: "Aktif harus Yes atau No" }) }),
});

const TambahSatuan = () => {
  const navigate = useNavigate();
  const { id: paramId } = useParams(); // ambil id dari URL

  const [form, setForm] = useState({
    id: "",
    satuan: "",
    aktif: "Yes",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  // Fetch data jika paramId tersedia
  useEffect(() => {
    if (paramId) {
      axios
        .get(`http://localhost:3000/satuan/${paramId}`)
        .then((res) => {
          setForm({
            id: res.data.id,
            satuan: res.data.satuan,
            aktif: res.data.aktif,
          });
        })
        .catch((err) => {
          console.error("Gagal mengambil data:", err);
        });
    }
  }, [paramId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = formSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof typeof form, string>> = {};
      result.error.errors.forEach((err) => {
        const fieldName = err.path[0] as keyof typeof form;
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (paramId) {
      // Update jika ada id
      axios
        .put(`http://localhost:3000/satuan/${paramId}`, result.data)
        .then(() => {
          console.log("Data berhasil diubah");
          navigate("/dashboard/satuan");
        })
        .catch((err) => console.log(err));
    } else {
      // Tambah jika tidak ada id
      axios
        .post("http://localhost:3000/satuan", result.data)
        .then(() => {
          console.log("Data berhasil ditambahkan");
          navigate("/dashboard/satuan");
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kode Satuan</label>
            <input
              type="text"
              autoComplete="off"
              name="id"
              value={form.id}
              onChange={handleChange}
              disabled={!!paramId} // disable jika sedang edit
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C0AFF] transition ${paramId ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"}`}
            />
            {errors.id && <p className="text-sm text-red-500 mt-1">{errors.id}</p>}
            {paramId && <p className="text-sm text-gray-500 mt-1">kode satuan tidak dapat diubah</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Satuan</label>
            <input
              type="text"
              autoComplete="off"
              name="satuan"
              value={form.satuan}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C0AFF] transition"
            />
            {errors.satuan && <p className="text-sm text-red-500 mt-1">{errors.satuan}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aktif</label>
            <select
              name="aktif"
              value={form.aktif}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C0AFF] transition"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            {errors.aktif && <p className="text-sm text-red-500 mt-1">{errors.aktif}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard/satuan")}
              className="text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-[#6C0AFF] text-white px-6 py-2 rounded-full hover:bg-[#5a00e6] transition"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahSatuan;
