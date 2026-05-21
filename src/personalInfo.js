import { useState, useEffect, useRef } from "react";
import "./App.css";

function PersonalInfo({ onBack }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState({});
  // designates if an existing record is being updated
  const isUpdate = useRef(false);

  // fetch personal info data on mount
  useEffect(() => {
    fetch("/resume/personal-info")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          // set form data to existing data
          setForm({ name: data.name, phone: data.phone, email: data.email });
          isUpdate.current = true;
        }
      })
      .catch(() => {});
  }, []);

  // validates all three input fields for correct format
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (!/^\+\d{7,15}$/.test(form.phone.trim())) {
      errs.phone =
        "Phone must include an international country code (e.g. +12025551234).";
    }
    if (!form.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = "Enter a valid email address.";
    }
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
      const response = await fetch("/resume/personal-info", {
        // checks if personal info data already exists
        method: isUpdate.current ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
        }),
      });

      if (!response.ok) throw new Error("Failed to save personal info");
      onBack();
    } catch (error) {
      console.error(error);
      setErrors({ form: "An error occurred while saving. Please try again." });
    }
  };

  return (
    <div className="formPage">
      <h2>{isUpdate.current ? "Edit" : "Add"} Personal Info</h2>
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
          Phone:
          <input
            type="tel"
            value={form.phone}
            onChange={handleChange("phone")}
            placeholder="+11234567890"
            className={errors.phone ? "inputError" : ""}
          />
          {errors.phone && <span className="errorMsg">{errors.phone}</span>}
        </label>
        <label>
          Email:
          <input
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            className={errors.email ? "inputError" : ""}
          />
          {errors.email && <span className="errorMsg">{errors.email}</span>}
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

export default PersonalInfo;
