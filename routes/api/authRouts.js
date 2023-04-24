const express = require('express');

const authController = require('../../controlers/authControler');
const authMiddleware = require('../../middlewares/authMiddlewares');


const router = express.Router();

router.post('/register', authMiddleware.checkSignupData, authController.signup);
router.post('/login', authController.login);
router.post('/logout',authMiddleware.protect, authController.logout);
router.post('/current',authMiddleware.protect, authController.getCurrentUser);

module.exports = router;