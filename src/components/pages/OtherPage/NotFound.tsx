import { Link } from "react-router-dom";
import PageMeta from "@/components/daisyUI/PageMeta";
import GridShape from "@/components/daisyUI/GridShape";

export default function NotFound() {
  return (
    <>
      <PageMeta
        title="404 Not Found | TailAdmin"
        description="Page not found"
      />
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-white dark:bg-gray-900 overflow-hidden z-0">
        <GridShape />
        <div className="relative z-10 mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
          <h1 className="mb-4 font-bold text-gray-900 dark:text-white text-4xl sm:text-5xl">
            404
          </h1>

          <img
            src="https://source.unsplash.com/400x300/?error,404"
            alt="404 illustration"
            className="w-full h-auto mx-auto mb-6"
          />

          <p className="mb-6 text-base text-gray-700 dark:text-gray-300 sm:text-lg">
            We can’t seem to find the page you are looking for!
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.05] dark:hover:text-white"
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
