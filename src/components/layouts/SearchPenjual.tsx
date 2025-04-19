import { FC } from 'react';

interface SearchPenjualProps {
  title: string;
  placeholder: string;
  children: React.ReactNode;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: (item: any) => void;
  value: string;
  data: any;
}

const SearchPenjual: FC<SearchPenjualProps> = ({ title, placeholder, children, data, onSearch, value, onClick }) => {
  return (
    <div className='mt-10 flex justify-between items-center'>
      <h1 className='text-2xl font-medium'>{title}</h1>
      <div className='relative'>
        <label className='input border-2 border-gray-400 rounded-sm w-lg'>
          <input
            type='text'
            value={value}
            placeholder={placeholder}
            onChange={onSearch}
            className='p-2 w-full text-lg outline-none'
          />
          {children}
        </label>
        {value && (
          <div className='absolute w-full z-10 bg-white shadow-xl border-2 border-gray-500 rounded-sm mt-2 p-2'>
            {data.map((item: any, i: number) => (
              <h1
                key={i}
                onClick={() => onClick(item)}
                className='cursor-pointer p-2 rounded-sm hover:bg-[#eaeaea]'
              >
                {item.name} - {item.nip || item.purchasePrice}
              </h1>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPenjual;
