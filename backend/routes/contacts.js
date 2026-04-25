const express = require('express');
const { getContacts, addContact, deleteContact } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes are protected

router.route('/')
  .get(getContacts)
  .post(addContact);

router.route('/:id')
  .delete(deleteContact);

module.exports = router;
