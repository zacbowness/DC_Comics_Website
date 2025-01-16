const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const db = require('./db/db'); // Assuming you are using SQLite and db.js is correctly set up

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Session Middleware (Only one instance)
app.use(session({
  secret: 'your-secret-key',    // Secret key for session signing
  resave: false,                // Don't save session if it hasn't been modified
  saveUninitialized: true,      // Save uninitialized sessions
  cookie: { secure: false }     // For local development, set `secure: false`
}));

// Route to set user_name in session
app.get('/set-session', (req, res) => {
  const user_name = 'spideyfan67'; // Example user name
  req.session.user_name = user_name; // Store in session
  res.send(`User name set to: ${user_name}`);
});

// Route to get user_name from session
app.get('/get-session', (req, res) => {
  if (req.session.user_name) {
    res.send(`The current user is: ${req.session.user_name}`);
  } else {
    res.send('No user name found in session');
  }
});

// Route to display the form to set the user_name
app.get('/set-username', (req, res) => {
  res.render('set-username'); // Render the form view (ensure you have a set-username.ejs file)
});

// Route to handle form submission and set user_name in session
app.post('/set-username', (req, res) => {
  const { user_name } = req.body;  // Get user_name from form data
  req.session.user_name = user_name;  // Set the user_name in the session
  res.render('search'); // Assuming 'search' is a view you want to render after setting the session
});

// Route to display the user_name from session
app.get('/get-username', (req, res) => {
  if (req.session.user_name) {
    res.send(`User name from session: ${req.session.user_name}`);
  } else {
    res.send('No user name found in session');
  }
});

// Route to display the form to add a user
app.get('/add-user', (req, res) => {
  res.render('add-user');  // Ensure you have an 'add-user.ejs' view file
});

// Route to handle form submission and add a user to the database
app.post('/add-user', (req, res) => {
  const { user_name, password, email, first_name, last_name, DOB } = req.body;

  // Ensure that user_name and other fields are properly validated before insertion
  const stmt = db.prepare(`
    INSERT INTO User (user_name, password, email, first_name, last_name, DOB) 
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(user_name, password, email, first_name, last_name, DOB, function (err) {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).send('Error adding user to the database.');
    }
    
    // Send a success response
    res.render('search', { user: { user_name, email, first_name, last_name, DOB } });
  });

  stmt.finalize();  // Finalize the statement
});

// Route to display all users from the database (for demonstration)
app.get('/users', (req, res) => {
  db.all("SELECT * FROM User", [], (err, rows) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).send('Error fetching users.');
    }
    res.render('users', { users: rows });
  });
});

// Static route for serving uploaded files (ensure you have the 'uploads' folder)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import route files (assuming they are modularized into separate files)
const comicRoutes = require('./routes/comicRoutes');
const userRoutes = require('./routes/userRoutes');
const listRoutes = require('./routes/listRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const mainRoutes = require('./routes/mainRoutes');

// Use the route files in the app
app.use(comicRoutes);
app.use(userRoutes);
app.use(listRoutes);
app.use(gradeRoutes);
app.use(mainRoutes);
app.use('/comics', comicRoutes);

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
