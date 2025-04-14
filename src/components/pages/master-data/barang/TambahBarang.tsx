import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import axios from 'axios';

interface DataOptionsType {
  id: number;
  name: string;
  isActive: string;
}

const formSchema = z.object({
  name: z.string().max(50, 'Nama maksimal 50 karakter'),
  hargaBeli: z.coerce.number().nonnegative('Harga beli tidak boleh negatif'),
  hargaEcer: z.coerce.number().nonnegative('Harga ecer tidak boleh negatif'),
  hargaGrosir: z.coerce.number().nonnegative('Harga grosir tidak boleh negatif'),
  stok: z.coerce.number().nonnegative('Stok tidak boleh negatif'),
  stokMinimal: z.coerce.number().nonnegative('Stok minimal tidak boleh negatif'),
  barcode: z.string().max(20, 'Nomor barcode maksimal 20 karakter'),
  gambar: z.string().max(255, 'URL gambar maksimal 255 karakter').optional().or(z.literal('')),
  category: z.string().max(50, 'Kategori maksimal 50 karakter'),
  categoryId: z.coerce.number().nonnegative('ID kategori tidak boleh negatif'),
  size: z.coerce.number().max(20, 'Ukuran maksimal 20 karakter'),
  unit: z.string().max(20, 'Satuan maksimal 20 karakter'),
  isActive: z.enum(['YES', 'NO']),
});

