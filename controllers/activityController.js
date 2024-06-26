const Activity = require('../models/activityModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');
const path = require('path');
const fs = require('fs');


// create new activity working
exports.createActivity = async (req, res, next) => {
  try {
    const { name, place, price, termComdtion, description, type } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const images = req.files.map(file => {
      const filename = Date.now() + path.extname(file.originalname);
      const filepath = path.join(__dirname, '../uploads', filename);

      fs.writeFileSync(filepath, file.buffer); // Save the file to the filesystem

      return {
        filename,
        contentType: file.mimetype
      };
    });

    const newActivity = new Activity({ name, place, price, images, termComdtion, description, type });
    const savedActivity = await newActivity.save();
    
    return next(createSuccess(200, "Activity Added Successfully"));

  } catch (error) {
    console.error(error);
    // res.status(500).json({ error: 'Internal server error' });
    return next(createError(500, "Something went wrong"))
  }
};

// get all activity
exports.getAllActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find();
    const userWithImageURLs = activities.map(user => {
      const imagesWithURLs = user.images.map(image => {
        return {
          ...image._doc,
          url: `${req.protocol}://${req.get('host')}/api/activityRoute/images/${image.filename}`
        };
      });

      return {
        ...user._doc,
        images: imagesWithURLs
      };
    });
    return next(createSuccess(200, "All Activities", userWithImageURLs));

  } catch (error) {
    return next(createError(500, "Internal Server Error!"))
  }
};

// get by type
exports.getOneActivity = async (req, res, next) => {
  try {
    const { type } = req.body;
    const activities = await Activity.find({ type });

    if (!activities || activities.length === 0) {
      return next(createError(404, "No Activities found!"));
    }

    const activitiesWithImageURLs = activities.map(activity => {
      const imagesWithURLs = activity.images.map(image => ({
        ...image._doc,
        url: `${req.protocol}://${req.get('host')}/api/activityRoute/one/images/${image.filename}`
      }));

      return {
        ...activity._doc,
        images: imagesWithURLs
      };
    });

    return next(createSuccess(200, "Activities found", activitiesWithImageURLs));
  } catch (error) {
    console.error(error);
    return next(createError(500, "Internal Server Error!"));
  }
};

//get activity by id
exports.getByIdActivity = async (req, res, next) => {
  try {
    const activityId = req.params.id;
    const activity = await Activity.findById(activityId);

    if (!activity) {
      return next(createError(404, "Activity not found!"));
    }

    const imagesWithURLs = activity.images.map(image => {
      return {
        ...image._doc,
        url: `${req.protocol}://${req.get('host')}/api/activityRoute/images/${image.filename}`
      };
    });

    const userWithImageURLs = {
      ...activity._doc,
      images: imagesWithURLs
    };

    return next(createSuccess(200, "Activity found", userWithImageURLs));
  } catch (error) {
    return next(createError(500, "Internal Server Error!"));
  }
};

// Delete activity by ID
exports.deleteActivityById = async (req, res, next) => {
  const activityId = req.params.id;
  try {
    const deletedActivity = await Activity.findByIdAndDelete(activityId);
    if (!deletedActivity) {
      return next(createError(404, "Activity not found"));
    }

    return next(createSuccess(200, "Activity deleted successfully"));
  } catch (err) {
    console.error(err);
    return next(createError(500, "Internal Server Error!"));
  }
};

// Update activity by ID
exports.updateActivityById = async (req, res, next) => {
  try {
    const activityId = req.params.id;
    const { name, place, price, termComdtion, description, type } = req.body;
    // Find the user by ID
    const updatedActivity = await Activity.findById(activityId);
    if (!updatedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    // Handle file uploads
    let images = updatedActivity.images; // Retain existing images if no new files uploaded
    if (req.files && req.files.length > 0) {
      // Delete old images from the file system
      images.forEach(image => {
        const filepath = path.join(__dirname, '../uploads', image.filename);
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      });
      // Save new files
      images = req.files.map(file => {
        const filename = Date.now() + path.extname(file.originalname);
        const filepath = path.join(__dirname, '../uploads', filename);
        fs.writeFileSync(filepath, file.buffer); // Save the file to the filesystem
        return {
          filename,
          contentType: file.mimetype
        };
      });
    }
    // Update activity details
    updatedActivity.name = name || updatedActivity.name;
    updatedActivity.place = place || updatedActivity.place;
    updatedActivity.price = price || updatedActivity.price;
    updatedActivity.termComdtion = termComdtion || updatedActivity.termComdtion;
    updatedActivity.description = description || updatedActivity.description;
    updatedActivity.type = type || updatedActivity.type;
    updatedActivity.images = images;
    // Save updated activity
    await updatedActivity.save();
    return next(createSuccess(200, "Activity updated successfully", updatedActivity));
  } catch (error) {
    return next(createError(500, "Internal Server Error!"));
  }
};

// imgaes
exports.getImage = (req, res) => {
  const filepath = path.join(__dirname, '../uploads', req.params.filename);
  fs.readFile(filepath, (err, data) => {
    if (err) {
      return res.status(404).json({ message: 'Image not found' });
    }
    const image = data;
    const mimeType = req.params.filename.split('.').pop();
    res.setHeader('Content-Type', `image/${mimeType}`);
    res.send(image);
  });
};
