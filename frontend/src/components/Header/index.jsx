import { useEffect, useState } from 'react';
import { useAuth } from '../../context/auth-context';
import userServices from '../../services/user.service';

const Header = () => {
  // Simulated user data (replace with real data from context/API)
  const { auth } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  },[auth]);

  const loadData = async () => {
    try {
      const res = await userServices.getUserById(auth.user.id);
      setUser(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogout = () => {
    // Clear auth data (tokens/localStorage) and redirect to login
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <header className="flex items-center justify-between bg-blue-600 text-white p-4 shadow-md">
      {/* Left side - Title */}
      <h1 className="text-lg font-semibold">KnowYourHB</h1>

      {/* Right side - Profile */}
      {user && (
        <div className="flex items-center space-x-3">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-10 h-10 rounded-full border border-white shadow"
          />
          <span className="font-medium">{user.username}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
