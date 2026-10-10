# OCD Frontend

Frontend React + TypeScript pour OCD — Opportunités, c'est dehors.

## Développement

```bash
npm ci
cp .env.example .env.local
npm run dev
```

## Scripts
- `npm run dev` : serveur de développement Vite
- `npm run build` : vérification TypeScript et compilation de production
- `npm run lint` : analyse statique

## Configuration
`VITE_API_BASE_URL` désigne l'API Laravel versionnée, par défaut `http://localhost:8000/api/v1`.

## Structure
- `src/pages/` : pages
- `src/components/ui/` : composants partagés
- `src/data/` : données de démonstration et constantes
- `src/services/api/` : client HTTP centralisé
- `src/services/` : services métier

Les offres affichées actuellement sont des données de démonstration, pas des annonces réelles.
