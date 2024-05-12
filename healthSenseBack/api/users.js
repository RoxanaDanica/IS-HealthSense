const express = require('express');
const router = express.Router();

const { 
    insertUsers,
    addNewUser,
    logInUser
  } = require('../services/usersService');

  const { validateUserData, validateLogin } = require('./utils/usersUtils');

// router.get('/save-users', async (req, res) => {
//   const users = await insertUsers();
//   res.send({
//     data: users
//   });
// });

router.post('/signup', async (req, res) => {
    const newUser = req.body;
  
    try {
        validateUserData(newUser)
    } catch(error) {
      res.status(400).json({ message: error.message });
      return;
    }
  
    const result = await addNewUser(newUser);
    res.status(201).json({ message: 'User added successfully', user: result });
});

router.post('/login', async (req, res) => {
    try {
      validateLogin(req.body)
    } catch(error) {
      res.status(400).json({ message: error.message });
      return;
    }
    const result = await logInUser(req.body);
    if(result?.user) {
      // succes
    } else {
      // Eroare
      res.status(400).send('There is no such user');
    }
    res.send(result);
  });

module.exports = router;