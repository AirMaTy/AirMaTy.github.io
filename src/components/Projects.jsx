import React from 'react';

export default function Projects({ data }) {
  return (
    <section className="section" id="projets">
      <div className="section-header reveal">
        <p className="eyebrow">Projets</p>
        <h2>Réalisations principales</h2>
        <p>
          Sélection de projets académiques, professionnels ou personnels illustrant l’application des compétences C1 à C6. Chaque
          carte met en avant le besoin, la solution et le résultat.
        </p>
      </div>
      <div className="grid">
        {data.map((project) => (
          <article key={project.id} id={project.id} className="card reveal">
            <div className="card-header">
              <div>
                <p className="eyebrow">{project.type} · {project.annee}</p>
                <h3>{project.titre}</h3>
              </div>
              <div className="badge-set">
                {project.competences.map((comp) => (
                  <span key={comp} className="badge neutral">
                    {comp}
                  </span>
                ))}
              </div>
            </div>
            <p className="muted">{project.contexte}</p>
            <div className="project-detail">
              <h4>Besoin</h4>
              <p>{project.besoin}</p>
            </div>
            <div className="project-detail">
              <h4>Solution</h4>
              <p>{project.solution}</p>
            </div>
            <div className="project-detail">
              <h4>Résultat</h4>
              <p>{project.resultat}</p>
            </div>
            <div className="tags">
              {project.technologies.map((tech) => (
                <span key={tech} className="chip">
                  {tech}
                </span>
              ))}
            </div>
            <div className="links">
              <a href="#competences" className="text-link">
                Voir les compétences détaillées
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
