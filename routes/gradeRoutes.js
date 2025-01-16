const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');

// Route to show the add grade page
router.get('/setup-add-grade/:comic_id', gradeController.getAddGradeForm);
router.get('/edit-grade/:comic_id', gradeController.getEditGradeForm);


// Route to handle the form submission and add grade to the comic
router.post('/add-grade', gradeController.addGrade);
router.post('/edit-grade', gradeController.editGrade);


module.exports = router;