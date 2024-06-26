const User = require('../models/userModel');
const Role = require('../models/roleModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');
const path = require('path');
const fs = require('fs');


//to Create user 
exports.createUser = async (req, res, next) => {    
    try {
        const role = await Role.find({ role: 'User' });
        const { name, mobile, email, password, place, zipCode, deviceToken, roles } = req.body;

        if (!req.files || req.files.length === 0) {
            console.error("No files uploaded");
            return next(createError(400, "No files uploaded"));
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
        
        const newUser = new User({ name, mobile, email, password, place, zipCode, images, deviceToken });
        const savedUsers = await newUser.save();

        return next(createSuccess(200, "User Registered Successfully"));
    }
    catch (error) {
        return next(createError(500, "Something went wrong"))
    }
};

//get all users
exports.getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await User.find();
        const userWithImageURLs = allUsers.map(user => {
            const imagesWithURLs = user.images.map(image => {
                return {
                    ...image._doc,
                    url: `${req.protocol}://${req.get('host')}/api/user/images/${image.filename}`
                };
            });

            return {
                ...user._doc,
                images: imagesWithURLs
            };
        });

        return next(createSuccess(200, "All Users", userWithImageURLs));

    } catch (error) {
        return next(createError(500, "Internal Server Error!"))
    }
};

//get user by id
exports.getUserById = async (req, res, next) => {
    try {
        const userById = req.params.id;
        const users = await User.findById(userById);

        if (!users) {
            return next(createError(404, "User Not Found"));
        };

        const imagesWithURLs = users.images.map(image => {
            return {
                ...image._doc,
                url: `${req.protocol}://${req.get('host')}/api/user/images/${image.filename}`
            };
        });

        const userWithImageURLs = {
            ...users._doc,
            images: imagesWithURLs
        };

        return next(createSuccess(200, "User found", userWithImageURLs));
    } catch (error) {
        return next(createError(500, "Internal Server Error!"))
    }
};

//delete user
exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return next(createError(404, "User Not Found"));
        }
        return next(createSuccess(200, "User Deleted", user));
    } catch (error) {
        return next(createError(500, "Internal Server Error"))
    }
};

//update user
exports.updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { name, mobile, email, password, place, zipCode, deviceToken, roles } = req.body;
        // find user by id
        const updateUser = await User.findById(userId);
        if (!updateUser) {
            return next(createError(404, "User Not Found"));
        }
        // Handle file uploads
        let images = updateUser.images; // Retain existing images if no new files uploaded
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
            });        }
        // update user details
        updateUser.name = name || updateUser.name;
        updateUser.mobile = mobile || updateUser.mobile;
        updateUser.email = email || updateUser.email;
        updateUser.password = password || updateUser.password;
        updateUser.place = place || updateUser.place;
        updateUser.zipCode = zipCode || updateUser.zipCode;
        updateUser.deviceToken = deviceToken || updateUser.deviceToken;
        updateUser.roles = roles || updateUser.roles;
        updateUser.images = images;
        // save updated user
        await updateUser.save();
        return next(createSuccess(200, "User Details Updated successfully", updateUser));
    } catch (error) {
        return next(createError(500, "Internal Server Error!"));
    }
};

// images
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


