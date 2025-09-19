import { Route, Routes, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/theme-context';
import Dashboard from '../pages/dashboard';
import PublicLayout from '../pages/layout';

const PublicRoutes = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Dashboard isDarkMode={isDarkMode} />} />
      </Route>
    </Routes>
  );
};

export default PublicRoutes;
