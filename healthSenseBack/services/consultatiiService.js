const db = require('./persistenceService').getDatabase();
const { ObjectId } = require('mongodb');

// const consultatii = [
//     {
//         Nume: "Ion",
//         Prenume: "Popescu",
//         Varsta: 45,
//         Adresa: "Str. Florilor, nr. 12",
//         oraConsultatie: "10:00",
//         dataConsultatie: "2024-06-10",
//         locConsultatie: "Spitalul Municipal"
//     },
//     {
//         Nume: "Maria",
//         Prenume: "Ionescu",
//         Varsta: 30,
//         Adresa: "Str. Libertatii, nr. 5",
//         oraConsultatie: "11:00",
//         dataConsultatie: "2024-06-11",
//         locConsultatie: "Spitalul Judetean"
//     },
//     {
//         Nume: "George",
//         Prenume: "Vasilescu",
//         Varsta: 50,
//         Adresa: "Str. Pacii, nr. 3",
//         oraConsultatie: "12:00",
//         dataConsultatie: "2024-06-12",
//         locConsultatie: "Spitalul Universitar"
//     },
//     {
//         Nume: "Elena",
//         Prenume: "Marinescu",
//         Varsta: 40,
//         Adresa: "Str. Viitorului, nr. 8",
//         oraConsultatie: "13:00",
//         dataConsultatie: "2024-06-13",
//         locConsultatie: "Spitalul de Urgenta"
//     },
//     {
//         Nume: "Florin",
//         Prenume: "Popa",
//         Varsta: 35,
//         Adresa: "Str. Sperantei, nr. 7",
//         oraConsultatie: "14:00",
//         dataConsultatie: "2024-06-14",
//         locConsultatie: "Spitalul Clinic"
//     },
//     {
//         Nume: "Ana",
//         Prenume: "Dumitrescu",
//         Varsta: 60,
//         Adresa: "Str. Trandafirilor, nr. 2",
//         oraConsultatie: "15:00",
//         dataConsultatie: "2024-06-15",
//         locConsultatie: "Spitalul Militar"
//     },
//     {
//         Nume: "Mihai",
//         Prenume: "Georgescu",
//         Varsta: 55,
//         Adresa: "Str. Independentei, nr. 10",
//         oraConsultatie: "16:00",
//         dataConsultatie: "2024-06-16",
//         locConsultatie: "Spitalul Central"
//     },
//     {
//         Nume: "Ioana",
//         Prenume: "Stanescu",
//         Varsta: 25,
//         Adresa: "Str. Victoriei, nr. 1",
//         oraConsultatie: "17:00",
//         dataConsultatie: "2024-06-17",
//         locConsultatie: "Spitalul de Pediatrie"
//     },
//     {
//         Nume: "Andrei",
//         Prenume: "Radu",
//         Varsta: 65,
//         Adresa: "Str. Unirii, nr. 6",
//         oraConsultatie: "18:00",
//         dataConsultatie: "2024-06-18",
//         locConsultatie: "Spitalul de Recuperare"
//     },
//     {
//         Nume: "Cristina",
//         Prenume: "Pop",
//         Varsta: 28,
//         Adresa: "Str. Eroilor, nr. 4",
//         oraConsultatie: "19:00",
//         dataConsultatie: "2024-06-19",
//         locConsultatie: "Spitalul Clinic de Urgenta"
//     }
// ];

// console.log(consultatii);

async function insertConsultatii() {
    const col = db.collection('consultatii');
    const res = await col.insertMany(consultaii);
    return res;
}

// Read all the consultaii in the db
async function retrieveConsultatii() {
    const col = db.collection('consultatii');
    const res = await col.find({});
    const allValues = await res.toArray();

    return allValues;
}

// add a new consultatie
async function addNewConsultatie(consultatie) {
    const col = db.collection('consultatii');
    const res = await col.insertOne(consultatie);
}

// update consultatie
async function updateConsultatie(idConsultatie, updatedData) {
    const col = db.collection('consultatii');
    const res = await col.updateOne(
        { _id: new ObjectId(idConsultatie) }, 
        { $set: {...updatedData} }
    );

    return res;
}

// Delete consultatie
async function deleteConsultatie(_id) {
    const col = db.collection('consultatii');
    const res = await col.deleteOne({_id: new ObjectId(_id)});

    return res;
}

//Read dConsultatie
async function retrieveConsultatie(_id) {
    const col = db.collection('consultatii');
    const res = await col.findOne({ _id: new ObjectId(_id) });

    return res;
}

module.exports = {
    retrieveConsultatii,
    insertConsultatii,
    addNewConsultatie,
    updateConsultatie,
    deleteConsultatie,
    retrieveConsultatie
};
