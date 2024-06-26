const express = require('express');
const scheduleC = require('../controllers/scheduleController');

const router = express.Router();

router.post('/schedule', scheduleC.schedule);
router.delete('/deleteSchedule/:id', scheduleC.deleteSchedule);
router.get('/scheduleAll/:userId', scheduleC.GetAllSchedule);
router.get('/GetAllHistory/:userId', scheduleC.GetAllHistory);
router.get('/schedule/:id', scheduleC.getOneById);
router.post('/download', scheduleC.downloadS);



module.exports = router;
