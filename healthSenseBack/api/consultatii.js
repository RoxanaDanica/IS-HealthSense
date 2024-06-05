const express = require('express');
const router = express.Router();

const { 
    retrieveConsultatii,
    retrieveConsultatiiByFilter,
    insertConsultatii,
    addNewConsultatie,
    updateConsultatie,
    deleteConsultatie,
    retrieveConsultatie,
  } = require('../services/consultatiiService');

  const { validateConsultatieData } = require('./utils/consultatieUtils');

// router.get('/save', async (req, res) => {
//   const consultatii = await insertConsultatii();
//   res.send({
//     data: consultatii
//   });
// });  

router.get('/consultatii', async (req, res) => {
    const consultatii = await retrieveConsultatii();
    res.send({
      data: consultatii
    });
  });

router.get('/consultatiiByEmail/:email', async (req, res) => {
  const consultatii = await retrieveConsultatiiByFilter({ email: req.params.email });
  res.send(consultatii);
  return;
});

router.get('/consultatie/:_id', async (req, res) => {
  const consultatie = await retrieveConsultatie(req.params._id);
  res.send({
      data: consultatie
  });
});

router.post('/consultatie', async (req, res) => {
  const newConsultatie = req.body;
  console.log(req.body);

  try {
    validateConsultatieData(newConsultatie)
  } catch(error) {
      res.status(400).json({ message: error.message });
      return;
  }

  const result = await addNewConsultatie(newConsultatie);
  res.status(201).json({ message: 'Consultatie added successfully', consultatie: result });
});

router.put('/consultatie', async (req, res) => {
  const idConsultatie = req.body._id;
  try {
    validateConsultatieData(req.body)
  } catch(error) {
      res.status(400).json({ message: error.message });
      return;
  }

  console.log(req.body);
  const myObject = req.body;
  delete myObject._id; 
  const result = await updateConsultatie(idConsultatie, { ...myObject });

  res.send(result);
});

router.delete('/consultatie/:_id', async (req, res) => {
  console.log(req.params._id);
  const result = await deleteConsultatie(req.params._id);
  res.send(result);
});


module.exports = router;