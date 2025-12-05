import React from 'react';

export default function Skills({ data }) {
  return (
    <section className="section" id="competences">
      <div className="section-header reveal">
        <p className="eyebrow">Compétences clés</p>
        <h2>Compétences du BUT Informatique</h2>
        <p>
          Six compétences structurantes, déclinées du BUT1 au BUT3, illustrées par des projets concrets. Les descriptions sont
          rédigées pour un contexte professionnel et peuvent être adaptées.
        </p>
      </div>
      <div className="grid">
        {data.map((skill) => (
          <div key={skill.code} className="card reveal">
            <div className="card-header">
              <span className="badge">{skill.code}</span>
              <h3>{skill.titre}</h3>
            </div>
            <p>{skill.description}</p>
            <div className="evolution">
              <h4>Évolution de la compétence</h4>
              <ul>
                <li>
                  <strong>BUT1 :</strong> {skill.evolution.but1}
                </li>
                <li>
                  <strong>BUT2 :</strong> {skill.evolution.but2}
                </li>
                <li>
                  <strong>BUT3 :</strong> {skill.evolution.but3}
                </li>
              </ul>
            </div>
            <div className="links">
              <h4>Projets associés</h4>
              <div className="link-chips">
                {skill.projetsAssocies.map((projet) => (
                  <a key={projet.ancre} href={projet.ancre} className="chip">
                    {projet.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