const TambahBarang = () => {
  const [category, setCategory] = useState<DataOptionsType[]>([]);
  const [unit, setUnit] = useState<DataOptionsType[]>([]);
  const navigate = useNavigate();
  const { id: paramId } = useParams();

  const randomnumber = Math.floor(Math.random() * 1000);

  const [form, setForm] = useState({
    name: '',
    hargaBeli: '',
    hargaEcer: '',
    hargaGrosir: '',
    stok: '',
    stokMinimal: '',
    barcode: `${randomnumber}`,
    gambar: '',
    category: '',
    categoryId: '1',
    size: '',
    unit: '',
    isActive: 'YES',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  useEffect(() => {
    if (paramId) {
      axios
        .get(`http://localhost:3000/api/product/${paramId}`)
        .then((res) => {
          const data = res.data;
          setForm({
            name: data.name,
            hargaBeli: data.purchasePrice?.toString(),
            hargaEcer: data.retailPrice?.toString(),
            hargaGrosir: data.wholesalePrice?.toString(),
            stok: data.stock?.toString(),
            stokMinimal: data.minStock?.toString(),
            barcode: data.barcode,
            gambar: data.image,
            category: data.category,
            categoryId: data.categoryId?.toString(),
            size: data.size?.toString(),
            unit: data.unit,
            isActive: data.isActive,
          });
        })
        .catch((err) => console.error('Gagal mengambil data barang:', err));
    }
  }, [paramId]);
  
  useEffect(() => {
    axios
      .get('http://localhost:3000/api/category')
      .then((res) => setCategory(res.data.data))
      .catch((err) => console.error('Gagal mengambil kategori:', err));

    axios
      .get('http://localhost:3000/api/unit')
      .then((res) => setUnit(res.data.data))
      .catch((err) => console.error('Gagal mengambil satuan:', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement; // 👈 Cast agar bisa akses `files`
    const { name, value, type } = target;

    if (type === 'file') {
      const file = target.files?.[0];
      if (file) {
        // Simpan sebagai blob URL untuk preview, atau bisa juga upload ke server
        setForm((prev) => ({ ...prev, gambar: URL.createObjectURL(file) }));
      } else {
        // Kosongkan jika tidak ada file
        setForm((prev) => ({ ...prev, gambar: '' }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleToggle = () => {
    setForm((prev) => ({
      ...prev,
      isActive: prev.isActive === 'YES' ? 'NO' : 'YES',
    }));
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

    const payload = {
      name: result.data.name,
      purchasePrice: result.data.hargaBeli,
      retailPrice: result.data.hargaEcer,
      wholesalePrice: result.data.hargaGrosir,
      stock: result.data.stok,
      minStock: result.data.stokMinimal,
      barcode: result.data.barcode,
      image: result.data.gambar || null, // optional
      category: result.data.category,
      categoryId: result.data.categoryId,
      size: result.data.size,
      unit: result.data.unit,
      isActive: result.data.isActive,
    };
    console.log(payload);
    const url = paramId ? `http://localhost:3000/api/product/${paramId}` : 'http://localhost:3000/api/product';
    const method = paramId ? axios.put : axios.post;

    method(url, payload)
      .then(() => {
        alert(paramId ? 'Data berhasil diubah' : 'Data berhasil ditambahkan');
        navigate('/dashboard/barang');
      })
      .catch((err) => console.error('Gagal menyimpan:', err));
  };

  return (
    <div className='p-5'>
      <form
        onSubmit={handleSubmit}
        className='p-6 mt-5 bg-white rounded-lg shadow-md border border-gray-300'
      >
        <h2 className='text-2xl font-bold mb-4 text-gray-800'>Barang Baru</h2>
        <div className='mb-3 flex flex-col gap-2'>
          <div>
            <label className='block text-gray-700 mb-1'>Nama Produk</label>
            <input
              type='text'
              name='name'
              value={form.name}
              onChange={handleChange}
              placeholder='Masukkan nama produk'
              className='w-full p-2 border border-gray-300 rounded-lg'
            />
            {errors.name && <p className='text-red-500 text-sm'>{errors.name}</p>}
          </div>
          <div>
            <label className='block text-gray-700 mb-1'>Gambar</label>
            <input
              type='file'
              name='gambar'
              onChange={handleChange}
              className='w-full p-2 border border-gray-300 rounded-lg cursor-pointer bg-gray-100'
            />
          </div>
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <div>
            <label className='block text-gray-700 mb-1'>Kategori</label>
            <select
              name='category'
              value={form.category}
              onChange={handleChange}
              className='w-full p-2 border border-gray-300 rounded-lg bg-white'
            >
              <option value=''>Pilih kategori</option>
              {category.map((data) => (
                <option
                  key={data.id}
                  value={data.name}
                >
                  {data.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-gray-700 mb-1'>Ukuran</label>
            <input
              type='text'
              name='size'
              value={form.size}
              onChange={handleChange}
              placeholder='Masukkan ukuran'
              className='w-full p-2 border border-gray-300 rounded-lg'
            />
          </div>
          <div>
            <label className='block text-gray-700 mb-1'>Satuan</label>
            <select
              name='unit'
              value={form.unit}
              onChange={handleChange}
              className='w-full p-2 border border-gray-300 rounded-lg bg-white'
            >
              <option value=''>Pilih satuan</option>
              {unit.map((data) => (
                <option
                  key={data.id}
                  value={data.name}
                >
                  {data.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-gray-700 mb-1'>Harga beli</label>
            <input
              type='text'
              name='hargaBeli'
              value={form.hargaBeli}
              onChange={handleChange}
              placeholder='Masukkan harga cash'
              className='w-full p-2 border border-gray-300 rounded-lg'
            />
          </div>
          <div>
            <label className='block text-gray-700 mb-1'>Harga Ecer</label>
            <input
              type='text'
              name='hargaEcer'
              value={form.hargaEcer}
              onChange={handleChange}
              placeholder='Masukkan harga cashbon'
              className='w-full p-2 border border-gray-300 rounded-lg'
            />
          </div>
          <div>
            <label className='block text-gray-700 mb-1'>Harga Grosir</label>
            <input
              type='text'
              name='hargaGrosir'
              value={form.hargaGrosir}
              onChange={handleChange}
              placeholder='Masukkan harga grosir'
              className='w-full p-2 border border-gray-300 rounded-lg'
            />
          </div>
          <div>
            <label className='block text-gray-700 mb-1'>Stok</label>
            <input
              type='text'
              name='stok'
              value={form.stok}
              onChange={handleChange}
              placeholder='Masukkan stok'
              className='w-full p-2 border border-gray-300 rounded-lg'
            />
          </div>
          <div>
            <label className='block text-gray-700 mb-1'>Minimal Stok</label>
            <input
              type='text'
              name='stokMinimal'
              value={form.stokMinimal}
              onChange={handleChange}
              placeholder='Masukkan minimal stok'
              className='w-full p-2 border border-gray-300 rounded-lg'
            />
          </div>
          <div className='flex items-center gap-3 mt-3'>
            <label className='flex items-center gap-3 mt-3 cursor-pointer'>
              <span className='text-gray-700 text-sm font-medium'>Status Aktif</span>
              <div className='relative'>
                <input
                  type='checkbox'
                  className='sr-only peer'
                  checked={form.isActive === 'YES'}
                  onChange={handleToggle}
                />
                <div className='w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-purple-500 transition duration-300'></div>
                <div className='w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 peer-checked:translate-x-5 transition-transform duration-300'></div>
              </div>
            </label>
          </div>
        </div>
        <div className='flex justify-end gap-3 pt-4'>
          <button
            type='button'
            onClick={() => navigate('/dashboard/barang')}
            className='cursor-pointer border border-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition'
          >
            Batal
          </button>
          <button
            type='submit'
            className='cursor-pointer bg-[#6C0AFF] text-white px-6 py-2 rounded-full hover:bg-[#5a00e6] transition'
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
};

export default TambahBarang;
