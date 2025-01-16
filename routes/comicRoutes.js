const express = require('express');
const router = express.Router();
const comicController = require('../controllers/comicController');
router.post('/upload-comic-cover/:comic_id', comicController.upload.single('cover_image'), comicController.uploadComicCover);
router.post('/update-comic-cover/:comic_id', comicController.upload.single('cover_image'), comicController.updateComicCover);
router.post('/delete-comic-cover/:comic_id', comicController.deleteComicCover);

const addComicController = require('../controllers/addComic'); // Import the addComic controller
const editComicController = require('../controllers/editComic'); // Import the addComic controller

// Route to display the "Add Comic" form
router.get('/add', addComicController.showAddComicForm);
router.get('/edit/:comic_id', editComicController.showEditComicForm);
// Route to handle the form submission
router.post('/add', addComicController.addComic);
router.post('/edit/:comic_id', editComicController.editComic);
router.post('/deleteComic/:comic_id', comicController.deleteComic);

module.exports = router;