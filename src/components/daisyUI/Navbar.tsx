import { useLocation } from "react-router-dom";

const Navbar = () => {
  const {pathname} = useLocation();
  const formattedPathname = pathname.split("/")[1]?.replace(/-/g, " ");
  return (
    <div className='navbar bg-[#ffff] text-[#514c4c] shadow-sm px-5'>
      <div className='flex-1'>
        <h1 className='cursor-pointer text-xl font-semibold w-fit capitalize'>{formattedPathname}</h1>
      </div>
      <div className='flex-none'>
        <ul className='menu menu-horizontal px-1'>
          <li className="relative">
            <details>
              <summary className="flex justify-between max-w-max">
                <div className="rounded-full w-[40px] h-[40px] bg-slate-200"></div>
                <p className="font-semibold text-lg">Syaif Hakim</p>
              </summary>
              <ul className='bg-[#ffff] rounded-t-none rounded-sm max-w-max absolute right-0'>
                <h1 className="font-semibold">Syaif Hakim</h1>
                <p>Syaif Hakim@gmail.com</p>
                <li><a>Edit Profile</a></li>
                <li><a>Account Setting</a></li>
                <li><a>Support</a></li>
                <li><a>Logout</a></li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
