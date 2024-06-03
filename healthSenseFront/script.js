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

// Handle update button click
$(document).on('click', '.updateBtn', function() {
    const patientId = $(this).data('id');
    $('.patient').hide();
    const patientDiv = $(this).closest('.patient');
    const patientDetails = {
        nume: patientDiv.find('p:contains("Nume")').text().split(': ')[1],
        prenume: patientDiv.find('p:contains("Prenume")').text().split(': ')[1],
        dataNasterii: patientDiv.find('p:contains("Data nasterii")').text().split(': ')[1],
        istoricBolii: patientDiv.find('p:contains("Istoric al bolii")').text().split(': ')[1],
        medicamentatie: patientDiv.find('p:contains("Medicamentatie")').text().split(': ')[1],
        adresa: patientDiv.find('p:contains("Adresa")').text().split(': ')[1],
        sex: patientDiv.find('p:contains("Sex")').text().split(': ')[1],
    };

    const updateFormHtml = `
        <form class="update-form" data-id="${patientId}">
            <div class="groupForm">
                <label for="nume">Nume:</label><br>
                <input type="text" name="nume" value="${patientDetails.nume}" required>
            </div>
            <div class="groupForm">
                <label for="prenume">Prenume:</label><br>
                <input type="text" name="prenume" value="${patientDetails.prenume}" required>
            </div>
            <div class="groupForm">
                <label for="dataNasterii">Data Nasterii:</label><br>
                <input type="date" name="dataNasterii" value="${patientDetails.dataNasterii}" required>
            </div>
            <div class="groupForm">
                <label for="istoricBolii">Istoric Bolii:</label><br>
                <textarea name="istoricBolii" rows="4" cols="50" required>${patientDetails.istoricBolii}</textarea>
            </div>
            <div class="groupForm">
                <label for="Medicamentatie">Medicamentatie:</label><br>
                <textarea name="Medicamentatie" rows="4" cols="50" required>${patientDetails.medicamentatie}</textarea>
            </div>
            <div class="groupForm">
                <label for="Adresa">Adresa:</label><br>
                <input type="text" name="Adresa" value="${patientDetails.adresa}" required>
            </div>
            <div class="groupForm">
                <label for="sex">Sex:</label><br>
                <select name="sex" required>
                    <option value="Feminin" ${patientDetails.sex === 'Feminin' ? 'selected' : ''}>Feminin</option>
                    <option value="Masculin" ${patientDetails.sex === 'Masculin' ? 'selected' : ''}>Masculin</option>
                </select>
            </div>
            <button type="submit">Submit</button>
        </form>
    `;
    
    $('#patients-container').after(updateFormHtml);
    $('.update-form').show();
});

// Handle form submission for updating patient information
$(document).on('submit', '.update-form', function(event) {
    event.preventDefault();
    const patientId = $(this).data('id');
    
    // Collect updated patient information from the form
    const updatedData = {
        _id: patientId,
        nume: $(this).find('input[name=nume]').val(),
        prenume: $(this).find('input[name=prenume]').val(),
        dataNasterii: $(this).find('input[name=dataNasterii]').val(),
        istoricBolii: $(this).find('textarea[name=istoricBolii]').val(),
        medicamentatie: $(this).find('textarea[name=Medicamentatie]').val(),
        adresa: $(this).find('input[name=Adresa]').val(),
        sex: $(this).find('select[name=sex]').val(),
    };

    // Send fetch request to update patient information
    fetch(`http://localhost:8000/pacient`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Patient updated:', data);
        // Update the patient card with the new details
        const patientDiv = $(`button[data-id="${patientId}"]`).closest('.patient');
        patientDiv.find('p:contains("Nume")').text(`Nume: ${updatedData.nume}`);
        patientDiv.find('p:contains("Prenume")').text(`Prenume: ${updatedData.prenume}`);
        patientDiv.find('p:contains("Data nasterii")').text(`Data nasterii: ${updatedData.dataNasterii}`);
        patientDiv.find('p:contains("Istoric al bolii")').text(`Istoric al bolii: ${updatedData.istoricBolii}`);
        patientDiv.find('p:contains("Medicamentatie")').text(`Medicamentatie: ${updatedData.medicamentatie}`);
        patientDiv.find('p:contains("Adresa")').text(`Adresa: ${updatedData.adresa}`);
        patientDiv.find('p:contains("Sex")').text(`Sex: ${updatedData.sex}`);
        $(this).remove();
        $('.patient').show();
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

