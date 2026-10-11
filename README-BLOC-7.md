# OCD — Bloc 7 : administration active, publications et statistiques

## Correctif Vite du Bloc 6
Le chemin de la feuille de style dans `frontend/src/pages/AccountPage.tsx` est corrigé :
`import '../workspace.css'`
La feuille existe dans `frontend/src/workspace.css`, donc elle doit être importée depuis `pages/` avec `../`.

## Fonctionnalités ajoutées / consolidées
- L'administrateur peut publier directement des offres d'emploi, bourses, formations, financements, missions, concours ou autres opportunités. Les publications administrateur sont immédiatement publiées.
- Les champs d'une publication couvrent le titre, l'organisation, le type, le pays, la ville, le mode à distance, le résumé, la description, les conditions, les avantages, le lien de candidature, le contact et la date limite.
- Tableau de bord avec le nombre de membres, d'offres publiées, d'offres en attente, de candidatures cette semaine et ce mois-ci.
- Historique récent des candidatures avec le nom du membre, son e-mail, l'offre, la catégorie, la date et le statut.
- Répartition des candidatures par catégorie.
- Répertoire administrateur des membres avec filtres par nom/e-mail, pays, ville, domaine professionnel et statut de validation du profil.
- Les annonces publiques peuvent être filtrées par mot-clé, catégorie, pays, ville, type et disponibilité à distance via l'API.
- Le répertoire membres et les statistiques sont derrière le middleware `can:manage-ocd`.

## Mise à jour
1. Sauvegardez votre fichier `.env` et votre base de données avant de remplacer les fichiers.
2. Décompressez l'archive puis ouvrez `OCD PROJECT`.
3. Backend : dans `backend`, exécutez `php artisan optimize:clear`, puis `php artisan serve`.
4. Frontend : dans `frontend`, exécutez `npm install` si nécessaire, puis `npm run dev`.
5. Si Vite conserve l'ancien message d'import, arrêtez le serveur avec `Ctrl+C`, relancez `npm run dev` et rechargez la page.

## Validation et limites connues
Les fichiers PHP modifiés ont passé `php -l`. Le build frontend n'a pas pu être validé dans l'environnement de préparation : les dépendances locales présentes étaient incomplètes (`vite/client` et les types Node manquaient). Dans votre dossier local, exécutez `npm install` puis `npm run build` et communiquez toute nouvelle erreur exacte.

## Prochain bloc
Le Bloc 8 doit apporter la gestion éditoriale persistante des textes de la page publique, des appels à l'action et des témoignages, puis relier ces éléments au site public. Le Bloc 9 approfondira les rapports et les filtres de gestion; le Bloc 10 sera réservé à l'intégration et aux tests finaux.
