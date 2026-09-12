import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  if (isAuthPage) {
    return (
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <div className="nav-logo-badge">LT</div>
            LearnTrade
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          <div className="nav-logo-badge">LT</div>
          LearnTrade
        </Link>

        <Link to="/modules" className="nav-link">
          Modules
        </Link>
        {user && (
          <>
            <Link to="/progress" className="nav-link">
              Progress
            </Link>
            <Link to="/ai-tutor">AI Tutor</Link>
            
            {user.role === "admin" && (
              <Link to="/admin" className="nav-link">
                Admin
              </Link>
            )}
          </>
        )}
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-user">Hi, {user.name}</span>
            <button className="btn btn-ghost" onClick={logout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Log in
            </Link>
            <Link to="/register">
              <button className="btn btn-primary">Sign up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
