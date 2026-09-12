import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser({ email, password });
      const { user, token } = res.data;

      login(token, user);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-panel-left">
          <div className="auth-highlight">
  <strong>LearnTrade</strong>
</div>
          <h1 className="auth-title">
            Sign in to continue your{" "}
            <span className="auth-highlight">stock market journey</span>.
          </h1>
          <p className="auth-text">
            Track your progress through each module, test yourself with quizzes,
            and build confidence in trading concepts one lesson at a time.
          </p>

          <ul className="auth-benefits-list">
            <li>Short, focused lessons on real stock market topics.</li>
            <li>Instant feedback with auto-graded quizzes.</li>
            <li>Pick up exactly where you left off.</li>
          </ul>

          <p className="auth-note">
            Tip: use the same email every time so your progress is saved.
          </p>
        </div>

        <div className="auth-card">
          <h2 className="auth-heading">Log in</h2>
          <p className="auth-subtitle">
            Use the account you created when you first signed up.
          </p>

          {error && <div className="auth-error-box">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="form-input"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="password-field">
                <input
                  id="password"
                  className="form-input"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="auth-footer-text">
            New here?{" "}
            <Link to="/register" className="auth-link">
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
