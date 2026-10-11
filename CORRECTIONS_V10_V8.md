# OCD V8 — corrections fonctionnelles

## Correctifs
- Ajout de la route authentifiée `POST /api/v1/my/opportunities/{opportunity}/catalog` utilisée lors de la création d'une offre avec des images justificatives. Elle appelle `OpportunityController::uploadCatalog` et vérifie que l'offre appartient au membre connecté.
- Ajout des routes authentifiées `POST /api/v1/profile/catalog` et `DELETE /api/v1/profile/catalog/{image}` pour le catalogue professionnel.
- La recherche publique des talents charge désormais `/api/v1/profiles?per_page=24` au chargement, avec filtres nom/métier, ville, pays et domaine, affichage des catalogues et pagination par huit cartes.
- Les opportunités ont des filtres complémentaires par pays, ville et domaine/spécialité; les onglets de catégorie continuent à filtrer les résultats.
- L'état favori est chargé pour un membre connecté; le cœur s'affiche plein pour les offres déjà enregistrées et permet de retirer le favori.
- Suppression de la boîte de confirmation répétitive lors de la connexion administrateur : un compte `admin` ouvre directement l'administration.
- Ajout d'un lien fonctionnel « Ouvrir mon espace membre » depuis l'administration.

## Contrôles effectués
- `php -l` sur les fichiers PHP du backend : réussi.
- Transpilation syntaxique TypeScript/JSX des fichiers `PublicHomePage.tsx`, `AccountPage.tsx` et `AdminPage.tsx` : réussie.
- Intégrité ZIP : vérifiée.
- Build complet Vite/TypeScript et tests d'intégration non exécutés : `frontend/node_modules` est absent et aucune base/instance Laravel n'est connectée dans cet environnement.

## Après installation
1. Exécuter `php artisan route:list --path=api/v1/my/opportunities` et vérifier la route `catalog`.
2. Vérifier `php artisan storage:link` et les permissions de `storage/app/public`.
3. Lancer `npm ci` puis `npm run build` dans `frontend`.
4. Tester avec un compte membre : créer une offre avec images, puis vérifier que l'offre et les images sont visibles après validation administrative.
5. Tester la recherche publique avec au moins un profil approuvé, public, avec photo et images de catalogue.
