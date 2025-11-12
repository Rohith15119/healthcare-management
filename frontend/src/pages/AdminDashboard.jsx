import { useEffect, useState } from "react";
import api from "../lib/api.js";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    age: "",
    phone: "",
    specialization: "",
    experienceYears: 0,
  });

  useEffect(() => {
    (async () => {
      const [{ data: u }, { data: r }] = await Promise.all([
        api.get("/users"),
        api.get("/roles"),
      ]);
      setUsers(u);
      setRoles(r);
    })();
  }, []);

  const createRole = async () => {
    if (!newRole) return;
    await api.post("/roles", { name: newRole });
    const { data } = await api.get("/roles");
    setRoles(data);
    setNewRole("");
  };

  const cleanup = async () => {
    await api.post("/users/cleanup-duplicates");
    const { data } = await api.get("/users");
    setUsers(data);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const userData = { ...formData };
      if (formData.role === "doctor") {
        userData.specialization = formData.specialization;
        userData.experienceYears = formData.experienceYears;
      } else if (formData.role === "patient") {
        userData.age = formData.age;
        userData.phone = formData.phone;
      }

      await api.post("/auth/register", userData);
      const { data } = await api.get("/users");
      setUsers(data);
      setShowAddForm(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "patient",
        age: "",
        phone: "",
        specialization: "",
        experienceYears: 0,
      });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const updateData = { ...formData };
      delete updateData.password; // Don't update password unless provided
      if (!updateData.password) delete updateData.password;

      await api.put(`/users/${editingUser._id}`, updateData);
      const { data } = await api.get("/users");
      setUsers(data);
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "patient",
        age: "",
        phone: "",
        specialization: "",
        experienceYears: 0,
      });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${userId}`);
        const { data } = await api.get("/users");
        setUsers(data);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "patient",
      age: user.age || "",
      phone: user.phone || "",
      specialization: user.specialization || "",
      experienceYears: user.experienceYears || 0,
    });
  };

  const patients = users.filter((u) => u.role === "patient");
  const doctors = users.filter((u) => u.role === "doctor");
  const admins = users.filter((u) => u.role === "admin");

  return (
    <div className="page-soft">
      <div className="container-app space-y-6">
        <section className="hero">
          <div className="text-sm opacity-90">Administrative Portal</div>
          <div className="text-2xl font-bold mt-1">
            Healthcare Management System
          </div>
          <p className="mt-2 text-white/80">
            Comprehensive management of patients, doctors, and system
            administration.
          </p>
        </section>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="kpi">
            <div className="value">{users.length}</div>
            <div>
              <div className="label">Total Users</div>
              <div className="text-sm">registered</div>
            </div>
          </div>
          <div className="kpi">
            <div className="value">{patients.length}</div>
            <div>
              <div className="label">Patients</div>
              <div className="text-sm">active</div>
            </div>
          </div>
          <div className="kpi">
            <div className="value">{doctors.length}</div>
            <div>
              <div className="label">Doctors</div>
              <div className="text-sm">available</div>
            </div>
          </div>
          <div className="kpi">
            <div className="value">{admins.length}</div>
            <div>
              <div className="label">Admins</div>
              <div className="text-sm">with access</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/20 backdrop-blur-sm rounded-2xl p-1">
          {[
            { id: "overview", label: "Overview", icon: "📊" },
            { id: "patients", label: "Patients", icon: "👥" },
            { id: "doctors", label: "Doctors", icon: "👨‍⚕️" },
            { id: "roles", label: "Roles", icon: "🔐" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-lg"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="panel p-6">
              <h3 className="text-lg font-semibold mb-4">System Health</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Database Status</span>
                  <span className="pill pill-emerald">Healthy</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Sessions</span>
                  <span className="pill pill-sky">{users.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">System Uptime</span>
                  <span className="pill pill-amber">99.9%</span>
                </div>
              </div>
            </div>
            <div className="panel p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("patients")}
                  className="w-full btn btn-ghost justify-start"
                >
                  👥 Manage Patients
                </button>
                <button
                  onClick={() => setActiveTab("doctors")}
                  className="w-full btn btn-ghost justify-start"
                >
                  👨‍⚕️ Manage Doctors
                </button>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full btn btn-primary"
                >
                  ➕ Add New User
                </button>
                <button onClick={cleanup} className="w-full btn btn-warning">
                  🧹 Cleanup Duplicates
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === "patients" && (
          <div className="panel p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Patient Management</h3>
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setFormData({ ...formData, role: "patient" });
                }}
                className="btn btn-primary"
              >
                ➕ Add Patient
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Age</th>
                    <th className="text-left py-3 px-4 font-semibold">Phone</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr
                      key={patient._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">{patient.name}</td>
                      <td className="py-3 px-4">{patient.email}</td>
                      <td className="py-3 px-4">{patient.age || "N/A"}</td>
                      <td className="py-3 px-4">{patient.phone || "N/A"}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(patient)}
                            className="btn btn-ghost text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(patient._id)}
                            className="btn btn-warning text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === "doctors" && (
          <div className="panel p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Doctor Management</h3>
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setFormData({ ...formData, role: "doctor" });
                }}
                className="btn btn-primary"
              >
                ➕ Add Doctor
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Specialization
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Experience
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Rating
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr
                      key={doctor._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">{doctor.name}</td>
                      <td className="py-3 px-4">{doctor.email}</td>
                      <td className="py-3 px-4">
                        {doctor.specialization || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {doctor.experienceYears || 0} years
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <span>⭐</span>
                          <span>{doctor.rating || 0}</span>
                          <span className="text-gray-500">
                            ({doctor.ratingCount || 0})
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(doctor)}
                            className="btn btn-ghost text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(doctor._id)}
                            className="btn btn-warning text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Roles Tab */}
        {activeTab === "roles" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="panel p-6">
              <h3 className="text-lg font-semibold mb-4">Create New Role</h3>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="label">Role Name</label>
                  <input
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="input"
                    placeholder="e.g. nurse, receptionist"
                  />
                </div>
                <button onClick={createRole} className="btn btn-primary">
                  Add Role
                </button>
              </div>
            </div>
            <div className="panel p-6">
              <h3 className="text-lg font-semibold mb-4">Available Roles</h3>
              <div className="space-y-2">
                {roles.map((role) => (
                  <div
                    key={role._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium">{role.name}</span>
                    <span className="pill pill-neutral">Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit User Modal */}
        {(showAddForm || editingUser) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-6">
                {editingUser ? "Edit User" : "Add New User"}
              </h3>
              <form
                onSubmit={editingUser ? handleEditUser : handleAddUser}
                className="space-y-4"
              >
                <div>
                  <label className="label">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="label">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="input"
                    required={!editingUser}
                  />
                </div>
                <div>
                  <label className="label">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="select"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {formData.role === "patient" && (
                  <>
                    <div>
                      <label className="label">Age</label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="input"
                      />
                    </div>
                  </>
                )}

                {formData.role === "doctor" && (
                  <>
                    <div>
                      <label className="label">Specialization</label>
                      <input
                        type="text"
                        value={formData.specialization}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specialization: e.target.value,
                          })
                        }
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Experience (Years)</label>
                      <input
                        type="number"
                        value={formData.experienceYears}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experienceYears: e.target.value,
                          })
                        }
                        className="input"
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingUser ? "Update User" : "Add User"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingUser(null);
                    }}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
