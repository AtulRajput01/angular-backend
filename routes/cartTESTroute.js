const express = require('express');
const cartTESTController = require('../controllers/cartTESTController');

const router = express.Router();

router.post('/cart/add', cartTESTController.addToCart);
router.get('/cart/getAll/:userId', cartTESTController.getAllCart);
router.get('/cart/:id', cartTESTController.getOneById); 
router.delete('/cart/:id', cartTESTController.deleteCartById);

module.exports = router;
