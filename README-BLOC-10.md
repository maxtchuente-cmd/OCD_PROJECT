# OCD — Bloc 10 (intégration des publications, modération et contacts)

## Changements
- Correction de l'import CSS Vite dans `AccountPage.tsx` (`../workspace.css`).
- Ajout du champ `contact_phone` pour les offres, avec migration additive protégée par `Schema::hasTable` et `Schema::hasColumn`.
- Le créateur d'une offre doit fournir au moins un lien de candidature, une adresse e-mail ou un numéro de téléphone.
- Formulaire de publication d'offre dans l'espace membre et tableau de l'historique des annonces du membre avec leur statut.
- Publication admin avec numéro de téléphone; les offres créées par l'administrateur restent publiées immédiatement.
- Numéro et e-mail de contact visibles dans la fiche publique de l'offre.
- Tableau administrateur pour les profils à valider et les offres à modérer, avec auteur et actions de validation/refus.
- Témoignage public soumis via formulaire, conservé en attente de validation; l'administrateur peut valider/publier ou dépublier/supprimer les témoignages dans un tableau.
- Limitation de débit de l'API publique de témoignages (5 envois par minute par IP, selon la configuration Laravel).

## Mise à jour
Sauvegardez `.env` et la base de données. Dans `backend` :

```bash
php artisan migrate
php artisan optimize:clear
php artisan serve
```

Dans `frontend` :

```bash
npm install
npm run build
npm run dev
```

## Vérifications effectuées
- Syntaxe PHP contrôlée sur le contrôleur d'offres, le contrôleur de contenu, les routes API et la migration ajoutée.
- L'archive doit être testée dans votre environnement local avec `npm run build` et les parcours réels de candidature/modération.
- La compilation TypeScript/Vite n'a pas pu être exécutée dans l'environnement de préparation, l'installation npm ayant expiré. Ne considérez donc pas la compilation front comme certifiée tant que `npm run build` n'a pas réussi localement.
