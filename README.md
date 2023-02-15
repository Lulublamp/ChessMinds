# Projet Integrateur

Monorepo initié avec [Turborepo]

### Apps et Packages

- `backend`: [NestJs](https://docs.nestjs.com/) - Apps
- `client`: Electron + React + Typescript app - Apps
- `core`: Algorithme du jeu en Typescript - Packages
- `eslint-config-custom`: Configurations `eslint` - Packages
- `tsconfig`: Configurations Typescript `tsconfig.json` - Packages

Pour la premier pull:
- Dans le dossier racine exécuter la commande suivante : `yarn install`

### Description

Le projet est divisé en 4 parties :
- Le client qui est une application Electron qui utilise notre application React
- le frontend qui est une application React qui permet de gérer l'interface graphique
- Le backend qui est une application NestJs qui permet de gérer les parties
- Le core qui est un package qui contient l'algorithme du jeu

### Initialisation

#### Prérequis

- [NodeJs](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)
- [Turborepo](https://turborepo.com/)

#### Installation

Si vous n'avez pas de dossier node_modules dans votre dossier racine vous devez :
- `yarn install`

Si après que vous avez pull depuis gitlab et que vous avez des problèmes d'importation faites la même chose

Après pour chaque dossier (client, backend, core , frontend) vous devez faire la même chose :
- `yarn workspace @TRPI/--nom du dossier-- install`

Exemple : `yarn workspace @TRPI/client install`

Egalement si vous voulez lancer une commande dans un dossier en particulier :
- Depuis le dossier racine `yarn workspace @TRPI/--nom du dossier-- run --nom de la commande--` 
Exemple : `yarn workspace @TRPI/client run start`

- Depuis le dossier en question `yarn run --nom de la commande--`
Exemple : `yarn run start` dans le dossier `client`

### Lancement

#### Client

- Depuis le dossier racine `yarn workspace @TRPI/client run start`
- Depuis le dossier client `yarn run start`

#### Frontend

- Depuis le dossier racine `yarn workspace @TRPI/frontend run dev`
- Depuis le dossier frontend `yarn run dev`

#### Backend

- Depuis le dossier racine `yarn workspace @TRPI/backend run start`
- Depuis le dossier backend `yarn run start`

