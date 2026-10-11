# Accéder aux trois espaces OCD

## 1. Espace public
- Démarrer Laravel depuis `backend` : `php artisan serve`.
- Démarrer le frontend depuis `frontend` : `npm run dev`.
- Ouvrir l’adresse affichée par Vite, généralement `http://localhost:5173/`.
- C’est l’accueil public. Les boutons de connexion et d’inscription ouvrent le parcours de compte.

## 2. Espace membre / candidat
- Depuis le site public, cliquer sur **Mon espace** ou **Connexion**.
- Pour un nouveau membre, choisir **Créer un compte**, remplir le formulaire et confirmer le mot de passe.
- Après connexion, le formulaire **Mon profil** permet de compléter les informations, ajouter la photo, enregistrer puis soumettre le profil à validation OCD.
- Un membre ordinaire ne peut pas accéder à l’administration. Les favoris, notifications et signalements disposent d’API, mais leurs pages dédiées doivent encore être raccordées dans un bloc ultérieur.

## 3. Espace administration OCD
Pour des raisons de sécurité, l’inscription publique ne permet pas de choisir le rôle administrateur. Il faut promouvoir explicitement un compte existant depuis le terminal du backend.

1. Créer d’abord un compte normal via **Créer un compte** dans le site public.
2. Dans un terminal, se placer dans le dossier `backend`.
3. Exécuter : `php artisan ocd:make-admin adresse@example.com` en remplaçant l’adresse par celle du compte voulu.
4. Confirmer l’opération quand la commande le demande.
5. Se déconnecter puis se reconnecter avec ce compte depuis **Mon espace**.
6. Le compte ayant le rôle `admin` est dirigé vers l’interface **Administration**, qui présente les files de validation des profils et des opportunités.

Ne jamais promouvoir un compte public sans vérifier l’identité et l’autorisation de son propriétaire. Ne pas exposer cette commande à une route web.

## Prérequis
- Configurer `.env` et la base de données dans `backend`.
- Installer les dépendances avec `composer install` et `npm ci` dans les dossiers respectifs.
- Exécuter `php artisan migrate --seed` dans `backend`.
- Si les requêtes frontend ne rejoignent pas Laravel, vérifier `VITE_API_BASE_URL` dans le fichier `.env` du frontend. Par défaut : `http://localhost:8000/api/v1`.

## Limites de l’état actuel
L’espace public et le parcours compte/profil sont présents. L’administration est accessible après connexion avec le rôle `admin`. Cette archive ne prétend pas que toutes les pages de favoris, notifications et signalements sont terminées ; elles nécessitent encore un raccordement frontend et des tests de bout en bout. Exécuter les tests et les migrations dans un environnement de développement avant toute mise en production.
