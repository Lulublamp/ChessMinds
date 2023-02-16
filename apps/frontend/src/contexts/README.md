### ORGANISATION 

- Quand on veut ajouter un context, on crée un fichier : `NomDuContext.tsx`

- Pour l'utiliser quelque part d'autre dans l'application, on importe le fichier `import LeNomDeLaPage from ${X}/LeNomDuContext` X étant le chemin vers le dossier de la page donc si on veut l'utiliser dans le dossier `src` on met `./contexts/LeNomDuContext` et si on veut l'utiliser dans le dossier `src/pages` on met `../contexts/LeNomDuContext`

- Exemple d'utilisation : Voir `WindowContextProvider.tsx`