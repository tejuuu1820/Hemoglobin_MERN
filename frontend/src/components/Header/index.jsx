const Header = () => {
  const handleLogout = () => {
    // Clear auth data (tokens/localStorage) and redirect to login
    localStorage.removeItem('token');
    window.location.href = '/login'; // redirect
  };

  return (
    <header className="flex items-center justify-between bg-blue-600 text-white p-4 shadow-md">
      <h1 className="text-lg font-semibold">Hemoglobin Dashboard</h1>
      <button
        onClick={handleLogout}
        className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
