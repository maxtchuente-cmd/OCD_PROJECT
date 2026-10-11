# OCD — V1 : Fondation et identité

## Objectif
Mettre en place la première interface publique OCD, ses fondations de code réutilisable et les conventions de travail avant d'implémenter les comptes, opportunités réelles et fonctions métier.

## Périmètre livré
- Accueil public responsive (mobile, tablette, ordinateur), identité orange OCD.
- Navigation responsive avec menu mobile.
- Recherche d'interface par mots-clés, catégorie et pays sur des données de démonstration.
- Sections catégories, aperçu des opportunités, mise en avant des talents et présentation OCD.
- Notifications discrètes pour signaler clairement les fonctions qui seront livrées dans les versions suivantes.
- Composant SVG `Icon` réutilisable.
- Données de démonstration séparées dans `src/data/homeData.ts`.
- Client HTTP centralisé et contrat de service opportunités préparés pour l'API versionnée.
- Accessibilité de base : labels pour lecteurs d'écran, focus clavier visible et prise en compte de `prefers-reduced-motion`.

**Important :** les annonces visibles en V1 sont des exemples d'interface et ne doivent pas être présentées comme des offres réelles ou vérifiées. Les boutons de connexion, compte, favoris et fiches complètes indiquent leur future disponibilité, sans simuler une authentification réelle.

## Organisation frontend

```text
frontend/src/
  assets/                 # Logo et médias
  components/ui/          # Composants UI partagés (Icon...)
  data/                   # Données de démonstration et constantes
  pages/                  # Pages regroupées par usage
  services/api/           # Client HTTP commun et gestion des erreurs
  services/               # Services métier appelant l'API
  App.tsx                 # Point d'entrée des pages
  App.css                 # Styles de la page publique V1
  index.css               # Tokens globaux, typographie, reset
```

## Architecture cible backend

Le backend reste Laravel avec une API REST sous `/api/v1`. Chaque fonctionnalité métier doit être développée de façon isolée et cohérente :

1. Migration idempotente autant que possible : vérifier l'existence d'une table/colonne avant création ou modification, et prévoir `down()` propre.
2. Modèle Eloquent : relations, casts, fillable/guarded et scopes utiles.
3. Form Request pour valider les entrées lorsque nécessaire.
4. Service métier seulement lorsque la logique doit être réutilisée ou dépasse la responsabilité du contrôleur.
5. Contrôleur fin : validation via Request, appel au service, réponse API cohérente.
6. Resource API pour normaliser les réponses JSON.
7. Middleware uniquement pour une responsabilité transversale (authentification, permissions, limitation de débit, etc.).
8. Routes regroupées et versionnées ; pas de logique métier dans les fichiers de routes.
9. Stockage séparé public/privé selon la sensibilité ; ne jamais exposer les documents de vérification privés.
10. Tests de validation, permissions, cas nominaux et erreurs avant de considérer un module terminé.

Les migrations doivent être relues avant `php artisan migrate`. Une vérification d'existence évite certaines erreurs de réexécution, mais ne remplace pas la conception correcte des migrations ni une sauvegarde de base de données.

## Contrat frontend
- Une page orchestre les sections, mais ne doit pas contenir toute la logique de données métier.
- Les appels réseau passent par `services/api/httpClient.ts`.
- Les appels d'un domaine passent par son service dédié (ex. `opportunityService`).
- Les composants partagés restent indépendants des pages autant que possible.
- Les états de chargement, vide, succès et erreur doivent être explicites lors de la connexion aux API.
- Les données venant du serveur ne doivent jamais être confondues avec les données de démonstration.

## Lancer le frontend

```bash
cd frontend
npm ci
cp .env.example .env.local
npm run dev
```

Pour construire la version de production :

```bash
npm run build
```

`VITE_API_BASE_URL` configure l'URL du backend, par défaut `http://localhost:8000/api/v1`.

## Cinq versions
- **V1 — Fondation et identité :** expérience publique, composants communs, conventions, architecture et documentation.
- **V2 — Comptes et profils :** inscription, connexion, rôles, permissions, profils, compétences et référentiels géographiques.
- **V3 — Opportunités :** publications réelles, filtres API, détails, favoris, candidatures et suivi.
- **V4 — Talents et confiance :** répertoire professionnel, portfolios, contacts, vérifications et carte OCD avec QR code.
- **V5 — Exploitation :** administration, modération, notifications, audit, sécurité, tests et mise en production.

Chaque version doit être validée avant d'élargir le périmètre.
