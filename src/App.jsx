import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Timeline from './components/Timeline.jsx';
import Projects from './components/Projects.jsx';
import Experiences from './components/Experiences.jsx';
import CVSection from './components/CVSection.jsx';
import Contact from './components/Contact.jsx';
import OtherSkillsPage from './components/OtherSkillsPage.jsx';

// Données placeholder pour chaque section
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

const initialView = () => (window.location.pathname.includes('autres-competences') ? 'other' : 'main');

export default function App() {
  const [view, setView] = useState(initialView);

  // Observer simple pour révéler les éléments quand ils apparaissent
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
    const onPop = () => {
      setView(initialView());
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const handleNavigateSection = (id) => {
    if (view !== 'main') {
      setView('main');
      window.history.pushState({}, '', '/');
      // Petite attente pour laisser le rendu se faire
      requestAnimationFrame(() => scrollToSection(id));
    } else {
      scrollToSection(id);
    }
  };

  const handleNavigateOther = () => {
    setView('other');
    window.history.pushState({}, '', '/autres-competences');
  };

  const handleNavigateHome = () => {
    setView('main');
    window.history.pushState({}, '', '/');
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
