import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const res = await registerUser(form);
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-panel-left">
          <div className="auth-kicker">Create account</div>
          <h1 className="auth-title">
            Learn the{" "}
            <span>market basics in weeks</span>, not
            months with <span className="auth-highlight">LearnTrade</span>.
          </h1>
          <p className="auth-text">
            Get a personalized dashboard, video-based lessons, and quizzes that
            reinforce each topic.
          </p>

          <ul className="auth-benefits-list">
            <li>Build confidence with structured micro-courses.</li>
            <li>Track lesson completion and quiz scores.</li>
            <li>Unlock new modules as you progress.</li>
          </ul>

          <p className="auth-note">
            All you need is an email address to get started.
          </p>
        </div>

        <div className="auth-card">
          <h2 className="auth-heading">Sign up</h2>
          <p className="auth-subtitle">
            Join thousands of learners mastering the market.
          </p>

          {error && <div className="auth-error-box">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="form-label" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                name="name"
                className="form-input"
                placeholder="Jack Reacher"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="auth-footer-text">
            Already registered?{" "}
            <Link to="/login" className="auth-link">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
