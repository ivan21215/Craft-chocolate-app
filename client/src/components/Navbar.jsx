import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useShop();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Craft Chocolate</Link>

      {user && (
        <div className="links">
          <NavLink to="/">Chocolates</NavLink>
          <NavLink to="/manufacturers">Manufacturers</NavLink>
          <NavLink to="/favorites">Favorites</NavLink>
          <NavLink to="/cart">Cart ({cartCount})</NavLink>
          {user.role === 'admin' && <NavLink to="/users">Users</NavLink>}
        </div>
      )}

      <div className="auth">
        {user ? (
          <>
            <span>{user.username}{user.role === 'admin' && ' (admin)'}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
