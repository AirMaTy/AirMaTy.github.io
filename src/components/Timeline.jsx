import React from 'react';

export default function Timeline({ data }) {
  return (
    <section className="section" id="parcours">
      <div className="section-header reveal">
        <p className="eyebrow">Parcours</p>
        <h2>Évolution du BUT1 au BUT3</h2>
        <p>Une trajectoire progressive avec des jalons académiques et professionnels pour renforcer les compétences clés.</p>
      </div>
      <div className="timeline">
        {data.map((item) => (
          <div key={item.titre} className="timeline-item reveal">
            <div className="timeline-point" />
            <div className="timeline-content">
              <h3>{item.titre}</h3>
              <p className="periode">{item.periode}</p>
              <p>{item.contexte}</p>
              <ul>
                {item.points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
