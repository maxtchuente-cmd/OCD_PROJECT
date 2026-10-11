# OCD — Correctifs V9

## Changements
- Ajout des routes authentifiées PUT/PATCH/DELETE pour les propres opportunités du membre. Une offre publiée modifiée repasse en modération.
- Ajout du catalogue professionnel dans le formulaire Mon profil : ajout multiple, aperçu, statut de visibilité et suppression d’image.
- Le bouton « Soumettre mon profil à OCD » est masqué lorsque `review_status=approved`.
- Correction du tableau de modération : auteur provenant de `owner` et lieu composé de ville + pays.
- Ajout de règles CSS pour téléphones, tablettes et écrans de bureau.
- URLs lisibles pour les espaces membre et administration.

## IMPORTANT — après remplacement du code Laravel
Dans le dossier `backend`, exécuter :
```bash
php artisan route:clear
php artisan optimize:clear
php artisan route:list --path=api/v1/my/opportunities
php artisan storage:link
```
Vérifier que la sortie contient POST catalog, PUT/PATCH et DELETE. Si la route catalog reste en 404, le serveur PHP utilise un autre dossier/projet ou un autre port que celui mis à jour.

## Tests encore requis
Exécuter `npm ci` puis `npm run build` dans `frontend`, vérifier les migrations et tester les routes avec un compte membre réel. Les tests d’intégration et le build complet ne sont pas déclarés réussis sans cet environnement.
