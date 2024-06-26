const express = require('express');
const { createPlace, getPlace, getPlaces, updatePlace, deletePlace } = require('../controllers/mngPlaceController');
const router = express.Router();

router.post('/add', createPlace);   //running
router.get('/:id', getPlace);   //running
router.get('/', getPlaces);   //running
router.put('/:id', updatePlace);   //running
router.delete('/:id', deletePlace);   //running

module.exports = router;