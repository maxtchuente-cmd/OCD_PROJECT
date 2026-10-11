# OCD — Catalogues de réalisations et justificatifs

## Fonctionnalités ajoutées
- Les membres peuvent ajouter plusieurs images à leur catalogue professionnel depuis leur profil (JPG, PNG, WebP, 5 Mo maximum par image, jusqu'à 12 images par envoi).
- Les images du profil restent privées tant que le profil n'est pas approuvé. Lors de l'approbation, le catalogue est rendu public; lors d'un refus, il reste privé.
- Les publications d'opportunités demandent un catalogue d'images justificatives; les images sont visibles au public seulement après publication approuvée.
- L'administration peut ouvrir les images de catalogue/justificatifs dans les files de validation.
- Le site public affiche les catalogues des talents approuvés et les images des opportunités publiées, avec une recherche de talent par nom, métier, ville ou pays et des filtres de catégories d'opportunités.

## Mise en place backend
1. Sauvegarder la base de données et les fichiers `storage` avant déploiement.
2. Installer les dépendances PHP avec Composer sur le serveur de déploiement.
3. Configurer `.env` (base de données, APP_URL, stockage public et mail si utilisé).
4. Exécuter `php artisan migrate --force` : la migration `2026_10_11_000900_create_catalog_images.php` utilise un garde `Schema::hasTable`.
5. Exécuter `php artisan storage:link` si le lien public n'existe pas.
6. Vérifier que le serveur web peut écrire dans `storage/app/public` et que la limite d'upload PHP est compatible (au moins 5 Mo par fichier; plusieurs fichiers peuvent nécessiter une limite de requête supérieure).
7. Construire le frontend (`npm ci` puis `npm run build`) et publier le dossier `dist` selon la configuration du serveur.

## Contrôles obligatoires avant mise en production
- Tester les téléversements avec un compte membre et vérifier les limites de taille/type.
- Soumettre un profil avec catalogue, l'approuver, vérifier que les images sont publiques; tester aussi le refus et confirmer que les images ne sont pas visibles.
- Créer une opportunité avec images, vérifier que les images restent privées en attente, puis publier et vérifier l'affichage public.
- Tester permissions, suppression de compte, sauvegarde/restauration, HTTPS et politique de conservation des images.
- Les contrôles syntaxiques ne remplacent pas les tests d'intégration sur la base et le serveur réels.
