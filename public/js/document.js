document.addEventListener('DOMContentLoaded', () => {
    const folders = document.querySelectorAll('.folder-name');

    folders.forEach(folder => {
        folder.addEventListener('click', function() {
            this.parentElement.classList.toggle('open');
        });
    });
});
