const express = require("express");
const userController = require('../controllers/userController')
const { verifyAdmin, verifyUser } = require('../middleware/verifyToken')
const router = express.Router();
const upload = require('../middleware/upload');


router.post('/add', upload.array('images', 3), verifyAdmin, userController.createUser);
router.get('/:id', verifyUser, userController.getUserById);
router.get('/', verifyAdmin, userController.getAllUsers);
router.put('/:id', upload.array('images', 3), verifyAdmin, userController.updateUser);
router.delete('/:id', verifyAdmin, userController.deleteUser);
router.get('/images/:filename', userController.getImage);


module.exports = router;
