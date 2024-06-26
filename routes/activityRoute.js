const express = require('express');
const activityController = require('../controllers/activityController');
const router = express.Router();
const upload = require('../middleware/upload');


router.post('/activities', upload.array('images', 3),activityController.createActivity); // done
router.get('/', activityController.getAllActivities);  //done
router.post('/one', activityController.getOneActivity);   // doneby type
router.get('/:id', activityController.getByIdActivity);  // done
router.put('/update/:id',upload.array('images', 3), activityController.updateActivityById);   // done
router.delete('/:id', activityController.deleteActivityById);   // done
router.get('/images/:filename', activityController.getImage); // Serve image by filename

module.exports = router;
