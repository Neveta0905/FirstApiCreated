const express = require('express')
const router = express.Router();

const userCtrl = require('../controllers/userCtrl')

router.post('/signup',userCtrl.signup) // Sign In
router.post('/login',userCtrl.login) // Log In

module.exports = router