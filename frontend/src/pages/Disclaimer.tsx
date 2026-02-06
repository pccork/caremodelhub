import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Disclaimer() {
  const [checked, setChecked] = useState(false);
  const { acceptDisclaimer } = useAuth();
  const navigate = useNavigate();

  const proceed = () => {
    acceptDisclaimer();
    navigate("/models");
  };

  return (
    <div className="section" style={{ maxWidth: 800, margin: "0 auto" }}>
      <h1 className="title">CareModel Hub - Disclaimer</h1>

      <div className="box">
        <p><strong>Proof of Concept Application</strong></p>
        <p className="mt-3">
          This system is intended for research and evaluation only. It is not a
          CE-marked medical device and must not be used for patient care or
          clinical decision-making.
        </p>
        <p className="mt-3">
          All outputs are experimental and provided without clinical validation.
          Responsibility for clinical decisions remains with the qualified
          healthcare professional.
        </p>

        <label className="checkbox mt-4">
          <input
            type="checkbox"
            className="mr-2"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          I have read and agree to the disclaimer
        </label>

        <div className="mt-4">
          <button
            className="button is-primary"
            disabled={!checked}
            onClick={proceed}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
