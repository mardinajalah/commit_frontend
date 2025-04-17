import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { z } from "zod";
import swal from "sweetalert";

// Schema validasi untuk semua field
const formSchema = z.object({
  nip: z
    .string()
    .max(10, "NIP maksimal 10 karakter")
    .nonempty("NIP harus diisi"),
  name: z
    .string()
    .max(50, "Nama maksimal 50 karakter")
    .nonempty("Nama harus diisi"),
  accountNumber: z
    .string()
    .max(20, "Nomor rekening maksimal 20 karakter")
    .nonempty("Nomor rekening harus diisi"),
  bank: z
    .string()
    .max(20, "Nama bank maksimal 20 karakter")
    .nonempty("Nama bank harus diisi"),
  phoneNumber: z
    .string()
    .max(15, "Nomor telepon maksimal 15 karakter")
    .nonempty("Nomor telepon harus diisi"),
  address: z
    .string()
    .nonempty("Alamat harus diisi")
    .nonempty("Alamat harus diisi"),
  creditLimit: z.coerce
    .number()
    .nonnegative("Limit piutang tidak boleh negatif")
    .min(1, "Limit piutang harus diisi"),
  isActive: z.enum(["YES", "NO"]),
});

type dataUniqueType = {
  nip: string;
  name: string;
  accountNumber: string;
  bank: string;
  phoneNumber: string;
  address: string;
  creditLimit: number;
  isActive: string;
};

const TambahAnggota = () => {
  const navigate = useNavigate();
  const { nip: paramId } = useParams();
  const [dataUnique, setDataUnique] = useState<dataUniqueType[]>([]);
  const [form, setForm] = useState({
    nip: "",
    name: "",
    accountNumber: "",
    bank: "",
    phoneNumber: "",
    address: "",
    creditLimit: 0,
    isActive: "YES",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof form, string>>
  >({});

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/member")
      .then((res) => {
        setDataUnique(res.data.data);
      })
      .catch((err) => {
        console.error("Gagal mengambil data:", err);
      });
  });

  useEffect(() => {
    if (paramId) {
      axios
        .get(`http://localhost:3000/api/member/${paramId}`)
        .then((res) => {
          setForm({
            nip: res.data.nip || "",
            name: res.data.name || "",
            accountNumber: res.data.accountNumber || "",
            bank: res.data.bank || "",
            phoneNumber: res.data.phoneNumber || "",
            address: res.data.address || "", // Perbaikan: 'address' bukan 'addres'
            creditLimit: res.data.creditLimit || 0,
            isActive: res.data.isActive || "YES",
          });
        })
        .catch((err) => {
          console.error("Gagal mengambil data:", err);
        });
    }
  }, [paramId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const newValue =
      type === "number" ? (value === "" ? 0 : parseFloat(value)) : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dataUnique.map((data: dataUniqueType) => {
      if (data.nip === form.nip) {
        setErrors((prev) => ({ ...prev, nip: "NIP sudah terdaftar" }));
        setErrors((prev) => ({
          ...prev,
          phoneNumber: "Nomor telepon sudah terdaftar",
        }));
        setErrors((prev) => ({
          ...prev,
          accountNumber: "Nomor rekening sudah terdaftar",
        }));
      }
    });

    try {
      const result = formSchema.parse(form);

      const url = paramId
        ? `http://localhost:3000/api/member/${paramId}`
        : "http://localhost:3000/api/member";

      const method = paramId ? axios.put : axios.post;

      method(url, result)
        .then(() => {
          if (paramId) {
            swal("Berhasil", "Data anggota berhasil diupdate", "success");
          } else {
            swal("Berhasil", "Data anggota berhasil disimpan", "success");
          }
          navigate("/dashboard/anggota");
        })
        .catch(() => swal("Gagal", "Data anggota gagal disimpan", "error"));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof typeof form, string>> = {};
        error.errors.forEach((err) => {
          const fieldName = err.path[0] as keyof typeof form;
          fieldErrors[fieldName] = err.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-2xl shadow border-gray-300 mt-12 bg-white">
      <h2 className="text-xl font-semibold mb-6">
        {paramId ? "Edit Anggota" : "Form Anggota Baru"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* NIP */}
        <div>
          <label className="block font-medium mb-1">NIP</label>
          <input
            type="text"
            name="nip"
            placeholder="Masukan NIP Anggota"
            value={form.nip}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C0AFF]"
          />
          {errors.nip && (
            <p className="text-sm text-red-500 mt-1">{errors.nip}</p>
          )}
        </div>

        {/* Nama Lengkap */}
        <div>
          <label className="block font-medium mb-1">Nama Lengkap</label>
          <input
            type="text"
            name="name"
            placeholder="Masukan Nama Anggota"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C0AFF]"
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Nomor Telepon */}
        <div>
          <label className="block font-medium mb-1">Nomor Telepon</label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Masukan No. Telepon"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C0AFF]"
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Nomor Rekening */}
        <div>
          <label className="block font-medium mb-1">Nomor Rekening</label>
          <input
            type="text"
            name="accountNumber"
            placeholder="Masukan Nomor Rekening"
            value={form.accountNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C0AFF]"
          />
          {errors.accountNumber && (
            <p className="text-sm text-red-500 mt-1">{errors.accountNumber}</p>
          )}
        </div>

        {/* Nama Bank */}
        <div>
          <label className="block font-medium mb-1">Nama Bank</label>
          <select
            name="bank"
            value={form.bank}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C0AFF]"
          >
            <option value="">Pilih Bank</option>
            <option value="BRI">BRI</option>
            <option value="BNI">BNI</option>
            <option value="BCA">BCA</option>
            <option value="Mandiri">Mandiri</option>
          </select>
          {errors.bank && (
            <p className="text-sm text-red-500 mt-1">{errors.bank}</p>
          )}
        </div>

        {/* Alamat Lengkap */}
        <div className="md:col-span-2">
          <label className="block font-medium mb-1">Alamat Lengkap</label>
          <textarea
            name="address"
            placeholder="Masukan Alamat Lengkap"
            value={form.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C0AFF]"
          ></textarea>
          {errors.address && (
            <p className="text-sm text-red-500 mt-1">{errors.address}</p>
          )}
        </div>

        {/* Limit Piutang */}
        <div>
          <label className="block font-medium mb-1">Limit Piutang</label>
          <input
            type="number"
            name="creditLimit"
            placeholder="Masukan Limit Piutang"
            value={form.creditLimit}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C0AFF]"
          />
          {errors.creditLimit && (
            <p className="text-sm text-red-500 mt-1">{errors.creditLimit}</p>
          )}
        </div>

        {/* Aktif */}
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

        {/* Tombol Simpan */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/dashboard/anggota")}
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

export default TambahAnggota;
