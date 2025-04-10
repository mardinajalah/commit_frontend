import Accordion from "@/components/daisyUI/Accordion";
import { dataAccordion } from "@/data/index";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className='bg-[#fff] px-4 pb-3 w-1/6 h-screen shadow-md text-[#514c4c] flex flex-col overflow-y-auto'>
      <h1 className='font-extrabold uppercase text-xl text-center my-10'>ksp poter</h1>
      <div className='text-lg flex-1'>
        <Link to="/dashboard">
          <h1 className='cursor-pointer p-3.5 font-semibold hover:bg-gray-100 rounded-lg'>Dashboard</h1>
        </Link>
        <Accordion datas={dataAccordion} />
      </div>
      <h1 className='cursor-pointer text-lg p-3.5 font-semibold hover:bg-gray-100 rounded-lg'>Setting</h1>
    </div>
  );
};

export default Sidebar;
