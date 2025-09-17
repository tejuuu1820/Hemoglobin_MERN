import { Outlet } from 'react-router-dom';
import { useTheme } from '../../context/theme-context';

const AuthLayout = () => {
  const { isDarkMode } = useTheme();
  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col items-center justify-center">
        <div className=" text-4xl font-bold mx-auto my-8">
          Hemoglobin Project
        </div>
        <div
          className={`md:w-[500px] mb-8  rounded-xl shadow-xl p-4 lg:p-10 lg:mx-auto ${
            isDarkMode ? 'bg-slate-800' : 'bg-slate-800'
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
