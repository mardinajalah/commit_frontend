import Login from "@/components/auth/Login";
import Layout from "@/components/layouts/Layout";
import NotFound from "@/components/pages/OtherPage/NotFound";
import { Route, Routes } from "react-router-dom";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard/*" element={<Layout />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
