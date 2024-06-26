const express = require('express');
const {addMemeber,getMemeber,deleteMemeber} = require('../controllers/membersController');

const router = express.Router();

router.post('/addMember', addMemeber);
router.get('/getMember/:id', getMemeber);
router.delete('/deleteMember/:id', deleteMemeber);



module.exports = router;
