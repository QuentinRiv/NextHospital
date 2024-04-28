// Pourle tiers gauche, le directory structure
document.addEventListener("DOMContentLoaded", () => {
  const folders = document.querySelectorAll(".folder-name");

  // Rajoute 'open' pour changer l'icone et le display des enfants
  folders.forEach((folder) => {
    folder.addEventListener("click", function () {
      this.parentElement.classList.toggle("open");
    });
  });
});

async function loadFiles(path) {
  const grille = document.getElementById("grille");
  grille.innerHTML = ""; // Nettoie la grille avant d'ajouter de nouveaux éléments

  try {
    const response = await fetch(
      `http://localhost:3000/document/getDocuments?path=${encodeURIComponent(
        path
      )}`
    );
    const files = await response.json();
    console.log("Fichiers et extension :", files);

    files.forEach((file) => {
      let div = document.createElement("div");
      div.className = "cell"; // Assure consistency in class naming
      div.id = file["fileName"]; // More secure than innerHTML

      let icone = document.createElement("i");
      icone.className = file["fileType"];
      div.append(icone);

      let namefile = document.createElement("h3");
      namefile.innerHTML = file["fileName"];
      div.append(namefile);

      grille.append(div);
    });

    var newCurrentPath = document.getElementById("chemin");
    newCurrentPath.innerHTML = path;
  } catch (error) {
    console.error("Erreur lors de la récupération des fichiers:", error);
  }
}

function findParentCell(element) {
  while (element && !element.classList.contains("cell")) {
    element = element.parentElement;
    if (element === grille) return null; // Stoppe si nous atteignons le conteneur de la grille
  }
  return element;
}

document.addEventListener("DOMContentLoaded", function () {
  const cheminInitial = document.getElementById("chemin").innerHTML;

  // Charge la grille initiale au chargement de la page
  loadFiles(cheminInitial);

  const grille = document.getElementById("grille");

  // Gestionnaire pour les clics sur les cellules de la grille
  grille.addEventListener("dblclick", function (event) {
    const cell = findParentCell(event.target); // Pour savoir dans quel div on est
    if (cell) {
      const currentPath = document.getElementById("chemin").innerHTML;
      const fullPath = `${currentPath}/${cell.id}`;

      loadFiles(fullPath); // Appelle la fonction loadFiles avec le nouveau chemin
    }
  });
});

// 1 Clique pour avoir des infos
document.addEventListener("DOMContentLoaded", async function () {
  const grille = document.getElementById("grille");

  // Attachez l'écouteur de clic sur la grille
  grille.addEventListener("click", handleGridClick);

  async function handleGridClick(event) {
    const cell = findParentCell(event.target);
    if (!cell) return; // Si le clique n'est pas dans la grille

    const isActive = cell.classList.contains("active");

    // Retirer la classe 'active' de toutes les cellules
    const cells = document.querySelectorAll(".cell");
    cells.forEach((c) => c.classList.remove("active"));

    // Si le div actuel n'était pas actif, ajouter la classe 'active'
    if (!isActive) {
      cell.classList.add("active");
    }

    const currentPath = document.getElementById("chemin").innerHTML;

    try {
      const response = await fetchDocumentInfo(currentPath, cell.id);
      const data = await response.json();

      let currentFile = document.getElementById("currentFile");
      currentFile.innerHTML = data["name"]; // Nom du fichier observé

      // Faire apparaitre le symbole de l'extension du fichier
      let currentFileSymbole = document.getElementById("fileSymbole");
      let symbole = document.createElement("i");
      symbole.classList = cell.querySelector("i").className;
      currentFileSymbole.innerHTML = "";
      currentFileSymbole.append(symbole);

      const elements = document.querySelectorAll(".info");

      // Rajoute 'open' pour changer l'icone et le display des enfants
      elements.forEach((elem) => {
        elem.classList.toggle("show");
      });
    } catch (error) {
      console.error("Erreur", error);
    }
  }

  async function fetchDocumentInfo(path, fileName) {
    const url = `http://localhost:3000/document/getDocumentInfo?path=${encodeURIComponent(
      path
    )}&fileName=${encodeURIComponent(fileName)}`;
    return fetch(url);
  }
});

// Pour la flèche de retour en arrière
document.addEventListener("DOMContentLoaded", function () {
  const backButton = document.getElementById("comeback");

  // Gestionnaire pour les clics sur les cellules de la grille
  backButton.addEventListener("click", function (event) {
    const currentPath = document.getElementById("chemin").innerHTML;

    let parentPath = currentPath.substring(0, currentPath.lastIndexOf("/"));
    loadFiles(parentPath);
  });
});
