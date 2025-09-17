import { Route, Routes } from 'react-router-dom';
import { useAuth } from './context/auth-context';
import PublicRoutes from './routes/publicRoutes';
import AuthRoutes from './routes/authRoutes';


function App() {
  const { isAuth } = useAuth();


  return (
    <Routes>
      <Route path='/*' element={<PublicRoutes />} />
      <Route path='/auth/*' element={<AuthRoutes />} />
    </Routes>
  );
}

export default App;
