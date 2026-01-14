
(() => {
  const STORAGE_KEY = "site-language";
  const DEFAULT_LANG = "fr";

  const translations = {
    fr: {
      nav: {
        aria: "Navigation principale",
        home: "Accueil",
        parcours: "Parcours",
        competences: "Compétences",
        projets: "Projets",
        cv: "CV",
        contact: "Contact",
        menu: "Menu",
        menuAria: "Ouvrir ou fermer le menu"
      },
      pageTitles: {
        home: "Maxime Lacoste | Portfolio",
        parcours: "Parcours | Maxime Lacoste",
        competences: "Compétences | Maxime Lacoste",
        projets: "Projets | Maxime Lacoste",
        cv: "CV | Maxime Lacoste",
        contact: "Contact | Maxime Lacoste",
        notFound: "Page introuvable | Maxime Lacoste"
      },
      langToggle: {
        aria: "Basculer la langue"
      },
      footer: {
        copyright: "© 2026 Maxime Lacoste"
      },
      common: {
        copy: "Copier",
        copied: "Copié",
        view: "Voir",
        close: "Fermer"
      },
      home: {
        hero: {
          introPrefix: "Étudiant en parcours universitaire en informatique - Alternant chez",
          introSuffix: ".",
          detail1:
            "Je suis actuellement en alternance chez Carington, où je travaille sur l'automatisation de processus internes et le développement d'outils.",
          detail2:
            "Mon quotidien est centré sur des problématiques concrètes : traitement de données, automatisation de tâches répétitives, intégration d'API et fiabilisation de flux existants."
        },
        cta: {
          skills: "Voir mes compétences",
          projects: "Voir mes projets",
          cv: "Voir mon CV"
        },
        photoAlt: "Portrait de Maxime Lacoste",
        photoPlaceholder: "Photo à ajouter",
        objective: {
          title: "Objectif",
          text:
            "Je souhaite poursuivre mon parcours universitaire en informatique vers une formation de niveau master ou une école d'ingénieurs, orientée cybersécurité et réseaux, tout en continuant à renforcer mes compétences techniques par des projets concrets et une expérience terrain solide."
        },
        overview: {
          title: "Ce que vous trouverez ici",
          subtitle:
            "Un aperçu clair de mon parcours, de mes compétences, des projets réalisés et des informations utiles pour un recrutement ou un suivi académique.",
          cards: {
            parcours: {
              title: "Parcours",
              text: "Mon parcours académique et professionnel."
            },
            competences: {
              title: "Compétences",
              text: "Progression sur trois années, avec une vision structurée des compétences maîtrisées."
            },
            projets: {
              title: "Projets",
              text: "Exemples de projets en université et en entreprise, axés automatisation et systèmes."
            },
            cv: {
              title: "CV",
              text: "Version téléchargeable pour un partage rapide auprès des recruteurs."
            }
          }
        }
      },
      parcours: {
        title: "Parcours",
        subtitle: "Un aperçu chronologique de mon parcours académique, avec des exemples réalistes.",
        timeline: {
          it: {
            title: "Parcours universitaire en informatique | Alternance",
            meta:
              "IUT de Toulouse - 2023 - 2026 - Formation universitaire en informatique, spécialité applications communicantes et sécurisées",
            metaBut:
              "IUT de Toulouse - 2023 - 2026 - BUT Informatique, spécialité applications communicantes et sécurisées",
            item1: "Conception et développement d'applications logicielles et web.",
            item2:
              "Mise en œuvre de services communicants et d'interactions entre applications.",
            item3:
              "Bases en systèmes, réseaux et sécurité appliquées aux applications."
          },
          networks: {
            title:
              "Une année d'études universitaires en informatique (orientation réseaux et télécommunications)",
            meta: "IUT de Mont-de-Marsan - 2022 - 2023",
            item1: "Découverte des architectures réseau et des services fondamentaux.",
            item2: "Premières configurations et diagnostics sur des systèmes Linux.",
            item3:
              "Travaux pratiques autour de la disponibilité, de la sécurité et du fonctionnement des réseaux."
          },
          lycee: {
            title: "Lycée Général et Technologique Victor Hugo",
            meta:
              "Colomiers - 2019 - 2022 - Baccalauréat STI2D (spécialité Systèmes d'Information et Numérique)",
            item1: "Acquisition des bases en mathématiques, logique et sciences numériques.",
            item2: "Découverte des systèmes techniques et de l'approche projet.",
            item3: "Travail en équipe, restitution orale et structuration de la pensée."
          }
        },
        jobs: {
          title: "Job étudiant",
          cerp: {
            title: "Préparateur de commandes en répartition pharmaceutique | Cerp Rouen",
            meta: "Cerp Rouen - Balma, France - CDI - Depuis 2023",
            item1: "Préparation de commandes en zone froide et en zone tempérée",
            item2: "Préparation de commandes de grande volumétrie (grosses quantités, cartons)",
            item3: "Rangement et organisation des zones de stockage",
            item4:
              "Respect des procédures, de la traçabilité et des règles d'hygiène et de sécurité"
          }
        }

      },
      competences: {
        title: "Compétences",
        subtitle:
          "Les compétences se renforcent progressivement au fil des trois années de mon parcours universitaire en informatique. Cette page met en avant cette évolution et les niveaux atteints à chaque étape.",
        timelineAria: "Progression sur trois années",
        years: {
          1: "Année 1",
          2: "Année 2",
          3: "Année 3"
        },
        labels: {
          realiser: "Réaliser",
          optimiser: "Optimiser",
          administrer: "Administrer",
          gerer: "Gérer",
          conduire: "Conduire",
          collaborer: "Collaborer"
        },
        actions: {
          levels: "Voir les niveaux",
          projects: "Projets liés"
        },
        modal: {
          title: "Niveaux",
          titleFormat: "{competence} - {year}"
        },
        levels: {
          realiser: [
            "Niveau 1: Développer des applications informatiques simples",
            "Niveau 2: Partir des exigences et aller jusqu'à une application complète",
            "Niveau 3: Adapter des applications sur un ensemble de supports (embarqué, web, mobile, IoT...)"
          ],
          optimiser: [
            "Niveau 1: Appréhender et construire des algorithmes",
            "Niveau 2: Sélectionner les algorithmes adéquats pour répondre à un problème donné"
          ],
          administrer: [
            "Niveau 1: Installer et configurer un poste de travail",
            "Niveau 2: Déployer des services dans une architecture réseau",
            "Niveau 3: Faire évoluer et maintenir un système informatique communiquant en conditions opérationnelles"
          ],
          gerer: [
            "Niveau 1: Concevoir et mettre en place une base de données à partir d'un cahier des charges client",
            "Niveau 2: Optimiser une base de données, interagir avec une application et mettre en œuvre la sécurité"
          ],
          conduire: [
            "Niveau 1: Identifier les besoins métiers des clients et des utilisateurs",
            "Niveau 2: Appliquer une démarche de suivi de projet en fonction des besoins métiers des clients et des utilisateurs"
          ],
          collaborer: [
            "Niveau 1: Identifier ses aptitudes pour travailler dans une équipe",
            "Niveau 2: Situer son rôle et ses missions au sein d'une équipe informatique",
            "Niveau 3: Manager une équipe informatique"
          ]
        }
      },
      projects: {
        title: "Projets",
        subtitle:
          "Une sélection de projets universitaires, professionnels et personnels illustrant la mise en pratique des compétences acquises pendant mes études universitaires en informatique et mon approche concrète des systèmes et du développement.",
        filter: {
          title: "Filtrer par compétence",
          bannerLabel: "Filtre actif :",
          reset: "Réinitialiser",
          active: "Filtre actif : {filters}"
        },
        empty: "Aucun projet n'est disponible avec ces filtres.",
        sections: {
          professional: "Projets professionnels",
          university: "Projets universitaires",
          personal: "Projets personnels"
        },
        modal: {
          imageLabel: "Voir l'image {index} en plein écran",
          imageUnavailable: "Image indisponible",
          noImages: "Aucune image disponible pour ce projet."
        },
        cards: {
          autoCompletion: {
            title: "Auto-complétion de CERFA",
            context: "Contexte : Entreprise (Carington)",
            type: "Automatisation",
            description:
              "Développement d'un système d'auto-complétion de formulaires CERFA à partir de documents clients, avec extraction et traitement automatisés des données.",
            tools: "Python, OCR, API, Linux",
            modalTitle: "Auto-complétion de CERFA",
            modalText:
              "Cette application a été développée en Python afin d'automatiser le remplissage des formulaires CERFA à partir des documents fournis par le client (pièce d'identité, justificatif de domicile, carte grise, etc.).\n\nL'objectif est de réduire le temps de traitement des dossiers tout en limitant les erreurs liées à la saisie manuelle. Les documents sont analysés via des API d'extraction de données et d'OCR, notamment Mindee, afin d'en extraire automatiquement les informations nécessaires (numéro d'immatriculation, numéro VIN, informations sur le nouveau titulaire...), qui sont ensuite utilisées pour préremplir le formulaire.\n\nUne prévisualisation permet de vérifier les données avant validation finale. De plus, la sélection du nombre de pages envoyées à l'API permet de maîtriser les coûts d'utilisation, garantissant un bon équilibre entre automatisation, contrôle humain et optimisation du budget."
          },
          automation: {
            title: "Automatisation de processus métiers",
            context: "Contexte : Entreprise (Carington)",
            type: "Automatisation",
            description:
              "Mise en place de chaînes d'automatisation orchestrant plusieurs scripts et services afin de réduire significativement les tâches manuelles internes.",
            tools: "Linux, scripting, planification, cron",
            modalTitle: "Automatisation de processus métiers",
            modalText:
              "Ce projet consiste en la conception et la mise en place de processus d'automatisation visant à réduire les tâches répétitives et à fiabiliser les opérations métiers internes.\n\nDes scripts ont été développés et orchestrés afin de traiter automatiquement différentes actions (traitement de données, gestion de fichiers, déclenchements conditionnels, planification), en s'intégrant aux outils et workflows existants.\n\nL'objectif est d'améliorer la productivité, de limiter les erreurs humaines et de garantir une exécution cohérente et traçable des opérations, tout en conservant une supervision et un contrôle adaptés aux besoins métiers."
          },
          clubPhoto: {
            title: "Club photo de Nailloux",
            context: "Contexte : Université",
            type: "Développement web",
            description:
              "Développement d'une application web de type réseau social destinée à un club photo, avec gestion des contenus et des interactions entre utilisateurs.",
            tools: "Web, React, SQL, gestion de projet",
            modalTitle: "Facebook-like Club photo de Nailloux",
            modalText:
              "Ce projet consiste en la conception et le développement d'une application web de type réseau social dédiée à un club photo.\n\nLa plateforme permet aux membres de gérer leur profil, de publier des photos, d'interagir via des commentaires et de participer à la vie du club dans un espace collaboratif. Une attention particulière a été portée à l'organisation des contenus et à la gestion des interactions entre utilisateurs.\n\nL'objectif du projet était de mettre en pratique les principes du développement web, de la gestion des données et du travail en équipe, tout en répondant à un besoin concret de communication et de partage au sein d'une association."
          },
          infrastructure: {
            title: "Déploiement d'une infrastructure réseau multi-sites",
            context: "Contexte : Université",
            type: "Systèmes et réseaux",
            description:
              "Conception et déploiement d'une infrastructure réseau complète dans un environnement pédagogique, incluant plusieurs sites, des services d'infrastructure et le déploiement d'applications conteneurisées.",
            tools: "Linux, architecture réseau, services d'infrastructure, conteneurisation, équipements Cisco",
            modalTitle: "Déploiement d'une infrastructure réseau multi-sites",
            modalText:
              "Ce projet consiste en la conception et le déploiement d'une infrastructure réseau multi-sites dans un contexte pédagogique.\n\nL'infrastructure met en œuvre la segmentation du réseau, des services d'infrastructure centralisés et le déploiement d'applications, tout en assurant la communication entre plusieurs sites. Le projet inclut également la configuration des équipements réseau et des systèmes afin de garantir la disponibilité et la cohérence des services.\n\nL'objectif est de mettre en pratique les notions d'architecture réseau, d'administration système et de conduite de projet, à travers un travail en équipe reproduisant les contraintes d'un environnement professionnel."
          },
          teamManagement: {
            title: "Application de gestion d'équipe sportive",
            context: "Contexte : Université",
            type: "Développement web",
            description:
              "Développement d'une application web fictive permettant la gestion d'une équipe sportive : membres, matchs et suivi des statistiques.",
            tools: "HTML, CSS, PHP, SQL",
            modalTitle: "Application de gestion d'équipe sportive",
            modalText:
              "Ce projet consiste en le développement d'une application web dédiée à la gestion d'une équipe sportive.\n\nL'application permet de gérer les profils des membres, le calendrier des matchs ainsi que le suivi des statistiques individuelles et collectives. Elle centralise les informations essentielles afin de faciliter l'organisation et le suivi de l'équipe.\n\nL'objectif du projet était de mettre en pratique les bases du développement web et de la gestion des données, tout en répondant à un besoin fonctionnel simple et structuré dans un contexte pédagogique."
          },
          personalInfrastructure: {
            title: "Infrastructure serveur personnelle sécurisée",
            context: "Contexte : Personnel",
            type: "Systèmes et réseaux",
            description:
              "Mise en place et administration d'une infrastructure serveur personnelle incluant des services auto-hébergés, du stockage et des mécanismes de sécurisation des accès.",
            tools: "Linux, auto-hébergement, services d'infrastructure, sécurité des systèmes",
            modalTitle: "Infrastructure serveur personnelle sécurisée",
            modalText:
              "Ce projet personnel consiste en la mise en place et l'administration d'une infrastructure serveur auto-hébergée à domicile, destinée à fournir différents services à usage personnel.\n\nL'infrastructure permet notamment de mettre à disposition un espace de stockage de type NAS, un serveur multimédia (Plex) ainsi que des services applicatifs tels qu'un serveur Minecraft. Les services sont organisés et administrés afin d'assurer leur disponibilité et leur bon fonctionnement.\n\nCe projet m'a permis de développer mes compétences en administration système, en gestion de services auto-hébergés et en configuration d'un environnement serveur adapté à des usages concrets du quotidien."
          }
        },
        toolsLabel: "Outils :"
      },
      contact: {
        title: "Contact",
        subtitle: "Un formulaire simple et mes liens professionnels.",
        form: {
          title: "Envoyer un message",
          name: "Nom",
          email: "Email",
          subject: "Sujet",
          message: "Message",
          consent: "J'accepte d'être recontacté",
          submit: "Envoyer",
          sent: "Message prêt à être envoyé (fonctionnalité désactivée sur ce site)."
        },
        links: {
          title: "Mes liens"
        }
      },
      cv: {
        title: "CV",
        subtitle:
          "Version téléchargeable du CV. Si l'aperçu ne s'affiche pas, utilisez le lien direct.",
        download: "Télécharger le CV",
        fallback: "Impossible d'afficher le PDF. Vous pouvez le consulter ici :",
        open: "Ouvrir le CV"
      },
      notFound: {
        title: "Page introuvable",
        message: "La page que vous recherchez n'existe pas ou a été déplacée.",
        back: "Revenir à l'accueil",
        helpTitle: "Besoin d'aide ?",
        helpText: "Utilisez le menu pour retrouver les sections principales du portfolio."
      },
      lightbox: {
        aria: "Visionneuse d'image",
        close: "Fermer l'image",
        prev: "Image précédente",
        next: "Image suivante",
        fallback: "Impossible de charger cette image.",
        caption: "Image {index} / {total}",
        alt: "{title} - {index}"
      }
    },
    en: {
      nav: {
        aria: "Main navigation",
        home: "Home",
        parcours: "Background",
        competences: "Skills",
        projets: "Projects",
        cv: "Resume",
        contact: "Contact",
        menu: "Menu",
        menuAria: "Open or close the menu"
      },
      pageTitles: {
        home: "Maxime Lacoste | Portfolio",
        parcours: "Background | Maxime Lacoste",
        competences: "Skills | Maxime Lacoste",
        projets: "Projects | Maxime Lacoste",
        cv: "Resume | Maxime Lacoste",
        contact: "Contact | Maxime Lacoste",
        notFound: "Page not found | Maxime Lacoste"
      },
      langToggle: {
        aria: "Switch language"
      },
      footer: {
        copyright: "© 2026 Maxime Lacoste"
      },
      common: {
        copy: "Copy",
        copied: "Copied",
        view: "View",
        close: "Close"
      },
      home: {
        hero: {
          introPrefix: "University studies in computer science - Work-study student at",
          introSuffix: ".",
          detail1:
            "I am currently on a work-study program at Carington, working on internal process automation and tool development.",
          detail2:
            "My day-to-day work focuses on practical challenges: data processing, automation of repetitive tasks, API integration, and improving the reliability of existing flows."
        },
        cta: {
          skills: "View my skills",
          projects: "View my projects",
          cv: "View my resume"
        },
        photoAlt: "Portrait of Maxime Lacoste",
        photoPlaceholder: "Photo to add",
        objective: {
          title: "Objective",
          text:
            "I want to continue my university path in computer science toward a master's level program or an engineering school focused on cybersecurity and networks, while continuing to build technical skills through hands-on projects and solid field experience."
        },
        overview: {
          title: "What you will find here",
          subtitle:
            "A clear overview of my background, skills, completed projects, and useful information for hiring or academic follow-up.",
          cards: {
            parcours: {
              title: "Background",
              text: "My academic and professional background."
            },
            competences: {
              title: "Skills",
              text: "Progress across three years, with a structured view of the skills achieved."
            },
            projets: {
              title: "Projects",
              text: "Examples of university and professional projects focused on automation and systems."
            },
            cv: {
              title: "Resume",
              text: "Downloadable version for quick sharing with recruiters."
            }
          }
        }
      },
      parcours: {
        title: "Background",
        subtitle: "A chronological overview of my academic path, with realistic examples.",
        timeline: {
          it: {
            title: "University program in computer science | Work-study",
            meta:
              "IUT of Toulouse - 2023 - 2026 - University training in computer science, specialization in secure communicating applications",
            metaBut:
              "IUT of Toulouse - 2023 - 2026 - University Bachelor of Technology (BUT) in Computer Science (France), specialization in secure communicating applications",
            item1: "Design and development of software and web applications.",
            item2: "Implementation of communicating services and interactions between applications.",
            item3: "Foundations in systems, networks, and security applied to applications."
          },
          networks: {
            title: "1 year of university studies in computer science (networking and telecommunications focus)",
            meta: "IUT of Mont-de-Marsan - 2022 - 2023",
            item1: "Discovery of network architectures and core services.",
            item2: "First configurations and diagnostics on Linux systems.",
            item3: "Hands-on work on availability, security, and network operations."
          },
          lycee: {
            title: "Victor Hugo General and Technical High School",
            meta:
              "Colomiers - 2019 - 2022 - STI2D Baccalaureate (Information Systems and Digital specialization)",
            item1: "Foundations in mathematics, logic, and digital sciences.",
            item2: "Discovery of technical systems and the project approach.",
            item3: "Teamwork, oral presentation, and structured thinking."
          }
        },
        jobs: {
          title: "Student job",
          cerp: {
            title: "Order picker in pharmaceutical distribution | Cerp Rouen",
            meta: "Cerp Rouen - Balma, France - Permanent contract (CDI) - Since 2023",
            item1: "Order picking in cold storage and ambient temperature areas",
            item2: "Preparation of high-volume orders (large quantities, carton-based orders)",
            item3: "Storage organization and restocking",
            item4: "Compliance with procedures, traceability, hygiene and safety rules"
          }
        }

      },
      competences: {
        title: "Skills",
        subtitle:
          "Skills build progressively over the three years of my university path in computer science. This page highlights that progression and the levels reached at each stage.",
        timelineAria: "Progress over three years",
        years: {
          1: "Year 1",
          2: "Year 2",
          3: "Year 3"
        },
        labels: {
          realiser: "Build",
          optimiser: "Optimize",
          administrer: "Administer",
          gerer: "Manage",
          conduire: "Lead",
          collaborer: "Collaborate"
        },
        actions: {
          levels: "View levels",
          projects: "Related projects"
        },
        modal: {
          title: "Levels",
          titleFormat: "{competence} - {year}"
        },
        levels: {
          realiser: [
            "Level 1: Develop simple software applications",
            "Level 2: Start from requirements and deliver a complete application",
            "Level 3: Adapt applications across multiple platforms (embedded, web, mobile, IoT...)"
          ],
          optimiser: [
            "Level 1: Understand and build algorithms",
            "Level 2: Select the right algorithms to solve a given problem"
          ],
          administrer: [
            "Level 1: Install and configure a workstation",
            "Level 2: Deploy services in a network architecture",
            "Level 3: Evolve and maintain a communicating information system in operational conditions"
          ],
          gerer: [
            "Level 1: Design and implement a database from a client specification",
            "Level 2: Optimize a database, interact with an application, and implement security"
          ],
          conduire: [
            "Level 1: Identify business needs of clients and users",
            "Level 2: Apply a project follow-up approach based on business needs of clients and users"
          ],
          collaborer: [
            "Level 1: Identify personal strengths for teamwork",
            "Level 2: Position your role and responsibilities within an IT team",
            "Level 3: Manage an IT team"
          ]
        }
      },
      projects: {
        title: "Projects",
        subtitle:
          "A selection of university, professional, and personal projects showing the practical application of skills gained during my university studies in computer science and my hands-on approach to systems and development.",
        filter: {
          title: "Filter by skill",
          bannerLabel: "Active filter:",
          reset: "Clear",
          active: "Active filter: {filters}"
        },
        empty: "No projects match the selected filters.",
        sections: {
          professional: "Professional projects",
          university: "University projects",
          personal: "Personal projects"
        },
        modal: {
          imageLabel: "View image {index} fullscreen",
          imageUnavailable: "Image unavailable",
          noImages: "No images available for this project."
        },
        cards: {
          autoCompletion: {
            title: "CERFA auto-completion",
            context: "Context: Company (Carington)",
            type: "Automation",
            description:
              "Development of a CERFA auto-completion system using client documents, with automated data extraction and processing.",
            tools: "Python, OCR, API, Linux",
            modalTitle: "CERFA auto-completion",
            modalText:
              "This application was developed in Python to automate the completion of CERFA forms using documents provided by the client (ID, proof of address, registration certificate, etc.).\n\nThe goal is to reduce processing time while limiting errors linked to manual data entry. Documents are analyzed via data extraction and OCR APIs, including Mindee, to automatically extract the required information (license plate number, VIN, new owner details...), which is then used to pre-fill the form.\n\nA preview allows the data to be checked before final validation. In addition, selecting the number of pages sent to the API helps control usage costs, ensuring a good balance between automation, human oversight, and budget optimization."
          },
          automation: {
            title: "Business process automation",
            context: "Context: Company (Carington)",
            type: "Automation",
            description:
              "Implementation of automation chains orchestrating multiple scripts and services to significantly reduce internal manual tasks.",
            tools: "Linux, scripting, scheduling, cron",
            modalTitle: "Business process automation",
            modalText:
              "This project focuses on designing and deploying automation processes aimed at reducing repetitive tasks and improving the reliability of internal business operations.\n\nScripts were developed and orchestrated to automate various actions (data processing, file management, conditional triggers, scheduling), integrating with existing tools and workflows.\n\nThe objective is to improve productivity, reduce human error, and ensure consistent and traceable execution of operations while maintaining appropriate supervision and control for business needs."
          },
          clubPhoto: {
            title: "Nailloux photo club",
            context: "Context: University",
            type: "Web development",
            description:
              "Development of a social-network-style web application for a photo club, with content management and user interactions.",
            tools: "Web, React, SQL, project management",
            modalTitle: "Facebook-like Nailloux photo club",
            modalText:
              "This project involves designing and developing a social network-style web application dedicated to a photo club.\n\nThe platform lets members manage their profiles, publish photos, interact through comments, and participate in club life within a collaborative space. Special attention was given to content organization and user interaction management.\n\nThe objective was to apply web development principles, data management, and teamwork while addressing a real need for communication and sharing within an association."
          },
          infrastructure: {
            title: "Multi-site network infrastructure deployment",
            context: "Context: University",
            type: "Systems and networking",
            description:
              "Design and deployment of a complete network infrastructure in an educational environment, including multiple sites, infrastructure services, and containerized application deployment.",
            tools: "Linux, network architecture, infrastructure services, containerization, Cisco equipment",
            modalTitle: "Multi-site network infrastructure deployment",
            modalText:
              "This project consists of designing and deploying a multi-site network infrastructure in an educational context.\n\nThe infrastructure implements network segmentation, centralized infrastructure services, and application deployment while ensuring communication between multiple sites. The project also includes configuring network equipment and systems to guarantee service availability and consistency.\n\nThe goal is to apply concepts in network architecture, system administration, and project management through teamwork that mirrors real-world constraints."
          },
          teamManagement: {
            title: "Sports team management application",
            context: "Context: University",
            type: "Web development",
            description:
              "Development of a fictitious web application for managing a sports team: members, matches, and statistics tracking.",
            tools: "HTML, CSS, PHP, SQL",
            modalTitle: "Sports team management application",
            modalText:
              "This project involves developing a web application dedicated to managing a sports team.\n\nThe application manages member profiles, match schedules, and individual and collective statistics. It centralizes essential information to facilitate organization and team follow-up.\n\nThe goal was to apply the basics of web development and data management while addressing a simple, structured functional need in an educational context."
          },
          personalInfrastructure: {
            title: "Secure personal server infrastructure",
            context: "Context: Personal",
            type: "Systems and networking",
            description:
              "Setup and administration of a personal server infrastructure including self-hosted services, storage, and access security mechanisms.",
            tools: "Linux, self-hosting, infrastructure services, systems security",
            modalTitle: "Secure personal server infrastructure",
            modalText:
              "This personal project focuses on setting up and administering a self-hosted server infrastructure at home, designed to provide various personal services.\n\nThe infrastructure includes NAS storage, a media server (Plex), and application services such as a Minecraft server. Services are organized and managed to ensure availability and proper operation.\n\nThis project helped me develop skills in system administration, managing self-hosted services, and configuring a server environment tailored to everyday use cases."
          }
        },
        toolsLabel: "Tools:"
      },
      contact: {
        title: "Contact",
        subtitle: "A simple form and my professional links.",
        form: {
          title: "Send a message",
          name: "Name",
          email: "Email",
          subject: "Subject",
          message: "Message",
          consent: "I agree to be contacted",
          submit: "Send",
          sent: "Message ready to be sent (feature disabled on this site)."
        },
        links: {
          title: "My links"
        }
      },
      cv: {
        title: "Resume",
        subtitle: "Downloadable resume. If the preview does not display, use the direct link.",
        download: "Download resume",
        fallback: "Unable to display the PDF. You can view it here:",
        open: "Open the resume"
      },
      notFound: {
        title: "Page not found",
        message: "The page you are looking for does not exist or has been moved.",
        back: "Back to home",
        helpTitle: "Need help?",
        helpText: "Use the menu to find the main sections of the portfolio."
      },
      lightbox: {
        aria: "Image viewer",
        close: "Close image",
        prev: "Previous image",
        next: "Next image",
        fallback: "Unable to load this image.",
        caption: "Image {index} / {total}",
        alt: "{title} - {index}"
      }
    }
  };

  const getNested = (obj, path) =>
    path.split(".").reduce((value, key) => (value ? value[key] : undefined), obj);

  let currentLang = DEFAULT_LANG;

  const t = (key, vars) => {
    const raw =
      getNested(translations[currentLang], key) ??
      getNested(translations[DEFAULT_LANG], key) ??
      key;

    if (typeof raw !== "string") {
      return raw;
    }

    return raw.replace(/\{(\w+)\}/g, (match, name) => {
      if (!vars || vars[name] === undefined) {
        return match;
      }
      return String(vars[name]);
    });
  };

  const get = (key) =>
    getNested(translations[currentLang], key) ?? getNested(translations[DEFAULT_LANG], key);

  const applyAttributeTranslation = (selector, attributeName, dataAttribute) => {
    document.querySelectorAll(selector).forEach((element) => {
      const key = element.getAttribute(dataAttribute);
      if (!key) {
        return;
      }
      const value = t(key);
      if (typeof value === "string") {
        element.setAttribute(attributeName, value);
      }
    });
  };

  const applyTranslations = () => {
    document.documentElement.lang = currentLang;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (!key) {
        return;
      }
      const value = t(key);
      if (typeof value === "string") {
        element.textContent = value;
      }
    });

    applyAttributeTranslation("[data-i18n-placeholder]", "placeholder", "data-i18n-placeholder");
    applyAttributeTranslation("[data-i18n-aria-label]", "aria-label", "data-i18n-aria-label");
    applyAttributeTranslation("[data-i18n-alt]", "alt", "data-i18n-alt");
    applyAttributeTranslation("[data-i18n-title]", "title", "data-i18n-title");
    applyAttributeTranslation("[data-i18n-value]", "value", "data-i18n-value");
    applyAttributeTranslation(
      "[data-i18n-data-modal-title]",
      "data-modal-title",
      "data-i18n-data-modal-title"
    );
    applyAttributeTranslation(
      "[data-i18n-data-modal-text]",
      "data-modal-text",
      "data-i18n-data-modal-text"
    );

    const toggle = document.querySelector("[data-lang-toggle]");
    if (toggle) {
      toggle.textContent = currentLang === "fr" ? "EN" : "FR";
      toggle.setAttribute("aria-label", t("langToggle.aria"));
    }
  };

  const setLang = (lang) => {
    if (!translations[lang]) {
      return;
    }
    currentLang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      // Ignore storage failures.
    }
    applyTranslations();
    document.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang } }));
  };

  const init = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && translations[stored]) {
        currentLang = stored;
      }
    } catch (error) {
      // Ignore storage failures.
    }

    applyTranslations();

    const toggle = document.querySelector("[data-lang-toggle]");
    if (toggle) {
      toggle.addEventListener("click", () => {
        setLang(currentLang === "fr" ? "en" : "fr");
      });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.i18n = {
    t,
    get,
    setLang,
    getLang: () => currentLang,
    applyTranslations
  };
})();
