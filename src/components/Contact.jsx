import React, { useState } from 'react';

export default function Contact() {
  const [formState, setFormState] = useState({ nom: '', email: '', sujet: '', message: '' });
  const [feedback, setFeedback] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nom, email, sujet, message } = formState;
    if (!nom || !email || !sujet || !message) {
      setFeedback('Merci de renseigner tous les champs requis.');
      return;
    }
    setFeedback('Merci pour votre message, je vous répondrai dès que possible.');
    setFormState({ nom: '', email: '', sujet: '', message: '' });
  };

  return (
    <section className="section" id="contact">
      <div className="section-header reveal">
        <p className="eyebrow">Contact</p>
        <h2>Entrer en relation</h2>
        <p>Envie d’échanger sur un projet, une opportunité ou une collaboration ? Utilisez le formulaire ou les coordonnées ci-dessous.</p>
      </div>
      <div className="contact-grid">
        <form className="card reveal" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nom">Nom</label>
            <input id="nom" name="nom" value={formState.nom} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Adresse e-mail</label>
            <input id="email" name="email" type="email" value={formState.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="sujet">Sujet</label>
            <input id="sujet" name="sujet" value={formState.sujet} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="4" value={formState.message} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn primary">
            Envoyer
          </button>
          {feedback && <p className="feedback">{feedback}</p>}
        </form>
        <div className="card reveal contact-card">
          <h3>Coordonnées</h3>
          <p>
            Adresse e-mail professionnelle : <a href="mailto:prenom.nom@email.com">prenom.nom@email.com</a>
            <br />
            LinkedIn : <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">Profil LinkedIn</a>
            <br />
            GitHub : <a href="https://github.com" target="_blank" rel="noreferrer">Profil GitHub</a>
          </p>
          <p className="muted">
            Réponse sous quelques jours ouvrés. Informations supplémentaires disponibles sur demande (références, recommandations, etc.).
          </p>
        </div>
      </div>
    </section>
  );
}
