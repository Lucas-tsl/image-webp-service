const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

// Multer config : plusieurs fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Route de test pour vérifier l'état du serveur
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0'
  });
});

app.post('/upload', upload.array('images', 10), async (req, res) => {
  // Vérifier si des fichiers ont été envoyés
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ 
      error: 'Aucun fichier envoyé',
      message: 'Veuillez sélectionner au moins une image'
    });
  }

  try {
    const quality = parseInt(req.body.quality) || 70;
    const format = req.body.format || 'webp';

    const convertedImages = [];
    const conversionResults = [];

    for (const file of req.files) {
      const inputPath = file.path;
      const inputStats = fs.statSync(inputPath);
      const baseName = path.parse(file.originalname).name;
      const outputName = `${baseName}.${format}`;
      const outputPath = path.join('uploads', outputName);

      // Choisir le bon format de sortie
      let image = sharp(inputPath);
      switch (format) {
        case 'avif':
          image = image.avif({ quality });
          break;
        case 'jpeg':
          image = image.jpeg({ quality });
          break;
        default:
          image = image.webp({ quality });
      }

      await image.toFile(outputPath);
      
      const outputStats = fs.statSync(outputPath);
      const compressionRatio = ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(1);

      fs.unlinkSync(inputPath);

      convertedImages.push(`/uploads/${outputName}`);
      conversionResults.push({
        original: file.originalname,
        converted: outputName,
        originalSize: (inputStats.size / 1024 / 1024).toFixed(2),
        convertedSize: (outputStats.size / 1024 / 1024).toFixed(2),
        compressionRatio: compressionRatio,
        url: `/uploads/${outputName}`
      });
    }

    // HTML de retour moderne
    const resultCards = conversionResults.map(result => `
      <div class="result-card">
        <div class="result-image">
          <img src="${result.url}" alt="${result.converted}">
        </div>
        <div class="result-info">
          <h3>${result.converted}</h3>
          <div class="size-info">
            <span class="original-size">${result.originalSize} MB</span>
            <span class="arrow">→</span>
            <span class="converted-size">${result.convertedSize} MB</span>
            <span class="compression">${result.compressionRatio}% de compression</span>
          </div>
          <a href="${result.url}" download="${result.converted}" class="download-btn">
            💾 Télécharger
          </a>
        </div>
      </div>
    `).join('');

    res.send(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Conversion terminée</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          
          h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
            font-size: 2.2em;
          }
          
          .results-grid {
            display: grid;
            gap: 20px;
            margin-bottom: 30px;
          }
          
          .result-card {
            display: flex;
            align-items: center;
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          
          .result-image {
            flex-shrink: 0;
            margin-right: 20px;
          }
          
          .result-image img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
          }
          
          .result-info {
            flex: 1;
          }
          
          .result-info h3 {
            color: #333;
            margin-bottom: 10px;
          }
          
          .size-info {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
            font-size: 0.9em;
          }
          
          .original-size {
            color: #666;
          }
          
          .arrow {
            color: #667eea;
            font-weight: bold;
          }
          
          .converted-size {
            color: #28a745;
            font-weight: 600;
          }
          
          .compression {
            color: #667eea;
            font-weight: 500;
          }
          
          .download-btn {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 0.9em;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          
          .download-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
          }
          
          .actions {
            display: flex;
            gap: 15px;
            justify-content: center;
          }
          
          .action-btn {
            display: inline-block;
            padding: 12px 24px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          
          .back-btn {
            background: #f8f9fa;
            color: #333;
            border: 2px solid #e0e0e0;
          }
          
          .back-btn:hover {
            background: #e9ecef;
            border-color: #667eea;
          }
          
          .download-all-btn {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
          }
          
          .download-all-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
          }
          
          @media (max-width: 600px) {
            .result-card {
              flex-direction: column;
              text-align: center;
            }
            
            .result-image {
              margin-right: 0;
              margin-bottom: 15px;
            }
            
            .size-info {
              flex-direction: column;
              gap: 5px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✅ Conversion terminée</h1>
          
          <div class="results-grid">
            ${resultCards}
          </div>
          
          <div class="actions">
            <a href="/" class="action-btn back-btn">⬅ Nouvelle conversion</a>
            <a href="/download-all" class="action-btn download-all-btn">📦 Télécharger tout</a>
          </div>
        </div>
      </body>
      </html>
    `);

  } catch (err) {
    console.error(err);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Erreur de conversion</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          
          .error-container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 400px;
          }
          
          h1 {
            color: #dc3545;
            margin-bottom: 20px;
          }
          
          .back-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 10px;
            font-weight: 600;
            display: inline-block;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="error-container">
          <h1>❌ Erreur</h1>
          <p>Une erreur est survenue lors de la conversion des images.</p>
          <a href="/" class="back-btn">⬅ Retour</a>
        </div>
      </body>
      </html>
    `);
  }
});

// Route pour télécharger toutes les images converties dans un ZIP
app.get('/download-all', (req, res) => {
  const uploadsDir = path.join(__dirname, 'uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    return res.status(404).send('Aucun fichier à télécharger');
  }

  const files = fs.readdirSync(uploadsDir).filter(file => 
    file.endsWith('.webp') || file.endsWith('.avif') || file.endsWith('.jpeg') || file.endsWith('.jpg')
  );

  if (files.length === 0) {
    return res.status(404).send('Aucun fichier à télécharger');
  }

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename=images-converties.zip');

  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  archive.on('error', (err) => {
    console.error('Erreur lors de la création du ZIP:', err);
    res.status(500).send('Erreur lors de la création du ZIP');
  });

  archive.pipe(res);

  files.forEach(file => {
    const filePath = path.join(uploadsDir, file);
    archive.file(filePath, { name: file });
  });

  archive.finalize();
});

app.listen(PORT, () => {
  console.log(`✅ Serveur actif sur http://localhost:${PORT}`);
});
