import { useState } from "react";
import "./App.css";

const proficiencyOptions = ["0-1 years", "1-2 years", "2-4 years", "4+ years"];

function Skill({ onBack, onSave }) {
  const [form, setForm] = useState({ name: "", proficiency: "", logo: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.proficiency) errs.proficiency = "Proficiency is required.";
    if (!form.logo.trim()) errs.logo = "Logo is required.";
    return errs;
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      const response = await fetch("/resume/skill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          proficiency: form.proficiency,
          logo: form.logo.trim(),
        }),
      });

      if (!response.ok) throw new Error("Failed to save skill");

      const data = await response.json();
      onSave({
        id: data.id,
        name: form.name.trim(),
        proficiency: form.proficiency,
        logo: form.logo.trim(),
      });
      onBack();
    } catch (error) {
      console.error(error);
      setErrors({ form: "An error occurred while saving. Please try again." });
    }
  };

  return (
    <div className="formPage">
      <h2>Add Skill</h2>
      <form onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <div className="errorMsg" style={{ marginBottom: "15px" }}>
            {errors.form}
          </div>
        )}
        <label>
          Name:
          <input
            type="text"
            value={form.name}
            onChange={handleChange("name")}
            className={errors.name ? "inputError" : ""}
          />
          {errors.name && <span className="errorMsg">{errors.name}</span>}
        </label>
        <label>
          Proficiency:
          <select
            value={form.proficiency}
            onChange={handleChange("proficiency")}
            className={errors.proficiency ? "inputError" : ""}
          >
            <option value="">Select proficiency</option>
            {proficiencyOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.proficiency && (
            <span className="errorMsg">{errors.proficiency}</span>
          )}
        </label>
        <label>
          Logo:
          <input
            type="text"
            value={form.logo}
            onChange={handleChange("logo")}
            className={errors.logo ? "inputError" : ""}
          />
          {errors.logo && <span className="errorMsg">{errors.logo}</span>}
        </label>
        <div className="formButtons">
          <button type="submit">Save</button>
          <button type="button" onClick={onBack}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default Skill;
