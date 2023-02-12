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

### Client

#### Installation

Si vous n'avez pas de dossier node_modules dans votre dossier `client` vous devez :
- Dans le dossier racine exécuter la commande suivante : `yarn workspace client install`

Si après que vous avez pull depuis gitlab et que vous avez des problèmes d'importation faite la même chose

#### Lancement

Pour lancer le client il faut soit : 
- Se rendre sur `./apps/client`, puis exécuter la commande suivante : `yarn run start`
 OU
- Dans le dossier racine exécuter la commande suivante : `yarn workspace client run start`

### Backend

#### Installation

Si vous n'avez pas de dossier node_modules dans votre dossier `backend` vous devez :
- Dans le dossier racine exécuter la commande suivante : `yarn workspace backend install`

Si après que vous avez pull depuis gitlab et que vous avez des problèmes d'importation faite la même chose

#### Lancement

Pour lancer le backend il faut soit : 
- Se rendre sur `./apps/backend`, puis exécuter la commande suivante : `yarn run start`
 OU
- Dans le dossier racine exécuter la commande suivante : `yarn workspace backend run start`

### Consignes

