import { useEffect, useState } from "react";
import api from "../lib/api.js";
import useAuthStore from "../store/auth.js";
export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/doctors/appointments");
        setAppointments(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  if (loading) return <div className="p-8 skeleton h-8 w-40"></div>;
  return (
    <div className="page-sky">
      <div className="container-app space-y-6">
        <section className="hero">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm opacity-90 font-medium">
                Doctor Dashboard
              </div>
              <div className="text-3xl font-bold mt-1 font-serif">
                Welcome Dr. {user?.name}
              </div>
            </div>
          </div>
          <p className="text-white/90 leading-relaxed">
            Review appointments, accept or reject requests, and complete
            consultations with our premium healthcare system.
          </p>
        </section>
        <div className="grid md:grid-cols-4 gap-4">
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
              {appointments.filter((a) => a.status === "rejected").length}
            </div>
            <div>
              <div className="label">Rejected</div>
              <div className="text-sm">appointments</div>
            </div>
          </div>
          <div className="kpi">
            <div className="value">
              {appointments.filter((a) => a.status === "completed").length}
            </div>
            <div>
              <div className="label">Completed</div>
              <div className="text-sm">this week</div>
            </div>
          </div>
        </div>
        <h3 className="text-xl font-semibold">Appointments</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {appointments.map((a) => (
            <div key={a._id} className="panel p-6 hover-lift">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-200">
                  <svg
                    className="w-5 h-5 text-amber-600"
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
                <div className="flex-1">
                  <div className="text-amber-800 font-semibold text-lg">
                    Patient: {a.patient?.name}
                  </div>
                  <div className="text-sm text-neutral-600 flex items-center gap-1">
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
              <div className="mt-3 flex gap-2">
                <span className="pill pill-amber">{a.status}</span>
                <span className="pill pill-sky">{a.paymentStatus}</span>
              </div>
              <div className="mt-3 flex gap-2">
                {a.status === "pending" && (
                  <>
                    <button
                      onClick={async () => {
                        await api.post(`/doctors/appointments/${a._id}/accept`);
                        location.reload();
                      }}
                      className="btn btn-success"
                    >
                      Accept
                    </button>
                    <button
                      onClick={async () => {
                        await api.post(`/doctors/appointments/${a._id}/reject`);
                        location.reload();
                      }}
                      className="btn btn-danger"
                    >
                      Reject
                    </button>
                  </>
                )}
                {a.status === "accepted" && a.paymentStatus === "paid" && (
                  <button
                    onClick={async () => {
                      await api.post(`/doctors/appointments/${a._id}/complete`);
                      location.reload();
                    }}
                    className="btn btn-primary"
                  >
                    Mark Completed
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
