import React, { useState } from "react";
import api from "../api/api";

export default function NewCalculation() {
  const [form, setForm] = useState({
    mrn: "",
    specimenNo: "",
    inputs: { age: 60, sex: "male", egfr: 35, acr: 120 },
  });

  const [result, setResult] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const submit = async () => {
    setErr(null); setOk(null);
    try {
      const r = await api.post("/api/results", form);
      setResult(r.data);
      setOk("Calculation saved.");
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.response?.data?.error || "Calculation failed");
    }
  };

  const set = (path: string) => (e: any) => {
    if (path.startsWith("inputs.")) {
      const k = path.replace("inputs.", "");
      setForm((f) => ({ ...f, inputs: { ...f.inputs, [k]: e.target.value } }));
    } else {
      setForm((f) => ({ ...f, [path]: e.target.value }));
    }
  };

  return (
    <div className="section" style={{ maxWidth: 760, margin: "0 auto" }}>
      <h1 className="title">New KFRE Calculation</h1>
      {err && <div className="notification is-danger">{err}</div>}
      {ok && <div className="notification is-success">{ok}</div>}

      <div className="columns">
        <div className="column">
          <label className="label">MRN</label>
          <input className="input" value={form.mrn} onChange={set("mrn")} />
        </div>
        <div className="column">
          <label className="label">Specimen No</label>
          <input className="input" value={form.specimenNo} onChange={set("specimenNo")} />
        </div>
      </div>

      <div className="columns">
        <div className="column">
          <label className="label">Age</label>
          <input className="input" type="number" value={form.inputs.age} onChange={set("inputs.age")} />
        </div>

        <div className="column">
          <label className="label">Sex</label>
          <div className="select is-fullwidth">
            <select value={form.inputs.sex} onChange={set("inputs.sex")}>
              <option value="male">male</option>
              <option value="female">female</option>
            </select>
          </div>
        </div>

        <div className="column">
          <label className="label">eGFR</label>
          <input className="input" type="number" value={form.inputs.egfr} onChange={set("inputs.egfr")} />
        </div>

        <div className="column">
          <label className="label">ACR</label>
          <input className="input" type="number" value={form.inputs.acr} onChange={set("inputs.acr")} />
        </div>
      </div>

      <button className="button is-primary" onClick={submit}>
        Calculate & Save
      </button>

      {result && (
        <div className="box mt-5">
          <h2 className="title is-5">Saved Result</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
