
$(document).ready(function() {
    console.log('asd', localStorage.getItem('loggedInUser'));
    
    if(localStorage.getItem('loggedInUser')) {
        console.log('Logged in: ', localStorage.getItem('loggedInUser'));
    }
});

function fetchPatientDetails(patientId) {
    fetch(`http://localhost:8000/pacient/${patientId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Patient details:', data);
        const patientContainer = document.getElementById('patient-container');
        patientContainer.innerHTML = `
            <p>Nume: ${data.nume}</p>
            <p>Prenume: ${data.prenume}</p>
            <p>Data nasterii: ${data.dataNasterii}</p>
            <p>Istoric al bolii: ${data.istoricBolii}</p>
            <p>Medicamentatie: ${data.medicamentatie}</p>
            <p>Adresa: ${data.adresa}</p>
            <p>Sex: ${data.sex}</p>
        `;
        console.log('Patient details:', data);
    })
    .catch(error => {
        console.error('Error fetching patient details:', error);
    });
};