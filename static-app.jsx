const { useEffect, useMemo, useState } = React;

const projectsData = [
  {
    id: 'projet-1',
    titre: 'Plateforme web collaborative',
    type: 'Projet d’IUT',
    annee: '2023',
    contexte: 'Réalisation en équipe de 4 dans le cadre d’un projet tutoré.',
    besoin: 'Offrir un espace unique pour gérer des demandes internes et suivre leur avancement.',
    solution: 'Conception d’une application React/Node avec API REST sécurisée et interface responsive.',
    resultat: 'Livraison d’un MVP stable, documentation utilisateur et transfert de compétences au client.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    competences: ['C1', 'C2', 'C5', 'C6'],
  },
  {
    id: 'projet-2',
    titre: 'Automatisation d’un déploiement',
    type: 'Stage',
    annee: '2024',
    contexte: 'Mission en entreprise pour industrialiser la mise en production.',
    besoin: 'Réduire le temps de déploiement et sécuriser les configurations.',
    solution: 'Mise en place de scripts Ansible et pipelines CI/CD avec suivi des logs.',
    resultat: 'Diminution des incidents et temps de déploiement divisé par deux.',
    technologies: ['Ansible', 'GitLab CI', 'Linux', 'NGINX'],
    competences: ['C2', 'C3', 'C5'],
  },
  {
    id: 'projet-3',
    titre: 'Tableau de bord data',
    type: 'Projet personnel',
    annee: '2022',
    contexte: 'Veille et expérimentation personnelle orientée data.',
    besoin: 'Centraliser des indicateurs opérationnels dans un tableau de bord clair.',
    solution: 'Collecte via scripts Python, stockage dans une base relationnelle et dataviz en React.',
    resultat: 'Mise à disposition d’indicateurs fiables et d’un support visuel pour la prise de décision.',
    technologies: ['Python', 'React', 'SQL', 'APIs'],
    competences: ['C1', 'C4', 'C2'],
  },
];

const experiencesData = [
  {
    poste: 'Développeur web stagiaire',
    organisation: 'Agence digitale',
    periode: 'Avril 2024 - Juin 2024',
    missions: [
      'Participation aux ateliers de recueil des besoins et maquettage.',
      'Développement front-end réutilisable avec React et bonnes pratiques d’accessibilité.',
      'Rédaction de tests de recette et support au déploiement.',
    ],
    competences: ['C1', 'C2', 'C6'],
  },
  {
    poste: 'Assistant systèmes et réseaux',
    organisation: 'Service informatique universitaire',
    periode: 'Septembre 2023 - Mars 2024',
    missions: [
      'Supervision quotidienne des services et gestion des sauvegardes.',
      'Automatisation de tâches répétitives via scripts Bash et Python.',
      'Contribution à la documentation technique interne.',
    ],
    competences: ['C3', 'C2', 'C5'],
  },
  {
    poste: 'Chef de projet étudiant',
    organisation: 'Projet tutoré BUT2',
    periode: 'Janvier 2023 - Mai 2023',
    missions: [
      'Animation des réunions hebdomadaires et suivi des risques.',
      'Coordination du backlog et répartition des rôles dans l’équipe.',
      'Présentation des livrables intermédiaires au client.',
    ],
    competences: ['C5', 'C6'],
  },
];

