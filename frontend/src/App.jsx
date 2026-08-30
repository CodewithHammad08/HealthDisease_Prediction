import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    age: "54",
    sex: "M",
    chest_pain: "ATA",
    resting_bp: "120",
    cholesterol: "230",
    fasting_bs: "0",
    max_hr: "150",
    oldpeak: "1.5",
  });

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const loadPreset = (type) => {
    if (type === "low") {
      setFormData({
        age: "40",
        sex: "F",
        chest_pain: "ATA",
        resting_bp: "110",
        cholesterol: "180",
        fasting_bs: "0",
        max_hr: "172",
        oldpeak: "0.0",
      });
    } else {
      setFormData({
        age: "62",
        sex: "M",
        chest_pain: "ASY",
        resting_bp: "155",
        cholesterol: "285",
        fasting_bs: "1",
        max_hr: "108",
        oldpeak: "2.4",
      });
    }
    setResult(null);
    setError(null);
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { age, resting_bp, cholesterol, max_hr, oldpeak } = formData;
    if (!age || !resting_bp || !cholesterol || !max_hr || oldpeak === "") {
      setError("Please complete all patient clinical parameters before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://heart-disease-prediction-9a0q.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age),
          resting_bp: Number(formData.resting_bp),
          cholesterol: Number(formData.cholesterol),
          fasting_bs: Number(formData.fasting_bs),
          max_hr: Number(formData.max_hr),
          oldpeak: Number(formData.oldpeak),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status code ${response.status}`);
      }

      const data = await response.json();
      setResult(data.prediction);
    } catch (err) {
      console.error("Prediction Error:", err);
      setError("Unable to connect to prediction API. Make sure Flask is running on https://heart-disease-prediction-9a0q.onrender.com.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* App Header */}
      <header className="app-header">
        <div className="brand-badge">
          <svg className="ecg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l3-9 4 18 3-10 2 4h3" />
          </svg>
          Clinical Risk Diagnostics
        </div>
        <h1 className="app-title">Heart Disease Risk Predictor</h1>
        <p className="app-subtitle">
          Advanced Machine Learning model analyzing clinical cardiovascular markers for precision risk assessment.
        </p>
      </header>

      {/* Preset Quick Fill Bar */}
      <div className="preset-bar">
        <span className="preset-title">Quick Test Presets:</span>
        <button type="button" className="preset-btn low" onClick={() => loadPreset("low")}>
          🟢 Sample Low Risk Patient
        </button>
        <button type="button" className="preset-btn high" onClick={() => loadPreset("high")}>
          🔴 Sample Higher Risk Patient
        </button>
      </div>

      {/* Error Alert Banner */}
      {error && (
        <div className="error-banner">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
          <button className="error-close" onClick={() => setError(null)} title="Dismiss">
            ✕
          </button>
        </div>
      )}

      {/* Main Parameters Form Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span className="card-title-icon">🩺</span>
            Patient Clinical Markers
          </h2>
          <span className="card-badge">8 Metrics Active</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Age Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="age">
                Age
                <span className="label-unit">{formData.age} Years</span>
              </label>
              <div className="input-with-slider">
                <input
                  id="age"
                  type="number"
                  name="age"
                  min="18"
                  max="100"
                  className="input-field"
                  value={formData.age}
                  onChange={handleChange}
                />
                <input
                  type="range"
                  name="age"
                  min="18"
                  max="100"
                  className="range-slider"
                  value={formData.age || 50}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Gender Segmented Control */}
            <div className="form-group">
              <label className="form-label">
                Biological Gender
                <span className="label-unit">{formData.sex === "M" ? "Male" : "Female"}</span>
              </label>
              <div className="segmented-control">
                <button
                  type="button"
                  className={`segmented-pill ${formData.sex === "M" ? "active" : ""}`}
                  onClick={() => handleSelectChange("sex", "M")}
                >
                  <span>👨</span> Male
                </button>
                <button
                  type="button"
                  className={`segmented-pill ${formData.sex === "F" ? "active" : ""}`}
                  onClick={() => handleSelectChange("sex", "F")}
                >
                  <span>👩</span> Female
                </button>
              </div>
            </div>

            {/* Chest Pain Type Cards (Full Width Grid) */}
            <div className="form-group full-width">
              <label className="form-label">
                Chest Pain Classification
                <span className="label-unit">Selected: {formData.chest_pain}</span>
              </label>
              <div className="chest-pain-grid">
                {[
                  { code: "ATA", title: "Atypical Angina", desc: "Non-classical discomfort" },
                  { code: "NAP", title: "Non-Anginal", desc: "Unrelated chest pain" },
                  { code: "TA", title: "Typical Angina", desc: "Classic cardiac pressure" },
                  { code: "ASY", title: "Asymptomatic", desc: "No subjective pain" },
                ].map((cp) => (
                  <div
                    key={cp.code}
                    className={`chest-pain-card ${formData.chest_pain === cp.code ? "active" : ""}`}
                    onClick={() => handleSelectChange("chest_pain", cp.code)}
                  >
                    <div className="cp-code">{cp.code}</div>
                    <div className="cp-desc">{cp.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resting Blood Pressure */}
            <div className="form-group">
              <label className="form-label" htmlFor="resting_bp">
                Resting Blood Pressure
                <span className="label-unit">{formData.resting_bp} mm Hg</span>
              </label>
              <div className="input-with-slider">
                <input
                  id="resting_bp"
                  type="number"
                  name="resting_bp"
                  min="80"
                  max="220"
                  className="input-field"
                  value={formData.resting_bp}
                  onChange={handleChange}
                />
                <input
                  type="range"
                  name="resting_bp"
                  min="80"
                  max="220"
                  className="range-slider"
                  value={formData.resting_bp || 120}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Serum Cholesterol */}
            <div className="form-group">
              <label className="form-label" htmlFor="cholesterol">
                Serum Cholesterol
                <span className="label-unit">{formData.cholesterol} mg/dL</span>
              </label>
              <div className="input-with-slider">
                <input
                  id="cholesterol"
                  type="number"
                  name="cholesterol"
                  min="100"
                  max="600"
                  className="input-field"
                  value={formData.cholesterol}
                  onChange={handleChange}
                />
                <input
                  type="range"
                  name="cholesterol"
                  min="100"
                  max="600"
                  className="range-slider"
                  value={formData.cholesterol || 200}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Fasting Blood Sugar Segmented Control */}
            <div className="form-group">
              <label className="form-label">
                Fasting Blood Sugar
                <span className="label-unit">&gt; 120 mg/dL</span>
              </label>
              <div className="segmented-control">
                <button
                  type="button"
                  className={`segmented-pill ${formData.fasting_bs === "0" ? "active" : ""}`}
                  onClick={() => handleSelectChange("fasting_bs", "0")}
                >
                  <span>🟢</span> Normal (&le; 120)
                </button>
                <button
                  type="button"
                  className={`segmented-pill ${formData.fasting_bs === "1" ? "active" : ""}`}
                  onClick={() => handleSelectChange("fasting_bs", "1")}
                >
                  <span>🔴</span> High (&gt; 120)
                </button>
              </div>
            </div>

            {/* Max Heart Rate */}
            <div className="form-group">
              <label className="form-label" htmlFor="max_hr">
                Max Heart Rate
                <span className="label-unit">{formData.max_hr} bpm</span>
              </label>
              <div className="input-with-slider">
                <input
                  id="max_hr"
                  type="number"
                  name="max_hr"
                  min="60"
                  max="220"
                  className="input-field"
                  value={formData.max_hr}
                  onChange={handleChange}
                />
                <input
                  type="range"
                  name="max_hr"
                  min="60"
                  max="220"
                  className="range-slider"
                  value={formData.max_hr || 150}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* ST Depression (Oldpeak) */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="oldpeak">
                ST Depression (Oldpeak)
                <span className="label-unit">{formData.oldpeak} Numeric</span>
              </label>
              <div className="input-with-slider">
                <input
                  id="oldpeak"
                  type="number"
                  step="0.1"
                  name="oldpeak"
                  min="0"
                  max="6"
                  className="input-field"
                  value={formData.oldpeak}
                  onChange={handleChange}
                />
                <input
                  type="range"
                  name="oldpeak"
                  min="0"
                  max="6"
                  step="0.1"
                  className="range-slider"
                  value={formData.oldpeak || 0}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Predict Button */}
            <div className="form-actions">
              <button type="submit" className="predict-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Evaluating Neural Model...
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    Predict Risk Score
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Result Card Output */}
      {result !== null && (
        <div className={`card result-card ${result === 0 ? "low-risk" : "high-risk"}`}>
          {/* Circular Arc Dial Gauge */}
          <div className="gauge-wrapper">
            <svg className="gauge-svg" viewBox="0 0 120 120">
              <circle className="gauge-bg" cx="60" cy="60" r="54" />
              <circle className="gauge-fill" cx="60" cy="60" r="54" />
            </svg>
            <div className="gauge-center-text">
              <span className="gauge-percent">{result === 0 ? "15%" : "85%"}</span>
              <span className="gauge-sub">Risk Score</span>
            </div>
          </div>

          <div className="result-header">
            <div className="risk-badge">
              <span>{result === 0 ? "✓" : "⚠️"}</span>
              <span>{result === 0 ? "0 → LOW RISK" : "1 → HIGHER RISK"}</span>
            </div>
            <h2 className="result-title">
              {result === 0 ? "LOW RISK" : "HIGHER RISK"}
            </h2>
          </div>

          <p className="result-description">
            {result === 0
              ? "The machine learning model evaluated the patient's metrics and calculated a low probability of cardiovascular risk."
              : "The machine learning model evaluated the patient's metrics and identified elevated risk indicators. Clinical diagnostic follow-up is recommended."}
          </p>

          {/* Health Parameter Matrix Cards */}
          <div className="patient-matrix-grid">
            <div className="matrix-card">
              <div className="matrix-label">Resting BP</div>
              <div className="matrix-val">{formData.resting_bp} mmHg</div>
              <span className={`matrix-tag ${Number(formData.resting_bp) > 135 ? "warning" : "normal"}`}>
                {Number(formData.resting_bp) > 135 ? "Elevated" : "Optimal"}
              </span>
            </div>

            <div className="matrix-card">
              <div className="matrix-label">Cholesterol</div>
              <div className="matrix-val">{formData.cholesterol} mg/dL</div>
              <span className={`matrix-tag ${Number(formData.cholesterol) > 240 ? "warning" : "normal"}`}>
                {Number(formData.cholesterol) > 240 ? "High" : "Normal"}
              </span>
            </div>

            <div className="matrix-card">
              <div className="matrix-label">Max Heart Rate</div>
              <div className="matrix-val">{formData.max_hr} bpm</div>
              <span className={`matrix-tag ${Number(formData.max_hr) < 120 ? "warning" : "normal"}`}>
                {Number(formData.max_hr) < 120 ? "Low Peak" : "Good Peak"}
              </span>
            </div>

            <div className="matrix-card">
              <div className="matrix-label">ST Depression</div>
              <div className="matrix-val">{formData.oldpeak}</div>
              <span className={`matrix-tag ${Number(formData.oldpeak) > 1.5 ? "warning" : "normal"}`}>
                {Number(formData.oldpeak) > 1.5 ? "Attention" : "Normal"}
              </span>
            </div>
          </div>

          <button className="reset-btn" onClick={handleReset}>
            <span>🔄</span> Evaluate Another Patient
          </button>
        </div>
      )}

      {/* Application Footer */}
      <footer className="app-footer">
        <div className="footer-tech">
          <span>Machine Learning</span>
          <span className="footer-dot">•</span>
          <span>Scikit-Learn</span>
          <span className="footer-dot">•</span>
          <span>Flask</span>
          <span className="footer-dot">•</span>
          <span>React</span>
        </div>
      </footer>
    </div>
  );
}

export default App;