import Layout from "@/components/layouts/Layout";
import { Route, Routes } from "react-router-dom";

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<h1>Home</h1>} />
      <Route path='/dashboard/*' element={<Layout />} />
      <Route path='/*' element={<h1>404</h1>} />
    </Routes>
  );
};

export default AppRouter;
