# Portfolio BUT Informatique

Gabarit React minimaliste (thème sombre) pour constituer un portfolio professionnel de BUT Informatique. Il inclut une page principale (one-page) et une page "Autres compétences" accessible sans rechargement.

## Démarrer

```bash
npm install
npm run dev
```

Pour générer une version statique prête à être publiée (GitHub Pages par exemple) :

```bash
npm run build
```

## Déploiement GitHub Pages

Le workflow GitHub Actions `Deploy to GitHub Pages` construit automatiquement le site et publie le dossier `dist` sur GitHub Pages à chaque push sur les branches `work` ou `main`. Vérifiez que Pages est activé dans les paramètres du dépôt et pointé vers la source "GitHub Actions". Le site est configuré avec `base: '/'` pour un dépôt `username.github.io`.

## Personnalisation rapide
- Mettre à jour les données dans `src/App.jsx` (projets, expériences, compétences, autres compétences).
- Remplacer l’image du portrait (`/assets/photo-profil.jpg`).
- Adapter les liens de CV et de profils publics dans les composants `Hero`, `CVSection` et `Contact`.
