const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create and export the database connection
const db = new sqlite3.Database(path.join(__dirname, './ComicStore.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Fetch comic by ID
db.getComicById = function(comic_id) {
  return new Promise((resolve, reject) => {
  const sql = `SELECT * FROM Comic_book WHERE comic_id = ?`;
    this.get(sql, [comic_id], (err, row) => {
        if (err) {
            reject("Error fetching comic by ID:", err); // Reject promise on error
        } else {
          resolve(row);
        }
    });
  });
};

db.getCreators = function() {
  return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM Creator";
      this.all(sql, [], (err, rows) => {
          if (err) {
              reject("Error fetching creators: " + err.message); // Reject promise on error
          } else {
              resolve(rows); // Resolve promise with the rows (data)
          }
      });
  });
};

db.getSeries = function() {
  return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM Series";
      this.all(sql, [], (err, rows) => {
          if (err) {
              reject("Error fetching series: " + err.message); // Reject promise on error
          } else {
              resolve(rows); // Resolve promise with the rows (data)
          }
      });
  });
};

db.getRoles = function() {
  return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM Role";
      this.all(sql, [], (err, rows) => {
          if (err) {
              reject("Error fetching roles: " + err.message); // Reject promise on error
          } else {
              resolve(rows); // Resolve promise with the rows (data)
          }
      });
  });
};

module.exports = db;