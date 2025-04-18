import InputToggle from '@/components/layouts/InputToggle';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const Penjual = () => {
  const [customer, setCustomer] = useState('Anggota');
  const [cash, setCash] = useState('Cash');
  const [quantity, setQuantity] = useState(1);
  const [subTotal, setSubTotal] = useState(23000)

  return (
    <div className='p-15'>
      <div className='bg-white rounded-2xl pb-5'>
        <h1 className='text-2xl font-bold border-b-[1px] py-5 px-10'>From Transaksi</h1>
        <div className='px-10'>
          <div className='py-5 px-10 flex justify-between'>
            <div className='max-w-max'>
              <h1 className='text-2xl mb-5 font-medium'>Customer</h1>
              <div className='flex gap-2 items-center'>
                <h1 className='text-2xl mr-15'>pilih customer : </h1>
                <InputToggle
                  value={customer}
                  onChange={setCustomer}
                  options={['Anggota', 'Umum']}
                />
              </div>
            </div>
            <div className='max-w-max mr-5'>
              <h1 className='text-2xl mb-5 font-medium'>Metode Pembayaran</h1>
              <div className='flex gap-2 items-center'>
                <h1 className='text-2xl mr-15'>Pilih Pembayaran : </h1>
                {customer === 'Anggota' ? (
                  <InputToggle
                    value={cash}
                    onChange={setCash}
                    options={['Cash', 'Bon']}
                  />
                ) : (
                  <button className='cursor-pointer px-4 py-2 text-sm font-medium bg-blue-500 text-white w-32 rounded-sm'>cash</button>
                )}
              </div>
            </div>
          </div>
          <div className='mt-10 flex justify-between items-center'>
            <h1 className='text-2xl font-medium'>detail customer</h1>
            <label className='input border-2 border-gray-400 rounded-sm w-lg text-2xl py-2'>
              <input
                type='text'
                placeholder='cari customer'
              />
              <FaSearch className='text-gray-600 cursor-pointer text-2xl' />
            </label>
          </div>
          <div className='border-gray-500 border-2 p-2 mt-5 rounded-xl'>
            <div className='text-xl'>
              <span>nama customer</span>
              <span className='mx-2'>:</span>
              <span>fulan</span>
            </div>
            <div className='text-xl my-2'>
              <span>nomor Telpon</span>
              <span className='mx-2'>:</span>
              <span>081234567890</span>
            </div>
            <div className='text-xl'>
              <span>Alamat</span>
              <span className='mx-2'>:</span>
              <span>jl. Sudirman no 28</span>
            </div>
          </div>
          <div className='mt-10 flex justify-between items-center'>
            <h1 className='text-2xl font-medium'>Produk</h1>
            <label className='input border-2 border-gray-400 rounded-sm w-lg text-2xl py-2'>
              <input
                type='text'
                placeholder='cari produk'
              />
              <FaSearch className='text-gray-600 cursor-pointer text-2xl' />
            </label>
          </div>
          <div className='border-2 border-gray-500 mt-5 rounded-xl'>
            <h1 className='text-xl font-medium border-b-2 p-2'>list produk</h1>
            <table className='table text-center'>
              <thead className='border-b-2 text-xl'>
                <tr>
                  <th>no</th>
                  <th>nama</th>
                  <th>harga</th>
                  <th>quantity</th>
                  <th>sub total</th>
                </tr>
              </thead>
              <tbody className='text-xl'>
                <tr>
                  <td>1</td>
                  <td>rokok surya 12</td>
                  <td>23.000</td>
                  <td>
                    <div className='flex justify-center items-center'>
                      <button
                        className={`cursor-pointer border-2 px-2 text-2xl ${quantity <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => {
                          setQuantity(quantity - 1)
                          setSubTotal(subTotal - 23000)
                        }}
                        disabled={quantity <= 0}
                      >
                        -
                      </button>
                      <h1 className='mx-3'>{quantity}</h1>
                      <button
                        className='cursor-pointer border-2 px-2 text-2xl'
                        onClick={() => {
                          setQuantity(quantity + 1);
                          setSubTotal((quantity + 1) * 23000);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{subTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h1 className='flex items-center justify-end mt-4 pr-15 text-xl'>
            total :
            <span className='ml-10 border-2 border-gray-500 px-5 rounded-sm'>22222</span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Penjual;
