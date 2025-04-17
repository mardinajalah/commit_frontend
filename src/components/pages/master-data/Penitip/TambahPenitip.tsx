import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { z } from "zod";

// Validasi pakai Zod
const formSchema = z.object({
  name: z.string().max(50, "Nama maksimal 50 karakter"),
  address: z.string(),
  phoneNumber: z.string(),
  listProduct: z.string().optional(),
  isActive: z.enum(["YES", "NO"]).optional(),
});

const TambahPenitip = () => {
  const navigate = useNavigate();
  const { id: paramId } = useParams();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    listProduct: "",
    isActive: "YES",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof form, string>>
  >({});

  useEffect(() => {
    if (paramId) {
      axios
        .get(`http://localhost:3000/api/vendor/${paramId}`)
        .then((res) => setForm(res.data))
        .catch(() => {
          swal("Error", "Gagal mengambil data", "error");
        });
    }
  }, [paramId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement; // Cast here

    let newValue: string = value;

    if (type === "checkbox") {
      newValue = checked ? "YES" : "NO";
    }

    setForm((prev) => ({ ...prev, [name]: newValue }));
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
      ? `http://localhost:3000/api/vendor/${paramId}`
      : "http://localhost:3000/api/vendor";

    const method = paramId ? axios.put : axios.post;

    method(url, payload)
      .then(() => {
        if (paramId) {
          swal("Berhasil", "Data berhasil diubah", "success");
        } else {
          swal("Berhasil", "Data berhasil ditambahkan", "success");
        }
        navigate("/dashboard/penitip");
      })
      .catch(() => {
        swal("Gagal", "Gagal menyimpan data", "error");
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6 bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-semibold pb-2">
          {paramId ? "Edit Penitip" : "Penitip Baru"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nama</label>
            <input
              placeholder="Masukan nama lengkap"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input input-bordered w-full px-3 py-2 rounded-md border border-gray-300"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">No. HP</label>
            <input
              placeholder="Masukan No. HP"
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className="input input-bordered w-full px-3 py-2 rounded-md border border-gray-300"
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium  mb-2">Alamat</label>
          <textarea
            placeholder="Masukan alamat lengkap"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="textarea textarea-bordered w-full resize-none px-3 py-2 rounded-md border border-gray-300"
          />
          {errors.address && (
            <p className="text-sm text-red-500 mt-1">{errors.address}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <label className="block font-medium mb-1">Aktif</label>
            <select
              name="isActive"
              value={form.isActive}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6C0AFF]"
            >
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
            {errors.isActive && (
              <p className="text-sm text-red-500 mt-1">{errors.isActive}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 gap-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/penitip")}
            className="text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-[#6C0AFF] text-white px-6 py-2 rounded-full hover:bg-[#5a00e6] transition ml-4"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
};

export default TambahPenitip;
