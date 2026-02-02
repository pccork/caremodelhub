// frontend/src/pages/AuditLog.tsx
import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function AuditLog() {
  const [rows, setRows] = useState<any[]>([]);
  const [mrn, setMrn] = useState("");

  const load = async () => {
    const r = await api.get("/api/audit", {
      params: mrn ? { mrn } : {},
    });
    setRows(r.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="section">
      <h1 className="title">Audit Log</h1>

      <div className="field has-addons mb-4">
        <div className="control">
          <input
            className="input"
            placeholder="Search by MRN"
            value={mrn}
            onChange={(e) => setMrn(e.target.value)}
          />
        </div>
        <div className="control">
          <button className="button is-info" onClick={load}>
            Search
          </button>
        </div>
      </div>

      <table className="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Time</th>
            <th>User</th>
            <th>Action</th>
            <th>MRN</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r._id}>
              <td>{new Date(r.createdAt).toLocaleString()}</td>
              <td>{r.actorRole}</td>
              <td>{r.action}</td>
              <td>{r.mrn || "-"}</td>
              <td>{r.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}