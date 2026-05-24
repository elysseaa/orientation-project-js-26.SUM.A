import { useState } from "react";

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

function Experience({ onBack, onSave }) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [isPresent, setIsPresent] = useState(false);
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};

    if (!title.trim()) errs.title = "Title is required.";
    if (!company.trim()) errs.company = "Company is required.";
    if (!startMonth || !startYear) {
      errs.startDate = "Start date is required.";
    }
    if (!isPresent && (!endMonth || !endYear)) {
      errs.endDate = "End date is required.";
    }

    if (!errs.startDate && !errs.endDate && !isPresent) {
      const sIndex = months.indexOf(startMonth);
      const eIndex = months.indexOf(endMonth);
      const sYear = parseInt(startYear, 10);
      const eYear = parseInt(endYear, 10);

      if (eYear < sYear || (eYear === sYear && eIndex < sIndex)) {
        errs.endDate = "End date cannot be before start date.";
      }
    }

    if (!description.trim()) errs.description = "Description is required.";
    if (!logo.trim()) {
      errs.logo = "Logo is required.";
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const startDate = `${startMonth} ${startYear}`;
    const endDate = isPresent ? "Present" : `${endMonth} ${endYear}`;

    try {
      const response = await fetch("/resume/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          company: company.trim(),
          start_date: startDate,
          end_date: endDate,
          description: description.trim(),
          logo: logo.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save experience");
      }

      const data = await response.json();
      onSave({
        id: data.id,
        title: title.trim(),
        company: company.trim(),
        start_date: startDate,
        end_date: endDate,
        description: description.trim(),
        logo: logo.trim(),
      });
      onBack();
    } catch (error) {
      console.error(error);
      setErrors({ form: "An error occurred while saving. Please try again." });
    }
  };

  const clearError = (field) => {
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  return (
    <div className="formPage">
      <h2>Add Experience</h2>
      <form onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <div className="errorMsg" style={{ marginBottom: "15px" }}>
            {errors.form}
          </div>
        )}
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              clearError("title");
            }}
            className={errors.title ? "inputError" : ""}
          />
          {errors.title && <span className="errorMsg">{errors.title}</span>}
        </label>
        <label>
          Company:
          <input
            type="text"
            value={company}
            onChange={(e) => {
              setCompany(e.target.value);
              clearError("company");
            }}
            className={errors.company ? "inputError" : ""}
          />
          {errors.company && <span className="errorMsg">{errors.company}</span>}
        </label>
        <label>
          Start Date:
          <div style={{ display: "flex", gap: "10px" }}>
            <select
              value={startMonth}
              onChange={(e) => {
                setStartMonth(e.target.value);
                clearError("startDate");
              }}
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
              value={startYear}
              onChange={(e) => {
                setStartYear(e.target.value);
                clearError("startDate");
              }}
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
              value={endMonth}
              onChange={(e) => {
                setEndMonth(e.target.value);
                clearError("endDate");
              }}
              disabled={isPresent}
              className={errors.endDate && !isPresent ? "inputError" : ""}
            >
              <option value="">Month</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={endYear}
              onChange={(e) => {
                setEndYear(e.target.value);
                clearError("endDate");
              }}
              disabled={isPresent}
              className={errors.endDate && !isPresent ? "inputError" : ""}
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
                checked={isPresent}
                onChange={(e) => {
                  setIsPresent(e.target.checked);
                  clearError("endDate");
                }}
                style={{ width: "auto", marginRight: "5px" }}
              />
              Present
            </label>
          </div>
          {errors.endDate && !isPresent && (
            <span className="errorMsg">{errors.endDate}</span>
          )}
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              clearError("description");
            }}
            rows="4"
            className={errors.description ? "inputError" : ""}
          />
          {errors.description && (
            <span className="errorMsg">{errors.description}</span>
          )}
        </label>
        <label>
          Logo:
          <input
            type="text"
            value={logo}
            onChange={(e) => {
              setLogo(e.target.value);
              clearError("logo");
            }}
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

export default Experience;
