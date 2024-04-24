

document.addEventListener('DOMContentLoaded', () => {
    const folders = document.querySelectorAll('.folder-name');

    folders.forEach(folder => {
        folder.addEventListener('click', function() {
            this.parentElement.classList.toggle('open');
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const grille = document.getElementById('grille');

    // Attache le gestionnaire d'événements à l'élément grille
    grille.addEventListener('dblclick', async function(event) {
        // Vérifie si l'élément cliqué est une cellule
        if (event.target.classList.contains('folder')) {
            const cell = event.target;
            const cheminactuelle = document.getElementById('chemin').innerHTML;
            const fullPath = `${cheminactuelle}/${cell.textContent}`; // Utilise textContent au lieu de innerHTML

            grille.innerHTML = ""; // Nettoie la grille avant d'ajouter de nouveaux éléments

            try {
                const response = await fetch(`http://localhost:3000/document/files?path=${encodeURIComponent(fullPath)}`);
                const files = await response.json();

                const mesfichiers = files.reduce((acc, filename) => {
                    const key = filename.includes('.') ? filename.split('.')[1] : 'folder';
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(filename);
                    return acc;
                }, {});

                const plouf = document.getElementById('chemin');
                plouf.innerHTML = fullPath;


                Object.entries(mesfichiers).forEach(([key, value]) => {
                    value.forEach(filename => {
                        let div = document.createElement("div");
                        div.className = 'cell'; // Assure consistency in class naming
                        if (key === 'folder') {
                            div.className = 'cell folder';
                        }
                        div.textContent = filename; // More secure than innerHTML
                        grille.append(div);
                    });
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des fichiers:', error);
            }
        }
    });
});

