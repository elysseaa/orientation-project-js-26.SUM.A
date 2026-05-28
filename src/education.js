import { useState } from "react";
import "./App.css";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

function Education({ onBack, onSave }) {
  const [form, setForm] = useState({
    course: "",
    school: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    isPresent: false,
    grade: "",
    logo: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.course.trim()) errs.course = "Course is required.";
    if (!form.school.trim()) errs.school = "School is required.";
    if (!form.startMonth || !form.startYear)
      errs.startDate = "Start date is required.";
    if (!form.isPresent && (!form.endMonth || !form.endYear))
      errs.endDate = "End date is required.";

    if (!errs.startDate && !errs.endDate && !form.isPresent) {
      const sIndex = months.indexOf(form.startMonth);
      const eIndex = months.indexOf(form.endMonth);
      const sYear = parseInt(form.startYear, 10);
      const eYear = parseInt(form.endYear, 10);
      if (eYear < sYear || (eYear === sYear && eIndex < sIndex))
        errs.endDate = "End date cannot be before start date.";
    }

    if (!form.grade.trim()) {
      errs.grade = "Grade is required.";
    } else {
      const numeric = parseFloat(form.grade.replace("%", ""));
      if (isNaN(numeric) || numeric < 0 || numeric > 100)
        errs.grade = "Grade must be a number between 0 and 100.";
    }

    if (!form.logo.trim()) errs.logo = "Logo is required.";
    return errs;
  };

  const handleChange = (field) => (e) => {
    const value = field === "isPresent" ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const startDate = `${form.startMonth} ${form.startYear}`;
    const endDate = form.isPresent
      ? "Present"
      : `${form.endMonth} ${form.endYear}`;

    try {
      const response = await fetch("/resume/education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course: form.course.trim(),
          school: form.school.trim(),
          start_date: startDate,
          end_date: endDate,
          grade: form.grade.trim(),
          logo: form.logo.trim(),
        }),
      });

      if (!response.ok) throw new Error("Failed to save education");

      const data = await response.json();
      onSave({
        id: data.id,
        course: form.course.trim(),
        school: form.school.trim(),
        start_date: startDate,
        end_date: endDate,
        grade: form.grade.trim(),
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
      <h2>Add Education</h2>
      <form onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <div className="errorMsg" style={{ marginBottom: "15px" }}>
            {errors.form}
          </div>
        )}
        <label>
          Course:
          <input
            type="text"
            value={form.course}
            onChange={handleChange("course")}
            className={errors.course ? "inputError" : ""}
          />
          {errors.course && <span className="errorMsg">{errors.course}</span>}
        </label>
        <label>
          School:
          <input
            type="text"
            value={form.school}
            onChange={handleChange("school")}
            className={errors.school ? "inputError" : ""}
          />
          {errors.school && <span className="errorMsg">{errors.school}</span>}
        </label>
        <label>
          Start Date:
          <div style={{ display: "flex", gap: "10px" }}>
            <select
              value={form.startMonth}
              onChange={handleChange("startMonth")}
              className={errors.startDate ? "inputError" : ""}
            >
              <option value="">Month</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={form.startYear}
              onChange={handleChange("startYear")}
              className={errors.startDate ? "inputError" : ""}
            >
              <option value="">Year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          {errors.startDate && (
            <span className="errorMsg">{errors.startDate}</span>
          )}
        </label>
        <label>
          End Date:
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <select
              value={form.endMonth}
              onChange={handleChange("endMonth")}
              disabled={form.isPresent}
              className={errors.endDate && !form.isPresent ? "inputError" : ""}
            >
              <option value="">Month</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={form.endYear}
              onChange={handleChange("endYear")}
              disabled={form.isPresent}
              className={errors.endDate && !form.isPresent ? "inputError" : ""}
            >
              <option value="">Year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                margin: 0,
                fontWeight: "normal",
              }}
            >
              <input
                type="checkbox"
                checked={form.isPresent}
                onChange={handleChange("isPresent")}
                style={{ width: "auto", marginRight: "5px" }}
              />
              Present
            </label>
          </div>
          {errors.endDate && !form.isPresent && (
            <span className="errorMsg">{errors.endDate}</span>
          )}
        </label>
        <label>
          Grade:
          <input
            type="text"
            value={form.grade}
            onChange={handleChange("grade")}
            placeholder="e.g. 86%"
            className={errors.grade ? "inputError" : ""}
          />
          {errors.grade && <span className="errorMsg">{errors.grade}</span>}
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

export default Education;
