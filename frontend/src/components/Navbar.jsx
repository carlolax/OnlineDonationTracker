import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    const isUserAdmin = user && user.role === 'admin';
    logout();
    navigate(isUserAdmin ? '/admin/login' : '/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">Online Donation Tracker</Link>
      <div>
        {user ? (
          <>
            {isAdmin() ? (
              <>
                <Link to="/admin/dashboard" className="mr-4 font-semibold">Admin Dashboard</Link>
              </>
            ) : (
              <Link to="/tasks" className="mr-4">Donations</Link>
            )}
            <Link to="/profile" className="mr-4">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout {user.role === 'admin' ? '(Admin)' : ''}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Donor Login</Link>
            <Link
              to="/register"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
