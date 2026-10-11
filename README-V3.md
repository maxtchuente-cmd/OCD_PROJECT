# OCD — Version 3

V3 builds on V2. It adds real opportunity discovery and detail pages, opportunity submission for review, candidate applications, profile moderation, an administration review area, avatar upload, and an ISO country reference dataset (249 countries/territories).

## Architecture
- Backend: Laravel 13, Sanctum bearer tokens, guarded migrations, domain models, thin API controllers, API resources, storage for profile photos, and Gate-protected administration routes.
- Frontend: React + TypeScript + Vite. Public pages use the real published-opportunity API instead of hard-coded sample listings. The account area supports login/register/profile completion and routes admin accounts to a review dashboard.
- Public profile discovery returns only profiles with `review_status=approved`, `is_public=true`, and a profile photo.
- Applications require an authenticated non-organization user with an approved profile. Duplicate applications are prevented by a unique database constraint.
- Opportunities created through the API start at `pending_review`. Only an OCD administrator can publish them.

## Backend setup
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve
```
Set `VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1` in `frontend/.env`.

## Frontend setup
```bash
cd frontend
npm ci
npm run dev
```

## Important endpoints
Public:
- `GET /api/v1/opportunities?q=&category=&country=&page=1&per_page=12`
- `GET /api/v1/opportunities/{slug}`
- `GET /api/v1/profiles?q=`
- `GET /api/v1/references/countries`

Authenticated:
- `POST /api/v1/profile/avatar` (multipart field `avatar`)
- `POST /api/v1/profile/submit-review`
- `POST /api/v1/opportunities` (new opportunity starts in review)
- `GET /api/v1/my/opportunities`
- `POST /api/v1/opportunities/{slug}/apply`
- `GET /api/v1/my/applications`

Administrator (`users.account_type = admin`):
- `GET /api/v1/admin/profiles/review-queue`
- `POST /api/v1/admin/profiles/{id}/review` with `decision=approved|rejected` and optional `note`
- `GET /api/v1/admin/opportunities/review-queue`
- `POST /api/v1/admin/opportunities/{id}/review` with `decision=published|rejected` and optional `note`

## Creating the first administrator
Do not expose an administrator role in public registration. Create a normal account, then change its role through a controlled database/admin procedure, for example in SQLite:
```sql
UPDATE users SET account_type = 'admin' WHERE email = 'trusted-admin@example.com';
```
Replace the example email with the trusted account. Keep the database private. Never commit the real `.env` or credentials.

## Profile review lifecycle
`draft` → `pending` → `approved` or `rejected`. Submitting requires a public name, professional title, country, bio and photo. The profile is hidden from public search until approved. Editing an approved profile or replacing its photo removes public visibility and returns it to review.

## Verification status
- PHP syntax checks pass for the application, route, migration and seeder files.
- Full Laravel migrations/tests were not run in this packaging environment because Composer dependencies are not installed.
- Frontend production build was attempted but could not complete because `vite/client` and `@types/node` were unavailable after dependency installation timed out. Run `npm ci` in a normal network-enabled development environment and then `npm run build`.
- Before production: configure HTTPS, mail delivery, backup/retention, file validation and virus scanning, audit logs, administrator account provisioning, privacy/consent text, and integration tests.
