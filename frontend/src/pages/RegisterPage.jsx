import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api.js";
const roles = [
  { value: "patient", label: "Patient" },
  { value: "doctor", label: "Doctor" },
];
export default function RegisterPage() {
  const [role, setRole] = useState("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("General Physician");
  const [experienceYears, setExperienceYears] = useState(1);
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/auth/register", {
        email,
        password,
        role,
        name,
        specialization: role === "doctor" ? specialization : undefined,
        experienceYears:
          role === "doctor" ? Number(experienceYears) : undefined,
        age: role === "patient" ? Number(age) : undefined,
        phone,
      });
      setSuccess("Account created! Please login.");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };
  return (
    <div className="page-auth grid place-items-center">
      <div className="relative w-full max-w-xl">
        <div className="glow rounded-3xl" />
        <div className="relative w-full card p-8">
          <h1
            style={{
              background: "linear-gradient(90deg, #ffffffff, #ffffffff)",
              WebkitBackgroundClip: "text",
              textDecoration: "none",
              fontWeight: "800",
              color: "white",
              WebkitTextFillColor: "transparent",
            }}
            className="text-3xl font-extrabold tracking-tight mb-2 text-center drop-shadow-sm"
          >
            Create account
          </h1>
          <p className="text-sm text-center text-neutral-700 mb-6 font-medium">
            Choose your role and fill in your details.
          </p>
          <div className="mb-5">
            <div className="label">I am a</div>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  className={`chip ${role === r.value ? "chip-active" : ""}`}
                  onClick={() => setRole(r.value)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="label">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                required
              />
            </div>
            {role === "doctor" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label">Specialization</label>
                  <input
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="input"
                    placeholder="Cardiologist, Surgeon"
                  />
                </div>
                <div>
                  <label className="label">Experience (years)</label>
                  <input
                    type="number"
                    min="0"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="input"
                  />
                </div>
              </div>
            )}
            {role === "patient" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label">Age</label>
                  <input
                    type="number"
                    min="0"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-info">{success}</div>}
            <button className="btn btn-brand w-full hover-lift">
              Create account
            </button>
            <div className="text-xs text-neutral-700 text-center font-medium">
              Already have an account?{" "}
              <Link
                className="underline hover:text-sky-600 font-semibold transition-colors duration-300"
                to="/login"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
