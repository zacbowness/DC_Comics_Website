const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/set-user', userController.getUserForm);
router.post('/set-user', userController.setUser);

module.exports = router;
