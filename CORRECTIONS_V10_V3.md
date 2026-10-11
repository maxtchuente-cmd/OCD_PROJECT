# OCD V10 — Révision 4 (correctifs ciblés)

## Changements
- Carte professionnelle OCD téléchargeable même si le profil n’est pas approuvé ; la carte indique explicitement « activé/validé » ou « désactivé/non validé ». La carte SVG inclut nom, qualification, localisation, photo ou initiales, logo/identité OCD et statut.
- Le profil reste une page dédiée avec en-tête fixe, retour au tableau de bord et pied de page cohérent avec l’espace membre.
- Ajout d’un graphique circulaire avec légende pour la répartition des statuts de candidatures dans l’administration, en complément des graphiques en barres.
- Ajout du lien « Témoignages » dans la navigation publique et d’un ancrage vers les témoignages publiés. Ajustements de débordement des textes et avatars.
- Configuration SMTP Gmail préparée dans `backend/.env.example` avec l’adresse expéditrice fournie. Aucun mot de passe n’est inclus.

## Activation Gmail obligatoire
Dans `backend/.env`, configurer `MAIL_MAILER=smtp`, `MAIL_HOST=smtp.gmail.com`, `MAIL_PORT=587`, `MAIL_SCHEME=tls`, `MAIL_USERNAME=travail20262025@gmail.com`, `MAIL_PASSWORD` avec un mot de passe d’application Google, et `MAIL_FROM_ADDRESS=travail20262025@gmail.com`. Créer le mot de passe d’application depuis les paramètres de sécurité Google avec la validation en deux étapes activée. Ne jamais utiliser le mot de passe normal du compte ni le committer dans Git ou l’archive. Puis exécuter `php artisan config:clear`.

## Limites de validation
Les fichiers TSX ont été passés au transpileur TypeScript pour contrôle de syntaxe et les fichiers PHP au linter PHP. Le build complet du frontend, les tests Laravel, l’envoi SMTP réel et les parcours navigateur ne peuvent être certifiés ici sans dépendances, configuration serveur et compte de test. L’impression PDF dépend du navigateur (« Enregistrer au format PDF ») ; l’export natif du badge est en SVG.
