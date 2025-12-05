import React from 'react';

export default function OtherSkillsPage({ data, onBack }) {
  return (
    <main className="section standalone">
      <div className="section-header reveal">
        <p className="eyebrow">Compétences complémentaires</p>
        <h2>Autres compétences hors référentiel PN</h2>
        <p>
          Compétences supplémentaires valorisant la curiosité et l’autonomie : homelab, automatisation, veille et communication.
          Cette page peut être personnalisée pour refléter des expertises spécifiques.
        </p>
        <button className="btn primary" onClick={onBack}>
          Retour à l’accueil
        </button>
      </div>
      <div className="grid">
        {data.map((skill) => (
          <div key={skill.titre} className="card reveal">
            <h3>{skill.titre}</h3>
            <p>{skill.description}</p>
            <p className="muted">{skill.exemple}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
