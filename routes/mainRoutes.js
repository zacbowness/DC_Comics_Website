const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainControllers');
let user_name = "spideyfan67";
// Route to initial page
router.get('/', mainController.getMain);

// Route to handle the form submission and add grade to the comic
router.get('/results', mainController.getResults);

router.post('/search', mainController.search);

router.post('/set_user', mainController.setUser);


module.exports = router;