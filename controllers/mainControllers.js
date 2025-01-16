const db = require('../db/db');
exports.getMain = (req, res) => {
  res.render('search'); // Render search.ejs
};

exports.setUser = (req, res) => {
  res.render('search'); // Render search.ejs
  res.redirect('/');  // Redirect to the home page
};

// Handle search request and display results
exports.getResults= (req, res) => {
  const searchQuery = req.query.search || '';  // Get search parameter (e.g., 'Aaron')
  let str = searchQuery.toString();  // Trim any leading or trailing spaces
  let separator = ",";  // Change this to your desired separator
  
  // If searchQuery is empty, return an empty array or handle appropriately
  let likeQueries = str ? str.split(separator).map(item => `%${item.trim()}%`) : [];
  
  console.log(likeQueries);  // For debugging

    
  const sqlQuery = `
SELECT 
  cb.comic_id, 
  cb.title, 
  cb.comic_release_date, 
  cb.publisher,
  cb.creators_and_roles,
  s.series
FROM 
  (
    -- Query 1: Comic Book and Creators Information
    SELECT 
      cb.comic_id, 
      cb.title, 
      cb.comic_release_date, 
      cb.publisher,
      GROUP_CONCAT( cr.name || ' (' || c.role || ')', ' | ') AS creators_and_roles
    FROM 
      Comic_book cb
    JOIN 
      Contributes c ON cb.comic_id = c.comic_id
    JOIN 
      Creator cr ON c.create_id = cr.creator_id
    WHERE 
       cr.name LIKE ? AND cb.title LIKE ?
    GROUP BY 
      cb.comic_id, cb.title, cb.comic_release_date, cb.publisher
  ) cb
Inner JOIN 
  (
    -- Query 2: Series Information
    SELECT 
      cb.comic_id,
      GROUP_CONCAT( s.name, ' | ') AS series
    FROM 
      Comic_book cb
    JOIN 
      Belongs_to b ON b.comic_id = cb.comic_id
    JOIN 
      Series s ON s.series_id = b.series_id
    GROUP BY 
      cb.comic_id
  ) s
ON cb.comic_id = s.comic_id
ORDER BY 
  cb.title;
    `;


  db.all(sqlQuery, likeQueries, (err, comics) => {
    if (err) {
      throw err;
    }
    res.render('search-results', { comics, searchQuery, count: comics.length }); // Render search-results.ejs with data
  });
};

exports.search=(req, res) => {
  const searchQuery = req.body.search;  // Search term from the form
  const sql = `
    SELECT DISTINCT cb.comic_id, cb.title, cb.comic_release_date, cb.publisher, cr.name AS creator_name
    FROM Comic_book cb
     JOIN Contributes c ON cb.comic_id = c.comic_id
     JOIN Creator cr ON c.create_id = cr.creator_id
    WHERE cb.title LIKE ? OR cr.name LIKE ?
  `;
  
  db.all(sql, [`%${searchQuery}%`, `%${searchQuery}%`], (err, comics) => {
    if (err) return res.status(500).send('Error fetching search results');
    res.render('search-results', { comics, searchQuery, count: comics.length });
  });
};