import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { z } from "zod";

// Schema validasi hanya untuk name dan isActive (optional)
const formSchema = z.object({
  name: z.string().min(1, "Nama harus diisi").max(50, "Nama maksimal 50 karakter"),
  isActive: z.enum(["YES", "NO"]).optional(),
});

const TambahSatuan = () => {
  const navigate = useNavigate();
  const { id: paramId } = useParams();

  const [form, setForm] = useState({
    name: "",
    isActive: "YES",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  useEffect(() => {
    if (paramId) {
      axios
        .get(`http://localhost:3000/api/unit/${paramId}`)
        .then((res) => {
          setForm({
            name: res.data.name,
            isActive: res.data.isActive,
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

    const payload = result.data;

    const url = paramId
      ? `http://localhost:3000/api/unit/${paramId}`
      : "http://localhost:3000/api/unit";

    const method = paramId ? axios.put : axios.post;

    method(url, payload)
      .then(() => {
        console.log(paramId ? "Data berhasil diubah" : "Data berhasil ditambahkan");
        navigate("/dashboard/satuan");
      })
      .catch((err) => console.error("Gagal menyimpan:", err));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Satuan</label>
            <input
              type="text"
              autoComplete="off"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C0AFF] transition"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aktif</label>
            <select
              name="isActive"
              value={form.isActive}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C0AFF] transition"
            >
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
            {errors.isActive && <p className="text-sm text-red-500 mt-1">{errors.isActive}</p>}
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