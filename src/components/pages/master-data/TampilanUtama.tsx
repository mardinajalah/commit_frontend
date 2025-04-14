import { Link, useLocation } from "react-router-dom";

const TampilanUtama = ({
  children,
  link,
}: {
  children: React.ReactNode;
  link: string;
}) => {
  const { pathname } = useLocation();
  return (
    <div className="p-5">
      <div className="flex justify-end my-3">
        <Link
          to={link}
          className="btn border-none bg-[#6C0AFF] text-white rounded-2xl"
        >
          {`Tambah ${pathname.split("/").pop()}`}
        </Link>
      </div>
      <div className="mt-5 bg-[#fff] rounded-lg">{children}</div>
    </div>
  );
};

export default TampilanUtama;
