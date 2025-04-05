import LayoutRouter from "@/routes/LayoutRouter";
import Navbar from "../daisyUI/Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className='bg-[#eaeaea] w-full h-screen flex'>
      <Sidebar />
      <div className='w-5/6 flex flex-col'>
        <Navbar />
        <div className='overflow-y-auto'>
          <LayoutRouter />
        </div>
      </div>
    </div>
  );
};

export default Layout;
