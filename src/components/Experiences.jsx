import React from 'react';

export default function Experiences({ data }) {
  return (
    <section className="section" id="experiences">
      <div className="section-header reveal">
        <p className="eyebrow">Expériences</p>
        <h2>Expériences professionnelles et engagements</h2>
        <p>Stages, alternance ou responsabilités associatives démontrant l’usage des compétences dans des contextes variés.</p>
      </div>
      <div className="grid">
        {data.map((exp, index) => (
          <div key={index} className="card reveal">
            <div className="card-header">
              <div>
                <p className="eyebrow">{exp.organisation}</p>
                <h3>{exp.poste}</h3>
              </div>
              <span className="badge neutral">{exp.periode}</span>
            </div>
            <ul>
              {exp.missions.map((mission, idx) => (
                <li key={idx}>{mission}</li>
              ))}
            </ul>
            <div className="badge-set">
              {exp.competences.map((comp) => (
                <span key={comp} className="badge neutral">
                  {comp}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
