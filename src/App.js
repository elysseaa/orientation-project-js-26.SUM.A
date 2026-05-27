import { useState } from "react";
import "./App.css";
import Experience from "./experience";
import Skill from "./skill";

function App() {
  const [page, setPage] = useState("home");
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);

  const handleSaveExperience = (exp) => {
    setExperiences([...experiences, exp]);
  };

  const handleSaveSkill = (skill) => {
    setSkills([...skills, skill]);
  };

  if (page === "experience") {
    return (
      <div className="App">
        <Experience
          onBack={() => setPage("home")}
          onSave={handleSaveExperience}
        />
      </div>
    );
  } else if (page === "skill") {
    return (
      <div className="App">
        <Skill onBack={() => setPage("home")} onSave={handleSaveSkill} />
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Resume Builder</h1>
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
        {skills.length === 0 ? (
          <p>Skill Placeholder</p>
        ) : (
          skills.map((skill) => (
            <div key={skill.id} className="entry">
              {skill.logo && (
                <img
                  src={skill.logo}
                  alt={`${skill.name} logo`}
                  style={{
                    maxWidth: "50px",
                    float: "left",
                    marginRight: "10px",
                  }}
                />
              )}
              <strong>{skill.name}</strong>
              <br />
              {skill.proficiency}
            </div>
          ))
        )}
        <button onClick={() => setPage("skill")}>Add Skill</button>
        <br></br>
      </div>
      <br></br>
      <button>Export</button>
    </div>
  );
}

export default App;
