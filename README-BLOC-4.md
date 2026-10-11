# OCD — Bloc 4 : Engagement membre et confiance

Ce bloc ajoute six capacités métier cumulatives à la base V3 :
1. Favoris d'opportunités avec unicité par membre et annonce.
2. Centre de notifications internes avec compteur non lu et action de lecture.
3. Cycle de modération plus complet : publiée, refusée, compléments demandés, suspendue.
4. Historique des décisions de modération des opportunités.
5. Signalement des opportunités par les membres et file de traitement administrative.
6. Suspension d'une annonce publiée après un signalement traité avec action, avec notification au propriétaire.
7. Filtres pays/catégorie sur la file de modération.
8. Service frontend typé pour favoriser, signaler et lire les notifications.

## API ajoutée
- `GET /api/v1/my/saved-opportunities`
- `POST /api/v1/opportunities/{id}/save`
- `DELETE /api/v1/opportunities/{id}/save`
- `GET /api/v1/my/notifications`
- `POST /api/v1/my/notifications/{id}/read`
- `POST /api/v1/reports` (authentifié)
- `GET /api/v1/admin/reports/review-queue`
- `POST /api/v1/admin/reports/{id}/resolve`

La décision de modération d'une annonce accepte maintenant `published`, `rejected`, `changes_requested` ou `suspended`. Un motif est obligatoire pour le refus, la demande de complément ou la suspension. Les routes d'administration restent protégées par `can:manage-ocd`.

## Installation et vérification
Depuis `backend` :
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan test
```
Depuis `frontend` :
```bash
npm ci
npm run build
```

## Limites explicites
- Ce bloc ajoute les API et le service frontend. Les écrans visuels dédiés aux favoris, notifications et signalements doivent être raccordés dans le bloc d'interface suivant.
- Le signalement des profils renvoie volontairement une réponse non prise en charge : le modèle polymorphe est préparé, mais le workflow de signalement des profils sera activé après stabilisation de la modération des annonces.
- Le contrôle syntaxique PHP ne remplace pas les tests d'intégration sur une base de test. Effectuer les migrations et tester chaque parcours avant toute production.
