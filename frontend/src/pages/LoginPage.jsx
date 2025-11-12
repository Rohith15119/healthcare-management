import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api.js";
import useAuthStore from "../store/auth.js";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuthStore();
  // no side effects needed here
  useEffect(() => {}, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.token, { role: data.role, name: data.name });
      navigate(`/${data.role}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };
  return (
    <div className="page-auth grid place-items-center">
      <div className="relative w-full max-w-md">
        <div className="glow rounded-3xl" />
        <div className="relative w-full card p-8">
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm text-white/90 font-medium tracking-wide">
                Advanced Healthcare Management
              </p>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3 text-center font-serif drop-shadow-lg">
            MediCare Pro
          </h1>
          <p className="text-sm text-center text-white/90 mb-8 leading-relaxed font-medium drop-shadow-sm">
            Your trusted partner in comprehensive healthcare management and
            patient care excellence.
          </p>
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
            </div>
            <div className="flex items-center justify-end text-xs text-white/80 font-medium">
              <Link
                to="/register"
                className="underline hover:text-white transition-colors duration-300"
              >
                Create an account
              </Link>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <button className="btn btn-brand w-full hover-lift">Login</button>
            <div className="text-xs text-white/70 text-center font-medium">
              By continuing you agree to our terms.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
