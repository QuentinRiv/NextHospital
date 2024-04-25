
// Pourle tiers gauche, le directory structure
document.addEventListener('DOMContentLoaded', () => {
    const folders = document.querySelectorAll('.folder-name');

    // Rajoute 'open' pour changer l'icone et le display des enfants
    folders.forEach(folder => {
        folder.addEventListener('click', function() {
            this.parentElement.classList.toggle('open');
        });
    });
});


async function loadFiles(path) {
    const grille = document.getElementById('grille');
    grille.innerHTML = ""; // Nettoie la grille avant d'ajouter de nouveaux éléments

    try {
        const response = await fetch(`http://localhost:3000/document/fileList?path=${encodeURIComponent(path)}`);
        const files = await response.json();

        const mesfichiers = files.reduce((acc, filename) => {
            const key = filename.includes('.') ? filename.split('.')[1] : 'folder';
            if (!acc[key]) acc[key] = [];
            acc[key].push(filename);
            return acc;
        }, {});

        Object.entries(mesfichiers).forEach(([key, value]) => {
            value.forEach(filename => {
                let div = document.createElement("div");
                div.className = 'cell'; // Assure consistency in class naming
                div.id = filename; // More secure than innerHTML

                let icone = document.createElement('i');
                if (key === 'folder') icone.classList ="fa-solid fa-folder-open ";   
                if (key != 'folder') icone.classList ="fa-solid fa-file ";               
                div.append(icone);

                let namefile = document.createElement('h3');
                namefile.innerHTML = filename;
                div.append(namefile);

                grille.append(div);
            });
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des fichiers:', error);
    }
}

function findParentCell(element) {
    while (element && !element.classList.contains('cell')) {
        element = element.parentElement;
        if (element === grille) return null; // Stoppe si nous atteignons le conteneur de la grille
    }
    return element;
}

document.addEventListener('DOMContentLoaded', function() {
    const cheminInitial = document.getElementById('chemin').innerHTML;

    // Charge la grille initiale au chargement de la page
    loadFiles(cheminInitial);

    const grille = document.getElementById('grille');

    // Gestionnaire pour les clics sur les cellules de la grille
    grille.addEventListener('dblclick', function(event) {
        const cell = findParentCell(event.target); // Pour savoir dans quel div on est
        if (cell) {
            const currentPath = document.getElementById('chemin').innerHTML;
            const fullPath = `${currentPath}/${cell.id}`;

            loadFiles(fullPath); // Appelle la fonction loadFiles avec le nouveau chemin

            var lechemin = document.getElementById('chemin');
            lechemin.innerHTML = fullPath;
        }
    });
});
