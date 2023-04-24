const User = require("../models/usersModel");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { catchAsync } = require("../helpers/catchAsync");

const signupUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
/**
 * Check signup user data.
 */

const checkSignupData = catchAsync(async (req, res, next) => {
  const { error, value } = signupUserSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  const { email } = value;

  const userExists = await User.exists({ email });

  if (userExists) {
    return res.status(409).json({ message: "Email in Use" });
  }

  req.body = value;

  next();
});

/**
 * Middleware to allow only login users.
 */
const protect = catchAsync(async (req, res, next) => {
  // Extract token from authorization header
  const token =
    req.headers.authorization?.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  // Use async version of token verification
  const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

  // Find user by id decoded from token
  const currentUser = await User.findById(decodedToken.id);

  if (!currentUser) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  req.user = currentUser;

  next();
});

module.exports = {
  checkSignupData,
  protect,
};
