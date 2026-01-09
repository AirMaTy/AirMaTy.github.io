const revealTargets = document.querySelectorAll(".reveal");

if (revealTargets.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((target) => observer.observe(target));
}

const copyButton = document.querySelector("[data-copy]");
if (copyButton) {
  copyButton.addEventListener("click", () => {
    const text = copyButton.getAttribute("data-copy");
    if (!text) {
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      copyButton.textContent = "Copié";
      setTimeout(() => {
        copyButton.textContent = "Copier";
      }, 1600);
    });
  });
}

const focusableSelectors =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
const modalCallbacks = new Map();
const modalState = {
  activeModal: null,
  activeTrigger: null
};

const getFocusableElements = (modal) =>
  Array.from(modal.querySelectorAll(focusableSelectors)).filter(
    (element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true"
  );

const openModal = (modal, trigger) => {
  if (!modal) {
    return;
  }

  if (modalState.activeModal && modalState.activeModal !== modal) {
    closeModal(modalState.activeModal);
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  modalState.activeModal = modal;
  modalState.activeTrigger = trigger || null;

  if (trigger) {
    trigger.setAttribute("aria-expanded", "true");
  }

  const focusable = getFocusableElements(modal);
  const focusTarget = focusable[0] || modal.querySelector(".modal__content");

  if (focusTarget) {
    focusTarget.focus();
  }
};

const closeModal = (modal) => {
  if (!modal) {
    return;
  }

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");

  const onClose = modalCallbacks.get(modal);
  if (onClose) {
    onClose();
  }

  if (modalState.activeModal === modal) {
    const trigger = modalState.activeTrigger;
    modalState.activeModal = null;
    modalState.activeTrigger = null;

    if (trigger) {
      trigger.setAttribute("aria-expanded", "false");
      trigger.focus();
    }
  }
};

const registerModal = (modal, { onClose } = {}) => {
  if (!modal) {
    return;
  }

  if (onClose) {
    modalCallbacks.set(modal, onClose);
  }

  modal.querySelectorAll("[data-modal-close]").forEach((button) => {
    button.addEventListener("click", () => closeModal(modal));
  });
};

document.addEventListener("keydown", (event) => {
  if (!modalState.activeModal) {
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    closeModal(modalState.activeModal);
    return;
  }

  if (event.key !== "Tab") {
    return;
  }

  const focusable = getFocusableElements(modalState.activeModal);
  if (focusable.length === 0) {
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

const levelModal = document.querySelector("#levels-modal");
const modalBody = document.querySelector("[data-modal-body]");
const modalTitle = document.querySelector("#modal-title");
const levelTriggers = document.querySelectorAll("[data-level-trigger]");

const competenceLevels = {
  realiser: [
    "Niveau 1: Développer des applications informatiques simples",
    "Niveau 2: Partir des exigences et aller jusqu’à une application complète",
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
    "Niveau 1: Concevoir et mettre en place une base de données à partir d’un cahier des charges client",
    "Niveau 2: Optimiser une base de données, interagir avec une application et mettre en œuvre la sécurité"
  ],
  conduire: [
    "Niveau 1: Identifier les besoins métiers des clients et des utilisateurs",
    "Niveau 2: Appliquer une démarche de suivi de projet en fonction des besoins métiers des clients et des utilisateurs"
  ],
  collaborer: [
    "Niveau 1: Identifier ses aptitudes pour travailler dans une équipe",
    "Niveau 2: Situer son rôle et ses missions au sein d’une équipe informatique",
    "Niveau 3: Manager une équipe informatique"
  ]
};

const yearLabels = {
  1: "BUT 1",
  2: "BUT 2",
  3: "BUT 3"
};

if (levelModal && modalBody && modalTitle) {
  registerModal(levelModal, {
    onClose: () => {
      modalBody.innerHTML = "";
      levelTriggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
    }
  });

  levelTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const competenceKey = trigger.getAttribute("data-competence");
      const year = Number(trigger.getAttribute("data-year"));
      const levels = competenceLevels[competenceKey] || [];
      const maxLevels = Math.min(year, levels.length);
      const yearLabel = yearLabels[year] || "";

      modalTitle.textContent = `${trigger.closest(".competence-card")?.querySelector("h3")?.textContent || ""} — ${yearLabel}`;
      modalBody.innerHTML = "";

      levels.slice(0, maxLevels).forEach((text) => {
        const levelItem = document.createElement("div");
        levelItem.className = "modal__level";
        levelItem.textContent = text;
        modalBody.appendChild(levelItem);
      });

      openModal(levelModal, trigger);
    });
  });
}

const projectModal = document.querySelector("#project-modal");
const projectModalTitle = document.querySelector("#project-modal-title");
const projectModalText = document.querySelector("[data-project-modal-text]");
const projectModalGallery = document.querySelector("[data-project-modal-gallery]");
const projectTriggers = document.querySelectorAll("[data-project-trigger]");

if (projectModal && projectModalTitle && projectModalText && projectModalGallery) {
  registerModal(projectModal, {
    onClose: () => {
      projectModalTitle.textContent = "";
      projectModalText.textContent = "";
      projectModalGallery.innerHTML = "";
    }
  });

  projectTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const card = trigger.closest(".project-card");
      if (!card) {
        return;
      }

      const title = card.dataset.modalTitle || card.querySelector("h3")?.textContent || "";
      const text = card.dataset.modalText || "";
      const images = (card.dataset.modalImages || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      projectModalTitle.textContent = title;
      projectModalText.textContent = text;
      projectModalGallery.innerHTML = "";

      if (images.length > 0) {
        images.forEach((src) => {
          const figure = document.createElement("div");
          figure.className = "modal__gallery-item";
          const image = document.createElement("img");
          image.src = src;
          image.alt = title;
          figure.appendChild(image);
          projectModalGallery.appendChild(figure);
        });
      } else {
        const placeholders = 3;
        for (let index = 0; index < placeholders; index += 1) {
          const placeholder = document.createElement("div");
          placeholder.className = "modal__gallery-item placeholder";
          placeholder.textContent = "Image à venir";
          projectModalGallery.appendChild(placeholder);
        }
      }

      openModal(projectModal, trigger);
    });
  });
}

