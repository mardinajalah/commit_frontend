import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const { pathname } = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  let formattedPathname = "dashboard";
  const pathParts = pathname.split("/");
  if (pathParts[2]) {
    formattedPathname = pathParts[2].replace(/-/g, " ");
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar bg-white text-[#514c4c] shadow-sm px-5 relative">
      <div className="flex-1">
        <h1 className="cursor-pointer text-xl font-semibold w-fit capitalize">
          {formattedPathname}
        </h1>
      </div>

      <div className="flex-none" ref={dropdownRef}>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div className="rounded-full w-[40px] h-[40px] bg-slate-200"></div>
          <p className="font-semibold text-lg flex items-center gap-1">
            Syaif Hakam
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </p>
        </div>

        {isOpen && (
          <div className="mt-3.5 bg-white shadow rounded absolute right-5 z-50 w-60 p-4">
            <h1 className="font-semibold">Syaif Hakam</h1>
            <p className="text-sm mb-2">SyaifHakam@gmail.com</p>
            <ul className="space-y-2">
              <li>
                <a href="#">Edit Profile</a>
              </li>
              <li>
                <a href="#">Account Setting</a>
              </li>
              <li>
                <a href="#">Support</a>
              </li>
              <li>
                <a href="#">Logout</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
