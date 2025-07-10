# Image Webp Service - Convertisseur d'images

Une application web moderne pour la compression et la conversion d'images en différents formats (WebP, AVIF, JPEG).

![Capture d'écran de l'application](screenshots/app-preview.png)

## 🌟 Fonctionnalités

- 🖼️ Conversion d'images en WebP, AVIF et JPEG
- 🎛️ Contrôle de la qualité de compression (1-100)
- 📥 Interface drag & drop pour téléchargement facile
- 📱 Interface responsive pour mobile et desktop
- 🔍 Prévisualisation des images avant conversion
- 💾 Téléchargement individuel ou groupé des images converties

## 🚀 Technologies utilisées

- Frontend : HTML5, CSS3, JavaScript (Vanilla)
- Backend : Node.js, Express
- Traitement d'images : Sharp
- Gestion des fichiers : Multer

## ⚙️ Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/votre-username/image-webp-service.git
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

## 🔧 Configuration avancée

Le serveur peut être configuré en modifiant les variables suivantes dans `server.js` :
- `PORT` : Port d'écoute du serveur (par défaut : 3000)
- Le dossier de téléchargement peut être modifié dans la configuration Multer

## 🤝 Contributions

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## 📄 Licence

Ce projet est sous licence ISC - voir le fichier LICENSE pour plus de détails.
