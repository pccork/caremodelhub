import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../auth/AuthContext";
import { exportCSV } from "../utils/export";

type UserRow = {
  _id: string;
  email: string;
  role: "user" | "scientist" | "admin";
  createdAt: string;
};

const AdminDashboard = () => {
  const { role } = useAuth();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Create-user form state
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "user" as "user" | "scientist" | "admin",
  });

  /* ===============================
     Load users (admin-only API)
     =============================== */
  useEffect(() => {
    api
      .get("/api/users")
      .then((res) => setUsers(res.data))
      .catch((e) =>
        setErr(e?.response?.data?.message || "Failed to load users")
      )
      .finally(() => setLoading(false));
  }, []);

  /* ==============================================================
     An async action triggered when Create user is clicked by admin
     ============================================================ */
  const createUser = async () => {
    setErr(null); //clears previous error message 
    try {
      const res = await api.post("/api/users", newUser); //API callto backend api/users
      setUsers((u) => [res.data, ...u]);
      setNewUser({ email: "", password: "", role: "user" }); //if successful a new user is created
    } catch (e: any) {  // catches any backend error 
      setErr(e?.response?.data?.message || "Create user failed");
    }
  };

  /* ===============================
     Delete user
     =============================== */
  const deleteUser = async (id: string) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;

    try {
      await api.delete(`/api/users/${id}`);
      setUsers((u) => u.filter((x) => x._id !== id));
    } catch (e: any) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <div className="section">Loading…</div>;

  return (
    <div className="section">
      <div className="level">
        <div className="level-left">
          <h1 className="title">Admin Dashboard</h1>
        </div>

        <div className="level-right">
          <button
            className="button is-small is-link"
            onClick={() => exportCSV("users.csv", users)}
          >
            Export Users
          </button>
        </div>
      </div>

      {err && <div className="notification is-danger">{err}</div>}

      {/* ===============================
          Create User Form
         =============================== */}
      <div className="box">
        <h2 className="subtitle">Create User</h2>

        <div className="columns">
          <div className="column">
            <input
              className="input"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser((u) => ({ ...u, email: e.target.value }))
              }
            />
          </div>

          <div className="column">
            <input
              className="input"
              type="password"
              placeholder="Temporary password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser((u) => ({ ...u, password: e.target.value }))
              }
            />
          </div>

          <div className="column">
            <div className="select is-fullwidth">
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser((u) => ({
                    ...u,
                    role: e.target.value as any,
                  }))
                }
              >
                <option value="user">User</option>
                <option value="scientist">Scientist</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="column is-narrow">
            <button className="button is-primary" onClick={createUser}>
              Create
            </button>
          </div>
        </div>
      </div>

      {/* ===============================
          User List
         =============================== */}
      <table className="table is-fullwidth is-striped is-hoverable">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Created</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{new Date(u.createdAt).toLocaleString()}</td>
              <td>
                {u.role !== "admin" && (
                  <button
                    className="button is-small is-danger is-light"
                    onClick={() => deleteUser(u._id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;