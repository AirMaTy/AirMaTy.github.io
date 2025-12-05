import React from 'react';

export default function About() {
  return (
    <section className="section" id="a-propos">
      <div className="section-header reveal">
        <p className="eyebrow">À propos</p>
        <h2>Présentation et positionnement</h2>
        <p>
          Étudiant en troisième année de BUT Informatique, je développe un profil global couvrant le développement, les
          infrastructures, la donnée et la gestion de projet. Je privilégie la rigueur, l’autonomie et la collaboration pour
          livrer des solutions fiables.
        </p>
      </div>
      <div className="about-grid">
        <div className="about-card reveal">
          <h3>Profil professionnel</h3>
          <p>
            Sensibilité pour les projets à forte valeur métier, recherche d’efficacité et de clarté dans le code comme dans la
            documentation. Habitué aux environnements collaboratifs et aux méthodes agiles.
          </p>
        </div>
        <div className="about-card reveal">
          <h3>Objectifs professionnels et poursuite d’études</h3>
          <p>
            Ouvert à une poursuite en école d’ingénieur ou en master informatique, ainsi qu’à un premier poste orienté développement
            ou ingénierie des opérations. Intérêt marqué pour les environnements où je peux combiner technique et coordination.
          </p>
        </div>
      </div>
    </section>
  );
}
