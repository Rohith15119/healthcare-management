import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth.js";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <header
      className="sticky top-0 z-20 backdrop-blur-xl border-b-2 border-amber-200/30"
      style={{
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 245, 220, 0.9) 100%)",
      }}
    >
      <div className="container-app py-4 flex items-center justify-between">
        <Link
          style={{
            background: "linear-gradient(90deg, #FFB800, #FF8000)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textFillColor: "transparent",
          }}
          to={user?.role ? `/${user.role}` : "/login"}
          className="flex items-center gap-2 font-extrabold text-gradient text-xl font-serif"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          Elite Healthcare
        </Link>
        <nav className="flex items-center gap-2">
          {user?.name && (
            <span className="text-sm text-neutral-600">Hi, {user.name}</span>
          )}
          {user ? (
            <button
              className="btn btn-ghost"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary" to="/register">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
