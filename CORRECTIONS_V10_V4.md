# OCD — corrections V4

- Le tableau de bord admin définit désormais « profils validés et actifs » comme les profils `review_status = approved`, au lieu d'utiliser `users.updated_at` comme approximation d'activité.
- « Profils non validés » correspond au nombre de comptes non administrateurs moins les profils approuvés. Cela évite de confondre validation et présence en ligne réelle.
- Le profil membre conserve maintenant la structure de l'espace membre (sidebar, barre supérieure, zone centrale et footer) au lieu d'utiliser la page de compte séparée.
- L'aperçu et le fichier SVG du badge ont été simplifiés dans le style de la carte de référence : fond blanc, panneau anthracite, accent bleu cyan, identité OCD, photo/initiales, qualification, localisation et statut de validation.
- L'URL de la photo est mise à jour immédiatement après le téléversement pour refléter la photo dans le badge.

## Contrôles
- `php -l` sur AdminDashboardController.php : OK.
- Transpilation syntaxique TypeScript/JSX de AccountPage.tsx, MemberDashboard.tsx et AdminPage.tsx : OK.
- Build complet non confirmé : les dépendances locales manquent (`vite/client`). Les tests d'intégration base de données et navigateur doivent être faits dans l'environnement d'exécution.
