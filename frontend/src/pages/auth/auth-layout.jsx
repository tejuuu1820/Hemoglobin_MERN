import { Outlet } from 'react-router-dom';
import { useTheme } from '../../context/theme-context';

const AuthLayout = () => {
  const { isDarkMode } = useTheme();
  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col items-center justify-center">
        <div className="text-4xl font-bold mx-auto my-8">
          Hemoglobin Project
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