const skillsData = [
  {
    code: 'C1',
    titre: 'C1 – Réaliser un développement d’application',
    description:
      'Concevoir et développer des applications fiables, maintenables et documentées en prenant en compte les usages.',
    evolution: {
      but1: 'Découverte des bases du développement et premières applications simples.',
      but2: 'Mise en œuvre de patterns, tests et documentation technique.',
      but3: 'Conduite de développements complets et industrialisés en équipe.',
    },
    projetsAssocies: [
      { label: 'Plateforme web collaborative', ancre: '#projet-1' },
      { label: 'Tableau de bord data', ancre: '#projet-3' },
    ],
  },
  {
    code: 'C2',
    titre: 'C2 – Optimiser des applications',
    description:
      'Analyser les performances, améliorer la sécurité et automatiser les déploiements pour garantir la qualité de service.',
    evolution: {
      but1: 'Compréhension des principes d’optimisation et premiers profils de code.',
      but2: 'Mise en place de revues de performance, scripts d’automatisation et monitoring.',
      but3: 'Conduite d’optimisations orientées production et intégration continue.',
    },
    projetsAssocies: [
      { label: 'Automatisation d’un déploiement', ancre: '#projet-2' },
      { label: 'Tableau de bord data', ancre: '#projet-3' },
    ],
  },
  {
    code: 'C3',
    titre: 'C3 – Administrer des systèmes informatiques communicants complexes',
    description:
      'Installer, sécuriser et superviser des infrastructures réseaux et serveurs en environnement professionnel.',
    evolution: {
      but1: 'Prise en main de l’administration système et réseau sur des environnements guidés.',
      but2: 'Configuration de services, sécurité de base et supervision.',
      but3: 'Gestion d’environnements multi-services et automatisation des opérations courantes.',
    },
    projetsAssocies: [{ label: 'Automatisation d’un déploiement', ancre: '#projet-2' }],
  },
  {
    code: 'C4',
    titre: 'C4 – Gérer des données de l’information',
    description:
      'Modéliser, stocker, sécuriser et exploiter les données pour produire des analyses fiables.',
    evolution: {
      but1: 'Conception de schémas simples et requêtes fondamentales.',
      but2: 'Optimisation des requêtes, intégration de données et premières visualisations.',
      but3: 'Pilotage d’un flux de données complet et diffusion de tableaux de bord.',
    },
    projetsAssocies: [
      { label: 'Plateforme web collaborative', ancre: '#projet-1' },
      { label: 'Tableau de bord data', ancre: '#projet-3' },
    ],
  },
  {
    code: 'C5',
    titre: 'C5 – Conduire un projet',
    description:
      'Structurer et piloter un projet numérique, de la clarification du besoin jusqu’au suivi des livraisons.',
    evolution: {
      but1: 'Application de méthodes simples de planification et suivi des tâches.',
      but2: 'Animation d’équipe, gestion des risques et communication régulière.',
      but3: 'Pilotage complet en intégrant qualité, sécurité et satisfaction client.',
    },
    projetsAssocies: [
      { label: 'Plateforme web collaborative', ancre: '#projet-1' },
      { label: 'Automatisation d’un déploiement', ancre: '#projet-2' },
    ],
  },
  {
    code: 'C6',
    titre: 'C6 – Collaborer au sein d’une équipe informatique',
    description:
      'Travailler en équipe pluridisciplinaire, partager l’information et co-construire des solutions.',
    evolution: {
      but1: 'Participation aux travaux de groupe et communication de base.',
      but2: 'Utilisation d’outils collaboratifs, revues de code et rituels agiles.',
      but3: 'Animation d’ateliers, coordination des parties prenantes et amélioration continue.',
    },
    projetsAssocies: [
      { label: 'Plateforme web collaborative', ancre: '#projet-1' },
      { label: 'Automatisation d’un déploiement', ancre: '#projet-2' },
    ],
  },
];

const timelineData = [
  {
    titre: 'BUT1',
    periode: '2021 - 2022',
    contexte: 'Découverte des fondements en développement et réseaux à l’IUT.',
    points: ['Prise en main des langages et des bases de données', 'Travail en équipe projet', 'Premières démonstrations devant un client pédagogique'],
  },
  {
    titre: 'BUT2',
    periode: '2022 - 2023',
    contexte: 'Projets plus structurés avec pilotage et documentation.',
    points: ['Gestion de backlog et organisation Agile', 'Montée en compétences sur la sécurité et les tests', 'Livraison d’applications complètes'],
  },
  {
    titre: 'BUT3',
    periode: '2023 - 2024',
    contexte: 'Préparation à l’insertion professionnelle et projets à impact.',
    points: ['Missions orientées production', 'Encadrement de livrables pour des partenaires externes', 'Renforcement des compétences C1 à C6'],
  },
  {
    titre: 'Stage / Alternance',
    periode: '2024',
    contexte: 'Immersion en entreprise et contribution aux opérations quotidiennes.',
    points: ['Application des compétences en conditions réelles', 'Communication avec les utilisateurs et équipes', 'Documentation et transfert de connaissances'],
  },
];

const otherSkillsData = [
  {
    titre: 'Auto-hébergement et homelab',
    description:
      'Administration de serveurs personnels pour tester des services, monitorer et sécuriser un environnement complet.',
    exemple: 'Mise en place d’un homelab virtualisé avec sauvegardes, proxy inverse et supervision légère.',
  },
  {
    titre: 'Automatisation par scripts',
    description: 'Création de scripts Python et Bash pour industrialiser des tâches récurrentes et fiabiliser les déploiements.',
    exemple: 'Scripts de collecte de journaux, génération de rapports et déclenchement de jobs planifiés.',
  },
  {
    titre: 'Veille technologique et apprentissage autonome',
    description: 'Organisation d’une veille régulière pour rester à jour sur les frameworks, pratiques DevOps et sécurité.',
    exemple: 'Participation à des communautés en ligne et mise en pratique via mini-projets publiés sur GitHub.',
  },
  {
    titre: 'Communication et pédagogie',
    description: 'Capacité à vulgariser des sujets techniques et à animer des démonstrations pour différents publics.',
    exemple: 'Présentation de prototypes à des utilisateurs et rédaction de guides pas-à-pas pour l’équipe.',
  },
];

