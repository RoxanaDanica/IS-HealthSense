var currentFilename = window.location.pathname.split('/').pop();
$('ul li a').each(function() {
    var href = $(this).attr('href').split('/').pop();
    if (href === currentFilename) {
        $(this).addClass('active');
    }
});

/*****log-in or sing-up******/
$(document).ready(function(){
    $('.log').click(function(){
        $('#login-form').show();
        $('#signup-form').hide();
        $('.reg').hide();
        $('.log').hide();
    });

    $('.reg').click(function(){
        $('#login-form').hide();
        $('#signup-form').show();
        $('.log').hide();
        $('.reg').hide();
    });

    $('#login-form').submit(function(event){
        event.preventDefault(); 

        let formData = {
            user: $('#login-email').val(),
            password: $('#login-password').val()
        };
        console.log(formData);
        fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
            })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response received:', data);
            if(data?.status === 'Doctor') {
                window.location = './doctor./acasa-doctor.html';
            } else if(data?.status === 'Pacient') {
                window.location = './pacient./acasa-pacient.html';
            } else {
                console.log('EROARE LA LOGARE');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    });

    $('#signup-form').submit(function(event){
        event.preventDefault();

        var formData = {
            user: $('#signup-email').val(),
            password: $('#signup-password').val(),
            status: $('#status').val() 
        };
        console.log(formData);

        fetch('http://localhost:8000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
            })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response received:', data);
            if(data?.status === 'Doctor') {
                window.location('./acasa-doctor.html');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    });
    $('#logoutButton').click(function() {
        localStorage.removeItem("status");
        window.location.href = "../log-in.html";
    });

});

/**********Get patients*************/
fetch('http://localhost:8000/pacienti', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(responseData => {
    const data = responseData.data;
    if (Array.isArray(data)) {
        const patientsContainer = document.getElementById('patients-container');
        data.forEach(patient => {
            const patientDiv = document.createElement('div');
            patientDiv.classList.add('patient');
            patientDiv.innerHTML = `
                <p>Nume: ${patient.nume}</p>
                <p>Prenume: ${patient.prenume}</p>
                <p>Data nasterii: ${patient.dataNasterii}</p>
                <p>Istoric al bolii: ${patient.istoricBolii}</p>
                <p>Medicamentatie: ${patient.medicamentatie}</p>
                <p>Adresa: ${patient.adresa}</p>
                <p>Sex: ${patient.sex}</p>
                <div class='btns'>
                    <button class='deleteBtn' data-id='${patient._id}'>Sterge</button>
                    <button class='updateBtn' data-id='${patient._id}'>Modifica pacient</button>
                </div>
            `;
            patientsContainer.appendChild(patientDiv);
        });
    } else {
        console.error('Unexpected data format:', data);
    }
})
.catch(error => {
    console.error('There was a problem with the fetch operation:', error);
});

// Handle delete button click
$(document).on('click', '.deleteBtn', function() {
    const patientId = $(this).data('id');
    fetch(`http://localhost:8000/pacient/${patientId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Patient deleted:', data);
        // Remove the patient's div from the DOM
        $(this).closest('.patient').remove();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});

/*********add new patient************/
document.getElementById('patient-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var formData = new FormData(this); 
    fetch('http://localhost:8000/pacient', {
        method: 'POST',
        body: formData 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Response received:', data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});

