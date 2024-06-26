const express = require('express');
const { createPolicy, getAllPolicy, getByIdPolicy, updatePolicy, deletePolicy } = require('../controllers/policyController');
const router = express.Router();


router.post('/add', createPolicy);
router.get('/', getAllPolicy);
router.get('/:id', getByIdPolicy);
router.put('/:id', updatePolicy);
router.delete('/:id', deletePolicy);

module.exports = router;