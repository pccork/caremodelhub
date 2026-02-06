import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Models() {
  const navigate = useNavigate();
  const { role } = useAuth();
  // only role=user can calculate
  const canCalculate = role === "user";

  return (
    <div className="section">
      <h1 className="title">Select Risk Model</h1>
      <p className="subtitle is-6">
        Choose a clinical risk model available to your role
      </p>

      <div className="columns">
        <div className="column is-one-quarter">
          <div className="box has-text-centered">
            {/* KFRE badge */}
            <span
                className="tag is-medium"
                style={{
                    background: "var(--cmh-primary,#005eb8)",
                    color: "#fff",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    padding: "0.9rem 1.1rem",
                    borderRadius: 10,
                }}
            >
                KFRE
            </span>
            <h2 className="subtitle mt-2">KFRE</h2>
            <p>Kidney Failure Risk Equation</p>
            {canCalculate ? (
              <button
                className="button is-link is-fullwidth"
                onClick={() => navigate("/new")}
              >
                Open model
              </button>
            ) : (
              <>
                <button
                  className="button is-light is-fullwidth"
                  disabled
                  title="Calculation restricted to clinical users"
                >
                  Calculation restricted
                </button>
                <p className="is-size-7 has-text-grey mt-2">
                  This role may review and audit results but cannot perform
                  patient calculations.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
