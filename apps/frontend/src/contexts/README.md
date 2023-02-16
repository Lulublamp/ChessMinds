### ORGANISATION 

- Quand on veut ajouter un context, on crée un fichier : `NomDuContext.tsx`

- Pour l'utiliser quelque part d'autre dans l'application, on importe le fichier `import {LeNomDuContext} from ${X}/ContextProviders` X étant le chemin vers le dossier de la page donc si on veut l'utiliser dans le dossier `src` on met `./contexts/ContextProviders` et si on veut l'utiliser dans le dossier `src/pages` on met `../contexts/ContextProviders`

- Exemple d'utilisation : Voir `WindowContextProvider.tsx`

- Si vous créer un context, pensez à l'exporter dans le fichier `ContextProviders.tsx` pour l'importer en module