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
    description: 'Concevoir, administrer et exploiter des bases de données pour produire des informations fiables.',
    evolution: {
      but1: 'Modélisation de données et requêtes simples.',
      but2: 'Optimisation des requêtes et intégration d’APIs de données.',
      but3: 'Gouvernance des données, sécurité et restitution via tableaux de bord.',
    },
    projetsAssocies: [
      { label: 'Tableau de bord data', ancre: '#projet-3' },
      { label: 'Plateforme web collaborative', ancre: '#projet-1' },
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
    points: [
      'Prise en main des langages et des bases de données',
      'Travail en équipe projet',
      'Premières démonstrations devant un client pédagogique',
    ],
  },
  {
    titre: 'BUT2',
    periode: '2022 - 2023',
    contexte: 'Projets plus structurés avec pilotage et documentation.',
    points: [
      'Gestion de backlog et organisation Agile',
      'Montée en compétences sur la sécurité et les tests',
      'Livraison d’applications complètes',
    ],
  },
  {
    titre: 'BUT3',
    periode: '2023 - 2024',
    contexte: 'Préparation à l’insertion professionnelle et projets à impact.',
    points: [
      'Missions orientées production',
      'Encadrement de livrables pour des partenaires externes',
      'Renforcement des compétences C1 à C6',
    ],
  },
  {
    titre: 'Stage / Alternance',
    periode: '2024',
    contexte: 'Immersion en entreprise et contribution aux opérations quotidiennes.',
    points: [
      'Application des compétences en conditions réelles',
      'Communication avec les utilisateurs et équipes',
      'Documentation et transfert de connaissances',
    ],
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

function renderProjects() {
  return projectsData
    .map(
      (p) => `
      <article class="card project" id="${p.id}">
        <div class="card-header">
          <div>
            <p class="eyebrow">${p.type} • ${p.annee}</p>
            <h3>${p.titre}</h3>
          </div>
          <div class="badge-set">
            ${p.competences.map((c) => `<span class="badge neutral">${c}</span>`).join('')}
          </div>
        </div>
        <p><strong>Contexte :</strong> ${p.contexte}</p>
        <p><strong>Besoin :</strong> ${p.besoin}</p>
        <p><strong>Solution :</strong> ${p.solution}</p>
        <p><strong>Résultat :</strong> ${p.resultat}</p>
        <div class="tags">
          ${p.technologies.map((t) => `<span class="chip">${t}</span>`).join('')}
        </div>
      </article>
    `
    )
    .join('');
}

function renderExperiences() {
  return experiencesData
    .map(
      (xp) => `
      <article class="card">
        <div class="card-header">
          <div>
            <p class="eyebrow">${xp.organisation}</p>
            <h3>${xp.poste}</h3>
          </div>
          <span class="badge neutral">${xp.periode}</span>
        </div>
        <ul>
          ${xp.missions.map((m) => `<li>${m}</li>`).join('')}
        </ul>
        <div class="tags">
          ${xp.competences.map((c) => `<span class="chip">${c}</span>`).join('')}
        </div>
      </article>
    `
    )
    .join('');
}

function renderSkills() {
  return skillsData
    .map(
      (s) => `
      <article class="card">
        <div class="card-header">
          <h3>${s.titre}</h3>
          <span class="badge">${s.code}</span>
        </div>
        <p>${s.description}</p>
        <div class="skills-grid">
          <div>
            <p class="eyebrow">Évolution</p>
            <ul>
              <li><strong>BUT1 :</strong> ${s.evolution.but1}</li>
              <li><strong>BUT2 :</strong> ${s.evolution.but2}</li>
              <li><strong>BUT3 :</strong> ${s.evolution.but3}</li>
            </ul>
          </div>
          <div>
            <p class="eyebrow">Projets associés</p>
            <div class="link-chips">
              ${s.projetsAssocies
                .map((proj) => `<a class="chip" href="${proj.ancre}">${proj.label}</a>`)
                .join('')}
            </div>
          </div>
        </div>
      </article>
    `
    )
    .join('');
}

function renderTimeline() {
  return timelineData
    .map(
      (entry) => `
      <article class="card timeline-item">
        <div class="card-header">
          <h3>${entry.titre}</h3>
          <span class="badge neutral">${entry.periode}</span>
        </div>
        <p>${entry.contexte}</p>
        <ul>
          ${entry.points.map((pt) => `<li>${pt}</li>`).join('')}
        </ul>
      </article>
    `
    )
    .join('');
}

function renderOtherSkills() {
  return otherSkillsData
    .map(
      (item) => `
      <article class="card">
        <div class="card-header">
          <h3>${item.titre}</h3>
        </div>
        <p>${item.description}</p>
        <p class="subtitle"><strong>Exemple :</strong> ${item.exemple}</p>
      </article>
    `
    )
    .join('');
}

function renderApp() {
  return `
    <div class="app">
      <header class="header">
        <div class="logo" data-action="home">Portfolio BUT Informatique</div>
        <button class="menu-toggle" aria-label="Menu" data-action="toggle-menu">
          <i class="fas fa-bars"></i>
        </button>
        <nav class="nav" data-role="nav">
          <a data-section="accueil">Accueil</a>
          <a data-section="a-propos">À propos</a>
          <a data-section="competences">Compétences</a>
          <a data-section="parcours">Parcours / Timeline</a>
          <a data-section="projets">Projets</a>
          <a data-section="experiences">Expériences</a>
          <a data-section="cv">CV</a>
          <a data-section="contact">Contact</a>
          <a data-action="other">Autres compétences</a>
        </nav>
      </header>

      <main id="main-view">
        <section class="section hero" id="accueil">
          <div class="hero-content reveal">
            <p class="eyebrow">Profil global IT</p>
            <h1>
              Étudiant en BUT Informatique<br />
              orienté développement et systèmes
            </h1>
            <p class="subtitle">
              Curieux et polyvalent, je combine compétences en développement web, administration système et gestion de projet.
            </p>
            <div class="actions">
              <a class="btn primary" data-section="projets">Voir les projets</a>
              <a class="btn ghost" data-action="other">
                Autres compétences
                <i class="fas fa-arrow-right"></i>
              </a>
            </div>
            <div class="chips">
              <span class="chip">React</span>
              <span class="chip">Node.js</span>
              <span class="chip">Systèmes & Réseaux</span>
              <span class="chip">Gestion de projet</span>
            </div>
          </div>
          <div class="hero-cards reveal">
            <div class="mini-card">
              <p class="eyebrow">Compétences clés</p>
              <h3>Full-stack, DevOps & Organisation</h3>
              <p class="muted">Maîtrise du front, de l’automatisation et du pilotage.</p>
            </div>
            <div class="mini-card">
              <p class="eyebrow">Engagement</p>
              <h3>Pragmatisme et pédagogie</h3>
              <p class="muted">Recherche de solutions concrètes et pédagogie dans la restitution.</p>
            </div>
          </div>
        </section>

        <section class="section" id="a-propos">
          <div class="section-header">
            <p class="eyebrow">Présentation</p>
            <h2>Qui suis-je ?</h2>
            <p class="subtitle">
              Étudiant passionné par le numérique, je construis des projets mêlant code, infrastructure et accompagnement des utilisateurs.
            </p>
          </div>
          <div class="about-grid">
            <div class="card">
              <h3>Ce que j’aime faire</h3>
              <ul>
                <li>Créer des interfaces modernes et accessibles.</li>
                <li>Automatiser et fiabiliser des déploiements.</li>
                <li>Structurer les idées et les présenter clairement.</li>
              </ul>
            </div>
            <div class="card">
              <h3>Valeurs</h3>
              <ul>
                <li>Curiosité et apprentissage continu.</li>
                <li>Travail en équipe et partage.</li>
                <li>Qualité, simplicité et impact utilisateur.</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="section" id="competences">
          <div class="section-header">
            <p class="eyebrow">Parcours BUT Informatique</p>
            <h2>Compétences C1 à C6</h2>
            <p class="subtitle">Synthèse des six compétences du référentiel, avec leurs évolutions et projets associés.</p>
          </div>
          <div class="grid skills-grid">${renderSkills()}</div>
        </section>

        <section class="section" id="parcours">
          <div class="section-header">
            <p class="eyebrow">Timeline</p>
            <h2>Parcours académique</h2>
            <p class="subtitle">Étapes clés et apprentissages marquants tout au long du BUT.</p>
          </div>
          <div class="grid timeline-grid">${renderTimeline()}</div>
        </section>

        <section class="section" id="projets">
          <div class="section-header">
            <p class="eyebrow">Portfolio</p>
            <h2>Projets significatifs</h2>
            <p class="subtitle">Projets académiques, professionnels et personnels mettant en avant mes compétences.</p>
          </div>
          <div class="grid">${renderProjects()}</div>
        </section>

        <section class="section" id="experiences">
          <div class="section-header">
            <p class="eyebrow">Expériences</p>
            <h2>Expériences en contexte</h2>
            <p class="subtitle">Missions réalisées en stage, alternance ou projets tutorés.</p>
          </div>
          <div class="grid">${renderExperiences()}</div>
        </section>

        <section class="section" id="cv">
          <div class="section-header">
            <p class="eyebrow">CV</p>
            <h2>Curriculum Vitae</h2>
            <p class="subtitle">Disponible au format PDF sur demande.</p>
          </div>
          <div class="card">
            <p>Contactez-moi pour obtenir la dernière version de mon CV.</p>
            <div class="actions">
              <a class="btn primary" data-section="contact">Me contacter</a>
            </div>
          </div>
        </section>

        <section class="section" id="contact">
          <div class="section-header">
            <p class="eyebrow">Contact</p>
            <h2>Restons en contact</h2>
            <p class="subtitle">Je suis disponible pour échanger sur vos projets ou opportunités.</p>
          </div>
          <div class="card contact-card">
            <div>
              <p class="eyebrow">Email</p>
              <p><i class="fas fa-envelope"></i> prenom.nom@example.com</p>
            </div>
            <div>
              <p class="eyebrow">LinkedIn</p>
              <a class="text-link" href="https://www.linkedin.com" target="_blank" rel="noreferrer">
                linkedin.com/in/mon-profil
              </a>
            </div>
            <div>
              <p class="eyebrow">GitHub</p>
              <a class="text-link" href="https://github.com" target="_blank" rel="noreferrer">
                github.com/mon-profil
              </a>
            </div>
          </div>
        </section>
      </main>

      <section id="other-view" class="section hidden">
        <div class="section-header">
          <p class="eyebrow">Compétences complémentaires</p>
          <h2>Autres compétences</h2>
          <p class="subtitle">Initiatives personnelles et savoir-faire transverses.</p>
          <div class="actions">
            <a class="btn ghost" data-action="home">
              <i class="fas fa-arrow-left"></i> Retour à l’accueil
            </a>
          </div>
        </div>
        <div class="grid">${renderOtherSkills()}</div>
      </section>
    </div>
  `;
}

function initNavigation(root) {
  const nav = root.querySelector('[data-role="nav"]');
  const mainView = root.querySelector('#main-view');
  const otherView = root.querySelector('#other-view');
  const menuToggle = root.querySelector('[data-action="toggle-menu"]');

  function closeMenu() {
    nav.classList.remove('open');
  }

  function showMain() {
    mainView.classList.remove('hidden');
    otherView.classList.add('hidden');
    root.querySelectorAll('[data-action="other"]').forEach((link) => link.classList.remove('active'));
    window.history.replaceState(null, '', window.location.pathname);
  }

  function showOther() {
    mainView.classList.add('hidden');
    otherView.classList.remove('hidden');
    root.querySelectorAll('[data-action="other"]').forEach((link) => link.classList.add('active'));
    window.location.hash = 'autres';
  }

  function scrollToSection(id) {
    const target = root.querySelector(`#${id}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.location.hash = id;
    }
  }

  root.querySelector('[data-action="home"]').addEventListener('click', () => {
    showMain();
    closeMenu();
    scrollToSection('accueil');
  });

  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  root.querySelectorAll('[data-section]').forEach((link) => {
    link.addEventListener('click', () => {
      showMain();
      scrollToSection(link.getAttribute('data-section'));
      closeMenu();
    });
  });

  root.querySelectorAll('[data-action="other"]').forEach((link) => {
    link.addEventListener('click', () => {
      showOther();
      closeMenu();
    });
  });

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#autres') {
      showOther();
    } else if (window.location.hash) {
      showMain();
      scrollToSection(window.location.hash.substring(1));
    } else {
      showMain();
    }
  });

  if (window.location.hash === '#autres') {
    showOther();
  } else if (window.location.hash) {
    scrollToSection(window.location.hash.substring(1));
  }
}

function bootstrap() {
  const root = document.getElementById('root');
  root.innerHTML = renderApp();
  initNavigation(root);
}

document.addEventListener('DOMContentLoaded', bootstrap);
