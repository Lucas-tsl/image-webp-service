# 🎨 Image Webp Service - Convertisseur d'images

Une application web moderne pour la compression et la conversion d'images en différents formats (WebP, AVIF, JPEG).

<!-- Remplacez cette ligne par une capture d'écran réelle de votre application -->
<!-- ![Capture d'écran de l'application](screenshots/app-preview.png) -->
> ℹ️ *Note: Pensez à ajouter une capture d'écran de l'application dans le dossier `/screenshots` nommée `app-preview.png`*

[![Déployé sur Vercel](https://img.shields.io/badge/Déployé%20sur-Vercel-black?style=for-the-badge&logo=vercel)](https://image-webp-service-euhf1c8xa-lucas-tsls-projects.vercel.app)
[![Version](https://img.shields.io/badge/Version-1.0.2-blue?style=for-the-badge)](https://github.com/Lucas-tsl/image-webp-service)
[![Licence](https://img.shields.io/badge/Licence-ISC-green?style=for-the-badge)](LICENSE)

## 🌟 Fonctionnalités

- 🖼️ Conversion d'images en WebP, AVIF et JPEG
- 🎛️ Contrôle de la qualité de compression (1-100)
- 📥 Interface drag & drop pour téléchargement facile
- 📱 Interface responsive pour mobile et desktop
- 🔍 Prévisualisation des images avant conversion
- 💾 Téléchargement individuel ou groupé des images converties

## 🚀 Technologies utilisées

- **Frontend** : HTML5, CSS3, JavaScript (Vanilla)
- **Backend** : Node.js, Express
- **Traitement d'images** : Sharp
- **Gestion des fichiers** : Multer
- **Compression** : Archiver (pour la création de ZIP)
- **Déploiement** : Vercel

## ⚙️ Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/Lucas-tsl/image-webp-service.git
   cd image-webp-service
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Lancez l'application :
   ```bash
   npm start
   ```

4. Accédez à l'application dans votre navigateur à l'adresse :
   ```
   http://localhost:3000
   ```

## 📖 Comment utiliser

1. Ouvrez l'application dans votre navigateur
2. Glissez-déposez des images ou cliquez sur la zone de téléchargement
3. Ajustez la qualité de compression (1-100)
4. Sélectionnez le format de sortie souhaité (WebP, AVIF, JPEG)
5. Cliquez sur "Convertir les images"
6. Téléchargez les images converties individuellement ou en lot

## 🔒 Gestion du cache navigateur

L'application implémente plusieurs mécanismes pour éviter les problèmes de cache :

### Au niveau du serveur

Le serveur Express utilise des en-têtes HTTP pour désactiver le cache :

```javascript
// Middleware pour désactiver le cache pour tous les fichiers statiques
app.use((req, res, next) => {
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  res.header('Surrogate-Control', 'no-store');
  next();
});
```

### Au niveau HTML

Les pages HTML incluent des méta-tags pour empêcher la mise en cache :

```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
```

### Version de page avec localStorage

L'application utilise localStorage pour vérifier les versions des pages et forcer le rechargement si nécessaire :

```javascript
// Version de cette page - à modifier quand la page est mise à jour
const PAGE_VERSION = '1.0.2';
// Stockage de la version en local
localStorage.setItem('pageVersion', PAGE_VERSION);
```

Si vous rencontrez des problèmes de cache, essayez :
- Utiliser le mode incognito du navigateur
- Vider le cache du navigateur (Ctrl+Shift+Suppr)
- Ajouter un paramètre aléatoire à l'URL (ex: `?t=123456`)

## 🔧 Configuration avancée

Le serveur peut être configuré en modifiant les variables suivantes dans `server.js` :
- `PORT` : Port d'écoute du serveur (par défaut : 3000)
- Le dossier de téléchargement peut être modifié dans la configuration Multer

## 🌐 Déploiement sur Vercel

L'application est prête à être déployée sur Vercel. Un fichier `vercel.json` est inclus pour configurer correctement le déploiement.

### Configuration pour Vercel

L'application gère automatiquement la différence entre les environnements de développement et de production :
- En développement local : les fichiers sont stockés dans le dossier `uploads/`
- Sur Vercel : les fichiers sont stockés dans le répertoire temporaire `/tmp`

```javascript
// Vérifier si nous sommes en production (Vercel) ou en développement local
const isProduction = process.env.NODE_ENV === 'production';
// Définir le répertoire d'uploads selon l'environnement
const UPLOAD_DIR = isProduction ? '/tmp' : 'uploads';
```

### Étapes de déploiement

1. **Installer l'outil CLI Vercel** :
   ```bash
   npm install -g vercel
   ```

2. **Déployer l'application** :
   ```bash
   vercel
   ```

3. **Pour les déploiements de production** :
   ```bash
   vercel --prod
   ```

### Limitations de Vercel

- Les fichiers uploadés sont stockés temporairement dans `/tmp` et ne persisteront pas entre les requêtes
- Pour un stockage permanent des images, il est recommandé d'intégrer un service comme AWS S3, Google Cloud Storage ou Cloudinary

### Application déployée

L'application est actuellement déployée à l'adresse :
[https://image-webp-service-euhf1c8xa-lucas-tsls-projects.vercel.app](https://image-webp-service-euhf1c8xa-lucas-tsls-projects.vercel.app)

## 📁 Structure du projet

```
image-webp-service/
├── LICENSE             # Fichier de licence
├── README.md           # Ce fichier
├── package.json        # Dépendances et scripts npm
├── Procfile            # Configuration pour Heroku (si utilisé)
├── vercel.json         # Configuration pour Vercel
├── server.js           # Serveur Express principal
├── public/             # Fichiers statiques
│   ├── index.html      # Page principale de l'application
│   └── ...             # Autres fichiers HTML/CSS/JS
├── screenshots/        # Captures d'écran pour la documentation
└── uploads/            # Dossier pour les fichiers uploadés (local)
```

## 🤝 Contributions

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## 📄 Licence

Ce projet est sous licence ISC - voir le fichier LICENSE pour plus de détails.
