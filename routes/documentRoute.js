import { Router } from 'express';
import { join, dirname } from 'path'; // Assurez-vous que cette ligne est décommentée
import fs from 'fs';
import path from 'path'
// import * as fs from 'fs';

// const path = require('path');
const router = Router();

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get('/files', (req, res) => {
    const directoryPath = path.join(__dirname, req.query.path);

    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return res.status(500).send({
                message: "Unable to scan files!",
                error: err
            });
        }
        // Filtre pour retirer les fichiers cachés si nécessaire
        files = files.filter(file => !file.startsWith('.'));
        res.send(files);
    });
});

router.get('/', async (req, res) => {
    var mesfichiers = {};
    var allfiles = [];
    var path = '..';
    await fetch(`http://localhost:3000/document/files?path=${encodeURIComponent(path)}`)
    .then(response => response.json())
    .then(files => {
        allfiles = files;
        files.forEach(filename => {
            if (!(filename.includes('.'))) { // si dossier
                if (!("folder" in mesfichiers)) {
                    mesfichiers['folder'] = [];
                }
                mesfichiers['folder'].push(filename);
            }
            else { // si extension
                var splitting = filename.split('.');
                var extension = splitting[1];
                if (!(extension in mesfichiers)) {
                    mesfichiers[extension] = [];
                }
                mesfichiers[extension].push(filename);
            }
        });
    //   console.log('Fichiers et dossiers:', mesfichiers);
      // Traitez ici la liste des fichiers et dossiers
    })
    .catch(error => console.error('Erreur lors de la récupération des fichiers:', error));
    // console.log("Et sinon :", mesfichiers);

    res.render('document', { fichiers : allfiles, path: path});
  });
  

export default router;