const contactForm = document.querySelector("[data-contact-form]");
const formMessage = document.querySelector("[data-form-message]");

if (contactForm && formMessage) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.textContent = "Message prêt à être envoyé (fonctionnalité désactivée sur ce site).";
    contactForm.reset();
  });
}

const projectsRoot = document.querySelector("[data-projects-root]");
const filterBanner = document.querySelector("[data-filter-banner]");
const filterLabel = document.querySelector("[data-filter-label]");
const clearFilterButton = document.querySelector("[data-clear-filter]");
const filterControls = document.querySelector("[data-filter-controls]");
const emptyMessage = document.querySelector("[data-empty-message]");

const normalize = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
const competenceOrder = [
  "Réaliser",
  "Optimiser",
  "Administrer",
  "Gérer",
  "Conduire",
  "Collaborer"
];

const updateUrl = (values) => {
  const url = new URL(window.location.href);
  if (values.length === 0) {
    url.searchParams.delete("competences");
  } else {
    url.searchParams.set("competences", values.join(","));
  }
  window.history.replaceState({}, "", url.toString());
};

const applyProjectFilter = (values) => {
  if (!projectsRoot) {
    return;
  }

  const cards = Array.from(projectsRoot.querySelectorAll(".project-card"));
  const sections = Array.from(projectsRoot.querySelectorAll("[data-project-section]"));
  const normalized = values.map(normalize);

  if (normalized.length === 0) {
    cards.forEach((card) => {
      card.hidden = false;
    });

    sections.forEach((section) => {
      section.hidden = false;
    });

    if (emptyMessage) {
      emptyMessage.hidden = true;
    }

    if (filterBanner && filterLabel) {
      filterBanner.classList.remove("active");
      filterLabel.textContent = "Filtre actif :";
    }

    return;
  }

  cards.forEach((card) => {
    const tags = (card.dataset.competences || "")
      .split(",")
      .map((item) => normalize(item))
      .filter(Boolean);
    const matches =
      normalized.every((value) => tags.includes(value));
    card.hidden = !matches;
  });

  sections.forEach((section) => {
    const visibleCards = section.querySelectorAll(".project-card:not([hidden])");
    section.hidden = visibleCards.length === 0;
  });

  const hasResults = cards.some((card) => !card.hidden);

  if (emptyMessage) {
    if (!hasResults && values.length > 0) {
      emptyMessage.textContent = "Aucun projet n'est disponible avec ces filtres.";
    }
    emptyMessage.hidden = hasResults || values.length === 0;
  }

  if (filterBanner && filterLabel) {
    filterBanner.classList.add("active");
    filterLabel.textContent = `Filtre actif : ${values.join(", ")}`;
  }
};

if (projectsRoot && filterControls) {
  const checkboxes = Array.from(filterControls.querySelectorAll("input[type=checkbox]"));
  const params = new URLSearchParams(window.location.search);
  const initial = params.get("competences")
    ? params
        .get("competences")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
    : [];

  checkboxes.forEach((checkbox) => {
    checkbox.checked = initial.includes(checkbox.value);
  });

  applyProjectFilter(initial);

  const sortCompetences = (values) =>
    values
      .slice()
      .sort((a, b) => competenceOrder.indexOf(a) - competenceOrder.indexOf(b));

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const selected = checkboxes.filter((input) => input.checked).map((input) => input.value);
      const sorted = sortCompetences(selected);
      applyProjectFilter(sorted);
      updateUrl(sorted);
    });
  });

  if (clearFilterButton) {
    clearFilterButton.addEventListener("click", () => {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
      applyProjectFilter([]);
      updateUrl([]);
    });
  }
}
