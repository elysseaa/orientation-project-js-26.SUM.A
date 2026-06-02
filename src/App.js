import { useState } from "react";
import "./App.css";
import Experience from "./experience";
import PersonalInfo from "./personalInfo";

function App() {
  const [page, setPage] = useState("home");
  const [experiences, setExperiences] = useState([]);

  const handleSaveExperience = (exp) => {
    setExperiences([...experiences, exp]);
  };

  if (page === "personal-info") {
    return (
      <div className="App">
        <PersonalInfo onBack={() => setPage("home")} />
      </div>
    );
  } else if (page === "experience") {
    return (
      <div className="App">
        <Experience
          onBack={() => setPage("home")}
          onSave={handleSaveExperience}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Resume Builder</h1>
      <div className="resumeSection">
        <h2>Personal Info</h2>
        <p>Personal Info Placeholder</p>
        <button onClick={() => setPage("personal-info")}>
          Add Personal Info
        </button>
        <br></br>
      </div>
      <div className="resumeSection">
        <h2>Experience</h2>
        {experiences.length === 0 ? (
          <p>Experience Placeholder</p>
        ) : (
          experiences.map((exp) => (
            <div key={exp.id} className="entry">
              {exp.logo && (
                <img
                  src={exp.logo}
                  alt={`${exp.company} logo`}
                  style={{
                    maxWidth: "50px",
                    float: "left",
                    marginRight: "10px",
                  }}
                />
              )}
              <strong>{exp.title}</strong> at {exp.company}
              <br />
              {exp.start_date} – {exp.end_date}
              {exp.description && (
                <p style={{ clear: "both" }}>{exp.description}</p>
              )}
            </div>
          ))
        )}
        <button onClick={() => setPage("experience")}>Add Experience</button>
        <br></br>
      </div>
      <div className="resumeSection">
        <h2>Education</h2>
        <p>Education Placeholder</p>
        <button>Add Education</button>
        <br></br>
      </div>
      <div className="resumeSection">
        <h2>Skills</h2>
        <p>Skill Placeholder</p>
        <button>Add Skill</button>
        <br></br>
      </div>
      <br></br>
      <button>Export</button>
    </div>
  );
}

export default App;
