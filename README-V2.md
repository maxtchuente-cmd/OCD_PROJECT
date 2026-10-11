# OCD — Version 2

V2 builds on V1 and adds account creation/login, personal profiles, international reference lists, professional categories, skills and work experience.

## Stack
- Backend: Laravel 13 / PHP 8.3+, Laravel Sanctum personal access tokens
- Frontend: React + TypeScript + Vite
- Existing frontend remains the public landing page; the “Mon espace” action opens the V2 account/profile area.

## Backend setup
1. `cd backend`
2. Copy `.env.example` to `.env` and configure the database.
3. `composer install`
4. `php artisan key:generate`
5. `php artisan migrate`
6. `php artisan db:seed`
7. `php artisan serve`

API base: `http://127.0.0.1:8000/api/v1`

Endpoints:
- `POST /auth/register` — account + initial profile
- `POST /auth/login` — Sanctum bearer token
- `GET /auth/me`, `POST /auth/logout` — authenticated session
- `GET /references/countries`
- `GET /references/languages`
- `GET /references/professional-categories`
- `GET /references/skills?q=...`
- `GET /profile`, `PUT /profile`
- `POST /profile/experiences`, `DELETE /profile/experiences/{id}`

New migrations check for existing tables/columns before creating or adding them. The reference seeder uses `updateOrCreate` / `firstOrCreate` and can be run repeatedly. The sample reference list is deliberately small starter data; extend it with a maintained international dataset before production.

## Frontend setup
1. `cd frontend`
2. `npm ci`
3. Copy `.env.example` to `.env` if needed and set `VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1`.
4. `npm run dev`

For local development, start Laravel and Vite in separate terminals. The account screens call the real API; they do not silently fall back to fake authentication.

## V2 scope and limitations
Included: account registration/login/logout, role-intent account type, initial profile, profile editing, country/category references, public profile preference, work availability and experience CRUD API. The public profile toggle is stored as a preference; public profile discovery is part of a later version. Email verification, password reset, avatar upload, complete ISO country/city dataset, advanced permissions and moderation are not yet implemented.

## Development rules
Keep API calls in `src/services/api`, domain logic in services, validation in Form Requests, response shaping in Resources, and controllers thin. Add one guarded migration per domain concern, then model, request/resource/service/controller/routes, then frontend API service/page/components. Do not commit `.env`, tokens or local database files.
