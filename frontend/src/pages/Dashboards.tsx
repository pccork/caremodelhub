import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Dashboard() {
  const [rows, setRows] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [mrn, setMrn] = useState("");
  const [specimenNo, setSpecimenNo] = useState("");
  

  useEffect(() => {
    api.get("/api/results")
      .then((r) => setRows(r.data))
      .catch((e) => setErr(e?.response?.data?.message || "Failed to load results"));
  }, []);

  const search = async () => {
    setErr(null);
    try {
      const r = await api.get("/api/results", {
        params: {
          mrn: mrn || undefined,
          specimenNo: specimenNo || undefined,
        },
      });
      setRows(r.data);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Search failed");
    }
  };

  return (
    <div className="section">
      <h1 className="title">Results</h1>
      {/* Search box */}
      <div className="box">
        <div className="columns">
          <div className="column">
            <input
              className="input"
              placeholder="MRN"
              value={mrn}
              onChange={(e) => setMrn(e.target.value)}
            />
          </div>

          <div className="column">
            <input
              className="input"
              placeholder="Specimen No"
              value={specimenNo}
              onChange={(e) => setSpecimenNo(e.target.value)}
            />
          </div>

          <div className="column is-narrow">
            <button className="button is-link" onClick={search}>
              Search
            </button>
          </div>
        </div>
      </div>
      {err && <div className="notification is-danger">{err}</div>}

      <table className="table is-fullwidth is-striped is-hoverable">
        <thead>
          <tr>
            <th>MRN</th>
            <th>Specimen</th>
            <th>Risk (5y)</th>
            <th>Model</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r._id}>
              <td>{r.mrn}</td>
              <td>{r.specimenNo}</td>
              <td>{r?.outputs?.kfre?.risk_5y_percent ?? "-"}</td>
              <td>{r.modelVersion ? `${r.model} ${r.modelVersion}` : r.model}</td>
              <td>{new Date(r.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
