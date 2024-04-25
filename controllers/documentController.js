import { dirname, join } from 'path'; // Assurez-vous que cette ligne est décommentée
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function fileList(req, res) {
    const directoryPath = join(__dirname, req.query.path);

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
};

// Renvoie la page principale des docs
// avec les fichiers/dossiers à affichier et le chemin actuel
export async function home(req, res) {

    var mesfichiers = {}; // clef = extension ; valeur = fichiers
    var allfiles = [];
    var path = '..'; // Chemin de départ

    await fetch(`http://localhost:3000/document/fileList?path=${encodeURIComponent(path)}`)
    .then(response => response.json())
    .then(filesInDirectory => {
        allfiles = filesInDirectory;
        filesInDirectory.forEach(filename => {
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
      // Traitez ici la liste des fichiers et dossiers
    })
    .catch(error => console.error('Erreur lors de la récupération des fichiers:', error));

    console.log("Fichiers dans le dossier :", { fichiers : allfiles, path: path});

    res.render('document', { fichiers : allfiles, path: path});
};

const documentCtrl = {
    fileList,
    home
  };
  
  export default documentCtrl;