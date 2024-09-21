const express = require('express')
const router = express.Router();
const userController = require('../controllers/users');

router.get('/',userController.get_users)
router.post('/signup',userController.sign_up)
router.post('/signin',userController.sign_in)

module.exports = router;