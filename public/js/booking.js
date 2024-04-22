document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const patientName = document.getElementById('patientName').value;
    const doctorName = document.getElementById('doctorName').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;
    var e = document.getElementById("about");
    const about = e.options[e.selectedIndex].value;
    console.log('\n----about: ' + about);
    


    fetch('/appointment/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, patientName: patientName, doctorName: doctorName, date: date, about: about})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Échec de la connexion');
        }
        return response.json();
    })
    .then(data => {
        if (data) {
            // next();
            console.log("********************OUI")

        } else {
            throw new Error('Token non reçu');
        }
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
});
