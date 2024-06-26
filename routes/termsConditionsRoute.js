const express = require('express');
const { createTerms, getAllTerms, getByIdTerms, updateTerms, deleteTerms } = require('../controllers/termsConditionsController');
const router = express.Router();


router.post('/add', createTerms);
router.get('/', getAllTerms);
router.get('/:id', getByIdTerms);
router.put('/:id', updateTerms);
router.delete('/:id', deleteTerms);

module.exports = router;