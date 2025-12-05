import React from 'react';

const cvVersions = [
  {
    titre: 'CV pour l’alternance',
    description: 'Version orientée rythme école/entreprise, mettant en avant adaptabilité et montée en compétence rapide.',
  },
  {
    titre: 'CV pour un premier emploi',
    description: 'Focalisé sur les responsabilités et résultats opérationnels obtenus pendant les projets et stages.',
  },
  {
    titre: 'CV en anglais',
    description: 'Version internationale soulignant la capacité à collaborer dans des contextes multiculturels.',
  },
];

export default function CVSection() {
  return (
    <section className="section" id="cv">
      <div className="section-header reveal">
        <p className="eyebrow">CV et profils</p>
        <h2>Documents et liens utiles</h2>
        <p>Mise à disposition de CV adaptés aux contextes visés ainsi que des profils publics pour évaluer les projets.</p>
      </div>
      <div className="grid">
        {cvVersions.map((cv) => (
          <div key={cv.titre} className="card reveal">
            <div className="card-header">
              <h3>{cv.titre}</h3>
            </div>
            <p>{cv.description}</p>
            <a href="#" className="btn ghost">
              Télécharger le {cv.titre}
            </a>
          </div>
        ))}
        <div className="card reveal">
          <div className="card-header">
            <h3>Profil GitHub</h3>
          </div>
          <p>Consultation des projets publics, mini-prototypes et scripts d’expérimentation.</p>
          <a href="https://github.com/" className="btn primary" target="_blank" rel="noreferrer">
            <i className="fab fa-github" aria-hidden="true"></i> Voir le profil GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
