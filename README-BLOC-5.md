# OCD — Bloc 5 : accès aux espaces et administration initiale

Ce bloc documente l’accès aux trois espaces et ajoute une commande Artisan explicite pour promouvoir un compte existant en administrateur. L’inscription publique ne permet toujours pas de choisir le rôle admin.

Voir `ACCES_OCD.md` pour les étapes exactes de démarrage et de connexion.

## Travaux de ce bloc
1. Documenter l’accès à l’espace public.
2. Documenter l’inscription et la connexion des membres.
3. Documenter le parcours de profil et la soumission à validation.
4. Ajouter la commande `ocd:make-admin {email}` avec confirmation interactive.
5. Vérifier que la commande refuse les e-mails inconnus.
6. Vérifier qu’une promotion n’est pas effectuée sans confirmation.
7. Expliquer l’accès à l’administration après reconnexion.
8. Documenter les limites fonctionnelles restantes et les prérequis d’installation.

## Contrôles
Les fichiers PHP ont été relus statiquement. Les tests Laravel, migrations sur une base réelle et compilation Vite doivent encore être exécutés dans un environnement disposant des dépendances installées. Ne pas considérer ce bloc comme certifié de bout en bout.
