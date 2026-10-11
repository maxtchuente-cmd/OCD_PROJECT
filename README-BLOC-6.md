# OCD — Bloc 6 : CORS et espaces connectés

## Correctif CORS
Le frontend utilise maintenant le jeton Bearer `ocd_access_token` et n'envoie plus `credentials: 'include'` sur les requêtes API centralisées. Le backend possède aussi une configuration CORS explicite qui autorise `http://localhost:5173` et `http://127.0.0.1:5173`, avec `supports_credentials=false`. Cela supprime le conflit entre `credentials: include` et une origine wildcard.

Si vous choisissez ultérieurement une authentification par cookies, il faudra au contraire configurer une origine explicite (`http://localhost:5173`), activer les credentials côté Laravel et aligner le mécanisme CSRF. Ne mélangez pas les deux stratégies.

## Lancer en local
1. Backend : dans `backend`, copier `.env.example` vers `.env`, renseigner la base de données, puis exécuter `composer install`, `php artisan key:generate`, `php artisan migrate` et `php artisan serve`.
2. Frontend : dans `frontend`, exécuter `npm install` puis `npm run dev`.
3. Ouvrir l'adresse Vite indiquée dans le terminal, habituellement `http://localhost:5173`.
4. API par défaut : `http://localhost:8000/api/v1`. Pour changer l'adresse, créer `frontend/.env` avec `VITE_API_BASE_URL=http://localhost:8000/api/v1`, puis redémarrer Vite.

Utilisez une seule variante de nom d'hôte dans vos réglages (`localhost` ou `127.0.0.1`) et évitez de mélanger des URLs d'API de production et de développement.

## Accès
- **Public** : ouvrir la page d'accueil sans se connecter.
- **Membre/candidat** : cliquer sur « Mon espace », créer un compte ou se connecter. Le tableau de bord propose vue d'ensemble, favoris, notifications, candidatures, suivi des opportunités et accès au profil.
- **Administrateur** : créer un compte normal, puis dans `backend` exécuter `php artisan ocd:make-admin votre-email@example.com`, confirmer, puis se déconnecter/reconnecter. Le menu admin est protégé par les permissions API côté serveur.

## Inclus dans ce bloc
- Suppression de `credentials: 'include'` sur le client API centralisé, cohérente avec l'authentification Bearer.
- Tableau de bord membre connecté aux API existantes : favoris, notifications, candidatures et opportunités propres.
- Sidebar, navbar, footer communs et responsive pour l'espace membre.
- Sidebar, navbar, footer cohérents pour l'espace d'administration.
- Liens profil, site public et déconnexion.

## Limites connues
- Le formulaire complet de création d'opportunité et les écrans d'administration des signalements restent à terminer dans les blocs suivants.
- L'archive doit être testée dans l'environnement local avec vos dépendances et votre base. Le tableau de bord tolère les erreurs individuelles d'API et affiche une erreur globale si tous les appels échouent.
- L'avertissement React DevTools est informatif. Le message WebSocket Vite lié au Back-Forward Cache est distinct du problème CORS.
