const express = require('express');
const { createEvent, getEvent, getEvents, deleteEvent } = require('../controllers/eventsController');
const router = express.Router();

router.post('/add', createEvent); //running
router.get('/:id', getEvent); //running
router.get('/', getEvents);  //running
router.delete('/delete/:id', deleteEvent); // running

module.exports = router;