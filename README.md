# Projet Avis - Next.js

Ce projet utilise **Next.js** avec un serveur Express pour intégrer l'authentification via **Azure OAuth2**. Il intègre également des fonctionnalités de session, un middleware de proxy, et des règles spécifiques pour l'accès administrateur.

## Prérequis

- Node.js v18.18.0 ou supérieur
- Environnement Node configuré pour les variables suivantes :
    - `AZURE_AD_CLIENT_ID`
    - `AZURE_AD_CLIENT_SECRET`
    - `AZURE_AD_TENANT_ID`
    - `Azure_callbackURL`
    - `proxyUrl`
    - `SESSION_SECRET`

## Installation

1. Clonez ce dépôt.

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement dans un fichier `.env` :
   ```env
   AZURE_AD_CLIENT_ID=your-client-id
   AZURE_AD_CLIENT_SECRET=your-client-secret
   AZURE_AD_TENANT_ID=your-tenant-id
   Azure_callbackURL=https://yourdomain.com/api/auth/callback/azure-ad
   proxyUrl=http://yourproxy.com
   SESSION_SECRET=your-session-secret
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
   ```

## Structure du projet

- **`server.js`** : Serveur Express qui gère les sessions, l'authentification via Passport.js, et les proxy pour les API externes.
- **`src/config/passport.js`** : Configuration de Passport avec Azure OAuth2, incluant la gestion des sessions et des cookies.
- **`src/config/route.js`** : Définit les routes d'authentification (connexion, déconnexion, callback).
- **`next.config.js`** : Configuration de Next.js avec des réécritures d'URL et des variables d'environnement.
- **`oauthConfig.js`** : Fichier contenant les configurations pour l'authentification Azure, y compris les clients ID et secret, ainsi que la liste des emails des administrateurs.
## Fonctionnalités

### 1. Authentification via Azure OAuth2
L'authentification est gérée via `passport-azure-oauth2`. Le middleware de session sauvegarde les informations de l'utilisateur après la connexion.

### 2. Gestion des sessions
Les sessions sont stockées dans **MemoryStore** avec une durée de vie des cookies de 60 minutes. Les informations utilisateur (email, nom de famille, prénom) sont également stockées dans la session.

### 3. Redirections et Routes
Le fichier `next.config.js` définit plusieurs réécritures, y compris une redirection vers `/signin` pour la page d'accueil, et `/not-found` pour les pages inexistantes.

## Scripts

- **Démarrage en développement** :
  ```bash
  npm run dev
  ```

- **Build pour la production** :
  ```bash
  npm run build
  ```

- **Démarrage en production** :
  ```bash
  npm run start
  ```
