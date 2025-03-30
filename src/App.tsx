import Sidebar from "@/components/layouts/Sidebar";
import Navbar from "@/components/daisyUI/Navbar";
import RoutesIndex from "@/routes";

const App = () => {
  return (
    <div className='bg-[#eaeaea] w-full h-screen flex'>
      <Sidebar />
      <div className='w-5/6 flex flex-col'>
        <Navbar />
        <div className='overflow-y-auto'>
          <RoutesIndex />
        </div>
      </div>
    </div>
  );
};

export default App;
