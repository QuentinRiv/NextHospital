import { dirname, join } from "path"; // Assurez-vous que cette ligne est décommentée
import { fileURLToPath } from "url";
import fs from "fs";
import Document from "../models/Document.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function fileList(req, res) {
  const directoryPath = join(__dirname, req.query.path);

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return res.status(500).send({
        message: "Unable to scan files!",
        error: err,
      });
    }
    // Filtre pour retirer les fichiers cachés si nécessaire
    files = files.filter((file) => !file.startsWith("."));
    var filesAndClass = [];
    var codeExtension = [".py", ".js", ".html", ".css", ".ejs", ".c"];
    var imageExtension = [".png", ".jpeg", ".jpg", ".svg"];

    var folders = files.filter((file) => !file.includes("."));
    var notFolders = files.filter((file) => file.includes("."));

    folders.forEach((fileName) => {
      filesAndClass.push({
        fileName: fileName,
        fileType: "fa-solid fa-folder-open",
      });
    });

    notFolders.forEach((fileName) => {
      if (codeExtension.some((extension) => fileName.includes(extension))) {
        filesAndClass.push({
          fileName: fileName,
          fileType: "fa-solid fa-file-code",
        });
      } else if (
        imageExtension.some((extension) => fileName.includes(extension))
      ) {
        filesAndClass.push({
          fileName: fileName,
          fileType: "fa-solid fa-file-image",
        });
      } else {
        filesAndClass.push({
          fileName: fileName,
          fileType: "fa-solid fa-file",
        });
      }
    });
    res.send(filesAndClass);
  });
}

// Renvoie la page principale des docs
// avec les fichiers/dossiers à affichier et le chemin actuel
export async function home(req, res) {
  var path = ".."; // Chemin de départ

  res.render("document", { path: path });
}

//   ----------------------------------------------------------------

async function createDocumentHierarchy(req, res) {
  try {
    for (let i = 1; i <= 5; i++) {
      const rootFolder = new Document({
        name: `DossierPrincipal${i}`,
        type: "folder",
        path: `/SSD`,
        owner: "66237c9942727ac8d5a0c781", // Mettez ici l'ID réel d'un utilisateur,
        extension: "folder",
      });
      await rootFolder.save();

      for (let j = 1; j <= 5; j++) {
        const subFolder = new Document({
          name: `SousDossier${i}-${j}`,
          type: "folder",
          parent: rootFolder._id,
          path: `${rootFolder.path}/${rootFolder.name}`,
          owner: "66237c9942727ac8d5a0c781", // Mettez ici l'ID réel d'un utilisateur
          extension: "folder",
        });
        await subFolder.save();
        rootFolder.children.push(subFolder._id);

        for (let k = 1; k <= 5; k++) {
          const fileType = k % 2 === 0 ? "html" : "png";
          const file = new Document({
            name: `Fichier${i}-${j}-${k}.${fileType}`,
            type: "file",
            extension: fileType,
            parent: subFolder._id,
            path: `${subFolder.path}/${subFolder.name}`,
            size: Math.floor(Math.random() * 5000) + 1024, // Taille aléatoire entre 1024 et 6024 octets
            owner: "66237c9942727ac8d5a0c781", // Mettez ici l'ID réel d'un utilisateur
            creationDate: new Date(),
            modifDate: new Date(),
          });
          await file.save();
          subFolder.children.push(file._id);
        }
        await subFolder.save();
      }
      await rootFolder.save();
    }

    res.status(201).json({ message: "Hierarchy created successfully !" });
  } catch (error) {
    console.error("Failed to create file hierarchy:", error);
    res.status(505).json({ message: "Kapout !" });
  }
}

export async function getDocuments(req, res) {
  try {
    const documents = await Document.find({ path: req.query.path });

    var filesAndClass = [];
    var codeExtension = ["py", "js", "html", "css", "ejs", "c"];
    var imageExtension = ["png", "jpeg", "jpg", "svg"];

    var folders = documents.filter(
      (document) => document["extension"] === "folder"
    );
    var notFolders = documents.filter(
      (document) => document["extension"] !== "folder"
    );

    folders.forEach((file) => {
      filesAndClass.push({
        fileName: file["name"],
        fileType: "fa-solid fa-folder-open",
      });
    });

    notFolders.forEach((file) => {
      if (
        codeExtension.some((extension) => file["extension"].includes(extension))
      ) {
        filesAndClass.push({
          fileName: file["name"],
          fileType: "fa-solid fa-file-code",
        });
      } else if (
        imageExtension.some((extension) =>
          file["extension"].includes(extension)
        )
      ) {
        filesAndClass.push({
          fileName: file["name"],
          fileType: "fa-solid fa-file-image",
        });
      } else {
        filesAndClass.push({
          fileName: file["name"],
          fileType: "fa-solid fa-file",
        });
      }
    });

    res.send(filesAndClass);
  } catch (err) {
    console.error("Failed to get Document:", err);
    res.status(505).json({ message: "Kapout !" });
  }
}

// Get document Info
export async function getDocumentInfo(req, res) {
  try {
    const documents = await Document.findOne({
      path: req.query.path,
      name: req.query.fileName,
    });

    const parent = await Document.findOne({ _id: documents["parent"] });
    var parentName = null;
    if (parent) {
      parentName = parent.name;
    } else {
      parentName = "None";
    }

    res.send({
      name: documents["name"],
      type: documents["type"],
      parent: parentName,
      nbChild: documents["children"].length,
      size: documents["size"],
      creationDate: documents["creationDate"],
      modificationDate: documents["modificationDate"],
    });
  } catch (err) {
    console.error("Failed to get Document:", err);
    res.status(505).json({ message: "Kapout !" });
  }
}

const documentCtrl = {
  fileList,
  home,
  createDocumentHierarchy,
  getDocuments,
  getDocumentInfo,
};

export default documentCtrl;
