# OCD — Corrections de l’espace membre et de l’administration

## Espace membre

- Correction de la structure JSX de `MemberDashboard.tsx` : le formulaire de publication et le tableau d’historique sont deux panneaux valides dans le même onglet.
- Tableau de bord renommé, compteurs issus des données API et messages de chargement/erreur plus explicites.
- Favoris, notifications et candidatures continuent d’utiliser les routes privées de l’utilisateur connecté.
- L’historique « Mes opportunités » affiche le statut, la date, le motif de décision et le nombre réel de candidatures enregistrées.
- Pour une opportunité publiée par le membre, « Voir les candidats » ouvre une fenêtre listant les candidatures reçues et les coordonnées de contact disponibles. Le backend vérifie que l’offre appartient bien au membre connecté.
- Les catégories incluent désormais « Service » pour permettre aux membres de proposer des prestations. Un membre peut être candidat et publier des opportunités.

## Candidatures

- Une candidature est enregistrée en base par l’API, avec l’utilisateur, l’opportunité, le statut et la date. L’unicité utilisateur/opportunité empêche les doublons.
- Le clic de candidature enregistre d’abord la candidature OCD, puis ouvre le lien externe ou le contact téléphone/e-mail lorsqu’il existe.
- Un profil doit être approuvé pour candidater ; un membre ne peut pas candidater à sa propre annonce.
- Le propriétaire d’une annonce reçoit une notification lorsqu’une nouvelle candidature est enregistrée.
- Les candidatures sont comptées par relation Eloquent (`withCount('applications')`), et non par valeur fictive.

## Administration

- « Vue d’ensemble » devient « Tableau de bord ».
- La publication admin ouvre une fenêtre modale. Après publication immédiate, l’interface bascule vers « Toutes les offres & signalements » afin de retrouver l’offre qui vient d’être créée.
- « Toutes les offres & signalements » liste toutes les offres, y compris publiées, en attente, refusées, suspendues ou archivées, avec l’auteur, le lieu et le nombre réel de candidatures.
- Les candidats d’une offre sont consultables depuis le tableau. Cette route est réservée aux administrateurs.
- Le changement de statut passe par une modale ; un motif est obligatoire pour un refus, une suspension ou une demande de correction. Le membre reçoit une notification et le changement est journalisé.
- La modération des profils et offres utilise également une modale pour recueillir le motif.
- « Textes du site » et « Témoignages » sont séparés par onglets. L’édition des textes et l’ajout d’un témoignage s’effectuent dans des modales.
- Les témoignages soumis par le public restent non publiés jusqu’à validation administrative.
- Les migrations de base de données du squelette Laravel vérifient désormais l’existence des tables avant de les créer.

## Vérifications effectuées

- Les 70 fichiers PHP du backend passent `php -l`.
- Une vérification de parsing TypeScript/JSX des pages modifiées ne relève pas d’erreur de syntaxe JSX.
- La compilation complète `npm run build` n’a pas pu être exécutée dans l’environnement de préparation : les dépendances npm ne sont pas présentes et l’accès au registre npm a échoué (`EAI_AGAIN`). Le projet doit donc encore être compilé dans l’environnement de développement Windows où les dépendances sont installées.
- Les tests d’intégration Laravel et la migration réelle n’ont pas pu être exécutés ici, car le dossier `backend/vendor` n’est pas présent. Il faut tester avec la base de données de développement avant toute mise en production.
