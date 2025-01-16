const db = require('../db/db');

exports.getAddGradeForm = (req, res) => {
  const comic_id = req.params.comic_id;
  db.all('SELECT grade_company, grade_company_title FROM Grade_Company', (err, gradeCompanies) => {
    if (err) return res.status(500).send('Error fetching grade companies');
    res.render('add-grade', { comic_id, gradeCompanies });
  });
};

exports.addGrade = (req, res) => {
  const { comic_id, company, number, grade_description, colour } = req.body;
  const grading_id = `${company}-${comic_id}-${Date.now()}`;
  const sql = 'INSERT INTO Grade (grading_id, company, number, grade_description, comic_id, colour) VALUES (?, ?, ?, ?, ?, ?)';
  db.run(sql, [grading_id, company, number, grade_description, comic_id, colour], function (err) {
    if (err) return res.status(500).send('Error adding grade.');
    res.redirect('/');
  });
};

// Route to get the comic and grade information for editing
exports.getEditGradeForm = (req, res) => {
  const comic_id = req.params.comic_id;

  // 1. Fetch comic book information (for title, etc.)
  const comicQuery = 'SELECT * FROM Comic_book WHERE comic_id = ?';
  db.get(comicQuery, [comic_id], (err, comic) => {
      if (err || !comic) {
          return res.status(404).send('Comic not found.');
      }

      // 2. Fetch grade information for this comic
      const gradeQuery = 'SELECT * FROM Grade WHERE comic_id = ?';
      db.get(gradeQuery, [comic_id], (err, grade) => {
          if (err || !grade) {
              return res.status(404).send('Grade not found.');
          }

          // 3. Fetch all available grade companies
          const gradeCompaniesQuery = 'SELECT * FROM Grade_Company';
          db.all(gradeCompaniesQuery, (err, gradeCompanies) => {
              if (err) {
                  return res.status(500).send('Error fetching grade companies.');
              }

              // Render the edit grade page with the required data
              res.render('edit-grade', {
                  comic_id: comic_id,
                  comic: comic,
                  grade: grade,
                  gradeCompanies: gradeCompanies
              });
          });
      });
  });
};

exports.editGrade = (req, res) => {
  const { comic_id, grading_id, company, number, grade_description, colour } = req.body;

  // Validate input (basic validation)
  if (!comic_id || !grading_id || !company || !number || !grade_description || !colour) {
      return res.status(400).send('All fields are required.');
  }

  // SQL query to update the grade record for the given grading_id
  const updateQuery = `
      UPDATE Grade
      SET company = ?, number = ?, grade_description = ?, colour = ?
      WHERE grading_id = ?;
  `;

  db.run(updateQuery, [company, number, grade_description, colour, grading_id], function(err) {
      if (err) {
          console.error(err);
          return res.status(500).send('Error updating grade.');
      }

      // If successful, redirect to the comic's page (or a success page)
      res.redirect(`/my-lists`);  // Redirect to the comic's page after updating
  });
};