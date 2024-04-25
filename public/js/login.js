// Formulaire de connexion
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // API pour checker le user
    fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Échec de la connexion');
        }
        return response.json();
    })
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token); // On garde le token au chaud pour... ? TODO : découvrir si utile
            // Redirection vers /index après la réussite de l'authentification
            if (data.profileType == 'Patient') {
                location.replace('/patient/main');
            }
            if (data.profileType == 'Doctor') {
                location.replace('/doctor/main');
            }
            console.error("Not Patient, Not Doctor ???"); // On devrait pas arriver ici

        } else {
            throw new Error('Token non reçu');
        }
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
});
