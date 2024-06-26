const User = require('../models/userModel');
const Role = require('../models/roleModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const UserToken = require('../models/userTokenModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');


//signup
const signup = async (req, res, next) => {
  try {
    const { name, mobile, email, password, role } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Find the specified role or default to 'User'
    const roleDocument = await Role.findOne({ role: role || 'User' });
    if (!roleDocument) {
      return res.status(400).json({ message: "Role not found" });
    }

    // Create new user without password hashing
    const newUser = new User({
      name,
      mobile,
      email,
      password,  // Store the plain text password
      roles: [roleDocument._id]
    });

    // Save the new user to the database
    await newUser.save();

    // Send success response
    return next(createSuccess(200, "User registered successfully"));
  } catch (error) {
    // Send error response
    return next(createError(500, "Internal Server Error"));
  }
};

//to login
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).populate("roles", "role");

    if (!user) {
      return next(createError(404, "User Not Found"));
    }

    if (user.password !== password) {
      return next(createError(400, "Invalid password"));
    }

    const token = jwt.sign(
      { id: user._id, roles: user.roles.map(role => role.role) },
      process.env.JWT_SECRET
    );


    res.cookie("token", token, { httpOnly: true })
      .status(200)
      .json({
        token,
        status: 200,
        message: "Login Success",
        data: user
      });
    user.deviceToken = req.body.deviceToken;
    await user.save();

  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

//Register Admin
const registerAdmin = async (req, res, next) => {
  try {
    const role = await Role.find({});
    const newUser = new User({
      name: req.body.name,
      mobile: req.body.mobile,
      email: req.body.email,
      password: req.body.password,
      isAdmin: true,
      roles: role
    })
    await newUser.save();
    return next(createSuccess(200, "Admin Registered Successfully"))
  }
  catch (error) {
    return next(createError(500, "Something went wrong"))
  }
};

//sendresetmail
const sendEmail = async (req, res, next) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email: { $regex: '^' + email + '$', $options: 'i' } });

    if (!user) {
      return next(createError(404, "User Not found"))
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otp = otp;
    user.otpExpiration = Date.now() + 15 * 60 * 1000;
    await user.save();

    const ResetPasswordLink = `http://localhost:3000/reset-password?token=${otp}`;

    const mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailDetails = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p><p>This OTP is valid for 15 minutes.</p>
      <p><a href="${ResetPasswordLink}" style="padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a></p>`
    };

    await mailTransporter.sendMail(mailDetails);
    res.status(200).json({ message: "OTP sent to your email" });
  }
  catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }

};

// verify otp
const verifyOTP = async (req, res, next) => {
  const { otp } = req.body;
  try {
    const user = await User.findOne({ otp, otpExpiration: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.status(200).json({ message: "OTP verified successfully", token });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Reset Password
const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {
    // Decode the token to get the user's email
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decodedToken.email;

    // Find the user by their email
    const user = await User.findOne({ email: userEmail });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's password with the new password directly (without hashing)
    user.password = newPassword;

    // Save the updated user object
    await user.save();

    // Respond with success message
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// logout
const logout = async (req, res, next) => {
  try {
    const accessToken = req.cookies.access_token;
    const decodedToken = jwt.decode(accessToken);
    const userId = decodedToken ? decodedToken.id : null;
    res.clearCookie("access_token");
    const updateResult = await User.updateOne({ _id: userId }, { $set: { deviceToken: null } });
    return next(createSuccess(200, "Logout successful"));
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = { signup, registerAdmin, login, sendEmail, verifyOTP, resetPassword, logout }