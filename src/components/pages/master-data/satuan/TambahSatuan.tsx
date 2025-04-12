import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TambahSatuan = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id: '',
    satuan: '',
    aktif: 'Yes',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    axios
      .post('http://localhost:3000/satuan', form).then(() => {
        console.log('Data berhasil ditambahkan');
      })
      .catch((err) => {
        console.log(err);
      })
    navigate('/dashboard/satuan');
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kode Satuan
            </label>
            <input
              type="text"
              name="id"
              value={form.id}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C0AFF] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Satuan
            </label>
            <input
              type="text"
              name="satuan"
              value={form.satuan}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C0AFF] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aktif
            </label>
            <select
              name="aktif"
              value={form.aktif}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C0AFF] transition"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/satuan')}
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