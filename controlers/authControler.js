const jwt = require('jsonwebtoken');
const { catchAsync }=require('../helpers/catchAsync');
const User=require("../models/usersModel")

// Sign jwt helper function
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

const signup = catchAsync(async (req, res) => {
    const newUserData = {
      ...req.body,
    };
  
    const newUser = await User.create(newUserData);
  
    newUser.password = undefined;
  
    const token = signToken(newUser.id);
  
    res.status(201).json({
      user: newUser,
      token,
    });
  });

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email }).select('+password');
  
    if (!user) {
        res.status(401).json({
            message: "Email or password is wrong",
          });
          return;
    };
  
    const passwordIsValid = await user.checkPassword(password, user.password);
  
    if (!passwordIsValid){
        res.status(401).json({
            message: "Email or password is wrong",
          });
          return;
    } 
  
    user.password = undefined;
  
    const token = signToken(user.id);
  
    res.status(200).json({
      user,
      token,
    });
  });

  const logout = catchAsync(async (req, res) => {
  
    res.status(204).json({
      message: "No content",
    });
  });
const getCurrentUser= catchAsync(async (req, res) => {
    req.user.password=""
    res.status(200).json({
      user: req.user,
    });
  });

  module.exports={
    signup,
    login,
    logout,
    getCurrentUser
  }