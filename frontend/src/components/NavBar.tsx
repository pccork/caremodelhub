import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function NavBar() {
  const nav = useNavigate();
  const { token, role, logout } = useAuth();

  const doLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <nav className="navbar is-light">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item has-text-weight-semibold">
          CareModel Hub
        </Link>
      </div>

      <div className="navbar-menu is-active">
        <div className="navbar-start">
          {token && <Link to="/dashboard" className="navbar-item">Dashboard</Link>}
          {role === "user" && <Link to="/new" className="navbar-item">New KFRE</Link>}
          {role === "admin" && <Link to="/admin" className="navbar-item">Admin</Link>}
          {(role === "admin" || role === "scientist") && <Link to="/audit" className="navbar-item">Audit</Link>}
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            {token ? (
              <>
                <span className="mr-2">Role: <strong style={{ color: "#000" }}>{role}</strong></span>
                <button className="button" onClick={doLogout}>Log out</button>
              </>
            ) : (
              <Link className="button is-primary" to="/login">Log in</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
