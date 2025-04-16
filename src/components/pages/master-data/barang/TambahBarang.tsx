import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import axios from 'axios';

type DataOptionsType = {
  id: number;
  name: string;
  isActive: string;
}[]

type ItemType = {
  id: number,
  name: string,
  purchasePrice: number,
  retailPrice: number,
  wholesalePrice: number,
  stock: number,
  minStock: number,
  barcode: string,
  image: string | null,
  category: string,
  size: number,
  unit: string,
  isActive: string
}


const formSchema = z.object({
  name: z.string().min(1, 'Nama harus diisi').max(50, 'Nama maksimal 50 karakter'),
  purchasePrice: z.number().nonnegative('Harga beli tidak boleh negatif').min(1, 'Harga beli harus diisi'),
  retailPrice: z.number().nonnegative('Harga ecer tidak boleh negatif').min(1, 'Harga ecer harus diisi'),
  wholesalePrice: z.number().nonnegative('Harga grosir tidak boleh negatif').min(1, 'Harga grosir harus diisi'),
  stock: z.number().nonnegative('Stok tidak boleh negatif').min(1, 'Stok harus diisi'),
  minStock: z.number().nonnegative('Stok minimal tidak boleh negatif').min(1, 'Stok minimal harus diisi'),
  barcode: z.string().min(1, 'Nomor barcode harus diisi').max(20, 'Nomor barcode maksimal 20 karakter'),
  image: z.string().max(255, 'URL gambar maksimal 255 karakter').optional(),
  categoryId: z.number().max(50, 'Kategori maksimal 50 karakter').min(1, 'Kategori harus diisi'),
  size: z.number().max(20, 'Ukuran maksimal 20 karakter').min(1, 'Ukuran harus diisi'),
  unitId: z.number().max(20, 'Satuan maksimal 20 karakter').min(1, 'Satuan harus diisi'),
  isActive: z.enum(['YES', 'NO']),
});

const TambahBarang = () => {
  const [category, setCategory] = useState<DataOptionsType>([]);
  const [unit, setUnit] = useState<DataOptionsType>([]);
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const [barcode, setBarcode] = useState<ItemType[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  const [form, setForm] = useState({
    name: '',
    purchasePrice: '',
    retailPrice: '',
    wholesalePrice: '',
    stock: '',
    minStock: '',
    barcode: '',
    gambar: '',
    categoryId: '',
    size: '',
    unitId: '',
    isActive: 'YES',
  });

  useEffect(() => {
    if (paramId) {
      axios
        .get(`http://localhost:3000/api/product/${paramId}`)
        .then((res) => {
          const data = res.data;
          setForm({
            name: data.name,
            purchasePrice: data.purchasePrice,
            retailPrice: data.retailPrice,
            wholesalePrice: data.wholesalePrice,
            stock: data.stock,
            minStock: data.minStock,
            barcode: data.barcode,
            gambar: data.image,
            categoryId: data.categoryId,
            size: data.size,
            unitId: data.unitId,
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

    axios
      .get('http://localhost:3000/api/product')
      .then((res) => setBarcode(res.data.data))
      .catch((err) => console.error('Gagal mengambil data barang:', err));
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
    barcode.map((item: ItemType) => {
      if (item.barcode === form.barcode) {
        setErrors((prev) => ({ ...prev, barcode: 'Nomor barcode sudah ada' }));
      }
    })
    const dataForm = {
      name: form.name,
      purchasePrice: Number(form.purchasePrice),
      retailPrice: Number(form.retailPrice),
      wholesalePrice: Number(form.wholesalePrice),
      stock: Number(form.stock),
      minStock: Number(form.minStock),
      barcode: form.barcode,
      image: form.gambar,
      categoryId: Number(form.categoryId),
      size: Number(form.size),
      unitId: Number(form.unitId),
      isActive: form.isActive
    }
    const result = formSchema.safeParse(dataForm);

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
              name='categoryId'
              value={form.categoryId}
              onChange={handleChange}
              className='w-full p-2 border border-gray-300 rounded-lg bg-white'
            >
              <option value=''>Pilih kategori</option>
              {category.map((data) => (
                <option
                  key={data.id}
                  value={data.id}
                >
                  {data.name}
                </option>
              ))}
            </select>
            {errors.categoryId && ( <p className='text-red-500 text-sm'>{errors.categoryId}</p>)}
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
            {errors.size && <p className='text-red-500 text-sm'>{errors.size}</p>}
          </div>
          <div>
            <label className='block text-gray-700 mb-1'>Satuan</label>
            <select
              name='unitId'
              value={form.unitId}
              onChange={handleChange}
              className='w-full p-2 border border-gray-300 rounded-lg bg-white'
            >
              <option value=''>Pilih satuan</option>
              {unit.map((data) => (
                <option
                  key={data.id}
                  value={data.id}
                >
                  {data.name}
                </option>
              ))}
            </select>
            {errors.unitId && <p className='text-red-500 text-sm'>{errors.unitId}</p>}
          </div>
          <div>
            <label className='block text-gray-700 mb-1'>Harga beli</label>
            <input
              type='text'
              name='purchasePrice'
              value={form.purchasePrice}
              onChange={handleChange}
              placeholder='Masukkan harga beli'
              className='w-full p-2 border border-gray-300 rounded-lg'
            />
            {errors.purchasePrice && <p className='text-red-500 text-sm'>{errors.purchasePrice}</p>}
          </div>
          <div>
            <label className='block text-gray-700 mb-1'>Harga Ecer</label>
            <input
              type='text'
              name='retailPrice'
              value={form.retailPrice}
              onChange={handleChange}
              placeholder='Masukkan harga ecer'
              className='w-full p-2 border border-gray-300 rounded-lg'
            />
            {errors.retailPrice && <p className='text-red-500 text-sm'>{errors.retailPrice}</p>}
          </div>
          <div>
            <label className='block text-gray-700 mb-1'>Harga Grosir</label>
            <input
              type='text'
              name='wholesalePrice'
              value={form.wholesalePrice}
              onChange={handleChange}
              placeholder='Masukkan harga grosir'
              className='w-full p-2 border border-gray-300 rounded-lg'
            />
            {errors.wholesalePrice && <p className='text-red-500 text-sm'>{errors.wholesalePrice}</p>}
          </div>
          <div>
            <label className='block text-gray-700 mb-1'>Barcode</label>
            <input
              type='text'
              name='barcode'
              value={form.barcode}
              onChange={handleChange}
              placeholder='Masukkan barcode'
              className='w-full p-2 border border-gray-300 rounded-lg'
            />
            {errors.barcode && <p className='text-red-500 text-sm'>{errors.barcode}</p>}
          </div>
          <div>
            <label className='block text-gray-700 mb-1'>Stok</label>
            <input
              type='text'
              name='stock'
              value={form.stock}
              onChange={handleChange}
              placeholder='Masukkan stok'
              className='w-full p-2 border border-gray-300 rounded-lg'
            />
            {errors.stock && <p className='text-red-500 text-sm'>{errors.stock}</p>}
          </div>
          <div>
            <label className='block text-gray-700 mb-1'>Minimal Stok</label>
            <input
              type='text'
              name='minStock'
              value={form.minStock}
              onChange={handleChange}
              placeholder='Masukkan minimal stok'
              className='w-full p-2 border border-gray-300 rounded-lg'
            />
            {errors.minStock && <p className='text-red-500 text-sm'>{errors.minStock}</p>}
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
