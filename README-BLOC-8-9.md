# OCD — Blocs 8 et 9 : contenu public et administration avancée

## Bloc 8 — Textes et témoignages
- Administration > **Textes et témoignages**.
- Personnalisation de l’annonce du haut de page, du titre et du texte d’accueil, du texte d’orientation et du titre de clôture.
- Ajout, publication/dépublication et suppression de témoignages.
- API publique `GET /api/v1/site-content` pour les textes et témoignages publiés.
- API admin protégée par `auth:sanctum` et `can:manage-ocd`.

## Bloc 9 — Gestion opérationnelle
- Administration > **Gestion avancée**.
- Liste des offres avec filtres texte, catégorie, statut, pays et ville.
- Nombre de candidatures par offre.
- Mise à jour du statut d’une offre : publiée, en attente, refusée, suspendue, archivée ou corrections demandées.
- File des signalements et décision de classement sans suite ou prise de mesure, avec note de traitement.
- Les statistiques de semaine/mois et les candidatures récentes sont également visibles dans le tableau de bord administrateur.

## Installation
1. Sauvegarder `.env` et la base de données.
2. Depuis `backend`, exécuter `php artisan migrate` puis `php artisan optimize:clear`.
3. Lancer `php artisan serve`.
4. Depuis `frontend`, exécuter `npm install` puis `npm run dev`.
5. Vérifier la compilation avec `npm run build`.

La migration ajoute `site_contents` et `testimonials` en vérifiant l’existence des tables avant création. Les fonctions d’administration restent protégées par les middleware existants.
