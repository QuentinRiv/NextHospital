document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

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
            localStorage.setItem('token', data.token);
            console.log('*-*-*'  + localStorage.getItem('token'));
            // Redirection vers /index après la réussite de l'authentification
            // next();
            if (data.profileType == 'Patient') {
                location.replace('/patient/main');
            }
            if (data.profileType == 'Doctor') {
                location.replace('/doctor/main');
            }
            console.log("********************NON")

        } else {
            throw new Error('Token non reçu');
        }
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
});
