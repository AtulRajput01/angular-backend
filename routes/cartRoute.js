const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Route to add an activity to the cart
router.post('/addIn', cartController.IndoorAddToCart);
router.post('/addOut', cartController.outdoorAddToCart);
router.post('/addPlace', cartController.placeAddToCart);
router.post('/addEvent', cartController.eventsAddToCart);
router.get('/all', cartController.getAllCart);



router.delete('/delete/:id', cartController.deleteCartById);

module.exports = router;