function Header({ onNavigateSection, onNavigateOther, onNavigateHome, view }) {
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

function Hero({ onSeeProjects }) {
  return (
    <section className="section hero" id="accueil">
      <div className="hero-content reveal">
        <p className="eyebrow">Profil global IT</p>
        <h1>Étudiant en BUT Informatique – Profil polyvalent</h1>
        <p className="subtitle">
          Développement, systèmes et réseaux, data et gestion de projet : un parcours complet pour intervenir sur l’ensemble du cycle de vie d’un service numérique.
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

function About() {
  return (
    <section className="section" id="a-propos">
      <div className="section-header reveal">
        <p className="eyebrow">À propos</p>
        <h2>Présentation et positionnement</h2>
        <p>
          Étudiant en troisième année de BUT Informatique, je développe un profil global couvrant le développement, les infrastructures, la donnée et la gestion de projet. Je privilégie la rigueur, l’autonomie et la collaboration pour livrer des solutions fiables.
        </p>
      </div>
      <div className="about-grid">
        <div className="about-card reveal">
          <h3>Profil professionnel</h3>
          <p>
            Sensibilité pour les projets à forte valeur métier, recherche d’efficacité et de clarté dans le code comme dans la documentation. Habitué aux environnements collaboratifs et aux méthodes agiles.
          </p>
        </div>
        <div className="about-card reveal">
          <h3>Objectifs professionnels et poursuite d’études</h3>
          <p>
            Ouvert à une poursuite en école d’ingénieur ou en master informatique, ainsi qu’à un premier poste orienté développement ou ingénierie des opérations. Intérêt marqué pour les environnements où je peux combiner technique et coordination.
          </p>
        </div>
      </div>
    </section>
  );
}

function Skills({ data }) {
  return (
    <section className="section" id="competences">
      <div className="section-header reveal">
        <p className="eyebrow">Compétences clés</p>
        <h2>Compétences du BUT Informatique</h2>
        <p>
          Six compétences structurantes, déclinées du BUT1 au BUT3, illustrées par des projets concrets. Les descriptions sont rédigées pour un contexte professionnel et peuvent être adaptées.
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

function Timeline({ data }) {
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

function Projects({ data }) {
  return (
    <section className="section" id="projets">
      <div className="section-header reveal">
        <p className="eyebrow">Projets</p>
        <h2>Réalisations principales</h2>
        <p>
          Sélection de projets académiques, professionnels ou personnels illustrant l’application des compétences C1 à C6. Chaque carte met en avant le besoin, la solution et le résultat.
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

function Experiences({ data }) {
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

function CVSection() {
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

function Contact() {
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

function OtherSkillsPage({ data, onBack }) {
  return (
    <main className="section standalone">
      <div className="section-header reveal">
        <p className="eyebrow">Compétences complémentaires</p>
        <h2>Autres compétences hors référentiel PN</h2>
        <p>
          Compétences supplémentaires valorisant la curiosité et l’autonomie : homelab, automatisation, veille et communication. Cette page peut être personnalisée pour refléter des expertises spécifiques.
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

const initialView = () =>
  window.location.hash.includes('autres-competences') || window.location.pathname.includes('autres-competences')
    ? 'other'
    : 'main';

function App() {
  const [view, setView] = useState(initialView);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [view]);

  useEffect(() => {
    const onHashChange = () => {
      setView(initialView());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const clearHash = () => {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  };

  const handleNavigateSection = (id) => {
    if (view !== 'main') {
      setView('main');
      clearHash();
      requestAnimationFrame(() => scrollToSection(id));
    } else {
      scrollToSection(id);
    }
  };

  const handleNavigateOther = () => {
    setView('other');
    window.location.hash = 'autres-competences';
  };

  const handleNavigateHome = () => {
    setView('main');
    clearHash();
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sections = useMemo(
    () => (
      <>
        <Hero onSeeProjects={() => handleNavigateSection('projets')} />
        <About />
        <Skills data={skillsData} />
        <Timeline data={timelineData} />
        <Projects data={projectsData} />
        <Experiences data={experiencesData} />
        <CVSection />
        <Contact />
      </>
    ),
    []
  );

  return (
    <div className="app">
      <Header
        onNavigateSection={handleNavigateSection}
        onNavigateOther={handleNavigateOther}
        onNavigateHome={handleNavigateHome}
        view={view}
      />
      {view === 'main' ? sections : <OtherSkillsPage data={otherSkillsData} onBack={handleNavigateHome} />}
    </div>
  );
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
