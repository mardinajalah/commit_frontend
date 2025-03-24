import Sidebar from "@/components/layouts/Sidebar";
import Navbar from "@/components/daisyUI/Navbar";
import RoutesIndex from "@/routes/index";

const App = () => {
  return (
    <div className='bg-[#eaeaea] w-full h-screen flex'>
      <Sidebar />
      <div className='w-full flex flex-col'>
        <Navbar />
        <div className='p-5'>
          <RoutesIndex />
        </div>
      </div>
    </div>
  );
};

export default App;
