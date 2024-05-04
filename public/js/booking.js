// Recupère les données du formulaire de patient.ejs pour créer un RDV 
// avec un document Appointment grâce à l'API dans /appointment/new
document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Infos du formulaire
    const patientName = document.getElementById('patientName').value;
    const doctorName = document.getElementById('doctorName').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;
    const e = document.getElementById("about");
    const about = e.options[e.selectedIndex].value;

    // POST à l'API
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
            console.log("Success for new appointment");

        } else {
            throw new Error('Token non reçu');
        }
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
});
