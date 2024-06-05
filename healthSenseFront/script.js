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
            if(!data?.user || !data?.status) {
                console.log('Eroare la logare!');
                return;

                // TO DO: Mesaj de eraore in UI!
            }

            localStorage.setItem('loggedUser', data.user);
            localStorage.setItem('loggedStatus', data.status);

            console.log('Setting user: ', localStorage.getItem('loggedUser'));
            console.log('Setting stats: ', localStorage.getItem('loggedStatus'));

            if(data?.status === 'Doctor') {
                window.location = '/doctor/acasa-doctor.html';
            } else if(data?.status === 'Pacient') {
                window.location = '/pacient/acasa-pacient.html';
            }
        })
        .catch(error => {
            displayErrorMessage('#login-form', 'Utilizatorul sau parola este greșită.');
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
                console.log('Response !ok',response);
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response received:', data);
            if(data?.status === 'Doctor' || data?.status === 'doctor') {
                window.location = '/doctor/acasa-doctor.html';
            } else if(data?.status === 'Pacient' || data?.status === 'pacient') {
                window.location = '/pacient/acasa-pacient.html';
            } else {
                console.log('EROARE LA LOGARE');
            }
        })
        .catch(error => {
            container = document.createElement('div');
            container.id = 'error-container';
            const form = document.getElementById('signup-form');
            const parent = form.parentElement;
            parent.insertBefore(container, form.nextSibling);
            const errorMessage = document.createElement('div');
            errorMessage.textContent = 'Utilizatorul exista deja. Va rugam sa incercati cu alte date.';
            container.appendChild(errorMessage);
            console.log('is an error:', error);
        });
    });
    $('#logoutButton').click(function() {
        localStorage.removeItem("status");
        window.location.href = "../log-in.html";
    });

    
    function displayErrorMessage(formSelector, message) {
        let errorContainer = $(formSelector).find('.error-container');
        if (errorContainer.length === 0) {
            errorContainer = $('<div class="error-container" style="color: red;"></div>');
            $(formSelector).append(errorContainer);
        }
        errorContainer.text(message);
    }

    /**********Get patients*************/
    const getPatienti = () => {
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
                        <p>Email pacient: ${patient.email}</p>
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
    }

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
            <form class="update-form" id="patient-form" data-id="${patientId}">
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


    // /*********add new patient************/
    $('#patient-form').on('submit', function(event) {
        event.preventDefault();

        const newPatientData = {
            nume: $('#nume').val(),
            prenume: $('#prenume').val(),
            email: $('#email').val(),
            dataNasterii: $('#dataNasterii').val(),
            istoricBolii: $('#istoricBolii').val(),
            medicamentatie: $('#medicamentatie').val(),
            adresa: $('#adresa').val(),
            sex: $('#sex').val(),
        };
        $('.error').text('');

        // Regular expressions for validation
        const nameRegex = /^[A-Za-zăâîșțĂÂÎȘȚ]+$/;
    
        let isValid = true;
    
        // Validate nume
        if (!nameRegex.test(newPatientData.nume)) {
            $('#nume-error').text('Nume invalid. Folosiți doar litere.');
            isValid = false;
        }
    
        // Validate prenume
        if (!nameRegex.test(newPatientData.prenume)) {
            $('#prenume-error').text('Prenume invalid. Folosiți doar litere.');
            isValid = false;
        }
    
        // Validate dataNasterii
        if (new Date(newPatientData.dataNasterii) > new Date()) {
            $('#dataNasterii-error').text('Data nașterii nu poate fi în viitor.');
            isValid = false;
        }
    
        // Validate sex
        if (!newPatientData.sex) {
            $('#sex-error').text('Alegeți o opțiune.');
            isValid = false;
        }
    
        if (isValid) {
            console.log(newPatientData);
            fetch('http://localhost:8000/pacient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPatientData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Patient added:', data);
                const successMessage = $('<div class="success-message">Ati adaugat pacientul cu succes!</div>');
                $('#patient-form').prepend(successMessage);
                $('#patient-form')[0].reset();
                const newPatientDiv = document.createElement('div');
                newPatientDiv.classList.add('patient');
                newPatientDiv.innerHTML = `
                    <p>Nume: ${data.nume}</p>
                    <p>Prenume: ${data.prenume}</p>
                    <p>Data nașterii: ${data.dataNasterii}</p>
                    <p>Istoric al bolii: ${data.istoricBolii}</p>
                    <p>Medicamentație: ${data.medicamentatie}</p>
                    <p>Adresă: ${data.adresa}</p>
                    <p>Sex: ${data.sex}</p>
                    <div class='btns'>
                        <button class='deleteBtn' data-id='${data._id}'>Șterge</button>
                        <button class='updateBtn' data-id='${data._id}'>Modifică pacient</button>
                    </div>
                `;
                $('#patients-container').append(newPatientDiv);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        }
    });
    const getConsultatii = () => {
        fetch('http://localhost:8000/consultatii', {
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
                const consultatiiContainer = document.getElementById('consultatii-container');
                data.forEach(consultatie => {
                    const consultatieDiv = document.createElement('div');
                    consultatieDiv.classList.add('consultatie');
                    consultatieDiv.innerHTML = `
                        <p>Nume: ${consultatie.nume}</p>
                        <p>Prenume: ${consultatie.prenume}</p>
                        <p>Email: ${consultatie.email}</p>
                        <p>Data nasterii: ${consultatie.dataNasterii}</p>
                        <p>Ora consultatiei: ${consultatie.oraConsultatie}</p>
                        <p>Data consultatiei: ${consultatie.dataConsultatie}</p>
                        <p>Locul consultatiei: ${consultatie.locConsultatie}</p>
                        <p>Adresa: ${consultatie.adresa}</p>
                        <p>Sex: ${consultatie.sex}</p>
                        <div class='btns'>
                            <button class='deleteBtn' data-id='${consultatie._id}'>Sterge</button>
                            <button class='updateBtn' data-id='${consultatie._id}'>Modifica consultatie</button>
                        </div>
                    `;
                    consultatiiContainer.appendChild(consultatieDiv);
                });
            } else {
                console.error('Unexpected data format:', data);
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    };

    /* delete consultatie */
    $(document).on('click', '.deleteBtn', function() {
        const consultatieId = $(this).data('id');
        fetch(`http://localhost:8000/consultatie/${consultatieId}`, {
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
            console.log('consultatie deleted:', data);
            // Remove the consultatie div from the DOM
            $(this).closest('.consultatie').remove();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    });

    // Handle update button click
    $(document).on('click', '.updateBtn', function() {
        const consultatieId = $(this).data('id');
        $('.consultatie').hide();
        const consultatieDiv = $(this).closest('.consultatie');
        const consultatieDetails = {
            nume: consultatieDiv.find('p:contains("Nume")').text().split(': ')[1],
            prenume: consultatieDiv.find('p:contains("Prenume")').text().split(': ')[1],
            dataNasterii: consultatieDiv.find('p:contains("Data nasterii")').text().split(': ')[1],
            oraConsultatie: consultatieDiv.find('p:contains("Ora consultatiei")').text().split(': ')[1],
            dataConsultatie: consultatieDiv.find('p:contains("Data consultatiei")').text().split(': ')[1],
            locConsultatie: consultatieDiv.find('p:contains("Locul consultatiei")').text().split(': ')[1],
            adresa: consultatieDiv.find('p:contains("Adresa")').text().split(': ')[1],
            sex: consultatieDiv.find('p:contains("Sex")').text().split(': ')[1],
        };

        const updateFormHtml = `
            <form class="update-form" id="consultatie-form" data-id="${consultatieId}">
                <div class="groupForm">
                    <label for="nume">Nume:</label><br>
                    <input type="text" name="nume" value="${consultatieDetails.nume}" required>
                </div>
                <div class="groupForm">
                    <label for="prenume">Prenume:</label><br>
                    <input type="text" name="prenume" value="${consultatieDetails.prenume}" required>
                </div>
                <div class="groupForm">
                    <label for="dataNasterii">Data Nasterii:</label><br>
                    <input type="date" name="dataNasterii" value="${consultatieDetails.dataNasterii}" required>
                </div>
                <div class="groupForm">
                    <label for="oraConsultatie">Ora consultatiei:</label><br>
                    <input type="text" name="oraConsultatie" value="${consultatieDetails.oraConsultatie}" required>
                </div>
                    <div class="groupForm">
                    <label for="dataConsultatie">Data consultatiei:</label><br>
                    <input type="text" name="dataConsultatie" value="${consultatieDetails.dataConsultatie}" required>
                </div>
                <div class="groupForm">
                    <label for="locConsultatie">Locul consultatiei:</label><br>
                    <input type="text" name="locConsultatie" value="${consultatieDetails.locConsultatie}" required>
                </div>
                <div class="groupForm">
                    <label for="Adresa">Adresa:</label><br>
                    <input type="text" name="Adresa" value="${consultatieDetails.adresa}" required>
                </div>
                <div class="groupForm">
                    <label for="sex">Sex:</label><br>
                    <select name="sex" required>
                        <option value="Feminin" ${consultatieDetails.sex === 'Feminin' ? 'selected' : ''}>Feminin</option>
                        <option value="Masculin" ${consultatieDetails.sex === 'Masculin' ? 'selected' : ''}>Masculin</option>
                    </select>
                </div>
                <button type="submit">Submit</button>
            </form>
        `;
        
        $('#consultatii-container').after(updateFormHtml);
        $('.update-form').show();
    });

    // Handle form submission for updating patient information
    $(document).on('submit', '.update-form', function(event) {
        event.preventDefault();
        const consultatieId = $(this).data('id');
        
        // Collect updated patient information from the form
        const updatedData = {
            _id: consultatieId,
            nume: $(this).find('input[name=nume]').val(),
            prenume: $(this).find('input[name=prenume]').val(),
            dataNasterii: $(this).find('input[name=dataNasterii]').val(),
            oraConsultatie: $(this).find('input[name=oraConsultatie]').val(),
            dataConsultatie: $(this).find('input[name=dataConsultatie]').val(),
            locConsultatie: $(this).find('input[name=locConsultatie]').val(),
            adresa: $(this).find('input[name=Adresa]').val(),
            sex: $(this).find('select[name=sex]').val(),
        };

        // Send fetch request to update patient information
        fetch(`http://localhost:8000/consultatie`, {
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
            console.log('consultatie updated:', data);
            // Update the consultatie card with the new details
            const consultatieDiv = $(`button[data-id="${consultatieId}"]`).closest('.consultatie');
            consultatieDiv.find('p:contains("Nume")').text(`Nume: ${updatedData.nume}`);
            consultatieDiv.find('p:contains("Prenume")').text(`Prenume: ${updatedData.prenume}`);
            consultatieDiv.find('p:contains("Data nasterii")').text(`Data nasterii: ${updatedData.dataNasterii}`);
            consultatieDiv.find('p:contains("Ora consultatiei")').text(`Ora consultatiei: ${updatedData.oraConsultatie}`);
            consultatieDiv.find('p:contains("Data consultatiei")').text(`Data consultatiei: ${updatedData.dataConsultatie}`);
            consultatieDiv.find('p:contains("Locul consultatiei")').text(`Locul consultatiei: ${updatedData.locConsultatie}`);
            consultatieDiv.find('p:contains("Adresa")').text(`Adresa: ${updatedData.adresa}`);
            consultatieDiv.find('p:contains("Sex")').text(`Sex: ${updatedData.sex}`);
            $(this).remove();
            $('.consultatie').show();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    });


    // /*********add new consultatie************/
    $('#consultatie-form').on('submit', function(event) {
        event.preventDefault();

        const newConsultatieData = {
            nume: $('#nume').val(),
            prenume: $('#prenume').val(),
            email: $('#email').val(),
            dataNasterii: $('#dataNasterii').val(),
            oraConsultatie: $('#oraConsultatie').val(),
            dataConsultatie: $('#dataConsultatie').val(),
            locConsultatie: $('#locConsultatie').val(),
            adresa: $('#adresa').val(),
            sex: $('#sex').val(),
        };
        console.log(newConsultatieData);
        fetch('http://localhost:8000/consultatie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newConsultatieData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('consultatie added:', data);
            const successMessage = $('<div class="success-message">Ati adaugat consultatia cu succes!</div>');
            $('#consultatie-form').prepend(successMessage);
            $('#consultatie-form')[0].reset();
            const newConsultatieDiv = document.createElement('div');
            newConsultatieDiv.classList.add('consultatie');
            newConsultatieDiv.innerHTML = `
            <p>Nume: ${consultatie.nume}</p>
            <p>Prenume: ${consultatie.prenume}</p>
            <p>Data nasterii: ${consultatie.dataNasterii}</p>
            <p>Ora consultatiei: ${consultatie.oraConsultatie}</p>
            <p>Data consultatiei: ${consultatie.dataConsultatie}</p>
            <p>Locul consultatiei: ${consultatie.locConsultatie}</p>
            <p>Adresa: ${consultatie.adresa}</p>
            <p>Sex: ${consultatie.sex}</p>
            <div class='btns'>
                <button class='deleteBtn' data-id='${consultatie._id}'>Sterge</button>
                <button class='updateBtn' data-id='${consultatie._id}'>Modifica consultatie</button>
            </div>
            `;
            $('#consultatii-container').append(newConsultatieDiv);
            
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
        
    });

    const fetchDetaliiPacient = (user) => {
        console.log('Getch for: ', user);
        fetch(`http://localhost:8000/pacientByEmail/${user}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log('data: ', data);

            const divDetaliiPacient = document.createElement('div');
            divDetaliiPacient.innerHTML = `
                <p>Nume: ${data.nume}</p>
                <p>Prenume: ${data.prenume}</p>
                <p>Email: ${data.email}</p>
                <p>Data nasterii: ${data.dataNasterii}</p>
                <p>Istoric al bolii: ${data.istoricBolii}</p>
                <p>Medicamentatie: ${data.medicamentatie}</p>
                <p>Adresa: ${data.adresa}</p>
                <p>Sex: ${data.sex}</p>
            `;
            $('#detalii-pacient').append(divDetaliiPacient);

        })
        .catch((error) => {
            console.log('error: ', error);
            throw error;
        });
    };

    const fetchConsultatiiPacient = (user) => {
        console.log('Getch for: ', user);
        fetch(`http://localhost:8000/consultatiiByEmail/${user}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log('data: ', data);

            const divConsultatiiPacient = document.createElement('div');

            data.forEach(consultatie => {
                const divConsultatie = document.createElement('div');
                divConsultatie.innerHTML = `
                    <p>Loc consultatie: ${consultatie.locConsultatie}</p>
                    <p>Ora consultatie: ${consultatie.oraConsultatie}</p>
                    <p>Data consultatie: ${consultatie.dataConsultatie}</p>
                    <p>Loc consultatie: ${consultatie.locConsultatie}</p>
                    <hr/>
                `;

                divConsultatiiPacient.appendChild(divConsultatie);
            });

            $('#consultatii-pacient').append(divConsultatiiPacient);

        })
        .catch((error) => {
            console.log('error: ', error);
            throw error;
        });
    };
    
    const myUrl = $(location).attr("href");
    const shortName = myUrl.slice(myUrl.lastIndexOf('/'));
    
    if(shortName === '/acasa-pacient.html') {
        fetchDetaliiPacient(localStorage.getItem('loggedUser'));
    } else if(shortName === '/consultatii-pacient.html') {
        fetchConsultatiiPacient(localStorage.getItem('loggedUser'));
    } else {
        getPatienti();
        getConsultatii();
    }
    
});