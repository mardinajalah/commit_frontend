import { Link } from "react-router-dom";
import PageMeta from "@/components/daisyUI/PageMeta";
import GridShape from "@/components/daisyUI/GridShape";

export default function NotFound() {
  return (
    <>
      <PageMeta
        title="404 Not Found | KSP POTER"
        description="Page not found"
      />
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-white overflow-hidden z-0">
        <GridShape />
        <div className="relative z-10 mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
          <img
            src="/image/undraw_page-not-found_6wni.png"
            alt="404 illustration"
            className="w-full h-auto mx-auto mb-6"
          />

          <p className="mb-6 text-base text-black sm:text-lg">
            We can’t seem to find the page you are looking for!
          </p>

          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-lg border text-white border-gray-300 bg-blue-600 px-5 py-3.5 text-sm font-medium shadow hover:bg-blue-800  "
          >
            Back to Home Page
          </Link>
        </div>

        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-center text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} - KSP POTER
        </p>
      </div>
    </>
  );
}
