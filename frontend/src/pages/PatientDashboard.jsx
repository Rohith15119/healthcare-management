import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api.js";
export default function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const [{ data: docs }, { data: appts }] = await Promise.all([
        api.get("/doctors"),
        api.get("/patients/appointments"),
      ]);
      setDoctors(docs);
      setAppointments(appts);
    })();
  }, []);
  const book = async () => {
    if (!selected || !date) return;
    await api.post("/patients/appointments", {
      doctorId: selected,
      scheduledAt: new Date(date),
    });
    const { data: appts } = await api.get("/patients/appointments");
    setAppointments(appts);
  };
  const pay = async (id) => {
    // Navigate to payment page with appointment details
    navigate("/payment", {
      state: {
        amount: 500,
        service: "Medical Consultation",
        appointmentId: id,
      },
    });
  };
  const feedback = async (id) => {
    const rating = Number(prompt("Rate your doctor 1-5", "5") || "5");
    const comment = prompt("Any feedback for your doctor?", "");
    await api.post(`/feedback/${id}`, { rating, comment });
    alert("Thanks for your feedback!");
  };
  return (
    <div className="page-purple">
      <div className="container-app space-y-6">
        <section className="hero">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <div className="text-sm opacity-90 font-medium">
                Patient Portal
              </div>
              <div className="text-3xl font-bold mt-1 font-serif">
                Book Your Next Visit
              </div>
            </div>
          </div>
          <p className="text-white/90 leading-relaxed">
            Discover our premium healthcare services, schedule appointments with
            top specialists, and manage your medical journey.
          </p>
        </section>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="kpi">
            <div className="value">{doctors.length}</div>
            <div>
              <div className="label">Doctors</div>
              <div className="text-sm">available</div>
            </div>
          </div>
          <div className="kpi">
            <div className="value">
              {appointments.filter((a) => a.status === "pending").length}
            </div>
            <div>
              <div className="label">Pending</div>
              <div className="text-sm">appointments</div>
            </div>
          </div>
          <div className="kpi">
            <div className="value">
              {appointments.filter((a) => a.status === "accepted").length}
            </div>
            <div>
              <div className="label">Accepted</div>
              <div className="text-sm">appointments</div>
            </div>
          </div>
          <div className="kpi">
            <div className="value">
              {appointments.filter((a) => a.status === "completed").length}
            </div>
            <div>
              <div className="label">Completed</div>
              <div className="text-sm">visits</div>
            </div>
          </div>
          <div className="kpi">
            <div className="value">
              {appointments.filter((a) => a.paymentStatus === "pending").length}
            </div>
            <div>
              <div className="label">Payments</div>
              <div className="text-sm">pending</div>
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="panel p-6">
          <h3 className="text-lg font-semibold mb-4 text-neutral-800 drop-shadow-sm">
            Quick Actions
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() =>
                navigate("/payment", {
                  state: { amount: 500, service: "General Consultation" },
                })
              }
              className="btn btn-primary flex items-center justify-center gap-2"
            >
              💳 Make Payment
            </button>
            <button
              onClick={() =>
                navigate("/payment", {
                  state: { amount: 1000, service: "Emergency Consultation" },
                })
              }
              className="btn btn-secondary flex items-center justify-center gap-2"
            >
              🚨 Emergency Payment
            </button>
            <button
              onClick={() =>
                navigate("/payment", {
                  state: { amount: 200, service: "Follow-up Consultation" },
                })
              }
              className="btn btn-success flex items-center justify-center gap-2"
            >
              🔄 Follow-up Payment
            </button>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-neutral-800 drop-shadow-sm">
          Book an appointment
        </h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="label">Choose doctor</label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="select"
            >
              <option value="">-- select --</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} – {d.specialization} ({d.experienceYears}y) ⭐{" "}
                  {(d.rating ?? 0).toFixed(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">When</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input"
            />
          </div>
          <button onClick={book} className="btn btn-brand">
            Book
          </button>
        </div>
        <h3 className="text-xl font-semibold text-neutral-800 drop-shadow-sm">
          My appointments
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {appointments.map((a) => (
            <div key={a._id} className="panel p-6 hover-lift">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-blue-800 font-semibold text-lg">
                    Dr. {a.doctor?.name}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    {a.doctor?.specialization}
                  </div>
                  <div className="text-sm text-neutral-600 flex items-center gap-1 mt-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {new Date(a.scheduledAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <span
                  className={`pill ${
                    a.status === "completed"
                      ? "pill-emerald"
                      : a.status === "accepted"
                      ? "pill-sky"
                      : a.status === "rejected"
                      ? "pill-red"
                      : a.status === "pending"
                      ? "pill-amber"
                      : "pill-neutral"
                  }`}
                >
                  {a.status}
                </span>
                <span
                  className={`pill ${
                    a.paymentStatus === "paid"
                      ? "pill-emerald"
                      : a.paymentStatus === "pending"
                      ? "pill-amber"
                      : "pill-neutral"
                  }`}
                >
                  {a.paymentStatus}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                {a.status === "accepted" && a.paymentStatus === "pending" && (
                  <button
                    onClick={() => pay(a._id)}
                    className="btn btn-success"
                  >
                    Pay
                  </button>
                )}
                {a.status === "completed" && (
                  <button
                    onClick={() => feedback(a._id)}
                    className="btn btn-warning"
                  >
                    Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
