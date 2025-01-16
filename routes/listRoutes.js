const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');

// Route for displaying user's comic lists
router.get('/my-lists', listController.getUserLists);

// Route for displaying user's comic list - by List Id
router.get('/list/:list_id', listController.getListComics);

// Route for displaying user's comic lists
router.post('/add-to-list', listController.addComicToList);

// Route for displaying user's comic lists
router.post('/remove', listController.deleteComicFromList);


// Additional routes for adding/removing comics from lists can be added here

module.exports = router;
