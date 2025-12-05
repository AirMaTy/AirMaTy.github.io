import React from 'react';

export default function Hero({ onSeeProjects }) {
  return (
    <section className="section hero" id="accueil">
      <div className="hero-content reveal">
        <p className="eyebrow">Profil global IT</p>
        <h1>Étudiant en BUT Informatique – Profil polyvalent</h1>
        <p className="subtitle">
          Développement, systèmes et réseaux, data et gestion de projet : un parcours complet pour intervenir sur l’ensemble du
          cycle de vie d’un service numérique.
        </p>
        <div className="hero-actions">
          <button className="btn primary" onClick={onSeeProjects}>
            Voir mes projets
          </button>
          <a className="btn ghost" href="#" download>
            Télécharger mon CV
          </a>
        </div>
      </div>
      <div className="hero-portrait reveal">
        <div className="portrait-placeholder">
          <img src="/assets/photo-profil.jpg" alt="Portrait professionnel" />
        </div>
      </div>
    </section>
  );
}
