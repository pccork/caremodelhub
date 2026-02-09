import React, { useState } from "react";
import api from "../api/api";

const SPECIMEN_REGEX = /^BC\d{6}$/; // Specimen number must be starting with BC followed by 6 digits


export default function NewCalculation() {
  const [form, setForm] = useState({
    mrn: "",
    specimenNo: "",
    inputs: { age: 60, sex: "male", egfr: 35, acr: 120 },
  });

  const [result, setResult] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [specimenErr, setSpecimenErr] = useState<string | null>(null); // Add a specimen error state

  const submit = async () => {
    setErr(null); setOk(null);
    //Specimen number format check
    if (!SPECIMEN_REGEX.test(form.specimenNo)) {
      setErr("Specimen No must be BC followed by 6 digits (e.g. BC000123)");
      return;
    }

    try {
      const r = await api.post("/api/results", form);
      setResult(r.data);
      setOk("Calculation saved.");

      //RESET FORM AFTER SUCCESS
      setForm({
        mrn: "",
        specimenNo: "",
        inputs: { age: 60, sex: "male", egfr: 35, acr: 120 },
      });
      setSpecimenErr(null);
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
          <input className="input" value={form.mrn} onChange={set("mrn")} placeholder="Patient MRN" />
        </div>
        <div className="column">
          <label className="label">Specimen No</label>
          <input //Auto-uppercases, enforces BC###### and with backend final control
            className={`input ${specimenErr ? "is-danger" : ""}`}
            value={form.specimenNo}
            placeholder="BC000001"
            maxLength={8}
            pattern="^BC\d{6}$"
            title="Specimen number must be BC followed by 6 digits (e.g. BC000123)"
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              setForm((f) => ({ ...f, specimenNo: value }));

              if (!SPECIMEN_REGEX.test(value)) {
                setSpecimenErr("Specimen No must be BC followed by 6 digits");
              } else {
                setSpecimenErr(null);
              }
            }}
          />
          {specimenErr && (
            <p className="help is-danger">{specimenErr}</p> // Bulma error styling  
          )}
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
          <label className="label">eGFR mL/min/1.73m²</label>
          <input className="input" type="number" value={form.inputs.egfr} onChange={set("inputs.egfr")} />
        </div>

        <div className="column">
          <label className="label">ACR mg/mmol</label>
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
