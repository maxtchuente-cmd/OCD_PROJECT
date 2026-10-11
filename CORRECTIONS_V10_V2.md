# OCD — Corrections V10 (révision 2)

## Modifications apportées

- Correction et vérification syntaxique des composants `MemberDashboard.tsx`, `PublicHomePage.tsx` et `AccountPage.tsx`.
- Le formulaire de publication d'une opportunité dans l'espace membre s'ouvre dans une modale. Le formulaire de profil s'ouvre également dans une modale au-dessus du tableau de bord.
- Les membres dont le profil est approuvé peuvent télécharger un badge numérique SVG depuis le tableau de bord et depuis leur profil. Il s'agit d'un badge visuel de statut, pas d'une certification officielle ni d'une preuve cryptographique.
- Lorsqu'une opportunité est ouverte, le frontend consulte les candidatures et les opportunités du membre connecté pour afficher « Déjà candidaté » ou « C'est votre offre » lorsque l'information est disponible.
- Les erreurs de candidature HTTP 403 sont présentées avec le message renvoyé par le backend. L'API précise que le profil doit être approuvé, qu'un compte organisation ne peut pas candidater, ou que le propriétaire ne peut pas candidater à sa propre annonce.
- Le backend reconnaît une candidature existante avant de contrôler à nouveau l'approbation du profil, afin de renvoyer le statut « déjà candidaté » plutôt qu'une erreur de profil pour une candidature déjà enregistrée.
- Après une candidature valide, OCD enregistre la candidature et notifie le propriétaire. Les coordonnées et liens de contact restent accessibles depuis l'annonce ; le système distingue l'enregistrement OCD de la prise de contact externe.
- Les propriétaires d'offres publiées peuvent consulter les candidatures enregistrées et les coordonnées de contact renseignées par les candidats.
- Ajout d'une section « À propos » à la page publique, basée sur le document fourni : philosophie OCD, fondateur (sans inventer de biographie), mission, vision internationale, quatre piliers, valeurs, confiance et manifeste.

## Contrôles réalisés

- Vérification syntaxique TypeScript/JSX des trois composants modifiés avec l'API de transpilation TypeScript : aucune erreur de syntaxe détectée.
- `php -l` sur les fichiers PHP du backend : aucune erreur de syntaxe détectée.
- La compilation Vite complète, les tests d'intégration Laravel et les scénarios réels en base de données restent à exécuter dans l'environnement Windows du projet, car l'installation des dépendances frontend n'a pas abouti dans l'environnement de préparation.

## Vérification locale conseillée

1. Décompresser le projet, puis dans `frontend`, lancer `npm ci`, puis `npm run build` et `npm run dev`.
2. Dans `backend`, installer les dépendances avec Composer si nécessaire, configurer `.env`, puis lancer `php artisan migrate`.
3. Tester au minimum : profil non approuvé (403 avec message clair), profil approuvé, candidature répétée, candidature sur sa propre offre, publication d'une offre, réception et consultation des candidatures, clic sur e-mail/téléphone/lien externe, téléchargement du badge après approbation et refus de téléchargement avant approbation.

## Révision administration / statistiques / notifications
- Le tableau de bord administratif expose désormais des séries quotidiennes sur 7 jours pour les candidatures et les nouvelles inscriptions, une répartition par statut, des compteurs pour les témoignages et les notifications, ainsi qu'un indicateur d'activité de compte sur 30 jours.
- Attention : « actif sur 30 jours » est un indicateur basé sur `users.updated_at`, pas une mesure de présence en ligne en temps réel. Un vrai indicateur de connexion nécessitera un heartbeat `last_seen_at`.
- Les témoignages prennent en charge une note de 1 à 5 étoiles. La vue publique affiche les étoiles et un avatar rond généré à partir des initiales; le texte est protégé contre les débordements.
- Le formulaire de profil est maintenant une page dédiée et non une fenêtre modale. Le badge a une présentation de carte professionnelle OCD avec identité, photo/initiales, qualification, localisation et validation. Il est téléchargeable en SVG; l'impression de la page permet de l'enregistrer en PDF via le navigateur.
- Les préférences e-mail sont collectées à l'inscription. Les notifications OCD générées sont envoyées par e-mail si le membre l'a autorisé; lors de la publication d'une nouvelle opportunité, les membres inscrits aux alertes sont notifiés.
- L'envoi réel d'e-mails dépend obligatoirement de la configuration SMTP/Mail dans le `.env` du serveur. Les tests SMTP réels n'ont pas pu être exécutés dans cet environnement.
- Une migration conditionnelle ajoute la note des témoignages et les préférences e-mail sans recréer les tables existantes.
