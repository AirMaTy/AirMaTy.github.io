import React, { useState } from 'react';

export default function Header({ onNavigateSection, onNavigateOther, onNavigateHome, view }) {
  const [open, setOpen] = useState(false);

  const handleNav = (action) => {
    action();
    setOpen(false);
  };

  return (
    <header className="header">
      <div className="logo" onClick={onNavigateHome}>
        Portfolio BUT Informatique
      </div>
      <button className="menu-toggle" onClick={() => setOpen((v) => !v)} aria-label="Menu">
        <i className="fas fa-bars" />
      </button>
      <nav className={`nav ${open ? 'open' : ''}`}>
        {view === 'main' && (
          <>
            <a onClick={() => handleNav(() => onNavigateSection('accueil'))}>Accueil</a>
            <a onClick={() => handleNav(() => onNavigateSection('a-propos'))}>À propos</a>
            <a onClick={() => handleNav(() => onNavigateSection('competences'))}>Compétences</a>
            <a onClick={() => handleNav(() => onNavigateSection('parcours'))}>Parcours / Timeline</a>
            <a onClick={() => handleNav(() => onNavigateSection('projets'))}>Projets</a>
            <a onClick={() => handleNav(() => onNavigateSection('experiences'))}>Expériences</a>
            <a onClick={() => handleNav(() => onNavigateSection('cv'))}>CV</a>
            <a onClick={() => handleNav(() => onNavigateSection('contact'))}>Contact</a>
          </>
        )}
        <a onClick={() => handleNav(onNavigateOther)} className={view === 'other' ? 'active' : ''}>
          Autres compétences
        </a>
      </nav>
    </header>
  );
}
