import { useState } from "react";
import "./App.css";
import Experience from "./experience";
import Education from "./education";
import Skill from "./skill";
import PersonalInfo from "./personalInfo";

function App() {
  const [page, setPage] = useState("home");
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [skills, setSkills] = useState([]);

  const handleSaveExperience = (exp) => {
    setExperiences([...experiences, exp]);
  };

  const handleSaveEducation = (edu) => {
    setEducations([...educations, edu]);
  };

  const handleSaveSkill = (skill) => {
    setSkills([...skills, skill]);
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
  } else if (page === "education") {
    return (
      <div className="App">
        <Education
          onBack={() => setPage("home")}
          onSave={handleSaveEducation}
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
        {educations.length === 0 ? (
          <p>Education Placeholder</p>
        ) : (
          educations.map((edu) => (
            <div key={edu.id} className="entry">
              {edu.logo && (
                <img
                  src={edu.logo}
                  alt={`${edu.school} logo`}
                  style={{
                    maxWidth: "50px",
                    float: "left",
                    marginRight: "10px",
                  }}
                />
              )}
              <strong>{edu.course}</strong> at {edu.school}
              <br />
              {edu.start_date} – {edu.end_date}
              {edu.grade && <p style={{ clear: "both" }}>Grade: {edu.grade}</p>}
            </div>
          ))
        )}
        <button onClick={() => setPage("education")}>Add Education</button>
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
