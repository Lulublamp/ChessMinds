### ORGANISATION 

- Quand on veut ajouter une page, on crée un dossier avec le nom de la page, et on y met un fichier 

LeNomDeLaPage.tsx et un fichier LeNomDeLaPage.css

- Pour l'utiliser quelque part d'autre dans l'application, on importe le fichier `import LeNomDeLaPage from ${X}/LeNomDeLaPage/LeNomDeLaPage` X étant le chemin vers le dossier de la page donc si on veut l'utiliser dans le dossier `src` on met `./pages/LeNomDeLaPage/LeNomDeLaPage` et si on veut l'utiliser dans le dossier `src/pages` on met `./LeNomDeLaPage/LeNomDeLaPage`

- Il faut toujours avoir quelque chose à exporter dans le fichier `LeNomDeLaPage.tsx` sinon ça ne marche pas
