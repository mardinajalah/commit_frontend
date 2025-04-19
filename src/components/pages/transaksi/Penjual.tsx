import InputToggle from '@/components/layouts/InputToggle';
import SearchPenjual from '@/components/layouts/SearchPenjual';
import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

interface dataProdukType {
  id: number;
  name: string;
  purchasePrice: number;
  retailPrice: number;
  wholesalePrice: number;
  stock: number;
  minStock: number;
  barcode: string;
  image: string;
  category: string;
  size: number;
  unit: string;
  isActive: string;
  quantity: number;
  subTotal: number;
}

interface dataCustomerType {
  nip: string;
  name: string;
  accountNumber: string;
  bank: string;
  phoneNumber: string;
  address: string;
  creditLimit: number;
  isActive: string;
}

const Penjual = () => {
  const [customer, setCustomer] = useState('Anggota');
  const [cash, setCash] = useState('Cash');
  const [searchProduct, setSearchProduct] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [dataProduk, setDataProduk] = useState<dataProdukType[]>([]);
  const [dataCustomer, setDataCustomer] = useState<dataCustomerType[]>([]);
  const [fetchCustomer, setfetchCustomer] = useState<dataCustomerType>();
  const [fetchProduct, setfetchProduct] = useState<dataProdukType[]>([]);
  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/product')
      .then((res) => {
        setDataProduk(res.data.data);
      })
      .catch((err) => {
        swal('Error', `${err.message}`, 'error');
      });

    axios
      .get('http://localhost:3000/api/member')
      .then((res) => {
        setDataCustomer(res.data.data);
      })
      .catch((err) => {
        swal('Error', `${err.message}`, 'error');
      });
  }, []);

  const hendleClick = (item: any, uniq: string) => {
    if (uniq === 'product') {
      const existingProductIndex = fetchProduct.findIndex((prod) => prod.name === item.name && prod.purchasePrice === item.purchasePrice);

      if (existingProductIndex !== -1) {
        const updatedProducts = fetchProduct.map((prod, index) =>
          index === existingProductIndex
            ? {
                ...prod,
                quantity: prod.quantity + 1,
                subTotal: (prod.quantity + 1) * prod.purchasePrice,
              }
            : prod
        );
        setfetchProduct(updatedProducts);
        setSubTotal(updatedProducts.reduce((total, prod) => total + prod.subTotal, 0));
      } else {
        setfetchProduct([...fetchProduct, { ...item, quantity: 1, subTotal: item.purchasePrice }]);
        setSubTotal(subTotal + item.purchasePrice);
      }
    } else if (uniq === 'customer') {
      setfetchCustomer(item);
    }
    setSearchCustomer('');
    setSearchProduct('');
  };

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
          <SearchPenjual
            value={searchCustomer}
            title='detail customer'
            placeholder='cari anggota'
            data={dataCustomer}
            onSearch={(e) => setSearchCustomer(e.target.value)}
            onClick={(item: dataCustomerType) => hendleClick(item, 'customer')}
          >
            <FaSearch className='text-gray-600 cursor-pointer text-2xl' />
          </SearchPenjual>
          {fetchCustomer ? (
            <div className='border-gray-500 border-2 p-2 mt-5 rounded-xl'>
              <div className='text-xl'>
                <span>Nip </span>
                <span className='mx-2'>:</span>
                <span>{fetchCustomer.nip}</span>
              </div>
              <div className='text-xl'>
                <span>nama </span>
                <span className='mx-2'>:</span>
                <span>{fetchCustomer.name}</span>
              </div>
              <div className='text-xl my-2'>
                <span>nomor Telpon</span>
                <span className='mx-2'>:</span>
                <span>{fetchCustomer.phoneNumber}</span>
              </div>
              <div className='text-xl'>
                <span>Alamat</span>
                <span className='mx-2'>:</span>
                <span>{fetchCustomer.address}</span>
              </div>
            </div>
          ) : (
            <div className='border-gray-500 border-2 p-2 mt-5 rounded-xl'>
              <h1 className='text-xl text-center'>silakan cari customer 👆</h1>
            </div>
          )}
          <SearchPenjual
            value={searchProduct}
            title='pilih produk'
            placeholder='cari produk'
            data={dataProduk}
            onSearch={(e) => setSearchProduct(e.target.value)}
            onClick={(item: dataProdukType) => hendleClick(item, 'product')}
          >
            <FaSearch className='text-gray-600 cursor-pointer text-2xl' />
          </SearchPenjual>
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
                {fetchProduct.map((item, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.purchasePrice}</td>
                    <td>
                      <div className='flex justify-center items-center'>
                        <button
                          className={`cursor-pointer border-2 px-2 text-2xl ${item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => {
                            const updatedProducts = fetchProduct.map((prod, index) => (index === i ? { ...prod, quantity: prod.quantity - 1, subTotal: (prod.quantity - 1) * prod.purchasePrice } : prod));
                            setfetchProduct(updatedProducts);
                            setSubTotal(updatedProducts.reduce((total, prod) => total + prod.subTotal, 0));
                          }}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <h1 className='mx-3'>{item.quantity}</h1>
                        <button
                          className='cursor-pointer border-2 px-2 text-2xl'
                          onClick={() => {
                            const updatedProducts = fetchProduct.map((prod, index) => (index === i ? { ...prod, quantity: prod.quantity + 1, subTotal: (prod.quantity + 1) * prod.purchasePrice } : prod));
                            setfetchProduct(updatedProducts);
                            setSubTotal(updatedProducts.reduce((total, prod) => total + prod.subTotal, 0));
                          }}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{item.subTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='flex items-center justify-end mt-4 pr-15 text-xl'>
            total :<h1 className='ml-10 border-2 border-gray-500 px-5 rounded-sm'>{subTotal}</h1>
          </div>
          <div className='flex items-center justify-end mt-10 text-xl'>
            <button className='btn bg-blue-700 text-white border-0 rounded-sm'>Lanjut pembayaran</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Penjual;
